<?php

namespace App\Http\Controllers\Adopter;

use App\Http\Controllers\Controller;
use App\Models\Adoption;
use App\Models\FollowUp;
use App\Services\PetRecommendationService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(
        private readonly PetRecommendationService $recommendationService,
    ) {}

    public function index()
    {
        $userId = Auth::id();

        $applications = Adoption::query()
            ->where('user_id', $userId)
            ->with('pet:id,name,slug,species,photos')
            ->latest()
            ->get();

        $upcomingFollowUps = FollowUp::query()
            ->whereHas('adoption', fn ($q) => $q->where('user_id', $userId))
            ->with(['adoption.pet:id,name,slug,photos'])
            ->where('status', 'pending')
            ->orderBy('scheduled_date')
            ->take(5)
            ->get();

        $recommendedPets = $this->recommendationService->getRecommendedPets(Auth::user(), 6);

        $stats = [
            'total_applications' => $applications->count(),
            'pending_applications' => $applications->where('status', 'pending')->count(),
            'approved_applications' => $applications->where('status', 'approved')->count(),
            'completed_adoptions' => $applications->where('status', 'completed')->count(),
            'pending_follow_ups' => $upcomingFollowUps->count(),
            'recent_applications' => $applications->take(3)->values(),
        ];

        return Inertia::render('Adopter/Dashboard', [
            'stats' => $stats,
            'recommendedPets' => $recommendedPets,
        ]);
    }
}
