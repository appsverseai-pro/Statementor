import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

const bookingSchema = z.object({
  mentorId: z.string().min(1),
  studentName: z.string().min(2),
  studentEmail: z.string().email(),
  studentInstrument: z.string().min(1),
  sessionGoals: z.string().optional(),
  sessionLength: z.number().int().positive(),
  sessionDate: z.string().datetime(),
})

export async function POST(request: NextRequest) {
  // Rate limit: 10 booking submissions per IP per minute
  const ip = getClientIp(request)
  const { allowed } = rateLimit(ip, 10, 60_000)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests. Please wait before submitting again.' }, { status: 429 })
  }

  try {
    const body = await request.json()
    const data = bookingSchema.parse(body)

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl === 'your_supabase_url') {
      // Return a mock booking ID for development
      const mockId = `mock-${Date.now()}`
      return NextResponse.json({ bookingId: mockId }, { status: 201 })
    }

    const { createServiceClient } = await import('@/lib/supabase/server')
    const supabase = await createServiceClient()

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        mentor_id: data.mentorId,
        student_name: data.studentName,
        student_email: data.studentEmail,
        student_instrument: data.studentInstrument,
        session_goals: data.sessionGoals,
        session_length: data.sessionLength,
        session_date: data.sessionDate,
        booking_status: 'pending',
        payment_status: 'unpaid',
      })
      .select('id')
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
    }

    return NextResponse.json({ bookingId: booking.id }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: String(err) },
        { status: 400 }
      )
    }
    console.error('POST /api/bookings error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Only admins may list all bookings
    const cookieStore = await cookies()
    if (cookieStore.get('admin_session')?.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl === 'your_supabase_url') {
      return NextResponse.json([])
    }

    const { createServiceClient } = await import('@/lib/supabase/server')
    const supabase = await createServiceClient()

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (err) {
    console.error('GET /api/bookings error:', err)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}
