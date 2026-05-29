<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3'
import { computed, ref } from 'vue'
import Sonner from '@/components/ui/sonner/Sonner.vue'
import { useAppearance } from '@/composables/useAppearance'

const mobileOpen = ref(false)
const { resolvedAppearance, updateAppearance } = useAppearance()

function toggleAppearance() {
  updateAppearance(resolvedAppearance.value === 'dark' ? 'light' : 'dark')
}

const page = usePage()

const pageJsonLd = computed(() => {
  const props = page.props as Record<string, unknown>

  return props.jsonLd as Record<string, unknown> | null ?? null
})

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Wasiyuq',
  url: 'https://wasiyuq.pe',
  description: 'Plataforma de adopción responsable en Cusco, Perú',
  areaServed: { '@type': 'City', name: 'Cusco' },
  address: { '@type': 'PostalAddress', addressLocality: 'Cusco', addressCountry: 'PE' },
  email: 'info@wasiyuq.pe',
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Wasiyuq',
  url: 'https://wasiyuq.pe',
  description: 'Plataforma de adopción responsable en Cusco, Perú',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: 'https://wasiyuq.pe/mascotas?q={search_term_string}' },
    'query-input': 'required name=search_term_string',
  },
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-background">
    <script type="application/ld+json" v-html="JSON.stringify(organizationSchema)"></script>
    <script type="application/ld+json" v-html="JSON.stringify(websiteSchema)"></script>
    <script v-if="pageJsonLd" type="application/ld+json" v-html="JSON.stringify(pageJsonLd)"></script>
    <header class="fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:px-6 lg:px-8">
      <nav class="relative mx-2 w-full max-w-7xl rounded-[36px] border border-[#2D6A4F]/20 bg-white/70 px-4 py-3 shadow-md backdrop-blur-md md:flex md:items-center md:justify-between md:px-6 md:py-0 lg:px-8 xl:mx-auto dark:border-neutral-700/40 dark:bg-neutral-800/60 dark:backdrop-blur-md" aria-label="Global">
        <div class="flex items-center justify-between">
          <a href="/" class="flex items-center gap-2 rounded-lg font-bold ring-zinc-500 outline-hidden focus-visible:ring-3 dark:ring-zinc-200">
            <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2D6A4F] text-sm font-bold text-white">W</span>
            <span class="text-lg font-bold text-foreground">Wasiyuq</span>
          </a>
          <div class="ml-auto flex items-center gap-2 md:hidden">
            <button type="button" @click="mobileOpen = !mobileOpen" class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-muted-foreground transition hover:bg-neutral-200 disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-neutral-700" aria-label="Toggle navigation">
              <svg v-if="!mobileOpen" class="h-[1.25rem] w-[1.25rem] shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
              <svg v-else class="h-[1.25rem] w-[1.25rem] shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        </div>

        <div v-if="mobileOpen" class="mt-5 flex flex-col gap-y-4 pb-4 md:hidden">
          <div class="flex items-center gap-2">
            <a href="https://wa.me/51944480535?text=Hola!%20Necesito%20soporte%20t%C3%A9cnico%20en%20Wasiyuq" target="_blank" class="flex h-8 w-8 items-center justify-center rounded-full text-[#2D6A4F] transition hover:bg-[#2D6A4F]/10" title="Soporte técnico" @click="mobileOpen = false">
              <svg class="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
          </div>
          <a href="/mascotas" class="text-base font-medium text-muted-foreground transition hover:text-[#2D6A4F]" @click="mobileOpen = false">Mascotas</a>
          <a href="/eventos" class="text-base font-medium text-muted-foreground transition hover:text-[#2D6A4F]" @click="mobileOpen = false">Eventos</a>
          <a href="/blog" class="text-base font-medium text-muted-foreground transition hover:text-[#2D6A4F]" @click="mobileOpen = false">Blog</a>
          <a href="/sobre-nosotros" class="text-base font-medium text-muted-foreground transition hover:text-[#2D6A4F]" @click="mobileOpen = false">Sobre Nosotros</a>
          <a href="/contacto" class="text-base font-medium text-muted-foreground transition hover:text-[#2D6A4F]" @click="mobileOpen = false">Contacto</a>
          <hr class="border-border/50">
          <template v-if="$page.props.auth.user">
            <a href="/admin" class="inline-flex items-center justify-center rounded-lg bg-[#2D6A4F] px-4 py-2 text-center text-sm font-medium text-white" @click="mobileOpen = false">Dashboard</a>
            <Link href="/logout" method="post" as="button" class="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-center text-sm font-medium text-muted-foreground" @click="mobileOpen = false">Salir</Link>
          </template>
          <template v-else>
            <a href="/login" class="inline-flex items-center justify-center rounded-lg bg-[#2D6A4F] px-4 py-2 text-center text-sm font-medium text-white" @click="mobileOpen = false">Ingresar</a>
          </template>
          <button @click="toggleAppearance" class="flex h-8 w-8 items-center justify-center rounded-full font-medium text-muted-foreground transition hover:bg-neutral-200 dark:hover:bg-neutral-700 self-start" :title="resolvedAppearance === 'dark' ? 'Modo claro' : 'Modo oscuro'">
            <svg v-if="resolvedAppearance !== 'dark'" class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            <svg v-else class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 8a2 2 0 1 0 4 4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          </button>
        </div>

        <div class="hidden md:flex md:flex-1 md:items-center md:justify-end md:gap-5 lg:gap-8">
          <a href="/mascotas" class="rounded-lg py-3 text-sm font-medium text-muted-foreground transition hover:text-[#2D6A4F]">Mascotas</a>
          <a href="/eventos" class="rounded-lg py-3 text-sm font-medium text-muted-foreground transition hover:text-[#2D6A4F]">Eventos</a>
          <a href="/blog" class="rounded-lg py-3 text-sm font-medium text-muted-foreground transition hover:text-[#2D6A4F]">Blog</a>
          <a href="/sobre-nosotros" class="rounded-lg py-3 text-sm font-medium text-muted-foreground transition hover:text-[#2D6A4F]">Sobre Nosotros</a>
          <a href="/contacto" class="rounded-lg py-3 text-sm font-medium text-muted-foreground transition hover:text-[#2D6A4F]">Contacto</a>
          <a href="https://wa.me/51944480535?text=Hola!%20Necesito%20soporte%20t%C3%A9cnico%20en%20Wasiyuq" target="_blank" class="flex h-8 w-8 items-center justify-center rounded-full text-[#2D6A4F] transition hover:bg-[#2D6A4F]/10" title="Soporte técnico">
            <svg class="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
          <template v-if="$page.props.auth.user">
            <a href="/admin" class="rounded-lg bg-[#2D6A4F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#246142]">Dashboard</a>
            <Link href="/logout" method="post" as="button" class="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent">Salir</Link>
          </template>
          <template v-else>
            <a href="/login" class="rounded-lg bg-[#2D6A4F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#246142]">Ingresar</a>
          </template>
          <button @click="toggleAppearance" class="flex h-8 w-8 items-center justify-center rounded-full font-medium text-muted-foreground transition hover:bg-neutral-200 dark:hover:bg-neutral-700" :title="resolvedAppearance === 'dark' ? 'Modo claro' : 'Modo oscuro'">
            <svg v-if="resolvedAppearance !== 'dark'" class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            <svg v-else class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 8a2 2 0 1 0 4 4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          </button>
        </div>
      </nav>
    </header>

    <main class="flex-1 pt-20">
      <slot />
    </main>

    <footer class="border-t border-border/50 bg-muted/30">
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2D6A4F] text-sm font-bold text-white">W</span>
              <span class="text-lg font-bold text-foreground">Wasiyuq</span>
            </div>
            <p class="mt-3 text-sm text-muted-foreground">Plataforma de adopción responsable en Cusco, Perú.</p>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-foreground">Navegación</h4>
            <ul class="mt-4 space-y-2">
              <li><a href="/mascotas" class="text-sm text-muted-foreground hover:text-[#2D6A4F]">Mascotas</a></li>
              <li><a href="/eventos" class="text-sm text-muted-foreground hover:text-[#2D6A4F]">Eventos</a></li>
              <li><a href="/blog" class="text-sm text-muted-foreground hover:text-[#2D6A4F]">Blog</a></li>
              <li><a href="/sobre-nosotros" class="text-sm text-muted-foreground hover:text-[#2D6A4F]">Sobre Nosotros</a></li>
              <li><a href="/contacto" class="text-sm text-muted-foreground hover:text-[#2D6A4F]">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-foreground">Para entidades</h4>
            <ul class="mt-4 space-y-2">
              <li><a href="/contacto" class="text-sm text-muted-foreground hover:text-[#2D6A4F]">Registrar entidad</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-foreground">Contacto</h4>
            <ul class="mt-4 space-y-2">
              <li class="text-sm text-muted-foreground">Cusco, Perú</li>
              <li><a href="mailto:info@wasiyuq.pe" class="text-sm text-muted-foreground hover:text-[#2D6A4F]">info@wasiyuq.pe</a></li>
            </ul>
          </div>
        </div>
        <div class="mt-8 border-t border-border/50 pt-8 text-center text-sm text-muted-foreground/70">
          <p>&copy; {{ new Date().getFullYear() }} Wasiyuq. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>

    <Sonner />
  </div>
</template>
