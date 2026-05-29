<?php

namespace App\Http\Middleware;

use App\Enums\TeamPermission;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'currentTeam' => fn () => $user?->currentTeam ? $user->toUserTeam($user->currentTeam) : null,
            'teams' => fn () => $user?->toUserTeams(includeCurrent: true) ?? [],
            'allowedModules' => fn () => $user && $user->currentTeam ? $this->getAllowedModules($user, $user->currentTeam) : [],
        ];
    }

    private function getAllowedModules($user, $team): array
    {
        $modules = [];

        if ($user->hasTeamPermission($team, TeamPermission::ViewPets)) {
            $modules[] = 'mascotas';
        }
        if ($user->hasTeamPermission($team, TeamPermission::ViewAdoptions)) {
            $modules[] = 'adopciones';
        }
        if ($user->hasTeamPermission($team, TeamPermission::ViewBlog)) {
            $modules[] = 'blog';
        }
        if ($user->hasTeamPermission($team, TeamPermission::ViewEvents)) {
            $modules[] = 'eventos';
        }
        if ($user->hasTeamPermission($team, TeamPermission::ViewFollowUps)) {
            $modules[] = 'seguimientos';
        }

        return $modules;
    }
}
