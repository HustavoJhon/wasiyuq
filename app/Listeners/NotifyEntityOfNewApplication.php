<?php

namespace App\Listeners;

use App\Enums\TeamRole;
use App\Events\AdoptionApplicationSubmitted;
use App\Notifications\AdoptionApplicationSubmittedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class NotifyEntityOfNewApplication implements ShouldQueue
{
    use InteractsWithQueue;

    public function handle(AdoptionApplicationSubmitted $event): void
    {
        $team = $event->adoption->team->load("members");
        $petName = $event->adoption->pet->name;
        $adopterName = $event->adoption->adopter->name;

        foreach ($team->members as $member) {
            $role = $member->membership->role ?? $member->pivot->role;
            if ($role instanceof TeamRole && $role->isAtLeast(TeamRole::Admin)) {
                $member->notify(new AdoptionApplicationSubmittedNotification(
                    petName: $petName,
                    adopterName: $adopterName,
                    adoptionId: $event->adoption->id,
                    teamSlug: $team->slug,
                ));
            }
        }
    }
}
