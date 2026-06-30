'use server';

import { fetchAPI } from '@/lib/api';
import { Booking } from '@/lib/types';
import { revalidatePath } from 'next/cache';

interface BookingPayload {
  service_id: number;
  provider_id: number;
  description: string;
  appointment_datetime: string;
  address: string;
}

export async function createBookingAction(payload: BookingPayload) {
  try {
    const res = await fetchAPI<{ data: Booking }>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    revalidatePath('/bookings');
    return { success: true, booking: res.data };
  } catch (error) {
    const err = error as { message?: string; errors?: Record<string, string[]> | null };
    return {
      success: false,
      error: err.message || 'Failed to create booking.',
      errors: err.errors || null,
    };
  }
}

export async function cancelBookingAction(bookingId: number) {
  try {
    const res = await fetchAPI<{ data: Booking }>(`/api/bookings/${bookingId}/cancel`, {
      method: 'POST',
    });

    revalidatePath('/bookings');
    revalidatePath(`/bookings/${bookingId}`);
    return { success: true, booking: res.data };
  } catch (error) {
    const err = error as { message?: string };
    return {
      success: false,
      error: err.message || 'Failed to cancel booking.',
    };
  }
}

export async function advanceBookingAction(bookingId: number) {
  try {
    const res = await fetchAPI<{ data: Booking }>(`/api/simulation/bookings/${bookingId}/advance`, {
      method: 'POST',
    });

    revalidatePath('/bookings');
    revalidatePath(`/bookings/${bookingId}`);
    return { success: true, booking: res.data };
  } catch (error) {
    const err = error as { message?: string };
    return {
      success: false,
      error: err.message || 'Failed to advance booking state.',
    };
  }
}
