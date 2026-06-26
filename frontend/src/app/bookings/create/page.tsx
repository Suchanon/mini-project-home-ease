import { redirect } from 'next/navigation';
import { fetchAPI } from '@/lib/api';
import { Service, Provider } from '@/lib/types';
import BookingFormClient from './BookingFormClient';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

interface CreateBookingPageProps {
  searchParams: Promise<{ service_id?: string }>;
}

export default async function CreateBookingPage({ searchParams }: CreateBookingPageProps) {
  const params = await searchParams;
  const serviceId = params.service_id;

  if (!serviceId) {
    redirect('/');
  }

  let service: Service | null = null;
  let providers: Provider[] = [];
  let errorMsg = '';

  try {
    // Fetch all services to find the details of the selected service
    const servicesRes = await fetchAPI<{ data: Service[] }>('/api/services');
    service = servicesRes.data.find((s) => String(s.id) === serviceId) || null;

    if (!service) {
      errorMsg = 'The service you selected could not be found.';
    } else {
      // Fetch available providers for this service
      const providersRes = await fetchAPI<{ data: Provider[] }>(
        `/api/services/${service.id}/providers`
      );
      providers = providersRes.data;
    }
  } catch {
    errorMsg = 'Could not retrieve booking details at this time. Please try again.';
  }

  if (errorMsg || !service) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="rounded-3xl border border-red-500/10 bg-red-500/5 p-8">
          <p className="text-red-400 font-medium">{errorMsg || 'Invalid service details'}</p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl bg-white/5 hover:bg-white/10 px-5 py-2.5 text-sm font-semibold text-white border border-white/10"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#080B11] py-12">
      {/* Background radial glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
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

        {/* Client Form Component */}
        <BookingFormClient service={service} providers={providers} />
      </div>
    </div>
  );
}
