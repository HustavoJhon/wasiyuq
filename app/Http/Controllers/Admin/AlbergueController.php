<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Inertia\Inertia;

class AlbergueController extends Controller
{
    public function index()
    {
        $teams = Team::query()->where('is_personal', false)
            ->withCount('pets')->withCount('ratings')->withAvg('ratings', 'rating')
            ->latest()->paginate(15);

        return Inertia::render('Admin/Albergues/Index', [
            'albergues' => $teams->items(),
            'meta' => ['current_page' => $teams->currentPage(), 'last_page' => $teams->lastPage(), 'total' => $teams->total(), 'per_page' => $teams->perPage()],
        ]);
    }
}
