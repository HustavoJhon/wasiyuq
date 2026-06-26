<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Adoption;
use App\Models\Pet;
use App\Models\Team;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $petsAvailable = Pet::query()->where('status', 'available')->count();

        return Inertia::render('Public/Home', [
            'seo' => [
                'title' => 'Inicio',
                'description' => 'Plataforma de adopción responsable en Cusco. Conectamos mascotas en situación de abandono con familias comprometidas. Actualmente hay '.$petsAvailable.' mascotas esperando un hogar.',
                'url' => url('/'),
                'type' => 'website',
            ],
            'stats' => [
                'adopted' => Adoption::query()->where('status', 'completed')->count(),
                'organizations' => Team::query()->where('is_personal', false)->count(),
                'pets_available' => Pet::query()->where('status', 'available')->count(),
            ],
            'species' => [
                'dog' => Pet::query()->where('status', 'available')->where('species', 'dog')->count(),
                'cat' => Pet::query()->where('status', 'available')->where('species', 'cat')->count(),
                'rabbit' => Pet::query()->where('status', 'available')->where('species', 'rabbit')->count(),
                'bird' => Pet::query()->where('status', 'available')->where('species', 'bird')->count(),
                'other' => Pet::query()->where('status', 'available')->where('species', 'other')->count(),
            ],
            'recentPets' => Pet::query()
                ->where('status', 'available')
                ->with('team:id,name,slug,city,state')
                ->latest()
                ->take(4)
                ->get()
                ->map(fn ($pet) => [
                    'id' => $pet->id,
                    'name' => $pet->name,
                    'slug' => $pet->slug,
                    'species' => $pet->species,
                    'breed' => $pet->breed,
                    'age_years' => $pet->age_years,
                    'age_months' => $pet->age_months,
                    'gender' => $pet->gender,
                    'size' => $pet->size,
                    'photos' => $pet->photos,
                    'team' => [
                        'name' => $pet->team->name,
                        'city' => $pet->team->city,
                        'state' => $pet->team->state,
                    ],
                ]),
        ]);
    }
}
