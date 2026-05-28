<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Services\AnnouncementService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    public function __construct(
        private readonly AnnouncementService $announcementService,
    ) {}

    public function index(Request $request)
    {
        $events = $this->announcementService->searchPublished(
            type: $request->query('type'),
        );

        return Inertia::render('Public/Events/Index', [
            'events' => $events->items(),
            'meta' => [
                'current_page' => $events->currentPage(),
                'last_page' => $events->lastPage(),
                'total' => $events->total(),
                'per_page' => $events->perPage(),
            ],
            'filters' => $request->only(['type']),
        ]);
    }

    public function show(string $slug)
    {
        $event = $this->announcementService->findBySlug($slug);

        abort_unless($event, 404);

        return Inertia::render('Public/Events/Show', [
            'event' => $event,
            'jsonLd' => [
                '@context' => 'https://schema.org',
                '@type' => 'Event',
                'name' => $event->title,
                'description' => $event->description,
                'startDate' => $event->event_date?->toIso8601String(),
                'location' => $event->location ? ['@type' => 'Place', 'name' => $event->location] : null,
                'url' => url('/eventos/'.$event->slug),
            ],
        ]);
    }
}
