<?php

namespace App\Http\Controllers;

use App\Enums\BookingStatus;
use App\Http\Requests\CreateBookingRequest;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Models\Provider;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $booking = $request->user()->bookings()
            ->with(['service', 'provider'])
            ->latest()
            ->get();

        return BookingResource::collection($booking);
    }

    public function store(CreateBookingRequest $request)
    {
        $service = Service::findOrFail($request->service_id);
        $provider = Provider::findOrFail($request->provider_id);

        if ($provider->status !== 'available') {
            return response()->json([
                'message' => 'Provider is busy',
            ], 422);
        }
        $hasSkill = $provider->categories()
            ->where('categories.id', $service->category_id)
            ->exists();
        if (! $hasSkill) {
            return response()->json(['message' => 'provider has no skill in this category'], 422);
        }

        $booking = $request->user()->bookings()->create([
            'service_id' => $service->id,
            'provider_id' => $provider->id,
            'description' => $request->description,
            'appointment_datetime' => $request->appointment_datetime,
            'address' => $request->address,
            'price_charged' => $service->base_price, // ราคา Snapshot ณ ปัจจุบัน
            'status' => BookingStatus::Pending->value,
        ]);

        $booking->load(['service', 'provider']);

        return new BookingResource($booking);
    }

    public function show(Booking $booking)
    {
        Gate::authorize('view', $booking);
        $booking->load(['service', 'provider']);

        return new BookingResource($booking);
    }

    public function cancel(Booking $booking)
    {
        Gate::authorize('cancel', $booking);
        $booking->update([
            'status' => BookingStatus::Cancelled->value,
        ]);
        $booking->load(['service', 'provider']);

        return new BookingResource($booking);
    }
}
