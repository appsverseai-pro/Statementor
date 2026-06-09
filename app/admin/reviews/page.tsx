'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import Badge from '@/components/ui/Badge'
import StarRating from '@/components/reviews/StarRating'
import { formatDate } from '@/lib/utils'
import { CheckCircle2, EyeOff, Trash2 } from 'lucide-react'

type Review = {
  id: string
  mentor_id: string
  booking_id: string | null
  rating: number
  review_text: string | null
  reviewer_name: string
  moderation_status: 'pending' | 'approved' | 'hidden' | 'deleted'
  created_at: string
}

const STATUS_COLORS: Record<string, 'default' | 'gold' | 'green' | 'burgundy' | 'gray'> = {
  pending: 'gold',
  approved: 'green',
  hidden: 'gray',
  deleted: 'burgundy',
}

export default function AdminReviewsPage() {
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [updating, setUpdating] = useState<string | null>(null)

  const fetchReviews = useCallback(async () => {
    const res = await fetch('/api/reviews?status=all')
    if (res.status === 401) {
      router.push('/admin/login')
      return
    }
    const data = await res.json()
    setReviews(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [router])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const moderate = async (id: string, status: Review['moderation_status']) => {
    setUpdating(id)
    try {
      await fetch(`/api/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moderation_status: status }),
      })
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, moderation_status: status } : r))
      )
    } finally {
      setUpdating(null)
    }
  }

  const filtered = filter === 'all' ? reviews : reviews.filter((r) => r.moderation_status === filter)

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy">Reviews</h1>
          <p className="text-navy/60 mt-0.5">Moderate student reviews</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {['all', 'pending', 'approved', 'hidden', 'deleted'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors capitalize ${
                filter === status
                  ? 'bg-navy text-cream'
                  : 'bg-white border border-navy/20 text-navy/60 hover:text-navy'
              }`}
            >
              {status}
              {status !== 'all' && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({reviews.filter((r) => r.moderation_status === status).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-navy/40">Loading reviews...</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-navy/10 bg-white p-12 text-center shadow-sm">
            <p className="text-navy/50">No reviews in this category.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((review) => (
              <div
                key={review.id}
                className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-bold text-navy">{review.reviewer_name}</span>
                      <StarRating rating={review.rating} size="sm" />
                      <Badge variant={STATUS_COLORS[review.moderation_status]}>
                        {review.moderation_status}
                      </Badge>
                    </div>
                    <p className="text-xs text-navy/50 mb-2">
                      Mentor ID: {review.mentor_id} • {formatDate(review.created_at)}
                    </p>
                    {review.review_text && (
                      <p className="text-sm text-navy/70 leading-relaxed">{review.review_text}</p>
                    )}
                  </div>

                  <div className="flex sm:flex-col gap-2">
                    {review.moderation_status !== 'approved' && (
                      <button
                        onClick={() => moderate(review.id, 'approved')}
                        disabled={updating === review.id}
                        className="flex items-center gap-1.5 rounded-lg bg-green-50 border border-green-200 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 transition-colors"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Approve
                      </button>
                    )}
                    {review.moderation_status !== 'hidden' && (
                      <button
                        onClick={() => moderate(review.id, 'hidden')}
                        disabled={updating === review.id}
                        className="flex items-center gap-1.5 rounded-lg bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <EyeOff className="h-3.5 w-3.5" />
                        Hide
                      </button>
                    )}
                    {review.moderation_status !== 'deleted' && (
                      <button
                        onClick={() => moderate(review.id, 'deleted')}
                        disabled={updating === review.id}
                        className="flex items-center gap-1.5 rounded-lg bg-burgundy/5 border border-burgundy/20 px-3 py-1.5 text-xs font-medium text-burgundy hover:bg-burgundy/10 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
