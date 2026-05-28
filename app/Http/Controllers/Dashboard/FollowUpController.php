<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Adoption;
use App\Models\FollowUp;
use App\Models\Team;
use App\Services\FollowUpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FollowUpController extends Controller
{
    public function __construct(
        private readonly FollowUpService $followUpService,
    ) {}

    public function index(Request $request)
    {
        $team = Team::where('slug', $request->route('current_team'))->firstOrFail();

        $followUps = $this->followUpService->getByTeam(
            $team->id,
            $request->query('status'),
        );

        return Inertia::render('Dashboard/FollowUp/Index', [
            'followUps' => $followUps,
            'currentTeam' => $team,
            'filter' => $request->query('status'),
        ]);
    }

    public function show(Request $request, FollowUp $followUp)
    {
        $followUp->load([
            'adoption.pet:id,name,slug,species,photos',
            'adoption.adopter:id,name,email',
            'createdBy:id,name',
        ]);

        return Inertia::render('Dashboard/FollowUp/Show', [
            'followUp' => $followUp,
            'currentTeam' => Team::where('slug', $request->route('current_team'))->firstOrFail(),
        ]);
    }

    public function markCompleted(Request $request, FollowUp $followUp)
    {
        $this->followUpService->markCompleted($followUp);

        return redirect()->back()->with('flash', [
            'toast' => ['type' => 'success', 'message' => 'Seguimiento marcado como completado'],
        ]);
    }

    public function markMissed(Request $request, FollowUp $followUp)
    {
        $this->followUpService->markMissed($followUp);

        return redirect()->back()->with('flash', [
            'toast' => ['type' => 'success', 'message' => 'Seguimiento marcado como no realizado'],
        ]);
    }

    public function schedule(Request $request)
    {
        $validated = $request->validate([
            'adoption_id' => 'required|exists:adoptions,id',
            'scheduled_date' => 'required|date|after:today',
            'notes' => 'nullable|string|max:500',
        ]);

        $adoption = Adoption::findOrFail($validated['adoption_id']);

        $this->followUpService->scheduleAdditional($adoption, [
            'scheduled_date' => $validated['scheduled_date'],
            'notes' => $validated['notes'] ?? null,
            'created_by' => Auth::id(),
        ]);

        return redirect()->back()->with('flash', [
            'toast' => ['type' => 'success', 'message' => 'Nuevo seguimiento programado'],
        ]);
    }
}
