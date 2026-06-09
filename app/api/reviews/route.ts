import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

const reviewSchema = z.object({
  mentorId: z.string().min(1),
  bookingId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  reviewText: z.string().optional(),
  reviewerName: z.string().min(2),
})

export async function POST(request: NextRequest) {
  // Rate limit: 10 review submissions per IP per minute
  const ip = getClientIp(request)
  const { allowed } = rateLimit(ip, 10, 60_000)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests. Please wait before submitting again.' }, { status: 429 })
  }

  try {
    const body = await request.json()
    const data = reviewSchema.parse(body)

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl === 'your_supabase_url') {
      return NextResponse.json({ reviewId: `mock-${Date.now()}` }, { status: 201 })
    }

    const { createServiceClient } = await import('@/lib/supabase/server')
    const supabase = await createServiceClient()

    // Verify the booking exists and belongs to a completed/confirmed paid session before accepting the review
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('id, booking_status, payment_status, mentor_id')
      .eq('id', data.bookingId)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    if (booking.booking_status !== 'completed' && booking.booking_status !== 'confirmed') {
      return NextResponse.json(
        { error: 'Reviews can only be submitted for completed or confirmed bookings' },
        { status: 403 }
      )
    }

    if (booking.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Reviews can only be submitted for paid bookings' },
        { status: 403 }
      )
    }

    // Ensure the mentorId in the review matches the booking
    if (booking.mentor_id !== data.mentorId) {
      return NextResponse.json({ error: 'Mentor does not match booking' }, { status: 403 })
    }

    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        mentor_id: data.mentorId,
        booking_id: data.bookingId,
        rating: data.rating,
        review_text: data.reviewText,
        reviewer_name: data.reviewerName,
        moderation_status: 'pending',
      })
      .select('id')
      .single()

    if (error) {
      console.error('Supabase review insert error:', error)
      return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
    }

    return NextResponse.json({ reviewId: review.id }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }
    console.error('POST /api/reviews error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mentorId = searchParams.get('mentorId')

    // Determine if caller is an authenticated admin (needed to view non-approved reviews)
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const isAdmin = cookieStore.get('admin_session')?.value === 'authenticated'

    // Public callers always see only approved reviews; admins may request other statuses
    const requestedStatus = searchParams.get('status') ?? 'approved'
    const allowedStatuses = ['pending', 'approved', 'hidden', 'deleted']
    const status = isAdmin && allowedStatuses.includes(requestedStatus) ? requestedStatus : 'approved'

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl === 'your_supabase_url') {
      return NextResponse.json([])
    }

    const { createServiceClient } = await import('@/lib/supabase/server')
    const supabase = await createServiceClient()

    let query = supabase.from('reviews').select('*').order('created_at', { ascending: false })

    if (mentorId) query = query.eq('mentor_id', mentorId)
    query = query.eq('moderation_status', status)

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (err) {
    console.error('GET /api/reviews error:', err)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}
