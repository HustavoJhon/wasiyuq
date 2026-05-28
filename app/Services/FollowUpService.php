<?php

namespace App\Services;

use App\Enums\FollowUpStatus;
use App\Models\Adoption;
use App\Models\FollowUp;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Storage;

class FollowUpService
{
    public function getByAdopter(int $userId): Collection
    {
        return FollowUp::query()
            ->whereHas('adoption', fn ($q) => $q->where('user_id', $userId))
            ->with(['adoption.pet:id,name,slug,photos', 'adoption.team:id,name'])
            ->orderBy('scheduled_date')
            ->get();
    }

    public function getByTeam(int $teamId, ?string $status = null): Collection
    {
        $query = FollowUp::query()
            ->whereHas('adoption', fn ($q) => $q->where('team_id', $teamId))
            ->with([
                'adoption.pet:id,name,slug,species,photos',
                'adoption.adopter:id,name,email',
                'createdBy:id,name',
            ])
            ->orderBy('scheduled_date');

        if ($status) {
            $query->where('status', $status);
        }

        return $query->get();
    }

    public function getOverdue(): Collection
    {
        return FollowUp::query()
            ->where('status', FollowUpStatus::Pending)
            ->where('scheduled_date', '<', now())
            ->get();
    }

    public function reportMilestone(FollowUp $followUp, array $data): FollowUp
    {
        $payload = [
            'notes' => $data['notes'] ?? $followUp->notes,
            'status' => FollowUpStatus::Completed,
            'completed_date' => now(),
        ];

        if (!empty($data['photos'])) {
            $paths = [];
            foreach ($data['photos'] as $photo) {
                $paths[] = $photo->store('follow-ups', 'public');
            }
            $payload['photos'] = array_merge($followUp->photos ?? [], $paths);
        }

        $followUp->update($payload);

        return $followUp->fresh();
    }

    public function markCompleted(FollowUp $followUp): FollowUp
    {
        $followUp->update([
            'status' => FollowUpStatus::Completed,
            'completed_date' => now(),
        ]);

        return $followUp->fresh();
    }

    public function markMissed(FollowUp $followUp): FollowUp
    {
        $followUp->update([
            'status' => FollowUpStatus::Missed,
        ]);

        return $followUp->fresh();
    }

    public function scheduleAdditional(Adoption $adoption, array $data): FollowUp
    {
        return FollowUp::query()->create([
            'adoption_id' => $adoption->id,
            'scheduled_date' => $data['scheduled_date'],
            'notes' => $data['notes'] ?? null,
            'status' => FollowUpStatus::Pending,
            'created_by' => $data['created_by'],
        ]);
    }

    public function checkOverdue(): int
    {
        return FollowUp::query()
            ->where('status', FollowUpStatus::Pending)
            ->where('scheduled_date', '<', now())
            ->update(['status' => FollowUpStatus::Missed]);
    }
}
