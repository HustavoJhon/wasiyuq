<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Pet\StorePetRequest;
use App\Http\Requests\Pet\UpdatePetRequest;
use App\Models\Pet;
use App\Models\Team;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PetController extends Controller
{
    public function index()
    {
        $pets = Pet::query()
            ->with('team:id,name,slug')
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Pets/Index', [
            'pets' => $pets->items(),
            'meta' => [
                'current_page' => $pets->currentPage(),
                'last_page' => $pets->lastPage(),
                'total' => $pets->total(),
                'per_page' => $pets->perPage(),
            ],
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
        $data['slug'] = $request->slug ?? Str::slug($request->name);

        unset($data['photo']);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('pets', 'public');
            $data['photos'] = [$path];
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
        $data['slug'] = $request->slug ?? Str::slug($request->name);

        unset($data['photo']);

        if ($request->hasFile('photo')) {
            if ($pet->photos && count($pet->photos) > 0) {
                Storage::disk('public')->delete($pet->photos[0]);
            }

            $path = $request->file('photo')->store('pets', 'public');
            $data['photos'] = [$path];
        }

        $pet->update($data);

        return redirect()->route('admin.pets.index')->with('flash', [
            'toast' => [
                'type' => 'success',
                'message' => 'Mascota actualizada exitosamente',
            ],
        ]);
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
