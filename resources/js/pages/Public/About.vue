<script setup lang="ts">
const heroImages = [
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1200&q=80',
    'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&q=80',
];

const creator = {
    name: 'Gustavo Jhon',
    username: 'hustavojhon',
    avatar: 'https://avatars.githubusercontent.com/u/100982198?v=4',
    url: 'https://github.com/HustavoJhon',
    role: 'Creador & Desarrollador',
    bio: 'Penguin 🐧 — apasionado por construir tecnología que transforma vidas.',
};

const timeline = [
    {
        year: '2024',
        title: 'El origen',
        desc: 'Wasiyuq nace como una idea: conectar albergues con adoptantes en Cusco.',
    },
    {
        year: '2025',
        title: 'Primeros pasos',
        desc: 'Se suman las primeras organizaciones de rescate y se lanza la plataforma piloto.',
    },
    {
        year: '2026',
        title: 'Crecimiento',
        desc: 'Más de 20 albergues registrados, cientos de adopciones gestionadas.',
    },
];

const values = [
    {
        icon: '🐾',
        title: 'Conectar',
        desc: 'Unimos adoptantes con organizaciones de rescate verificadas en toda la región.',
        iconBg: 'bg-rose-100 dark:bg-rose-900/30',
    },
    {
        icon: '💚',
        title: 'Gestionar',
        desc: 'Brindamos herramientas para que las entidades administren adopciones, eventos y seguimientos.',
        iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    },
    {
        icon: '📢',
        title: 'Difundir',
        desc: 'Visibilizamos campañas, eventos y mascotas que esperan un hogar.',
        iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    },
];
</script>

