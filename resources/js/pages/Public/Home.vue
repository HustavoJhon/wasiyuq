<script setup lang="ts">
defineProps<{
  stats: { adopted: number; organizations: number; pets_available: number }
}>()
</script>

<template>
  <div>
    <section class="relative overflow-hidden bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#40916C]">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      <div class="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div class="mx-auto max-w-3xl text-center">
          <span class="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-green-100 backdrop-blur-sm">Adopción responsable en Cusco</span>
          <h1 class="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">Dale un hogar a quien más lo necesita</h1>
          <p class="mt-6 text-lg leading-relaxed text-green-100/90">Conectamos mascotas en adopción con familias responsables en toda la región del Cusco. Cada animal merece una segunda oportunidad.</p>
          <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="/mascotas" class="w-full rounded-xl bg-white px-8 py-3.5 text-center text-sm font-semibold text-[#1B4332] shadow-lg shadow-black/10 transition hover:bg-green-50 sm:w-auto">Ver mascotas en adopción</a>
            <a href="/contacto" class="w-full rounded-xl border-2 border-white/30 px-8 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto">Registrar mi entidad</a>
          </div>
        </div>
      </div>
      <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>

    <section class="relative -mt-16">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div class="grid divide-y divide-border overflow-hidden rounded-2xl bg-card shadow-xl shadow-black/5 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div class="p-8 text-center">
            <p class="text-4xl font-bold text-[#2D6A4F]">{{ stats.adopted }}</p>
            <p class="mt-1 text-sm text-muted-foreground">Mascotas adoptadas</p>
          </div>
          <div class="p-8 text-center">
            <p class="text-4xl font-bold text-[#2D6A4F]">{{ stats.organizations }}</p>
            <p class="mt-1 text-sm text-muted-foreground">Entidades verificadas</p>
          </div>
          <div class="p-8 text-center">
            <p class="text-4xl font-bold text-[#2D6A4F]">{{ stats.pets_available }}</p>
            <p class="mt-1 text-sm text-muted-foreground">Mascotas disponibles</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 sm:py-28">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">¿Cómo funciona?</h2>
          <p class="mt-4 text-muted-foreground">Tres pasos simples para cambiar una vida</p>
        </div>
        <div class="mt-16 grid gap-8 sm:grid-cols-3">
          <div class="text-center">
            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2D6A4F]/10">
              <svg class="h-8 w-8 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <h3 class="mt-6 text-lg font-semibold text-foreground">Explora</h3>
            <p class="mt-2 text-sm text-muted-foreground">Encuentra a tu compañero ideal entre las mascotas disponibles en Cusco.</p>
          </div>
          <div class="text-center">
            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2D6A4F]/10">
              <svg class="h-8 w-8 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <h3 class="mt-6 text-lg font-semibold text-foreground">Postula</h3>
            <p class="mt-2 text-sm text-muted-foreground">Completa tu perfil y postula a la mascota que robó tu corazón.</p>
          </div>
          <div class="text-center">
            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2D6A4F]/10">
              <svg class="h-8 w-8 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            </div>
            <h3 class="mt-6 text-lg font-semibold text-foreground">Adopta</h3>
            <p class="mt-2 text-sm text-muted-foreground">Recibe seguimiento y acompañamiento durante los primeros 12 meses.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-muted py-20 sm:py-28">
      <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">¿Eres una entidad de protección animal?</h2>
        <p class="mx-auto mt-4 max-w-2xl text-muted-foreground">Registra tu albergue, municipalidad u ONG y comienza a publicar mascotas en adopción. Verificamos tu identidad para generar confianza.</p>
        <a href="/contacto" class="mt-8 inline-block rounded-xl bg-[#2D6A4F] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#2D6A4F]/25 transition hover:bg-[#246142]">Registrar mi entidad</a>
      </div>
    </section>
  </div>
</template>
