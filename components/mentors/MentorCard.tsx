import Link from 'next/link'
import { MapPin, Star, Clock } from 'lucide-react'
import { Mentor } from '@/lib/google-sheets'
import Badge from '@/components/ui/Badge'

interface MentorCardProps {
  mentor: Mentor
  avgRating?: number
  reviewCount?: number
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

export default function MentorCard({ mentor, avgRating, reviewCount }: MentorCardProps) {
  const icon = INSTRUMENT_ICONS[mentor.instrument] ?? '🎵'
  const initials = mentor.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <Link
      href={`/mentors/${mentor.id}`}
      className="group block rounded-2xl border-2 border-navy/10 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:border-gold/30"
    >
      <div className="relative overflow-hidden rounded-t-2xl bg-navy/5 p-6 pb-4">
        {/* Musical staff decorative lines */}
        <div className="absolute inset-0 opacity-5">
          {[20, 36, 52, 68, 84].map((top) => (
            <div
              key={top}
              className="absolute left-0 right-0 h-px bg-navy"
              style={{ top: `${top}%` }}
            />
          ))}
        </div>

        <div className="relative flex items-center gap-4">
          {mentor.profilePhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mentor.profilePhoto}
              alt={mentor.name}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-gold/30"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy text-cream text-xl font-bold ring-2 ring-gold/30">
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-navy text-lg leading-tight group-hover:text-gold transition-colors truncate">
              {mentor.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-lg">{icon}</span>
              <span className="text-navy/70 text-sm font-medium">{mentor.instrument}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 pt-4">
        <div className="flex items-center gap-1.5 text-sm text-navy/60 mb-3">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">{mentor.school}</span>
        </div>

        <p className="text-sm text-navy/70 line-clamp-2 mb-4 leading-relaxed">
          {mentor.bio}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          <Badge variant="gold">
            🏆 {mentor.yearsInAllState}x All-State
          </Badge>
          {mentor.teachingAreas
            .split(',')
            .slice(0, 2)
            .map((area) => (
              <Badge key={area} variant="default">
                {area.trim()}
              </Badge>
            ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-navy/10">
          <div className="flex items-center gap-1.5">
            {avgRating !== undefined && reviewCount !== undefined ? (
              <>
                <Star className="h-4 w-4 fill-gold text-gold" />
                <span className="text-sm font-semibold text-navy">
                  {avgRating.toFixed(1)}
                </span>
                <span className="text-xs text-navy/50">({reviewCount})</span>
              </>
            ) : (
              <span className="text-xs text-navy/40 italic">No reviews yet</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-gold font-bold">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-sm">Free</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
