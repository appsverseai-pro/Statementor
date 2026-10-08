export default function MentorsLoading() {
  return (
    <main className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-9 w-48 rounded-lg bg-navy/10 animate-pulse" />
          <div className="mt-3 h-4 w-80 max-w-full rounded bg-navy/5 animate-pulse" />
        </div>

        {/* Filter row skeleton */}
        <div className="mb-6 flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-9 w-24 rounded-full bg-navy/10 animate-pulse" />
          ))}
        </div>

        {/* Card grid skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border-2 border-navy/10 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-navy/10 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-32 rounded bg-navy/10 animate-pulse" />
                  <div className="h-4 w-20 rounded bg-navy/5 animate-pulse" />
                </div>
              </div>
              <div className="mt-5 space-y-2">
                <div className="h-4 w-full rounded bg-navy/5 animate-pulse" />
                <div className="h-4 w-2/3 rounded bg-navy/5 animate-pulse" />
              </div>
              <div className="mt-5 h-8 w-full rounded bg-navy/5 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
