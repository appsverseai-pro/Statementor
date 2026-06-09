import Link from 'next/link'
import { instrumentToSlug } from '@/lib/utils'

interface InstrumentGridProps {
  instruments: { instrument: string; count: number }[]
}

const INSTRUMENT_ICONS: Record<string, string> = {
  Violin: '🎻',
  Viola: '🎻',
  Cello: '🎻',
  'Double Bass': '🎻',
  Flute: '🎵',
  Oboe: '🎵',
  Clarinet: '🎵',
  Bassoon: '🎵',
  Saxophone: '🎷',
  Trumpet: '🎺',
  'French Horn': '🎺',
  Trombone: '🎺',
  Tuba: '🎺',
  Percussion: '🥁',
  Drums: '🥁',
  Piano: '🎹',
  Voice: '🎤',
  Harp: '🎵',
  Guitar: '🎸',
}

export default function InstrumentGrid({ instruments }: InstrumentGridProps) {
  return (
    <section className="py-16 bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-navy sm:text-4xl">
            Find a Mentor for Your Instrument
          </h2>
          <p className="mt-3 text-navy/60 text-lg">
            Browse All-State mentors by instrument
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {instruments.map(({ instrument, count }) => {
            const slug = instrumentToSlug(instrument)
            const icon = INSTRUMENT_ICONS[instrument] ?? '🎵'

            return (
              <Link
                key={instrument}
                href={`/${slug}`}
                className="group flex flex-col items-center gap-2 rounded-xl border border-navy/10 bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-gold/30"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">
                  {icon}
                </span>
                <span className="font-semibold text-navy text-sm leading-tight">
                  {instrument}
                </span>
                <span className="text-xs text-navy/50 bg-navy/5 rounded-full px-2 py-0.5">
                  {count} {count === 1 ? 'mentor' : 'mentors'}
                </span>
              </Link>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/mentors"
            className="inline-flex items-center gap-2 text-gold font-semibold hover:text-gold-light transition-colors"
          >
            Browse all mentors
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
