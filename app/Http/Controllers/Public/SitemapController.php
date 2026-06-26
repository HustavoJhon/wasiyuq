<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\BlogPost;
use App\Models\Pet;

class SitemapController extends Controller
{
    public function index()
    {
        $static = [
            ['loc' => url('/'), 'priority' => '1.0', 'changefreq' => 'weekly'],
            ['loc' => url('/mascotas'), 'priority' => '0.9', 'changefreq' => 'daily'],
            ['loc' => url('/eventos'), 'priority' => '0.8', 'changefreq' => 'weekly'],
            ['loc' => url('/blog'), 'priority' => '0.8', 'changefreq' => 'weekly'],
            ['loc' => url('/sobre-nosotros'), 'priority' => '0.6', 'changefreq' => 'monthly'],
            ['loc' => url('/contacto'), 'priority' => '0.5', 'changefreq' => 'monthly'],
        ];

        $pets = Pet::query()
            ->where('status', 'available')
            ->whereNull('deleted_at')
            ->get(['slug', 'updated_at', 'photos', 'name']);

        $events = Announcement::query()
            ->where('is_published', true)
            ->whereNull('deleted_at')
            ->get(['slug', 'updated_at', 'title']);

        $posts = BlogPost::query()
            ->where('is_published', true)
            ->whereNull('deleted_at')
            ->get(['slug', 'updated_at', 'title', 'cover_image']);

        $xml = view('sitemap', [
            'static' => $static,
            'pets' => $pets,
            'events' => $events,
            'posts' => $posts,
        ])->render();

        return response($xml, 200, ['Content-Type' => 'application/xml']);
    }
}
