<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Pet;
use App\Services\PetRecommendationService;
use App\Services\PetService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PetController extends Controller
{
    public function __construct(
        private readonly PetService $petService,
        private readonly PetRecommendationService $recommendationService,
    ) {}

    public function index(Request $request)
    {
        $sort = $request->query('sort', 'recent');
        $user = Auth::user();

        if ($sort === 'compatibility' && $user) {
            $pets = $this->recommendationService->searchPublishedRanked(
                user: $user,
                species: $request->query('species'),
                size: $request->query('size'),
                gender: $request->query('gender'),
                search: $request->query('search'),
                perPage: 12,
            );
        } else {
            $pets = $this->petService->searchPublished(
                species: $request->query('species'),
                size: $request->query('size'),
                gender: $request->query('gender'),
                search: $request->query('search'),
                sort: $sort === 'oldest' ? 'oldest' : 'recent',
            );
        }

        $speciesCounts = Pet::query()
            ->where('status', 'available')
            ->selectRaw('species, count(*) as total')
            ->groupBy('species')
            ->pluck('total', 'species');

        $statusCounts = Pet::query()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $petsItems = is_array($pets) ? [] : $pets->items();
        $total = is_array($pets) ? 0 : $pets->total();

        $species = $request->query('species');

        $seoDescription = $species
            ? 'Mascotas en adopción: '.($speciesCounts[$species] ?? 0).' '.match ($species) {
                'dog' => 'perros',
                'cat' => 'gatos',
                'rabbit' => 'conejos',
                'bird' => 'aves',
                default => 'mascotas',
            }.' disponibles en Cusco. Adopta responsablemente con Wasiyuq.'
            : $total.' mascotas en adopción en Cusco. Perros, gatos, conejos y aves buscan un hogar responsable.';

        return Inertia::render('Public/Pets/Index', [
            'seo' => [
                'title' => $species ? 'Mascotas — '.match ($species) {
                    'dog' => 'Perros',
                    'cat' => 'Gatos',
                    'rabbit' => 'Conejos',
                    'bird' => 'Aves',
                    default => 'Mascotas',
                } : 'Mascotas en adopción',
                'description' => $seoDescription,
                'url' => url('/mascotas'),
                'type' => 'website',
            ],
            'pets' => $petsItems,
            'meta' => [
                'current_page' => is_array($pets) ? 1 : $pets->currentPage(),
                'last_page' => is_array($pets) ? 1 : $pets->lastPage(),
                'total' => is_array($pets) ? 0 : $pets->total(),
                'per_page' => is_array($pets) ? 12 : $pets->perPage(),
            ],
            'filters' => $request->only(['species', 'size', 'gender', 'search', 'sort']),
            'speciesCounts' => $speciesCounts->all(),
            'statusCounts' => $statusCounts->all(),
        ]);
    }

    public function show(string $slug)
    {
        $pet = $this->petService->findBySlug($slug);

        abort_unless($pet, 404);

        $speciesLabel = $pet->species->label();
        $age = $pet->age_years > 0
            ? $pet->age_years.' '.($pet->age_years > 1 ? 'años' : 'año')
            : $pet->age_months.' '.($pet->age_months > 1 ? 'meses' : 'meses');
        $petDescription = "Adopta a {$pet->name}, {$speciesLabel} {$pet->breed} de {$age} en Cusco. {$pet->description}";

        return Inertia::render('Public/Pets/Show', [
            'pet' => $pet,
            'seo' => [
                'title' => $pet->name.' — '.$speciesLabel.' en adopción',
                'description' => \Illuminate\Support\Str::limit($petDescription, 160),
                'image' => $pet->photos ? ($pet->photos[0] ?? null) : null,
                'url' => url('/mascotas/'.$pet->slug),
                'type' => 'product',
            ],
            'jsonLd' => [
                '@context' => 'https://schema.org',
                '@type' => 'Product',
                'name' => $pet->name,
                'description' => "{$speciesLabel} en adopción - {$pet->breed}",
                'category' => 'Pet',
                'url' => url('/mascotas/'.$pet->slug),
            ],
        ]);
    }
}
