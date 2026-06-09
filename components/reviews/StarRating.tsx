'use client'

import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  maxRating?: number
  interactive?: boolean
  onRate?: (rating: number) => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'w-3.5 h-3.5',
  md: 'w-5 h-5',
  lg: 'w-7 h-7',
}

export default function StarRating({
  rating,
  maxRating = 5,
  interactive = false,
  onRate,
  size = 'md',
  className,
}: StarRatingProps) {
  const stars = Array.from({ length: maxRating }, (_, i) => i + 1)

  return (
    <div className={cn('flex gap-0.5', className)}>
      {stars.map((star) => (
        <button
          key={star}
          type={interactive ? 'button' : undefined}
          onClick={interactive && onRate ? () => onRate(star) : undefined}
          className={cn(
            interactive
              ? 'cursor-pointer transition-transform hover:scale-110'
              : 'cursor-default',
          )}
          disabled={!interactive}
        >
          <Star
            className={cn(
              sizeMap[size],
              star <= rating
                ? 'fill-gold text-gold'
                : 'fill-transparent text-navy/20',
            )}
          />
        </button>
      ))}
    </div>
  )
}
