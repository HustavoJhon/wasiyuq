<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AboutController extends Controller
{
    public function index()
    {
        return Inertia::render('Public/About', [
            'seo' => [
                'title' => 'Sobre nosotros',
                'description' => 'Conoce Wasiyuq: la plataforma cusqueña que conecta mascotas en abandono con familias responsables. Nuestra misión, visión e historia.',
                'url' => url('/sobre-nosotros'),
                'type' => 'website',
            ],
        ]);
    }
}
