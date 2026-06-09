import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/nav/Navbar'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: {
    default: 'StateMentor – Learn From All-State Musicians',
    template: '%s | StateMentor',
  },
  description:
    'Connect with All-State musicians for personalized audition coaching, technique feedback, and mentorship. Find your instrument mentor today.',
  keywords: ['music mentorship', 'all-state', 'audition coaching', 'music lessons', 'student mentor'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://statementor.com',
    siteName: 'StateMentor',
    title: 'StateMentor – Learn From All-State Musicians',
    description: 'Personalized audition coaching from students who made All-State.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-cream text-navy antialiased">
        <Navbar />
        <div className="flex-1">{children}</div>
        <footer className="bg-navy text-cream mt-16">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div>
                <div className="font-bold text-xl text-gold mb-2">StateMentor</div>
                <p className="text-cream/60 text-sm leading-relaxed">
                  Connecting aspiring musicians with All-State peers for expert mentorship and guidance.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-cream mb-3 text-sm">Platform</h4>
                <ul className="space-y-2 text-sm text-cream/60">
                  <li><a href="/mentors" className="hover:text-gold transition-colors">Browse Mentors</a></li>
                  <li><a href="/about" className="hover:text-gold transition-colors">About Us</a></li>
                  <li><a href="/become-a-mentor" className="hover:text-gold transition-colors">Become a Mentor</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-cream mb-3 text-sm">Contact</h4>
                <ul className="space-y-2 text-sm text-cream/60">
                  <li><a href="mailto:support@statementor.com" className="hover:text-gold transition-colors">support@statementor.com</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 border-t border-cream/10 pt-6 text-center text-xs text-cream/40">
              &copy; {new Date().getFullYear()} StateMentor. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
