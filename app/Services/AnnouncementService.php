<?php

namespace App\Services;

use App\Models\Announcement;
use App\Repositories\AnnouncementRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class AnnouncementService
{
    public function __construct(
        private readonly AnnouncementRepository $repository,
    ) {}

    public function searchPublished(
        ?string $type = null,
        ?int $teamId = null,
        int $perPage = 12
    ): LengthAwarePaginator {
        return $this->repository->searchPublished(
            type: $type,
            teamId: $teamId,
            perPage: $perPage,
        );
    }

    public function findBySlug(string $slug): ?Announcement
    {
        return $this->repository->findBySlug($slug);
    }

    public function getByTeam(int $teamId): Collection
    {
        return $this->repository->getByTeam($teamId);
    }

    public function create(array $data): Announcement
    {
        $data['slug'] = $data['slug'] ?? Str::slug($data['title']);

        return $this->repository->create($data);
    }

    public function update(Announcement $announcement, array $data): bool
    {
        return $this->repository->update($announcement, $data);
    }

    public function delete(Announcement $announcement): ?bool
    {
        return $this->repository->delete($announcement);
    }
}
