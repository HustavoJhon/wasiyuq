<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Services\BlogPostService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function __construct(
        private readonly BlogPostService $blogPostService,
    ) {}

    public function index(Request $request)
    {
        $posts = $this->blogPostService->searchPublished(
            category: $request->query('category'),
        );

        $total = $posts->total();

        return Inertia::render('Public/Blog/Index', [
            'seo' => [
                'title' => 'Blog',
                'description' => $total.' artículos sobre adopción responsable, salud animal, normativas y consejos para el cuidado de mascotas en Cusco.',
                'url' => url('/blog'),
                'type' => 'website',
            ],
            'posts' => $posts->items(),
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'total' => $posts->total(),
                'per_page' => $posts->perPage(),
            ],
            'filters' => $request->only(['category']),
        ]);
    }

    public function show(string $slug)
    {
        $post = $this->blogPostService->findBySlug($slug);

        abort_unless($post, 404);

        $authorName = $post->author?->name ?? 'Wasiyuq';

        return Inertia::render('Public/Blog/Show', [
            'post' => $post,
            'seo' => [
                'title' => $post->title,
                'description' => \Illuminate\Support\Str::limit(strip_tags((string) ($post->excerpt ?? $post->content ?? '')), 160),
                'image' => $post->cover_image,
                'url' => url('/blog/'.$post->slug),
                'type' => 'article',
                'author' => $authorName,
                'publishedAt' => $post->published_at?->toIso8601String(),
                'modifiedAt' => $post->updated_at->toIso8601String(),
            ],
            'jsonLd' => [
                '@context' => 'https://schema.org',
                '@type' => 'Article',
                'headline' => $post->title,
                'description' => $post->excerpt,
                'author' => ['@type' => 'Person', 'name' => $authorName],
                'datePublished' => $post->published_at?->toIso8601String(),
                'dateModified' => $post->updated_at->toIso8601String(),
                'url' => url('/blog/'.$post->slug),
            ],
        ]);
    }
}
