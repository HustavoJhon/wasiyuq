<?php

namespace App\Jobs;

use App\Services\FollowUpService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class CheckOverdueMilestonesJob implements ShouldQueue
{
    use Queueable;

    public function handle(FollowUpService $followUpService): void
    {
        $count = $followUpService->checkOverdue();

        if ($count > 0) {
            logger("{$count} milestone(s) marked as overdue.");
        }
    }
}
