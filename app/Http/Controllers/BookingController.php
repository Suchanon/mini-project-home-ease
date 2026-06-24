<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateBookingRequest;
use App\Http\Resources\BookingResource;
use App\Models\Provider;
use App\Models\Service;

class BookingController extends Controller
{
    public function store(CreateBookingRequest $request)
    {
        $service = Service::findOrFail($request->service_id);
        $provider = Provider::findOrFail($request->provider_id);

        if ($provider->status !== 'available') {
            return response()->json([
                'message' => 'Provider is busy'
            ], 422);
        }
        $hasSkill = $provider->categories()
            ->where('categories.id', $service->category_id)
            ->exists();
        if (!$hasSkill) {
            return response()->json(['message' => 'provider has no skill in this category'], 422);
        }

        $booking = $request->user()->bookings()->create([
            'service_id'           => $service->id,
            'provider_id'          => $provider->id,
            'description'          => $request->description,
            'appointment_datetime' => $request->appointment_datetime,
            'address'              => $request->address,
            'price_charged'        => $service->base_price, // ราคา Snapshot ณ ปัจจุบัน
            'status'               => 'pending',
        ]);

        $booking->load(['service', 'provider']);
        return new BookingResource($booking);
    }
}
