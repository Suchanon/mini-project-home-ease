<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Category::create([
            'name' => 'Plumbing',
            'slug' => 'plumbing',
            'description' => 'Repair leaking pipes, faucets, and home plumbing systems.',
        ]);

        Category::create([
            'name' => 'Electrical',
            'slug' => 'electrical',
            'description' => 'Electrical repair, fuse box inspection, and home wiring services.',
        ]);

        Category::create([
            'name' => 'AC Repair',
            'slug' => 'ac-repair',
            'description' => 'Air conditioner washing, refrigerant refilling, and maintenance services.',
        ]);
    }
}
