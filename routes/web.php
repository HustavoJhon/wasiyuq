<?php

use App\Http\Controllers\Adopter\ApplicationController;
use App\Http\Controllers\Adopter\FollowUpReportController;
use App\Http\Controllers\Dashboard\AdoptionController as DashboardAdoptionController;
use App\Http\Controllers\Dashboard\BlogPostController as DashboardBlogPostController;
use App\Http\Controllers\Dashboard\EventController as DashboardEventController;
use App\Http\Controllers\Dashboard\FollowUpController as DashboardFollowUpController;
use App\Http\Controllers\Teams\PetController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Middleware\EnsureTeamMembership;
use App\Models\Adoption;
use App\Models\Announcement;
use App\Models\BlogPost;
use App\Models\FollowUp;
use App\Models\Pet;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\Route;

require __DIR__.'/public.php';

Route::get('/auth/google', [App\Http\Controllers\Auth\SocialLoginController::class, 'redirectToGoogle'])->name('google.login');
Route::get('/auth/google/callback', [App\Http\Controllers\Auth\SocialLoginController::class, 'handleGoogleCallback'])->name('google.callback');

Route::middleware(['auth', 'verified'])->get('/dashboard', function () {
    $user = request()->user();

    if ($user->is_super_admin) {
        return redirect('/admin');
    }

    $team = $user->currentTeam;

    if ($team && ! $team->is_personal) {
        return redirect("/{$team->slug}/dashboard");
    }

    return redirect('/mi-adopcion');
});

Route::prefix('{current_team}')
    ->middleware(['auth', 'verified', EnsureTeamMembership::class])
    ->group(function () {
        Route::get('dashboard', function (Team $current_team) {
            $teamId = $current_team->id;

            $stats = [
                'total_pets' => Pet::query()->where('team_id', $teamId)->count(),
                'available_pets' => Pet::query()->where('team_id', $teamId)->where('status', 'available')->count(),
                'adopted_pets' => Pet::query()->where('team_id', $teamId)->where('status', 'adopted')->count(),
                'in_process_pets' => Pet::query()->where('team_id', $teamId)->where('status', 'in_process')->count(),
                'total_adoptions' => Adoption::query()->where('team_id', $teamId)->count(),
                'pending_adoptions' => Adoption::query()->where('team_id', $teamId)->where('status', 'pending')->count(),
                'total_events' => Announcement::query()->where('team_id', $teamId)->count(),
                'total_blog_posts' => BlogPost::query()->where('team_id', $teamId)->count(),
                'pending_follow_ups' => FollowUp::query()->whereHas('adoption', fn ($q) => $q->where('team_id', $teamId))->where('status', 'pending')->count(),
            ];

            $recentAdoptions = Adoption::query()
                ->where('team_id', $teamId)
                ->with(['pet:id,name,slug', 'adopter:id,name'])
                ->latest()
                ->take(5)
                ->get();

            $recentPets = Pet::query()
                ->where('team_id', $teamId)
                ->latest()
                ->take(5)
                ->get();

            return \Inertia\Inertia::render('Dashboard', [
                'stats' => $stats,
                'recent_adoptions' => $recentAdoptions,
                'recent_pets' => $recentPets,
                'currentTeam' => $current_team,
            ]);
        })->name('dashboard');
    });

