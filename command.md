# Commands Reference

รวมคำสั่งที่เป็นประโยชน์ในการพัฒนาโปรเจกต์นี้:

* `php artisan migrate:fresh --seed` - ล้างตารางในฐานข้อมูลทั้งหมดใหม่ และรัน Seeder สร้างข้อมูลเริ่มต้นสำหรับการทดสอบ
* `php artisan test --compact` - รันชุดการทดสอบ (Tests) ทั้งหมดในระบบแบบย่อกระชับ
* `vendor/bin/pint --dirty --format agent` - ตรวจสอบและจัดรูปแบบโค้ด (Formatting) เฉพาะไฟล์ที่มีการเปลี่ยนแปลงตามสไตล์ของโปรเจกต์
* `php artisan route:list` - แสดงรายการ Routes ทั้งหมดของแอปพลิเคชัน
