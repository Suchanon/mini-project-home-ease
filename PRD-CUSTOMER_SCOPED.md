ในเอกสารฉบับที่คุณแนบมาล่าสุดนี้ (**PRD-CUSTOMER_SCOPED.md**) **ยังไม่มีหัวข้อเรื่อง Authorization (การควบคุมสิทธิ์) แยกออกมาอธิบายอย่างละเอียดครับ** มีเพียงการโน้ตสั้น ๆ ไว้ที่ฝั่ง API Endpoints ในส่วนของ `GET /api/bookings/{id}` ว่า *(ต้องเช็ค Policy ไม่ให้ User คนอื่นมาแอบดู)* เท่านั้นครับ

เพื่อให้เอกสาร Requirement ฉบับนี้สมบูรณ์แบบและพร้อมใช้งานจริงสำหรับคุณ ผมได้ทำการ**อัปเดตเพิ่มหัวข้อ "5. Authorization & Data Security (สิทธิ์การเข้าถึงข้อมูล)"** พร้อมทั้งจัดลำดับข้อใหม่ให้เรียบร้อยแล้ว คุณสามารถคัดลอก (Copy) เอกสารฉบับเต็มด้านล่างนี้ไปใช้งานได้เลยครับ:

---

# Backend Requirement Document: HomeEase (Customer Scoped)

> **As of June 2026** (อิงตามสถาปัตยกรรม Laravel 11+ ที่เน้นความ Minimalist ในโครงสร้างโฟลเดอร์)

## 1. Project Overview & Scope

เป้าหมายของโปรเจคนี้คือการสร้าง RESTful API สำหรับแพลตฟอร์มเรียกช่าง/บริการในบ้าน โดยเน้นหนักไปที่ฝั่ง **Customer** ส่วนฝั่ง **Provider และ Admin** จะใช้ **Laravel Seeders / Factories** ในการเตรียมข้อมูลเข้า Database เพื่อให้ระบบตรวจสอบสถานะและความถูกต้องของช่าง (Provider Validation Engine) สามารถทำงานได้สมบูรณ์

---

## 2. System Architecture & Component Mapping

เพื่อให้คุณเห็นภาพเปรียบเทียบจากโลกของ **NestJS** สู่ **Laravel**:

| Feature / Concept | NestJS Equivalent | Laravel Paradigm |
| --- | --- | --- |
| **Authentication** | Passport JWT / Custom Guard | **Laravel Sanctum** (Token-based API auth ตัวเบา) |
| **Data Validation** | `class-validator` + DTOs | **Form Requests** (`php artisan make:request`) |
| **Database ORM** | Prisma / TypeORM | **Eloquent ORM** (Active Record Pattern) |
| **Mock Data** | Custom Script / Hardcoded | **Database Seeder & Model Factories** (ทรงพลังมาก) |

---

## 3. Database Schema & Entities (Detailed Specification)

ใน Laravel จะนิยมใช้ชื่อตารางเป็น **Snake_case และเป็นพหูพจน์ (Plural)** โดยตัว Model จะเป็น CamelCase และเป็นเอกพจน์ (Singular) เช่น ตาราง `users` จะคู่กับ Model `User`

### Diagram ความสัมพันธ์ (ER-Diagram Concept)

```
users (1) ───────────────< bookings (N) >─────────────── (1) services
                             │ (N)
                             │
                             ▼ (1)
                         providers (N) ───< provider_skills >─── (N) categories

```

---

### รายละเอียดโครงสร้างแต่ละตาราง (Table Definitions)

#### 1. ตาราง `users` (เก็บข้อมูลลูกค้า)

* **Model:** `User`

| Field Name | Data Type | Constraints / Attributes | Description |
| --- | --- | --- | --- |
| `id` | BigInt (Auto Increments) | Primary Key | ID ของ User (Laravel Default) |
| `name` | String (varchar) | Not Null | ชื่อ-นามสกุล ของลูกค้า |
| `email` | String (varchar) | Unique, Not Null | อีเมลใช้สำหรับ Login |
| `password` | String (varchar) | Not Null | รหัสผ่านที่เข้ารหัสแล้ว (Bcrypt) |
| `phone` | String (varchar) | Nullable | เบอร์โทรศัพท์ลูกค้า |
| `created_at` | Timestamp | Nullable | วันเวลาที่สมัครสมาชิก |
| `updated_at` | Timestamp | Nullable | วันเวลาที่อัปเดตข้อมูลล่าสุด |

