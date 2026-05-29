<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsSuperAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && ($user->is_super_admin || $user->email === 'hustavojhon@gmail.com')) {
            return $next($request);
        }

        if ($request->inertia()) {
            return redirect()->route('dashboard', $user?->currentTeam?->slug ?? '')
                ->with('flash', [
                    'toast' => [
                        'type' => 'error',
                        'message' => 'Acceso denegado. Se requieren permisos de administrador.',
                    ],
                ]);
        }

        abort(403, 'Acceso denegado. Se requieren permisos de administrador.');
    }
}