'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

interface MentorFiltersProps {
  totalCount: number
}

const SORT_OPTIONS = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'experience', label: 'Most Experience' },
]

export default function MentorFilters({ totalCount }: MentorFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sort = searchParams.get('sort') ?? 'rating'

  const updateSort = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('sort', value)
      router.push(`?${params.toString()}`)
    },
    [router, searchParams]
  )

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <p className="text-navy/60 text-sm">
        Showing <span className="font-semibold text-navy">{totalCount}</span>{' '}
        {totalCount === 1 ? 'mentor' : 'mentors'}
      </p>
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm text-navy/70 font-medium whitespace-nowrap">
          Sort by:
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => updateSort(e.target.value)}
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
  )
}
