import Link from 'next/link';
import { fetchAPI } from '@/lib/api';
import { Booking } from '@/lib/types';
import { Calendar, User, Sparkles, ChevronRight, CheckCircle, Clock, AlertTriangle, Play, XCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BookingsHistoryPage() {
  let bookings: Booking[] = [];
  let errorMsg = '';

  try {
    const res = await fetchAPI<{ data: Booking[] }>('/api/bookings');
    bookings = res.data;
  } catch (error) {
    console.error('Fetch bookings error:', error);
    const err = error as { status?: number };
    if (err.status === 401) {
      errorMsg = 'Please login to view your booking history.';
    } else {
      errorMsg = 'Could not retrieve booking history at this time.';
    }
  }

  // Get status color and text configuration
  const getStatusConfig = (status: Booking['status']) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending',
          classes: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
          icon: <Clock className="h-3.5 w-3.5" />,
        };
      case 'accepted':
        return {
          label: 'Accepted',
          classes: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
          icon: <CheckCircle className="h-3.5 w-3.5" />,
        };
      case 'in_progress':
        return {
          label: 'In Progress',
          classes: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          icon: <Play className="h-3.5 w-3.5 fill-blue-400" />,
        };
      case 'completed':
        return {
          label: 'Completed',
          classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          icon: <CheckCircle className="h-3.5 w-3.5" />,
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          classes: 'bg-red-500/10 text-red-400 border-red-500/20',
          icon: <XCircle className="h-3.5 w-3.5" />,
        };
      default:
        return {
          label: status,
          classes: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
          icon: <AlertTriangle className="h-3.5 w-3.5" />,
        };
    }
  };

  // Format date-time for display
  const formatDateTime = (dtStr: string) => {
    try {
      const dt = new Date(dtStr.replace(' ', 'T'));
      return dt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dtStr;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#080B11] py-12">
      {/* Background radial glow */}
      <div className="absolute top-10 left-1/3 h-[500px] w-[500px] rounded-full bg-blue-600/5 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="h-3 w-3" />
              <span>Customer Portal</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              My Bookings & History
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Track your ongoing services or view past service history.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/10 hover:shadow-cyan-400/25 transition-all duration-200 shrink-0 text-center"
          >
            Book New Service
          </Link>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="rounded-3xl border border-red-500/15 bg-red-500/5 p-8 text-center">
            <p className="text-red-400 font-semibold">{errorMsg}</p>
            {errorMsg.includes('login') && (
              <Link
                href="/login"
                className="mt-4 inline-flex rounded-xl bg-cyan-500 hover:bg-cyan-400 px-6 py-2.5 text-sm font-bold text-white transition-all shadow-lg shadow-cyan-500/10"
              >
                Go to Login
              </Link>
            )}
          </div>
        )}

        {/* Bookings List */}
        {!errorMsg && (
          <div>
            {bookings.length === 0 ? (
              <div className="rounded-3xl border border-white/5 bg-[#0B0F19]/20 p-16 text-center backdrop-blur-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-slate-500">
                  <Calendar className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-lg font-bold text-white">No bookings yet</h3>
                <p className="mt-2 text-slate-400">Book a professional plumber, electrician, or AC technician to get started.</p>
                <Link
                  href="/"
                  className="mt-6 inline-flex rounded-xl bg-cyan-500 hover:bg-cyan-400 px-5 py-2.5 text-sm font-bold text-white transition-all shadow-lg shadow-cyan-500/10"
                >
                  Browse Services
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => {
                  const statusConf = getStatusConfig(booking.status);
                  return (
                    <Link
                      key={booking.id}
                      href={`/bookings/${booking.id}`}
                      className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl border border-white/10 bg-[#0B0F19]/40 hover:bg-[#0B0F19]/70 hover:border-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row items-start gap-4">
                        {/* Status Icon Indicator */}
                        <div className={`hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${statusConf.classes}`}>
                          {statusConf.icon}
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2.5">
                            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold border ${statusConf.classes}`}>
                              {statusConf.icon}
                              <span>{statusConf.label}</span>
                            </span>
                            <span className="text-xs text-slate-500">
                              Booking ID #00{booking.id}
                            </span>
                          </div>

                          <h3 className="text-lg font-extrabold text-white mt-1.5 group-hover:text-cyan-400 transition-colors">
                            {booking.service?.name || 'Home Service'}
                          </h3>
                          
                          {/* Booking brief metadata */}
                          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 mt-3 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5 text-slate-500" />
                              <span>{formatDateTime(booking.appointment_datetime)}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5 text-slate-500" />
                              <span>Provider: {booking.provider?.name || 'No provider assigned'}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Pricing and Link CTA */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                        <div className="text-left sm:text-right">
                          <span className="text-xs text-slate-500 block">Price Charged</span>
                          <span className="text-lg font-bold text-white">
                            ฿{Number(booking.price_charged).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-cyan-400 group-hover:translate-x-1.5 transition-transform text-sm font-semibold">
                          <span>View Details</span>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
