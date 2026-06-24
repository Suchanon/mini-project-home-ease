# HomeEase Development Log & Learning Journey

บันทึกขั้นตอนการพัฒนาและการตัดสินใจเชิงเทคนิค (Technical Decisions) สำหรับใช้อธิบายในช่วง Code Review

---

## 🗄️ Phase 1: Database Setup & Eloquent Relationships

### Step 1: Database Migrations Setup
**วันที่บันทึก:** 2026-06-23

#### 1. วิธีการทำและการเปลี่ยนแปลงโครงสร้างโค้ด
*   รันคำสั่งสร้างสเกลเลตันไฟล์ Migration สำหรับตารางที่เกี่ยวข้อง: `categories`, `services`, `providers`, `provider_skills` (pivot), และ `bookings`
*   แก้ไขไฟล์ [0001_01_01_000000_create_users_table.php](file:///Users/alex_m3/Herd/mini-project/database/migrations/0001_01_01_000000_create_users_table.php) เพื่อเพิ่มคอลัมน์ `phone` (Nullable) สำหรับเบอร์โทรลูกค้า
*   เขียนโครงสร้างสกีมาของตารางแต่ละตารางในโฟลเดอร์ `database/migrations/` ตามสเปกความสัมพันธ์ 1:N และ N:M (ตาราง Pivot)

#### 2. การตัดสินใจเชิงเทคนิค (Technical Decisions)
*   **การตัด `avatar_url` ออกจากตาราง `providers`:** ตัดสินใจตัดทิ้งเนื่องจากตัวระบบเน้นทดสอบ Backend RESTful API และ Business Logic ฝั่ง Customer เป็นหลัก การตัดออกทำให้โมเดลและ Seeder ของช่างไม่มีฟิลด์ที่ไม่ได้ใช้งาน (Clutter-free)
*   **การกำหนดค่าเริ่มต้นให้กับ `rating` ของช่างเป็น `5.00`:** ในแง่ Product Design การเปิดบัญชีช่างใหม่ควรเริ่มต้นด้วยภาพลักษณ์ที่ดี (5 ดาวเต็ม) ดีกว่าการกำหนดค่าเริ่มต้นเป็น `0.00` ซึ่งทำให้ช่างดูมีคะแนนประเมินแย่มาก หรือปล่อยให้เป็น Null ซึ่งจะแสดงผลยากบนฝั่ง Client

#### 3. การแก้ปัญหาเชิงลึก: ปัญหาเรื่องลำดับการรัน Migration (Migration Order Issue)
*   **ปัญหาที่พบ:** ไฟล์ Migration ที่สร้างขึ้นใหม่มี Timestamp เดียวกัน (`2026_06_23_075739_`) ทำให้ Laravel ประมวลผลรันไฟล์เรียงลำดับตามตัวอักษรภาษาอังกฤษ ส่งผลให้ตาราง `bookings` (ขึ้นต้นด้วย b) พยายามรันขึ้นมาก่อนตาราง `providers` (p) และ `services` (s) ที่ตาราง `bookings` ต้องไปอ้างอิง Foreign Key 
*   **ผลกระทบ:** แม้จะรันบน SQLite ผ่าน แต่ถ้าสลับไปรันบน Production/Staging ที่ใช้ **MySQL หรือ PostgreSQL จะเกิด Error Foreign Key Constraint ทันที** เนื่องจากตารางที่ใช้อ้างอิงยังไม่ถูกสร้าง
*   **การแก้ไข:** ทำการเปลี่ยนชื่อ (Rename) เลขวินาทีของ Timestamp บนชื่อไฟล์เพื่อจัดลำดับขั้นตอนการรันให้ถูกต้องตามหลัก Dependency-first:
    1.  `categories` (ตารางแม่หลัก)
    2.  `services` (ขึ้นกับ categories)
    3.  `providers` (ตารางแม่ช่าง)
    4.  `provider_skills` (ตารางกลางเชื่อม Many-to-Many ของ categories และ providers)
    5.  `bookings` (ขึ้นกับ users, services, providers)

### Step 2: Models & Relationships Setup
**วันที่บันทึก:** 2026-06-23

#### 1. วิธีการทำและการเปลี่ยนแปลงโครงสร้างโค้ด
*   สร้างโมเดล `Category`, `Service`, `Provider`, และ `Booking` เพื่อเป็นตัวแทนของตารางหลักในระดับ Application Logic
*   กำหนดฟิลด์ `Fillable` โดยอิงตามสถาปัตยกรรม PHP 8 Attribute `#[Fillable([...])]` เพื่อความสม่ำเสมอ (Conventions) กับเทมเพลตเริ่มต้นของคลาส `User`
*   เขียนฟังก์ชันความสัมพันธ์ของโมเดลตามทิศทางการไหลของข้อมูล:
    *   `User` (HasMany `Booking`)
    *   `Category` (HasMany `Service`, BelongsToMany `Provider` ผ่านตารางกลาง `provider_skills`)
    *   `Service` (BelongsTo `Category`, HasMany `Booking`)
    *   `Provider` (BelongsToMany `Category` ผ่านตารางกลาง `provider_skills`, HasMany `Booking`)
    *   `Booking` (BelongsTo `User`, `Service`, `Provider`)

#### 2. การตัดสินใจเชิงเทคนิค (Technical Decisions)
*   **การใส่ Foreign Keys ใน `Fillable` ของ `Booking`:** จำเป็นต้องใส่ `user_id`, `service_id`, และ `provider_id` ลงในรายชื่อที่อนุญาตแบบ Mass-assignment เพื่อรองรับการจองผ่านคำสั่งย่อในหลังบ้าน โดยไม่ต้องเสียเวลาประกาศตัวแปรอัปเดตทีละบรรทัด
*   **การใช้ PHP 8 Attributes:** เลือกใช้ `#[Fillable]` แทนการระบุตัวแปรคลาสแบบดั้งเดิม (`protected $fillable`) เพื่อล้อไปกับสไตล์โค้ดใหม่ของระบบ Laravel 11/13 ในโปรเจกต์นี้

#### 3. การวางแผนแก้ปัญหาด้านความปลอดภัย (Security Planning)
*   **ประเด็นความเสี่ยง:** การมีคีย์นอก เช่น `user_id` อยู่ใน `Fillable` อาจนำไปสู่ช่องโหว่ความปลอดภัยที่แฮกเกอร์แอบแนบ ID ลูกค้าคนอื่นมาเพื่อสร้างใบจองให้คนอื่นได้ (Overposting Vulnerability)
*   **แผนการรับมือ (จะทำใน Phase 4):**
    1.  ใน Controller เราจะล็อกคีย์ `user_id` จาก Session/Token ของผู้ใช้ที่ล็อกอินจริง ๆ เท่านั้น (เช่น ใช้คำสั่ง `$request->user()->bookings()->create(...)`)
    2.  ใช้ Form Requests ในการ Validation คัดกรองและบังคับคู่ช่างกับประเภทบริการให้ถูกต้องก่อนจะยอมให้บันทึกข้อมูล

### Step 3: Database Factories & Seeders Setup
**วันที่บันทึก:** 2026-06-23

#### 1. วิธีการทำและการเปลี่ยนแปลงโครงสร้างโค้ด
*   สร้าง Seeder `CategoryAndServiceSeeder` เพื่อลงทะเบียนข้อมูลแบบคงที่ (Lookup Data) เช่น หมวดหมู่ไฟฟ้า (Electrical), ประปา (Plumbing), แอร์ (AC Repair) และบริการย่อยของแต่ละหมวดหมู่พร้อมราคาฐาน
*   สร้าง Factory `ProviderFactory` สำหรับสุ่มฟิลด์ช่าง (ชื่อ, เบอร์โทร, สถานะการทำงาน, และคะแนนเฉลี่ยเริ่มต้น)
*   ใน `DatabaseSeeder.php` เขียนคำสั่งรัน Seeder และ Factory โดยมีกระบวนการจับคู่ทักษะช่างแบบสุ่ม 1-2 หมวดหมู่ต่อคนผ่านตาราง Pivot:
    ```php
    Provider::factory(10)->create()->each(function (Provider $provider) use ($categories) {
        $provider->categories()->attach(
            $categories->random(rand(1, 2))->pluck('id')->toArray()
        );
    });
    ```

#### 2. การตัดสินใจเชิงเทคนิค (Technical Decisions)
*   **การจับคู่ความสัมพันธ์แบบ N:M ใน Seeder:** เลือกใช้วิธีรันโมเดลหลักช่าง (`Provider`) ขึ้นมาก่อน จากนั้นดึงโมเดลหมวดหมู่ทั้งหมดมาสุ่มผ่านเมธอด `random(rand(1, 2))` และใช้คำสั่ง `attach()` ของ Eloquent ในการเพิ่มเรคคอร์ดลงในตารางกลาง (`provider_skills`) โดยตรง
*   **การกำหนดคะแนนเริ่มต้นของช่าง:** สุ่มตัวเลขทศนิยมระหว่าง 3.5 ถึง 5.0 ดาว เพื่อให้เวลาดึงรายชื่อช่างไปโชว์ใน Catalogue คะแนนดูสมเหตุสมผลและสมจริง

---

## 🔑 Phase 2: Customer Authentication (Sanctum)

### Step 1: Authentication API Setup & Controller Logic
**วันที่บันทึก:** 2026-06-24

#### 1. วิธีการทำและการเปลี่ยนแปลงโครงสร้างโค้ด
*   รันคำสั่ง `php artisan install:api` เพื่อเปิดใช้งาน API Routing และติดตั้ง Laravel Sanctum โดยอัตโนมัติ
*   แก้ไขโมเดล `User` เพื่อใช้เทรต `Laravel\Sanctum\HasApiTokens` ซึ่งช่วยให้ Model สามารถเรียกฟังก์ชันออกโทเค็นได้
*   สร้าง `AuthController` พร้อมเมธอดการทำงาน 3 เมธอดหลัก:
    *   `register()`: สมัครสมาชิก, เข้ารหัสผ่าน และคืน Bearer Token ระดับ HTTP 201 Created
    *   `login()`: ตรวจสอบความถูกต้องของอีเมลและรหัสผ่าน คืน Bearer Token และข้อมูลผู้ใช้
    *   `logout()`: สั่งยกเลิกโทเค็นปัจจุบันที่ผู้ใช้ถืออยู่ผ่าน `$request->user()->currentAccessToken()->delete()`
*   ตั้งค่าแยกกลุ่ม API Routes ใน [api.php](file:///Users/alex_m3/Herd/mini-project/routes/api.php) โดยใช้ `auth:sanctum` Middleware ในการล็อกสิทธิ์ฟังก์ชัน Logout

#### 2. การตัดสินใจเชิงเทคนิค (Technical Decisions)
*   **การเลือกใช้ Laravel Sanctum:** ตัดสินใจเลือกใช้งานเนื่องจากเป็นตัวเบา (Lightweight Token-based Authentication) ที่จัดการโทเค็นฝั่ง API ผ่านฐานข้อมูลตาราง `personal_access_tokens` แทนการถอดถอนและลงนามคีย์ลับขนาดใหญ่แบบ JWT ในฝั่ง NestJS
*   **การใช้ `Auth::attempt()` ในการยืนยันข้อมูลล็อกอิน:** เลือกใช้เพื่อความสะดวกและปลอดภัย เนื่องจากระบบจะทำการดึงข้อมูลผู้ใช้จากคีย์ระบุอีเมล ค้นหา และทำ Hash Verify ด้วย Bcrypt ในตัวโดยไม่ต้องดึงผู้ใช้มาเช็คเองแมนนวล

#### 3. การแก้ปัญหาและบทเรียนสำคัญ (Troubleshooting & Review)
*   **ไวยากรณ์ `$request(...)` ในเมธอด `login()` เกิดข้อผิดพลาด:** เกิดการเรียกใช้งานอ็อบเจกต์เป็นฟังก์ชันเนื่องจากตกหล่นตัวชี้เมธอด (`$request->validate()`) ได้รับการแก้ไขและทดสอบรัน Pint จัดฟอร์แมตทำให้ระบบมีความเสถียรและทำงานได้ครบถ้วน




