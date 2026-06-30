import Link from 'next/link';
import { fetchAPI } from '@/lib/api';
import { Category, Service } from '@/lib/types';
import { Search, Sparkles, Wrench, Zap, Droplets, CheckCircle, Star } from 'lucide-react';

interface PageProps {
  searchParams: Promise<{ search?: string; category_id?: string }>;
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || '';
  const categoryId = params.category_id || '';

  // Fetch categories and services
  let categories: Category[] = [];
  let services: Service[] = [];
  let errorMsg = '';

  let servicesPath = '/api/services';
  const queryParts: string[] = [];
  if (search) {
    queryParts.push(`search=${encodeURIComponent(search)}`);
  }
  if (categoryId) {
    queryParts.push(`category_id=${categoryId}`);
  }
  if (queryParts.length > 0) {
    servicesPath += `?${queryParts.join('&')}`;
  }

  try {
    const [catsRes, servicesRes] = await Promise.all([
      fetchAPI<{ data: Category[] }>('/api/categories', {
        next: { revalidate: 10 },
      }),
      fetchAPI<{ data: Service[] }>(servicesPath, {
        cache: 'no-store',
      })
    ]);

    categories = catsRes.data;
    services = servicesRes.data;
  } catch (error) {
    console.error('Fetch catalog error:', error);
    errorMsg = 'Could not retrieve services at this time. Please try again later.';
  }

  // Get category icon
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'plumbing':
        return <Droplets className="h-6 w-6 text-cyan-400" />;
      case 'electrical':
        return <Zap className="h-6 w-6 text-yellow-400" />;
      case 'ac-repair':
        return <Wrench className="h-6 w-6 text-blue-400" />;
      default:
        return <Sparkles className="h-6 w-6 text-purple-400" />;
    }
  };

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
        {/* Categories Tab Bar */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="font-serif text-2xl font-bold text-white tracking-tight">Services & Categories</h2>
            {search && (
              <span className="text-sm text-slate-400">
                Search results for &ldquo;<span className="text-orange-400">{search}</span>&rdquo;
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Link
              href={search ? `/?search=${encodeURIComponent(search)}` : '/'}
              scroll={false}
              className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium border transition-all duration-200 ${
                !categoryId
                  ? 'bg-gradient-to-r from-orange-500/10 to-amber-600/10 border-orange-500/30 text-orange-400 shadow-lg shadow-orange-500/5'
                  : 'bg-white/5 border-white/5 hover:border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <span>All Services</span>
            </Link>
            {categories.map((cat) => {
              const isActive = categoryId === String(cat.id);
              const href = search
                ? `/?category_id=${cat.id}&search=${encodeURIComponent(search)}`
                : `/?category_id=${cat.id}`;
              return (
                <Link
                  key={cat.id}
                  href={isActive ? (search ? `/?search=${encodeURIComponent(search)}` : '/') : href}
                  scroll={false}
                  className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium border transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500/10 to-amber-600/10 border-orange-500/30 text-orange-400 shadow-lg shadow-orange-500/5'
                      : 'bg-white/5 border-white/5 hover:border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {getCategoryIcon(cat.slug)}
                  <span>{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Error Messages */}
        {errorMsg && (
          <div className="mt-8 rounded-2xl bg-red-500/5 p-6 border border-red-500/10 text-center">
            <p className="text-red-400 font-medium">{errorMsg}</p>
          </div>
        )}

        {/* Services Grid */}
        {!errorMsg && (
          <div className="mt-8 min-h-[480px]">
            {services.length === 0 ? (
              <div className="rounded-3xl border border-white/5 bg-[#0B0F19]/20 p-16 text-center backdrop-blur-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-slate-400">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-lg font-bold text-white">No services found</h3>
                <p className="mt-2 text-slate-400">Try changing the category or search keyword.</p>
                {(search || categoryId) && (
                  <Link
                    href="/"
                    className="mt-6 inline-flex rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-all"
                  >
                    Clear All Filters
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((svc) => (
                  <div
                    key={svc.id}
                    className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-[#14110F]/40 p-6 hover:bg-[#14110F]/70 hover:border-orange-500/30 transition-all duration-300 shadow-xl backdrop-blur-xl"
                  >
                    <div>
                      {/* Badge Category */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-orange-500/10 px-2.5 py-1 text-xs font-semibold text-orange-400 border border-orange-500/15">
                          {svc.category?.name || 'Service'}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors duration-200">
                        {svc.name}
                      </h3>
                      <p className="mt-2 text-sm text-slate-400 line-clamp-3 leading-relaxed">
                        {svc.description || 'No description available.'}
                      </p>
                    </div>

                    <div className="mt-6 border-t border-white/5 pt-4">
                      <div className="flex items-end justify-between">
                        <div>
                          <span className="text-xs text-slate-500 block">Starting from</span>
                          <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                            ฿{Number(svc.base_price).toLocaleString()}
                          </span>
                        </div>
                        <Link
                          href={`/bookings/create?service_id=${svc.id}`}
                          className="rounded-xl bg-white/5 hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-600 px-4 py-2.5 text-sm font-semibold text-white border border-white/10 hover:border-transparent transition-all duration-200"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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
