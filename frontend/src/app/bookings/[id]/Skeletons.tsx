export function BookingDetailSkeleton() {
  return (
    <div className="space-y-8">
      {/* Back button + Booking ID row — matches flex items-center justify-between */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-36 bg-white/5 rounded-full skeleton-shimmer" />
        <div className="h-4 w-28 bg-white/5 rounded-full skeleton-shimmer" />
      </div>

      {/* Stepper Progress Tracker — matches rounded-3xl bg-[#0B0F19]/40 p-6 sm:p-8 */}
      <div className="rounded-3xl border border-white/10 bg-[#0B0F19]/40 p-6 sm:p-8 backdrop-blur-md shadow-xl">
        {/* Section title — matches h2 text-sm font-bold mb-8 border-b pb-3 */}
        <div className="border-b border-white/5 pb-3 mb-8">
          <div className="h-4 w-28 bg-white/5 rounded-full skeleton-shimmer" />
        </div>

        {/* 4 steps — matches grid gap-6 md:grid-cols-4 */}
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex md:flex-col items-center md:text-center gap-4 md:gap-3">
              {/* Circle — matches h-11 w-11 rounded-2xl border-2 */}
              <div className="h-11 w-11 shrink-0 rounded-2xl bg-white/5 border-2 border-white/10 skeleton-shimmer" />
              <div className="space-y-1.5">
                <div className="h-4 bg-white/5 rounded-full w-24 md:mx-auto skeleton-shimmer" />
                <div className="h-3 bg-white/5 rounded-full w-32 md:w-[150px] md:mx-auto skeleton-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two-Column details — matches grid gap-6 md:grid-cols-3 */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Panel: Main details (Span 2) — matches md:col-span-2 rounded-3xl bg-[#14110F]/40 */}
        <div className="md:col-span-2 rounded-3xl border border-white/10 bg-[#14110F]/40 p-6 sm:p-8 backdrop-blur-md space-y-6">
          <div className="h-5 w-44 bg-white/5 rounded-xl border-b border-white/5 pb-3 skeleton-shimmer" />

          {/* Metadata items — matches space-y-4 with icon + label + value */}
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="h-5 w-5 bg-white/5 rounded shrink-0 mt-0.5 skeleton-shimmer" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 w-24 bg-white/5 rounded-full skeleton-shimmer" />
                  <div className="h-4 w-56 bg-white/5 rounded-lg skeleton-shimmer" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Sidebar (Span 1) — matches space-y-6 */}
        <div className="space-y-6">
          {/* Service Panel — matches rounded-3xl bg-[#14110F]/40 p-6 */}
          <div className="rounded-3xl border border-white/10 bg-[#14110F]/40 p-6 backdrop-blur-md space-y-3">
            <div className="h-3 w-24 bg-white/5 rounded-full skeleton-shimmer" />
            <div className="h-5 w-36 bg-white/5 rounded-xl skeleton-shimmer" />
            <div className="h-3 w-full bg-white/5 rounded-full skeleton-shimmer" />
            <div className="mt-4 pt-4 border-t border-white/5 flex items-end justify-between">
              <div className="h-3 w-20 bg-white/5 rounded-full skeleton-shimmer" />
              <div className="h-6 w-20 bg-white/5 rounded-xl skeleton-shimmer" />
            </div>
          </div>

          {/* Provider Panel — matches rounded-3xl bg-[#14110F]/40 p-6 */}
          <div className="rounded-3xl border border-white/10 bg-[#14110F]/40 p-6 backdrop-blur-md space-y-4">
            <div className="h-3 w-28 bg-white/5 rounded-full skeleton-shimmer" />
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/15 shrink-0 skeleton-shimmer" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 bg-white/5 rounded-xl w-32 skeleton-shimmer" />
                <div className="flex items-center gap-1.5">
                  <div className="h-3.5 w-10 bg-yellow-500/10 rounded border border-yellow-500/20 skeleton-shimmer" />
                  <div className="h-3 w-24 bg-white/5 rounded-full skeleton-shimmer" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Simulation Panel — matches rounded-3xl border-dashed border-orange-500/30 */}
      <div className="rounded-3xl border border-dashed border-orange-500/30 bg-[#171310]/30 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-orange-500/10 rounded skeleton-shimmer" />
              <div className="h-5 w-48 bg-white/5 rounded-xl skeleton-shimmer" />
            </div>
            <div className="space-y-1.5 mt-1">
              <div className="h-3 bg-white/5 rounded-full w-full max-w-xl skeleton-shimmer" />
              <div className="h-3 bg-white/5 rounded-full w-4/5 max-w-xl skeleton-shimmer" />
            </div>
          </div>
          <div className="h-12 w-full sm:w-40 bg-orange-500/10 rounded-xl border border-orange-500/15 shrink-0 skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}
