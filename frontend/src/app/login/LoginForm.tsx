'use client';

import { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { loginAction } from '@/lib/actions/auth';
import { KeyRound, Mail, ShieldAlert, Sparkles } from 'lucide-react';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/bookings';

  const [state, formAction, isPending] = useActionState(loginAction, null);

  useEffect(() => {
    if (state?.success) {
      window.location.href = redirect;
    }
  }, [state, redirect]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-[#151210]/50 p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white">
            Login to HomeEase
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Manage your bookings and find top-rated providers
          </p>
        </div>

        <form action={formAction} className="mt-8 space-y-6">
          {state?.error && (
            <div className="flex items-center gap-3 rounded-2xl bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:border-orange-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all duration-200"
                  placeholder="name@example.com"
                />
              </div>
              {state?.errors?.email && (
                <p className="mt-1.5 text-xs text-red-400">{state.errors.email[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <KeyRound className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:border-orange-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
              {state?.errors?.password && (
                <p className="mt-1.5 text-xs text-red-400">{state.errors.password[0]}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="flex w-full justify-center rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/10 hover:shadow-orange-400/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Logging in...' : 'Sign In'}
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-slate-400">Don&apos;t have an account? </span>
            <Link
              href={redirect !== '/bookings' ? `/register?redirect=${redirect}` : '/register'}
              className="font-medium text-orange-400 hover:text-orange-300 hover:underline transition-colors"
            >
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
