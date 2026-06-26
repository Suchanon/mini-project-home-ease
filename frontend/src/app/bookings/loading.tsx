export default function BookingsHistoryLoading() {
  return (
    <div className="relative min-h-screen bg-[#0C0A09] py-12">
      {/* Background radial glow */}
      <div className="absolute top-10 left-1/3 h-[500px] w-[500px] rounded-full bg-amber-600/5 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton — matches flex-col sm:flex-row sm:items-center sm:justify-between */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6 mb-8">
          <div>
            {/* Badge — matches inline-flex rounded-full bg-orange-500/10 */}
            <div className="h-6 w-32 bg-orange-500/10 rounded-full border border-orange-500/20 mb-3 skeleton-shimmer" />
            {/* h1 — matches text-3xl font-extrabold */}
            <div className="h-9 w-64 bg-white/5 rounded-2xl skeleton-shimmer" />
            {/* p — matches mt-1 text-sm */}
            <div className="h-4 w-80 bg-white/5 rounded-full mt-1 skeleton-shimmer" />
          </div>
          {/* CTA button — matches rounded-xl bg-gradient-to-r px-5 py-3 */}
          <div className="h-12 w-40 bg-white/5 rounded-xl shrink-0 skeleton-shimmer" />
        </div>

        {/* Bookings List Skeleton — matches space-y-4 */}
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl border border-white/10 bg-[#14110F]/40"
            >
              <div className="flex flex-col sm:flex-row items-start gap-4">
                {/* Status Icon Indicator — matches hidden sm:flex h-12 w-12 rounded-xl */}
                <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 skeleton-shimmer" />

                <div>
                  {/* Status badge + Booking ID — matches flex items-center gap-2.5 */}
                  <div className="flex items-center gap-2.5">
                    <div className="h-5 w-24 bg-white/5 rounded-md skeleton-shimmer" />
                    <div className="h-4 w-28 bg-white/5 rounded-md skeleton-shimmer" />
                  </div>

                  {/* Service Title — matches h3 text-lg font-extrabold mt-1.5 */}
                  <div className="h-6 w-48 bg-white/5 rounded-xl mt-1.5 skeleton-shimmer" />

                  {/* Metadata fields — matches flex flex-wrap gap-y-1.5 gap-x-4 mt-3 */}
                  <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 mt-3">
                    <div className="h-4 w-36 bg-white/5 rounded-full skeleton-shimmer" />
                    <div className="h-4 w-44 bg-white/5 rounded-full skeleton-shimmer" />
                  </div>
                </div>
              </div>

              {/* Pricing & CTA — matches flex items-center justify-between sm:justify-end gap-6 */}
              <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                <div className="text-left sm:text-right">
                  <div className="h-3 w-16 bg-white/5 rounded-full sm:ml-auto mb-1 skeleton-shimmer" />
                  <div className="h-6 w-24 bg-white/5 rounded-xl skeleton-shimmer" />
                </div>
                {/* View Details CTA — matches flex items-center gap-1 text-sm */}
                <div className="flex items-center gap-1">
                  <div className="h-4 w-20 bg-white/5 rounded-lg skeleton-shimmer" />
                  <div className="h-4 w-4 bg-white/5 rounded skeleton-shimmer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
