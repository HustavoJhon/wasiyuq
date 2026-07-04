<?php

namespace App\Http\Controllers\Adopter;

use App\Http\Controllers\Controller;
use App\Models\LostPet;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LostPetController extends Controller
{
    public function index()
    {
        $pets = LostPet::query()
            ->where('user_id', Auth::id())
            ->latest()
            ->paginate(12);

        return Inertia::render('Adopter/LostPets/Index', [
            'pets' => $pets->items(),
            'meta' => [
                'current_page' => $pets->currentPage(),
                'last_page' => $pets->lastPage(),
                'total' => $pets->total(),
                'per_page' => $pets->perPage(),
            ],
        ]);
    }
}
