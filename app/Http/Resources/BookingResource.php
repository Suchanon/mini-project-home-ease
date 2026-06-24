<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                   => $this->id,
            'description'          => $this->description,
            'appointment_datetime' => $this->appointment_datetime,
            'address'              => $this->address,
            'status'               => $this->status,
            'price_charged'        => (float) $this->price_charged, // แปลงเป็น Float เพื่อความถูกต้องใน JSON

            // แสดงข้อมูลเพิ่มเติมเมื่อ Controller สั่ง Eager Load
            'user'                 => new UserResource($this->whenLoaded('user')),
            'service'              => new ServiceResource($this->whenLoaded('service')),
            'provider'             => new ProviderResource($this->whenLoaded('provider')),

            'created_at'           => $this->created_at,
            'updated_at'           => $this->updated_at,
        ];
    }
}
