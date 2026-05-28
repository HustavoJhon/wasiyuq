<?php

namespace App\Repositories;

use App\Models\Adoption;
use Illuminate\Database\Eloquent\Collection;

class AdoptionRepository
{
    public function findById(int $id): ?Adoption
    {
        return Adoption::query()
            ->with(['pet', 'adopter', 'reviewer', 'team', 'followUps'])
            ->find($id);
    }

    public function getByAdopter(int $userId): Collection
    {
        return Adoption::query()
            ->where('user_id', $userId)
            ->with('pet:id,name,slug,species,photos')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getByTeam(int $teamId, ?string $status = null): Collection
    {
        return Adoption::query()
            ->where('team_id', $teamId)
            ->when($status, fn ($q, $v) => $q->where('status', $v))
            ->with('pet:id,name,slug')
            ->with('adopter:id,name,email')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function create(array $data): Adoption
    {
        return Adoption::query()->create($data);
    }

    public function update(Adoption $adoption, array $data): bool
    {
        return $adoption->update($data);
    }

    public function delete(Adoption $adoption): ?bool
    {
        return $adoption->delete();
    }
}
