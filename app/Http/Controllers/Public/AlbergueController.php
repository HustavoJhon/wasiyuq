<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\TeamRating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AlbergueController extends Controller
{
    public function index(Request $request)
    {
        $teams = Team::query()
            ->where('is_personal', false)
            ->withCount('pets')
            ->withCount('ratings')
            ->withAvg('ratings', 'rating')
            ->when($request->query('city'), fn ($q, $v) => $q->where('city', 'like', "%{$v}%"))
            ->when($request->query('search'), fn ($q, $v) => $q->where(fn ($q) => $q->where('name', 'like', "%{$v}%")->orWhere('bio', 'like', "%{$v}%")))
            ->when($request->query('sort') === 'rating', fn ($q) => $q->orderByDesc('ratings_avg_rating'))
            ->when($request->query('sort') !== 'rating', fn ($q) => $q->latest())
            ->paginate(12);

        $cities = Team::query()->where('is_personal', false)->whereNotNull('city')->distinct()->orderBy('city')->pluck('city');

        return Inertia::render('Adopter/Albergues/Index', [
            'seo' => ['title' => 'Albergues', 'description' => 'Organizaciones y albergues de animales en Cusco.', 'url' => url('/mi-adopcion/albergues'), 'type' => 'website'],
            'albergues' => $teams->items(),
            'meta' => ['current_page' => $teams->currentPage(), 'last_page' => $teams->lastPage(), 'total' => $teams->total(), 'per_page' => $teams->perPage()],
            'filters' => $request->only(['city', 'search', 'sort']),
            'cities' => $cities->toArray(),
        ]);
    }

    public function show(string $slug)
    {
        $team = Team::query()
            ->where('slug', $slug)
            ->withCount('pets')
            ->withCount(['ratings'])
            ->withAvg('ratings', 'rating')
            ->with(['ratings' => fn ($q) => $q->latest()->with('user:id,name')->take(20)])
            ->firstOrFail();

        $userRating = Auth::check() ? TeamRating::where('team_id', $team->id)->where('user_id', Auth::id())->first() : null;

        $stats = [
            'pets_count' => $team->pets()->count(),
            'available_pets' => $team->pets()->where('status', 'available')->count(),
            'adopted_pets' => $team->pets()->where('status', 'adopted')->count(),
            'events_count' => $team->announcements()->count(),
        ];

        return Inertia::render('Adopter/Albergues/Show', [
            'albergue' => array_merge($team->toArray(), [
                'social_links' => $team->social_links,
                'map_embed' => $team->map_embed,
                'gallery' => $team->gallery,
                'support_info' => $team->support_info,
                'average_rating' => $team->averageRating(),
                'ratings_count' => $team->ratingsCount(),
                'ratings' => $team->ratings,
            ]),
            'userRating' => $userRating,
            'stats' => $stats,
            'seo' => ['title' => $team->name.' — Albergue en '.($team->city ?? 'Cusco'), 'description' => \Illuminate\Support\Str::limit(strip_tags((string) ($team->bio ?? '')), 160), 'url' => url('/mi-adopcion/albergues/'.$team->slug), 'type' => 'place'],
        ]);
    }

    public function rate(Request $request, string $slug)
    {
        $request->validate(['rating' => 'required|integer|min:1|max:5', 'comment' => 'nullable|string|max:1000']);
        $team = Team::where('slug', $slug)->firstOrFail();

        TeamRating::updateOrCreate(
            ['team_id' => $team->id, 'user_id' => Auth::id()],
            ['rating' => $request->input('rating'), 'comment' => $request->input('comment')],
        );

        return back()->with('flash', ['toast' => ['type' => 'success', 'message' => 'Calificación guardada.']]);
    }
}
