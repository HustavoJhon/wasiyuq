<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Adoption;
use Inertia\Inertia;

class AdoptionController extends Controller
{
    public function index()
    {
        $adoptions = Adoption::query()
            ->with(['pet:id,name,slug,species', 'adopter:id,name,email', 'team:id,name,slug'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Adoptions/Index', [
            'adoptions' => $adoptions->items(),
            'meta' => [
                'current_page' => $adoptions->currentPage(),
                'last_page' => $adoptions->lastPage(),
                'total' => $adoptions->total(),
                'per_page' => $adoptions->perPage(),
            ],
        ]);
    }

    public function show(Adoption $adoption)
    {
        $adoption->load(['pet', 'adopter', 'team', 'reviewer', 'followUps']);

        return Inertia::render('Admin/Adoptions/Show', [
            'adoption' => $adoption,
        ]);
    }
}
