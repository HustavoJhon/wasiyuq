import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.ts'],
            refresh: true,
            buildDirectory: 'build',
        }),
        inertia(),
        tailwindcss(),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        wayfinder({
            formVariants: true,
        }),
        VitePWA({
            registerType: 'autoUpdate',
            scope: '/',
            includeAssets: ['offline.html', 'favicon.ico', 'favicon.svg'],
            manifest: {
                name: 'Wasiyuq — Adopción responsable en Cusco',
                short_name: 'Wasiyuq',
                description: 'Plataforma de adopción responsable de mascotas en Cusco, Perú',
                theme_color: '#2D6A4F',
                background_color: '#ffffff',
                display: 'standalone',
                start_url: '/',
                scope: '/',
                lang: 'es',
                orientation: 'any',
                categories: ['lifestyle', 'social'],
                short_urls: true,
                iarc_rating_id: '',
                related_applications: [],
                prefer_related_applications: false,
                icons: [
                    { src: '/icons/icon-72.png', sizes: '72x72', type: 'image/png' },
                    { src: '/icons/icon-96.png', sizes: '96x96', type: 'image/png' },
                    { src: '/icons/icon-128.png', sizes: '128x128', type: 'image/png' },
                    { src: '/icons/icon-144.png', sizes: '144x144', type: 'image/png' },
                    { src: '/icons/icon-152.png', sizes: '152x152', type: 'image/png' },
                    { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
                    { src: '/icons/icon-384.png', sizes: '384x384', type: 'image/png' },
                    { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
                    { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
                    { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
                ],
                screenshots: [
                    {
                        src: '/icons/screenshot-mobile.png',
                        sizes: '412x915',
                        type: 'image/png',
                        form_factor: 'narrow',
                        label: 'Inicio de Wasiyuq',
                    },
                    {
                        src: '/icons/screenshot-desktop.png',
                        sizes: '1280x720',
                        type: 'image/png',
                        form_factor: 'wide',
                        label: 'Explorando mascotas en adopción',
                    },
                ],
                shortcuts: [
                    {
                        name: 'Mascotas',
                        short_name: 'Mascotas',
                        description: 'Ver mascotas en adopción',
                        url: '/mascotas',
                        icons: [{ src: '/icons/icon-96.png', sizes: '96x96' }],
                    },
                    {
                        name: 'Eventos',
                        short_name: 'Eventos',
                        description: 'Ver eventos de adopción',
                        url: '/eventos',
                        icons: [{ src: '/icons/icon-96.png', sizes: '96x96' }],
                    },
                ],
            },
            workbox: {
                navigateFallback: '/offline.html',
                navigateFallbackDenylist: [
                    /^\/api\//,
                    /^\/admin/,
                    /^\/login/,
                    /^\/register/,
                ],
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,webp,jpg}'],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.bunny\.net\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'bunny-fonts',
                            expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
                        },
                    },
                    {
                        urlPattern: /^https:\/\/picsum\.photos\/.*/i,
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'external-images',
                            expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 },
                        },
                    },
                ],
            },
        }),
    ],
});
