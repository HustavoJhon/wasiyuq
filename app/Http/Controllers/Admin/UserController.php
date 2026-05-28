<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\UpdateUserRoleRequest;
use App\Models\Adoption;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::query()
            ->with('teamMemberships.team:id,name,slug')
            ->withCount(['teamMemberships'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'total' => $users->total(),
                'per_page' => $users->perPage(),
            ],
        ]);
    }

    public function show(User $user)
    {
        $user->load(['teamMemberships.team:id,name,slug,is_personal']);
        $user->adoptions_count = Adoption::query()->where('user_id', $user->id)->count();

        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
        ]);
    }

    public function updateRole(User $user, UpdateUserRoleRequest $request)
    {
        $user->update([
            'is_super_admin' => $request->boolean('is_super_admin'),
        ]);

        return redirect()->back()->with('flash', [
            'toast' => [
                'type' => 'success',
                'message' => 'Rol de usuario actualizado exitosamente',
            ],
        ]);
    }

    public function destroy(User $user)
    {
        if ($user->id === Auth::id()) {
            return redirect()->back()->with('flash', [
                'toast' => [
                    'type' => 'error',
                    'message' => 'No puedes eliminar tu propio usuario',
                ],
            ]);
        }

        $user->delete();

        return redirect()->back()->with('flash', [
            'toast' => [
                'type' => 'success',
                'message' => 'Usuario eliminado exitosamente',
            ],
        ]);
    }
}
