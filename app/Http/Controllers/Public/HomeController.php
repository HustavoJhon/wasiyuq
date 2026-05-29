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
        return Inertia::render('Public/Home', [
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
        ]);
    }
}
