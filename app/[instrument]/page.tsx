import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getMentorsByInstrument, getUniqueInstruments, type Mentor } from '@/lib/google-sheets'
import { slugify, slugToInstrument } from '@/lib/utils'
import MentorGrid from '@/components/mentors/MentorGrid'
import MentorFilters from '@/components/mentors/MentorFilters'

interface PageProps {
  params: Promise<{ instrument: string }>
  searchParams: Promise<{ sort?: string }>
}

// Resolve a URL slug back to the REAL instrument name by slugifying each known
// instrument and comparing — this round-trips any name (dashes, "All State",
// punctuation) instead of guessing from the slug. Returns null if unknown.
async function resolveInstrument(slug: string): Promise<string | null> {
  const all = await getUniqueInstruments()
  const match = all.find((i) => slugify(i.instrument) === slug)
  return match ? match.instrument : null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { instrument: slug } = await params
  const instrument = (await resolveInstrument(slug)) ?? slugToInstrument(slug)
  return {
    title: `${instrument} Mentors`,
    description: `Find All-State ${instrument} mentors for personalized audition coaching and technique improvement.`,
  }
}

export async function generateStaticParams() {
  const instruments = await getUniqueInstruments()
  return instruments.map(({ instrument }) => ({
    instrument: slugify(instrument),
  }))
}

function sortMentors(mentors: Mentor[], sort: string): Mentor[] {
  switch (sort) {
    case 'experience':
      return [...mentors].sort((a, b) => b.yearsInAllState - a.yearsInAllState)
    default:
      return mentors
  }
}

export default async function InstrumentPage({ params, searchParams }: PageProps) {
  const { instrument: slug } = await params
  const { sort = 'rating' } = await searchParams

  // Match the slug against the real instrument list; 404 only if truly unknown.
  const instrument = await resolveInstrument(slug)
  if (!instrument) {
    notFound()
  }

  const mentors = await getMentorsByInstrument(instrument)
  const sorted = sortMentors(mentors, sort)

  return (
    <main className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy sm:text-4xl">
            {instrument} Mentors
          </h1>
          <p className="mt-2 text-navy/60">
            {sorted.length} All-State {instrument.toLowerCase()} mentor{sorted.length !== 1 ? 's' : ''} available
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
