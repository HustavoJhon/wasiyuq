<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import Sonner from '@/components/ui/sonner/Sonner.vue';
import { useAppearance } from '@/composables/useAppearance';
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import { ArrowRight, MapPin } from 'lucide-vue-next';

const mobileOpen = ref(false);
const { resolvedAppearance, updateAppearance } = useAppearance();

function toggleAppearance() {
    updateAppearance(resolvedAppearance.value === 'dark' ? 'light' : 'dark');
}

const page = usePage();

function isActive(path: string): boolean {
    return page.url.startsWith(path);
}

const pageJsonLd = computed(() => {
    const props = page.props as Record<string, unknown>;

    return (props.jsonLd as Record<string, unknown> | null) ?? null;
});

const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Wasiyuq',
    url: 'https://wasiyuq.pe',
    description: 'Plataforma de adopción responsable en Cusco, Perú',
    areaServed: { '@type': 'City', name: 'Cusco' },
    address: {
        '@type': 'PostalAddress',
        addressLocality: 'Cusco',
        addressCountry: 'PE',
    },
    email: 'info@wasiyuq.pe',
};

const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Wasiyuq',
    url: 'https://wasiyuq.pe',
    description: 'Plataforma de adopción responsable en Cusco, Perú',
    potentialAction: {
        '@type': 'SearchAction',
        target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://wasiyuq.pe/mascotas?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
    },
};
</script>

