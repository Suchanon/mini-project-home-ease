import Link from 'next/link';
import { fetchAPI } from '@/lib/api';
import { Service, Provider } from '@/lib/types';
import BookingFormClient from './BookingFormClient';

interface BookingFormSectionProps {
  serviceId: string;
}

export default async function BookingFormSection({ serviceId }: BookingFormSectionProps) {
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

  return <BookingFormClient service={service} providers={providers} />;
}
