import { Mentor } from '@/lib/google-sheets'
import MentorCard from './MentorCard'

interface MentorGridProps {
  mentors: Mentor[]
  ratings?: Record<string, { avg: number; count: number }>
}

export default function MentorGrid({ mentors, ratings }: MentorGridProps) {
  if (mentors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl mb-4">🎵</div>
        <h3 className="text-xl font-bold text-navy mb-2">No mentors found</h3>
        <p className="text-navy/60">Try adjusting your filters or check back later.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {mentors.map((mentor) => (
        <MentorCard
          key={mentor.id}
          mentor={mentor}
          avgRating={ratings?.[mentor.id]?.avg}
          reviewCount={ratings?.[mentor.id]?.count}
        />
      ))}
    </div>
  )
}
