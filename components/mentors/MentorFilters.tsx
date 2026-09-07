'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { cn } from '@/lib/utils'

interface MentorFiltersProps {
  totalCount: number
  instruments?: string[]
}

const SORT_OPTIONS = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'experience', label: 'Most Experience' },
]

export default function MentorFilters({ totalCount, instruments = [] }: MentorFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sort = searchParams.get('sort') ?? 'rating'
  const instrument = searchParams.get('instrument') ?? ''

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  return (
    <div className="mb-6 space-y-5">
      {/* Instrument filter — most prominent */}
      {instruments.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-navy/70 mb-3">
            Filter by instrument
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => updateParam('instrument', '')}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-semibold transition-colors border',
                instrument === ''
                  ? 'bg-navy text-cream border-navy'
                  : 'bg-white text-navy border-navy/20 hover:border-gold hover:text-gold'
              )}
            >
              All Instruments
            </button>
            {instruments.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => updateParam('instrument', instrument === name ? '' : name)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-semibold transition-colors border',
                  instrument === name
                    ? 'bg-navy text-cream border-navy'
                    : 'bg-white text-navy border-navy/20 hover:border-gold hover:text-gold'
                )}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-navy/60 text-sm">
          Showing <span className="font-semibold text-navy">{totalCount}</span>{' '}
          {totalCount === 1 ? 'mentor' : 'mentors'}
          {instrument && (
            <>
              {' '}for <span className="font-semibold text-navy">{instrument}</span>
            </>
          )}
        </p>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-navy/70 font-medium whitespace-nowrap">
            Sort by:
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm text-navy focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
