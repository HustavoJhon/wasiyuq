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
        ]);
    }
}
