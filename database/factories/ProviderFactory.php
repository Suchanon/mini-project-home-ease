<?php

namespace Database\Factories;

use App\Enums\ProviderStatus;
use App\Models\Provider;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Provider>
 */
class ProviderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'phone' => $this->faker->phoneNumber(),
            'status' => $this->faker->randomElement(ProviderStatus::cases()),
            'rating' => $this->faker->randomFloat(2, 3.5, 5.0),
        ];
    }
}
