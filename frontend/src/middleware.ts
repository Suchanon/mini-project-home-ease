import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute = pathname.startsWith('/bookings');
  const isAuthRoute = pathname === '/login' || pathname === '/register';

  if (isProtectedRoute && !token) {
    // Redirect to login page and preserve the redirect URL
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && token) {
    // Already logged in, redirect to home or bookings
    return NextResponse.redirect(new URL('/bookings', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/bookings/:path*', '/login', '/register'],
};
