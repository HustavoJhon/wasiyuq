<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Adoption;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user()->load("teamMemberships.team:id,name,slug");

        $adoptions = Adoption::query()
            ->with(["pet:id,name,slug,species", "team:id,name,slug"])
            ->where("user_id", $user->id)
            ->latest()
            ->get();

        return Inertia::render("Admin/Profile/Index", [
            "profile" => $user,
            "adoptions" => $adoptions,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            "name" => ["required", "string", "max:255"],
        ]);

        $request->user()->fill($validated)->save();

        return redirect()->back()->with("flash", [
            "toast" => ["type" => "success", "message" => "Perfil actualizado"],
        ]);
    }
}
