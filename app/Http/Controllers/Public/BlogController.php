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

        return Inertia::render('Public/Blog/Index', [
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
