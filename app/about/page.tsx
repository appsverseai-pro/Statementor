import type { Metadata } from 'next'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'About StateMentor',
  description: 'Learn about StateMentor — the platform connecting music students with All-State musicians for personalized mentorship.',
}

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-navy py-16 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="text-4xl font-bold text-cream mb-4 sm:text-5xl">
            About <span className="text-gold">StateMentor</span>
          </h1>
          <p className="text-cream/70 text-lg leading-relaxed">
            We believe every music student deserves access to expert guidance from those who have recently walked the same path.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-cream">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-navy mb-4">Our Mission</h2>
              <p className="text-navy/70 leading-relaxed mb-4">
                StateMentor was founded on a simple idea: the best advice for aspiring All-State musicians comes from students who just achieved it themselves.
              </p>
              <p className="text-navy/70 leading-relaxed mb-4">
                Our mentors remember the audition anxiety, the specific excerpts, the exact techniques that judges look for — because they prepared for the same auditions recently.
              </p>
              <p className="text-navy/70 leading-relaxed">
                We connect these talented All-State musicians with students who are working toward the same goal, creating a mentorship cycle that benefits everyone.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '50+', label: 'All-State Mentors' },
                { value: '15+', label: 'Instruments' },
                { value: '200+', label: 'Sessions Completed' },
                { value: '4.9/5', label: 'Average Rating' },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="rounded-xl border border-navy/10 bg-white p-5 text-center shadow-sm"
                >
                  <div className="text-2xl font-bold text-gold mb-1">{value}</div>
                  <div className="text-sm text-navy/60">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-navy/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-navy text-center mb-10">Why Peer Mentorship Works</h2>
          <div className="space-y-6">
            {[
              {
                title: 'Recent Experience',
                body: "All-State mentors prepared for the exact same auditions you\'re facing, often just 1-2 years ago. They know what works and what judges notice.",
              },
              {
                title: 'Relatable Guidance',
                body: 'Peers understand the pressure of high school music and can offer advice that\'s practical, not just theoretical.',
              },
              {
                title: 'Affordable Access',
                body: 'Professional music teachers can be expensive and hard to access. Our mentors offer high-quality guidance at student-friendly rates.',
              },
              {
                title: 'Instrument-Specific',
                body: 'Every mentor specializes in their instrument. You\'ll work with someone who knows the exact excerpts, technique challenges, and audition requirements for your instrument.',
              },
            ].map(({ title, body }) => (
              <div
                key={title}
                className="flex gap-4 rounded-xl border border-navy/10 bg-white p-5 shadow-sm"
              >
                <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gold text-white text-lg">
                  ♪
                </div>
                <div>
                  <h3 className="font-bold text-navy text-lg mb-1">{title}</h3>
                  <p className="text-navy/65 text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For mentors section */}
      <section className="py-16 bg-cream">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-navy p-8 sm:p-10 text-center">
            <h2 className="text-3xl font-bold text-cream mb-3">Are You an All-State Musician?</h2>
            <p className="text-cream/70 mb-6 max-w-xl mx-auto">
              Share your expertise, help fellow students succeed, and earn money doing what you love. Join StateMentor as a mentor today.
            </p>
            <Link href="/become-a-mentor">
              <Button variant="primary" size="lg">
                Become a Mentor
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
