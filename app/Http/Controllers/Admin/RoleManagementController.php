<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Enums\TeamRole;
use App\Enums\TeamPermission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleManagementController extends Controller
{
    public function index()
    {
        $roles = collect(TeamRole::cases())
            ->map(fn (TeamRole $role) => [
                'value' => $role->value,
                'label' => $role->label(),
                'description' => $role->description(),
                'level' => $role->level(),
                'modules' => $role->modules(),
                'total_permissions' => count($role->permissions()),
            ])
            ->sortByDesc('level')
            ->values();

        return Inertia::render('Admin/Roles/Index', [
            'roles' => $roles->all(),
        ]);
    }

    public function show(string $roleValue)
    {
        try {
            $role = TeamRole::from($roleValue);
        } catch (\ValueError $e) {
            abort(404, 'Rol no encontrado');
        }

        $permissions = collect($role->permissions())
            ->groupBy(fn (TeamPermission $p) => $p->module())
            ->map(fn ($group) => [
                'module' => $group->first()->module(),
                'permissions' => $group->map(fn (TeamPermission $p) => [
                    'value' => $p->value,
                    'label' => $p->label(),
                ])->values(),
            ])
            ->values();

        return Inertia::render('Admin/Roles/Show', [
            'role' => [
                'value' => $role->value,
                'label' => $role->label(),
                'description' => $role->description(),
                'level' => $role->level(),
            ],
            'permissions' => $permissions,
            'all_permissions' => collect(TeamPermission::cases())
                ->groupBy(fn (TeamPermission $p) => $p->module())
                ->map(fn ($group) => [
                    'module' => $group->first()->module(),
                    'count' => count($group),
                ])
                ->values(),
        ]);
    }
}
