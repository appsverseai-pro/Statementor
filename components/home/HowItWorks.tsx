const steps = [
  {
    number: '1',
    icon: '🎯',
    title: 'Pick your instrument',
    description:
      "Click your instrument and browse real All-State students who play it. See their school, ratings, and what they're great at teaching.",
    color: 'bg-navy',
  },
  {
    number: '2',
    icon: '📆',
    title: 'Grab a time slot',
    description:
      'Pick a day and time that works for you — 30 or 60 minutes. Tell them what you want to work on and you\'re done.',
    color: 'bg-burgundy',
  },
  {
    number: '3',
    icon: '🚀',
    title: 'Level up your audition',
    description:
      'Get real feedback from someone who aced the same audition. They know the excerpts, the judges, and exactly what it takes.',
    color: 'bg-gold',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 bg-navy/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-block rounded-full bg-gold/15 px-4 py-1 text-gold text-sm font-semibold mb-4">
            Super simple
          </div>
          <h2 className="text-3xl font-bold text-navy sm:text-4xl mb-3">
            Go from nervous to ready — in 3 steps
          </h2>
          <p className="text-navy/60 text-lg max-w-xl mx-auto">
            No complicated sign-ups. No waiting around. Just find your mentor and book.
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
            "I was so nervous about auditions. My mentor helped me nail the excerpts in just two sessions. I made All-State!"
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
