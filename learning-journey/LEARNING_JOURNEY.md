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
