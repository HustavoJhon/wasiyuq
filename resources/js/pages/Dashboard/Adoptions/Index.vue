<script setup lang="ts">
import { router } from '@inertiajs/vue3'
import type { Team } from '@/types'

interface Adoption {
  id: number
  status: string
  created_at: string
  pet: { id: number; name: string; slug: string; species: string; photos: string[] | null }
  adopter: { id: number; name: string; email: string }
}

interface Meta {
  current_page: number
  last_page: number
  total: number
  per_page: number
}

const props = defineProps<{
  adoptions: Adoption[]
  meta: Meta
  currentTeam?: Team | null
  filter?: string | null
}>()

const statusFilters = [
  { label: 'Todas', value: '' },
  { label: 'Pendientes', value: 'pending' },
  { label: 'Aprobadas', value: 'approved' },
  { label: 'Rechazadas', value: 'rejected' },
  { label: 'Completadas', value: 'completed' },
]

function applyFilter(status: string): void {
  router.get(`/${props.currentTeam?.slug}/adopciones`, status ? { status } : {})
}

function statusClass(s: string): string {
  const map: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-blue-100 text-blue-700',
    rejected: 'bg-red-100 text-red-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-gray-100 text-gray-500',
  }

  return map[s] ?? 'bg-gray-100 text-gray-600'
}

function statusLabel(s: string): string {
  const labels: Record<string, string> = {
    pending: 'Pendiente', approved: 'Aprobada', rejected: 'Rechazada',
    completed: 'Completada', cancelled: 'Cancelada',
  }

  return labels[s] ?? s
}

function formatDate(d: string): string {
  return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d))
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Solicitudes de Adopción</h1>
        <p class="mt-1 text-sm text-muted-foreground">Revisa y gestiona las postulaciones de {{ currentTeam?.name }}.</p>
      </div>
    </div>

    <div class="mt-6 flex flex-wrap gap-2">
      <button
        v-for="f in statusFilters"
        :key="f.value"
        class="rounded-lg px-4 py-2 text-sm font-medium transition"
        :class="(filter ?? '') === f.value ? 'bg-[#2D6A4F] text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'"
        @click="applyFilter(f.value)"
      >
        {{ f.label }}
      </button>
    </div>

    <div class="mt-4 overflow-hidden rounded-xl border border-border bg-card">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-border/50 bg-muted text-xs font-medium uppercase text-muted-foreground">
          <tr>
            <th class="px-5 py-3">Mascota</th>
            <th class="px-5 py-3">Adoptante</th>
            <th class="px-5 py-3">Estado</th>
            <th class="px-5 py-3">Fecha</th>
            <th class="px-5 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border/50">
          <tr v-for="adoption in adoptions" :key="adoption.id" class="hover:bg-muted">
            <td class="px-5 py-4">
              <div class="flex items-center gap-3">
                <div v-if="adoption.pet.photos && adoption.pet.photos.length > 0" class="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                  <img :src="'/storage/' + adoption.pet.photos[0]" :alt="adoption.pet.name" class="h-full w-full object-cover" />
                </div>
                <div>
                  <p class="font-medium text-card-foreground">{{ adoption.pet.name }}</p>
                  <p class="text-xs text-muted-foreground/70">{{ adoption.pet.species }}</p>
                </div>
              </div>
            </td>
            <td class="px-5 py-4">
              <p class="text-card-foreground">{{ adoption.adopter.name }}</p>
              <p class="text-xs text-muted-foreground/70">{{ adoption.adopter.email }}</p>
            </td>
            <td class="px-5 py-4">
              <span class="rounded-full px-3 py-0.5 text-xs font-medium" :class="statusClass(adoption.status)">{{ statusLabel(adoption.status) }}</span>
            </td>
            <td class="px-5 py-4 text-muted-foreground/70">{{ formatDate(adoption.created_at) }}</td>
            <td class="px-5 py-4">
              <a :href="`/${currentTeam?.slug}/adopciones/${adoption.id}`" class="text-sm text-[#2D6A4F] hover:underline">Revisar</a>
            </td>
          </tr>
          <tr v-if="adoptions.length === 0">
            <td colspan="5" class="px-5 py-8 text-center text-muted-foreground/70">No hay solicitudes de adopción.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="meta.last_page > 1" class="mt-6 flex justify-center gap-2">
      <a v-for="page in meta.last_page" :key="page" :href="`/${currentTeam?.slug}/adopciones?page=${page}`" class="rounded-lg px-3 py-1.5 text-sm" :class="page === meta.current_page ? 'bg-[#2D6A4F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'">{{ page }}</a>
    </div>
  </div>
</template>
