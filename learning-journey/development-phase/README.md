# HomeEase Mini Project: Learning Journey Roadmap

ยินดีต้อนรับสู่แผนการเรียนรู้ Laravel 13 ผ่านการสร้าง Mini Project **HomeEase** สำหรับ NestJS Developer! แผนนี้ออกแบบมาเพื่อช่วยให้คุณสามารถย้ายฝั่ง (Transition) จาก NestJS (TypeScript) มาเป็น Laravel (PHP) ได้อย่างรวดเร็วและเป็นระบบ โดยเน้นการเปรียบเทียบแนวคิดหลัก (Conceptual Mapping) เพื่อให้เข้าใจลึกถึงสถาปัตยกรรมภายใน และเตรียมความพร้อมสำหรับ Code Review

---

## 🗺️ NestJS to Laravel Paradigms Mapping

นี่คือตารางเปรียบเทียบแนวคิดหลักที่จะช่วยให้คุณเชื่อมโยงความรู้เดิมของ NestJS เข้ากับ Laravel:

| NestJS (TypeScript) | Laravel (PHP) | คำอธิบาย & ความแตกต่างเชิงสถาปัตยกรรม |
| :--- | :--- | :--- |
| **Prisma / TypeORM Schema** | **Migrations** | ใน Laravel สคีมาจะถูกกำหนดผ่าน Code-based migrations ในโค้ด PHP ทีละไฟล์ แทนการใช้ Schema file ใหญ่ไฟล์เดียวแบบ Prisma |
| **Entity / Class Model** | **Eloquent Model (Active Record)** | TypeORM/Prisma มักใช้ Data Mapper Pattern (แยก Model กับ Database Logic ออกจากกัน) แต่ Laravel ใช้ Active Record (ตัว Model Instance มี Method สำหรับ Query และ Save ในตัวเอง) |
| **Passport JWT / Guards** | **Laravel Sanctum** | Sanctum ใช้ Cookie/Token-based authentication แบบน้ำหนักเบา โดยไม่ต้องจัดการคู่ Key แบบ JWT เต็มระบบ เก็บ Token ลงตาราง `personal_access_tokens` |
| **DTOs & Class-Validator** | **Form Requests** | แทนการใช้ class-validator ในการตกแต่ง Class, Laravel ใช้ Form Request Class เพื่อแยกกฎการตรวจสอบสิทธิ์ (Authorize) และการตรวจสอบข้อมูล (Validate) ออกจาก Controller |
| **Custom Interceptor / Pipe** | **Middleware / API Resources** | Laravel ใช้ Middleware ในการปรับแต่ง Request/Response pipeline และใช้ API Resources สำหรับจัดการรูปแบบการส่งข้อมูลกลับ (Serialization) คล้ายกับ Class-serializer |
| **Guards / CASL Ability** | **Gate & Policies** | Laravel Policies ถูกออกแบบมาเป็น Resource-based Authorization (เช่น ตรวจสอบสิทธิ์ว่าเจ้าของจองตรงกับคนดูล็อกอินหรือไม่) โดยเขียน Logic ตรงไปตรงมา |
| **Jest / Supertest** | **Pest Testing Framework** | Pest เป็น Testing Framework ยุคใหม่ของ PHP ที่มี Syntax ใกล้เคียงกับ Jest/Vitest มาก (ใช้ `test()` หรือ `it()`) ทำให้เรียนรู้ได้ทันที |
| **NestJS Injection (DI)** | **Service Container / Service Provider** | Laravel Service Container เป็นตัวจัดการ Dependency Injection โดยลงทะเบียนผ่าน Service Providers (คล้าย NestJS Modules) |

---

## 🏁 Phase Overview

โปรเจกต์นี้จะถูกแบ่งออกเป็น 5 Phases ย่อย โดยเราจะค่อย ๆ ทำไปทีละ Step:

### 🗄️ Phase 1: Database Setup & Eloquent Relationships
* **เป้าหมาย:** ออกแบบตารางในฐานข้อมูล, ตั้งค่า Model Relationships และเตรียม Seeder/Factory สำหรับช่าง (Providers) และหมวดหมู่บริการ (Categories/Services)
* **NestJS Focus:** เปลี่ยนมุมมองจาก Prisma/TypeORM มาสู่ Laravel Migrations และ Eloquent Model Relationships

### 🔑 Phase 2: Customer Authentication (Sanctum)
* **เป้าหมาย:** สร้างระบบสมัครสมาชิก (Register) และล็อกอิน (Login/Logout) เพื่อออก Bearer Token ด้วย Laravel Sanctum
* **NestJS Focus:** การใช้ Sanctum Authentication Guard แทน Passport JWT Guard

### 🗂️ Phase 3: Catalog & Browsing Module
* **เป้าหมาย:** พัฒนา API สำหรับดึงหมวดหมู่ บริการ และกรองหาช่างที่เหมาะสม (มี Skill และว่าง) เพื่อเตรียมหน้า Catalogue ให้ลูกค้าเลือก
* **NestJS Focus:** การใช้ Eloquent Queries, Eager Loading (ป้องกัน N+1) และ API Resources (Serialization)

### 📅 Phase 4: Booking Engine & Authorization Rules
* **เป้าหมาย:** พัฒนาระบบจองบริการ โดยมี Business Logic Validation ดับเบิ้ลเช็คสถานะช่างและความสามารถของช่าง ณ ตอนกดจอง และจำกัดสิทธิ์ข้อมูลด้วย BookingPolicy
* **NestJS Focus:** Form Requests (DTOs/Pipes), Snapshot Pattern, และ Model Policies (Resource Guards)

### 🧪 Phase 5: Simulation & Pest Testing
* **เป้าหมาย:** สร้าง API / Command จำลองสถานะ Booking Life Cycle เพื่อจำลองฝั่งช่าง (Pending -> Accepted -> In-Progress -> Completed) และเขียน Feature Tests ด้วย Pest
* **NestJS Focus:** State Machine Validation และการเขียน HTTP Tests ด้วย Pest (Jest-like)

---

## 🛠️ วิธีการเรียนรู้
1. ในโฟลเดอร์นี้จะแยกคู่มือรายละเอียดของแต่ละ Phase ออกเป็นไฟล์ `.md` ต่างหาก
2. คุณจะเริ่มทำตั้งแต่ **Phase 1: Step 1** ตามคำสั่งของ Mentor
3. เมื่อทำเสร็จในแต่ละ Step ให้คุณส่งโค้ดและรายงานผลเพื่อให้ผมตรวจความถูกต้อง
4. หลังจากตรวจและให้ฟีดแบ็กแล้ว ผมจะสรุปประเด็นที่คุณต้องจดลงใน `LEARNING_JOURNEY.md` และ `CONCEPT.md` เพื่อสร้างคลังความรู้ส่วนตัว
5. จากนั้น เราจะก้าวไปสู่ Step ถัดไปด้วยกัน!

---

💡 **พร้อมเรียนรู้หรือยัง?** ลองดูรายละเอียดที่ [Phase 1: Database Setup & Eloquent Relationships](file:///Users/alex_m3/Herd/mini-project/learning-journey/development-phase/phase-1-database.md) เพื่อเริ่มต้นขั้นแรกกันเลย!
