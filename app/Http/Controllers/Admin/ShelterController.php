<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Shelter;
use Inertia\Inertia;

class ShelterController extends Controller
{
    public function index()
    {
        $shelters = Shelter::query()->withCount('ratings')->withAvg('ratings', 'rating')->latest()->paginate(15);

        return Inertia::render('Admin/Shelters/Index', [
            'shelters' => $shelters->items(),
            'meta' => ['current_page' => $shelters->currentPage(), 'last_page' => $shelters->lastPage(), 'total' => $shelters->total(), 'per_page' => $shelters->perPage()],
        ]);
    }

    public function toggleVerification(Shelter $shelter)
    {
        $shelter->update(['is_verified' => ! $shelter->is_verified]);

        return back()->with('flash', ['toast' => ['type' => 'success', 'message' => 'Verificación actualizada.']]);
    }

    public function destroy(Shelter $shelter)
    {
        $shelter->delete();

        return back()->with('flash', ['toast' => ['type' => 'success', 'message' => 'Albergue eliminado.']]);
    }
}
