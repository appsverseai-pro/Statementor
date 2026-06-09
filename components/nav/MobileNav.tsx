'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="rounded-lg p-2 text-navy hover:bg-navy/10 transition-colors"
        aria-label="Toggle menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-16 z-50 bg-cream/98 backdrop-blur-sm border-b border-navy/10 shadow-lg">
          <div className="flex flex-col px-4 py-4 gap-1">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-navy hover:bg-navy/10 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-navy hover:bg-navy/10 transition-colors"
            >
              About
            </Link>
            <Link
              href="/mentors"
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-navy hover:bg-navy/10 transition-colors"
            >
              Browse Mentors
            </Link>
            <Link
              href="/become-a-mentor"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-center text-cream hover:bg-navy-light transition-colors"
            >
              Become a Mentor
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
