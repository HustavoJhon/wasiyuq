<script setup lang="ts">
const heroImages = [
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1200&q=80',
    'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&q=80',
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
    </div>
</template>
