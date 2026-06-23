# Phase 2: Customer Authentication (Sanctum)

ในเฟสนี้ เราจะสร้างระบบลงทะเบียน (Register), เข้าสู่ระบบ (Login) และออกจากระบบ (Logout) สำหรับลูกค้า (Customer) โดยใช้ **Laravel Sanctum**

---

## 💡 NestJS -> Laravel Auth Concept Mapping

* **NestJS/Passport JWT vs Laravel Sanctum:**
  * ใน NestJS คุณมักจะเขียน Custom Guards, Strategy, และสร้าง JWT Token (มี Access/Refresh tokens) ซึ่งฝั่ง Backend ต้องตรวจสอบ Signature และสิทธิ์ด้วยตนเองผ่าน Middleware/Guards
  * ใน Laravel, **Sanctum** มีฟังก์ชันพร้อมใช้สำหรับการออก API Token (เก็บไว้ในตาราง `personal_access_tokens`) โดยเมื่อส่ง Token ผ่าน HTTP Header (`Authorization: Bearer <token>`) ระบบจะนำไปจับคู่กับตารางและคืนค่าผู้ใช้ที่ล็อกอินอยู่ผ่าน Guard `auth:sanctum`

---

## 🛠️ Step-by-Step Implementation

### Step 1: ตรวจสอบความพร้อมของ Laravel Sanctum
ใน Laravel 11/13 ระบบ API มักจะมี Sanctum ถูกติดตั้งอยู่แล้ว หากยังไม่ได้ทำการตั้งค่าเส้นทางสำหรับ API ให้ตรวจสอบไฟล์คอนฟิกและรันคำสั่งเปิดใช้งาน API:
```bash
php artisan install:api
```
คำสั่งนี้จะสร้างไฟล์ `routes/api.php` และรัน Migration สร้างตาราง `personal_access_tokens`

---

### Step 2: สร้าง AuthController
สร้างคอนโทรลเลอร์สำหรับจัดการการเข้าสู่ระบบ:
```bash
php artisan make:controller AuthController
```

**สิ่งที่ต้องทำภายในคอนโทรลเลอร์:**
1. **`register` (สมัครสมาชิก):**
   * รับข้อมูล `name`, `email`, `password`, `phone`
   * ทำการตรวจสอบข้อมูล (Validation) เช่น อีเมลต้องห้ามซ้ำ, รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร
   * บันทึกข้อมูลลงฐานข้อมูล (เข้ารหัสผ่านด้วย `Hash::make()` หรือใช้ Laravel Automagic ใน Model)
   * สร้าง Token สำหรับลูกค้าใหม่ด้วย `$user->createToken('auth_token')->plainTextToken` และส่งกลับในรูปแบบ JSON
2. **`login` (เข้าสู่ระบบ):**
   * รับ `email` และ `password`
   * ตรวจสอบว่าอีเมลมีอยู่จริงและรหัสผ่านถูกต้องด้วย `Auth::attempt()` หรือ `Hash::check()`
   * หากผ่าน ให้ออก Token ใหม่และส่งกลับไปยังฝั่งผู้ใช้
3. **`logout` (ออกจากระบบ - Protected Route):**
   * ลบ Token ปัจจุบันที่กำลังใช้งานอยู่ของผู้ใช้ออกจากระบบผ่าน `$request->user()->currentAccessToken()->delete()` เพื่อให้ Token นั้นใช้ไม่ได้อีกต่อไป

---

### Step 3: กำหนดเส้นทาง (Routes) ใน `routes/api.php`
* เส้นทางสาธารณะ: `POST /register`, `POST /login`
* เส้นทางที่ต้องล็อกอิน (ใช้ Middleware `auth:sanctum`): `POST /logout`

---

## 🎯 Task ถัดไป (จะเริ่มต้นเมื่อจบ Phase 1)
เมื่อได้รับมอบหมาย ให้สร้าง `AuthController` ตั้งค่า Route และทดสอบการยิง API ด้วยเครื่องมือทดสอบ (เช่น Postman/Insomnia) เพื่อตรวจสอบความถูกต้องของการล็อกอินและออก Token
