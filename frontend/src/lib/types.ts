export type BookingStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  services_count?: number;
}

export interface Service {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  base_price: number;
  category?: Category;
}

export interface Provider {
  id: number;
  name: string;
  phone: string;
  status: 'available' | 'unavailable' | 'on_leave';
  rating: number;
}

export interface Booking {
  id: number;
  user_id: number;
  service_id: number;
  provider_id: number;
  description: string;
  appointment_datetime: string;
  address: string;
  status: BookingStatus;
  price_charged: number;
  created_at: string;
  updated_at: string;
  service?: Service;
  provider?: Provider;
}
