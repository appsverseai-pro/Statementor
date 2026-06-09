import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getMentorById } from '@/lib/google-sheets'
import { formatCurrency } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import StarRating from '@/components/reviews/StarRating'
import ReviewCard from '@/components/reviews/ReviewCard'
import { MapPin, Clock, Calendar, Award, BookOpen } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const mentor = await getMentorById(id)
  if (!mentor) return { title: 'Mentor Not Found' }
  return {
    title: `${mentor.name} – ${mentor.instrument} Mentor`,
    description: mentor.bio,
  }
}

async function getMentorReviews(mentorId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/reviews?mentorId=${mentorId}&status=approved`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function MentorProfilePage({ params }: PageProps) {
  const { id } = await params
  const mentor = await getMentorById(id)

  if (!mentor) notFound()

  const reviews = await getMentorReviews(id)
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length
      : null

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
          <Link href="/mentors" className="hover:text-navy transition-colors">
            Mentors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-navy">{mentor.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left column: Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile header */}
            <div className="rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                {mentor.profilePhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mentor.profilePhoto}
                    alt={mentor.name}
                    className="h-24 w-24 rounded-full object-cover ring-2 ring-gold/30 flex-shrink-0"
                  />
                ) : (
                  <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-navy text-cream text-3xl font-bold ring-2 ring-gold/30">
                    {initials}
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-navy">{mentor.name}</h1>
                  <p className="text-gold font-semibold text-lg">{mentor.instrument}</p>
                  <div className="flex items-center gap-1.5 text-sm text-navy/60 mt-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {mentor.school}
                  </div>
                  {avgRating !== null && (
                    <div className="flex items-center gap-2 mt-2">
                      <StarRating rating={Math.round(avgRating)} size="sm" />
                      <span className="text-sm text-navy font-medium">
                        {avgRating.toFixed(1)}
                      </span>
                      <span className="text-xs text-navy/50">({reviews.length} reviews)</span>
                    </div>
                  )}
                </div>
              </div>

              <p className="mt-4 text-navy/70 leading-relaxed">{mentor.bio}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="gold">
                  <Award className="h-3 w-3 mr-1" />
                  {mentor.yearsInAllState}x All-State
                </Badge>
                {mentor.teachingAreas.split(',').map((area) => (
                  <Badge key={area} variant="default">
                    {area.trim()}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-bold text-navy mb-3">
                <Award className="h-5 w-5 text-gold" />
                Achievements
              </h2>
              <p className="text-navy/70 leading-relaxed">{mentor.achievements}</p>
            </div>

            {/* Teaching areas */}
            <div className="rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-bold text-navy mb-3">
                <BookOpen className="h-5 w-5 text-gold" />
                What I Teach
              </h2>
              <div className="flex flex-wrap gap-2">
                {mentor.teachingAreas.split(',').map((area) => (
                  <span
                    key={area}
                    className="rounded-full bg-navy/5 px-3 py-1.5 text-sm text-navy font-medium"
                  >
                    {area.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-xl font-bold text-navy mb-4">
                Reviews ({reviews.length})
              </h2>
              {reviews.length === 0 ? (
                <div className="rounded-xl border border-navy/10 bg-white p-8 text-center">
                  <p className="text-navy/50">No reviews yet. Be the first to book a session!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review: {
                    id: string
                    rating: number
                    review_text: string | null
                    reviewer_name: string
                    created_at: string
                  }) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right column: Booking card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-navy/10 bg-white p-6 shadow-md">
              <div className="text-center mb-5">
                <div className="text-3xl font-bold text-navy">
                  {formatCurrency(mentor.sessionPrice)}
                </div>
                <div className="text-sm text-navy/50">per hour</div>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-2 text-sm text-navy/70">
                  <Clock className="h-4 w-4 text-gold flex-shrink-0" />
                  <span>30 or 60 minute sessions</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-navy/70">
                  <Calendar className="h-4 w-4 text-gold flex-shrink-0" />
                  <span>Available: {mentor.availableDays.join(', ')}</span>
                </div>
              </div>

              <Link href={`/book/${mentor.id}`} className="block">
                <Button size="lg" className="w-full">
                  Book a Session
                </Button>
              </Link>

              <p className="mt-3 text-xs text-center text-navy/40">
                Secure payment via Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
