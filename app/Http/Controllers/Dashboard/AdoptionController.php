<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Adoption;
use App\Models\Team;
use App\Services\AdoptionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdoptionController extends Controller
{
    public function __construct(
        private readonly AdoptionService $adoptionService,
    ) {}

    public function index(Team $current_team, Request $request)
    {
        $status = $request->query('status');

        $adoptions = Adoption::query()
            ->where('team_id', $current_team->id)
            ->when($status, fn ($q, $v) => $q->where('status', $v))
            ->with(['pet:id,name,slug,species,photos', 'adopter:id,name,email'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Dashboard/Adoptions/Index', [
            'adoptions' => $adoptions->items(),
            'meta' => [
                'current_page' => $adoptions->currentPage(),
                'last_page' => $adoptions->lastPage(),
                'total' => $adoptions->total(),
                'per_page' => $adoptions->perPage(),
            ],
            'currentTeam' => $current_team,
            'filter' => $status,
        ]);
    }

    public function show(Team $current_team, Adoption $adoption)
    {
        abort_if($adoption->team_id !== $current_team->id, 403);

        $adoption->load(['pet', 'adopter', 'followUps']);

        return Inertia::render('Dashboard/Adoptions/Show', [
            'adoption' => $adoption,
            'currentTeam' => $current_team,
        ]);
    }

    public function approve(Team $current_team, Adoption $adoption)
    {
        abort_if($adoption->team_id !== $current_team->id, 403);

        $this->adoptionService->approve($adoption, Auth::id());

        return redirect()->back()->with('flash', [
            'toast' => [
                'type' => 'success',
                'message' => 'Solicitud aprobada exitosamente.',
            ],
        ]);
    }

    public function reject(Team $current_team, Adoption $adoption, Request $request)
    {
        abort_if($adoption->team_id !== $current_team->id, 403);

        $request->validate(['notes' => 'nullable|string|max:1000']);

        $this->adoptionService->reject($adoption, Auth::id(), $request->notes);

        return redirect()->back()->with('flash', [
            'toast' => [
                'type' => 'success',
                'message' => 'Solicitud rechazada.',
            ],
        ]);
    }
}
