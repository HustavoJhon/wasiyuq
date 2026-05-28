<?php

namespace App\Repositories;

use App\Models\BlogPost;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class BlogPostRepository
{
    public function searchPublished(
        ?string $category = null,
        ?int $teamId = null,
        int $perPage = 12
    ): LengthAwarePaginator {
        return BlogPost::query()
            ->where('is_published', true)
            ->when($category, fn ($q, $v) => $q->where('category', $v))
            ->when($teamId, fn ($q, $v) => $q->where('team_id', $v))
            ->with('team:id,name,slug')
            ->with('author:id,name')
            ->orderBy('published_at', 'desc')
            ->paginate($perPage);
    }

    public function findBySlug(string $slug): ?BlogPost
    {
        return BlogPost::query()
            ->where('slug', $slug)
            ->with('team:id,name,slug,logo,city,state')
            ->with('author:id,name')
            ->first();
    }

    public function findById(int $id): ?BlogPost
    {
        return BlogPost::query()->find($id);
    }

    public function getByTeam(int $teamId): Collection
    {
        return BlogPost::query()
            ->where('team_id', $teamId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function create(array $data): BlogPost
    {
        return BlogPost::query()->create($data);
    }

    public function update(BlogPost $post, array $data): bool
    {
        return $post->update($data);
    }

    public function delete(BlogPost $post): ?bool
    {
        return $post->delete();
    }
}
