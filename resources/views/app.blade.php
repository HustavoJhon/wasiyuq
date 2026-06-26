<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}"  @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <meta name="theme-color" content="#2D6A4F">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <meta name="apple-mobile-web-app-title" content="Wasiyuq">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="application-name" content="Wasiyuq">

        <link rel="manifest" href="/build/manifest.webmanifest">
        <link rel="apple-touch-icon" href="/icons/icon-192.png">
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512.png">
        <meta name="apple-touch-startup-image" content="/icons/icon-512.png">

        <meta name="description" content="Plataforma de adopci&oacute;n responsable de mascotas en Cusco, Per&uacute;">
        <meta name="keywords" content="adopcion, mascotas, perros, gatos, Cusco, Peru, refugio, albergue, Wasiyuq">
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
        <meta name="googlebot" content="index, follow">
        <link rel="canonical" href="{{ url()->current() }}">

        <meta property="og:site_name" content="Wasiyuq">
        <meta property="og:locale" content="es_PE">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:site" content="@wasiyuq">
        <meta name="twitter:creator" content="@wasiyuq">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.bunny.net" crossorigin>
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet">

        @vite(['resources/css/app.css', 'resources/js/app.ts'])
        <x-inertia::head>
            @php
                $routeUri = request()->getRequestUri();
                $seoTitle = match(true) {
                    str_starts_with($routeUri, '/mascotas/') && strlen($routeUri) > 10 => 'Mascota en adopción',
                    str_starts_with($routeUri, '/mascotas') => 'Mascotas en adopción',
                    str_starts_with($routeUri, '/eventos/') && strlen($routeUri) > 9 => 'Evento de adopción',
                    str_starts_with($routeUri, '/eventos') => 'Eventos de adopción',
                    str_starts_with($routeUri, '/blog/') && strlen($routeUri) > 6 => 'Artículo del blog',
                    str_starts_with($routeUri, '/blog') => 'Blog de adopción responsable',
                    str_starts_with($routeUri, '/sobre-nosotros') => 'Sobre nosotros',
                    str_starts_with($routeUri, '/contacto') => 'Contacto',
                    default => 'Wasiyuq — Adopción responsable en Cusco',
                };
            @endphp
            <title>{{ $seoTitle }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
