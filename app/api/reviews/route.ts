import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const reviewSchema = z.object({
  mentorId: z.string().min(1),
  bookingId: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  reviewText: z.string().optional(),
  reviewerName: z.string().min(2),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = reviewSchema.parse(body)

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl === 'your_supabase_url') {
      return NextResponse.json({ reviewId: `mock-${Date.now()}` }, { status: 201 })
    }

    const { createServiceClient } = await import('@/lib/supabase/server')
    const supabase = await createServiceClient()

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
      return NextResponse.json({ error: String(err) }, { status: 400 })
    }
    console.error('POST /api/reviews error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mentorId = searchParams.get('mentorId')
    const status = searchParams.get('status') ?? 'approved'

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl === 'your_supabase_url') {
      return NextResponse.json([])
    }

    const { createServiceClient } = await import('@/lib/supabase/server')
    const supabase = await createServiceClient()

    let query = supabase.from('reviews').select('*').order('created_at', { ascending: false })

    if (mentorId) query = query.eq('mentor_id', mentorId)
    if (status !== 'all') query = query.eq('moderation_status', status)

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (err) {
    console.error('GET /api/reviews error:', err)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}
