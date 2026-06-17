<?php

namespace App\Http\Responses\Concerns;

use App\Actions\Teams\CreateTeam;
use Illuminate\Support\Facades\URL;

trait RedirectsToCurrentTeam
{
    protected function redirectPathForCurrentTeam($request, string $redirect): string
    {
        $team = $this->currentTeam($request);

        URL::defaults(['current_team' => $team->slug]);

        if ($team->is_personal) {
            return '/mi-adopcion';
        }

        return "/{$team->slug}{$redirect}";
    }

    protected function currentTeam($request)
    {
        $user = $request->user();
        $team = $user?->currentTeam ?? $user?->personalTeam();

        if (! $team) {
            $team = app(CreateTeam::class)->handle(
                $user,
                "{$user->name} (personal)",
                isPersonal: true,
            );
        }

        return $team;
    }
}
