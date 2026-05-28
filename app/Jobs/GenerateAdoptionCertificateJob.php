<?php

namespace App\Jobs;

use App\Models\Adoption;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;

class GenerateAdoptionCertificateJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private readonly Adoption $adoption,
    ) {}

    public function handle(): void
    {
        $adoption = $this->adoption->load([
            'pet:id,name,species,breed',
            'adopter:id,name,document_number',
            'team:id,name',
        ]);

        $pdf = Pdf::loadView('pdfs.adoption-certificate', [
            'adoption' => $adoption,
        ]);

        $path = "certificates/adoption-{$adoption->id}.pdf";
        Storage::disk('public')->put($path, $pdf->output());

        $adoption->updateQuietly(['acta_path' => $path]);
    }
}
