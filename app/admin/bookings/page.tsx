'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

type Booking = {
  id: string
  mentor_id: string
  student_name: string
  student_email: string
  student_instrument: string
  session_goals: string | null
  session_length: number
  session_date: string
  booking_status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  payment_status: 'unpaid' | 'paid'
  created_at: string
}

const STATUS_COLORS: Record<string, 'default' | 'gold' | 'green' | 'burgundy' | 'gray'> = {
  pending: 'gold',
  confirmed: 'green',
  completed: 'default',
  cancelled: 'burgundy',
  unpaid: 'gray',
  paid: 'green',
}

export default function AdminBookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  const fetchBookings = useCallback(async () => {
    const res = await fetch('/api/bookings')
    if (res.status === 401) {
      router.push('/admin/login')
      return
    }
    const data = await res.json()
    setBookings(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [router])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const updateStatus = async (
    id: string,
    field: 'booking_status' | 'payment_status',
    value: string
  ) => {
    setUpdating(id)
    try {
      await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      })
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, [field]: value } : b))
      )
    } finally {
      setUpdating(null)
    }
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy">Bookings</h1>
          <p className="text-navy/60 mt-0.5">{bookings.length} total bookings</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-navy/40">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="rounded-xl border border-navy/10 bg-white p-12 text-center shadow-sm">
            <p className="text-navy/50">No bookings yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-bold text-navy">{booking.student_name}</span>
                      <Badge variant="default">{booking.student_instrument}</Badge>
                      <Badge variant={STATUS_COLORS[booking.booking_status]}>
                        {booking.booking_status}
                      </Badge>
                    </div>
                    <p className="text-sm text-navy/60">{booking.student_email}</p>
                    <p className="text-sm text-navy/60 mt-1">
                      {formatDate(booking.session_date)} • {booking.session_length} min
                    </p>
                    {booking.session_goals && (
                      <p className="text-xs text-navy/50 mt-1 italic">
                        Goals: {booking.session_goals}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:items-end gap-2">
                    <div className="flex items-center gap-1.5">
                      <label className="text-xs text-navy/60 whitespace-nowrap">Booking:</label>
                      <div className="relative">
                        <select
                          value={booking.booking_status}
                          onChange={(e) =>
                            updateStatus(booking.id, 'booking_status', e.target.value)
                          }
                          disabled={updating === booking.id}
                          className="appearance-none rounded-lg border border-navy/20 bg-white pl-3 pr-7 py-1.5 text-xs text-navy focus:border-gold focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-2 h-3 w-3 text-navy/40 pointer-events-none" />
                      </div>
                    </div>
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
