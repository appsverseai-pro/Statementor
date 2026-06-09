import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

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
