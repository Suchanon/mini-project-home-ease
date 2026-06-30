import Link from 'next/link';
import { fetchAPI } from '@/lib/api';
import { Category, Service } from '@/lib/types';
import { Search, Sparkles, Wrench, Zap, Droplets } from 'lucide-react';

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

interface SectionProps {
  search: string;
  categoryId: string;
}

export async function CategoriesList({ search, categoryId }: SectionProps) {
  let categories: Category[] = [];
  try {
    const catsRes = await fetchAPI<{ data: Category[] }>('/api/categories', {
      next: { revalidate: 10 },
    });
    categories = catsRes.data;
  } catch (error) {
    console.error('Fetch categories error:', error);
  }

  return (
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
  );
}

export async function ServicesList({ search, categoryId }: SectionProps) {
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
    const servicesRes = await fetchAPI<{ data: Service[] }>(servicesPath, {
      cache: 'no-store',
    });
    services = servicesRes.data;
  } catch (error) {
    console.error('Fetch services error:', error);
    errorMsg = 'Could not retrieve services at this time. Please try again later.';
  }

  // Error Messages
  if (errorMsg) {
    return (
      <div className="mt-8 rounded-2xl bg-red-500/5 p-6 border border-red-500/10 text-center">
        <p className="text-red-400 font-medium">{errorMsg}</p>
      </div>
    );
  }

  return (
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
  );
}
