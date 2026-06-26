'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Booking } from '@/lib/types';
import { cancelBookingAction, advanceBookingAction } from '@/lib/actions/bookings';
import { Calendar, MapPin, User, FileText, CheckCircle, Clock, Play, XCircle, ArrowLeft, ShieldAlert, Sparkles, Star, ChevronRight } from 'lucide-react';

interface BookingDetailClientProps {
  initialBooking: Booking;
}

export default function BookingDetailClient({ initialBooking }: BookingDetailClientProps) {
  const router = useRouter();
  const [booking, setBooking] = useState<Booking>(initialBooking);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const status = booking.status;

  // Configuration for stepper states
  const steps = [
    { key: 'pending', label: 'Pending Approval', desc: 'Awaiting provider confirmation', icon: <Clock className="h-5 w-5" /> },
    { key: 'accepted', label: 'Job Accepted', desc: 'Provider accepted your booking', icon: <CheckCircle className="h-5 w-5" /> },
    { key: 'in_progress', label: 'In Progress', desc: 'Provider is working on site', icon: <Play className="h-5 w-5 fill-current" /> },
    { key: 'completed', label: 'Completed', desc: 'Service successfully completed', icon: <CheckCircle className="h-5 w-5" /> },
  ];

  // Helper to determine step states: 'upcoming' | 'current' | 'completed'
  const getStepState = (stepKey: string): 'upcoming' | 'current' | 'completed' => {
    if (status === 'cancelled') return 'upcoming';

    const statusOrder = ['pending', 'accepted', 'in_progress', 'completed'];
    const currentIndex = statusOrder.indexOf(status);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    setErrorMsg('');
    setSuccessMsg('');

    startTransition(async () => {
      const res = await cancelBookingAction(booking.id);
      if (res.success && res.booking) {
        setBooking(res.booking);
        setSuccessMsg('Booking cancelled successfully.');
        router.refresh();
      } else {
        setErrorMsg(res.error || 'Failed to cancel booking.');
      }
    });
  };

  const handleAdvance = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    startTransition(async () => {
      const res = await advanceBookingAction(booking.id);
      if (res.success && res.booking) {
        setBooking(res.booking);
        const nextStepLabel = steps.find(s => s.key === res.booking.status)?.label || res.booking.status;
        setSuccessMsg(`Status advanced to "${nextStepLabel}" successfully.`);
        router.refresh();
      } else {
        setErrorMsg(res.error || 'Failed to advance booking status.');
      }
    });
  };

  // Format date-time for display
  const formatDateTime = (dtStr: string) => {
    try {
      const dt = new Date(dtStr.replace(' ', 'T'));
      return dt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dtStr;
    }
  };

  return (
    <div className="space-y-8">
      {/* Back button and title */}
      <div className="flex items-center justify-between">
        <Link
          href="/bookings"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to all bookings</span>
        </Link>
        <span className="text-xs text-slate-500 font-semibold">Booking ID #00{booking.id}</span>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="flex items-center gap-3 rounded-2xl bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20">
          <ShieldAlert className="h-5 w-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 p-4 text-sm text-emerald-400 border border-emerald-500/20">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* STEPPER PROGRESS TRACKER */}
      <div className="rounded-3xl border border-white/10 bg-[#0B0F19]/40 p-6 sm:p-8 backdrop-blur-md shadow-xl">
        <h2 className="text-sm font-bold text-white mb-8 border-b border-white/5 pb-3">Service Progress</h2>
        
        {status === 'cancelled' ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20">
              <XCircle className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white mt-4">This booking has been cancelled</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-sm">This service request was cancelled. If you still need help, please create a new booking.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Process Connector Line */}
            <div className="absolute top-[22px] left-[30px] right-[30px] h-0.5 bg-white/10 -z-10 hidden md:block" />
            
            {/* Stepper items */}
            <div className="grid gap-6 md:grid-cols-4 relative z-10">
              {steps.map((stepItem, idx) => {
                const stepState = getStepState(stepItem.key);
                
                let circleClass = 'border-white/10 bg-slate-900 text-slate-500';
                let titleClass = 'text-slate-500';
                let descClass = 'text-slate-600';
                
                if (stepState === 'completed') {
                  circleClass = 'border-cyan-500 bg-cyan-500/10 text-cyan-400';
                  titleClass = 'text-white font-bold';
                  descClass = 'text-slate-400';
                } else if (stepState === 'current') {
                  circleClass = 'border-cyan-500 bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 animate-pulse-slow';
                  titleClass = 'text-cyan-400 font-black';
                  descClass = 'text-slate-300';
                }

                return (
                  <div key={stepItem.key} className="flex md:flex-col items-center md:text-center gap-4 md:gap-3">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 transition-all duration-300 ${circleClass}`}>
                      {stepState === 'completed' ? <CheckCircle className="h-5 w-5 text-cyan-400" /> : stepItem.icon}
                    </div>
                    <div>
                      <h3 className={`text-sm tracking-tight ${titleClass}`}>{stepItem.label}</h3>
                      <p className={`text-xs mt-0.5 leading-relaxed md:max-w-[150px] md:mx-auto ${descClass}`}>{stepItem.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* BOOKING DETAILS & SERVICE INFO */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Details Panel */}
        <div className="md:col-span-2 rounded-3xl border border-white/10 bg-[#0B0F19]/40 p-6 sm:p-8 backdrop-blur-md space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-white/5 pb-3">Appointment Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-slate-500 block">Scheduled Time</span>
                <span className="text-sm font-semibold text-white">{formatDateTime(booking.appointment_datetime)}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-slate-500 block">Service Location Address</span>
                <span className="text-sm font-semibold text-white leading-relaxed">{booking.address}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-slate-500 block">Description of Issue</span>
                <p className="text-sm font-semibold text-white leading-relaxed whitespace-pre-wrap">{booking.description}</p>
              </div>
            </div>
          </div>

          {/* Cancellation controls */}
          {(status === 'pending' || status === 'accepted') && (
            <div className="pt-6 border-t border-white/5 flex justify-end">
              <button
                onClick={handleCancel}
                disabled={isPending}
                className="flex items-center gap-2 rounded-xl bg-red-500/10 px-5 py-3 text-sm font-bold text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20 hover:border-red-500/30 transition-all duration-200 disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" />
                <span>Cancel Booking</span>
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Info (Service & Provider) */}
        <div className="space-y-6">
          {/* Service Panel */}
          <div className="rounded-3xl border border-white/10 bg-[#0B0F19]/40 p-6 backdrop-blur-md">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Service Summary</h3>
            <h4 className="font-extrabold text-white text-md">{booking.service?.name}</h4>
            <span className="text-xs text-slate-400 block mt-1 line-clamp-2">{booking.service?.description}</span>
            <div className="mt-4 pt-4 border-t border-white/5 flex items-end justify-between">
              <span className="text-xs text-slate-500">Price Charged</span>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                ฿{Number(booking.price_charged).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Provider Panel */}
          <div className="rounded-3xl border border-white/10 bg-[#0B0F19]/40 p-6 backdrop-blur-md">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Assigned Provider</h3>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/15">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{booking.provider?.name}</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="flex items-center gap-0.5 rounded bg-yellow-500/10 px-1 py-0.5 text-[10px] font-bold text-yellow-400 border border-yellow-500/20">
                    <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                    <span>{booking.provider ? Number(booking.provider.rating).toFixed(1) : '5.0'}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">Phone: {booking.provider?.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DEVELOPER SIMULATION MODULE CONTROL PANEL */}
      <div className="rounded-3xl border border-dashed border-cyan-500/30 bg-[#081223]/30 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400">
              <Sparkles className="h-5 w-5" />
              <h3 className="font-bold text-white">Developer Simulation Panel</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
              Use this panel to simulate provider behaviors by advancing the booking status through the lifecycle steps: <br />
              <span className="text-cyan-400 font-semibold">Pending Approval</span> ➡️ <span className="text-cyan-400 font-semibold">Job Accepted</span> ➡️ <span className="text-cyan-400 font-semibold">In Progress</span> ➡️ <span className="text-cyan-400 font-semibold">Completed</span>.
            </p>
          </div>

          <button
            onClick={handleAdvance}
            disabled={isPending || status === 'completed' || status === 'cancelled'}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-6 py-3.5 text-sm font-extrabold text-[#080B11] shadow-lg shadow-cyan-500/20 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
          >
            {isPending ? (
              <span>Advancing...</span>
            ) : status === 'completed' ? (
              <span>Job Completed</span>
            ) : status === 'cancelled' ? (
              <span>Job Cancelled</span>
            ) : (
              <>
                <span>Advance Status</span>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
