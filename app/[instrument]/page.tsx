import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getMentorsByInstrument, getUniqueInstruments, type Mentor } from '@/lib/google-sheets'
import { slugToInstrument } from '@/lib/utils'
import MentorGrid from '@/components/mentors/MentorGrid'
import MentorFilters from '@/components/mentors/MentorFilters'

interface PageProps {
  params: Promise<{ instrument: string }>
  searchParams: Promise<{ sort?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { instrument: slug } = await params
  const instrument = slugToInstrument(slug)
  return {
    title: `${instrument} Mentors`,
    description: `Find All-State ${instrument} mentors for personalized audition coaching and technique improvement.`,
  }
}

export async function generateStaticParams() {
  const instruments = await getUniqueInstruments()
  return instruments.map(({ instrument }) => ({
    instrument: instrument.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  }))
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

export default async function InstrumentPage({ params, searchParams }: PageProps) {
  const { instrument: slug } = await params
  const { sort = 'rating' } = await searchParams

  const instrument = slugToInstrument(slug)
  const allInstruments = await getUniqueInstruments()
  const instrumentNames = allInstruments.map((i) => i.instrument.toLowerCase())

  // Validate the instrument exists
  if (!instrumentNames.includes(instrument.toLowerCase())) {
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
