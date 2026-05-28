<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Adoption;
use App\Models\Announcement;
use App\Models\BlogPost;
use App\Models\FollowUp;
use App\Models\Pet;
use App\Models\Team;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_pets' => Pet::query()->count(),
                'available_pets' => Pet::query()->where('status', 'available')->count(),
                'adopted_pets' => Pet::query()->where('status', 'adopted')->count(),
                'total_organizations' => Team::query()->where('is_personal', false)->count(),
                'total_adoptions' => Adoption::query()->count(),
                'pending_adoptions' => Adoption::query()->where('status', 'pending')->count(),
                'total_events' => Announcement::query()->count(),
                'total_blog_posts' => BlogPost::query()->count(),
                'pending_follow_ups' => FollowUp::query()->where('status', 'pending')->count(),
                'total_users' => User::query()->count(),
            ],
            'recent_adoptions' => Adoption::query()
                ->with(['pet:id,name,slug', 'adopter:id,name'])
                ->latest()
                ->take(5)
                ->get(),
            'recent_pets' => Pet::query()
                ->with('team:id,name')
                ->latest()
                ->take(5)
                ->get(),
        ]);
    }
}
