<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Adoption;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdoptionController extends Controller
{
    public function index()
    {
        $query = Adoption::query()
            ->with(['pet:id,name,slug,species', 'adopter:id,name,email', 'team:id,name,slug']);

        if ($search = request('search')) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('pet', fn($p) => $p->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('adopter', fn($a) => $a->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('team', fn($t) => $t->where('name', 'like', "%{$search}%"))
                  ->orWhere('status', 'like', "%{$search}%");
            });
        }

        if ($status = request('status')) {
            $query->where('status', $status);
        }

        if ($species = request('species')) {
            $query->whereHas('pet', fn($p) => $p->where('species', $species));
        }

        $adoptions = $query->latest()->paginate(15)->withQueryString();

        $all = Adoption::query();
        $byStatus = (clone $all)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $bySpecies = (clone $all)
            ->join('pets', 'adoptions.pet_id', '=', 'pets.id')
            ->select('pets.species', DB::raw('count(*) as count'))
            ->groupBy('pets.species')
            ->pluck('count', 'species')
            ->toArray();

        $monthly = (clone $all)
            ->select(DB::raw("FORMAT(created_at, 'yyyy-MM') as month"), DB::raw('count(*) as count'))
            ->groupBy(DB::raw("FORMAT(created_at, 'yyyy-MM')"))
            ->orderBy('month')
            ->get()
            ->toArray();

        $recentActivity = (clone $all)
            ->where('created_at', '>=', now()->subDays(30))
            ->count();

        return Inertia::render('Admin/Adoptions/Index', [
            'adoptions' => $adoptions->items(),
            'meta' => [
                'current_page' => $adoptions->currentPage(),
                'last_page' => $adoptions->lastPage(),
                'total' => $adoptions->total(),
                'per_page' => $adoptions->perPage(),
            ],
            'filters' => request()->only(['search', 'status', 'species']),
            'stats' => [
                'by_status' => $byStatus,
                'by_species' => $bySpecies,
                'monthly' => $monthly,
                'recent_activity' => $recentActivity,
            ],
        ]);
    }

    public function show(Adoption $adoption)
    {
        $adoption->load(['pet', 'adopter', 'team', 'reviewer', 'followUps']);

        return Inertia::render('Admin/Adoptions/Show', [
            'adoption' => $adoption,
        ]);
    }
}
