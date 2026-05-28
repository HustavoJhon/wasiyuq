<?php

namespace App\Jobs;

use App\Models\Adoption;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;

class GenerateAdoptionActaJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly Adoption $adoption,
    ) {}

    public function handle(): void
    {
        $adoption = $this->adoption->load(['pet.team', 'adopter']);

        $pdf = Pdf::loadView('pdfs.adoption-acta', [
            'adoption' => $adoption,
            'pet' => $adoption->pet,
            'adopter' => $adoption->adopter,
            'entity' => $adoption->team,
            'date' => now()->format('d/m/Y'),
        ]);

        $filename = 'adoptions/acta-' . $adoption->id . '-' . now()->timestamp . '.pdf';

        Storage::disk('public')->put($filename, $pdf->output());

        $adoption->update(['acta_path' => $filename]);
    }
}
