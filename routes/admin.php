<?php

use App\Http\Controllers\Admin\AdoptionController;
use App\Http\Controllers\Admin\BlogPostController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\FollowUpController;
use App\Http\Controllers\Admin\OrganizationController;
use App\Http\Controllers\Admin\PetController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')
    ->middleware(['auth', 'verified', 'admin'])
    ->name('admin.')
    ->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/perfil', [ProfileController::class, 'index'])->name('profile.index');
        Route::put('/perfil', [ProfileController::class, 'update'])->name('profile.update');

        Route::get('/usuarios', [UserController::class, 'index'])->name('users.index');
        Route::get('/usuarios/{user}', [UserController::class, 'show'])->name('users.show');
        Route::put('/usuarios/{user}/role', [UserController::class, 'updateRole'])->name('users.update-role');
        Route::delete('/usuarios/{user}', [UserController::class, 'destroy'])->name('users.destroy');

        Route::get('/mascotas', [PetController::class, 'index'])->name('pets.index');
        Route::get('/mascotas/crear', [PetController::class, 'create'])->name('pets.create');
        Route::post('/mascotas', [PetController::class, 'store'])->name('pets.store');
        Route::get('/mascotas/{id}', [PetController::class, 'show'])->name('pets.show');
        Route::get('/mascotas/{id}/editar', [PetController::class, 'edit'])->name('pets.edit');
        Route::put('/mascotas/{id}', [PetController::class, 'update'])->name('pets.update');
        Route::delete('/mascotas/{id}', [PetController::class, 'destroy'])->name('pets.destroy');

        Route::get('/organizaciones', [OrganizationController::class, 'index'])->name('organizations.index');
        Route::get('/organizaciones/crear', [OrganizationController::class, 'create'])->name('organizations.create');
        Route::post('/organizaciones', [OrganizationController::class, 'store'])->name('organizations.store');
        Route::get('/organizaciones/{team}', [OrganizationController::class, 'show'])->name('organizations.show');
        Route::get('/organizaciones/{team}/editar', [OrganizationController::class, 'edit'])->name('organizations.edit');
        Route::put('/organizaciones/{team}', [OrganizationController::class, 'update'])->name('organizations.update');
        Route::delete('/organizaciones/{team}', [OrganizationController::class, 'destroy'])->name('organizations.destroy');

        Route::get('/eventos', [EventController::class, 'index'])->name('events.index');
        Route::get('/eventos/crear', [EventController::class, 'create'])->name('events.create');
        Route::post('/eventos', [EventController::class, 'store'])->name('events.store');
        Route::get('/eventos/{id}', [EventController::class, 'show'])->name('events.show');
        Route::get('/eventos/{id}/editar', [EventController::class, 'edit'])->name('events.edit');
        Route::put('/eventos/{id}', [EventController::class, 'update'])->name('events.update');
        Route::delete('/eventos/{id}', [EventController::class, 'destroy'])->name('events.destroy');

        Route::get('/blog', [BlogPostController::class, 'index'])->name('blog.index');
        Route::get('/blog/crear', [BlogPostController::class, 'create'])->name('blog.create');
        Route::post('/blog', [BlogPostController::class, 'store'])->name('blog.store');
        Route::get('/blog/{id}', [BlogPostController::class, 'show'])->name('blog.show');
        Route::get('/blog/{id}/editar', [BlogPostController::class, 'edit'])->name('blog.edit');
        Route::put('/blog/{id}', [BlogPostController::class, 'update'])->name('blog.update');
        Route::delete('/blog/{id}', [BlogPostController::class, 'destroy'])->name('blog.destroy');

        Route::get('/adopciones', [AdoptionController::class, 'index'])->name('adoptions.index');
        Route::get('/adopciones/{adoption}', [AdoptionController::class, 'show'])->name('adoptions.show');

        Route::get('/seguimiento', [FollowUpController::class, 'index'])->name('follow-ups.index');
        Route::get('/seguimiento/crear', [FollowUpController::class, 'create'])->name('follow-ups.create');
        Route::post('/seguimiento', [FollowUpController::class, 'store'])->name('follow-ups.store');
        Route::get('/seguimiento/{followUp}', [FollowUpController::class, 'show'])->name('follow-ups.show');
        Route::get('/seguimiento/{followUp}/editar', [FollowUpController::class, 'edit'])->name('follow-ups.edit');
        Route::put('/seguimiento/{followUp}', [FollowUpController::class, 'update'])->name('follow-ups.update');
        Route::delete('/seguimiento/{followUp}', [FollowUpController::class, 'destroy'])->name('follow-ups.destroy');
    });
