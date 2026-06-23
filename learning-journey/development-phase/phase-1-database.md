# Phase 1: Database Setup & Eloquent Relationships

ในเฟสแรกนี้ เราจะมาตั้งค่าฐานข้อมูลและความสัมพันธ์ระหว่างโมเดลต่าง ๆ ซึ่งเป็นรากฐานที่สำคัญของโปรเจกต์ HomeEase 

---

## 💡 NestJS -> Laravel Database Concept Mapping

* **NestJS/Prisma Entity vs Laravel Migration & Model:**
  * ใน NestJS/Prisma คุณกำหนดตารางและความสัมพันธ์ผ่านไฟล์ `schema.prisma` จากนั้นรัน `prisma db push` หรือสร้าง Migration
  * ใน Laravel จะแบ่งออกเป็น 2 ส่วนชัดเจนคือ:
    1. **Migrations:** ไฟล์ PHP ใน `database/migrations/` ที่ทำหน้าที่สร้างและแก้ไขสกีมาของตาราง (DDL)
    2. **Eloquent Model:** คลาส PHP ใน `app/Models/` ที่ทำหน้าที่เป็นตัวแทนข้อมูลในตาราง และใช้ในการเขียนความสัมพันธ์ (Relationships)
* **Relations (1:N, N:M):**
  * Prisma ใช้ `@relation` ในการผูกข้อมูลระหว่าง Model
  * Eloquent ใช้ Methods ใน Class เช่น `belongsTo()`, `hasMany()`, `belongsToMany()`

---

## 🛠️ Step-by-Step Implementation

### Step 1: สร้างและแก้ไขไฟล์ Migrations
เราต้องการโครงสร้างตารางดังนี้:
1. `categories` (หมวดหมู่หลัก)
2. `services` (บริการย่อย - ผูกกับ `category_id`)
3. `providers` (ช่างผู้ให้บริการ)
4. `provider_skills` (ตารางกลางเชื่อม Many-to-Many ระหว่างช่างกับหมวดหมู่หลัก)
5. `bookings` (ข้อมูลการจองบริการ)

**คำสั่งที่ใช้สร้าง Migration:**
```bash
php artisan make:migration create_categories_table
php artisan make:migration create_services_table
php artisan make:migration create_providers_table
php artisan make:migration create_provider_skills_table
php artisan make:migration create_bookings_table
```

*โปรดดูตารางคุณลักษณะ (Constraints & Columns) ใน [PRD-CUSTOMER_SCOPED.md](file:///Users/alex_m3/Herd/mini-project/PRD-CUSTOMER_SCOPED.md) เพื่อกำหนดคอลัมน์ในแต่ละไฟล์ให้ครบถ้วน*

---

### Step 2: สร้าง Models และกำหนดความสัมพันธ์ (Relationships)
สร้างโมเดลสำหรับจัดการข้อมูลตารางต่าง ๆ (สำหรับ `users` มีโมเดล `User` อยู่แล้วในระบบ)

**คำสั่งที่ใช้สร้าง Model:**
```bash
php artisan make:model Category
php artisan make:model Service
php artisan make:model Provider
php artisan make:model Booking
```

**กำหนดความสัมพันธ์ดังนี้:**
* **Category:**
  * มีบริการย่อยจำนวนมาก (`services` -> `hasMany`)
  * มีความสัมพันธ์ Many-to-Many กับช่างผ่านตารางกลาง (`providers` -> `belongsToMany` ผ่าน `provider_skills`)
* **Service:**
  * อยู่ภายใต้หมวดหมู่เดียว (`category` -> `belongsTo`)
  * มีรายการจองได้หลายรายการ (`bookings` -> `hasMany`)
* **Provider:**
  * มีความสัมพันธ์ Many-to-Many กับหมวดหมู่ที่เป็นทักษะ (`categories` -> `belongsToMany` ผ่าน `provider_skills`)
  * มีรายการจองได้หลายรายการ (`bookings` -> `hasMany`)
* **Booking:**
  * จองโดยลูกค้า 1 คน (`user` -> `belongsTo`)
  * เลือกบริการ 1 บริการ (`service` -> `belongsTo`)
  * เลือกช่าง 1 คน (`provider` -> `belongsTo`)

---

### Step 3: สร้าง Database Factories และ Seeders
เราต้องการข้อมูลจำลองสำหรับทดสอบระบบ Catalog และ Booking Flow

1. **สร้าง Category และ Service Seeder:**
   * ลงทะเบียนข้อมูลหมวดหมู่พื้นฐาน (ไฟฟ้า, ประปา, ล้างแอร์) และบริการย่อยแต่ละหมวดหมู่ (เช่น ล้างแอร์ติดผนัง, ล้างแอร์แขวน)
2. **สร้าง Provider Factory:**
   * สุ่มสร้างข้อมูลช่าง เช่น ชื่อ, เบอร์โทร, คะแนนเรทติ้ง
   * กำหนดสถานะตั้งต้นให้สุ่มเป็น `available` หรือ `unavailable`
3. **ผูกข้อมูลลงใน `DatabaseSeeder.php`:**
   * ให้ระบบรันสร้างหมวดหมู่และบริการย่อยก่อน
   * สุ่มสร้างช่าง 10 คน และใช้ Method `attach()` เพื่อผูกทักษะหมวดหมู่ให้กับช่างแบบสุ่ม (เช่น ช่าง A ทำไฟฟ้าและประปาได้, ช่าง B ทำล้างแอร์ได้อย่างเดียว)

---

## 🎯 Task สำหรับคุณตอนนี้ (Step แรกที่ต้องทำ)

ให้เริ่มต้นด้วย **Step 1: สร้างไฟล์ Migrations และเขียนสกีมาฐานข้อมูลทั้งหมดให้ครบถ้วน** ตามโครงสร้างข้อมูลใน PRD

1. ใช้เครื่องมือ Terminal รันคำสั่งสร้าง Migration สำหรับ 5 ตารางข้างต้น
2. แก้ไขโค้ดในไฟล์ Migration แต่ละไฟล์ในโฟลเดอร์ `database/migrations/`
3. **อย่าลืม:** ตรวจสอบประเภทข้อมูล คีย์นอก (Foreign Keys) และ Options ต่าง ๆ เช่น `onDelete('cascade')` หรือ `onDelete('restrict')`
4. เมื่อเขียนสกีมาเสร็จแล้ว ให้ทดลองรัน `php artisan migrate`
5. ส่งโค้ดของไฟล์ Migrations ที่สร้างเสร็จให้ผมตรวจสอบความถูกต้องเป็นขั้นตอนถัดไป!
