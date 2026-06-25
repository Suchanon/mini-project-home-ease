<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CatalogController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// ==========================================
// 1. Catalog Routes (Public - ทุกคนเข้าถึงได้)
// ==========================================
Route::get('/categories', [CatalogController::class, 'getCategories']);
Route::get('/services', [CatalogController::class, 'getServices']);
Route::get('/services/{service_id}/providers', [CatalogController::class, 'getServiceProviders']);

// ==========================================
// 2. Auth Routes (Public - สำหรับสมัครสมาชิก/เข้าสู่ระบบ)
// ==========================================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ==========================================
// 3. Protected Routes (ต้องมี Bearer Token เสมอ)
// ==========================================
Route::middleware('auth:sanctum')->group(function () {
    // ออกจากระบบ
    Route::post('/logout', [AuthController::class, 'logout']);

    // ดึงโปรไฟล์ผู้ใช้ปัจจุบัน
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // 🗓️ Booking Module (จัดการการจอง)
    Route::get('/bookings', [BookingController::class, 'index']);                 // ดูประวัติจองของตนเอง
    Route::post('/bookings', [BookingController::class, 'store']);                 // สร้างคำขอจองใหม่
    Route::get('/bookings/{booking}', [BookingController::class, 'show'])->middleware('can:view,booking');         // ดูรายละเอียดจองเฉพาะใบ
    Route::post('/bookings/{booking}/cancel', [BookingController::class, 'cancel'])->middleware('can:cancel,booking'); // ยกเลิกการจอง
});
