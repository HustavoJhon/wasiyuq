<?php

namespace App\Http\Controllers\Admin;

use App\Enums\TeamPermission;
use App\Enums\TeamRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Requests\User\UpdateUserRoleRequest;
use App\Models\Adoption;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
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

        $usersArray = collect($users->items())->map(function ($user) {
            $user->memberships = $user->teamMemberships->map(function ($membership) {
                return [
                    'team' => $membership->team,
                    'role' => $membership->role ?? 'member',
                ];
            });
            unset($user->teamMemberships);
            return $user;
        })->toArray();

        return Inertia::render('Admin/Users/Index', [
            'users' => $usersArray,
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'total' => $users->total(),
                'per_page' => $users->perPage(),
            ],
            'teams' => Team::query()->where('is_personal', false)->pluck('name', 'id'),
            'roles' => ['member', 'admin'],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create', [
            'teams' => Team::query()->where('is_personal', false)->get(['id', 'name']),
            'teamRoles' => [
                ['value' => 'member', 'label' => 'Miembro'],
                ['value' => 'admin', 'label' => 'Administrador'],
                ['value' => 'owner', 'label' => 'Propietario'],
            ],
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        $user = User::query()->create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'email_verified_at' => $request->boolean('verified') ? now() : null,
            'is_super_admin' => $request->boolean('is_super_admin'),
        ]);

        if ($request->team_id) {
            $user->teams()->attach($request->team_id, [
                'role' => $request->team_role ?? 'member',
            ]);
        }

        return redirect()->route('admin.users.index')->with('flash', [
            'toast' => [
                'type' => 'success',
                'message' => 'Usuario creado exitosamente',
            ],
        ]);
    }

    public function show(User $user)
    {
        $user->load(['teamMemberships.team:id,name,slug,is_personal']);

        $allPermissions = [];
        $user->memberships = $user->teamMemberships->map(function ($membership) use (&$allPermissions) {
            $role = TeamRole::tryFrom($membership->role);
            $modules = $role ? $role->modules() : [];

            $allPermissions[$membership->team->name] = $modules;

            return [
                'id' => $membership->id,
                'team' => $membership->team,
                'role' => $membership->role ?? 'member',
                'role_label' => $role?->label() ?? $membership->role,
                'role_description' => $role?->description() ?? '',
                'modules' => collect($modules)->map(fn($m) => [
                    'name' => $m['name'],
                    'permissions' => collect($m['permissions'])->map(fn($p) => [
                        'key' => $p,
                        'label' => TeamPermission::tryFrom($p)?->label() ?? $p,
                    ]),
                ])->values(),
            ];
        });
        unset($user->teamMemberships);
        
        $user->adoptions_count = Adoption::query()->where('user_id', $user->id)->count();

        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
            'teams' => Team::query()->where('is_personal', false)->get(['id', 'name']),
        ]);
    }

    public function edit(User $user)
    {
        $user->load(['teamMemberships.team:id,name,slug,is_personal']);

        $user->memberships = $user->teamMemberships->map(function ($membership) {
            return [
                'id' => $membership->id,
                'team' => $membership->team,
                'role' => $membership->role ?? 'member',
            ];
        });
        unset($user->teamMemberships);

        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'teams' => Team::query()->where('is_personal', false)->get(['id', 'name']),
            'teamRoles' => [
                ['value' => 'member', 'label' => 'Miembro'],
                ['value' => 'admin', 'label' => 'Administrador'],
                ['value' => 'owner', 'label' => 'Propietario'],
            ],
        ]);
    }

    public function update(User $user, UpdateUserRequest $request)
    {
        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'is_super_admin' => $request->boolean('is_super_admin'),
        ];

        if ($request->password) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return redirect()->route('admin.users.index')->with('flash', [
            'toast' => [
                'type' => 'success',
                'message' => 'Usuario actualizado exitosamente',
            ],
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
