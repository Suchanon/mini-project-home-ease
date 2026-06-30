'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] px-4 text-center bg-[#0C0A09]">
      <h2 className="text-xl font-bold text-white">Something went wrong!</h2>
      <p className="mt-2 text-sm text-slate-400 max-w-md">We encountered an unexpected error loading this section.</p>
      <button
        onClick={() => reset()}
        className="mt-6 rounded-xl bg-orange-500 hover:bg-orange-400 px-5 py-2.5 text-sm font-semibold text-slate-900 transition-all"
      >
        Try again
      </button>
    </div>
  );
}
