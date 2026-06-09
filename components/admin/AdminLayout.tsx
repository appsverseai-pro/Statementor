'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Star,
  LogOut,
  Music2,
} from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/mentors', label: 'Mentors', icon: Users },
  { href: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    window.location.href = '/admin/login'
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-navy text-cream flex flex-col">
        <div className="flex items-center gap-2 p-6 border-b border-cream/10">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold">
            <Music2 className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="font-bold text-cream text-sm">StateMentor</div>
            <div className="text-xs text-cream/50">Admin Panel</div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                pathname === href
                  ? 'bg-gold text-white'
                  : 'text-cream/70 hover:bg-cream/10 hover:text-cream'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-cream/10">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-cream/70 hover:bg-cream/10 hover:text-cream transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-cream/50 overflow-auto">
        {children}
      </main>
    </div>
  )
}
