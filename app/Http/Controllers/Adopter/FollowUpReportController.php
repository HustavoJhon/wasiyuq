<?php

namespace App\Http\Controllers\Adopter;

use App\Http\Controllers\Controller;
use App\Models\FollowUp;
use App\Services\FollowUpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FollowUpReportController extends Controller
{
    public function __construct(
        private readonly FollowUpService $followUpService,
    ) {}

    public function index()
    {
        $followUps = $this->followUpService->getByAdopter(Auth::id());

        return Inertia::render('Adopter/FollowUp/Index', [
            'followUps' => $followUps,
        ]);
    }

    public function show(FollowUp $followUp)
    {
        $followUp->load('adoption');
        abort_if($followUp->adoption->user_id !== Auth::id(), 403);

        $followUp->load([
            'adoption.pet:id,name,slug,species,photos',
            'adoption.team:id,name,slug',
        ]);

        return Inertia::render('Adopter/FollowUp/Show', [
            'followUp' => $followUp,
        ]);
    }

    public function report(Request $request, FollowUp $followUp)
    {
        $followUp->load('adoption');
        abort_if($followUp->adoption->user_id !== Auth::id(), 403);
        abort_if($followUp->status !== 'pending', 422, 'Este seguimiento ya fue completado');

        $validated = $request->validate([
            'notes' => 'nullable|string|max:1000',
            'photos.*' => 'nullable|image|max:5120',
        ]);

        $this->followUpService->reportMilestone($followUp, $validated);

        return redirect()->back()->with('flash', [
            'toast' => ['type' => 'success', 'message' => 'Reporte enviado correctamente'],
        ]);
    }
}
