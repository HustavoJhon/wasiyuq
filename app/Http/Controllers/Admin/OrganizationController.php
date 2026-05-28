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
        $organizations = Team::query()
            ->where('is_personal', false)
            ->withCount(['pets', 'adoptions', 'announcements', 'blogPosts'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Organizations/Index', [
            'organizations' => $organizations->items(),
            'meta' => [
                'current_page' => $organizations->currentPage(),
                'last_page' => $organizations->lastPage(),
                'total' => $organizations->total(),
                'per_page' => $organizations->perPage(),
            ],
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
        $team->loadCount(['pets', 'adoptions', 'announcements', 'blogPosts']);
        $team->load(['pets' => fn ($q) => $q->latest()->take(10)]);

        return Inertia::render('Admin/Organizations/Show', [
            'organization' => $team,
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
