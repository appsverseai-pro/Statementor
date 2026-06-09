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
            We think the best All-State advice comes from students who just got there — not textbooks, not theories. Real students. Real results.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-cream">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-navy mb-4">Why we built this</h2>
              <p className="text-navy/70 leading-relaxed mb-4">
                Audition prep is stressful — and most students don't know where to turn. Private teachers are expensive, YouTube only gets you so far, and your band director is helping 80 other kids.
              </p>
              <p className="text-navy/70 leading-relaxed mb-4">
                StateMentor connects you with students who just did what you're trying to do. They know the exact excerpts. They remember the nerves. And they're ready to help.
              </p>
              <p className="text-navy/70 leading-relaxed">
                Sessions start at $15 and you can book one in under a minute — no account, no hassle.
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
          <h2 className="text-3xl font-bold text-navy text-center mb-10">Why students love it 🎵</h2>
          <div className="space-y-6">
            {[
              {
                title: 'They literally just did it',
                body: "Your mentor prepared for the exact same audition you're facing — often just 1-2 years ago. They know what works, what judges look for, and which excerpts trip people up.",
                emoji: '🏆',
              },
              {
                title: 'They get it',
                body: "They remember the nerves, the long practice sessions, the pressure. You're not getting advice from someone who forgot what high school is like.",
                emoji: '🤝',
              },
              {
                title: 'Actually affordable',
                body: "Private lessons can cost $80–$150/hour. Our mentors start at $15 for 30 minutes. Quality coaching shouldn't require a second mortgage.",
                emoji: '💰',
              },
              {
                title: 'Your instrument. Your excerpts.',
                body: "Every mentor specializes in their own instrument. You'll work with someone who knows the specific excerpts, technique challenges, and audition requirements for what you play.",
                emoji: '🎯',
              },
            ].map(({ title, body, emoji }) => (
              <div
                key={title}
                className="flex gap-4 rounded-xl border border-navy/10 bg-white p-5 shadow-sm"
              >
                <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gold/15 text-xl">
                  {emoji}
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
            <h2 className="text-3xl font-bold text-cream mb-3">Are you an All-State musician? 🎷</h2>
            <p className="text-cream/70 mb-6 max-w-xl mx-auto">
              Help other students get where you are — and earn money doing it. Most mentors set their own schedule and make $15–$30 per session.
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
