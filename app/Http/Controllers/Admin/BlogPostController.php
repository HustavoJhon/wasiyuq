<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Blog\StoreBlogPostRequest;
use App\Http\Requests\Blog\UpdateBlogPostRequest;
use App\Models\BlogPost;
use App\Models\Team;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BlogPostController extends Controller
{
    public function index()
    {
        $posts = BlogPost::query()
            ->with(['team:id,name,slug', 'author:id,name'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Blog/Index', [
            'posts' => $posts->items(),
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'total' => $posts->total(),
                'per_page' => $posts->perPage(),
            ],
        ]);
    }

    public function create()
    {
        $teams = Team::query()
            ->where('is_personal', false)
            ->get(['id', 'name', 'slug']);

        return Inertia::render('Admin/Blog/Create', [
            'teams' => $teams,
        ]);
    }

    public function store(StoreBlogPostRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = Auth::id();
        $data['slug'] = $request->slug ?? Str::slug($request->title);

        BlogPost::query()->create($data);

        return redirect()->route('admin.blog.index')->with('flash', [
            'toast' => [
                'type' => 'success',
                'message' => 'Artículo creado exitosamente',
            ],
        ]);
    }

    public function show(int $id)
    {
        $post = BlogPost::query()->with(['team:id,name,slug', 'author:id,name'])->findOrFail($id);

        return Inertia::render('Admin/Blog/Show', [
            'post' => $post,
        ]);
    }

    public function edit(int $id)
    {
        $post = BlogPost::query()->with('team:id,name,slug')->findOrFail($id);

        $teams = Team::query()
            ->where('is_personal', false)
            ->get(['id', 'name', 'slug']);

        return Inertia::render('Admin/Blog/Edit', [
            'post' => $post,
            'teams' => $teams,
        ]);
    }

    public function update(int $id, UpdateBlogPostRequest $request)
    {
        $post = BlogPost::query()->findOrFail($id);

        $data = $request->validated();
        $data['slug'] = $request->slug ?? Str::slug($request->title);

        $post->update($data);

        return redirect()->route('admin.blog.index')->with('flash', [
            'toast' => [
                'type' => 'success',
                'message' => 'Artículo actualizado exitosamente',
            ],
        ]);
    }

    public function destroy(int $id)
    {
        $post = BlogPost::query()->findOrFail($id);
        $post->delete();

        return redirect()->route('admin.blog.index')->with('flash', [
            'toast' => [
                'type' => 'success',
                'message' => 'Artículo eliminado exitosamente',
            ],
        ]);
    }
}
