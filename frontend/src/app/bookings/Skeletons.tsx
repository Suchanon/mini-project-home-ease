export function BookingsListSkeleton() {
  return (
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
              <div className="h-6 w-24 bg-white/5 rounded-xl sm:ml-auto skeleton-shimmer" />
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
  );
}
