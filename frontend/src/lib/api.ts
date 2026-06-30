import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://mini-project.test';

export interface APIResponse<T> {
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export async function fetchAPI<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const tokenCookie = (await cookies()).get('session_token');
  const token = tokenCookie?.value;

  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const url = `${BACKEND_URL}${path.startsWith('/') ? '' : '/'}${path}`;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorMessage = errorData.message || `API request failed: ${res.status}`;
    const error = new Error(errorMessage) as Error & { status: number; errors: Record<string, string[]> | null };
    error.status = res.status;
    error.errors = errorData.errors || null;
    throw error;
  }

  return res.json();
}
