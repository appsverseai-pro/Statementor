import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Booking Confirmed',
}

interface PageProps {
  searchParams: Promise<{ bookingId?: string; session_id?: string; mock?: string }>
}

export default async function ConfirmationPage({ searchParams }: PageProps) {
  const { bookingId, session_id, mock } = await searchParams

  return (
    <main className="py-16">
      <div className="mx-auto max-w-lg px-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-navy mb-3">Booking Request Received!</h1>
        <p className="text-navy/65 text-lg mb-6">
          Thanks for booking — we&apos;ve got your request.
        </p>

        <div className="rounded-2xl border-2 border-gold/40 bg-gold/10 p-6 mb-6 text-left">
          <p className="text-lg sm:text-xl font-bold text-navy mb-2">
            📬 What happens next
          </p>
          <p className="text-base text-navy/85 leading-relaxed">
            Our mentors are all <span className="font-semibold">high schoolers</span>, so
            we&apos;ll double-check their availability first. You&apos;ll hear back{' '}
            <span className="font-bold text-navy">within 24 hours</span>.
          </p>
          <p className="text-base text-navy/85 leading-relaxed mt-3">
            Once your session is confirmed, we&apos;ll send an{' '}
            <span className="font-bold text-navy">email invite to your inbox</span> with all
            the details. Please keep an eye out for it — and check your spam folder just in case! 🎶
          </p>
        </div>

        {(bookingId || session_id) && (
          <div className="rounded-xl border border-navy/10 bg-white p-4 mb-6 text-left">
            <p className="text-xs text-navy/50 mb-1">Booking Reference</p>
            <p className="font-mono text-sm text-navy font-medium">
              {session_id ?? bookingId ?? 'N/A'}
            </p>
            {mock && (
              <p className="text-xs text-gold mt-1">(Development mode)</p>
            )}
          </div>
        )}


        <div className="space-y-3">
          <Link href="/mentors">
            <Button size="lg" className="w-full">
              Browse More Mentors
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg" variant="outline" className="w-full">
              Return Home
            </Button>
          </Link>
        </div>

        {bookingId && !bookingId.startsWith('mock') && (
          <p className="mt-6 text-sm text-navy/50">
            Want to leave a review after your session?{' '}
            <Link href={`/review/${bookingId}`} className="text-gold hover:text-gold-light">
              Leave a review
            </Link>
          </p>
        )}
      </div>
    </main>
  )
}
