import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy staff-lines">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-10 text-cream text-9xl font-serif select-none rotate-12">
          ♩
        </div>
        <div className="absolute top-1/3 right-20 text-cream text-8xl font-serif select-none -rotate-6">
          ♪
        </div>
        <div className="absolute bottom-1/4 left-1/3 text-cream text-7xl font-serif select-none rotate-3">
          ♫
        </div>
        <div className="absolute top-10 right-1/3 text-cream text-6xl font-serif select-none -rotate-12">
          ♬
        </div>
      </div>

      {/* Gold accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-gold-light to-gold" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full bg-gold/20 px-4 py-1.5 text-gold text-sm font-semibold mb-6">
            <span className="mr-2">🎵</span>
            Peer-to-Peer Music Mentorship
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold text-cream sm:text-5xl lg:text-6xl leading-tight mb-6">
            Learn From Students Who{' '}
            <span className="text-gold">Made All-State</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-cream/80 sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Get personalized audition coaching, feedback, and advice from
            experienced musicians who recently achieved All-State recognition.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/mentors">
              <Button size="lg" variant="primary" className="w-full sm:w-auto">
                Find Your Instrument
              </Button>
            </Link>
            <Link href="/become-a-mentor">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-cream/40 text-cream hover:bg-cream hover:text-navy">
                Become a Mentor
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-3 gap-6 border-t border-cream/10 pt-10">
            {[
              { value: '50+', label: 'All-State Mentors' },
              { value: '200+', label: 'Sessions Booked' },
              { value: '4.9★', label: 'Average Rating' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gold">{value}</div>
                <div className="text-sm text-cream/60 mt-1">{label}</div>
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
          <path d="M0 48V0c240 32 480 48 720 48S1200 32 1440 0v48H0z" fill="#F8F4ED" />
        </svg>
      </div>
    </section>
  )
}
