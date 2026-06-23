<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Provider;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // 1. สร้างผู้ใช้สำหรับล็อกอินทดสอบ
        User::factory()->create([
            'name' => 'Test Customer',
            'email' => 'customer@homeease.test',
            'password' => bcrypt('password123'),
            'phone' => '0812345678',
        ]);

        // 2. รัน Seeder สร้างหมวดหมู่และบริการ
        $this->call(CategoryAndServiceSeeder::class);

        // 3. ดึงหมวดหมู่ทั้งหมดขึ้นมารอไว้
        $categories = Category::all();

        // 4. สุ่มสร้างช่าง 10 คน และผูกความเชี่ยวชาญแบบสุ่ม 1-2 หมวดหมู่ต่อคน
        Provider::factory(10)->create()->each(function (Provider $provider) use ($categories) {
            $provider->categories()->attach(
                $categories->random(rand(1, 2))->pluck('id')->toArray()
            );
        });
    }
}
