export default function BookingDetailPageLoading() {
  return (
    <div className="relative min-h-screen bg-[#0C0A09] py-12">
      {/* Background radial glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-orange-500/5 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="text-center mb-8 space-y-3">
          <div className="h-6 w-44 bg-white/5 rounded-full mx-auto skeleton-shimmer" />
          <div className="h-9 w-80 bg-white/5 rounded-2xl mx-auto skeleton-shimmer" />
          <div className="h-4 w-96 bg-white/5 rounded-full mx-auto skeleton-shimmer" />
        </div>

        {/* Steps Progress Tracker Skeleton */}
        <div className="rounded-3xl border border-white/10 bg-[#14110F]/25 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex-1 flex flex-row md:flex-col items-center gap-3 md:text-center">
                {/* Circle step identifier */}
                <div className="h-8 w-8 rounded-xl bg-white/5 border border-white/5 shrink-0 skeleton-shimmer" />
                <div className="space-y-1.5 w-32">
                  <div className="h-4 bg-white/5 rounded-full w-20 md:mx-auto skeleton-shimmer" />
                  <div className="h-3 bg-white/5 rounded-full w-14 md:mx-auto skeleton-shimmer" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two-Column details skeleton */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Panel: Main details (Span 2) */}
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-[#14110F]/40 p-6 sm:p-8 space-y-6">
              <div className="border-b border-white/5 pb-4 space-y-2">
                <div className="h-4 w-24 bg-white/5 rounded-full skeleton-shimmer" />
                <div className="h-8 w-64 bg-white/5 rounded-2xl skeleton-shimmer" />
              </div>

              {/* Grid with metadata */}
              <div className="grid gap-6 sm:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="space-y-2">
                    <div className="h-3 w-20 bg-white/5 rounded-full skeleton-shimmer" />
                    <div className="h-5 w-40 bg-white/5 rounded-lg skeleton-shimmer" />
                  </div>
                ))}
              </div>

              {/* Description block */}
              <div className="border-t border-white/5 pt-6 space-y-2">
                <div className="h-4 w-32 bg-white/5 rounded-full skeleton-shimmer" />
                <div className="space-y-2">
                  <div className="h-3 bg-white/5 rounded-full w-full skeleton-shimmer" />
                  <div className="h-3 bg-white/5 rounded-full w-11/12 skeleton-shimmer" />
                  <div className="h-3 bg-white/5 rounded-full w-4/5 skeleton-shimmer" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Side details (Span 1) */}
          <div className="space-y-6">
            {/* Provider card skeleton */}
            <div className="rounded-3xl border border-white/10 bg-[#14110F]/40 p-6 space-y-4">
              <div className="h-4 w-28 bg-white/5 rounded-full skeleton-shimmer" />
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/5 shrink-0 skeleton-shimmer" />
                <div className="space-y-1.5 w-full">
                  <div className="h-5 bg-white/5 rounded-xl w-32 skeleton-shimmer" />
                  <div className="h-3.5 bg-white/5 rounded-full w-24 skeleton-shimmer" />
                </div>
              </div>
            </div>

            {/* Simulated actions panel / Help skeleton */}
            <div className="rounded-3xl border border-dashed border-white/10 p-6 space-y-3">
              <div className="h-5 w-32 bg-white/5 rounded-xl skeleton-shimmer" />
              <div className="h-3 w-full bg-white/5 rounded-full skeleton-shimmer" />
              <div className="h-3 w-5/6 bg-white/5 rounded-full skeleton-shimmer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
