<?php

namespace Database\Factories;

use App\Enums\PetSize;
use App\Enums\PetSpecies;
use App\Enums\PetStatus;
use App\Models\Pet;
use App\Models\Team;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PetFactory extends Factory
{
    protected $model = Pet::class;

    private static array $breeds = [
        'dog' => ['Labrador', 'Pastor Alemán', 'Golden Retriever', 'Bulldog', 'Poodle', 'Chihuahua', 'Mestizo'],
        'cat' => ['Persa', 'Siamés', 'Maine Coon', 'Bengalí', 'Angora', 'Criollo'],
        'rabbit' => ['Holandés', 'Mini Lop', 'Rex', 'Angora', 'Común'],
        'bird' => ['Perico', 'Canario', 'Agaporni', 'Cacatúa', 'Loro'],
        'other' => ['Hámster', 'Cobayo', 'Tortuga', 'Erizo', 'Hurón'],
    ];

    public function definition(): array
    {
        $species = fake()->randomElement(PetSpecies::cases());
        $breeds = self::$breeds[$species->value] ?? ['Mestizo'];
        $name = fake()->firstName();

        return [
            'team_id' => Team::factory(),
            'name' => $name,
            'slug' => Str::slug($name) . '-' . Str::random(6),
            'species' => $species->value,
            'breed' => fake()->randomElement($breeds),
            'age_years' => fake()->numberBetween(0, 10),
            'age_months' => fake()->numberBetween(0, 11),
            'gender' => fake()->randomElement(['male', 'female']),
            'size' => fake()->randomElement(PetSize::cases())->value,
            'color' => fake()->randomElement(['Marrón', 'Negro', 'Blanco', 'Gris', 'Dorado', 'Tricolor', 'Atigrado']),
            'description' => fake()->paragraphs(3, true),
            'medical_notes' => fake()->optional(0.6)->sentence(),
            'status' => fake()->randomElement([
                PetStatus::Available->value,
                PetStatus::Available->value,
                PetStatus::Available->value,
                PetStatus::Adopted->value,
                PetStatus::InProcess->value,
                PetStatus::Withheld->value,
            ]),
            'photos' => null,
        ];
    }

    public function available(): static
    {
        return $this->state(fn () => ['status' => PetStatus::Available->value]);
    }

    public function adopted(): static
    {
        return $this->state(fn () => ['status' => PetStatus::Adopted->value]);
    }

    public function dog(): static
    {
        return $this->state(fn () => [
            'species' => PetSpecies::Dog->value,
            'breed' => fake()->randomElement(self::$breeds['dog']),
        ]);
    }

    public function cat(): static
    {
        return $this->state(fn () => [
            'species' => PetSpecies::Cat->value,
            'breed' => fake()->randomElement(self::$breeds['cat']),
        ]);
    }
}
