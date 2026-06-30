export default function Loading() {
  return (
    <div className="relative min-h-screen bg-[#0C0A09]">
      {/* Decorative blurred background shapes — same opacity as real page */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-amber-600/10 blur-[130px] pointer-events-none" />

      {/* Hero Section Skeleton — matches page.tsx section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8 text-center">
        {/* Badge skeleton — matches inline-flex badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 h-6 w-44 mx-auto mb-6 skeleton-shimmer" />

        {/* Title skeleton — matches h1 font-serif text-4xl/6xl */}
        <div className="h-10 sm:h-14 bg-white/5 rounded-2xl max-w-3xl mx-auto mb-4 skeleton-shimmer" />
        <div className="h-10 sm:h-14 bg-white/5 rounded-2xl max-w-xl mx-auto mb-6 skeleton-shimmer" />

        {/* Subtitle skeleton — matches p mt-6 max-w-2xl text-lg */}
        <div className="mx-auto mt-6 max-w-2xl space-y-2">
          <div className="h-4 bg-white/5 rounded-full w-full skeleton-shimmer" />
          <div className="h-4 bg-white/5 rounded-full w-3/4 mx-auto skeleton-shimmer" />
        </div>

        {/* Search Bar Form Skeleton — matches form mt-10 max-w-xl */}
        <div className="mx-auto mt-10 max-w-xl">
          <div className="relative flex items-center">
            <div className="w-full h-14 rounded-2xl border border-white/10 bg-[#151210]/60 skeleton-shimmer" />
            {/* Search button placeholder */}
            <div className="absolute right-2 rounded-xl bg-white/5 border border-white/5 h-9 w-20 skeleton-shimmer" />
          </div>
        </div>

        {/* Popular Searches Skeleton — matches flex-wrap mt-5 */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
          <div className="h-4 w-24 bg-white/5 rounded-full skeleton-shimmer" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-6 w-16 rounded-full bg-white/5 border border-white/5 skeleton-shimmer" />
          ))}
        </div>
      </section>

      {/* Main Content Area Skeleton — matches section mx-auto max-w-7xl py-8 */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Categories Tab Bar Skeleton — matches flex-col space-y-4 structure */}
        <div className="flex flex-col space-y-4">
          {/* Header row — matches flex items-center justify-between border-b */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="h-8 bg-white/5 rounded-xl w-48 skeleton-shimmer" />
          </div>

          {/* Category tabs — matches flex flex-wrap gap-2 */}
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-2 h-11 bg-white/5 rounded-xl border border-white/5 w-32 skeleton-shimmer" />
            ))}
          </div>
        </div>

        {/* Services Grid Skeleton — matches mt-8 min-h-[480px] grid */}
        <div className="mt-8 min-h-[480px]">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-[#14110F]/40 p-6 shadow-xl backdrop-blur-xl">
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
      </section>

      {/* Highlight Features Skeleton — matches section border-t mt-16 py-16 */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-white/5 mt-16">
        <div className="grid gap-8 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 border border-orange-500/15 skeleton-shimmer" />
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-white/5 rounded-xl w-3/4 skeleton-shimmer" />
                <div className="h-3.5 bg-white/5 rounded-full w-full skeleton-shimmer" />
                <div className="h-3.5 bg-white/5 rounded-full w-5/6 skeleton-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
