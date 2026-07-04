<?php

namespace App\Http\Controllers\Teams;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\Veterinarian;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VeterinarianController extends Controller
{
    public function index(Team $current_team)
    {
        $vets = Veterinarian::query()
            ->where('team_id', $current_team->id)
            ->withCount('ratings')
            ->withAvg('ratings', 'rating')
            ->latest()
            ->paginate(12);

        return Inertia::render('Dashboard/Veterinarians/Index', [
            'veterinarians' => $vets->items(),
            'meta' => [
                'current_page' => $vets->currentPage(),
                'last_page' => $vets->lastPage(),
                'total' => $vets->total(),
                'per_page' => $vets->perPage(),
            ],
            'currentTeam' => $current_team,
        ]);
    }

    public function store(Request $request, Team $current_team)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'city' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:50',
            'whatsapp' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'description' => 'nullable|string|max:2000',
            'services' => 'nullable|array',
            'services.*' => 'string|max:100',
        ]);

        $data['team_id'] = $current_team->id;
        $data['is_verified'] = true;

        Veterinarian::create($data);

        return back()->with('flash', [
            'toast' => ['type' => 'success', 'message' => 'Veterinaria agregada.'],
        ]);
    }

    public function destroy(Team $current_team, Veterinarian $veterinarian)
    {
        $veterinarian->delete();

        return back()->with('flash', [
            'toast' => ['type' => 'success', 'message' => 'Veterinaria eliminada.'],
        ]);
    }
}
