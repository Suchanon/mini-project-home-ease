import Link from 'next/link';
import { cookies } from 'next/headers';
import { logoutAction } from '@/lib/actions/auth';
import { CalendarRange, LogIn, LogOut, Sparkles, UserPlus } from 'lucide-react';

export async function Navbar() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has('session_token');

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0B0F19]/70 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight">
                HomeEase
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
            >
              Our Services
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  href="/bookings"
                  className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
                >
                  <CalendarRange className="h-4 w-4" />
                  <span>My Bookings</span>
                </Link>
                <form action={logoutAction} className="inline">
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20 hover:border-red-500/30 transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 px-4 py-2 text-sm font-medium text-white border border-white/10 hover:border-white/20 transition-all duration-200"
                >
                  <LogIn className="h-4 w-4 text-cyan-400" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-cyan-500/10 hover:shadow-cyan-400/25 transition-all duration-200"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
