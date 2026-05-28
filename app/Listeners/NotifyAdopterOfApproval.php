<?php

namespace App\Listeners;

use App\Events\AdoptionApproved;
use App\Jobs\GenerateAdoptionActaJob;
use App\Notifications\AdoptionApprovedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class NotifyAdopterOfApproval implements ShouldQueue
{
    use InteractsWithQueue;

    public function handle(AdoptionApproved $event): void
    {
        $adopter = $event->adoption->adopter;
        $petName = $event->adoption->pet->name;
        $teamName = $event->adoption->team->name;

        $adopter->notify(new AdoptionApprovedNotification(
            petName: $petName,
            teamName: $teamName,
        ));

        GenerateAdoptionActaJob::dispatch($event->adoption);
    }
}
