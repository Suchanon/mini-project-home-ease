<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;

class BookingPolicy
{
    // ตรวจสอบสิทธิ์ว่าลูกค้าสามารถกดดูใบจองใบนี้ได้ไหม
    public function view(User $user, Booking $booking): bool
    {
        // ต้องเป็นเจ้าของใบจองนี้เท่านั้น
        return $user->id === $booking->user_id;
    }

    // ตรวจสอบสิทธิ์ว่าลูกค้าสามารถยกเลิกได้ไหม
    public function cancel(User $user, Booking $booking): bool
    {
        // 1. ต้องเป็นเจ้าของใบจอง
        // 2. สถานะปัจจุบันต้องเป็น pending หรือ accepted เท่านั้น (จองเสร็จแล้ว/ยกเลิกไปแล้ว ห้ามยกเลิกซ้ำ)
        return $user->id === $booking->user_id
            && in_array($booking->status, ['pending', 'accepted']);
    }
}
