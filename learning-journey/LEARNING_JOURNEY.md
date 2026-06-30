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
*   สร้าง Seeder `CategorySeeder` และ `ServiceSeeder` เพื่อลงทะเบียนข้อมูลแบบคงที่ (Lookup Data) เช่น หมวดหมู่ไฟฟ้า (Electrical), ประปา (Plumbing), แอร์ (AC Repair) และบริการย่อยของแต่ละหมวดหมู่พร้อมราคาฐาน
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
    *   `register()`: สมัครสมาชิกและคืน Bearer Token ระดับ HTTP 201 Created (ส่งผ่านรหัสผ่านดิบเพื่อให้ Cast ใน Model จัดการเข้ารหัสให้อัตโนมัติ ป้องกันการทำ Double Hashing)
    *   `login()`: ตรวจสอบความถูกต้องของอีเมลและรหัสผ่าน คืน Bearer Token และข้อมูลผู้ใช้
    *   `logout()`: สั่งยกเลิกโทเค็นปัจจุบันที่ผู้ใช้ถืออยู่ผ่าน `$request->user()->currentAccessToken()->delete()`
*   ตั้งค่าแยกกลุ่ม API Routes ใน [api.php](file:///Users/alex_m3/Herd/mini-project/routes/api.php) โดยใช้ `auth:sanctum` Middleware ในการล็อกสิทธิ์ฟังก์ชัน Logout

*   **การเลือกใช้ Laravel Sanctum:** ตัดสินใจเลือกใช้งานเนื่องจากเป็นตัวเบา (Lightweight Token-based Authentication) ที่จัดการโทเค็นฝั่ง API ผ่านฐานข้อมูลตาราง `personal_access_tokens` แทนการถอดถอนและลงนามคีย์ลับขนาดใหญ่แบบ JWT ในฝั่ง NestJS
*   **การใช้ `Auth::attempt()` ในการยืนยันข้อมูลล็อกอิน:** เลือกใช้เพื่อความสะดวกและปลอดภัย เนื่องจากระบบจะทำการดึงข้อมูลผู้ใช้จากคีย์ระบุอีเมล ค้นหา และทำ Hash Verify ด้วย Bcrypt ในตัวโดยไม่ต้องดึงผู้ใช้มาเช็คเองแมนนวล
*   **การงดเว้น `Hash::make()` ใน Controller:** เลือกที่จะส่งรหัสผ่านธรรมดาตรงเข้าโมเดลเพื่อใช้ประโยชน์จากฟังก์ชัน Cast `'password' => 'hashed'` ของ Eloquent โดยตรง ซึ่งสอดคล้องกับแนวปฏิบัติที่ดีในการป้องกันปัญหา Double Hashing (แฮชซ้ำสองชั้น) และทำให้ Controller ทำงานเรียบง่ายที่สุด (Skinny Controller)

---

## 🗃️ Phase 3: Catalog & Browsing Module (Public APIs)
**วันที่บันทึก:** 2026-06-24

### Step 1: Serialization Layer with API Resources
#### 1. วิธีการทำและการเปลี่ยนแปลงโครงสร้างโค้ด
*   สร้างคลาส Resource เพื่อทำหน้าที่จัดรูปแบบการแปลงข้อมูล JSON ได้แก่ [CategoryResource](file:///Users/alex_m3/Herd/mini-project/app/Http/Resources/CategoryResource.php), [ServiceResource](file:///Users/alex_m3/Herd/mini-project/app/Http/Resources/ServiceResource.php), และ [ProviderResource](file:///Users/alex_m3/Herd/mini-project/app/Http/Resources/ProviderResource.php)
*   เขียนฟังก์ชัน `toArray()` เพื่อกำหนดรูปแบบฟิลด์ที่จะส่งออกไปภายนอก เช่น การแปลงราคาและคะแนนของช่างให้เป็น `float`
*   ใช้เงื่อนไขการโหลดความสัมพันธ์ เช่น `$this->whenLoaded('category')` และ `$this->whenCounted('services')` เพื่อให้มั่นใจว่าจะไม่มีการคิวรีตารางที่เกี่ยวโยงเกินจำเป็น

#### 2. การตัดสินใจเชิงเทคนิค (Technical Decisions)
*   **การแปลงประเภทข้อมูลเป็น Float ใน Resource:** เนื่องจาก SQLite หรือบางไดรเวอร์ฐานข้อมูลอาจอ่านค่าทศนิยมของคอลัมน์ฐานข้อมูล (`base_price`, `rating`) ออกมาเป็น String การบีบบังคับแปลงประเภทข้อมูล (Type Casting) ในชั้น Resource เป็น `(float)` ช่วยการันตีให้ JSON ผลลัพธ์แสดงชนิดข้อมูลตัวเลขที่ถูกต้องเสมอ
*   **การซ่อน Relationship ทรัพยากรลูกย่อยหากไม่ต้องการโชว์:** ออกแบบให้ความสัมพันธ์ถูกแสดงเฉพาะกรณีที่ Controller สั่ง Eager Load เข้ามาด้วย `whenLoaded` เท่านั้น ซึ่งเป็นแนวทางมาตรฐานในการลดขนาด payload และป้องกันปัญหา N+1 queries

---

### Step 2: CatalogController Development & Optimization
#### 1. วิธีการทำและการเปลี่ยนแปลงโครงสร้างโค้ด
*   สร้าง [CatalogController](file:///Users/alex_m3/Herd/mini-project/app/Http/Controllers/CatalogController.php) พร้อมเมธอด:
    *   `getCategories()`: ดึงหมวดหมู่พร้อมนับจำนวนบริการภายในด้วย `withCount('services')`
    *   `getServices()`: ค้นหาบริการย่อย รองรับการกรองด้วย `category_id` และคีย์เวิร์ด `search` ผ่านคำสั่ง `$query->when(...)` พร้อมทำ Eager Loading ตาราง `category`
    *   `getServiceProviders($serviceId)`: ดึงรายชื่อช่างที่เป็น `available` และตรงกับหมวดหมู่ของบริการนั้น ๆ ผ่านคำสั่งย่อ `whereRelation('categories', 'categories.id', $service->category_id)`
*   ผูกเส้นทางคิวรีเหล่านี้เป็นเส้นทางสาธารณะ (Public) ใน [routes/api.php](file:///Users/alex_m3/Herd/mini-project/routes/api.php)

#### 2. การตัดสินใจเชิงเทคนิค (Technical Decisions)
*   **การแก้ปัญหา N+1 คิวรีด้วย Eager Loading และ Relationship Constraints:**
    *   การทำ `Service::with('category')->get()` ช่วยรวบยอดคำสั่ง SQL ดึงหมวดหมู่ย่อยทั้งหมดมารอไว้ในคราวเดียว แทนการวนลูป Query ทีละแถว
    *   การใช้ `whereRelation('categories', 'categories.id', ...)` ซึ่งเป็นตัวย่อที่มีประสิทธิภาพสูงของ `whereHas()` ช่วยให้ฐานข้อมูลสแกนหาช่างที่มีทักษะในหมวดหมู่ที่เหมาะสมใน Query เดียว และลดความรกรุงรังของโค้ดโดยไม่ต้องเขียน Closure ฟังก์ชัน
*   **การแก้ไขปัญหาข้อมูลทดสอบสุ่มไม่พบ (Randomized Seed Data):**
    *   พบปัญหาคิวรี `GET /api/services/1/providers` คืนค่าเป็น `[]` เนื่องจากระบบสุ่มของ Seeder กำหนดช่างตรงหมวดหมู่ Plumbing (Category 1) ไว้มีสถานะเป็น `on_leave` ทั้งหมด
    *   แก้ไขเพื่อการทดสอบโดยเขียนคำสั่ง Tinker บังคับให้ช่าง ID 8 มีสถานะเป็น `available` เพื่อยืนยันว่าโค้ดฟังก์ชันค้นหาช่างทำงานได้อย่างสมบูรณ์

---

### Step 3: Postman Portability Optimization
#### 1. วิธีการทำและการเปลี่ยนแปลงโครงสร้างโค้ด
*   ปรับเปลี่ยน URL ของ Request ใน Collection **`mini-project`** จาก `http://mini-project.test` มาใช้ตัวแปรสภาพแวดล้อม `{{BASE_URL}}` ทั้งหมด

#### 2. การตัดสินใจเชิงเทคนิค (Technical Decisions)
*   **การใช้ Environment Variables ใน Postman:** เพื่อให้คอลเล็กชันสำหรับรันเคสทดสอบนี้เป็นอิสระจากเครื่องนักพัฒนาคนนั้น ๆ (Environment-agnostic) หากทำการย้าย Domain ไปใช้งานบน Staging หรือฐานข้อมูลจำลองอื่น ก็เพียงแค่แก้ไขค่า `BASE_URL` ใน Postman Environment ตัวเดียวโดยไม่ต้องแก้ไขทีละ Request URL

---

## 🗓️ Phase 4: Booking Engine & Authorization Rules

### Step 1: Implementation of Request, Policy, Controller & API Routes
**วันที่บันทึก:** 2026-06-24

#### 1. วิธีการทำและการเปลี่ยนแปลงโครงสร้างโค้ด
*   สร้าง [CreateBookingRequest.php](file:///Users/alex_m3/Herd/mini-project/app/Http/Requests/CreateBookingRequest.php) เพื่อทำ Validate ค่าอินพุตก่อนเข้าคอนโทรลเลอร์ (เช่น บังคับวันที่จองห้ามจองย้อนหลังผ่านเงื่อนไข `after:now`)
*   สร้าง [BookingPolicy.php](file:///Users/alex_m3/Herd/mini-project/app/Policies/BookingPolicy.php) ควบคุมสิทธิ์เข้าถึง:
    *   `view`: ลูกค้าดูได้เฉพาะใบจองที่เป็นของตัวเองเท่านั้น
    *   `cancel`: ยกเลิกได้เฉพาะใบจองของตัวเอง และต้องอยู่ภายใต้สถานะ `pending` หรือ `accepted` เท่านั้น
*   สร้าง [BookingController.php](file:///Users/alex_m3/Herd/mini-project/app/Http/Controllers/BookingController.php) สำหรับบริหารจัดการ Logic ธุรกรรมการจอง:
    *   ตรวจสอบช่างต้องไม่ติดงาน (`status === 'available'`)
    *   ตรวจสอบประเภทช่างว่ามีทักษะสอดคล้องกับหมวดหมู่บริการจริงหรือไม่ ผ่านการเรียกเมธอด `$provider->hasSkill($categoryId)` ใน Model `Provider`
    *   บันทึกข้อมูลแบบ **Price Snapshot (`price_charged`)** ป้องกันปัญหาการแก้ไขราคาในอนาคตกระทบยอดเดิม
*   ตั้งค่า Endpoint ใน [api.php](file:///Users/alex_m3/Herd/mini-project/routes/api.php) ภายใต้กลุ่ม Protected API ด้วย Middleware `auth:sanctum`
*   เขียนชุดทดสอบ [BookingTest.php](file:///Users/alex_m3/Herd/mini-project/tests/Feature/BookingTest.php) ทดสอบครอบคลุมเงื่อนไขความถูกต้อง ทั้งกรณีผ่าน (Happy Path) และปฏิเสธ (Validation/Policy Failures)

#### 2. การตัดสินใจเชิงเทคนิค (Technical Decisions)
*   **การกำหนดสิทธิ์ด้วย Route-level `can` Middleware:** การย้าย Logic การตรวจสอบสิทธิ์ Policy ออกไปไว้นอก Controller โดยใช้ `->middleware('can:view,booking')` และ `->middleware('can:cancel,booking')` ในไฟล์ `routes/api.php` ช่วยทำให้ตัว Controller ทำงานเฉพาะเรื่องธุรกิจและตอบกลับแบบสะอาด (Skinny Controller) อีกทั้งยังรวมศูนย์การประเมินสิทธิ์เส้นทางไว้ที่ไฟล์ Route เพียงจุดเดียวตามแนวทาง Declarative Security
*   **การจัดแบ่งหน้าที่ในการ Validation และ Rich Domain Model Encapsulation:**
    *   *Form Request:* ตรวจสอบประเภทข้อมูล รูปแบบวันที่ และความมีอยู่จริงของ ID ในฐานข้อมูล (Structural Validation)
    *   *Model (Rich Model):* ย้าย Logic การตรวจสอบความสอดคล้องของหมวดหมู่และสกิลช่างเข้าไปอยู่ในคลาส `Provider` ในรูปแบบของ Helper Method `$provider->hasSkill($categoryId)` เพื่อส่งเสริม Encapsulation และการทำ Unit Testing
    *   *Controller:* ควบคุมลำดับขั้นตอนทางธุรกิจ (Orchestration) และเช็คสถานะการเข้ากันได้ผ่าน Helper Method เพื่อส่งคืนข้อมูลหรือตอบกลับ Error `422` ด้วยรหัสและข้อความที่เหมาะสม
*   **การป้องกันช่องโหว่ความปลอดภัยระดับข้อมูล (Mass Assignment & Overposting Protection):**
    *   *การแก้ไขช่องโหว่ `user_id` ที่มีสิทธิ์ส่งมาผ่าน Mass Assignment:* ป้องกันโดยการสร้างผ่านโมเดลความสัมพันธ์ของ User ที่ตรวจสอบสิทธิ์ผ่านระบบ Token แล้วเท่านั้น (`$request->user()->bookings()->create(...)`) ทำให้ค่า `user_id` ถูกเขียนทับด้วยระบบหลังบ้านเสมอ และละทิ้งข้อมูลผู้ใช้ภายนอกที่ส่งเข้ามา
    *   *การจัดการ `service_id` และ `provider_id`:* ตรวจสอบด้วยการทำ 2-Layer Check ตั้งแต่การยืนยันการมีอยู่ของแถวในฐานข้อมูลใน Form Request และการรันคิวรีตรวจสอบความเข้ากันได้ของ Skill และสถานะของช่างใน Controller
    *   *การป้องกันแก้ไขราคาธุรกรรม:* ไม่นำเข้าฟิลด์ราคาใด ๆ จาก Request Payload โดยตรง แต่ให้ดึงค่าราคา `$service->base_price` จากฐานข้อมูลมาลงในฟิลด์ `price_charged` เท่านั้น
*   **การจัดหมวดหมู่ใน Postman:** ย้าย API ทั้งหมดเข้าไปอยู่ในโฟลเดอร์ย่อย (Authentication, Catalog, Bookings) และกำหนดค่า UUID ให้แต่ละโฟลเดอร์ เพื่อให้ระบบ Postman Collection ทำงานอย่างสมบูรณ์แบบไม่ขัดข้องในการอัปเดตผ่าน API


#### 3. การตรวจสอบความถูกต้อง (Verification)
*   รันคำสั่ง `php artisan test --compact` ยืนยันว่าการควบคุมความปลอดภัยของตาราง `bookings` และ API ทั้งหมดทำงานได้สมบูรณ์ ผลผ่านการทดสอบ 15 เคส 100% Green






