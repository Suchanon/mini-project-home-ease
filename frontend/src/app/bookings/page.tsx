import { Suspense } from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import BookingsList from './BookingsList';
import { BookingsListSkeleton } from './Skeletons';

export const dynamic = 'force-dynamic';

export default function BookingsHistoryPage() {
  return (
    <div className="relative min-h-screen bg-[#0C0A09] py-12">
      {/* Background radial glow */}
      <div className="absolute top-10 left-1/3 h-[500px] w-[500px] rounded-full bg-amber-600/5 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="h-3 w-3" />
              <span>Customer Portal</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              My Bookings & History
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Track your ongoing services or view past service history.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/10 hover:shadow-orange-400/25 transition-all duration-200 shrink-0 text-center w-full sm:w-auto"
          >
            Book New Service
          </Link>
        </div>

        <Suspense fallback={<BookingsListSkeleton />}>
          <BookingsList />
        </Suspense>
      </div>
    </div>
  );
}
