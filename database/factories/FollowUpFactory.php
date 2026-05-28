<?php

namespace Database\Factories;

use App\Enums\FollowUpStatus;
use App\Models\Adoption;
use App\Models\FollowUp;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class FollowUpFactory extends Factory
{
    protected $model = FollowUp::class;

    public function definition(): array
    {
        return [
            'adoption_id' => Adoption::factory(),
            'scheduled_date' => fake()->dateTimeBetween('-2 months', '+1 month')->format('Y-m-d'),
            'completed_date' => null,
            'status' => FollowUpStatus::Pending->value,
            'notes' => fake()->optional(0.7)->paragraph(),
            'photos' => null,
            'created_by' => User::factory(),
        ];
    }

    public function completed(): static
    {
        $completedDate = fake()->dateTimeBetween('-2 months', '-1 day');

        return $this->state(fn () => [
            'status' => FollowUpStatus::Completed->value,
            'completed_date' => $completedDate->format('Y-m-d'),
            'scheduled_date' => $completedDate->modify('-7 days')->format('Y-m-d'),
            'notes' => fake()->paragraph(),
        ]);
    }

    public function missed(): static
    {
        return $this->state(fn () => [
            'status' => FollowUpStatus::Missed->value,
            'scheduled_date' => fake()->dateTimeBetween('-1 month', '-1 week')->format('Y-m-d'),
            'completed_date' => null,
            'notes' => 'No se pudo realizar la visita. ' . fake()->sentence(),
        ]);
    }
}
