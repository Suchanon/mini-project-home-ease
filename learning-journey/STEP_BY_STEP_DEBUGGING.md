# Step-by-Step Debugging Setup with Xdebug and VS Code

เอกสารนี้รวบรวมขั้นตอนการตั้งค่าและเปิดใช้งานระบบดีบั๊กทีละบรรทัด (Step-by-step Debugging) สำหรับโค้ดฝั่ง Backend (PHP / Laravel) ในโปรเจคนี้ โดยทำงานร่วมกับ **Laravel Herd** บน macOS (สถาปัตยกรรม Apple Silicon - ARM64) และ **VS Code**

---

## 🛠️ ขั้นตอนการติดตั้งและตั้งค่า

### 1. เปิดใช้งาน Xdebug ใน PHP (Laravel Herd)
เนื่องจากตัวติดตั้ง Laravel Herd จะดาวน์โหลดไฟล์ Extension ของ Xdebug แยกต่างหาก เราจำเป็นต้องระบุตำแหน่งและโหลดมันในไฟล์คอนฟิก `php.ini` ด้วยตัวเอง:

1. เปิดไฟล์ตั้งค่า PHP.ini ของ Herd (เวอร์ชัน PHP 8.4):
   * ไฟล์อยู่ที่: `/Users/alex_m3/Library/Application Support/Herd/config/php/84/php.ini`
2. เพิ่มคอนฟิก Xdebug ด้านล่างนี้ลงไปในท้ายไฟล์:
   ```ini
   ; Xdebug config
   zend_extension="/Applications/Herd.app/Contents/Resources/xdebug/xdebug-84-arm64.so"
   xdebug.mode=debug
   xdebug.start_with_request=yes
   xdebug.client_port=9003
   xdebug.client_host=127.0.0.1
   xdebug.idekey=VSCODE
   ```
3. บันทึกไฟล์ `php.ini`

---

### 2. รีสตาร์ทบริการของ Herd
หลังจากแก้ไขไฟล์ `php.ini` แล้ว ให้ทำการรีสตาร์ทบริการของ Herd ใน Terminal เพื่อให้ PHP โหลดคอนฟิกใหม่:
```bash
herd restart
```

*ตรวจสอบว่า Xdebug โหลดสำเร็จหรือไม่โดยรันคำสั่ง `php -v` ใน Terminal ซึ่งควรมีข้อความระบุเวอร์ชันของ Xdebug ปรากฏขึ้น เช่น:*
```text
PHP 8.4.22 ...
    with Xdebug v3.x.x ...
```

---

### 3. ตั้งค่า VS Code สำหรับการดีบั๊ก (VS Code Configuration)
สร้างไฟล์ตั้งค่าการรันดีบั๊กเกอร์ของ VS Code ไว้ที่โฟลเดอร์กิ่งของโปรเจค:

1. สร้างไฟล์ชื่อ `.vscode/launch.json` ไว้ที่ root ของโปรเจค
2. ใส่โค้ดคอนฟิกนี้ลงไป:
   ```json
   {
       "version": "0.2.0",
       "configurations": [
           {
               "name": "Listen for Xdebug (Laravel)",
               "type": "php",
               "request": "launch",
               "port": 9003,
               "pathMappings": {
                   "/Users/alex_m3/Herd/mini-project": "${workspaceFolder}"
               }
           }
       ]
   }
   ```

---

## 🚀 วิธีใช้งานในชีวิตประจำวัน

### การดีบั๊กผ่าน HTTP / API Requests (จากหน้าเว็บ Next.js หรือ Postman)
1. ไปที่แท็บ **Run and Debug** ใน VS Code (`Cmd + Shift + D`)
2. เลือกรูปแบบการดีบั๊กเป็น **`Listen for Xdebug (Laravel)`**
3. กดปุ่ม **Play สีเขียว** ▶️ หรือกดปุ่ม `F5` (แถบสเตตัสบาร์ด้านล่างของ VS Code จะเปลี่ยนเป็นสีส้ม/แดง เพื่อบอกว่ากำลังเริ่ม Listen อยู่)
4. ไปที่ไฟล์โค้ด PHP ในโปรเจค (เช่น คอนโทรลเลอร์หรือโมเดล) แล้วกดคลิกด้านซ้ายของเลขบรรทัดเพื่อเพิ่ม **Breakpoint (จุดวงกลมสีแดง)**
5. ทำการส่ง Request จากหน้าเบราว์เซอร์หรือยิง API จาก Postman เข้ามาที่ Backend
6. โค้ดจะหยุดทำงานทันที ณ บรรทัดที่คุณจุด Breakpoint ไว้ คุณสามารถเริ่มวิเคราะห์ตัวแปรและโครงสร้างข้อมูล ณ เวลานั้นได้ทันที

---

### การดีบั๊กผ่าน CLI Commands (เช่น Artisan Command หรือ Unit/Feature Test)
หากต้องการดีบั๊กตอนรันสคริปต์ทาง CLI ให้ทำขั้นตอนดังนี้:
1. กดเริ่มดีบั๊กใน VS Code ก่อน (เหมือนขั้นตอนที่ 1-3 ข้างต้น)
2. วาง Breakpoint ในจุดที่เกี่ยวข้องในโค้ด
3. รันคำสั่ง CLI โดยใช้คำสั่ง `herd debug` ครอบคำสั่ง PHP เดิม ตัวอย่างเช่น:
   ```bash
   # ดีบั๊กการรันคำสั่ง Seed
   herd debug artisan db:seed

   # ดีบั๊กตอนรัน Test ผ่าน Pest หรือ PHPUnit
   herd debug artisan test --filter=name_of_test
   ```
4. ระบบจะเชื่อมต่อเข้าหา VS Code และหยุดทำงานตรง Breakpoint ให้คุณดีบั๊กทีละบรรทัดได้ทันที

---

## 🔍 เครื่องมือในการควบคุมแถบดีบั๊กของ VS Code
* ⏸️ **Pause (F6):** หยุดสคริปต์ชั่วคราว
* ▶️ **Continue (F5):** รันโค้ดต่อจนกว่าจะเจอ Breakpoint จุดถัดไป
* ↪️ **Step Over (F10):** ข้ามไปรันบรรทัดถัดไปโดยไม่เข้าไปในฟังก์ชันที่ถูกเรียก
* ⬇️ **Step Into (F11):** เจาะลึกเข้าไปดูการทำงานในตัวฟังก์ชันที่เรียกในบรรทัดนั้น
* ⬆️ **Step Out (Shift + F11):** ออกจากฟังก์ชันปัจจุบันกลับไปยังจุดที่เรียกใช้งานก่อนหน้า
* 🔄 **Restart (Cmd + Shift + F5):** รีสตาร์ทการทำงานของสเตสชันการดีบั๊ก
* ⏹️ **Stop (Shift + F5):** หยุดฟังการดีบั๊ก (Disconnect)
