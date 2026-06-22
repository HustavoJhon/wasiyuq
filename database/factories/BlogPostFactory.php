<?php

namespace Database\Factories;

use App\Models\BlogPost;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class BlogPostFactory extends Factory
{
    protected $model = BlogPost::class;

    public function definition(): array
    {
        $categories = ['Cuidado', 'Adopción', 'Salud', 'Historias', 'Consejos', 'Eventos'];
        $title = fake()->randomElement([
            'Cómo preparar tu hogar para un nuevo amigo',
            'Los beneficios de adoptar un animal adulto',
            'Alimentación saludable para perros y gatos',
            'Historia de superación: ' . fake()->firstName() . ' encontró un hogar',
            'Consejos para el primer mes de adaptación',
            'La importancia de la esterilización',
            'Señales de que tu mascota está feliz',
            'Cómo socializar a tu perro con otros animales',
        ]);

        return [
            'team_id' => Team::factory(),
            'user_id' => User::factory(),
            'title' => $title,
            'slug' => Str::slug($title) . '-' . Str::random(4),
            'excerpt' => fake()->sentence(15),
            'content' => fake()->paragraphs(6, true),
            'cover_image' => null,
            'category' => fake()->randomElement($categories),
            'tags' => fake()->randomElements(['adopción', 'cuidado', 'salud', 'bienestar', 'consejos', 'historias'], fake()->numberBetween(2, 4)),
            'is_published' => fake()->boolean(85),
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
}
