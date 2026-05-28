<?php

namespace App\Services;

use App\Models\Pet;
use App\Repositories\PetRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class PetService
{
    public function __construct(
        private readonly PetRepository $repository,
    ) {}

    public function searchPublished(
        ?string $species = null,
        ?string $size = null,
        ?string $gender = null,
        ?string $search = null,
        int $perPage = 12
    ): LengthAwarePaginator {
        return $this->repository->searchPublished(
            species: $species,
            size: $size,
            gender: $gender,
            search: $search,
            perPage: $perPage,
        );
    }

    public function findBySlug(string $slug): ?Pet
    {
        return $this->repository->findBySlug($slug);
    }

    public function getByTeam(int $teamId, ?string $status = null): Collection
    {
        return $this->repository->getByTeam($teamId, $status);
    }

    public function create(array $data): Pet
    {
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        return $this->repository->create($data);
    }

    public function update(Pet $pet, array $data): bool
    {
        return $this->repository->update($pet, $data);
    }

    public function delete(Pet $pet): ?bool
    {
        return $this->repository->delete($pet);
    }
}
