<?php

namespace App\Http\Controllers\Admin;

use App\Enums\TeamRole;
use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrganizationController extends Controller
{
    public function index()
    {
        $query = Team::query()
            ->where('is_personal', false)
            ->withCount(['pets', 'adoptions', 'announcements', 'blogPosts']);

        if ($search = request('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('state', 'like', "%{$search}%")
                    ->orWhere('bio', 'like', "%{$search}%");
            });
        }

        $organizations = $query->latest()->paginate(15)->withQueryString();

        $stats = [
            'total_organizations' => Team::where('is_personal', false)->count(),
            'total_pets' => \App\Models\Pet::count(),
            'total_adoptions' => \App\Models\Adoption::count(),
            'total_events' => \App\Models\Announcement::count(),
        ];

        return Inertia::render('Admin/Organizations/Index', [
            'organizations' => $organizations->items(),
            'meta' => [
                'current_page' => $organizations->currentPage(),
                'last_page' => $organizations->lastPage(),
                'total' => $organizations->total(),
                'per_page' => $organizations->perPage(),
            ],
            'filters' => request()->only(['search']),
            'stats' => $stats,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Organizations/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'logo' => ['nullable', 'url'],
            'website' => ['nullable', 'url'],
            'phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:100'],
            'social_links' => ['nullable', 'array'],
        ]);

        $validated['is_personal'] = false;

        $team = Team::query()->create($validated);

        $team->members()->attach(Auth::id(), ['role' => TeamRole::Owner->value]);

        return redirect()->route('admin.organizations.index')->with('flash', [
            'toast' => [
                'type' => 'success',
                'message' => 'Organización creada exitosamente',
            ],
        ]);
    }

    public function show(Team $team)
    {
        $team->loadCount(['pets', 'adoptions', 'announcements', 'blogPosts', 'members']);

        $team->load([
            'members' => fn ($q) => $q->select('users.id', 'users.name', 'users.email'),
            'pets' => fn ($q) => $q->latest()->take(10),
        ]);

        $speciesStats = $team->pets()
            ->selectRaw('species, count(*) as count')
            ->groupBy('species')
            ->pluck('count', 'species');

        $statusStats = $team->pets()
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        return Inertia::render('Admin/Organizations/Show', [
            'organization' => $team,
            'speciesStats' => $speciesStats,
            'statusStats' => $statusStats,
        ]);
    }

    public function edit(Team $team)
    {
        $team->load(['members' => fn ($q) => $q->select('users.id', 'users.name', 'users.email')]);

        return Inertia::render('Admin/Organizations/Edit', [
            'organization' => $team,
        ]);
    }

    public function update(Team $team, Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'logo' => ['nullable', 'url'],
            'website' => ['nullable', 'url'],
            'phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:100'],
            'social_links' => ['nullable', 'array'],
        ]);

        $team->update($validated);

        return redirect()->route('admin.organizations.index')->with('flash', [
            'toast' => [
                'type' => 'success',
                'message' => 'Organización actualizada exitosamente',
            ],
        ]);
    }

    public function destroy(Team $team)
    {
        $team->delete();

        return redirect()->route('admin.organizations.index')->with('flash', [
            'toast' => [
                'type' => 'success',
                'message' => 'Organización eliminada exitosamente',
            ],
        ]);
    }
}
