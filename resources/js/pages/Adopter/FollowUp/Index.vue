<script setup lang="ts">
interface FollowUp {
  id: number
  scheduled_date: string
  completed_date: string | null
  status: string
  notes: string | null
  adoption: {
    id: number
    pet: { id: number; name: string; slug: string; species: string; photos: string[] | null }
    team: { id: number; name: string; slug: string }
  }
}

defineProps<{
  followUps: FollowUp[]
}>()

function statusClass(status: string): string {
  const map: Record<string, string> = { pending: 'bg-amber-100 text-amber-700', completed: 'bg-green-100 text-green-700', missed: 'bg-red-100 text-red-700' }
  return map[status] ?? 'bg-gray-100 text-gray-600'
}

function statusLabel(s: string): string {
  const labels: Record<string, string> = { pending: 'Pendiente', completed: 'Completado', missed: 'No Realizado' }
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
        <h1 class="text-2xl font-bold text-foreground">Mi Seguimiento</h1>
        <p class="mt-1 text-sm text-muted-foreground">Historial de seguimiento post-adopción.</p>
      </div>
      <a href="/mi-adopcion/postulaciones" class="rounded-lg bg-[#2D6A4F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#246142]">Mis postulaciones</a>
    </div>

    <div v-if="followUps.length === 0" class="mt-12 text-center">
      <p class="text-muted-foreground/70">No tienes seguimientos pendientes.</p>
    </div>

    <div v-else class="mt-8 space-y-6">
      <div v-for="fu in followUps" :key="fu.id" class="overflow-hidden rounded-xl border border-border bg-card">
        <div class="flex items-start gap-4 p-5">
          <div v-if="fu.adoption.pet.photos && fu.adoption.pet.photos.length > 0" class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
            <img :src="'/storage/' + fu.adoption.pet.photos[0]" :alt="fu.adoption.pet.name" class="h-full w-full object-cover" />
          </div>
          <div v-else class="h-20 w-20 flex-shrink-0 rounded-xl bg-muted" />

          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-lg font-semibold text-card-foreground">{{ fu.adoption.pet.name }}</h3>
                <p class="text-sm text-muted-foreground">{{ speciesLabel(fu.adoption.pet.species) }} — {{ fu.adoption.team.name }}</p>
              </div>
              <span class="flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium" :class="statusClass(fu.status)">{{ statusLabel(fu.status) }}</span>
            </div>
            <p class="mt-2 text-sm text-muted-foreground">{{ fu.notes }}</p>
            <div class="mt-2 flex items-center justify-between">
              <p class="text-xs text-muted-foreground/70">Programado: {{ formatDate(fu.scheduled_date) }}</p>
              <a v-if="fu.status === 'pending'" :href="'/mi-adopcion/seguimientos/' + fu.id" class="text-sm text-[#2D6A4F] hover:underline">Reportar</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
