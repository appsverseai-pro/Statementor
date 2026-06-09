'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter, useParams } from 'next/navigation'
import StarRating from '@/components/reviews/StarRating'
import { Input, Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { CheckCircle2 } from 'lucide-react'

const reviewSchema = z.object({
  reviewerName: z.string().min(2, 'Name must be at least 2 characters'),
  reviewText: z.string().optional(),
})

type ReviewFormData = z.infer<typeof reviewSchema>

export default function ReviewPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.bookingId as string

  const [rating, setRating] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
  })

  const onSubmit = async (data: ReviewFormData) => {
    if (rating === 0) {
      setError('Please select a star rating.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Get booking details to find the mentor
      const bookingRes = await fetch(`/api/bookings/${bookingId}`)
      if (!bookingRes.ok) throw new Error('Booking not found')
      const booking = await bookingRes.json()

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorId: booking.mentor_id ?? 'unknown',
          bookingId,
          rating,
          reviewText: data.reviewText,
          reviewerName: data.reviewerName,
        }),
      })

      if (!res.ok) throw new Error('Failed to submit review')

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <main className="py-16">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-navy mb-3">Thank You!</h1>
          <p className="text-navy/65 mb-6">
            Your review has been submitted and will be visible after moderation.
          </p>
          <Button onClick={() => router.push('/mentors')}>Browse More Mentors</Button>
        </div>
      </main>
    )
  }

  return (
    <main className="py-10">
      <div className="mx-auto max-w-lg px-4 sm:px-6">
        <h1 className="text-2xl font-bold text-navy mb-2">Leave a Review</h1>
        <p className="text-navy/60 mb-8">Share your experience to help other students find great mentors.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="rounded-xl border border-navy/10 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-navy mb-4">Your Rating</h2>
            <div className="flex flex-col items-center gap-2">
              <StarRating
                rating={rating}
                interactive
                onRate={setRating}
                size="lg"
              />
              <p className="text-sm text-navy/50">
                {rating === 0
                  ? 'Click to rate'
                  : ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-navy/10 bg-white p-6 shadow-sm space-y-4">
            <h2 className="font-semibold text-navy">Your Review</h2>
            <Input
              label="Your Name"
              placeholder="How it should appear on the review"
              required
              error={errors.reviewerName?.message}
              {...register('reviewerName')}
            />
            <Textarea
              label="Review"
              placeholder="How was your session? What did you learn? Would you recommend this mentor?"
              rows={4}
              hint="Optional but helpful for other students"
              error={errors.reviewText?.message}
              {...register('reviewText')}
            />
          </div>

          {error && (
            <div className="rounded-lg bg-burgundy/10 border border-burgundy/20 p-3 text-sm text-burgundy">
              {error}
            </div>
          )}

          <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
            Submit Review
          </Button>
        </form>
      </div>
    </main>
  )
}
