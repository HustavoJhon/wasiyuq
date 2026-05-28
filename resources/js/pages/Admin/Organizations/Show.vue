<script setup lang="ts">
interface Pet {
  id: number
  name: string
  slug: string
  species: string
  status: string
  created_at: string
}

interface Organization {
  id: number
  name: string
  slug: string
  bio: string | null
  logo: string | null
  website: string | null
  phone: string | null
  city: string | null
  state: string | null
  pets_count: number
  adoptions_count: number
  announcements_count: number
  blog_posts_count: number
  pets: Pet[]
}

defineProps<{ organization: Organization }>()

function statusLabel(s: string): string {
  const labels: Record<string, string> = { available: 'Disponible', adopted: 'Adoptado', in_process: 'En Proceso', withheld: 'Reservado' }
  return labels[s] ?? s
}

function formatDate(d: string): string {
  return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d))
}
</script>

<template>
  <div>
    <a href="/admin/organizaciones" class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-[#2D6A4F]">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      Volver a organizaciones
    </a>

    <div class="mt-4">
      <h1 class="text-2xl font-bold text-foreground">{{ organization.name }}</h1>
      <p v-if="organization.city" class="mt-1 text-sm text-muted-foreground">{{ organization.city }}{{ organization.state ? ', ' + organization.state : '' }}</p>
    </div>

    <div v-if="organization.bio" class="mt-4 text-sm text-muted-foreground">{{ organization.bio }}</div>

    <div v-if="organization.phone || organization.website" class="mt-4 flex gap-6 text-sm text-muted-foreground">
      <span v-if="organization.phone">📞 {{ organization.phone }}</span>
      <a v-if="organization.website" :href="organization.website" target="_blank" class="text-[#2D6A4F] hover:underline">🌐 {{ organization.website }}</a>
    </div>

    <div class="mt-6 grid grid-cols-4 gap-4">
      <div class="rounded-lg border border-border bg-muted p-4 text-center">
        <p class="text-2xl font-bold text-card-foreground">{{ organization.pets_count }}</p>
        <p class="text-xs text-muted-foreground">Mascotas</p>
      </div>
      <div class="rounded-lg border border-border bg-muted p-4 text-center">
        <p class="text-2xl font-bold text-card-foreground">{{ organization.adoptions_count }}</p>
        <p class="text-xs text-muted-foreground">Adopciones</p>
      </div>
      <div class="rounded-lg border border-border bg-muted p-4 text-center">
        <p class="text-2xl font-bold text-card-foreground">{{ organization.announcements_count }}</p>
        <p class="text-xs text-muted-foreground">Eventos</p>
      </div>
      <div class="rounded-lg border border-border bg-muted p-4 text-center">
        <p class="text-2xl font-bold text-card-foreground">{{ organization.blog_posts_count }}</p>
        <p class="text-xs text-muted-foreground">Artículos</p>
      </div>
    </div>

    <div class="mt-8">
      <h2 class="text-lg font-semibold text-foreground">Mascotas (últimas 10)</h2>
      <div v-if="organization.pets.length === 0" class="mt-3 text-sm text-muted-foreground/70">Sin mascotas registradas.</div>
      <div v-else class="mt-3 space-y-2">
        <div v-for="pet in organization.pets" :key="pet.id" class="flex items-center justify-between rounded-lg border border-border/50 px-4 py-3">
          <div>
            <p class="text-sm font-medium text-card-foreground">{{ pet.name }}</p>
            <p class="text-xs text-muted-foreground">{{ pet.species }}</p>
          </div>
          <div class="text-right">
            <span class="rounded-full bg-muted px-3 py-0.5 text-xs font-medium" :class="pet.status === 'available' ? 'text-green-700 bg-green-100' : 'text-gray-600'">{{ statusLabel(pet.status) }}</span>
            <p class="mt-0.5 text-xs text-muted-foreground/70">{{ formatDate(pet.created_at) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
