<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Veterinarian;
use Inertia\Inertia;

class VeterinarianController extends Controller
{
    public function index()
    {
        $vets = Veterinarian::query()
            ->withCount('ratings')
            ->withAvg('ratings', 'rating')
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Veterinarians/Index', [
            'veterinarians' => $vets->items(),
            'meta' => [
                'current_page' => $vets->currentPage(),
                'last_page' => $vets->lastPage(),
                'total' => $vets->total(),
                'per_page' => $vets->perPage(),
            ],
        ]);
    }

    public function toggleVerification(Veterinarian $veterinarian)
    {
        $veterinarian->update(['is_verified' => ! $veterinarian->is_verified]);

        return back()->with('flash', [
            'toast' => ['type' => 'success', 'message' => 'Estado de verificación actualizado.'],
        ]);
    }

    public function destroy(Veterinarian $veterinarian)
    {
        $veterinarian->delete();

        return back()->with('flash', [
            'toast' => ['type' => 'success', 'message' => 'Veterinaria eliminada.'],
        ]);
    }
}