Route::prefix('{current_team}')
    ->middleware(['auth', 'verified', EnsureTeamMembership::class])
    ->name('teams.')
    ->group(function () {
        Route::get('mascotas', [PetController::class, 'index'])->name('pets.index');
        Route::get('mascotas/crear', [PetController::class, 'create'])->name('pets.create');
        Route::post('mascotas', [PetController::class, 'store'])->name('pets.store');
        Route::get('mascotas/{id}', [PetController::class, 'show'])->name('pets.show');
        Route::get('mascotas/{id}/editar', [PetController::class, 'edit'])->name('pets.edit');
        Route::put('mascotas/{id}', [PetController::class, 'update'])->name('pets.update');
        Route::delete('mascotas/{id}', [PetController::class, 'destroy'])->name('pets.destroy');

        Route::get('adopciones', [DashboardAdoptionController::class, 'index'])->name('adoptions.index');
        Route::get('adopciones/{adoption}', [DashboardAdoptionController::class, 'show'])->name('adoptions.show');
        Route::post('adopciones/{adoption}/aprobar', [DashboardAdoptionController::class, 'approve'])->name('adoptions.approve');
        Route::post('adopciones/{adoption}/rechazar', [DashboardAdoptionController::class, 'reject'])->name('adoptions.reject');

        Route::get('seguimientos', [DashboardFollowUpController::class, 'index'])->name('follow-ups.index');
        Route::get('seguimientos/{followUp}', [DashboardFollowUpController::class, 'show'])->name('follow-ups.show');
        Route::post('seguimientos/{followUp}/completar', [DashboardFollowUpController::class, 'markCompleted'])->name('follow-ups.complete');
        Route::post('seguimientos/{followUp}/no-realizado', [DashboardFollowUpController::class, 'markMissed'])->name('follow-ups.missed');
        Route::post('seguimientos', [DashboardFollowUpController::class, 'schedule'])->name('follow-ups.schedule');

        Route::get('blog', [DashboardBlogPostController::class, 'index'])->name('blog.index');
        Route::get('blog/crear', [DashboardBlogPostController::class, 'create'])->name('blog.create');
        Route::post('blog', [DashboardBlogPostController::class, 'store'])->name('blog.store');
        Route::get('blog/{id}', [DashboardBlogPostController::class, 'show'])->name('blog.show');
        Route::get('blog/{id}/editar', [DashboardBlogPostController::class, 'edit'])->name('blog.edit');
        Route::put('blog/{id}', [DashboardBlogPostController::class, 'update'])->name('blog.update');
        Route::delete('blog/{id}', [DashboardBlogPostController::class, 'destroy'])->name('blog.destroy');

        Route::get('eventos', [DashboardEventController::class, 'index'])->name('events.index');
        Route::get('eventos/crear', [DashboardEventController::class, 'create'])->name('events.create');
        Route::post('eventos', [DashboardEventController::class, 'store'])->name('events.store');
        Route::get('eventos/{id}', [DashboardEventController::class, 'show'])->name('events.show');
        Route::get('eventos/{id}/editar', [DashboardEventController::class, 'edit'])->name('events.edit');
        Route::put('eventos/{id}', [DashboardEventController::class, 'update'])->name('events.update');
        Route::delete('eventos/{id}', [DashboardEventController::class, 'destroy'])->name('events.destroy');

        Route::get('miembros', function (Team $current_team) {
            return \Inertia\Inertia::render('Dashboard/Members/Index', [
                'members' => $current_team->members()->get()->map(fn ($member) => [
                    'id' => $member->id,
                    'name' => $member->name,
                    'email' => $member->email,
                    'avatar' => $member->avatar ?? null,
                    'role' => $member->pivot->role->value,
                    'role_label' => $member->pivot->role->label(),
                ]),
                'currentTeam' => $current_team,
            ]);
        })->name('members.index');
    });

// Rutas del adoptante
Route::middleware(['auth', 'verified'])->prefix('mi-adopcion')->name('adopter.')->group(function () {
    Route::get('', [\App\Http\Controllers\Adopter\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/inicio', [\App\Http\Controllers\Adopter\DashboardController::class, 'index'])->name('dashboard.index');

    Route::get('/postulaciones', [ApplicationController::class, 'index'])->name('applications.index');

    Route::get('/seguimientos', [FollowUpReportController::class, 'index'])->name('follow-ups.index');
    Route::get('/seguimientos/{followUp}', [FollowUpReportController::class, 'show'])->name('follow-ups.show');
    Route::post('/seguimientos/{followUp}/reportar', [FollowUpReportController::class, 'report'])->name('follow-ups.report');
});

// Postulación pública (requiere auth)
Route::post('/mascotas/{slug}/postular', [ApplicationController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('pets.apply');

Route::middleware(['auth'])->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
});

require __DIR__.'/settings.php';
