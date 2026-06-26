export default function Loading() {
  return (
    <div className="relative min-h-screen bg-[#0C0A09]">
      {/* Decorative blurred background shapes */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-amber-600/5 blur-[130px] pointer-events-none" />

      {/* Hero Section Skeleton */}
      <section className="relative mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 h-6 w-44 mx-auto mb-6 skeleton-shimmer" />
        
        {/* Title skeleton */}
        <div className="h-10 sm:h-14 bg-white/5 rounded-2xl max-w-3xl mx-auto mb-4 skeleton-shimmer" />
        <div className="h-10 sm:h-14 bg-white/5 rounded-2xl max-w-xl mx-auto mb-6 skeleton-shimmer" />

        {/* Subtitle skeleton */}
        <div className="h-4 bg-white/5 rounded-full max-w-2xl mx-auto mb-2 skeleton-shimmer" />
        <div className="h-4 bg-white/5 rounded-full max-w-lg mx-auto mb-10 skeleton-shimmer" />

        {/* Search Bar Form Skeleton */}
        <div className="mx-auto max-w-xl relative flex items-center">
          <div className="w-full h-14 rounded-2xl border border-white/5 bg-[#151210]/60 skeleton-shimmer" />
        </div>
      </section>

      {/* Main Content Area Skeleton */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Categories Tab Bar Skeleton */}
        <div className="flex flex-col space-y-4 border-b border-white/10 pb-4">
          <div className="h-8 bg-white/5 rounded-xl w-48 skeleton-shimmer" />
          
          <div className="flex flex-wrap gap-2 pb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-11 bg-white/5 rounded-xl border border-white/5 w-32 skeleton-shimmer" />
            ))}
          </div>
        </div>

        {/* Services Grid Skeleton */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#14110F]/40 p-6 h-64">
              <div>
                {/* Category Badge skeleton */}
                <div className="h-5 bg-white/5 rounded-lg w-20 mb-4 skeleton-shimmer" />
                
                {/* Service Name skeleton */}
                <div className="h-6 bg-white/5 rounded-xl w-3/4 mb-3 skeleton-shimmer" />
                
                {/* Service Description skeleton */}
                <div className="space-y-2">
                  <div className="h-3 bg-white/5 rounded-full w-full skeleton-shimmer" />
                  <div className="h-3 bg-white/5 rounded-full w-5/6 skeleton-shimmer" />
                  <div className="h-3 bg-white/5 rounded-full w-4/6 skeleton-shimmer" />
                </div>
              </div>

              {/* Bottom section skeleton */}
              <div className="mt-6 border-t border-white/5 pt-4 flex items-end justify-between">
                <div className="space-y-1">
                  <div className="h-3 bg-white/5 rounded-full w-16 skeleton-shimmer" />
                  <div className="h-6 bg-white/5 rounded-xl w-24 skeleton-shimmer" />
                </div>
                <div className="h-10 bg-white/5 rounded-xl w-24 border border-white/10 skeleton-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
