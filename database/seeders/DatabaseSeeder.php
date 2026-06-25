<?php

namespace Database\Seeders;

use App\Enums\ProviderStatus;
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

        // 4. สร้างช่างที่ 'available' แน่นอนหมวดหมู่ละ 2 คน (เพื่อให้ทุกบริการมีผู้ให้บริการอย่างน้อย 2 คน)
        foreach ($categories as $category) {
            Provider::factory(2)->create([
                'status' => ProviderStatus::Available,
            ])->each(function (Provider $provider) use ($category) {
                $provider->categories()->attach($category->id);
            });
        }

        // 5. สุ่มสร้างช่างเพิ่มเติมอีก 4 คน เพื่อให้รวมเป็น 10 คน และผูกความเชี่ยวชาญแบบสุ่ม
        Provider::factory(4)->create()->each(function (Provider $provider) use ($categories) {
            $provider->categories()->attach(
                $categories->random(rand(1, 2))->pluck('id')->toArray()
            );
        });
    }
}
