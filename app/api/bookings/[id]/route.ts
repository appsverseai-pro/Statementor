import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'

const updateSchema = z.object({
  booking_status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).optional(),
  payment_status: z.enum(['unpaid', 'paid']).optional(),
  stripe_session_id: z.string().optional(),
})

// Internal webhook calls provide a shared secret header to bypass cookie auth
function isAuthorizedPatch(request: NextRequest, cookieStore: Awaited<ReturnType<typeof cookies>>): boolean {
  const internalSecret = process.env.INTERNAL_API_SECRET
  const headerSecret = request.headers.get('x-internal-secret')
  if (internalSecret && headerSecret === internalSecret) return true
  return cookieStore.get('admin_session')?.value === 'authenticated'
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies()
    if (!isAuthorizedPatch(request, cookieStore)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const data = updateSchema.parse(body)

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl === 'your_supabase_url') {
      return NextResponse.json({ success: true })
    }

    const { createServiceClient } = await import('@/lib/supabase/server')
    const supabase = await createServiceClient()

    const { error } = await supabase.from('bookings').update(data).eq('id', id)

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }
    console.error('PATCH /api/bookings/[id] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl === 'your_supabase_url') {
      return NextResponse.json({ id, booking_status: 'confirmed', payment_status: 'paid', mentor_id: 'mock' })
    }

    const { createServiceClient } = await import('@/lib/supabase/server')
    const supabase = await createServiceClient()

    const { data, error } = await supabase
      .from('bookings')
      .select('id, booking_status, payment_status, mentor_id, session_date, session_length, student_instrument')
      .eq('id', id)
      .single()

    if (error) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })

    return NextResponse.json(data)
  } catch (err) {
    console.error('GET /api/bookings/[id] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
