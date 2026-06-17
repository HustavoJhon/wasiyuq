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
        $query = BlogPost::query()
            ->with(['team:id,name,slug', 'author:id,name']);

        if ($search = request('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%")
                  ->orWhereHas('team', fn($t) => $t->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('author', fn($a) => $a->where('name', 'like', "%{$search}%"));
            });
        }

        $posts = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Blog/Index', [
            'posts' => $posts->items(),
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'total' => $posts->total(),
                'per_page' => $posts->perPage(),
            ],
            'filters' => request()->only(['search']),
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

    public function show($id)
    {
        $post = BlogPost::query()->with(['team:id,name,slug', 'author:id,name'])->findOrFail($id);

        return Inertia::render('Admin/Blog/Show', [
            'post' => $post,
        ]);
    }

    public function edit($id)
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

    public function update($id, UpdateBlogPostRequest $request)
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

    public function destroy($id)
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