<template>
    <div class="flex min-h-screen flex-col bg-background">
        <script
            type="application/ld+json"
            v-html="JSON.stringify(organizationSchema)"
        ></script>
        <script
            type="application/ld+json"
            v-html="JSON.stringify(websiteSchema)"
        ></script>
        <script
            v-if="pageJsonLd"
            type="application/ld+json"
            v-html="JSON.stringify(pageJsonLd)"
        ></script>
        <header
            class="fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:px-6 lg:px-8"
        >
            <nav
                class="relative mx-2 w-full max-w-7xl rounded-[36px] border border-[#2D6A4F]/20 bg-white/70 px-4 py-3 shadow-md backdrop-blur-md md:flex md:items-center md:justify-between md:px-6 md:py-0 lg:px-8 xl:mx-auto dark:border-neutral-700/40 dark:bg-neutral-800/60 dark:backdrop-blur-md"
                aria-label="Global"
            >
                <div class="flex items-center justify-between">
                    <a
                        href="/"
                        class="flex items-center gap-2 rounded-lg font-bold ring-zinc-500 outline-hidden focus-visible:ring-3 dark:ring-zinc-200"
                    >
                        <span
                            class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2D6A4F] text-white"
                        >
                            <AppLogoIcon class="h-5 w-5" />
                        </span>
                        <span class="text-lg font-bold text-foreground"
                            >Wasiyuq</span
                        >
                    </a>
                    <div class="ml-auto flex items-center gap-2 md:hidden">
                        <button
                            type="button"
                            @click="mobileOpen = !mobileOpen"
                            class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-muted-foreground transition hover:bg-neutral-200 disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-neutral-700"
                            aria-label="Toggle navigation"
                        >
                            <svg
                                v-if="!mobileOpen"
                                class="h-[1.25rem] w-[1.25rem] shrink-0"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <line x1="3" x2="21" y1="6" y2="6" />
                                <line x1="3" x2="21" y1="12" y2="12" />
                                <line x1="3" x2="21" y1="18" y2="18" />
                            </svg>
                            <svg
                                v-else
                                class="h-[1.25rem] w-[1.25rem] shrink-0"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div
                    v-if="mobileOpen"
                    class="mt-5 flex flex-col gap-y-4 pb-4 md:hidden"
                >
                    <a
                        href="/mascotas"
                        class="text-base font-medium transition"
                        :class="isActive('/mascotas') ? 'text-[#2D6A4F] font-bold' : 'text-muted-foreground hover:text-[#2D6A4F]'"
                        @click="mobileOpen = false"
                        >Mascotas</a
                    >
                    <a
                        href="/eventos"
                        class="text-base font-medium transition"
                        :class="isActive('/eventos') ? 'text-[#2D6A4F] font-bold' : 'text-muted-foreground hover:text-[#2D6A4F]'"
                        @click="mobileOpen = false"
                        >Eventos</a
                    >
                    <a
                        href="/blog"
                        class="text-base font-medium transition"
                        :class="isActive('/blog') ? 'text-[#2D6A4F] font-bold' : 'text-muted-foreground hover:text-[#2D6A4F]'"
                        @click="mobileOpen = false"
                        >Blog</a
                    >
                    <a
                        href="/sobre-nosotros"
                        class="text-base font-medium transition"
                        :class="isActive('/sobre-nosotros') ? 'text-[#2D6A4F] font-bold' : 'text-muted-foreground hover:text-[#2D6A4F]'"
                        @click="mobileOpen = false"
                        >Sobre Nosotros</a
                    >
                    <a
                        href="/contacto"
                        class="text-base font-medium transition"
                        :class="isActive('/contacto') ? 'text-[#2D6A4F] font-bold' : 'text-muted-foreground hover:text-[#2D6A4F]'"
                        @click="mobileOpen = false"
                        >Contacto</a
                    >
                    <hr class="border-border/50" />
                    <template v-if="$page.props.auth.user">
                        <a
                            href="/admin"
                            class="inline-flex items-center justify-center rounded-lg bg-[#2D6A4F] px-4 py-2 text-center text-sm font-medium text-white"
                            @click="mobileOpen = false"
                            >Dashboard</a
                        >
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            class="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-center text-sm font-medium text-muted-foreground"
                            @click="mobileOpen = false"
                            >Salir</Link
                        >
                    </template>
                    <template v-else>
                        <a
                            href="/login"
                            class="inline-flex items-center justify-center rounded-lg bg-[#2D6A4F] px-4 py-2 text-center text-sm font-medium text-white"
                            @click="mobileOpen = false"
                            >Ingresar</a
                        >
                    </template>
                    <button
                        @click="toggleAppearance"
                        class="flex h-8 w-8 items-center justify-center self-start rounded-full font-medium text-muted-foreground transition hover:bg-neutral-200 dark:hover:bg-neutral-700"
                        :title="
                            resolvedAppearance === 'dark'
                                ? 'Modo claro'
                                : 'Modo oscuro'
                        "
                    >
                        <svg
                            v-if="resolvedAppearance !== 'dark'"
                            class="h-4 w-4 shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
                            />
                        </svg>
                        <svg
                            v-else
                            class="h-4 w-4 shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <circle cx="12" cy="12" r="4" />
                            <path d="M12 8a2 2 0 1 0 4 4" />
                            <path d="M12 2v2" />
                            <path d="M12 20v2" />
                            <path d="m4.93 4.93 1.41 1.41" />
                            <path d="m17.66 17.66 1.41 1.41" />
                            <path d="M2 12h2" />
                            <path d="M20 12h2" />
                            <path d="m6.34 17.66-1.41 1.41" />
                            <path d="m19.07 4.93-1.41 1.41" />
                        </svg>
                    </button>
                </div>

                <div
                    class="hidden md:flex md:flex-1 md:items-center md:justify-center md:gap-5 lg:gap-8"
                >
                    <a
                        href="/mascotas"
                        class="relative rounded-lg py-3 text-sm font-medium transition"
                        :class="isActive('/mascotas') ? 'text-[#2D6A4F] font-semibold' : 'text-muted-foreground hover:text-[#2D6A4F]'"
                    >
                        Mascotas
                        <span v-if="isActive('/mascotas')" class="absolute -bottom-0.5 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-[#2D6A4F]" />
                    </a>
                    <a
                        href="/eventos"
                        class="relative rounded-lg py-3 text-sm font-medium transition"
                        :class="isActive('/eventos') ? 'text-[#2D6A4F] font-semibold' : 'text-muted-foreground hover:text-[#2D6A4F]'"
                    >
                        Eventos
                        <span v-if="isActive('/eventos')" class="absolute -bottom-0.5 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-[#2D6A4F]" />
                    </a>
                    <a
                        href="/blog"
                        class="relative rounded-lg py-3 text-sm font-medium transition"
                        :class="isActive('/blog') ? 'text-[#2D6A4F] font-semibold' : 'text-muted-foreground hover:text-[#2D6A4F]'"
                    >
                        Blog
                        <span v-if="isActive('/blog')" class="absolute -bottom-0.5 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-[#2D6A4F]" />
                    </a>
                    <a
                        href="/sobre-nosotros"
                        class="relative rounded-lg py-3 text-sm font-medium transition"
                        :class="isActive('/sobre-nosotros') ? 'text-[#2D6A4F] font-semibold' : 'text-muted-foreground hover:text-[#2D6A4F]'"
                    >
                        Sobre Nosotros
                        <span v-if="isActive('/sobre-nosotros')" class="absolute -bottom-0.5 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-[#2D6A4F]" />
                    </a>
                    <a
                        href="/contacto"
                        class="relative rounded-lg py-3 text-sm font-medium transition"
                        :class="isActive('/contacto') ? 'text-[#2D6A4F] font-semibold' : 'text-muted-foreground hover:text-[#2D6A4F]'"
                    >
                        Contacto
                        <span v-if="isActive('/contacto')" class="absolute -bottom-0.5 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-[#2D6A4F]" />
                    </a>
                </div>

                <div
                    class="hidden md:flex md:items-center md:gap-3"
                >
                    <template v-if="$page.props.auth.user">
                        <a
                            href="/admin"
                            class="rounded-full bg-[#2D6A4F] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#246142]"
                            >Dashboard</a
                        >
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            class="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-neutral-200 dark:hover:bg-neutral-700"
                            title="Cerrar sesión"
                        >
                            <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </Link>
                    </template>
                    <template v-else>
                        <a
                            href="/login"
                            class="rounded-lg bg-[#2D6A4F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#246142]"
                            >Ingresar</a
                        >
                    </template>
                    <button
                        @click="toggleAppearance"
                        class="flex h-8 w-8 items-center justify-center rounded-full font-medium text-muted-foreground transition hover:bg-neutral-200 dark:hover:bg-neutral-700"
                        :title="
                            resolvedAppearance === 'dark'
                                ? 'Modo claro'
                                : 'Modo oscuro'
                        "
                    >
                        <svg
                            v-if="resolvedAppearance !== 'dark'"
                            class="h-4 w-4 shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
                            />
                        </svg>
                        <svg
                            v-else
                            class="h-4 w-4 shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <circle cx="12" cy="12" r="4" />
                            <path d="M12 8a2 2 0 1 0 4 4" />
                            <path d="M12 2v2" />
                            <path d="M12 20v2" />
                            <path d="m4.93 4.93 1.41 1.41" />
                            <path d="m17.66 17.66 1.41 1.41" />
                            <path d="M2 12h2" />
                            <path d="M20 12h2" />
                            <path d="m6.34 17.66-1.41 1.41" />
                            <path d="m19.07 4.93-1.41 1.41" />
                        </svg>
                    </button>
                </div>
            </nav>
        </header>

        <main class="flex-1 pt-20">
            <slot />
        </main>

        <footer class="border-t border-border/50 bg-gradient-to-b from-background to-muted/40">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <!-- CTA strip -->
                <div class="relative -mt-8 mb-12 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#40916C] px-6 py-8 shadow-lg sm:px-10 sm:py-10">
                    <div class="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
                    <div class="relative flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                        <div class="text-center sm:text-left">
                            <h3 class="text-lg font-bold text-white sm:text-xl">¿Eres un albergue o refugio?</h3>
                            <p class="mt-1 text-sm text-green-100/80">Sumate a Wasiyuq y encontrá hogares responsables para tus mascotas.</p>
                        </div>
                        <a href="/contacto" class="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#1B4332] shadow-lg shadow-black/10 transition-all hover:bg-green-50 hover:-translate-y-0.5 hover:shadow-xl">
                            Registrar entidad <ArrowRight class="h-4 w-4" />
                        </a>
                    </div>
                </div>

                <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
                    <!-- Brand -->
                    <div class="lg:col-span-2">
                        <a href="/" class="flex items-center gap-2">
                            <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2D6A4F] text-white">
                                <AppLogoIcon class="h-5 w-5" />
                            </span>
                            <span class="text-lg font-bold text-foreground">Wasiyuq</span>
                        </a>
                        <p class="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                            Plataforma cusqueña de adopción responsable. Conectamos mascotas en situación de abandono con familias comprometidas a darles un hogar lleno de amor.
                        </p>
                        <div class="mt-5 flex items-center gap-3">
                            <a href="https://wa.me/51944480535?text=Hola!%20Necesito%20soporte%20t%C3%A9cnico%20en%20Wasiyuq" target="_blank" class="flex h-9 w-9 items-center justify-center rounded-xl bg-[#25D366]/10 text-[#25D366] transition hover:bg-[#25D366]/20 hover:-translate-y-0.5" title="WhatsApp">
                                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            </a>
                            <a href="mailto:info@wasiyuq.pe" class="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2D6A4F]/10 text-[#2D6A4F] transition hover:bg-[#2D6A4F]/20 hover:-translate-y-0.5" title="Correo">
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                            </a>
                        </div>
                    </div>

                    <!-- Navegación -->
                    <div>
                        <h4 class="text-sm font-semibold text-foreground">Navegación</h4>
                        <ul class="mt-4 space-y-2.5">
                            <li><a href="/mascotas" class="text-sm text-muted-foreground transition hover:text-[#2D6A4F]">Mascotas</a></li>
                            <li><a href="/eventos" class="text-sm text-muted-foreground transition hover:text-[#2D6A4F]">Eventos</a></li>
                            <li><a href="/blog" class="text-sm text-muted-foreground transition hover:text-[#2D6A4F]">Blog</a></li>
                            <li><a href="/sobre-nosotros" class="text-sm text-muted-foreground transition hover:text-[#2D6A4F]">Sobre Nosotros</a></li>
                            <li><a href="/contacto" class="text-sm text-muted-foreground transition hover:text-[#2D6A4F]">Contacto</a></li>
                        </ul>
                    </div>

                    <!-- Para entidades -->
                    <div>
                        <h4 class="text-sm font-semibold text-foreground">Para entidades</h4>
                        <ul class="mt-4 space-y-2.5">
                            <li><a href="/contacto" class="text-sm text-muted-foreground transition hover:text-[#2D6A4F]">Registrar entidad</a></li>
                            <li><a href="/login" class="text-sm text-muted-foreground transition hover:text-[#2D6A4F]">Iniciar sesión</a></li>
                        </ul>
                        <h4 class="mt-7 text-sm font-semibold text-foreground">Ayuda</h4>
                        <ul class="mt-4 space-y-2.5">
                            <li><a href="/sobre-nosotros" class="text-sm text-muted-foreground transition hover:text-[#2D6A4F]">Preguntas frecuentes</a></li>
                            <li><a href="https://wa.me/51944480535" target="_blank" class="text-sm text-muted-foreground transition hover:text-[#2D6A4F]">Soporte técnico</a></li>
                        </ul>
                    </div>

                    <!-- Contacto -->
                    <div>
                        <h4 class="text-sm font-semibold text-foreground">Contacto</h4>
                        <ul class="mt-4 space-y-3">
                            <li class="flex items-start gap-2.5">
                                <MapPin class="mt-0.5 h-4 w-4 shrink-0 text-[#2D6A4F]" />
                                <span class="text-sm text-muted-foreground">Cusco, Perú</span>
                            </li>
                            <li class="flex items-start gap-2.5">
                                <svg class="mt-0.5 h-4 w-4 shrink-0 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                <a href="mailto:info@wasiyuq.pe" class="text-sm text-muted-foreground transition hover:text-[#2D6A4F]">info@wasiyuq.pe</a>
                            </li>
                            <li class="flex items-start gap-2.5">
                                <svg class="mt-0.5 h-4 w-4 shrink-0 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                                <a href="https://wa.me/51944480535" target="_blank" class="text-sm text-muted-foreground transition hover:text-[#2D6A4F]">+51 944 480 535</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Bottom bar -->
                <div class="mt-10 flex flex-col items-center gap-4 border-t border-border/50 pt-8 sm:flex-row sm:justify-between">
                    <p class="text-xs text-muted-foreground/60">
                        &copy; {{ new Date().getFullYear() }} Wasiyuq. Todos los derechos reservados.
                    </p>
                    <div class="flex items-center gap-4 text-xs text-muted-foreground/50">
                        <span>Hecho con <span class="text-red-400">&#9829;</span> para las mascotas de Cusco</span>
                    </div>
                </div>
            </div>
        </footer>

        <Sonner />
    </div>
</template>
