<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProviderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'phone' => $this->phone,
            'status' => $this->status,
            'rating' => (float) $this->rating,
            // แสดงหมวดหมู่ที่เป็นทักษะของช่างคนนี้ (ถ้าโหลด)
            'skills' => CategoryResource::collection($this->whenLoaded('categories')),
        ];
    }
}
