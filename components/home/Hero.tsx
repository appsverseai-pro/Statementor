import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy staff-lines">
      {/* Floating musical notes - more visible and playful */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-16 left-8 text-gold/25 text-7xl font-serif rotate-12">♩</div>
        <div className="absolute top-24 right-16 text-gold/20 text-6xl font-serif -rotate-6">♪</div>
        <div className="absolute bottom-24 left-1/4 text-gold/15 text-8xl font-serif rotate-3">♫</div>
        <div className="absolute top-12 right-1/3 text-cream/10 text-5xl font-serif -rotate-12">♬</div>
        <div className="absolute bottom-16 right-12 text-gold/20 text-6xl font-serif rotate-6">♩</div>
        <div className="absolute top-1/2 left-4 text-cream/8 text-4xl font-serif -rotate-3">♪</div>
      </div>

      {/* Gold accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-gold-light to-gold" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full bg-gold/25 border border-gold/40 px-4 py-1.5 text-gold text-sm font-bold mb-6 tracking-wide">
            <span className="mr-2">🎶</span>
            Upperclassmen giving back
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold text-cream sm:text-5xl lg:text-6xl leading-tight mb-6">
            Learn from musicians who made{' '}
            <span className="text-gold">All State</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-cream/80 sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Connect with All State musicians from your community who want to pay it forward. Real students. Real experience. No pressure.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/mentors">
              <Button size="lg" variant="primary" className="w-full sm:w-auto text-base font-bold">
                🎵 Find a Mentor
              </Button>
            </Link>
            <Link href="/become-a-mentor">
              <Button
                size="lg"
                variant="outlineLight"
                className="w-full sm:w-auto"
              >
                Give Back as a Mentor
              </Button>
            </Link>
          </div>

          {/* Trust line */}
          <p className="mt-5 text-cream/45 text-sm">
            Peer to peer · No account needed · Always free
          </p>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-cream/10 pt-10">
            {[
              { value: '50+', label: 'All State Musicians', emoji: '🏆' },
              { value: '200+', label: 'Students Helped', emoji: '🎓' },
              { value: '4.9★', label: 'Average Rating', emoji: '⭐' },
            ].map(({ value, label, emoji }) => (
              <div key={label} className="text-center">
                <div className="text-xl mb-1">{emoji}</div>
                <div className="text-2xl sm:text-3xl font-bold text-gold">{value}</div>
                <div className="text-xs text-cream/55 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave separator */}
      <div className="relative h-12 bg-cream">
        <svg
          className="absolute -top-12 left-0 w-full"
          viewBox="0 0 1440 48"
          fill="none"
          preserveAspectRatio="none"
        >
          <path d="M0 48V0c240 32 480 48 720 48S1200 32 1440 0v48H0z" fill="#DEDEF0" />
        </svg>
      </div>
    </section>
  )
}
