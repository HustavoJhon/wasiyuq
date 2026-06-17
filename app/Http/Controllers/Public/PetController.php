<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Pet;
use App\Services\PetService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PetController extends Controller
{
    public function __construct(
        private readonly PetService $petService,
    ) {}

    public function index(Request $request)
    {
        $sort = $request->query('sort', 'recent');

        $pets = $this->petService->searchPublished(
            species: $request->query('species'),
            size: $request->query('size'),
            gender: $request->query('gender'),
            search: $request->query('search'),
            sort: $sort === 'oldest' ? 'oldest' : 'recent',
        );

        $speciesCounts = Pet::query()
            ->where('status', 'available')
            ->selectRaw('species, count(*) as total')
            ->groupBy('species')
            ->pluck('total', 'species');

        $statusCounts = Pet::query()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return Inertia::render('Public/Pets/Index', [
            'pets' => $pets->items(),
            'meta' => [
                'current_page' => $pets->currentPage(),
                'last_page' => $pets->lastPage(),
                'total' => $pets->total(),
                'per_page' => $pets->perPage(),
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

        return Inertia::render('Public/Pets/Show', [
            'pet' => $pet,
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
