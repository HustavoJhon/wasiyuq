<?php

namespace App\Http\Controllers\Teams;

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
    public function index(Team $current_team)
    {
        // Verificar pertenencia al equipo
        $this->authorize('viewAny', [Pet::class, $current_team]);

        $pets = $current_team->pets()
            ->with('team:id,name,slug')
            ->latest()
            ->paginate(15);

        return Inertia::render('Teams/Pets/Index', [
            'pets' => $pets->items(),
            'meta' => [
                'current_page' => $pets->currentPage(),
                'last_page' => $pets->lastPage(),
                'total' => $pets->total(),
                'per_page' => $pets->perPage(),
            ],
        ]);
    }

    public function show(Team $current_team, int $id)
    {
        $pet = $current_team->pets()
            ->where('id', $id)
            ->with(['team:id,name,slug', 'adoptions.adopter:id,name'])
            ->firstOrFail();

        return Inertia::render('Teams/Pets/Show', [
            'pet' => $pet,
        ]);
    }

    public function create(Team $current_team)
    {
        $this->authorize('create', [Pet::class, $current_team]);

        return Inertia::render('Teams/Pets/Create', [
            'team' => $current_team,
        ]);
    }

    public function store(Team $current_team, StorePetRequest $request)
    {
        $this->authorize('create', [Pet::class, $current_team]);

        $data = $request->validated();
        $data['team_id'] = $current_team->id;
        $data['slug'] = $request->slug ?? Str::slug($request->name);

        unset($data['photo']);
        unset($data['photo_urls']);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('pets', 'public');
            $data['photos'] = [$path];
        } elseif ($request->filled('photo_urls')) {
            $paths = $this->downloadMultiplePhotos($request->photo_urls);
            if (!empty($paths)) {
                $data['photos'] = $paths;
            }
        }

        Pet::query()->create($data);

        return redirect()->route('teams.pets.index', $current_team)->with('flash', [
            'toast' => [
                'type' => 'success',
                'message' => 'Mascota creada exitosamente',
            ],
        ]);
    }

    public function edit(Team $current_team, int $id)
    {
        $pet = $current_team->pets()
            ->where('id', $id)
            ->with('team:id,name,slug')
            ->firstOrFail();

        $this->authorize('update', [$pet, $current_team]);

        return Inertia::render('Teams/Pets/Edit', [
            'pet' => $pet,
            'team' => $current_team,
        ]);
    }

    public function update(Team $current_team, int $id, UpdatePetRequest $request)
    {
        $pet = $current_team->pets()
            ->where('id', $id)
            ->firstOrFail();

        $this->authorize('update', [$pet, $current_team]);

        $data = $request->validated();
        $data['slug'] = $request->slug ?? Str::slug($request->name);

        unset($data['photo']);
        unset($data['photo_urls']);

        if ($request->hasFile('photo')) {
            if ($pet->photos && count($pet->photos) > 0) {
                Storage::disk('public')->delete($pet->photos[0]);
            }

            $path = $request->file('photo')->store('pets', 'public');
            $data['photos'] = [$path];
        } elseif ($request->filled('photo_urls')) {
            if ($pet->photos) {
                foreach ($pet->photos as $oldPath) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            $paths = $this->downloadMultiplePhotos($request->photo_urls);
            if (!empty($paths)) {
                $data['photos'] = $paths;
            }
        }

        $pet->update($data);

        return redirect()->route('teams.pets.index', $current_team)->with('flash', [
            'toast' => [
                'type' => 'success',
                'message' => 'Mascota actualizada exitosamente',
            ],
        ]);
    }

    private function downloadPhotoFromUrl(string $url): ?string
    {
        $url = $this->convertGoogleDriveUrl($url);

        try {
            $response = Http::timeout(15)->get($url);
            if ($response->successful()) {
                $extension = 'jpg';
                $contentType = $response->header('Content-Type');
                if (str_contains($contentType, 'png')) $extension = 'png';
                elseif (str_contains($contentType, 'webp')) $extension = 'webp';
                elseif (str_contains($contentType, 'gif')) $extension = 'gif';

                $filename = 'pets/' . Str::random(40) . '.' . $extension;
                if (Storage::disk('public')->put($filename, $response->body())) {
                    return $filename;
                }
            }
        } catch (\Exception) {
        }
        return null;
    }

    private function downloadMultiplePhotos(string $urls): array
    {
        $urlList = array_filter(array_map('trim', explode("\n", $urls)));
        $paths = [];
        foreach ($urlList as $url) {
            $path = $this->downloadPhotoFromUrl($url);
            if ($path) {
                $paths[] = $path;
            }
        }
        return $paths;
    }

    private function convertGoogleDriveUrl(string $url): string
    {
        if (!str_contains($url, 'drive.google.com')) {
            return $url;
        }

        preg_match('/\/d\/([a-zA-Z0-9_-]+)/', $url, $matches);
        if (empty($matches)) {
            preg_match('/id=([a-zA-Z0-9_-]+)/', $url, $matches);
        }

        if (!empty($matches[1])) {
            return 'https://drive.google.com/uc?export=view&id=' . $matches[1];
        }

        return $url;
    }

    public function destroy(Team $current_team, int $id)
    {
        $pet = $current_team->pets()
            ->where('id', $id)
            ->firstOrFail();

        $this->authorize('delete', [$pet, $current_team]);

        $pet->delete();

        return redirect()->route('teams.pets.index', $current_team)->with('flash', [
            'toast' => [
                'type' => 'success',
                'message' => 'Mascota eliminada exitosamente',
            ],
        ]);
    }
}
