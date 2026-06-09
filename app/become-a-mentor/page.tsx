import type { Metadata } from 'next'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { DollarSign, Users, Clock, Award } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Become a Mentor',
  description: 'Are you an All-State musician? Join StateMentor and help students achieve their musical goals while earning money.',
}

export default function BecomeAMentorPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-navy py-16 text-center staff-lines">
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="text-4xl font-bold text-cream sm:text-5xl mb-4">
            Share Your <span className="text-gold">All-State</span> Experience
          </h1>
          <p className="text-cream/70 text-lg mb-8 max-w-xl mx-auto">
            Help the next generation of musicians achieve their goals. Earn money doing what you love — teaching music.
          </p>
          <a
            href="mailto:mentors@statementor.com?subject=I want to become a mentor"
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-8 py-4 text-white font-bold text-lg hover:bg-gold-light transition-colors"
          >
            Apply to Become a Mentor
          </a>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-cream">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-navy text-center mb-10">Why Join StateMentor?</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {[
              {
                icon: DollarSign,
                title: 'Earn on Your Schedule',
                desc: 'Set your own rates ($40–$80/hr typical) and availability. Get paid securely through Stripe.',
              },
              {
                icon: Users,
                title: 'Make a Real Difference',
                desc: 'Students trust peers who recently went through the same auditions. Your guidance is uniquely valuable.',
              },
              {
                icon: Clock,
                title: 'Flexible Commitment',
                desc: 'Offer as few or as many sessions as you want. Sessions are 30 or 60 minutes to fit your schedule.',
              },
              {
                icon: Award,
                title: 'Build Your Profile',
                desc: 'Earn reviews and build your teaching reputation. Great experience for college applications and resumes.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex gap-4 rounded-xl border border-navy/10 bg-white p-5 shadow-sm"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-navy mb-1">{title}</h3>
                  <p className="text-sm text-navy/65 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 bg-navy/5">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-navy text-center mb-8">Requirements</h2>
          <div className="rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
            <ul className="space-y-3">
              {[
                'Currently enrolled in high school or recently graduated',
                'Selected for All-State Orchestra, Band, Choir, or Jazz Band at least once',
                'Proficient on your primary instrument',
                'Able to communicate clearly and help students learn',
                'Available for at least 2 sessions per week',
              ].map((req) => (
                <li key={req} className="flex items-start gap-3 text-navy/70">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gold text-white text-xs">
                    ✓
                  </span>
                  {req}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-cream">
        <div className="mx-auto max-w-lg px-4 text-center">
          <h2 className="text-2xl font-bold text-navy mb-3">Ready to Get Started?</h2>
          <p className="text-navy/60 mb-6">
            Email us to apply. We review applications on a rolling basis and will get back to you within 48 hours.
          </p>
          <a href="mailto:mentors@statementor.com?subject=I want to become a mentor on StateMentor">
            <Button size="lg" className="w-full sm:w-auto">
              Apply Now — mentors@statementor.com
            </Button>
          </a>
          <p className="mt-4 text-sm text-navy/40">No application fee. We only take a small platform fee per booking.</p>
        </div>
      </section>
    </main>
  )
}
