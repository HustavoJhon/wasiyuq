<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3'
import { computed, ref } from 'vue'
import Sonner from '@/components/ui/sonner/Sonner.vue'

const mobileOpen = ref(false)

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
    <header class="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-sm">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="/" class="flex items-center gap-2">
          <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2D6A4F] text-sm font-bold text-white">W</span>
          <span class="text-lg font-bold text-foreground">Wasiyuq</span>
        </a>
        <nav class="hidden items-center gap-8 md:flex">
          <a href="/mascotas" class="text-sm font-medium text-muted-foreground transition hover:text-[#2D6A4F]">Mascotas</a>
          <a href="/eventos" class="text-sm font-medium text-muted-foreground transition hover:text-[#2D6A4F]">Eventos</a>
          <a href="/blog" class="text-sm font-medium text-muted-foreground transition hover:text-[#2D6A4F]">Blog</a>
          <a href="/sobre-nosotros" class="text-sm font-medium text-muted-foreground transition hover:text-[#2D6A4F]">Sobre Nosotros</a>
          <a href="/contacto" class="text-sm font-medium text-muted-foreground transition hover:text-[#2D6A4F]">Contacto</a>
        </nav>
        <div class="hidden items-center gap-3 md:flex">
          <template v-if="$page.props.auth.user">
            <a href="/admin" class="rounded-lg bg-[#2D6A4F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#246142]">Dashboard</a>
            <Link href="/logout" method="post" as="button" class="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent">Salir</Link>
          </template>
          <template v-else>
            <a href="/login" class="rounded-lg border border-[#2D6A4F] px-4 py-2 text-sm font-medium text-[#2D6A4F] transition hover:bg-[#2D6A4F]/5">Ingresar</a>
            <a href="/register" class="rounded-lg bg-[#2D6A4F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#246142]">Registrarse</a>
          </template>
        </div>
        <button class="md:hidden" @click="mobileOpen = !mobileOpen">
          <svg class="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div v-if="mobileOpen" class="border-t border-border/50 bg-background px-4 pb-4 pt-2 md:hidden">
        <nav class="flex flex-col gap-3">
          <a href="/mascotas" class="text-sm font-medium text-muted-foreground" @click="mobileOpen = false">Mascotas</a>
          <a href="/eventos" class="text-sm font-medium text-muted-foreground" @click="mobileOpen = false">Eventos</a>
          <a href="/blog" class="text-sm font-medium text-muted-foreground" @click="mobileOpen = false">Blog</a>
          <a href="/sobre-nosotros" class="text-sm font-medium text-muted-foreground" @click="mobileOpen = false">Sobre Nosotros</a>
          <a href="/contacto" class="text-sm font-medium text-muted-foreground" @click="mobileOpen = false">Contacto</a>
          <hr class="my-1 border-border/50">
          <template v-if="$page.props.auth.user">
            <a href="/admin" class="rounded-lg bg-[#2D6A4F] px-4 py-2 text-center text-sm font-medium text-white">Dashboard</a>
            <Link href="/logout" method="post" as="button" class="rounded-lg border border-border px-4 py-2 text-center text-sm font-medium text-muted-foreground">Salir</Link>
          </template>
          <template v-else>
            <a href="/login" class="rounded-lg border border-[#2D6A4F] px-4 py-2 text-center text-sm font-medium text-[#2D6A4F]">Ingresar</a>
            <a href="/register" class="rounded-lg bg-[#2D6A4F] px-4 py-2 text-center text-sm font-medium text-white">Registrarse</a>
          </template>
        </nav>
      </div>
    </header>

    <main class="flex-1">
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
