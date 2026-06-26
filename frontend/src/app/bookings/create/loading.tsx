export default function BookingCreateLoading() {
  return (
    <div className="relative min-h-screen bg-[#0C0A09] py-12">
      {/* Background radial glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-orange-500/5 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton — matches text-center mb-8 */}
        <div className="text-center mb-8">
          {/* Badge — matches inline-flex rounded-full bg-orange-500/10 mb-3 */}
          <div className="h-6 w-32 bg-orange-500/10 rounded-full border border-orange-500/20 mx-auto mb-3 skeleton-shimmer" />
          {/* h1 — matches text-3xl font-extrabold sm:text-4xl */}
          <div className="h-9 w-64 bg-white/5 rounded-2xl mx-auto skeleton-shimmer" />
          {/* p — matches mt-2 text-sm */}
          <div className="h-4 w-96 max-w-full bg-white/5 rounded-full mx-auto mt-2 skeleton-shimmer" />
        </div>

        {/* Matches BookingFormClient space-y-6 wrapper */}
        <div className="space-y-6">
          {/* Service Info Summary Skeleton — matches rounded-3xl border bg-[#14110F]/40 p-6 backdrop-blur-md */}
          <div className="rounded-3xl border border-white/10 bg-[#14110F]/40 p-6 backdrop-blur-md">
            <div className="h-3 w-24 bg-white/5 rounded-full mb-2 skeleton-shimmer" />
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="h-6 w-48 bg-white/5 rounded-xl skeleton-shimmer" />
                <div className="h-4 w-72 bg-white/5 rounded-full mt-1 skeleton-shimmer" />
              </div>
              <div className="text-left sm:text-right shrink-0">
                <div className="h-3 w-16 bg-white/5 rounded-full skeleton-shimmer" />
                <div className="h-7 w-24 bg-white/5 rounded-xl mt-1 skeleton-shimmer" />
              </div>
            </div>
          </div>

          {/* Steps indicator Skeleton — matches flex items-center justify-between px-2 sm:px-6 */}
          <div className="flex items-center justify-between px-2 sm:px-6">
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

          {/* Main form content Skeleton — matches rounded-3xl border bg-[#14110F]/25 p-6 sm:p-8 backdrop-blur-xl shadow-2xl */}
          <div className="rounded-3xl border border-white/10 bg-[#14110F]/25 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
            {/* Section header — matches h3 + p */}
            <div>
              <div className="h-5 w-48 bg-white/5 rounded-xl skeleton-shimmer" />
              <div className="h-4 w-72 bg-white/5 rounded-full mt-1 skeleton-shimmer" />
            </div>

            {/* Grid of providers skeleton — matches grid gap-4 sm:grid-cols-2 */}
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="relative text-left p-5 rounded-2xl border border-white/10 bg-white/5"
                >
                  {/* Provider header — matches flex items-start justify-between gap-4 */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      {/* Avatar — matches h-10 w-10 rounded-xl bg-gradient-to-tr */}
                      <div className="h-10 w-10 rounded-xl bg-white/5 shrink-0 skeleton-shimmer" />
                      <div className="space-y-1.5">
                        <div className="h-5 bg-white/5 rounded-xl w-24 skeleton-shimmer" />
                        <div className="h-3.5 bg-white/5 rounded-full w-28 skeleton-shimmer" />
                      </div>
                    </div>
                    {/* Rating badge — matches rounded-lg bg-yellow-500/10 */}
                    <div className="h-5 w-12 bg-yellow-500/10 rounded-lg border border-yellow-500/20 shrink-0 skeleton-shimmer" />
                  </div>

                  {/* Bottom row — matches mt-4 border-t flex items-center justify-between */}
                  <div className="mt-4 border-t border-white/5 pt-3 flex items-center justify-between">
                    <div className="h-4 w-24 bg-white/5 rounded-full skeleton-shimmer" />
                    <div className="h-4 w-14 bg-white/5 rounded-full skeleton-shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
