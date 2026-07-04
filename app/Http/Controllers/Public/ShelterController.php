<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Shelter;
use App\Models\ShelterRating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ShelterController extends Controller
{
    public function index(Request $request)
    {
        $query = Shelter::query()
            ->withCount('ratings')->withAvg('ratings', 'rating')
            ->when($request->query('city'), fn ($q, $v) => $q->where('city', 'like', "%{$v}%"))
            ->when($request->query('search'), fn ($q, $v) => $q->where(fn ($q) => $q->where('name', 'like', "%{$v}%")->orWhere('address', 'like', "%{$v}%")->orWhere('description', 'like', "%{$v}%")))
            ->when($request->query('sort') === 'rating', fn ($q) => $q->orderByDesc('ratings_avg_rating'))
            ->when($request->query('sort') !== 'rating', fn ($q) => $q->latest());

        $shelters = $query->paginate(12);
        $cities = Shelter::query()->select('city')->whereNotNull('city')->distinct()->orderBy('city')->pluck('city');

        return Inertia::render('Adopter/Shelters/Index', [
            'seo' => ['title' => 'Albergues', 'description' => 'Directorio de albergues de animales en Cusco.', 'url' => url('/mi-adopcion/albergues'), 'type' => 'website'],
            'shelters' => $shelters->items(),
            'meta' => ['current_page' => $shelters->currentPage(), 'last_page' => $shelters->lastPage(), 'total' => $shelters->total(), 'per_page' => $shelters->perPage()],
            'filters' => $request->only(['city', 'search', 'sort']),
            'cities' => $cities->toArray(),
        ]);
    }

    public function show(string $id)
    {
        $shelter = Shelter::query()
            ->with(['ratings' => fn ($q) => $q->latest()->with('user:id,name')->take(20)])
            ->withCount('ratings')->withAvg('ratings', 'rating')
            ->findOrFail($id);

        $userRating = Auth::check() ? ShelterRating::where('shelter_id', $id)->where('user_id', Auth::id())->first() : null;

        return Inertia::render('Adopter/Shelters/Show', [
            'shelter' => $shelter, 'userRating' => $userRating,
            'seo' => ['title' => $shelter->name.' — Albergue en '.($shelter->city ?? 'Cusco'), 'description' => \Illuminate\Support\Str::limit(strip_tags((string) ($shelter->description ?? '')), 160), 'url' => url('/mi-adopcion/albergues/'.$shelter->id), 'type' => 'place'],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255', 'address' => 'required|string|max:500', 'city' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:50', 'whatsapp' => 'nullable|string|max:50', 'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255', 'description' => 'nullable|string|max:2000', 'capacity' => 'nullable|integer|min:1',
            'services' => 'nullable|array', 'services.*' => 'string|max:100',
        ]);
        $data['user_id'] = Auth::id();
        Shelter::create($data);

        return back()->with('flash', ['toast' => ['type' => 'success', 'message' => 'Albergue agregado correctamente.']]);
    }

    public function rate(Request $request, string $id)
    {
        $request->validate(['rating' => 'required|integer|min:1|max:5', 'comment' => 'nullable|string|max:1000']);
        ShelterRating::updateOrCreate(
            ['shelter_id' => $id, 'user_id' => Auth::id()],
            ['rating' => $request->input('rating'), 'comment' => $request->input('comment')],
        );

        return back()->with('flash', ['toast' => ['type' => 'success', 'message' => 'Calificación guardada.']]);
    }
}