<template>
    <div>
        <section class="relative flex min-h-[70vh] items-center overflow-hidden">
            <img
                :src="heroImages[0]"
                alt="Perros y gatos"
                class="absolute inset-0 h-full w-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/60" />

            <div class="relative z-10 mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
                <div class="max-w-2xl">
                    <div class="flex items-center gap-3">
                        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                            <span class="text-2xl">🏠</span>
                        </div>
                        <span class="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur-sm">Plataforma de adopción</span>
                    </div>
                    <h1 class="mt-6 text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
                        Sobre <span class="text-emerald-400">Wasiyuq</span>
                    </h1>
                    <p class="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
                        Una plataforma que nació del amor por los animales y la necesidad de transformar la adopción en Cusco.
                    </p>
                    <div class="mt-8 flex items-center gap-8">
                        <div class="text-center">
                            <p class="text-3xl font-bold text-emerald-400">20+</p>
                            <p class="text-xs text-white/50">Albergues</p>
                        </div>
                        <div class="h-10 w-px bg-white/20" />
                        <div class="text-center">
                            <p class="text-3xl font-bold text-emerald-400">100+</p>
                            <p class="text-xs text-white/50">Adopciones</p>
                        </div>
                        <div class="h-10 w-px bg-white/20" />
                        <div class="text-center">
                            <p class="text-3xl font-bold text-emerald-400">1</p>
                            <p class="text-xs text-white/50">Región</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-20">
            <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    <div class="relative">
                        <div class="aspect-[4/3] overflow-hidden rounded-2xl">
                            <img
                                :src="heroImages[1]"
                                alt="Perro y gato amigos"
                                class="h-full w-full object-cover"
                            />
                        </div>
                        <div class="absolute -bottom-6 -right-6 rounded-2xl border border-[#2D6A4F]/15 bg-white p-5 shadow-xl dark:border-[#2D6A4F]/30 dark:bg-[#1a2e24]">
                            <p class="text-sm font-bold text-[#2D6A4F] dark:text-emerald-400">"casa del animal"</p>
                            <p class="text-xs text-muted-foreground">Wasiyuq en quechua</p>
                        </div>
                    </div>
                    <div>
                        <span class="inline-flex items-center rounded-full bg-[#2D6A4F]/10 px-3 py-1 text-xs font-semibold text-[#2D6A4F] dark:bg-[#2D6A4F]/20 dark:text-emerald-400">El origen</span>
                        <h2 class="mt-4 text-3xl font-bold text-foreground">¿Por qué nació Wasiyuq?</h2>
                        <p class="mt-4 text-base leading-relaxed text-muted-foreground">
                            En Cusco, cientos de perros y gatos viven en las calles, expuestos al frío, el hambre y las enfermedades. Las organizaciones de rescate hacen lo imposible con recursos limitados.
                        </p>
                        <p class="mt-4 text-base leading-relaxed text-muted-foreground">
                            La información está fragmentada, los procesos son lentos, y no existe un punto de encuentro digital entre las entidades de rescate y la comunidad.
                        </p>

                        <div class="mt-8 space-y-4">
                            <div class="flex items-start gap-4">
                                <div class="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2D6A4F]/10 dark:bg-[#2D6A4F]/20">
                                    <svg class="h-3.5 w-3.5 text-[#2D6A4F] dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p class="text-sm font-semibold text-foreground">Adopción organizada</p>
                                    <p class="text-sm text-muted-foreground">Procesos transparentes y seguimiento post-adopción.</p>
                                </div>
                            </div>
                            <div class="flex items-start gap-4">
                                <div class="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2D6A4F]/10 dark:bg-[#2D6A4F]/20">
                                    <svg class="h-3.5 w-3.5 text-[#2D6A4F] dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p class="text-sm font-semibold text-foreground">Herramientas para albergues</p>
                                    <p class="text-sm text-muted-foreground">Gestión de adopciones, eventos y seguimiento.</p>
                                </div>
                            </div>
                            <div class="flex items-start gap-4">
                                <div class="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2D6A4F]/10 dark:bg-[#2D6A4F]/20">
                                    <svg class="h-3.5 w-3.5 text-[#2D6A4F] dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p class="text-sm font-semibold text-foreground">Comunidad activa</p>
                                    <p class="text-sm text-muted-foreground">Visibilidad para campañas y eventos de rescate.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="bg-gradient-to-b from-[#2D6A4F]/5 to-transparent py-20 dark:from-[#2D6A4F]/10">
            <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div class="mx-auto max-w-2xl text-center">
                    <span class="inline-flex items-center rounded-full bg-[#2D6A4F]/10 px-3 py-1 text-xs font-semibold text-[#2D6A4F] dark:bg-[#2D6A4F]/20 dark:text-emerald-400">Nuestra misión</span>
                    <h2 class="mt-4 text-3xl font-bold text-foreground">¿Qué buscamos?</h2>
                    <p class="mt-3 text-base leading-relaxed text-muted-foreground">
                        No somos una app más. Buscamos que la adopción deje de ser un acto reactivo y se convierta en un proceso organizado, transparente y humano.
                    </p>
                </div>
                <div class="mt-12 grid gap-6 sm:grid-cols-3">
                    <div
                        v-for="v in values"
                        :key="v.title"
                        class="group rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#2D6A4F]/10 dark:from-[#2D6A4F]/15 dark:to-black/40 dark:border-[#2D6A4F]/30"
                    >
                        <div :class="['mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-2xl transition-transform duration-300 group-hover:scale-110', v.iconBg]">
                            {{ v.icon }}
                        </div>
                        <h3 class="mt-5 text-lg font-bold text-foreground">{{ v.title }}</h3>
                        <p class="mt-3 text-sm leading-relaxed text-muted-foreground">{{ v.desc }}</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="bg-gradient-to-b from-[#2D6A4F]/5 to-transparent py-20 dark:from-[#2D6A4F]/10">
            <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-br from-white to-[#2D6A4F]/4 p-8 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                    <h3 class="text-center text-lg font-bold text-foreground">Nuestra historia</h3>
                    <div class="mt-8 grid gap-6 sm:grid-cols-3">
                        <div v-for="(item, i) in timeline" :key="i" class="relative text-center">
                            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#2D6A4F] text-sm font-bold text-white dark:bg-emerald-500 dark:text-black">
                                {{ item.year }}
                            </div>
                            <div v-if="i < timeline.length - 1" class="absolute left-1/2 top-6 hidden h-px w-full -translate-y-1/2 bg-[#2D6A4F]/20 sm:block dark:bg-[#2D6A4F]/40" />
                            <h4 class="mt-4 font-bold text-foreground">{{ item.title }}</h4>
                            <p class="mt-1 text-sm text-muted-foreground">{{ item.desc }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-20">
            <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div class="mx-auto max-w-2xl text-center">
                    <span class="inline-flex items-center rounded-full bg-[#2D6A4F]/10 px-3 py-1 text-xs font-semibold text-[#2D6A4F] dark:bg-[#2D6A4F]/20 dark:text-emerald-400">El equipo</span>
                    <h2 class="mt-4 text-3xl font-bold text-foreground">Detrás de Wasiyuq</h2>
                    <p class="mt-3 text-base leading-relaxed text-muted-foreground">
                        Esto es un proyecto de código abierto construido con pasión por personas que creen en un mundo mejor para los animales.
                    </p>
                </div>

                <div class="mt-12 flex justify-center">
                    <a
                        :href="creator.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="group w-full max-w-md rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-br from-white to-[#2D6A4F]/4 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#2D6A4F]/10 dark:from-[#2D6A4F]/15 dark:to-black/40 dark:border-[#2D6A4F]/30"
                    >
                        <div class="flex items-center gap-5">
                            <div class="relative shrink-0">
                                <img
                                    :src="creator.avatar"
                                    :alt="creator.name"
                                    class="h-20 w-20 rounded-2xl object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div class="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#2D6A4F] text-[10px] text-white dark:bg-emerald-500 dark:text-black">
                                    🐧
                                </div>
                            </div>
                            <div class="min-w-0">
                                <p class="text-xs font-semibold uppercase tracking-wider text-[#2D6A4F] dark:text-emerald-400">{{ creator.role }}</p>
                                <p class="mt-0.5 text-lg font-bold text-foreground">{{ creator.name }}</p>
                                <p class="text-sm text-muted-foreground">{{ creator.bio }}</p>
                                <div class="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground/70">
                                    <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                    </svg>
                                    {{ creator.username }}
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </section>

        <section class="py-20">
            <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div class="relative overflow-hidden rounded-3xl border border-[#2D6A4F]/20 bg-gradient-to-br from-[#2D6A4F]/10 via-[#2D6A4F]/5 to-[#1B4332]/10 p-10 text-center sm:p-16 dark:border-[#2D6A4F]/40 dark:from-[#2D6A4F]/20 dark:via-[#1a2e24] dark:to-black/60">
                    <div class="pointer-events-none absolute inset-0 -z-10">
                        <div class="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#2D6A4F]/20 blur-3xl dark:bg-[#2D6A4F]/30" />
                        <div class="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />
                    </div>

                    <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2D6A4F]/20 dark:bg-[#2D6A4F]/30">
                        <span class="text-2xl">🤝</span>
                    </div>
                    <h2 class="mt-5 text-3xl font-bold text-foreground">Formá parte</h2>
                    <p class="mx-auto mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
                        Si representás una organización de rescate o querés sumarte como voluntario, contactanos. Entre todos podemos construir un Cusco donde ningún animal esté solo.
                    </p>
                    <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
                        <a
                            href="/contacto"
                            class="inline-flex items-center gap-2 rounded-xl bg-[#2D6A4F] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#2D6A4F]/30 transition hover:bg-[#246142] hover:shadow-xl hover:shadow-[#2D6A4F]/40"
                        >
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Contactanos
                        </a>
                        <a
                            href="/blog"
                            class="inline-flex items-center gap-2 rounded-xl border border-[#2D6A4F]/20 bg-white/80 px-6 py-3 text-sm font-bold text-[#2D6A4F] transition hover:bg-white hover:shadow-md dark:border-[#2D6A4F]/40 dark:bg-black/30 dark:text-emerald-400 dark:hover:bg-black/50"
                        >
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                            Leer el blog
                        </a>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
