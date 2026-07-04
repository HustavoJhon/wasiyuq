<?php

namespace App\Http\Controllers\Adopter;

use App\Http\Controllers\Controller;
use App\Models\Pet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PetController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        $pets = Pet::query()
            ->whereHas('team', fn ($q) => $q->where('is_personal', true))
            ->whereHas('team.members', fn ($q) => $q->where('user_id', $userId))
            ->with('team:id,name,slug')
            ->latest()
            ->paginate(12);

        return Inertia::render('Adopter/Pets/Index', [
            'pets' => $pets->items(),
            'meta' => [
                'current_page' => $pets->currentPage(),
                'last_page' => $pets->lastPage(),
                'total' => $pets->total(),
                'per_page' => $pets->perPage(),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Adopter/Pets/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'species' => 'required|string|in:dog,cat,rabbit,bird,other',
            'breed' => 'nullable|string|max:255',
            'age_years' => 'nullable|integer|min:0|max:30',
            'age_months' => 'nullable|integer|min:0|max:11',
            'gender' => 'required|string|in:male,female',
            'size' => 'nullable|string|in:small,medium,large',
            'color' => 'nullable|string|max:100',
            'status' => 'required|string|in:available',
            'description' => 'nullable|string|max:5000',
            'medical_notes' => 'nullable|string|max:5000',
            'photo' => 'nullable|image|max:5120',
        ]);

        $user = Auth::user();
        $personalTeam = $user->personalTeam();

        if (! $personalTeam) {
            return back()->with('flash', [
                'toast' => ['type' => 'error', 'message' => 'No se encontró tu equipo personal.'],
            ]);
        }

        $data['team_id'] = $personalTeam->id;
        $data['slug'] = Pet::generateUniqueSlug($data['name']);

        $photos = [];
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('pets', 'public');
            $photos[] = Storage::url($path);
        }
        $data['photos'] = ! empty($photos) ? $photos : null;

        Pet::create($data);

        return redirect()->route('adopter.pets.index')->with('flash', [
            'toast' => ['type' => 'success', 'message' => 'Mascota publicada correctamente.'],
        ]);
    }

    public function destroy(Pet $pet)
    {
        $user = Auth::user();
        $personalTeam = $user->personalTeam();

        if (! $personalTeam || $pet->team_id !== $personalTeam->id) {
            abort(403);
        }

        $pet->delete();

        return back()->with('flash', [
            'toast' => ['type' => 'success', 'message' => 'Mascota eliminada.'],
        ]);
    }
}
