<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { home } from '@/routes';
import AppLogoIcon from '@/components/AppLogoIcon.vue';

const page = usePage();
const name = page.props.name;

defineProps<{
    title?: string;
    description?: string;
}>();
</script>

<template>
    <div
        class="relative grid min-h-dvh flex-col lg:max-w-none lg:grid-cols-2 lg:px-0"
    >
        <div
            class="relative hidden flex-col items-center justify-center bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#40916C] p-12 lg:flex"
        >
            <div
                class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"
            />
            <div class="relative z-10 max-w-md text-center">
                <Link :href="home()" class="inline-flex">
                    <span
                        class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-white shadow-lg backdrop-blur-sm"
                        ><AppLogoIcon class="h-8 w-8" /></span
                    >
                </Link>
                <h2 class="mt-6 text-3xl font-bold text-white">{{ name }}</h2>
                <p class="mt-3 text-base leading-relaxed text-green-100/80">
                    Plataforma de adopción responsable en Cusco, Perú.
                    Conectamos mascotas con familias que les darán un hogar
                    lleno de amor. 🐾
                </p>
                <div class="mt-8 grid grid-cols-3 gap-4">
                    <div class="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                        <div class="text-2xl">🐕</div>
                        <p class="mt-1 text-xs text-green-100/70">Perros</p>
                    </div>
                    <div class="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                        <div class="text-2xl">🐱</div>
                        <p class="mt-1 text-xs text-green-100/70">Gatos</p>
                    </div>
                    <div class="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                        <div class="text-2xl">🐾</div>
                        <p class="mt-1 text-xs text-green-100/70">Otros</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex items-center justify-center p-6 lg:p-12">
            <div class="mx-auto flex w-full max-w-xs flex-col justify-center">
                <div class="flex flex-col space-y-2 text-center">
                    <h1
                        class="text-xl font-semibold text-foreground"
                        v-if="title"
                    >
                        {{ title }}
                    </h1>
                    <p class="text-sm text-muted-foreground" v-if="description">
                        {{ description }}
                    </p>
                </div>
                <div class="mt-6">
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template>
