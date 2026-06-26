export default function BookingCreateLoading() {
  return (
    <div className="relative min-h-screen bg-[#0C0A09] py-12">
      {/* Background radial glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-orange-500/5 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="text-center mb-8 space-y-3">
          <div className="h-6 w-32 bg-white/5 rounded-full mx-auto skeleton-shimmer" />
          <div className="h-9 w-64 bg-white/5 rounded-2xl mx-auto skeleton-shimmer" />
          <div className="h-4 w-96 bg-white/5 rounded-full mx-auto skeleton-shimmer" />
        </div>

        {/* Selected Service Info Summary Skeleton */}
        <div className="rounded-3xl border border-white/10 bg-[#14110F]/40 p-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-3 w-28 bg-white/5 rounded-full skeleton-shimmer" />
            <div className="h-6 w-48 bg-white/5 rounded-xl skeleton-shimmer" />
            <div className="h-4 w-72 bg-white/5 rounded-full skeleton-shimmer" />
          </div>
          <div className="space-y-1 sm:text-right shrink-0">
            <div className="h-3 w-16 bg-white/5 rounded-full sm:ml-auto skeleton-shimmer" />
            <div className="h-7 w-24 bg-white/5 rounded-xl skeleton-shimmer" />
          </div>
        </div>

        {/* Steps indicator Skeleton */}
        <div className="flex items-center justify-between px-2 sm:px-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-white/5 border border-white/5 skeleton-shimmer" />
            <div className="h-4 w-28 bg-white/5 rounded-full skeleton-shimmer" />
          </div>
          <div className="flex-1 border-t border-dashed border-white/10 mx-4" />
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-white/5 border border-white/5 skeleton-shimmer" />
            <div className="h-4 w-32 bg-white/5 rounded-full skeleton-shimmer" />
          </div>
        </div>

        {/* Main form content Skeleton */}
        <div className="rounded-3xl border border-white/10 bg-[#14110F]/25 p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="h-5 w-48 bg-white/5 rounded-xl skeleton-shimmer" />
            <div className="h-4.5 w-72 bg-white/5 rounded-full skeleton-shimmer" />
          </div>

          {/* Grid of providers skeleton */}
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3 w-full">
                    <div className="h-10 w-10 rounded-xl bg-white/5 shrink-0 skeleton-shimmer" />
                    <div className="space-y-1.5 w-full">
                      <div className="h-5 bg-white/5 rounded-xl w-24 skeleton-shimmer" />
                      <div className="h-3.5 bg-white/5 rounded-full w-28 skeleton-shimmer" />
                    </div>
                  </div>
                  <div className="h-5 w-10 bg-white/5 rounded-lg shrink-0 skeleton-shimmer" />
                </div>
                
                <div className="mt-4 border-t border-white/5 pt-3 flex items-center justify-between">
                  <div className="h-4 w-20 bg-white/5 rounded-full skeleton-shimmer" />
                  <div className="h-4 w-12 bg-white/5 rounded-full skeleton-shimmer" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
