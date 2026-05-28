<?php

namespace App\Repositories;

use App\Models\Announcement;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class AnnouncementRepository
{
    public function searchPublished(
        ?string $type = null,
        ?int $teamId = null,
        int $perPage = 12
    ): LengthAwarePaginator {
        return Announcement::query()
            ->where('is_published', true)
            ->when($type, fn ($q, $v) => $q->where('type', $v))
            ->when($teamId, fn ($q, $v) => $q->where('team_id', $v))
            ->with('team:id,name,slug')
            ->with('author:id,name')
            ->orderBy('event_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function findBySlug(string $slug): ?Announcement
    {
        return Announcement::query()
            ->where('slug', $slug)
            ->with('team:id,name,slug,logo,phone,city,state')
            ->with('author:id,name')
            ->first();
    }

    public function findById(int $id): ?Announcement
    {
        return Announcement::query()->find($id);
    }

    public function getByTeam(int $teamId): Collection
    {
        return Announcement::query()
            ->where('team_id', $teamId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function create(array $data): Announcement
    {
        return Announcement::query()->create($data);
    }

    public function update(Announcement $announcement, array $data): bool
    {
        return $announcement->update($data);
    }

    public function delete(Announcement $announcement): ?bool
    {
        return $announcement->delete();
    }
}