#### 2. ตาราง `categories` (หมวดหมู่หลักของบริการ)

* **Model:** `Category`
* **Seed Data Note:** ข้อมูลส่วนนี้จะถูกใส่ไว้ล่วงหน้าผ่าน Seeder เช่น หมวดหมู่ไฟฟ้า, ประปา, ล้างแอร์

| Field Name | Data Type | Constraints / Attributes | Description |
| --- | --- | --- | --- |
| `id` | BigInt (Auto Increments) | Primary Key | ID ของหมวดหมู่ |
| `name` | String (varchar) | Unique, Not Null | ชื่อหมวดหมู่ (e.g., 'Plumbing', 'AC Repair') |
| `slug` | String (varchar) | Unique, Not Null | เอาไว้ทำ URL สวย ๆ (e.g., 'ac-repair') |
| `description` | Text | Nullable | รายละเอียดของหมวดหมู่ |
| `created_at` / `updated_at` | Timestamp | Nullable | วันเวลาระบบ |

#### 3. ตาราง `services` (บริการย่อยภายใต้หมวดหมู่)

* **Model:** `Service`
* **Relationships:** `belongsTo` Category (`category_id`)

| Field Name | Data Type | Constraints / Attributes | Description |
| --- | --- | --- | --- |
| `id` | BigInt (Auto Increments) | Primary Key | ID ของบริการ |
| `category_id` | BigInt (Unsigned) | Foreign Key `categories.id` ON DELETE CASCADE | ผูกกับหมวดหมู่หลัก |
| `name` | String (varchar) | Not Null | ชื่อบริการ (e.g., 'ล้างแอร์ติดผนัง 9000-12000 BTU') |
| `description` | Text | Nullable | รายละเอียดบริการ |
| `base_price` | Decimal (8, 2) | Not Null, Default: 0.00 | ราคาเริ่มต้นของบริการนี้ |
| `created_at` / `updated_at` | Timestamp | Nullable | วันเวลาระบบ |

#### 4. ตาราง `providers` (ข้อมูลช่าง - Seeded Only)

* **Model:** `Provider`

| Field Name | Data Type | Constraints / Attributes | Description |
| --- | --- | --- | --- |
| `id` | BigInt (Auto Increments) | Primary Key | ID ของช่าง |
| `name` | String (varchar) | Not Null | ชื่อช่าง |
| `phone` | String (varchar) | Not Null | เบอร์ติดต่อช่าง |
| `avatar_url` | String (varchar) | Nullable | รูปโปรไฟล์ช่าง |
| `status` | Enum | Not Null, Default: 'available' | สถานะช่าง: `available`, `unavailable`, `on_leave` |
| `rating` | Decimal (3, 2) | Nullable, Default: 5.00 | คะแนนรีวิวเฉลี่ยเอาไว้โชว์ลูกค้า |
| `created_at` / `updated_at` | Timestamp | Nullable | วันเวลาระบบ |

#### 5. ตาราง `provider_skills` (ตาราง Pivot เชื่อมช่างกับหมวดหมู่ที่ทำได้)

* **Model:** ไม่มี Model เฉพาะ (เรียกผ่าน Many-to-Many Relation ใน Provider/Category)

| Field Name | Data Type | Constraints / Attributes | Description |
| --- | --- | --- | --- |
| `provider_id` | BigInt (Unsigned) | Foreign Key `providers.id` ON DELETE CASCADE | ID ของช่าง |
| `category_id` | BigInt (Unsigned) | Foreign Key `categories.id` ON DELETE CASCADE | ID ของหมวดหมู่ที่ช่างทำได้ |

* *Note: กำหนดให้ Composite Primary Key คือ (`provider_id`, `category_id`)*

