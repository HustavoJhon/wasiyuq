<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Blog\StoreBlogPostRequest;
use App\Http\Requests\Blog\UpdateBlogPostRequest;
use App\Models\BlogPost;
use App\Models\Team;
use App\Services\BlogPostService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BlogPostController extends Controller
{
    public function __construct(
        private readonly BlogPostService $blogPostService,
    ) {}

    public function index(Request $request)
    {
        $team = Team::where('slug', $request->route('current_team'))->firstOrFail();

        $posts = BlogPost::query()
            ->where('team_id', $team->id)
            ->with(['author:id,name'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Dashboard/Blog/Index', [
            'posts' => $posts->items(),
            'currentTeam' => $team,
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'total' => $posts->total(),
                'per_page' => $posts->perPage(),
            ],
        ]);
    }

    public function create(Request $request)
    {
        $team = Team::where('slug', $request->route('current_team'))->firstOrFail();

        return Inertia::render('Dashboard/Blog/Create', [
            'currentTeam' => $team,
        ]);
    }

    public function store(StoreBlogPostRequest $request)
    {
        $team = Team::where('slug', $request->route('current_team'))->firstOrFail();

        $data = $request->validated();
        $data['team_id'] = $team->id;
        $data['user_id'] = Auth::id();
        $data['slug'] = $request->slug ?? Str::slug($request->title);
        $data['published_at'] = $data['is_published'] ? now() : null;

        $this->blogPostService->create($data);

        return redirect()->route('teams.blog.index', $team->slug)->with('flash', [
            'toast' => ['type' => 'success', 'message' => 'Artículo creado exitosamente'],
        ]);
    }

    public function show(Request $request, int $id)
    {
        $team = Team::where('slug', $request->route('current_team'))->firstOrFail();

        $post = BlogPost::query()
            ->where('team_id', $team->id)
            ->with(['author:id,name'])
            ->findOrFail($id);

        return Inertia::render('Dashboard/Blog/Show', [
            'post' => $post,
            'currentTeam' => $team,
        ]);
    }

    public function edit(Request $request, int $id)
    {
        $team = Team::where('slug', $request->route('current_team'))->firstOrFail();

        $post = BlogPost::query()
            ->where('team_id', $team->id)
            ->findOrFail($id);

        return Inertia::render('Dashboard/Blog/Edit', [
            'post' => $post,
            'currentTeam' => $team,
        ]);
    }

    public function update(Request $request, int $id, UpdateBlogPostRequest $updateRequest)
    {
        $team = Team::where('slug', $request->route('current_team'))->firstOrFail();

        $post = BlogPost::query()
            ->where('team_id', $team->id)
            ->findOrFail($id);

        $data = $updateRequest->validated();
        $data['slug'] = $request->slug ?? Str::slug($request->title);

        if ($data['is_published'] && !$post->published_at) {
            $data['published_at'] = now();
        }

        $this->blogPostService->update($post, $data);

        return redirect()->route('teams.blog.index', $team->slug)->with('flash', [
            'toast' => ['type' => 'success', 'message' => 'Artículo actualizado exitosamente'],
        ]);
    }

    public function destroy(Request $request, int $id)
    {
        $team = Team::where('slug', $request->route('current_team'))->firstOrFail();

        $post = BlogPost::query()
            ->where('team_id', $team->id)
            ->findOrFail($id);

        $this->blogPostService->delete($post);

        return redirect()->route('teams.blog.index', $team->slug)->with('flash', [
            'toast' => ['type' => 'success', 'message' => 'Artículo eliminado'],
        ]);
    }
}
