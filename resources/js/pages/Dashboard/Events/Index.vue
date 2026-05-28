<script setup lang="ts">
import { router } from '@inertiajs/vue3'
import type { Team } from '@/types'

interface EventItem {
  id: number
  title: string
  slug: string
  type: string
  event_date: string | null
  location: string | null
  is_published: boolean
  published_at: string | null
  created_at: string
  author: { id: number; name: string }
}

interface Meta {
  current_page: number
  last_page: number
  total: number
  per_page: number
}

defineProps<{
  events: EventItem[]
  meta: Meta
  currentTeam?: Team | null
}>()

const typeLabels: Record<string, string> = {
  adoption_fair: 'Feria de Adopción',
  fundraiser: 'Recaudación de Fondos',
  workshop: 'Taller',
  campaign: 'Campaña',
  other: 'Otro',
}

function formatDate(d: string): string {
  return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d))
}

function destroy(id: number): void {
  if (confirm('¿Eliminar este evento?')) {
    router.delete('/' + currentTeamSlug() + '/eventos/' + id)
  }
}

function currentTeamSlug(): string {
  const m = window.location.pathname.match(/^\/([^/]+)/)
  return m ? m[1] : ''
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Eventos y Comunicados</h1>
        <p class="mt-1 text-sm text-muted-foreground">Gestiona los eventos de {{ currentTeam?.name }}.</p>
      </div>
      <a :href="`/${currentTeam?.slug}/eventos/crear`" class="rounded-lg bg-[#2D6A4F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#246142]">Nuevo Evento</a>
    </div>

    <div class="mt-6 overflow-hidden rounded-xl border border-border bg-card">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-border/50 bg-muted text-xs font-medium uppercase text-muted-foreground">
          <tr>
            <th class="px-5 py-3">Título</th>
            <th class="px-5 py-3">Tipo</th>
            <th class="px-5 py-3">Fecha</th>
            <th class="px-5 py-3">Publicado</th>
            <th class="px-5 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border/50">
          <tr v-for="event in events" :key="event.id" class="hover:bg-muted">
            <td class="px-5 py-4 font-medium text-card-foreground">{{ event.title }}</td>
            <td class="px-5 py-4 text-muted-foreground">{{ typeLabels[event.type] ?? event.type }}</td>
            <td class="px-5 py-4 text-muted-foreground/70">{{ event.event_date ? formatDate(event.event_date) : '—' }}</td>
            <td class="px-5 py-4">
              <span class="rounded-full px-3 py-0.5 text-xs font-medium" :class="event.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">{{ event.is_published ? 'Sí' : 'No' }}</span>
            </td>
            <td class="px-5 py-4">
              <div class="flex items-center gap-2">
                <a :href="`/${currentTeam?.slug}/eventos/${event.id}`" class="text-xs text-[#2D6A4F] hover:underline">Ver</a>
                <a :href="`/${currentTeam?.slug}/eventos/${event.id}/editar`" class="text-xs text-muted-foreground hover:text-[#2D6A4F]">Editar</a>
                <button @click="destroy(event.id)" class="text-xs text-red-500 hover:text-red-700">Eliminar</button>
              </div>
            </td>
          </tr>
          <tr v-if="events.length === 0">
            <td colspan="5" class="px-5 py-8 text-center text-muted-foreground/70">No hay eventos registrados.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="meta.last_page > 1" class="mt-6 flex justify-center gap-2">
      <a v-for="page in meta.last_page" :key="page" :href="`/${currentTeam?.slug}/eventos?page=${page}`" class="rounded-lg px-3 py-1.5 text-sm" :class="page === meta.current_page ? 'bg-[#2D6A4F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'">{{ page }}</a>
    </div>
  </div>
</template>
