import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret || webhookSecret === 'your_webhook_secret') {
    console.error('STRIPE_WEBHOOK_SECRET is not configured — rejecting webhook')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  const { stripe } = await import('@/lib/stripe')
  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const bookingId = session.metadata?.bookingId

    if (bookingId) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

      // Update booking payment status (use internal secret to authorize server-to-server call)
      await fetch(`${appUrl}/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-secret': process.env.INTERNAL_API_SECRET ?? '',
        },
        body: JSON.stringify({
          payment_status: 'paid',
          booking_status: 'confirmed',
        }),
      })

      // Fetch booking details to send email
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        if (supabaseUrl && supabaseUrl !== 'your_supabase_url') {
          const { createServiceClient } = await import('@/lib/supabase/server')
          const supabase = await createServiceClient()

          const { data: booking } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .single()

          if (booking) {
            const { getMentorById } = await import('@/lib/google-sheets')
            const mentor = await getMentorById(booking.mentor_id)

            if (mentor) {
              const { sendBookingConfirmation, sendMentorNotification } = await import('@/lib/resend')

              await sendBookingConfirmation({
                studentEmail: booking.student_email,
                studentName: booking.student_name,
                mentorName: mentor.name,
                instrument: booking.student_instrument,
                sessionDate: booking.session_date,
                sessionLength: booking.session_length,
                sessionGoals: booking.session_goals,
              })

              await sendMentorNotification({
                mentorEmail: mentor.email,
                mentorName: mentor.name,
                studentName: booking.student_name,
                studentInstrument: booking.student_instrument,
                sessionDate: booking.session_date,
                sessionLength: booking.session_length,
                sessionGoals: booking.session_goals,
              })
            }
          }
        }
      } catch (emailErr) {
        console.error('Failed to send emails after payment:', emailErr)
      }
    }
  }

  return NextResponse.json({ received: true })
}
