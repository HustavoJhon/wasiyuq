<script setup lang="ts">
interface Application {
  id: number
  status: string
  motivation: string
  created_at: string
  pet: { id: number; name: string; slug: string; species: string; photos: string[] | null }
}

defineProps<{ applications: Application[] }>()

function statusClass(status: string): string {
  const map: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-blue-100 text-blue-700',
    rejected: 'bg-red-100 text-red-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-gray-100 text-gray-500',
  }

  return map[status] ?? 'bg-gray-100 text-gray-600'
}

function statusLabel(s: string): string {
  const labels: Record<string, string> = {
    pending: 'Pendiente', approved: 'Aprobada', rejected: 'Rechazada',
    completed: 'Completada', cancelled: 'Cancelada',
  }

  return labels[s] ?? s
}

function speciesLabel(s: string): string {
  const labels: Record<string, string> = { dog: 'Perro', cat: 'Gato', other: 'Otro' }

  return labels[s] ?? s
}

function formatDate(d: string): string {
  return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d))
}
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Mis Postulaciones</h1>
        <p class="mt-1 text-sm text-muted-foreground">Seguimiento de tus solicitudes de adopción.</p>
      </div>
      <a href="/mascotas" class="rounded-lg bg-[#2D6A4F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#246142]">Ver mascotas</a>
    </div>

    <div v-if="applications.length === 0" class="mt-12 text-center">
      <p class="text-muted-foreground/70">No has enviado ninguna postulación aún.</p>
    </div>

    <div v-else class="mt-8 space-y-4">
      <div v-for="app in applications" :key="app.id" class="overflow-hidden rounded-xl border border-border bg-card">
        <div class="flex items-start gap-4 p-5">
          <div v-if="app.pet.photos && app.pet.photos.length > 0" class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
            <img :src="'/storage/' + app.pet.photos[0]" :alt="app.pet.name" class="h-full w-full object-cover" />
          </div>
          <div v-else class="h-20 w-20 flex-shrink-0 rounded-xl bg-muted" />

          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-lg font-semibold text-card-foreground">{{ app.pet.name }}</h3>
                <p class="text-sm text-muted-foreground">{{ speciesLabel(app.pet.species) }}</p>
              </div>
              <span class="flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium" :class="statusClass(app.status)">{{ statusLabel(app.status) }}</span>
            </div>
            <p class="mt-2 text-sm text-muted-foreground line-clamp-2">{{ app.motivation }}</p>
            <p class="mt-2 text-xs text-muted-foreground/70">Enviada el {{ formatDate(app.created_at) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
