<?php

namespace App\Repositories;

use App\Models\Pet;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class PetRepository
{
    public function searchPublished(
        ?string $species = null,
        ?string $size = null,
        ?string $gender = null,
        ?string $search = null,
        int $perPage = 12
    ): LengthAwarePaginator {
        return Pet::query()
            ->where('status', 'available')
            ->when($species, fn ($q, $v) => $q->where('species', $v))
            ->when($size, fn ($q, $v) => $q->where('size', $v))
            ->when($gender, fn ($q, $v) => $q->where('gender', $v))
            ->when($search, fn ($q, $v) => $q->where(function ($q) use ($v) {
                $q->where('name', 'like', "%{$v}%")
                    ->orWhere('breed', 'like', "%{$v}%");
            }))
            ->with('team:id,name,slug,city,state')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function findBySlug(string $slug): ?Pet
    {
        return Pet::query()
            ->where('slug', $slug)
            ->with('team:id,name,slug,bio,logo,website,phone,city,state')
            ->first();
    }

    public function findById(int $id): ?Pet
    {
        return Pet::query()->find($id);
    }

    public function getByTeam(int $teamId, ?string $status = null): Collection
    {
        return Pet::query()
            ->where('team_id', $teamId)
            ->when($status, fn ($q, $v) => $q->where('status', $v))
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function create(array $data): Pet
    {
        return Pet::query()->create($data);
    }

    public function update(Pet $pet, array $data): bool
    {
        return $pet->update($data);
    }

    public function delete(Pet $pet): ?bool
    {
        return $pet->delete();
    }
}
