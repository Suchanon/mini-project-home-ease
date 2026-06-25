# HomeEase Database Entity Relationship Diagram (ERD)

เอกสารนี้แสดงโครงสร้างฐานข้อมูล (Entity Relationship Diagram - ERD) และความสัมพันธ์ของตารางต่าง ๆ ในโปรเจกต์ HomeEase ที่วิเคราะห์จากไฟล์ Database Migrations ของระบบ

---

## 1. แผนภาพ ERD (Mermaid Diagram)

```mermaid
erDiagram
    users {
        bigint id PK
        string name
        string email UK
        timestamp email_verified_at "nullable"
        string password
        string phone "nullable"
        string remember_token "nullable"
        timestamp created_at
        timestamp updated_at
    }

    categories {
        bigint id PK
        string name UK
        string slug UK
        text description "nullable"
        timestamp created_at
        timestamp updated_at
    }

    services {
        bigint id PK
        bigint category_id FK "categories.id (Cascade)"
        string name
        text description "nullable"
        decimal base_price "8,2 (default 0.00)"
        timestamp created_at
        timestamp updated_at
    }

    providers {
        bigint id PK
        string name
        string phone
        enum status "ProviderStatus (default Available)"
        decimal rating "3,2 (default 5.0)"
        timestamp created_at
        timestamp updated_at
    }

    provider_skills {
        bigint provider_id PK, FK "providers.id (Cascade)"
        bigint category_id PK, FK "categories.id (Cascade)"
        timestamp created_at
        timestamp updated_at
    }

    bookings {
        bigint id PK
        bigint user_id FK "users.id (Restrict)"
        bigint service_id FK "services.id (Restrict)"
        bigint provider_id FK "providers.id (Restrict)"
        text description
        datetime appointment_datetime
        text address
        enum status "BookingStatus (default Pending)"
        decimal price_charged "8,2"
        timestamp created_at
        timestamp updated_at
    }

    personal_access_tokens {
        bigint id PK
        string tokenable_type
        bigint tokenable_id
        text name
        string token UK "64 chars"
        text abilities "nullable"
        timestamp last_used_at "nullable"
        timestamp expires_at "nullable, indexed"
        timestamp created_at
        timestamp updated_at
    }

    %% Relationships
    categories ||--o{ services : "has many"
    providers ||--o{ provider_skills : "belongs to many (via provider_id)"
    categories ||--o{ provider_skills : "belongs to many (via category_id)"
    users ||--o{ bookings : "makes"
    services ||--o{ bookings : "is booked in"
    providers ||--o{ bookings : "performs"
    users ||--o{ personal_access_tokens : "owns (polymorphic)"
```

---

## 2. รายละเอียดตารางและความสัมพันธ์ (Table Schema & Relationships)

### 2.1 ตารางหลัก (Core Entities)

#### 1. `users`
ตารางจัดเก็บข้อมูลผู้ใช้งาน (ลูกค้า) ในระบบ
* **Relationships**:
  * **One-to-Many (`1:N`)** กับ `bookings` (หนึ่งคนสามารถจองบริการได้หลายรายการ)
  * **Polymorphic One-to-Many (`1:N`)** กับ `personal_access_tokens` (ใช้สำหรับ API Authentication)

#### 2. `categories`
ตารางจัดเก็บหมวดหมู่ของบริการหลัก (เช่น Cleaning, Plumbing, Electrical)
* **Relationships**:
  * **One-to-Many (`1:N`)** กับ `services` (หนึ่งหมวดหมู่มีบริการย่อยได้หลายบริการ)
  * **Many-to-Many (`M:N`)** กับ `providers` ผ่านตาราง `provider_skills` (หนึ่งหมวดหมู่สามารถจับคู่กับผู้ให้บริการหลายคน)

#### 3. `services`
ตารางจัดเก็บข้อมูลบริการย่อยภายใต้หมวดหมู่
* **Relationships**:
  * **Many-to-One (`N:1`)** กับ `categories` (เชื่อมด้วย `category_id` และลบข้อมูลอัตโนมัติหากหมวดหมู่ถูกลบ - **Cascade Delete**)
  * **One-to-Many (`1:N`)** กับ `bookings` (หนึ่งบริการสามารถถูกจองได้หลายครั้ง)

#### 4. `providers`
ตารางจัดเก็บข้อมูลผู้ให้บริการ (Service Providers)
* **Relationships**:
  * **Many-to-Many (`M:N`)** กับ `categories` ผ่านตาราง `provider_skills` (หนึ่งผู้ให้บริการมีความชำนาญได้หลายหมวดหมู่)
  * **One-to-Many (`1:N`)** กับ `bookings` (หนึ่งผู้ให้บริการทำงานจองได้หลายรายการ)

---

### 2.2 ตารางเชื่อมโยงและประวัติการทำงาน (Pivot & Transactions)

#### 5. `provider_skills` (Pivot Table)
ตารางเชื่อมความสัมพันธ์แบบ Many-to-Many เพื่อระบุทักษะ/ความสามารถของผู้ให้บริการ
* **Composite Primary Key**: `(provider_id, category_id)`
* **Foreign Keys**:
  * `provider_id` เชื่อมโยงกับ `providers.id` (**Cascade Delete**)
  * `category_id` เชื่อมโยงกับ `categories.id` (**Cascade Delete**)

#### 6. `bookings`
ตารางจัดเก็บธุรกรรมการจองบริการของลูกค้า
* **Foreign Keys**:
  * `user_id` เชื่อมโยงกับ `users.id` (**Restrict Delete** ป้องกันการลบข้อมูลลูกค้าที่มีประวัติการจอง)
  * `service_id` เชื่อมโยงกับ `services.id` (**Restrict Delete**)
  * `provider_id` เชื่อมโยงกับ `providers.id` (**Restrict Delete**)
* **Important Columns**:
  * `price_charged`: ราคาสุทธิที่คิดเงินลูกค้า ณ เวลาที่จอง (เก็บบันทึกเผื่อราคาบริการหลักมีการเปลี่ยนแปลงในอนาคต)
  * `appointment_datetime`: วันเวลาที่นัดหมาย
  * `status`: สถานะของการจอง (ควบคุมด้วย `BookingStatus` Enum)

---

### 2.3 ตารางระบบและความปลอดภัย (System & Security)

#### 7. `personal_access_tokens` (Laravel Sanctum)
ตารางสำหรับเก็บ API Token ที่ออกให้กับผู้ใช้งานในการยืนยันตัวตน
* **Polymorphic Key**: `(tokenable_type, tokenable_id)` (รองรับการยืนยันตัวตนหลายรูปแบบ)
* **Unique Key**: `token` (64 ตัวอักษร)
