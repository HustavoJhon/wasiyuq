<?php

namespace App\Http\Controllers\Teams;

use App\Http\Controllers\Controller;
use App\Models\Shelter;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShelterController extends Controller
{
    public function index(Team $current_team)
    {
        $shelters = Shelter::query()->where('team_id', $current_team->id)->withCount('ratings')->withAvg('ratings', 'rating')->latest()->paginate(12);

        return Inertia::render('Dashboard/Shelters/Index', [
            'shelters' => $shelters->items(),
            'meta' => ['current_page' => $shelters->currentPage(), 'last_page' => $shelters->lastPage(), 'total' => $shelters->total(), 'per_page' => $shelters->perPage()],
            'currentTeam' => $current_team,
        ]);
    }

    public function store(Request $request, Team $current_team)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255', 'address' => 'required|string|max:500', 'city' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:50', 'whatsapp' => 'nullable|string|max:50', 'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255', 'description' => 'nullable|string|max:2000', 'capacity' => 'nullable|integer|min:1',
            'services' => 'nullable|array', 'services.*' => 'string|max:100',
        ]);
        $data['team_id'] = $current_team->id;
        $data['is_verified'] = true;
        Shelter::create($data);

        return back()->with('flash', ['toast' => ['type' => 'success', 'message' => 'Albergue agregado.']]);
    }

    public function destroy(Team $current_team, Shelter $shelter)
    {
        $shelter->delete();

        return back()->with('flash', ['toast' => ['type' => 'success', 'message' => 'Albergue eliminado.']]);
    }
}
