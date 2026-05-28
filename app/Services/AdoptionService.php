<?php

namespace App\Services;

use App\Enums\PetStatus;
use App\Events\AdoptionApplicationSubmitted;
use App\Events\AdoptionApproved;
use App\Events\AdoptionCompleted;
use App\Models\Adoption;
use App\Models\Pet;
use App\Repositories\AdoptionRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class AdoptionService
{
    public function __construct(
        private readonly AdoptionRepository $repository,
    ) {}

    public function findById(int $id): ?Adoption
    {
        return $this->repository->findById($id);
    }

    public function getByAdopter(int $userId): Collection
    {
        return $this->repository->getByAdopter($userId);
    }

    public function getByTeam(int $teamId, ?string $status = null): Collection
    {
        return $this->repository->getByTeam($teamId, $status);
    }

    public function create(array $data): Adoption
    {
        return DB::transaction(function () use ($data) {
            $adoption = $this->repository->create($data);

            Pet::query()
                ->where('id', $data['pet_id'])
                ->update(['status' => PetStatus::InProcess]);

            AdoptionApplicationSubmitted::dispatch($adoption);

            return $adoption;
        });
    }

    public function approve(Adoption $adoption, int $reviewedBy): bool
    {
        return DB::transaction(function () use ($adoption, $reviewedBy) {
            $updated = $this->repository->update($adoption, [
                'status' => 'approved',
                'reviewed_by' => $reviewedBy,
                'reviewed_at' => now(),
            ]);

            if ($updated) {
                Pet::query()
                    ->where('id', $adoption->pet_id)
                    ->update(['status' => PetStatus::Adopted]);

                AdoptionApproved::dispatch($adoption->refresh());
            }

            return $updated;
        });
    }

    public function reject(Adoption $adoption, int $reviewedBy, ?string $notes = null): bool
    {
        return DB::transaction(function () use ($adoption, $reviewedBy, $notes) {
            $updated = $this->repository->update($adoption, [
                'status' => 'rejected',
                'reviewed_by' => $reviewedBy,
                'reviewed_at' => now(),
                'notes' => $notes,
            ]);

            if ($updated) {
                Pet::query()
                    ->where('id', $adoption->pet_id)
                    ->update(['status' => PetStatus::Available]);
            }

            return $updated;
        });
    }

    public function complete(Adoption $adoption): bool
    {
        $updated = $this->repository->update($adoption, [
            'status' => 'completed',
        ]);

        if ($updated) {
            AdoptionCompleted::dispatch($adoption->refresh());
        }

        return $updated;
    }

    public function cancel(Adoption $adoption): bool
    {
        return DB::transaction(function () use ($adoption) {
            $updated = $this->repository->update($adoption, [
                'status' => 'cancelled',
            ]);

            if ($updated) {
                Pet::query()
                    ->where('id', $adoption->pet_id)
                    ->update(['status' => PetStatus::Available]);
            }

            return $updated;
        });
    }

    public function delete(Adoption $adoption): ?bool
    {
        return $this->repository->delete($adoption);
    }
}
