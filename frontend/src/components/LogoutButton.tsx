'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { logoutAction } from '@/lib/actions/auth';

export default function LogoutButton() {
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    await logoutAction();
  };

  return (
    <>
      <form onSubmit={handleLogout} className="inline">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20 hover:border-red-500/30 transition-all duration-200 disabled:opacity-50 cursor-pointer"
        >
          <LogOut className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
          <span>{isPending ? 'Logging out...' : 'Logout'}</span>
        </button>
      </form>

      {/* Logout Transition: Overlay with Login Page Skeleton */}
      {isPending && (
        <div className="fixed inset-0 z-[100] bg-[#0C0A09] flex flex-col items-center justify-center px-4 animate-pulse">
          {/* Decorative blurred background shapes */}
          <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />
          
          <div className="w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-[#151210]/50 p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-white/5 skeleton-shimmer" />
              <div className="h-8 w-44 bg-white/5 rounded-xl skeleton-shimmer" />
              <div className="h-4 w-60 bg-white/5 rounded-full skeleton-shimmer" />
            </div>
            
            <div className="space-y-4 mt-8">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-white/5 rounded-full skeleton-shimmer" />
                <div className="h-12 w-full bg-white/5 rounded-xl skeleton-shimmer" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-white/5 rounded-full skeleton-shimmer" />
                <div className="h-12 w-full bg-white/5 rounded-xl skeleton-shimmer" />
              </div>
            </div>
            
            <div className="h-12 w-full bg-white/5 rounded-xl mt-6 skeleton-shimmer" />
          </div>
        </div>
      )}
    </>
  );
}
