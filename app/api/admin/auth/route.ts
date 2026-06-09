import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'

const loginSchema = z.object({
  password: z.string().min(1),
})

const ADMIN_TOKEN = 'admin_session'
const SESSION_VALUE = 'authenticated'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = loginSchema.parse(body)

    // Simple password check against env var
    const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123'

    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    const cookieStore = await cookies()
    cookieStore.set(ADMIN_TOKEN, SESSION_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
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
