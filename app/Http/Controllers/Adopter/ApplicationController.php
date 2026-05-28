<?php

namespace App\Http\Controllers\Adopter;

use App\Http\Controllers\Controller;
use App\Http\Requests\Adoption\StoreApplicationRequest;
use App\Models\Pet;
use App\Services\AdoptionService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ApplicationController extends Controller
{
    public function __construct(
        private readonly AdoptionService $adoptionService,
    ) {}

    public function index()
    {
        $applications = $this->adoptionService->getByAdopter(Auth::id());

        return Inertia::render('Adopter/Applications/Index', [
            'applications' => $applications,
        ]);
    }

    public function store(string $slug, StoreApplicationRequest $request)
    {
        $pet = Pet::query()->where('slug', $slug)->firstOrFail();

        $existing = $pet->adoptions()
            ->where('user_id', Auth::id())
            ->whereIn('status', ['pending', 'approved'])
            ->exists();

        if ($existing) {
            return redirect()->back()->with('flash', [
                'toast' => [
                    'type' => 'error',
                    'message' => 'Ya tienes una solicitud activa para esta mascota.',
                ],
            ]);
        }

        $adoption = $this->adoptionService->create([
            'pet_id' => $pet->id,
            'user_id' => Auth::id(),
            'team_id' => $pet->team_id,
            'status' => 'pending',
            'motivation' => $request->motivation,
            'experience_with_pets' => $request->experience_with_pets,
            'has_yard' => $request->has_yard,
            'housing_type' => $request->housing_type,
            'family_composition' => $request->family_composition,
        ]);

        return redirect()->route('adopter.applications.index')->with('flash', [
            'toast' => [
                'type' => 'success',
                'message' => 'Solicitud enviada exitosamente. La entidad revisará tu postulación.',
            ],
        ]);
    }
}
