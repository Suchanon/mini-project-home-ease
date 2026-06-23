# Phase 5: State Transition Simulation & Pest Testing

ในเฟสสุดท้าย เราจะจำลองฝั่งช่าง (Provider Actions) ผ่าน API จำลองการเขยิบสถานะ (Simulation Endpoint) เพื่อตรวจสอบการสลับเปลี่ยนของสถานะการจอง (State transitions) และเขียนการทดสอบอัตโนมัติ (Automated Tests) เพื่อป้องกัน Bug

---

## 💡 NestJS -> Laravel Simulation & Testing Concept Mapping

* **NestJS/Jest e2e testing vs Laravel Pest HTTP Testing:**
  * ใน NestJS คุณจะสร้างเซิร์ฟเวอร์จำลองด้วย `supertest` และส่งคำขอจำลองไปยัง Router เพื่อเช็ค Responses
  * ใน Laravel การทดสอบ HTTP ถูกรวมมากับตัว Framework เป็นระดับ First-class โดยใช้ร่วมกับ **Pest Testing** ซึ่งมี Syntax กระชับมาก เช่น:
    ```php
    it('allows customer to create a booking', function() {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->postJson('/api/bookings', [...]);
        $response->assertStatus(201);
    });
    ```
* **State Machine Validation:**
  * การย้ายสถานะของ Booking จะต้องเรียงลำดับอย่างถูกต้องตาม Workflow เสมอ:
    `Pending -> Accepted -> In-Progress -> Completed`
    หรือสลับไป `Cancelled`
  * การกระโดดข้ามขั้น (เช่น จาก `Pending` ไป `Completed` โดยตรง) หรือย้อนกลับ (จาก `Completed` ไป `Pending`) จะต้องถูกระบบปฏิเสธโดยสิ้นเชิง

---

## 🛠️ Step-by-Step Implementation

### Step 1: สร้าง Simulation Endpoint สำหรับผู้พัฒนา
เนื่องจากโปรเจกต์นี้ไม่ได้ทำหน้าจอสำหรับฝั่งช่าง ให้สร้าง Endpoint ลับสำหรับใช้เปลี่ยนสถานะด้วยการจำลอง:
* เส้นทาง: `POST /api/simulation/bookings/{id}/advance`

**Logic ใน Controller (หรือ State Machine Engine):**
1. ค้นหา Booking จาก `{id}`
2. ตรวจสอบสถานะปัจจุบัน (`status`) ของ Booking:
   * หากมีค่าเป็น `pending`: ปรับเปลี่ยนไปเป็น `accepted`
   * หากมีค่าเป็น `accepted`: ปรับเปลี่ยนไปเป็น `in_progress`
   * หากมีค่าเป็น `in_progress`: ปรับเปลี่ยนไปเป็น `completed`
   * หากมีค่าเป็น `completed` หรือ `cancelled`: ส่งคืนข้อผิดพลาด (เช่น 400 Bad Request) ว่าไม่สามารถไปต่อได้เนื่องจากสิ้นสุดกระบวนการแล้ว
3. บันทึกข้อมูลและส่งกลับพร้อมสถานะใหม่

---

### Step 2: เขียนการทดสอบด้วย Pest (Pest Testing)
สร้างไฟล์ Feature Test เพื่อทำการตรวจสอบระบบ:
```bash
php artisan make:test BookingFlowTest --pest
```

**หัวข้อที่ควรเขียนทดสอบคลอบคลุม:**
1. **การกรองช่าง (Catalogue):** ยิง API เพื่อดึงรายชื่อช่างสำหรับบริการ และตรวจสอบว่าเฉพาะช่างที่มีหมวดหมู่ความสามารถถูกต้องและสถานะเป็น `available` เท่านั้นที่ถูกดึงออกมา
2. **การป้องกันสิทธิ์จองช่างข้ามสาย (Invalid Skills):** พยายามสร้าง Booking โดยส่ง `provider_id` ที่มีสถานะอื่น หรือมีสกิลไม่ตรง และตรวจสอบว่าระบบต้องส่งรหัส 422 หรือ 400 กลับมา
3. **การรักษาความปลอดภัยข้อมูล (Policy Guards):**
   * ทดสอบให้ลูกค้ารายที่ 2 พยายามยิงดูรายละเอียดของลูกค้ารายที่ 1 และตรวจสอบว่าระบบตอบกลับเป็น 403 Forbidden
   * ทดสอบลูกค้าพยายามยกเลิก Booking ที่ช่างเริ่มทำไปแล้ว (`in_progress`) และตรวจสอบว่าระบบตอบกลับ 403 (หรือการปฏิเสธอื่นตาม Policy)
4. **การทดสอบความถูกต้องของ State Transition (Simulation Flow):** ยิง API `/advance` เพื่อตรวจสอบการสลับเปลี่ยนสถานะจาก `pending` ไปจนถึง `completed` และทดสอบยิงอีกครั้งหลังจากสิ้นสุดเพื่อยืนยันว่าเกิดความล้มเหลว (400 Bad Request) ตามข้อกำหนดสกีมา

---

## 🎯 Task ถัดไป (จะเริ่มต้นเมื่อจบ Phase 4)
เขียน Feature Tests ทั้งหมด ตรวจสอบให้แน่ใจว่าการทดสอบผ่านด้วยสีเขียวทั้งหมดด้วยคำสั่ง `php artisan test`
