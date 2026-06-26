'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBookingAction } from '@/lib/actions/bookings';
import { Service, Provider } from '@/lib/types';
import { Calendar, MapPin, FileText, Check, ArrowRight, ArrowLeft, Star, User, AlertCircle } from 'lucide-react';

interface BookingFormClientProps {
  service: Service;
  providers: Provider[];
}

export default function BookingFormClient({ service, providers }: BookingFormClientProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [description, setDescription] = useState('');
  const [datetime, setDatetime] = useState('');
  const [address, setAddress] = useState('');
  
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const handleSelectProvider = (provider: Provider) => {
    setSelectedProvider(provider);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvider) {
      setErrorMsg('Please select a provider before moving to the next step.');
      return;
    }
    if (!description || !datetime || !address) {
      setErrorMsg('Please fill in all appointment details.');
      return;
    }

    setIsPending(true);
    setErrorMsg('');
    setValidationErrors({});

    try {
      const res = await createBookingAction({
        service_id: service.id,
        provider_id: selectedProvider.id,
        description,
        appointment_datetime: datetime.replace('T', ' ') + ':00', // Format for Laravel datetime database
        address,
      });

      if (res.success && res.booking) {
        router.push(`/bookings/${res.booking.id}`);
        router.refresh();
      } else {
        setErrorMsg(res.error || 'An error occurred while creating your booking.');
        if (res.errors) {
          setValidationErrors(res.errors);
        }
      }
    } catch {
      setErrorMsg('An error occurred while sending the booking request.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Service Info Summary */}
      <div className="rounded-3xl border border-white/10 bg-[#0B0F19]/40 p-6 backdrop-blur-md">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Selected Service</h2>
        <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white">{service.name}</h3>
            <p className="text-sm text-slate-400 mt-1">{service.description || 'Professional home service by certified experts.'}</p>
          </div>
          <div className="text-left sm:text-right shrink-0">
            <span className="text-xs text-slate-500 block">Starting from</span>
            <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              ฿{Number(service.base_price).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center justify-between px-2 sm:px-6">
        <div className="flex items-center gap-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-xl font-bold text-sm transition-all duration-200 ${
            step === 1 ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}>
            {step > 1 ? <Check className="h-4 w-4" /> : '1'}
          </div>
          <span className={`text-sm font-semibold transition-colors ${step === 1 ? 'text-white' : 'text-slate-400'}`}>
            Select Provider
          </span>
        </div>
        <div className="flex-1 border-t border-dashed border-white/10 mx-4" />
        <div className="flex items-center gap-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-xl font-bold text-sm transition-all duration-200 ${
            step === 2 ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'bg-white/5 text-slate-500 border border-white/5'
          }`}>
            2
          </div>
          <span className={`text-sm font-semibold transition-colors ${step === 2 ? 'text-white' : 'text-slate-400'}`}>
            Schedule & Details
          </span>
        </div>
      </div>

      {/* Main Form content */}
      <div className="rounded-3xl border border-white/10 bg-[#0B0F19]/25 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        {errorMsg && (
          <div className="flex items-center gap-3 rounded-2xl bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20 mb-6">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Select Provider */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Available Service Providers</h3>
              <p className="text-sm text-slate-400 mt-1">Vetted service providers matching your required service skills.</p>
            </div>

            {providers.length === 0 ? (
              <div className="rounded-2xl border border-white/5 bg-white/5 p-12 text-center">
                <p className="text-slate-400">Sorry, no providers are currently available for this service.</p>
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="mt-4 rounded-xl bg-white/5 hover:bg-white/10 px-5 py-2 text-sm text-white border border-white/10"
                >
                  Choose Another Service
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {providers.map((p) => {
                  const isSelected = selectedProvider?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectProvider(p)}
                      className={`group relative text-left p-5 rounded-2xl border transition-all duration-200 ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-500/5 shadow-lg shadow-cyan-500/5'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500/10 to-blue-600/10 text-cyan-400 border border-cyan-500/15">
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-white group-hover:text-cyan-400 transition-colors">
                              {p.name}
                            </h4>
                            <span className="text-xs text-slate-400 block mt-0.5">Phone: {p.phone}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 rounded-lg bg-yellow-500/10 px-2 py-0.5 text-xs font-semibold text-yellow-400 border border-yellow-500/20 shrink-0">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{Number(p.rating).toFixed(1)}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Available Now
                        </span>
                        <span className="text-xs text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                          <span>Select</span>
                          <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Fill Booking Details */}
        {step === 2 && selectedProvider && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Appointment Details</h3>
                <p className="text-sm text-slate-400 mt-1">Provider: <span className="text-cyan-400 font-semibold">{selectedProvider.name}</span></p>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Change Provider</span>
              </button>
            </div>

            <div className="space-y-4">
              {/* Date & Time selection */}
              <div>
                <label htmlFor="datetime" className="block text-sm font-medium text-slate-300 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>Preferred Appointment Date & Time</span>
                  </div>
                </label>
                <input
                  id="datetime"
                  type="datetime-local"
                  required
                  value={datetime}
                  onChange={(e) => setDatetime(e.target.value)}
                  className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                />
                {validationErrors.appointment_datetime && (
                  <p className="mt-1.5 text-xs text-red-400">{validationErrors.appointment_datetime[0]}</p>
                )}
              </div>

              {/* Address selection */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-slate-300 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span>Service Location Address</span>
                  </div>
                </label>
                <textarea
                  id="address"
                  required
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g., 123/45 Sukhumvit Rd, Khlong Toei, Bangkok, 10110"
                  className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                />
                {validationErrors.address && (
                  <p className="mt-1.5 text-xs text-red-400">{validationErrors.address[0]}</p>
                )}
              </div>

              {/* Description field */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <span>Describe the Issue / Requirements</span>
                  </div>
                </label>
                <textarea
                  id="description"
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., The AC blower is loud and the air coming out is warm. We need someone to clean and inspect it."
                  className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                />
                {validationErrors.description && (
                  <p className="mt-1.5 text-xs text-red-400">{validationErrors.description[0]}</p>
                )}
              </div>
            </div>

            {/* Form actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-xl bg-white/5 hover:bg-white/10 px-5 py-3 text-sm font-semibold text-white border border-white/10 transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/10 hover:shadow-cyan-400/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? 'Saving Booking...' : 'Confirm Booking'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
