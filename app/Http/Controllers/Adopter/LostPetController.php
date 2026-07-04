<?php

namespace App\Http\Controllers\Adopter;

use App\Http\Controllers\Controller;
use App\Models\LostPet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LostPetController extends Controller
{
    public function index()
    {
        $pets = LostPet::query()
            ->where('user_id', Auth::id())
            ->latest()
            ->paginate(12);

        return Inertia::render('Adopter/LostPets/Index', [
            'pets' => $pets->items(),
            'meta' => [
                'current_page' => $pets->currentPage(),
                'last_page' => $pets->lastPage(),
                'total' => $pets->total(),
                'per_page' => $pets->perPage(),
            ],
        ]);
    }

    public function edit(LostPet $lostPet)
    {
        if ($lostPet->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Adopter/LostPets/Edit', [
            'pet' => $lostPet,
        ]);
    }

    public function update(Request $request, LostPet $lostPet)
    {
        if ($lostPet->user_id !== Auth::id()) {
            abort(403);
        }

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
            'is_resolved' => 'boolean',
            'photo' => 'nullable|image|max:5120',
            'photo_url' => 'nullable|url|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            if ($lostPet->photos) {
                foreach ($lostPet->photos as $oldPath) {
                    $old = str_replace('/storage/', '', $oldPath);
                    if (Storage::disk('public')->exists($old)) {
                        Storage::disk('public')->delete($old);
                    }
                }
            }
            $path = $request->file('photo')->store('lost-pets', 'public');
            $data['photos'] = [Storage::url($path)];
        } elseif ($request->filled('photo_url')) {
            $data['photos'] = [$request->input('photo_url')];
        }

        $lostPet->update($data);

        return back()->with('flash', [
            'toast' => ['type' => 'success', 'message' => 'Reporte actualizado.'],
        ]);
    }

    public function destroy(LostPet $lostPet)
    {
        if ($lostPet->user_id !== Auth::id()) {
            abort(403);
        }

        $lostPet->delete();

        return back()->with('flash', [
            'toast' => ['type' => 'success', 'message' => 'Reporte eliminado.'],
        ]);
    }
}
