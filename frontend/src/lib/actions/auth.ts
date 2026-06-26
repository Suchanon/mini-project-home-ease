'use server';

import { cookies } from 'next/headers';
import { fetchAPI } from '@/lib/api';

interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
  };
  access_token: string;
  token_type: string;
}

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  try {
    const res = await fetchAPI<AuthResponse>('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Save token in cookie
    const cookieStore = await cookies();
    cookieStore.set('session_token', res.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Login failed.',
      errors: error.errors || null,
    };
  }
}

export async function registerAction(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return { success: false, error: 'Name, email, and password are required.' };
  }

  try {
    const res = await fetchAPI<AuthResponse>('/api/register', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        phone: phone || null,
        password,
      }),
    });

    // Save token in cookie
    const cookieStore = await cookies();
    cookieStore.set('session_token', res.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Registration failed.',
      errors: error.errors || null,
    };
  }
}

export async function logoutAction() {
  try {
    await fetchAPI('/api/logout', {
      method: 'POST',
    });
  } catch (err) {
    // Ignore error on logout endpoint and clear cookie anyway
    console.error('Logout API error:', err);
  }

  const cookieStore = await cookies();
  cookieStore.delete('session_token');
}
