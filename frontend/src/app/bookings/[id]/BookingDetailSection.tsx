import Link from 'next/link';
import { fetchAPI } from '@/lib/api';
import { Booking } from '@/lib/types';
import BookingDetailClient from './BookingDetailClient';

interface BookingDetailSectionProps {
  bookingId: string;
}

export default async function BookingDetailSection({ bookingId }: BookingDetailSectionProps) {
  let booking: Booking | null = null;
  let errorMsg = '';

  try {
    const res = await fetchAPI<{ data: Booking }>(`/api/bookings/${bookingId}`);
    booking = res.data;
  } catch (error) {
    console.error('Fetch booking detail error:', error);
    const err = error as { status?: number };
    if (err.status === 403) {
      errorMsg = 'You do not have permission to access this booking.';
    } else if (err.status === 404) {
      errorMsg = 'The requested booking could not be found.';
    } else {
      errorMsg = 'Failed to load booking details. Please try again.';
    }
  }

  if (errorMsg || !booking) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="rounded-3xl border border-red-500/10 bg-red-500/5 p-8">
          <p className="text-red-400 font-medium">{errorMsg || 'Booking details not found'}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/bookings"
              className="rounded-xl bg-white/5 hover:bg-white/10 px-5 py-2.5 text-sm font-semibold text-white border border-white/10 transition-all"
            >
              View All Bookings
            </Link>
            <Link
              href="/"
              className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/10 hover:shadow-orange-400/25 transition-all"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <BookingDetailClient initialBooking={booking} />;
}
