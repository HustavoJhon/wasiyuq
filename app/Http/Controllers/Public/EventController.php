<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Services\AnnouncementService;
use App\Services\BlogPostService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    private const TYPE_CATEGORY_MAP = [
        'adoption_fair' => 'adopcion',
        'fundraiser' => 'historias',
        'workshop' => 'salud',
        'campaign' => 'salud',
        'other' => null,
    ];

    public function __construct(
        private readonly AnnouncementService $announcementService,
        private readonly BlogPostService $blogPostService,
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

        $relatedBlogs = collect();
        $category = self::TYPE_CATEGORY_MAP[$event->type->value] ?? null;

        if ($category) {
            $relatedBlogs = $this->blogPostService->searchPublished(
                category: $category,
                perPage: 3,
            )->getCollection();
        }

        if ($relatedBlogs->count() < 3) {
            $teamBlogs = $this->blogPostService->searchPublished(
                teamId: $event->team_id,
                perPage: 3 - $relatedBlogs->count(),
            )->getCollection();

            $relatedBlogs = $relatedBlogs->concat($teamBlogs)->unique('id')->take(3);
        }

        return Inertia::render('Public/Events/Show', [
            'event' => $event,
            'relatedBlogs' => $relatedBlogs->values(),
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