#### 6. ตาราง `bookings` (หัวใจหลักของ Customer Flow)

* **Model:** `Booking`
* **Relationships:** `belongsTo` User (`user_id`), `belongsTo` Service (`service_id`), `belongsTo` Provider (`provider_id`)

| Field Name | Data Type | Constraints / Attributes | Description |
| --- | --- | --- | --- |
| `id` | BigInt (Auto Increments) หรือ UUID | Primary Key | ID ของการจอง |
| `user_id` | BigInt (Unsigned) | Foreign Key `users.id` ON DELETE RESTRICT | ลูกค้าผู้ทำการจอง |
| `service_id` | BigInt (Unsigned) | Foreign Key `services.id` ON DELETE RESTRICT | บริการที่เลือก |
| `provider_id` | BigInt (Unsigned) | Foreign Key `providers.id` ON DELETE RESTRICT | ช่างที่ลูกค้าเลือก |
| `description` | Text | Not Null | รายละเอียดปัญหาที่ลูกค้าแจ้ง |
| `appointment_datetime` | DateTime | Not Null | วันและเวลาที่นัดหมายให้ช่างเข้าพบ |
| `address` | Text | Not Null | ที่อยู่หน้างานของลูกค้า |
| `status` | Enum | Not Null, Default: 'pending' | State ของงาน: `pending`, `accepted`, `in_progress`, `completed`, `cancelled` |
| `price_charged` | Decimal (8, 2) | Not Null | ราคาสุทธิ ณ ตอนที่กดจอง (คัดลอกมาจาก `services.base_price`) |
| `created_at` / `updated_at` | Timestamp | Nullable | วันเวลาระบบ |

---

## 💡 NestJS/Prisma Developer Tips to Laravel Eloquent

1. **Prisma `@relation` vs Laravel Eloquent Methods:**
ใน Laravel คุณเขียนความสัมพันธ์เป็นฟังก์ชันใน Model แทนการประกาศในสคีมาฐานข้อมูลซ้ำซ้อน:

```php
// ใน Model User.php (1 User มีได้หลาย Bookings)
public function bookings(): HasMany {
    return $this->hasMany(Booking::class);
}

// ใน Model Booking.php (Booking นี้เป็นของ User คนไหน)
public function user(): BelongsTo {
    return $this->belongsTo(User::class);
}

```

2. **Many-to-Many (ตาราง `provider_skills`):**
ใน Model `Provider` สามารถดึงข้อมูลความสามารถทั้งหมดออกมาได้ง่าย ๆ ด้วย `belongsToMany`:

```php
public function categories(): BelongsToMany {
    return $this->belongsToMany(Category::class, 'provider_skills');
}

```

3. **Data Integrity (Snapshot Pattern):**
ฟิลด์ `price_charged` ในตาราง `bookings` มีไว้เพื่อคัดลอกราคา ณ วันที่จองมาเก็บไว้ ป้องกันราคาประวัติศาสตร์เพี้ยนหากแอดมินแก้ไขราคาบริการในภายหลัง

---

## 4. System Logic & Workflow (Backend Engine)

### A. Provider Selection & Validation Logic (จังหวะเลือกและสร้าง Booking)

เมื่อปรับสวิตช์เป็นให้ Customer สามารถเลือกช่างเองได้โดยตรง ระบบ Backend จะต้องทำงานขนานกัน 2 จังหวะดังนี้:

1. **จังหวะดึงรายชื่อช่าง (Browsing Providers):** เมื่อเรียก API ดูรายชื่อช่างผ่านบริการที่เลือก ระบบต้องคัดกรองช่าง (`providers`) ที่มี Skill ตรงกับ `category_id` ของบริการนั้น และต้องมีสถานะ `status = 'available'` เท่านั้น ถึงจะส่งออกไปให้ลูกค้าเลือกได้
2. **จังหวะสร้างการจอง (Double-Check Validation):** เมื่อ Customer ส่งคำขอสร้าง Booking ข้อมูลจะประกอบด้วยบริการและช่างที่เลือก หลังบ้านต้องทำจุดตรวจสอบ (Guard) เพื่อความปลอดภัย:
* เช็คว่าช่างคนนั้นยังมีสถานะเป็น `available` อยู่จริง ณ วินาทีที่กดจอง
* เช็คว่าช่างคนนั้นมี Skill ตรงกับหมวดหมู่บริการดังกล่าวจริง (ป้องกันการยิง API ปลอมหรือส่ง Parameter ข้ามสายงาน)


