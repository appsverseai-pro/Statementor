import StarRating from './StarRating'
import { formatDate } from '@/lib/utils'

interface Review {
  id: string
  rating: number
  review_text: string | null
  reviewer_name: string
  created_at: string
}

interface ReviewCardProps {
  review: Review
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-cream font-bold text-sm">
            {review.reviewer_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-navy">{review.reviewer_name}</p>
            <p className="text-xs text-navy/50">{formatDate(review.created_at)}</p>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>
      {review.review_text && (
        <p className="mt-3 text-navy/80 text-sm leading-relaxed">{review.review_text}</p>
      )}
    </div>
  )
}
