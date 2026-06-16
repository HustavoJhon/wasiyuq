<?php

namespace App\Http\Controllers\Admin;

use App\Enums\TeamPermission;
use App\Enums\TeamRole;
use App\Http\Controllers\Controller;
use App\Models\Membership;
use App\Models\User;
use Inertia\Inertia;

class RoleManagementController extends Controller
{
    public function index()
    {
        $roleCounts = Membership::query()
            ->selectRaw('role, count(distinct user_id) as total')
            ->groupBy('role')
            ->pluck('total', 'role');

        $roles = collect(TeamRole::cases())
            ->map(fn (TeamRole $role) => [
                'value' => $role->value,
                'label' => $role->label(),
                'description' => $role->description(),
                'level' => $role->level(),
                'modules' => $role->modules(),
                'total_permissions' => count($role->permissions()),
                'total_users' => $roleCounts->get($role->value, 0),
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

        $totalUsers = Membership::query()
            ->where('role', $role->value)
            ->selectRaw('count(distinct user_id) as total')
            ->value('total');

        $users = User::query()
            ->whereIn('id', Membership::query()
                ->where('role', $role->value)
                ->select('user_id')
                ->distinct()
            )
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        return Inertia::render('Admin/Roles/Show', [
            'role' => [
                'value' => $role->value,
                'label' => $role->label(),
                'description' => $role->description(),
                'level' => $role->level(),
                'total_users' => $totalUsers,
            ],
            'permissions' => $permissions,
            'all_permissions' => collect(TeamPermission::cases())
                ->groupBy(fn (TeamPermission $p) => $p->module())
                ->map(fn ($group) => [
                    'module' => $group->first()->module(),
                    'count' => count($group),
                ])
                ->values(),
            'users' => $users,
        ]);
    }
}
