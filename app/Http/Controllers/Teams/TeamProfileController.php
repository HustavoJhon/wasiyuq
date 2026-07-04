<?php

namespace App\Http\Controllers\Teams;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TeamProfileController extends Controller
{
    public function edit(Team $current_team)
    {
        return Inertia::render('Dashboard/Albergues/Edit', [
            'team' => $current_team,
        ]);
    }

    public function update(Request $request, Team $current_team)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'bio' => 'nullable|string|max:5000',
            'website' => 'nullable|url|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:100',
            'logo' => 'nullable|image|max:2048',
            'map_embed' => 'nullable|string|max:2000',
            'social_links' => 'nullable|array',
            'gallery' => 'nullable|array|max:6',
            'gallery.*' => 'url|max:2048',
            'support_info' => 'nullable|array',
        ]);

        if ($request->hasFile('logo')) {
            if ($current_team->logo) {
                $oldPath = str_replace('/storage/', '', $current_team->logo);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('logo')->store('teams/logos', 'public');
            $data['logo'] = Storage::url($path);
        }

        $current_team->update($data);

        return back()->with('flash', [
            'toast' => ['type' => 'success', 'message' => 'Perfil actualizado correctamente.'],
        ]);
    }
}
