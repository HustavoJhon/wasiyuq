<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  stats: { adopted: number; organizations: number; pets_available: number }
  species: Record<string, number>
}>()

const faqOpen = ref<number | null>(null)

const speciesInfo: { key: string; emoji: string; label: string }[] = [
  { key: 'dog', emoji: '🐕', label: 'Perros' },
  { key: 'cat', emoji: '🐱', label: 'Gatos' },
  { key: 'rabbit', emoji: '🐰', label: 'Conejos' },
  { key: 'bird', emoji: '🐦', label: 'Aves' },
  { key: 'other', emoji: '🐾', label: 'Otros' },
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#40916C]">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      <div class="relative mx-auto max-w-7xl px-4 py-12 sm:py-20 lg:px-8">
        <div class="grid items-center gap-8 sm:gap-12 lg:grid-cols-2">
          <div>
            <div class="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-green-100 backdrop-blur-sm">
              <span>🐾</span>
              <span>Adopción responsable en Cusco</span>
            </div>
            <h1 class="mb-6 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Dale un hogar a quien más lo necesita
            </h1>
            <p class="mb-8 max-w-xl text-base text-green-100/90 sm:text-lg md:text-xl">
              Conectamos mascotas en adopción con familias responsables en toda la región del Cusco. Cada animal merece una segunda oportunidad. ❤️
            </p>
            <div class="mb-8 flex flex-col gap-3 sm:flex-row">
              <div class="relative flex-1">
                <svg class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input type="text" placeholder="Busca por raza, ubicación..." class="w-full rounded-xl border-0 bg-white/15 py-3 pl-12 pr-4 text-sm text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30">
              </div>
              <a href="/mascotas" class="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#1B4332] shadow-lg shadow-black/10 transition hover:bg-green-50">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                Buscar
              </a>
            </div>
            <div class="mb-6 flex flex-wrap gap-2">
              <span class="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-sm text-white backdrop-blur-sm">🐕 Perros</span>
              <span class="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-sm text-white backdrop-blur-sm">🐱 Gatos</span>
              <span class="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-sm text-white backdrop-blur-sm">🐰 Conejos</span>
              <span class="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-sm text-white backdrop-blur-sm">🐦 Aves</span>
            </div>
            <div class="flex flex-wrap gap-6 sm:gap-8">
              <div>
                <p class="text-2xl font-bold text-white sm:text-3xl">{{ stats.adopted }}+</p>
                <p class="text-sm text-green-100/70">Mascotas adoptadas</p>
              </div>
              <div>
                <p class="text-2xl font-bold text-white sm:text-3xl">{{ stats.organizations }}+</p>
                <p class="text-sm text-green-100/70">Entidades verificadas</p>
              </div>
              <div>
                <p class="text-2xl font-bold text-white sm:text-3xl">{{ stats.pets_available }}+</p>
                <p class="text-sm text-green-100/70">Mascotas disponibles</p>
              </div>
            </div>
          </div>
          <div class="relative hidden lg:block">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-4">
                <div class="overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm">
                  <div class="aspect-[4/3] bg-gradient-to-br from-[#40916C] to-[#2D6A4F] flex items-center justify-center text-6xl">🐕</div>
                  <div class="p-4">
                    <h3 class="font-bold text-white">Max</h3>
                    <p class="text-sm text-green-100/70">Golden Retriever • 2 años</p>
                  </div>
                </div>
                <div class="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <div class="flex items-center gap-3">
                    <div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#40916C]/50 text-xl">🏠</div>
                    <div>
                      <p class="font-bold text-white">50+ Mascotas</p>
                      <p class="text-sm text-green-100/70">Cerca de ti</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="space-y-4 pt-8">
                <div class="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <div class="flex items-center gap-3">
                    <div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#40916C]/50 text-xl">❤️</div>
                    <div>
                      <p class="font-bold text-white">¡Match!</p>
                      <p class="text-sm text-green-100/70">Encuentra tu compañero</p>
                    </div>
                  </div>
                </div>
                <div class="overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm">
                  <div class="aspect-[4/3] bg-gradient-to-br from-[#52B788] to-[#40916C] flex items-center justify-center text-6xl">🐱</div>
                  <div class="p-4">
                    <h3 class="font-bold text-white">Luna</h3>
                    <p class="text-sm text-green-100/70">Gato Atigrado • 1 año</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>

    <!-- Species -->
    <section class="py-20 sm:py-28">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-10 text-center sm:mb-16">
          <div class="mb-4 inline-flex items-center gap-2 rounded-full bg-[#2D6A4F]/10 px-4 py-1.5 text-xs font-medium text-[#2D6A4F]">
            <span>🏠</span>
            <span>Mascotas en adopción</span>
          </div>
          <h2 class="mb-4 text-2xl font-bold text-foreground sm:text-3xl md:text-4xl lg:text-5xl">Mascotas <span class="text-[#2D6A4F]">disponibles</span></h2>
          <p class="mx-auto max-w-2xl text-lg text-muted-foreground">Conoce cuántos animalitos de cada especie están esperando un hogar.</p>
        </div>
        <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <div v-for="s in speciesInfo" :key="s.key" class="rounded-2xl border border-border bg-card p-6 text-center transition hover:shadow-md hover:shadow-black/5">
            <div class="mb-3 text-4xl">{{ s.emoji }}</div>
            <h3 class="mb-1 text-sm font-bold text-foreground">{{ s.label }}</h3>
            <span class="inline-flex items-center rounded-full bg-[#2D6A4F]/10 px-3 py-1 text-xs font-medium text-[#2D6A4F]">{{ species[s.key] ?? 0 }} mascotas</span>
          </div>
        </div>
        <div class="mx-auto mt-10 max-w-2xl rounded-2xl border border-border bg-card p-6 text-center sm:mt-16 sm:p-12">
          <h3 class="mb-4 text-2xl font-bold text-foreground md:text-3xl">¿Eres un albergue o refugio?</h3>
          <p class="mx-auto mb-6 max-w-xl text-muted-foreground">Únete a nuestra red y ayuda a más mascotas a encontrar un hogar. Brindamos herramientas gratuitas y visibilidad para miles de adoptantes.</p>
          <a href="/contacto" class="inline-block rounded-xl bg-[#2D6A4F] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#2D6A4F]/25 transition hover:bg-[#246142]">Registrar mi entidad</a>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="bg-muted/30 py-20 sm:py-28">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-10 text-center sm:mb-16">
          <div class="mb-4 inline-flex items-center gap-2 rounded-full bg-[#2D6A4F]/10 px-4 py-1.5 text-xs font-medium text-[#2D6A4F]">
            <span>✅</span>
            <span>¿Por qué Wasiyuq?</span>
          </div>
          <h2 class="mb-4 text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">Beneficios de adoptar con <span class="text-[#2D6A4F]">Wasiyuq</span></h2>
          <p class="mx-auto max-w-2xl text-lg text-muted-foreground">Hacemos que la adopción responsable sea sencilla, segura y transparente para todos.</p>
        </div>
        <div class="grid gap-8 lg:grid-cols-3 lg:gap-12">
          <div class="lg:col-span-1">
            <h2 class="text-2xl font-bold text-balance text-foreground md:text-3xl">
              Una plataforma pensada para ellos
            </h2>
            <p class="mt-2 text-pretty text-muted-foreground md:mt-4">
              Cada funcionalidad de Wasiyuq está diseñada para conectar mascotas con familias responsables de manera ética y eficiente.
            </p>
          </div>
          <div class="lg:col-span-2">
            <div class="grid gap-8 sm:grid-cols-2 md:gap-12">
              <div class="flex gap-x-5">
                <svg class="mt-1 h-8 w-8 shrink-0 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
                <div class="grow">
                  <h3 class="text-balance text-lg font-bold text-foreground">Entidades Verificadas</h3>
                  <p class="mt-1 text-pretty text-muted-foreground">Todos los albergues, municipalidades y ONGs son verificados para garantizar adopciones seguras y responsables.</p>
                </div>
              </div>
              <div class="flex gap-x-5">
                <svg class="mt-1 h-8 w-8 shrink-0 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
                <div class="grow">
                  <h3 class="text-balance text-lg font-bold text-foreground">Acompañamiento Continuo</h3>
                  <p class="mt-1 text-pretty text-muted-foreground">Seguimiento durante los primeros 12 meses para asegurar el bienestar de la mascota y su nueva familia.</p>
                </div>
              </div>
              <div class="flex gap-x-5">
                <svg class="mt-1 h-8 w-8 shrink-0 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                </svg>
                <div class="grow">
                  <h3 class="text-balance text-lg font-bold text-foreground">Proceso Simple</h3>
                  <p class="mt-1 text-pretty text-muted-foreground">Postula desde cualquier dispositivo, completa tu perfil y recibe notificaciones en tiempo real sobre tu solicitud.</p>
                </div>
              </div>
              <div class="flex gap-x-5">
                <svg class="mt-1 h-8 w-8 shrink-0 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 0 4.5 6h.75m13.5 0h.75a.75.75 0 0 0 .75-.75V4.5M21 12.75a60.07 60.07 0 0 0-15.797-2.101c-.727-.198-1.453.342-1.453 1.096V18.75" />
                </svg>
                <div class="grow">
                  <h3 class="text-balance text-lg font-bold text-foreground">Visibilidad Regional</h3>
                  <p class="mt-1 text-pretty text-muted-foreground">Llega a adoptantes en toda la región del Cusco. Las mascotas publicadas son vistas por cientos de familias cada día.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
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

    <!-- Stats + testimonial -->
    <section class="bg-muted/30 py-20 sm:py-28">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-12 lg:items-center lg:justify-between lg:gap-16">
          <div class="lg:col-span-5 lg:col-start-1">
            <div class="mb-8">
              <h2 class="mb-2 text-3xl font-bold text-foreground lg:text-4xl">Impacto en Cusco</h2>
              <p class="text-muted-foreground">Gracias a nuestra comunidad, cada día más mascotas encuentran un hogar.</p>
            </div>
            <blockquote class="relative">
              <svg class="absolute start-0 top-0 h-12 w-12 -translate-x-4 -translate-y-6 text-[#2D6A4F]/20" fill="currentColor" viewBox="0 0 16 16"><path d="M7.39762 10.3C7.39762 11.0733 7.14888 11.7 6.6514 12.18 6.15392 12.6333 5.52552 12.86 4.76621 12.86 3.84979 12.86 3.09047 12.5533 2.48825 11.94 1.91222 11.3266 1.62421 10.4467 1.62421 9.29999c0-1.22667.34038-2.42667 1.02114-3.6.70696-1.2 1.68883-2.14667 2.94563-2.84l.90332 1.4c-.68076.48-1.23061 1.01333-1.64954 1.6-.39275.58667-.65459 1.26667-.7855 2.04.23565-.10667.51057-.16.82477-.16.73313 0 1.33535.24 1.80664.72.4713.48.70695 1.09333.70695 1.84ZM14.6242 10.3c0 .77333-.2487 1.4-.7462 1.88-.49747.45333-1.12587.68-1.88518.68-.91642 0-1.67574-.30667-2.27796-.92-.57603-.61333-.86405-1.49333-.86405-2.64 0-1.22667.34038-2.42667 1.02114-3.6.70697-1.2 1.68884-2.14667 2.94564-2.84l.90331 1.4c-.68075.48-1.2306 1.01333-1.64953 1.6-.39275.58667-.65459 1.26667-.7855 2.04.23565-.10667.51057-.16.82477-.16.73313 0 1.33535.24 1.80664.72.4713.48.70695 1.09333.70695 1.84Z"/></svg>
              <div class="relative z-10">
                <p class="text-xl text-foreground italic">"Wasiyuq nos permitió encontrar un hogar para más de 50 perritos en solo tres meses. La plataforma es muy fácil de usar y el equipo de soporte siempre está disponible."</p>
              </div>
              <div class="mt-6">
                <div class="flex items-center">
                  <div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#2D6A4F] text-sm font-bold text-white">M</div>
                  <div class="ms-4 grow">
                    <div class="font-bold text-foreground">María García</div>
                    <div class="text-xs text-muted-foreground">Fundadora | Patitas Cusco</div>
                  </div>
                </div>
              </div>
            </blockquote>
          </div>
          <div class="mt-10 lg:col-span-6 lg:col-end-13 lg:mt-0">
            <ul class="grid grid-cols-2 divide-x-2 divide-y-2 divide-border overflow-hidden rounded-2xl border border-border">
              <li class="flex flex-col p-6 sm:p-8">
                <div class="mb-2 text-3xl font-bold text-foreground sm:text-5xl">{{ stats.adopted }}+</div>
                <p class="text-sm text-muted-foreground">mascotas adoptadas con éxito</p>
              </li>
              <li class="flex flex-col p-6 sm:p-8">
                <div class="mb-2 text-3xl font-bold text-foreground sm:text-5xl">{{ stats.organizations }}+</div>
                <p class="text-sm text-muted-foreground">entidades verificadas en la red</p>
              </li>
              <li class="flex flex-col p-6 sm:p-8">
                <div class="mb-2 text-3xl font-bold text-foreground sm:text-5xl">{{ stats.pets_available }}+</div>
                <p class="text-sm text-muted-foreground">mascotas esperando un hogar</p>
              </li>
              <li class="flex flex-col p-6 sm:p-8">
                <div class="mb-2 text-3xl font-bold text-foreground sm:text-5xl">100%</div>
                <p class="text-sm text-muted-foreground">seguimiento post-adopción</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="py-20 sm:py-28">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid gap-10 md:grid-cols-5">
          <div class="md:col-span-2">
            <div class="max-w-xs">
              <h2 class="text-2xl font-bold text-foreground md:text-4xl md:leading-tight">Preguntas<br>frecuentes</h2>
              <p class="mt-1 hidden text-muted-foreground md:block">Resolvemos tus dudas sobre el proceso de adopción responsable.</p>
            </div>
          </div>
          <div class="md:col-span-3">
            <div class="divide-y divide-border">
              <div class="pb-3">
                <button @click="faqOpen = faqOpen === 1 ? null : 1" class="group inline-flex w-full items-center justify-between gap-x-3 rounded-lg pb-3 text-start font-bold text-balance text-foreground transition hover:text-muted-foreground md:text-lg" aria-expanded="false">
                  ¿Cuáles son los requisitos para adoptar?
                  <svg class="block h-5 w-5 shrink-0 text-muted-foreground" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                <div v-if="faqOpen === 1" class="pb-3 text-pretty text-muted-foreground">
                  Debes ser mayor de edad, contar con un documento de identidad vigente, demostrar que tienes un espacio adecuado para la mascota y firmar un compromiso de adopción responsable. Cada entidad puede solicitar requisitos adicionales.
                </div>
              </div>
              <div class="pt-6 pb-3">
                <button @click="faqOpen = faqOpen === 2 ? null : 2" class="group inline-flex w-full items-center justify-between gap-x-3 rounded-lg pb-3 text-start font-bold text-balance text-foreground transition hover:text-muted-foreground md:text-lg" aria-expanded="false">
                  ¿La plataforma tiene algún costo?
                  <svg class="block h-5 w-5 shrink-0 text-muted-foreground" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                <div v-if="faqOpen === 2" class="pb-3 text-pretty text-muted-foreground">
                  Wasiyuq es completamente gratuito para adoptantes. Las entidades registradas pueden publicar mascotas sin costo alguno. No creemos en lucrar con la adopción de animales.
                </div>
              </div>
              <div class="pt-6 pb-3">
                <button @click="faqOpen = faqOpen === 3 ? null : 3" class="group inline-flex w-full items-center justify-between gap-x-3 rounded-lg pb-3 text-start font-bold text-balance text-foreground transition hover:text-muted-foreground md:text-lg" aria-expanded="false">
                  ¿Cómo sé que una entidad es confiable?
                  <svg class="block h-5 w-5 shrink-0 text-muted-foreground" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                <div v-if="faqOpen === 3" class="pb-3 text-pretty text-muted-foreground">
                  Todas las entidades en Wasiyuq pasan por un proceso de verificación. Revisamos documentos, realizamos visitas de campo y validamos su trayectoria antes de aprobarlas. Cada entidad verificada muestra un distintivo en su perfil.
                </div>
              </div>
              <div class="pt-6 pb-3">
                <button @click="faqOpen = faqOpen === 4 ? null : 4" class="group inline-flex w-full items-center justify-between gap-x-3 rounded-lg pb-3 text-start font-bold text-balance text-foreground transition hover:text-muted-foreground md:text-lg" aria-expanded="false">
                  ¿Qué pasa si la adopción no funciona?
                  <svg class="block h-5 w-5 shrink-0 text-muted-foreground" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                <div v-if="faqOpen === 4" class="pb-3 text-pretty text-muted-foreground">
                  Wasiyuq realiza un seguimiento durante los primeros 12 meses. Si surgen problemas, nuestro equipo de soporte te guiará para encontrar la mejor solución. Siempre priorizamos el bienestar de la mascota.
                </div>
              </div>
              <div class="pt-6 pb-3">
                <button @click="faqOpen = faqOpen === 5 ? null : 5" class="group inline-flex w-full items-center justify-between gap-x-3 rounded-lg pb-3 text-start font-bold text-balance text-foreground transition hover:text-muted-foreground md:text-lg" aria-expanded="false">
                  ¿Puedo adoptar si vivo fuera de Cusco?
                  <svg class="block h-5 w-5 shrink-0 text-muted-foreground" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                <div v-if="faqOpen === 5" class="pb-3 text-pretty text-muted-foreground">
                  Sí, siempre que puedas trasladarte a Cusco para conocer a la mascota y completar el proceso. Algunas entidades pueden requerir visitas de seguimiento, por lo que es importante coordinar con ellas previamente.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-[#1B4332] py-20 sm:py-28">
      <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">Únete a la manada</h2>
        <p class="mx-auto mt-4 max-w-2xl text-green-100/80">Registra tu albergue, municipalidad u ONG y comienza a publicar mascotas en adopción. Verificamos tu identidad para generar confianza.</p>
        <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="/contacto" class="inline-block rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-[#1B4332] shadow-lg transition hover:bg-green-50">Registrar mi entidad</a>
          <a href="/mascotas" class="inline-block rounded-xl border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">Ver mascotas</a>
        </div>
      </div>
    </section>
  </div>
</template>
