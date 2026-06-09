import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const checkoutSchema = z.object({
  bookingId: z.string().min(1),
  mentorName: z.string().min(1),
  instrument: z.string().min(1),
  sessionLength: z.number().int().positive(),
  price: z.number().positive(),
  studentEmail: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = checkoutSchema.parse(body)

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const stripeKey = process.env.STRIPE_SECRET_KEY

    if (!stripeKey || stripeKey === 'your_stripe_secret_key') {
      // In development without Stripe, redirect to confirmation directly
      return NextResponse.json({
        url: `${appUrl}/confirmation?bookingId=${data.bookingId}&mock=true`,
      })
    }

    const { stripe } = await import('@/lib/stripe')

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: data.studentEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(data.price * 100),
            product_data: {
              name: `${data.sessionLength}-Minute Mentorship Session`,
              description: `With ${data.mentorName} • ${data.instrument}`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/confirmation?bookingId=${data.bookingId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/book/${data.bookingId}`,
      metadata: {
        bookingId: data.bookingId,
      },
    })

    // Update booking with stripe session id
    await fetch(`${appUrl}/api/bookings/${data.bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stripe_session_id: session.id }),
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: String(err) }, { status: 400 })
    }
    console.error('POST /api/stripe/checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
