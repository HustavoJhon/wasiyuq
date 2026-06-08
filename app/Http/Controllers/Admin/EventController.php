<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Announcement\StoreAnnouncementRequest;
use App\Http\Requests\Announcement\UpdateAnnouncementRequest;
use App\Models\Announcement;
use App\Models\Team;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index()
    {
        $query = Announcement::query()
            ->with(['team:id,name,slug', 'author:id,name']);

        if ($search = request('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('type', 'like', "%{$search}%")
                  ->orWhereHas('team', fn($t) => $t->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('author', fn($a) => $a->where('name', 'like', "%{$search}%"));
            });
        }

        $events = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Events/Index', [
            'events' => $events->items(),
            'meta' => [
                'current_page' => $events->currentPage(),
                'last_page' => $events->lastPage(),
                'total' => $events->total(),
                'per_page' => $events->perPage(),
            ],
            'filters' => request()->only(['search']),
        ]);
    }

    public function create()
    {
        $teams = Team::query()
            ->where('is_personal', false)
            ->get(['id', 'name', 'slug']);

        return Inertia::render('Admin/Events/Create', [
            'teams' => $teams,
        ]);
    }

    public function store(StoreAnnouncementRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = Auth::id();
        $data['slug'] = $request->slug ?? Str::slug($request->title);

        Announcement::query()->create($data);

        return redirect()->route('admin.events.index')->with('flash', [
            'toast' => [
                'type' => 'success',
                'message' => 'Evento creado exitosamente',
            ],
        ]);
    }

    public function show(int $id)
    {
        $event = Announcement::query()->with(['team:id,name,slug', 'author:id,name'])->findOrFail($id);

        return Inertia::render('Admin/Events/Show', [
            'event' => $event,
        ]);
    }

    public function edit(int $id)
    {
        $event = Announcement::query()->with('team:id,name,slug')->findOrFail($id);

        $teams = Team::query()
            ->where('is_personal', false)
            ->get(['id', 'name', 'slug']);

        return Inertia::render('Admin/Events/Edit', [
            'event' => $event,
            'teams' => $teams,
        ]);
    }

    public function update(int $id, UpdateAnnouncementRequest $request)
    {
        $event = Announcement::query()->findOrFail($id);

        $data = $request->validated();
        $data['slug'] = $request->slug ?? Str::slug($request->title);

        $event->update($data);

        return redirect()->route('admin.events.index')->with('flash', [
            'toast' => [
                'type' => 'success',
                'message' => 'Evento actualizado exitosamente',
            ],
        ]);
    }

    public function destroy(int $id)
    {
        $event = Announcement::query()->findOrFail($id);
        $event->delete();

        return redirect()->route('admin.events.index')->with('flash', [
            'toast' => [
                'type' => 'success',
                'message' => 'Evento eliminado exitosamente',
            ],
        ]);
    }
}
