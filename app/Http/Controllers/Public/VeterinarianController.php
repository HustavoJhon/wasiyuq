<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Veterinarian;
use App\Models\VeterinarianRating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class VeterinarianController extends Controller
{
    public function index(Request $request)
    {
        $query = Veterinarian::query()
            ->withCount('ratings')
            ->withAvg('ratings', 'rating')
            ->when($request->query('city'), fn ($q, $v) => $q->where('city', 'like', "%{$v}%"))
            ->when($request->query('search'), fn ($q, $v) => $q->where(function ($q) use ($v) {
                $q->where('name', 'like', "%{$v}%")
                    ->orWhere('address', 'like', "%{$v}%")
                    ->orWhere('description', 'like', "%{$v}%");
            }))
            ->when($request->query('sort') === 'rating', fn ($q) => $q->orderByDesc('ratings_avg_rating'))
            ->when($request->query('sort') !== 'rating', fn ($q) => $q->latest());

        $vets = $query->paginate(12);

        $cities = Veterinarian::query()
            ->select('city')
            ->whereNotNull('city')
            ->distinct()
            ->orderBy('city')
            ->pluck('city');

        return Inertia::render('Adopter/Veterinarians/Index', [
            'seo' => [
                'title' => 'Veterinarias',
                'description' => 'Directorio de veterinarias en Cusco. Encontra la mas cercana, conoce sus servicios y calificalas.',
                'url' => url('/veterinarias'),
                'type' => 'website',
            ],
            'veterinarians' => $vets->items(),
            'meta' => [
                'current_page' => $vets->currentPage(),
                'last_page' => $vets->lastPage(),
                'total' => $vets->total(),
                'per_page' => $vets->perPage(),
            ],
            'filters' => $request->only(['city', 'search', 'sort']),
            'cities' => $cities->toArray(),
        ]);
    }

    public function show(string $id)
    {
        $vet = Veterinarian::query()
            ->with(['ratings' => fn ($q) => $q->latest()->with('user:id,name')->take(20)])
            ->withCount('ratings')
            ->withAvg('ratings', 'rating')
            ->findOrFail($id);

        $userRating = null;
        if (Auth::check()) {
            $userRating = VeterinarianRating::query()
                ->where('veterinarian_id', $id)
                ->where('user_id', Auth::id())
                ->first();
        }

        return Inertia::render('Adopter/Veterinarians/Show', [
            'veterinarian' => $vet,
            'userRating' => $userRating,
            'seo' => [
                'title' => $vet->name.' — Veterinaria en '.($vet->city ?? 'Cusco'),
                'description' => \Illuminate\Support\Str::limit(strip_tags((string) ($vet->description ?? '')), 160),
                'url' => url('/veterinarias/'.$vet->id),
                'type' => 'place',
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'city' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:50',
            'whatsapp' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'description' => 'nullable|string|max:2000',
            'services' => 'nullable|array',
            'services.*' => 'string|max:100',
        ]);

        $data['user_id'] = Auth::id();

        Veterinarian::create($data);

        return back()->with('flash', [
            'toast' => ['type' => 'success', 'message' => 'Veterinaria agregada correctamente.'],
        ]);
    }

    public function rate(Request $request, string $id)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $vet = Veterinarian::findOrFail($id);

        VeterinarianRating::updateOrCreate(
            [
                'veterinarian_id' => $vet->id,
                'user_id' => Auth::id(),
            ],
            [
                'rating' => $request->input('rating'),
                'comment' => $request->input('comment'),
            ],
        );

        return back()->with('flash', [
            'toast' => ['type' => 'success', 'message' => 'Calificación guardada. ¡Gracias!'],
        ]);
    }
}
