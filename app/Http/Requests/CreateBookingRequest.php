<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CreateBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'service_id' => 'required|integer|exists:services,id', // เช็คว่ามี ID นี้ในตาราง services จริง
            'provider_id' => 'required|integer|exists:providers,id', // เช็คว่ามี ID นี้ในตาราง providers จริง
            'description' => 'required|string|max:1000',
            'appointment_datetime' => 'required|date|after:now', // วันเวลาห้ามจองย้อนหลัง
            'address' => 'required|string|max:500',
        ];
    }
}
