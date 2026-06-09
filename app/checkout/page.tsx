import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Checkout',
}

export default function CheckoutPage() {
  return (
    <main className="py-16">
      <div className="mx-auto max-w-lg px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy/10 mx-auto mb-4">
          <ShieldCheck className="h-8 w-8 text-navy" />
        </div>
        <h1 className="text-2xl font-bold text-navy mb-2">Redirecting to payment...</h1>
        <p className="text-navy/60 mb-8">
          You will be redirected to our secure Stripe checkout. If you are not redirected, please go back and try again.
        </p>
        <Link
          href="/mentors"
          className="inline-flex items-center gap-2 text-gold font-medium hover:text-gold-light transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to mentors
        </Link>
      </div>
    </main>
  )
}
