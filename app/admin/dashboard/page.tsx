import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import StatsCard from '@/components/admin/StatsCard'
import { Users, CalendarCheck, Star } from 'lucide-react'
import { getActiveMentors } from '@/lib/google-sheets'

async function getStats() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl || supabaseUrl === 'your_supabase_url') {
    return { bookings: 0, reviews: 0 }
  }

  try {
    const { createServiceClient } = await import('@/lib/supabase/server')
    const supabase = await createServiceClient()

    const [bookingsResult, reviewsResult] = await Promise.all([
      supabase.from('bookings').select('id', { count: 'exact' }),
      supabase.from('reviews').select('id', { count: 'exact' }).eq('moderation_status', 'pending'),
    ])

    return {
      bookings: bookingsResult.count ?? 0,
      reviews: reviewsResult.count ?? 0,
    }
  } catch {
    return { bookings: 0, reviews: 0 }
  }
}

export default async function AdminDashboardPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  if (session?.value !== 'authenticated') redirect('/admin/login')

  const [mentors, stats] = await Promise.all([getActiveMentors(), getStats()])

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
          <p className="text-navy/60 mt-1">Welcome back to StateMentor admin</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
          <StatsCard
            title="Active Mentors"
            value={mentors.length}
            description="Accepting bookings"
            icon={Users}
            variant="default"
          />
          <StatsCard
            title="Total Bookings"
            value={stats.bookings}
            description="All time"
            icon={CalendarCheck}
            variant="gold"
          />
          <StatsCard
            title="Pending Reviews"
            value={stats.reviews}
            description="Awaiting moderation"
            icon={Star}
            variant="burgundy"
          />
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { href: '/admin/mentors', title: 'Manage Mentors', desc: 'Add, edit, or deactivate mentors' },
            { href: '/admin/bookings', title: 'View Bookings', desc: 'Review and update booking statuses' },
            { href: '/admin/reviews', title: 'Moderate Reviews', desc: 'Approve or hide student reviews' },
          ].map(({ href, title, desc }) => (
            <a
              key={href}
              href={href}
              className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm hover:border-gold/30 hover:shadow-md transition-all"
            >
              <h3 className="font-bold text-navy mb-1">{title}</h3>
              <p className="text-sm text-navy/60">{desc}</p>
            </a>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
