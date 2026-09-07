import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, Calendar, Music } from 'lucide-react'
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

        <h1 className="text-3xl font-bold text-navy mb-3">Booking Confirmed!</h1>
        <p className="text-navy/65 text-lg mb-6">
          Your mentorship session has been successfully booked. Check your email for confirmation details.
        </p>

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

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="rounded-xl border border-navy/10 bg-white p-4 text-center">
            <Calendar className="h-8 w-8 text-gold mx-auto mb-2" />
            <p className="text-sm font-medium text-navy">Check your email</p>
            <p className="text-xs text-navy/50">Session details sent</p>
          </div>
          <div className="rounded-xl border border-navy/10 bg-white p-4 text-center">
            <Music className="h-8 w-8 text-gold mx-auto mb-2" />
            <p className="text-sm font-medium text-navy">Mentor will reach out</p>
            <p className="text-xs text-navy/50">Within 24 hours</p>
          </div>
        </div>

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
