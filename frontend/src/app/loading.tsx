export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] bg-[#0C0A09]">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      <p className="mt-4 text-sm text-slate-400 font-medium">Loading content...</p>
    </div>
  );
}
