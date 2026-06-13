const steps = [
  {
    number: '1',
    icon: '🎯',
    title: 'Find your instrument',
    description:
      "Browse upperclassmen who play your instrument and made All State. See their school, what they've been through, and what other students say about them.",
    color: 'bg-sky',
  },
  {
    number: '2',
    icon: '📆',
    title: 'Pick a time',
    description:
      "Choose a time that works for both of you — 30 or 60 minutes. Tell them what you're working on and any questions you have.",
    color: 'bg-lavender',
  },
  {
    number: '3',
    icon: '🎓',
    title: 'Learn from someone who gets it',
    description:
      "They went through the exact same process. Ask them anything — excerpts, nerves, what audition day is actually like. This is what peer mentorship is all about.",
    color: 'bg-peach',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 bg-navy/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-block rounded-full bg-gold/15 px-4 py-1 text-gold text-sm font-semibold mb-4">
            Simple as it gets
          </div>
          <h2 className="text-3xl font-bold text-navy sm:text-4xl mb-3">
            Connect with an upperclassman in minutes
          </h2>
          <p className="text-navy/60 text-lg max-w-xl mx-auto">
            No formal lessons. No pressure. Just a fellow student who's been through it and wants to help.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, idx) => (
            <div key={step.number} className="relative">
              {idx < steps.length - 1 && (
                <div className="absolute hidden md:block top-10 left-[calc(50%+40px)] right-[-50%] h-px bg-gold/30" />
              )}

              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-navy/10 shadow-sm hover:shadow-md transition-shadow">
                <div className="relative mb-5">
                  <div className={`flex h-20 w-20 items-center justify-center rounded-2xl ${step.color} text-4xl shadow-md`}>
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-cream border-2 border-gold text-gold text-xs font-bold">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-navy mb-3">{step.title}</h3>
                <p className="text-navy/65 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Student quote / social proof */}
        <div className="mt-14 rounded-2xl bg-white border border-gold/20 p-6 sm:p-8 text-center shadow-sm max-w-2xl mx-auto">
          <div className="text-3xl mb-3">💬</div>
          <p className="text-navy text-lg font-medium italic mb-3">
            "I had no idea what to expect at All State auditions. My mentor had done it twice — she told me exactly what the room feels like, what the judges listen for, everything. It felt like getting advice from an older sister."
          </p>
          <p className="text-navy/50 text-sm">— Emma, Flute · Grade 10</p>
          <div className="mt-4">
            <a
              href="/mentors"
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-3 text-cream font-semibold hover:bg-navy-light transition-colors"
            >
              Find your mentor 🎵
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
