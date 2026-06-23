# Phase 4: Booking Engine & Authorization Rules

ในเฟสนี้เป็นส่วนสำคัญที่สุดของระบบ (Core Engine) โดยเราจะจัดการระบบการจองบริการ (Booking) พร้อมทั้งตรวจสอบสิทธิ์และความถูกต้องอย่างเข้มงวด

---

## 💡 NestJS -> Laravel Booking Concept Mapping

* **NestJS DTO/Validation Pipe vs Laravel Form Request:**
  * ใน NestJS คุณประกาศ Class DTO และใช้ Decorators เช่น `@IsNotEmpty()`, `@IsDateString()` ตกแต่งฟิลด์ จากนั้นใช้ `ValidationPipe` ตรวจสอบข้อมูลก่อนส่งถึง Controller
  * ใน Laravel จะมี **Form Request** (`php artisan make:request CreateBookingRequest`) ที่มี 2 เมธอดหลักคือ:
    1. `authorize()`: สำหรับตรวจสอบสิทธิ์เบื้องต้นก่อนทำธุรกรรม
    2. `rules()`: คืนค่า Array ของเงื่อนไขการตรวจสอบ (Validation Rules) เช่น `'appointment_datetime' => 'required|date|after:now'`
* **Guards / RBAC vs Laravel Policies:**
  * ใน NestJS คุณมักใช้ Guard ร่วมกับ CASL ในการสแกนหาความเป็นเจ้าของ Resource
  * ใน Laravel จะมี **Policies** (`php artisan make:policy BookingPolicy --model=Booking`) ที่ผูกสิทธิ์เข้ากับตัว Eloquent Model โดยตรง เหมาะอย่างยิ่งสำหรับเช็คสิทธิ์แบบ Resource-based (เช่น ตรวจสอบว่าผู้ใช้ที่กำลังล็อกอินอยู่มีสถานะเป็นเจ้าของ Booking ชิ้นนี้จริงหรือไม่)
* **Snapshot Pattern:**
  * เมื่อลูกค้ากดจองบริการ เราต้องคัดลอกข้อมูลสำคัญ ณ ช่วงเวลานั้นเก็บไว้ (เช่น `price_charged` คัดลอกมาจาก `base_price` ของ `Service`) เพื่อไม่ให้ประวัติการเงินเพี้ยนหากแอดมินแก้ไขราคาบริการในภายหลัง

---

## 🛠️ Step-by-Step Implementation

### Step 1: สร้าง Form Request สำหรับทำ Validate ข้อมูลขาเข้า
สร้างคลาสสำหรับตรวจสอบคำขอจอง:
```bash
php artisan make:request CreateBookingRequest
```
เงื่อนไขการตรวจสอบ:
* `service_id`: ต้องมีอยู่จริงในตาราง `services`
* `provider_id`: ต้องมีอยู่จริงในตาราง `providers`
* `description`: ต้องไม่เป็นค่าว่าง
* `appointment_datetime`: ต้องระบุวันที่และเวลาที่ถูกต้อง (ควรเช็คไม่ให้จองย้อนหลัง)
* `address`: ต้องไม่เป็นค่าว่าง

---

### Step 2: สร้างและตั้งค่า BookingPolicy
สร้างนโยบายป้องกันข้อมูล:
```bash
php artisan make:policy BookingPolicy --model=Booking
```
**กำหนดสิทธิ์:**
1. **`view(User $user, Booking $booking)`:**
   * สิทธิ์ดูข้อมูลรายละเอียด: `$user->id === $booking->user_id` (อนุญาตเฉพาะเจ้าของเท่านั้น)
2. **`cancel(User $user, Booking $booking)`:**
   * สิทธิ์ยกเลิกการจอง: ลูกค้าต้องเป็นเจ้าของและสถานะปัจจุบันของ Booking ต้องมีค่าเป็น `pending` หรือ `accepted` เท่านั้น

---

### Step 3: สร้าง BookingController และใส่ Logic
สร้างคอนโทรลเลอร์:
```bash
php artisan make:controller BookingController
```

**เมธอดและ Logic ที่ต้องทำ:**
1. **`store(CreateBookingRequest $request)` (สร้างการจองใหม่ - Protected):**
   * **Double-Check Validation (Business Logic Layer):**
     * ดึงข้อมูลผู้ใช้ออกมา `$user = $request->user()`
     * ดึงช่างที่เลือก ตรวจสอบว่าช่างมีสถานะเป็น `available` จริงหรือไม่
     * ดึงบริการที่เลือก ตรวจสอบว่าหมวดหมู่ของบริการนั้นตรงกับทักษะช่าง (ผ่านตารางกลาง `provider_skills`) จริงหรือไม่ หากไม่ตรง ให้หยุดการจองและแจ้งข้อผิดพลาดพร้อมรหัสตอบรับที่เหมาะสม (เช่น 422 Unprocessable Entity)
   * **บันทึกข้อมูล:**
     * คัดลอกราคาฐานของบริการมาระบุใน `price_charged`
     * กำหนดสถานะการจองตั้งต้นเป็น `pending`
     * ทำการบันทึกข้อมูล
2. **`index(Request $request)` (ดูประวัติการจองของตนเอง - Protected):**
   * ดึงรายการจองเฉพาะที่เป็นของตนเองเท่านั้น `$user->bookings()->with(['service', 'provider'])->get()`
3. **`show(Booking $booking)` (ดูรายละเอียดเฉพาะเจาะจง - Protected):**
   * บังคับใช้สิทธิ์การตรวจสอบด้วย Policy: `$this->authorize('view', $booking)`
   * ส่งคืนข้อมูลโดยฟอร์แมตผ่าน `BookingResource`
4. **`cancel(Booking $booking)` (ยกเลิกการจอง - Protected):**
   * บังคับใช้สิทธิ์การตรวจสอบด้วย Policy: `$this->authorize('cancel', $booking)`
   * ปรับสถานะการจองเป็น `cancelled` และบันทึกข้อมูลลงฐานข้อมูล

---

### Step 4: กำหนดเส้นทาง (Routes) ใน `routes/api.php`
ห่อกลุ่มเส้นทางทั้งหมดนี้ด้วย Middleware สำหรับล็อกอิน `auth:sanctum`:
* `POST /bookings`
* `GET /bookings`
* `GET /bookings/{id}`
* `POST /bookings/{id}/cancel`

---

## 🎯 Task ถัดไป (จะเริ่มต้นเมื่อจบ Phase 3)
ทำการเขียน Logic และลงทะเบียนนโยบายความปลอดภัย รวมถึงทดสอบว่าลูกค้าคนอื่นไม่สามารถดึงข้อมูลจองข้ามสายงานของลูกค้าคนแรกได้ (ต้องส่งกลับเป็น 403 Forbidden)
