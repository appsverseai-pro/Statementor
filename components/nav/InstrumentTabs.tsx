'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { instrumentToSlug } from '@/lib/utils'
import { Music } from 'lucide-react'

interface InstrumentTabsProps {
  instruments: { instrument: string; count: number }[]
}

export default function InstrumentTabs({ instruments }: InstrumentTabsProps) {
  const pathname = usePathname()

  return (
    <div className="border-t border-navy/20 bg-navy/5 overflow-x-auto scrollbar-hide">
      <div className="flex items-center min-w-max px-4 sm:px-6 lg:px-8">
        <Link
          href="/mentors"
          className={cn(
            'flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2',
            pathname === '/mentors'
              ? 'border-gold text-gold'
              : 'border-transparent text-navy/60 hover:text-navy hover:border-navy/30'
          )}
        >
          <Music className="h-3.5 w-3.5" />
          All Instruments
        </Link>
        {instruments.map(({ instrument, count }) => {
          const slug = instrumentToSlug(instrument)
          const href = `/${slug}`
          const isActive = pathname === href

          return (
            <Link
              key={instrument}
              href={href}
              className={cn(
                'flex items-center gap-1 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2',
                isActive
                  ? 'border-gold text-gold'
                  : 'border-transparent text-navy/60 hover:text-navy hover:border-navy/30'
              )}
            >
              {instrument}
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-xs font-bold',
                  isActive ? 'bg-gold/15 text-gold' : 'bg-navy/10 text-navy/50'
                )}
              >
                {count}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
