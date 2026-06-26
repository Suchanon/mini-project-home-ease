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
            'description' => 'Repair leaking pipes, faucets, and home plumbing systems.',
        ]);

        Service::create([
            'category_id' => $plumbing->id,
            'name' => 'Leaking Pipe Repair',
            'description' => 'Locate leak sources and repair damaged water supply pipes.',
            'base_price' => 500.00,
        ]);

        Service::create([
            'category_id' => $plumbing->id,
            'name' => 'Faucet / Sink Installation',
            'description' => 'Install or replace faucets, kitchen sinks, or basin drains.',
            'base_price' => 1200.00,
        ]);

        // 2. Electrical
        $electrical = Category::create([
            'name' => 'Electrical',
            'slug' => 'electrical',
            'description' => 'Electrical repair, fuse box inspection, and home wiring services.',
        ]);

        Service::create([
            'category_id' => $electrical->id,
            'name' => 'Switch / Outlet Replacement',
            'description' => 'Replace damaged outlets or light switches for safety.',
            'base_price' => 350.00,
        ]);

        Service::create([
            'category_id' => $electrical->id,
            'name' => 'New Wiring & Light Installation',
            'description' => 'Install new wiring indoor/outdoor and mount light fixtures.',
            'base_price' => 1500.00,
        ]);

        // 3. AC Repair
        $ac = Category::create([
            'name' => 'AC Repair',
            'slug' => 'ac-repair',
            'description' => 'Air conditioner washing, refrigerant refilling, and maintenance services.',
        ]);

        Service::create([
            'category_id' => $ac->id,
            'name' => 'Wall-Mounted AC Cleaning (9,000-12,000 BTU)',
            'description' => 'Deep clean air filters, indoor coils, and outdoor units using high-pressure pumps.',
            'base_price' => 600.00,
        ]);

        Service::create([
            'category_id' => $ac->id,
            'name' => 'Refrigerant Leak Check & R32 Refill',
            'description' => 'Check refrigerant levels and refill R32 gas to restore cooling performance.',
            'base_price' => 800.00,
        ]);
    }
}
