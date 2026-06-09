import Link from 'next/link'
import { Music2 } from 'lucide-react'
import InstrumentTabs from './InstrumentTabs'
import MobileNav from './MobileNav'

async function getInstruments() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/instruments`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function Navbar() {
  const instruments = await getInstruments()

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-navy/10 shadow-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy group-hover:bg-navy-light transition-colors">
            <Music2 className="h-4 w-4 text-gold" />
          </div>
          <span className="font-bold text-navy text-xl tracking-tight">
            State<span className="text-gold">Mentor</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-navy/70 hover:text-navy transition-colors"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-navy/70 hover:text-navy transition-colors"
          >
            About
          </Link>
          <Link
            href="/mentors"
            className="text-sm font-medium text-navy/70 hover:text-navy transition-colors"
          >
            Browse Mentors
          </Link>
          <Link
            href="/become-a-mentor"
            className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-cream hover:bg-navy-light transition-colors"
          >
            Become a Mentor
          </Link>
        </div>

        {/* Mobile nav */}
        <MobileNav />
      </nav>

      {/* Instrument tabs */}
      <InstrumentTabs instruments={instruments} />
    </header>
  )
}
