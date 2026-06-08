<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Pet\StorePetRequest;
use App\Http\Requests\Pet\UpdatePetRequest;
use App\Models\Pet;
use App\Models\Team;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PetController extends Controller
{
    public function index()
    {
        $query = Pet::query()->with('team:id,name,slug');

        if ($search = request('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('breed', 'like', "%{$search}%")
                    ->orWhere('color', 'like', "%{$search}%");
            });
        }

        if ($species = request('species')) {
            $query->where('species', $species);
        }

        if ($status = request('status')) {
            $query->where('status', $status);
        }

        if ($team_id = request('team_id')) {
            $query->where('team_id', $team_id);
        }

        $pets = $query->latest()->paginate(15)->withQueryString();

        $teams = Team::query()
            ->where('is_personal', false)
            ->get(['id', 'name', 'slug']);

        $stats = [
            'by_status' => Pet::query()
                ->selectRaw('status, count(*) as count')
                ->groupBy('status')
                ->pluck('count', 'status'),
            'by_species' => Pet::query()
                ->selectRaw('species, count(*) as count')
                ->groupBy('species')
                ->pluck('count', 'species'),
            'by_team' => Pet::query()
                ->selectRaw('team_id, count(*) as count')
                ->groupBy('team_id')
                ->pluck('count', 'team_id'),
        ];

        return Inertia::render('Admin/Pets/Index', [
            'pets' => $pets->items(),
            'meta' => [
                'current_page' => $pets->currentPage(),
                'last_page' => $pets->lastPage(),
                'total' => $pets->total(),
                'per_page' => $pets->perPage(),
            ],
            'filters' => request()->only(['search', 'species', 'status', 'team_id']),
            'teams' => $teams,
            'stats' => $stats,
        ]);
    }

    public function show(int $id)
    {
        $pet = Pet::query()->with(['team:id,name,slug', 'adoptions.adopter:id,name'])->findOrFail($id);

        return Inertia::render('Admin/Pets/Show', [
            'pet' => $pet,
        ]);
    }

    public function create()
    {
        $teams = Team::query()
            ->where('is_personal', false)
            ->get(['id', 'name', 'slug']);

        return Inertia::render('Admin/Pets/Create', [
            'teams' => $teams,
        ]);
    }

    public function store(StorePetRequest $request)
    {
        $data = $request->validated();
        $data['slug'] = $request->slug ?? Pet::generateUniqueSlug($request->name);

        unset($data['photo']);
        unset($data['photo_url']);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('pets', 'public');
            $data['photos'] = [$path];
        } elseif ($request->filled('photo_url')) {
            $path = $this->downloadPhotoFromUrl($request->photo_url);
            if ($path) {
                $data['photos'] = [$path];
            }
        }

        Pet::query()->create($data);

        return redirect()->route('admin.pets.index')->with('flash', [
            'toast' => [
                'type' => 'success',
                'message' => 'Mascota creada exitosamente',
            ],
        ]);
    }

    public function edit(int $id)
    {
        $pet = Pet::query()->with('team:id,name,slug')->findOrFail($id);

        $teams = Team::query()
            ->where('is_personal', false)
            ->get(['id', 'name', 'slug']);

        return Inertia::render('Admin/Pets/Edit', [
            'pet' => $pet,
            'teams' => $teams,
        ]);
    }

    public function update(int $id, UpdatePetRequest $request)
    {
        $pet = Pet::query()->findOrFail($id);

        $data = $request->validated();
        $data['slug'] = $request->slug ?? Pet::generateUniqueSlug($request->name, $id);

        unset($data['photo']);
        unset($data['photo_url']);

        if ($request->hasFile('photo')) {
            if ($pet->photos && count($pet->photos) > 0) {
                Storage::disk('public')->delete($pet->photos[0]);
            }

            $path = $request->file('photo')->store('pets', 'public');
            $data['photos'] = [$path];
        } elseif ($request->filled('photo_url')) {
            if ($pet->photos && count($pet->photos) > 0) {
                Storage::disk('public')->delete($pet->photos[0]);
            }

            $path = $this->downloadPhotoFromUrl($request->photo_url);
            if ($path) {
                $data['photos'] = [$path];
            }
        }

        $pet->update($data);

        return redirect()->route('admin.pets.index')->with('flash', [
            'toast' => [
                'type' => 'success',
                'message' => 'Mascota actualizada exitosamente',
            ],
        ]);
    }

    private function downloadPhotoFromUrl(string $url): ?string
    {
        try {
            $response = Http::timeout(15)->get($url);
            if ($response->successful()) {
                $extension = 'jpg';
                $contentType = $response->header('Content-Type');
                if (str_contains($contentType, 'png')) $extension = 'png';
                elseif (str_contains($contentType, 'webp')) $extension = 'webp';
                elseif (str_contains($contentType, 'gif')) $extension = 'gif';

                $filename = 'pets/' . Str::random(40) . '.' . $extension;
                Storage::disk('public')->put($filename, $response->body());
                return $filename;
            }
        } catch (\Exception) {
        }
        return null;
    }

    public function destroy(int $id)
    {
        $pet = Pet::query()->findOrFail($id);
        $pet->delete();

        return redirect()->route('admin.pets.index')->with('flash', [
            'toast' => [
                'type' => 'success',
                'message' => 'Mascota eliminada exitosamente',
            ],
        ]);
    }
}
