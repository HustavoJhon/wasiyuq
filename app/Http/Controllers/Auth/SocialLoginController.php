<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
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
            $user = User::query()->create([
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'social_id' => $googleUser->getId(),
                'social_provider' => 'google',
                'avatar' => $googleUser->getAvatar(),
                'email_verified_at' => now(),
            ]);
        }

        Auth::login($user);

        return redirect()->intended('/admin');
    }
}
