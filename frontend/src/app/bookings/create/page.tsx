import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Sparkles } from 'lucide-react';
import BookingFormSection from './BookingFormSection';
import { BookingFormSkeleton } from './Skeletons';

interface CreateBookingPageProps {
  searchParams: Promise<{ service_id?: string }>;
}

export default async function CreateBookingPage({ searchParams }: CreateBookingPageProps) {
  const params = await searchParams;
  const serviceId = params.service_id;

  if (!serviceId) {
    redirect('/');
  }

  return (
    <div className="relative min-h-screen bg-[#0C0A09] py-12">
      {/* Background radial glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-orange-500/5 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="h-3 w-3" />
            <span>Booking System</span>
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Book Home Service
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Please choose a service provider and schedule your appointment to complete your booking.
          </p>
        </div>

        <Suspense fallback={<BookingFormSkeleton />}>
          <BookingFormSection serviceId={serviceId} />
        </Suspense>
      </div>
    </div>
  );
}
