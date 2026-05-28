<?php

namespace App\Services;

use App\Models\BlogPost;
use App\Repositories\BlogPostRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class BlogPostService
{
    public function __construct(
        private readonly BlogPostRepository $repository,
    ) {}

    public function searchPublished(
        ?string $category = null,
        ?int $teamId = null,
        int $perPage = 12
    ): LengthAwarePaginator {
        return $this->repository->searchPublished(
            category: $category,
            teamId: $teamId,
            perPage: $perPage,
        );
    }

    public function findBySlug(string $slug): ?BlogPost
    {
        return $this->repository->findBySlug($slug);
    }

    public function getByTeam(int $teamId): Collection
    {
        return $this->repository->getByTeam($teamId);
    }

    public function create(array $data): BlogPost
    {
        $data['slug'] = $data['slug'] ?? Str::slug($data['title']);

        return $this->repository->create($data);
    }

    public function update(BlogPost $post, array $data): bool
    {
        return $this->repository->update($post, $data);
    }

    public function delete(BlogPost $post): ?bool
    {
        return $this->repository->delete($post);
    }
}
