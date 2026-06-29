<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\LostPet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LostPetController extends Controller
{
    public function index(Request $request)
    {
        $pets = LostPet::query()
            ->where('is_resolved', false)
            ->when($request->query('species'), fn ($q, $v) => $q->where('species', $v))
            ->when($request->query('status'), fn ($q, $v) => $q->where('status', $v))
            ->when($request->query('search'), fn ($q, $v) => $q->where(function ($q) use ($v) {
                $q->where('name', 'like', "%{$v}%")
                    ->orWhere('breed', 'like', "%{$v}%")
                    ->orWhere('description', 'like', "%{$v}%")
                    ->orWhere('last_seen_location', 'like', "%{$v}%");
            }))
            ->with('team:id,name,slug,city')
            ->latest()
            ->paginate(12);

        $speciesCounts = LostPet::query()
            ->where('is_resolved', false)
            ->selectRaw('species, count(*) as total')
            ->groupBy('species')
            ->pluck('total', 'species');

        return Inertia::render('Public/LostPets/Index', [
            'seo' => [
                'title' => 'Mascotas perdidas',
                'description' => 'Mascotas perdidas y encontradas en Cusco. Reportá una mascota perdida o ayudá a reunirlas con su familia.',
                'url' => url('/mascotas-perdidas'),
                'type' => 'website',
            ],
            'pets' => $pets->items(),
            'meta' => [
                'current_page' => $pets->currentPage(),
                'last_page' => $pets->lastPage(),
                'total' => $pets->total(),
                'per_page' => $pets->perPage(),
            ],
            'filters' => $request->only(['species', 'status', 'search']),
            'speciesCounts' => $speciesCounts->all(),
        ]);
    }

    public function show(string $id)
    {
        $pet = LostPet::query()
            ->with('team:id,name,slug,city')
            ->findOrFail($id);

        return Inertia::render('Public/LostPets/Show', [
            'pet' => $pet,
            'seo' => [
                'title' => ($pet->name ?? 'Mascota perdida').' — '.$pet->species->label(),
                'description' => \Illuminate\Support\Str::limit(strip_tags((string) ($pet->description ?? '')), 160),
                'image' => $pet->photos ? ($pet->photos[0] ?? null) : null,
                'url' => url('/mascotas-perdidas/'.$pet->id),
                'type' => 'article',
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'nullable|string|max:255',
            'species' => 'required|string|in:dog,cat,rabbit,bird,other',
            'breed' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:100',
            'size' => 'nullable|string|in:small,medium,large',
            'age_description' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:2000',
            'last_seen_location' => 'required|string|max:500',
            'last_seen_date' => 'required|date',
            'contact_phone' => 'nullable|string|max:50',
            'contact_email' => 'nullable|email|max:255',
            'status' => 'required|in:lost,found',
        ]);

        $data['user_id'] = Auth::id();
        $data['is_resolved'] = false;

        LostPet::create($data);

        return back()->with('flash', [
            'toast' => [
                'type' => 'success',
                'message' => $data['status'] === 'found'
                    ? 'Mascota encontrada publicada correctamente.'
                    : 'Mascota perdida reportada correctamente.',
            ],
        ]);
    }
}
