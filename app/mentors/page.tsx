import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getActiveMentors } from '@/lib/google-sheets'
import MentorsBrowser from '@/components/mentors/MentorsBrowser'

export const metadata: Metadata = {
  title: 'Browse Mentors',
  description: 'Browse All-State music mentors. Find personalized coaching for violin, trumpet, flute, voice, and more.',
}

// Render statically and refresh the mentor list in the background every 60s.
// This keeps the page instant to load (served from cache) instead of running a
// fresh database query and cold start on every click. Filtering/sorting runs in
// the browser, so the URL query no longer forces dynamic rendering.
export const revalidate = 60

export default async function MentorsPage() {
  const mentors = await getActiveMentors()
  const instruments = Array.from(new Set(mentors.map((m) => m.instrument))).sort((a, b) =>
    a.localeCompare(b)
  )

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
          <MentorsBrowser mentors={mentors} instruments={instruments} />
        </Suspense>
      </div>
    </main>
  )
}
