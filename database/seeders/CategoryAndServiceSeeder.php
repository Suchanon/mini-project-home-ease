<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Service;
use Illuminate\Database\Seeder;

class CategoryAndServiceSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Plumbing
        $plumbing = Category::create([
            'name' => 'Plumbing',
            'slug' => 'plumbing',
            'description' => 'บริการซ่อมแซมท่อน้ำ ก๊อกน้ำ และระบบประปาภายในบ้าน',
        ]);

        Service::create([
            'category_id' => $plumbing->id,
            'name' => 'แก้ไขท่อน้ำรั่วซึม',
            'description' => 'ค้นหาจุดรั่วและซ่อมแซมท่อน้ำประปาที่เสียหาย',
            'base_price' => 500.00,
        ]);

        Service::create([
            'category_id' => $plumbing->id,
            'name' => 'ติดตั้งก๊อกน้ำ/อ่างล้างจาน',
            'description' => 'ติดตั้งหรือเปลี่ยนก๊อกน้ำ ซิงค์ล้างจาน หรือสะดืออ่าง',
            'base_price' => 1200.00,
        ]);

        // 2. Electrical
        $electrical = Category::create([
            'name' => 'Electrical',
            'slug' => 'electrical',
            'description' => 'บริการซ่อมไฟ ตรวจสอบตู้ไฟ และระบบไฟฟ้าภายในบ้าน',
        ]);

        Service::create([
            'category_id' => $electrical->id,
            'name' => 'เปลี่ยนสวิตช์/เต้ารับไฟฟ้า',
            'description' => 'เปลี่ยนเต้าเสียบ สวิตช์ไฟที่ชำรุดเสียหาย เพื่อความปลอดภัย',
            'base_price' => 350.00,
        ]);

        Service::create([
            'category_id' => $electrical->id,
            'name' => 'เดินสายไฟและติดตั้งโคมไฟจุดใหม่',
            'description' => 'เดินสายไฟภายใน/ภายนอกอาคาร พร้อมติดตั้งอุปกรณ์ส่องสว่าง',
            'base_price' => 1500.00,
        ]);

        // 3. AC Repair
        $ac = Category::create([
            'name' => 'AC Repair',
            'slug' => 'ac-repair',
            'description' => 'บริการล้างแอร์ เติมน้ำยา และซ่อมบำรุงเครื่องปรับอากาศ',
        ]);

        Service::create([
            'category_id' => $ac->id,
            'name' => 'ล้างแอร์ติดผนัง (9,000-12,000 BTU)',
            'description' => 'ล้างทำความสะอาดแอร์ฟิลเตอร์ คอยล์เย็น คอยล์ร้อน ด้วยปั๊มแรงดันสูง',
            'base_price' => 600.00,
        ]);

        Service::create([
            'category_id' => $ac->id,
            'name' => 'ตรวจเช็คและเติมน้ำยาแอร์ R32',
            'description' => 'วัดระดับน้ำยาแอร์และเติมเพิ่มเพื่อให้แอร์กลับมาเย็นฉ่ำ',
            'base_price' => 800.00,
        ]);
    }
}
