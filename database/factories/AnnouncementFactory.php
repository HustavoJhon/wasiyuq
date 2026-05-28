<?php

namespace Database\Factories;

use App\Enums\AnnouncementType;
use App\Models\Announcement;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class AnnouncementFactory extends Factory
{
    protected $model = Announcement::class;

    public function definition(): array
    {
        $title = fake()->randomElement([
            'Feria de Adopción ' . fake()->monthName(),
            'Taller de Cuidado Responsable',
            'Campaña de Esterilización',
            'Jornada de Vacunación Gratuita',
            'Recaudación de Fondos para Refugio',
            'Charla sobre Tenencia Responsable',
            'Bazar Solidario',
            'Caminata Canina',
        ]);

        return [
            'team_id' => Team::factory(),
            'user_id' => User::factory(),
            'title' => $title,
            'slug' => Str::slug($title) . '-' . Str::random(4),
            'description' => fake()->paragraphs(4, true),
            'event_date' => fake()->dateTimeBetween('-1 month', '+3 months'),
            'location' => fake()->randomElement([
                'Plaza de Armas, Cusco',
                'Parque Zonal, San Sebastián',
                'Local Comunal, Wanchaq',
                'Auditorio Municipal, Urubamba',
                'Centro Cultural, Cusco',
            ]),
            'type' => fake()->randomElement(AnnouncementType::cases())->value,
            'cover_image' => null,
            'is_published' => fake()->boolean(80),
            'published_at' => now(),
        ];
    }

    public function published(): static
    {
        return $this->state(fn () => [
            'is_published' => true,
            'published_at' => now(),
        ]);
    }

    public function past(): static
    {
        return $this->state(fn () => [
            'event_date' => fake()->dateTimeBetween('-3 months', '-1 day'),
            'is_published' => true,
            'published_at' => now()->subMonth(),
        ]);
    }

    public function upcoming(): static
    {
        return $this->state(fn () => [
            'event_date' => fake()->dateTimeBetween('+1 week', '+3 months'),
            'is_published' => true,
            'published_at' => now(),
        ]);
    }
}
