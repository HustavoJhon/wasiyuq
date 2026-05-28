<?php

namespace App\Listeners;

use App\Enums\FollowUpStatus;
use App\Events\AdoptionCompleted;
use App\Models\FollowUp;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class CreateFollowUpPlan implements ShouldQueue
{
    use InteractsWithQueue;

    public function handle(AdoptionCompleted $event): void
    {
        $adoption = $event->adoption;
        $now = now();

        $milestones = [
            ['label' => 'Auto-reporte inicial', 'days' => 30],
            ['label' => 'Visita domiciliaria', 'days' => 90],
            ['label' => 'Segundo auto-reporte', 'days' => 180],
            ['label' => 'Reporte de salud', 'days' => 270],
            ['label' => 'Visita de cierre + Certificado', 'days' => 365],
        ];

        foreach ($milestones as $milestone) {
            FollowUp::query()->create([
                'adoption_id' => $adoption->id,
                'scheduled_date' => $now->copy()->addDays($milestone['days']),
                'status' => FollowUpStatus::Pending,
                'notes' => $milestone['label'],
                'created_by' => $adoption->reviewed_by,
            ]);
        }
    }
}
