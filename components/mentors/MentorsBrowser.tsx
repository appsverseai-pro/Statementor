'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import type { Mentor } from '@/lib/google-sheets'
import MentorGrid from './MentorGrid'
import MentorFilters from './MentorFilters'

interface MentorsBrowserProps {
  mentors: Mentor[]
  instruments: string[]
}

function sortMentors(mentors: Mentor[], sort: string): Mentor[] {
  switch (sort) {
    case 'experience':
      return [...mentors].sort((a, b) => b.yearsInAllState - a.yearsInAllState)
    default:
      return mentors
  }
}

// Filtering and sorting happen entirely in the browser from the URL query, so
// the page itself can be served statically (instant) instead of re-rendered on
// the server for every filter change.
export default function MentorsBrowser({ mentors, instruments }: MentorsBrowserProps) {
  const searchParams = useSearchParams()
  const sort = searchParams.get('sort') ?? 'rating'
  const instrument = searchParams.get('instrument') ?? ''

  const sorted = useMemo(() => {
    const filtered = instrument
      ? mentors.filter((m) => m.instrument.toLowerCase() === instrument.toLowerCase())
      : mentors
    return sortMentors(filtered, sort)
  }, [mentors, instrument, sort])

  return (
    <>
      <MentorFilters totalCount={sorted.length} instruments={instruments} />
      <MentorGrid mentors={sorted} />
    </>
  )
}
