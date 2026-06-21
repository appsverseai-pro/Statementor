import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { timingSafeEqual } from 'crypto'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

const loginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
})

const DEFAULT_ADMIN_EMAIL = 'appsverseai@gmail.com'
const DEFAULT_ADMIN_PASSWORD = 'Statementor!2026'

// Timing-safe string comparison to prevent timing attacks
function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a)
  const bBuf = Buffer.from(b)
  return aBuf.length === bBuf.length && timingSafeEqual(aBuf, bBuf)
}

const ADMIN_TOKEN = 'admin_session'
const SESSION_VALUE = 'authenticated'

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const { allowed } = rateLimit(`admin-login:${ip}`, 5, 60_000)
    if (!allowed) {
      return NextResponse.json({ error: 'Too many login attempts. Please try again in a minute.' }, { status: 429 })
    }

    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    const adminPassword = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD
    const adminEmail = process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL

    const emailMatches = safeEqual(email.trim().toLowerCase(), adminEmail.toLowerCase())
    const passwordMatches = safeEqual(password, adminPassword)

    if (!emailMatches || !passwordMatches) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const cookieStore = await cookies()
    cookieStore.set(ADMIN_TOKEN, SESSION_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    console.error('Admin auth error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_TOKEN)
  return NextResponse.json({ success: true })
}

export async function GET() {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_TOKEN)
  const authenticated = session?.value === SESSION_VALUE
  return NextResponse.json({ authenticated })
}
