const steps = [
  {
    number: '01',
    icon: '🔍',
    title: 'Find Your Mentor',
    description:
      'Browse verified All-State musicians filtered by instrument, price, and availability. Read reviews from other students.',
  },
  {
    number: '02',
    icon: '📅',
    title: 'Book a Session',
    description:
      'Choose a time that works for you and your mentor. Select 30 or 60 minute sessions and describe your goals.',
  },
  {
    number: '03',
    icon: '🎵',
    title: 'Improve & Succeed',
    description:
      'Get personalized feedback, audition tips, and expert guidance from someone who just went through the process.',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 bg-navy/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-navy sm:text-4xl mb-3">
            How It Works
          </h2>
          <p className="text-navy/60 text-lg max-w-xl mx-auto">
            Get expert mentorship in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, idx) => (
            <div key={step.number} className="relative">
              {/* Connector line between steps (desktop) */}
              {idx < steps.length - 1 && (
                <div className="absolute hidden md:block top-10 left-[calc(50%+40px)] right-[-50%] h-px bg-gold/30" />
              )}

              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-navy/10 shadow-sm">
                <div className="relative mb-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-navy text-4xl shadow-md">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-gold text-white text-xs font-bold">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-navy mb-3">{step.title}</h3>
                <p className="text-navy/65 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 rounded-2xl bg-navy p-6 sm:p-8">
            <div className="text-left">
              <h3 className="text-xl font-bold text-cream">Ready to get started?</h3>
              <p className="text-cream/70 text-sm mt-1">
                Join hundreds of students improving with All-State mentors
              </p>
            </div>
            <a
              href="/mentors"
              className="flex-shrink-0 rounded-lg bg-gold px-6 py-3 text-white font-semibold hover:bg-gold-light transition-colors"
            >
              Find a Mentor
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
