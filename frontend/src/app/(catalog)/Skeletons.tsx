export function CategoriesSkeleton() {
  return (
    <div className="flex flex-col space-y-4">
      {/* Header row — matches flex items-center justify-between border-b */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="h-8 bg-white/5 rounded-xl w-48 skeleton-shimmer" />
      </div>

      {/* Category tabs — matches flex flex-wrap gap-2 */}
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center gap-2 h-11 bg-white/5 rounded-xl border border-white/5 w-32 skeleton-shimmer"
          />
        ))}
      </div>
    </div>
  );
}

export function ServicesSkeleton() {
  return (
    <div className="mt-8 min-h-[480px]">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-[#14110F]/40 p-6 shadow-xl backdrop-blur-xl"
          >
            <div>
              {/* Badge Category skeleton — matches flex items-center justify-between mb-4 */}
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-orange-500/10 rounded-lg w-20 border border-orange-500/15 skeleton-shimmer" />
              </div>

              {/* Service Name skeleton — matches h3 text-lg font-bold */}
              <div className="h-6 bg-white/5 rounded-xl w-3/4 mb-3 skeleton-shimmer" />

              {/* Service Description skeleton — matches p mt-2 text-sm line-clamp-3 */}
              <div className="mt-2 space-y-2">
                <div className="h-3.5 bg-white/5 rounded-full w-full skeleton-shimmer" />
                <div className="h-3.5 bg-white/5 rounded-full w-5/6 skeleton-shimmer" />
                <div className="h-3.5 bg-white/5 rounded-full w-4/6 skeleton-shimmer" />
              </div>
            </div>

            {/* Bottom section skeleton — matches mt-6 border-t flex items-end justify-between */}
            <div className="mt-6 border-t border-white/5 pt-4">
              <div className="flex items-end justify-between">
                <div>
                  <div className="h-3 bg-white/5 rounded-full w-16 mb-1 skeleton-shimmer" />
                  <div className="h-7 bg-white/5 rounded-xl w-24 skeleton-shimmer" />
                </div>
                <div className="h-10 bg-white/5 rounded-xl w-24 border border-white/10 skeleton-shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
