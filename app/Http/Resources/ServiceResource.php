<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
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
            'description' => $this->description,
            'base_price' => (float) $this->base_price, // แปลงเป็น Float เพื่อความถูกต้องใน JSON
            // แสดงข้อมูล Category ผูกกลับไป หากคอนโทรลเลอร์สั่งโหลดด้วย Eager Loading
            'category' => new CategoryResource($this->whenLoaded('category')),
        ];
    }
}
