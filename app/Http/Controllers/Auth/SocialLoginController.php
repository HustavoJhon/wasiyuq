<?php

namespace App\Http\Controllers\Auth;

use App\Enums\TeamRole;
use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Laravel\Socialite\Facades\Socialite;

class SocialLoginController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Exception $e) {
            return redirect('/login')->with('flash', [
                'toast' => ['type' => 'error', 'message' => 'Error al autenticar con Google'],
            ]);
        }

        $user = User::query()->where('social_id', $googleUser->getId())
            ->orWhere('email', $googleUser->getEmail())
            ->first();

        if ($user) {
            $user->update([
                'social_id' => $googleUser->getId(),
                'social_provider' => 'google',
                'avatar' => $googleUser->getAvatar(),
            ]);
        } else {
            $user = DB::transaction(function () use ($googleUser) {
                $user = User::query()->create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'social_id' => $googleUser->getId(),
                    'social_provider' => 'google',
                    'avatar' => $googleUser->getAvatar(),
                    'email_verified_at' => now(),
                ]);

                $user->teams()->attach(
                    Team::query()->create([
                        'name' => $user->name.' (personal)',
                        'is_personal' => true,
                    ]),
                    ['role' => TeamRole::Owner->value],
                );

                $user->update(['current_team_id' => $user->personalTeam()?->id]);

                return $user;
            });
        }

        Auth::login($user);

        return redirect()->intended('/admin');
    }
}