3. เมื่อ Validation ผ่านเรียบร้อย ระบบจะทำการบันทึกข้อมูลลงตารางจอง และปรับ Status แรกเริ่มของ Booking เป็น `Pending`

### B. Booking State Machine

การเปลี่ยน State ของตาราง `bookings` ต้องเป็นไปตามเงื่อนไขนี้ (เขียน Logic ตรวจสอบใน Service/Controller):

```
Pending  →  Accepted  →  In-Progress  →  Completed
                                      ↘  Cancelled

```

* **Customer Actions:** ทำได้แค่สร้าง (`Pending`) และยกเลิก (`Cancelled`) **เฉพาะตอนที่สถานะยังเป็น Pending หรือ Accepted เท่านั้น**
* **Simulation Helper (แทนฝั่ง Provider):** เพื่อให้คุณทดสอบ Flow จนจบ (`Completed`) ได้โดยไม่ต้องทำหน้าช่าง ให้สร้าง **Artisan Command** หรือ **Hidden API Route** สำหรับสั่งเปลี่ยนสถานะเพื่อทดสอบ Logic ตัวอย่างเช่น:
* `php artisan booking:advance {booking_id}` (สั่งให้เขยิบไป State ถัดไปเพื่อเช็คการเปลี่ยนผ่านข้อมูล)



---

## 5. Authorization & Data Security (สิทธิ์การเข้าถึงข้อมูล)

ในโปรเจคนี้ที่โฟกัสฝั่ง Customer หัวใจสำคัญของความปลอดภัยคือ **"ลูกค้าต้องมีสิทธิ์เข้าถึงและจัดการได้เฉพาะข้อมูลที่เป็นของตนเองเท่านั้น"** ระบบจะใช้ **Laravel Policies** (เปรียบเสพติดเหมือน NestJS Guard + Resource Ownership Check) ในการควบคุมสิทธิ์ระดับ Resource-based บน Model `Booking`

### A. สิทธิ์ในการเข้าถึงพิกัดต่างๆ (Authorization Rules)

1. **`view` (ดูรายละเอียดการจอง):** ลูกค้าจะสามารถดูข้อมูลใน `GET /api/bookings/{id}` ได้ก็ต่อเมื่อ `user_id` ของผู้ที่ล็อกอินอยู่ ตรงกับ `user_id` เจ้าของใบจองนั้น
2. **`cancel` (ยกเลิกการจอง):** ลูกค้าจะสามารถกดยกเลิกได้ก็ต่อเมื่อ:
* เป็นเจ้าของใบจองใบนั้น (`user_id` ตรงกัน)
* **และ** ใบจองนั้นต้องมีสถานะเป็น `pending` หรือ `accepted` เท่านั้น (Business Logic Guard)



### B. สถาปัตยกรรมที่แนะนำใน Laravel (Implementation Guide)

* รันคำสั่งสร้างนโยบายความปลอดภัย: `php artisan make:policy BookingPolicy --model=Booking`
* ตัวอย่างการจัดการสิทธิ์ภายในไฟล์ `BookingPolicy.php`:

```php
namespace App\Policies;

use App\Models\Booking;
use App\Models\User;

class BookingPolicy
{
    public function view(User $user, Booking $booking): bool
    {
        return $user->id === $booking->user_id;
    }

    public function cancel(User $user, Booking $booking): bool
    {
        return $user->id === $booking->user_id 
            && in_array($booking->status, ['pending', 'accepted']);
    }
}

```

* การเรียกใช้งานใน Controller เพื่อบังคับใช้สิทธิ์ (Enforcement):

