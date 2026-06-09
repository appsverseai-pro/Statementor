import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getActiveMentors } from '@/lib/google-sheets'
import MentorGrid from '@/components/mentors/MentorGrid'
import MentorFilters from '@/components/mentors/MentorFilters'
import type { Mentor } from '@/lib/google-sheets'

export const metadata: Metadata = {
  title: 'Browse Mentors',
  description: 'Browse All-State music mentors. Find personalized coaching for violin, trumpet, flute, voice, and more.',
}

function sortMentors(mentors: Mentor[], sort: string): Mentor[] {
  switch (sort) {
    case 'price-asc':
      return [...mentors].sort((a, b) => a.sessionPrice - b.sessionPrice)
    case 'price-desc':
      return [...mentors].sort((a, b) => b.sessionPrice - a.sessionPrice)
    case 'experience':
      return [...mentors].sort((a, b) => b.yearsInAllState - a.yearsInAllState)
    default:
      return mentors
  }
}

interface PageProps {
  searchParams: Promise<{ sort?: string }>
}

export default async function MentorsPage({ searchParams }: PageProps) {
  const { sort = 'rating' } = await searchParams
  const mentors = await getActiveMentors()
  const sorted = sortMentors(mentors, sort)

  return (
    <main className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy sm:text-4xl">All Mentors</h1>
          <p className="mt-2 text-navy/60">
            Browse our All-State musician mentors across all instruments
          </p>
        </div>

        <Suspense fallback={null}>
          <MentorFilters totalCount={sorted.length} />
        </Suspense>

        <MentorGrid mentors={sorted} />
      </div>
    </main>
  )
}
