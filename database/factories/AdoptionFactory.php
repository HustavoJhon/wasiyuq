<?php

namespace Database\Factories;

use App\Enums\AdoptionStatus;
use App\Models\Adoption;
use App\Models\Pet;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AdoptionFactory extends Factory
{
    protected $model = Adoption::class;

    public function definition(): array
    {
        return [
            'pet_id' => Pet::factory(),
            'user_id' => User::factory(),
            'team_id' => Team::factory(),
            'status' => fake()->randomElement([
                AdoptionStatus::Pending->value,
                AdoptionStatus::Approved->value,
                AdoptionStatus::Completed->value,
                AdoptionStatus::Rejected->value,
            ]),
            'motivation' => fake()->paragraphs(2, true),
            'experience_with_pets' => fake()->boolean(70),
            'has_yard' => fake()->boolean(50),
            'housing_type' => fake()->randomElement(['Casa', 'Departamento', 'Casa con jardín', 'Quinta']),
            'family_composition' => fake()->randomElement(['Vive solo', 'Pareja', 'Familia con hijos', 'Familia numerosa', 'Comparte piso']),
            'notes' => fake()->optional(0.4)->sentence(),
            'reviewed_by' => null,
            'reviewed_at' => null,
        ];
    }

    public function pending(): static
    {
        return $this->state(fn () => [
            'status' => AdoptionStatus::Pending->value,
            'reviewed_by' => null,
            'reviewed_at' => null,
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attrs) => [
            'status' => AdoptionStatus::Completed->value,
            'reviewed_by' => User::factory(),
            'reviewed_at' => now()->subDays(fake()->numberBetween(1, 60)),
        ]);
    }

    public function reviewed(): static
    {
        return $this->state(fn () => [
            'reviewed_by' => User::factory(),
            'reviewed_at' => now()->subDays(fake()->numberBetween(1, 30)),
        ]);
    }
}