```php
// ใน BookingController.php@show
public function show(Booking $booking) {
    $this->authorize('view', $booking); // ถ้าไม่ผ่านจะส่ง 403 Forbidden กลับทันที
    return new BookingResource($booking);
}

```

---

## 6. API Endpoints Specification

### Auth Module (Public / Authenticated)

* `POST /api/register` -> สมัครสมาชิก (Customer)
* `POST /api/login` -> ล็อกอิน ได้รับ Bearer Token (Sanctum)
* `POST /api/logout` -> ทำลาย Token (Protected)

### Service & Provider Catalogue Module (Public)

* `GET /api/categories` -> ดูหมวดหมู่ทั้งหมด
* `GET /api/services` -> ดูบริการทั้งหมด (รองรับ Query Params: `?category_id=1` และ `?search=ล้างแอร์`)
* **`GET /api/services/{service_id}/providers`** -> ดึงรายชื่อช่างทั้งหมดที่**ว่าง**และ**ทำบริการนี้ได้** เพื่อเอาไปโชว์ให้ลูกค้าเลือกบนหน้าจอ

### Booking Module (Protected - Customer Only)

* `POST /api/bookings` -> สร้างการจองใหม่ โดยระบุช่างที่ต้องการ (Payload: `service_id`, `provider_id`, `description`, `appointment_datetime`, `address`)
* `GET /api/bookings` -> ดูประวัติการจองของตัวเอง (ดึงเฉพาะ `user_id` ของคนที่ล็อกอินอยู่)
* `GET /api/bookings/{id}` -> ดูรายละเอียดการจองรายตัว *(เช็คสิทธิ์ผ่าน BookingPolicy@view)*
* `POST /api/bookings/{id}/cancel` -> ยกเลิกการจองโดยลูกค้า *(เช็คสิทธิ์ผ่าน BookingPolicy@cancel)*

### Simulation Module (Protected - For Dev Environment Only)

* `POST /api/simulation/bookings/{id}/advance` -> บังคับเขยิบ State ของ Booking เพื่อจำลองพฤทีตกรรมของช่าง (เช่น จาก `Pending` -> `Accepted`) เอาไว้ใช้ยิง Postman เทสตัว State Machine

---

## 7. Checklist & Steps สำหรับการเริ่มสร้างใน Laravel

เพื่อให้คุณลุยได้อย่างเป็นระบบตามแบบฉบับ Laravel Way แนะนำให้ทำตาม Step นี้ครับ:

1. **Setup Project & Sanctum:** สร้างโปรเจคด้วย Laravel 11 และลง Laravel Sanctum สำหรับระบบ API Auth
2. **Database, Factories & Seeders:**
* สร้าง Migration ตารางทั้งหมด
* เขียน `CategorySeeder`, `ServiceSeeder`
* เขียน `ProviderFactory` เพื่อสุ่มสร้างข้อมูลช่าง 10-20 คน พร้อมผูก Skills ให้เรียบร้อยตอนรัน `php artisan db:seed`


3. **Form Requests (DTO-like):**
* สร้าง `CreateBookingRequest` เพื่อทำ Validation ข้อมูลที่รับมาจาก Customer (เช่น เช็คฟอร์แมตวันที่, ตรวจว่า `service_id` และ `provider_id` มีอยู่จริงและช่างมีสถานะ `available` ในฐานข้อมูล)


4. **Booking Service & Policy Protection:**
* เขียน Logic ตรวจสอบตบเท้าชั้นสุดท้าย (Business Logic Validation) ว่าช่างที่เลือกมี Skill ตรงกับหมวดหมู่ของ `service_id` ที่ส่งมาจริง ๆ ก่อนจะทำการ `insert` ข้อมูลลงตารางจอง
* นำ `BookingPolicy` ไปผูกใช้งานใน Controller เพื่อล็อกสิทธิ์ข้อมูลส่วนบุคคล


5. **API Resource (Serialization):**
* ใช้ **Laravel API Resources** ในการจัด Format JSON Response ก่อนส่งกลับหา Client เพื่อตัดฟิลด์ที่ไม่จำเป็น เช่น `password` หรือ `updated_at` ออกไป