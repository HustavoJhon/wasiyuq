<script setup lang="ts">
import { Link } from '@inertiajs/vue3'

defineProps<{
  message?: string
}>()
</script>

<template>
  <div class="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
    <span class="text-8xl font-bold text-[#2D6A4F]/20">403</span>
    <h1 class="-mt-4 text-2xl font-bold text-foreground">Acceso denegado</h1>
    <p class="mt-2 text-sm text-muted-foreground">
      {{ message ?? 'No tienes permisos para acceder a esta página.' }}
    </p>
    <div class="mt-8 flex gap-4">
      <Link href="/" class="rounded-lg bg-[#2D6A4F] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#246142]">
        Ir al inicio
      </Link>
      <Link href="/mascotas" class="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-accent">
        Ver mascotas
      </Link>
    </div>
  </div>
</template>
