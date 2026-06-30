import { Suspense } from 'react';
import Link from 'next/link';
import { Search, Sparkles, CheckCircle, Star } from 'lucide-react';
import { CategoriesList, ServicesList } from './CatalogSections';
import { CategoriesSkeleton, ServicesSkeleton } from './Skeletons';

interface PageProps {
  searchParams: Promise<{ search?: string; category_id?: string }>;
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || '';
  const categoryId = params.category_id || '';

  return (
    <div className="relative min-h-screen bg-[#0C0A09]">
      {/* Decorative blurred background shapes */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-amber-600/10 blur-[130px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse-slow">
          <Sparkles className="h-3 w-3" />
          <span>Home Service Platform</span>
        </div>
        <h1 className="font-serif text-4xl font-extrabold sm:text-6xl tracking-tight bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent leading-tight">
          Book Reliable Home Services <br className="sm:hidden" />
          <span className="bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent italic">in Seconds</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
          Find top-rated plumbers, electricians, AC technicians, and home maintenance pros with upfront pricing and real-time status tracking.
        </p>

        {/* Search Bar Form */}
        <form action="/" method="GET" className="mx-auto mt-10 max-w-xl">
          {categoryId && <input type="hidden" name="category_id" value={categoryId} />}
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search services (e.g., leak repair, AC washing...)"
              className="block w-full rounded-2xl border border-white/10 bg-[#151210]/60 py-4 pl-12 pr-28 text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 shadow-2xl transition-all duration-200"
            />
            <button
              type="submit"
              className="absolute right-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 px-5 py-2 text-sm font-semibold text-white transition-all duration-200"
            >
              Search
            </button>
          </div>
        </form>

        {/* Popular Searches Suggestions */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5 text-xs text-slate-500">
          <span className="font-medium">Popular searches:</span>
          {['leak', 'wiring', 'AC cleaning', 'pipe'].map((term) => (
            <Link
              key={term}
              href={categoryId ? `/?category_id=${categoryId}&search=${encodeURIComponent(term)}` : `/?search=${encodeURIComponent(term)}`}
              className="rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 px-3 py-1 text-slate-300 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            >
              {term}
            </Link>
          ))}
        </div>
      </section>

      {/* Main Content Area */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Suspense fallback={<CategoriesSkeleton />}>
          <CategoriesList search={search} categoryId={categoryId} />
        </Suspense>

        <Suspense fallback={<ServicesSkeleton />}>
          <ServicesList search={search} categoryId={categoryId} />
        </Suspense>
      </section>

      {/* Highlight Features section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-white/5 mt-16">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex gap-4 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/15">
              <Star className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-white">Top-Rated Professionals</h4>
              <p className="mt-1 text-sm text-slate-400 leading-relaxed">All providers are fully vetted, skilled, and rated by customers.</p>
            </div>
          </div>
          <div className="flex gap-4 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/15">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-white">Upfront Transparent Pricing</h4>
              <p className="mt-1 text-sm text-slate-400 leading-relaxed">Know the baseline pricing before booking. No hidden fees or surprises.</p>
            </div>
          </div>
          <div className="flex gap-4 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/15">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-white">Real-Time Tracking</h4>
              <p className="mt-1 text-sm text-slate-400 leading-relaxed">Track the booking lifecycle and simulate job status transitions dynamically.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
