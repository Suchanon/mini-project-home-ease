'use client';

import { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { registerAction } from '@/lib/actions/auth';
import { KeyRound, Mail, Phone, ShieldAlert, Sparkles, User } from 'lucide-react';

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/bookings';

  const [state, formAction, isPending] = useActionState(registerAction, null);

  useEffect(() => {
    if (state?.success) {
      window.location.href = redirect;
    }
  }, [state, redirect]);

  return (
    <div className="flex min-h-[85vh] flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-[#0B0F19]/50 p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Register to start booking professional services with HomeEase
          </p>
        </div>

        <form action={formAction} className="mt-8 space-y-5">
          {state?.error && (
            <div className="flex items-center gap-3 rounded-2xl bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20 mb-6">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:border-cyan-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                  placeholder="John Doe"
                />
              </div>
              {state?.errors?.name && (
                <p className="mt-1.5 text-xs text-red-400">{state.errors.name[0]}</p>
              )}
            </div>

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
                  required
                  className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:border-cyan-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                  placeholder="john@example.com"
                />
              </div>
              {state?.errors?.email && (
                <p className="mt-1.5 text-xs text-red-400">{state.errors.email[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1.5">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Phone className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:border-cyan-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                  placeholder="+1 (555) 019-2834"
                />
              </div>
              {state?.errors?.phone && (
                <p className="mt-1.5 text-xs text-red-400">{state.errors.phone[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
                Password (min 8 characters)
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <KeyRound className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:border-cyan-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
              {state?.errors?.password && (
                <p className="mt-1.5 text-xs text-red-400">{state.errors.password[0]}</p>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex w-full justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/10 hover:shadow-cyan-400/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Registering...' : 'Sign Up'}
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-slate-400">Already have an account? </span>
            <Link
              href={redirect !== '/bookings' ? `/login?redirect=${redirect}` : '/login'}
              className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
            >
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
