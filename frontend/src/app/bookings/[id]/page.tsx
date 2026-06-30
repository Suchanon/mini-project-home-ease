import { Suspense } from 'react';
import { Sparkles } from 'lucide-react';
import BookingDetailSection from './BookingDetailSection';
import { BookingDetailSkeleton } from './Skeletons';

interface BookingDetailPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function BookingDetailPage({ params }: BookingDetailPageProps) {
  const resolvedParams = await params;
  const bookingId = resolvedParams.id;

  return (
    <div className="relative min-h-screen bg-[#0C0A09] py-12">
      {/* Background radial glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-orange-500/5 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="h-3 w-3" />
            <span>Real-time Status Tracker</span>
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Booking Status & Details
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Track your booking progress or use the developer panel to simulate the service provider workflow.
          </p>
        </div>

        <Suspense fallback={<BookingDetailSkeleton />}>
          <BookingDetailSection bookingId={bookingId} />
        </Suspense>
      </div>
    </div>
  );
}
