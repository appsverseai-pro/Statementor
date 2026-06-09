import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getMentorById } from '@/lib/google-sheets'
import { formatCurrency } from '@/lib/utils'
import BookingForm from '@/components/booking/BookingForm'
import Badge from '@/components/ui/Badge'
import { Award, MapPin } from 'lucide-react'

interface PageProps {
  params: Promise<{ mentorId: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { mentorId } = await params
  const mentor = await getMentorById(mentorId)
  if (!mentor) return { title: 'Book a Session' }
  return {
    title: `Book a Session with ${mentor.name}`,
    description: `Book a ${mentor.instrument} mentorship session with ${mentor.name}, an All-State musician.`,
  }
}

export default async function BookingPage({ params }: PageProps) {
  const { mentorId } = await params
  const mentor = await getMentorById(mentorId)

  if (!mentor) notFound()

  const initials = mentor.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()

  return (
    <main className="py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-navy/50">
          <Link href="/mentors" className="hover:text-navy transition-colors">Mentors</Link>
          <span className="mx-2">/</span>
          <Link href={`/mentors/${mentor.id}`} className="hover:text-navy transition-colors">
            {mentor.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-navy">Book Session</span>
        </nav>

        <h1 className="text-2xl font-bold text-navy mb-6">Book a Session</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Booking form */}
          <div className="lg:col-span-3">
            <BookingForm mentor={mentor} />
          </div>

          {/* Mentor summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-2xl border border-navy/10 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                {mentor.profilePhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mentor.profilePhoto}
                    alt={mentor.name}
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-gold/30"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-cream text-xl font-bold ring-2 ring-gold/30">
                    {initials}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-navy">{mentor.name}</h3>
                  <p className="text-gold font-medium text-sm">{mentor.instrument}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-sm text-navy/60 mb-3">
                <MapPin className="h-3.5 w-3.5" />
                {mentor.school}
              </div>

              <Badge variant="gold" className="mb-3">
                <Award className="h-3 w-3 mr-1" />
                {mentor.yearsInAllState}x All-State
              </Badge>

              <p className="text-sm text-navy/65 leading-relaxed mb-4">{mentor.bio}</p>

              <div className="border-t border-navy/10 pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-navy/60">Starting at</span>
                  <span className="font-bold text-navy">
                    {formatCurrency(mentor.sessionPrice / 2)} / 30 min
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
