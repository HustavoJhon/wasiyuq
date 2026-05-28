<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Announcement\StoreAnnouncementRequest;
use App\Http\Requests\Announcement\UpdateAnnouncementRequest;
use App\Models\Announcement;
use App\Models\Team;
use App\Services\AnnouncementService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class EventController extends Controller
{
    public function __construct(
        private readonly AnnouncementService $announcementService,
    ) {}

    public function index(Request $request)
    {
        $team = Team::where('slug', $request->route('current_team'))->firstOrFail();

        $events = Announcement::query()
            ->where('team_id', $team->id)
            ->with(['author:id,name'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Dashboard/Events/Index', [
            'events' => $events->items(),
            'currentTeam' => $team,
            'meta' => [
                'current_page' => $events->currentPage(),
                'last_page' => $events->lastPage(),
                'total' => $events->total(),
                'per_page' => $events->perPage(),
            ],
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('Dashboard/Events/Create', [
            'currentTeam' => Team::where('slug', $request->route('current_team'))->firstOrFail(),
        ]);
    }

    public function store(StoreAnnouncementRequest $request)
    {
        $team = Team::where('slug', $request->route('current_team'))->firstOrFail();

        $data = $request->validated();
        $data['team_id'] = $team->id;
        $data['user_id'] = Auth::id();
        $data['slug'] = $request->slug ?? Str::slug($request->title);
        $data['published_at'] = $data['is_published'] ? now() : null;

        $this->announcementService->create($data);

        return redirect()->route('teams.events.index', $team->slug)->with('flash', [
            'toast' => ['type' => 'success', 'message' => 'Evento creado exitosamente'],
        ]);
    }

    public function show(Request $request, int $id)
    {
        $team = Team::where('slug', $request->route('current_team'))->firstOrFail();

        $event = Announcement::query()
            ->where('team_id', $team->id)
            ->with(['author:id,name'])
            ->findOrFail($id);

        return Inertia::render('Dashboard/Events/Show', [
            'event' => $event,
            'currentTeam' => $team,
        ]);
    }

    public function edit(Request $request, int $id)
    {
        $team = Team::where('slug', $request->route('current_team'))->firstOrFail();

        $event = Announcement::query()
            ->where('team_id', $team->id)
            ->findOrFail($id);

        return Inertia::render('Dashboard/Events/Edit', [
            'event' => $event,
            'currentTeam' => $team,
        ]);
    }

    public function update(Request $request, int $id, UpdateAnnouncementRequest $updateRequest)
    {
        $team = Team::where('slug', $request->route('current_team'))->firstOrFail();

        $event = Announcement::query()
            ->where('team_id', $team->id)
            ->findOrFail($id);

        $data = $updateRequest->validated();
        $data['slug'] = $request->slug ?? Str::slug($request->title);

        if ($data['is_published'] && !$event->published_at) {
            $data['published_at'] = now();
        }

        $this->announcementService->update($event, $data);

        return redirect()->route('teams.events.index', $team->slug)->with('flash', [
            'toast' => ['type' => 'success', 'message' => 'Evento actualizado exitosamente'],
        ]);
    }

    public function destroy(Request $request, int $id)
    {
        $team = Team::where('slug', $request->route('current_team'))->firstOrFail();

        $event = Announcement::query()
            ->where('team_id', $team->id)
            ->findOrFail($id);

        $this->announcementService->delete($event);

        return redirect()->route('teams.events.index', $team->slug)->with('flash', [
            'toast' => ['type' => 'success', 'message' => 'Evento eliminado'],
        ]);
    }
}
