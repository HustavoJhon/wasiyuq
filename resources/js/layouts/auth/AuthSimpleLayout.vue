<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import { home } from '@/routes';

defineProps<{
    title?: string;
    description?: string;
}>();
</script>

<template>
    <div class="flex min-h-svh flex-col items-center justify-center bg-gradient-to-br from-[#2D6A4F]/5 via-background to-[#2D6A4F]/10 p-4 md:p-10">
        <div class="w-full max-w-md">
            <div class="rounded-2xl border border-border bg-card p-8 shadow-lg shadow-black/5">
                <div class="flex flex-col items-center gap-4">
                    <Link
                        :href="home()"
                        class="flex flex-col items-center gap-2 font-medium"
                    >
                        <span class="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2D6A4F] text-xl font-bold text-white shadow-md shadow-[#2D6A4F]/20">W</span>
                        <span class="sr-only">{{ title }}</span>
                    </Link>
                    <span class="text-lg font-bold text-foreground">Wasiyuq</span>
                    <div class="space-y-1 text-center">
                        <h1 class="text-lg font-semibold text-foreground">{{ title }}</h1>
                        <p class="text-sm text-muted-foreground">{{ description }}</p>
                    </div>
                </div>
                <div class="mt-6">
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template>
