import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'

const moderateSchema = z.object({
  moderation_status: z.enum(['pending', 'approved', 'hidden', 'deleted']),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Only admins may moderate reviews
    const cookieStore = await cookies()
    if (cookieStore.get('admin_session')?.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const data = moderateSchema.parse(body)

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl === 'your_supabase_url') {
      return NextResponse.json({ success: true })
    }

    const { createServiceClient } = await import('@/lib/supabase/server')
    const supabase = await createServiceClient()

    const { error } = await supabase
      .from('reviews')
      .update({ moderation_status: data.moderation_status })
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: String(err) }, { status: 400 })
    }
    console.error('PATCH /api/reviews/[id] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
