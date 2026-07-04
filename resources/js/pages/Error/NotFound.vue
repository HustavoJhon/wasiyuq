<script setup lang="ts">
import { PawPrint, Home, Search } from 'lucide-vue-next';
</script>

<template>
    <div class="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4">
        <div class="max-w-md text-center">
            <div class="mb-6 flex justify-center">
                <div class="relative">
                    <div class="flex h-28 w-28 items-center justify-center rounded-full bg-muted">
                        <PawPrint class="h-14 w-14 text-muted-foreground/30" />
                    </div>
                    <span class="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#2D6A4F] to-[#40916C] text-sm font-bold text-white shadow-lg shadow-[#2D6A4F]/20">!</span>
                </div>
            </div>

            <h1 class="text-6xl font-bold text-foreground">404</h1>
            <p class="mt-3 text-lg font-semibold text-foreground">Página no encontrada</p>
            <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
                La página que buscás no existe, fue movida o la mascota se la llevó.
            </p>

            <div class="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <a href="/" class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2D6A4F] to-[#40916C] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-[#2D6A4F]/20 transition hover:from-[#246142] hover:to-[#347D5A]">
                    <Home class="h-4 w-4" />
                    Volver al inicio
                </a>
                <a href="/mascotas" class="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
                    <Search class="h-4 w-4" />
                    Buscar mascotas
                </a>
            </div>
        </div>
    </div>
</template>
