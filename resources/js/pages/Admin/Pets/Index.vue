<script setup lang="ts">
import { router } from '@inertiajs/vue3'

interface Pet {
  id: number
  name: string
  slug: string
  species: string
  status: string
  photos: string[] | null
  created_at: string
  team: { id: number; name: string; slug: string }
}

interface Meta {
  current_page: number
  last_page: number
  total: number
  per_page: number
}

defineProps<{
  pets: Pet[]
  meta: Meta
}>()

function photoUrl(path: string | null | undefined): string {
  if (!path || typeof path !== 'string') return 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E'
  return path.startsWith('http') ? path : `/storage/${path}`
}

function speciesLabel(s: string): string {
  const labels: Record<string, string> = { dog: 'Perro', cat: 'Gato', rabbit: 'Conejo', bird: 'Ave', other: 'Otro' }
  return labels[s] ?? s
}

function statusLabel(s: string): string {
  const labels: Record<string, string> = { available: 'Disponible', adopted: 'Adoptado', in_process: 'En Proceso', withheld: 'Reservado' }
  return labels[s] ?? s
}

function formatDate(d: string): string {
  return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d))
}

function destroy(id: number): void {
  if (confirm('¿Eliminar esta mascota?')) {
    router.delete('/admin/mascotas/' + id)
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Mascotas</h1>
        <p class="mt-1 text-sm text-muted-foreground">Todas las mascotas registradas en la plataforma.</p>
      </div>
      <a href="/admin/mascotas/crear" class="rounded-lg bg-[#2D6A4F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#246142]">Nueva Mascota</a>
    </div>

    <div class="mt-6 overflow-hidden rounded-xl border border-border bg-card">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-border/50 bg-muted text-xs font-medium uppercase text-muted-foreground">
          <tr>
            <th class="px-5 py-3">Foto</th>
            <th class="px-5 py-3">Nombre</th>
            <th class="px-5 py-3">Especie</th>
            <th class="px-5 py-3">Estado</th>
            <th class="px-5 py-3">Organización</th>
            <th class="px-5 py-3">Registro</th>
            <th class="px-5 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border/50">
          <tr v-for="pet in pets" :key="pet.id" class="hover:bg-muted">
            <td class="px-5 py-4">
              <div v-if="pet.photos && pet.photos.length > 0" class="h-10 w-10 overflow-hidden rounded-lg bg-muted">
                <img :src="photoUrl(pet.photos[0])" :alt="pet.name" class="h-full w-full object-cover" />
              </div>
              <div v-else class="h-10 w-10 rounded-lg bg-muted" />
            </td>
            <td class="px-5 py-4 font-medium text-card-foreground">{{ pet.name }}</td>
            <td class="px-5 py-4 text-muted-foreground">{{ speciesLabel(pet.species) }}</td>
            <td class="px-5 py-4">
              <span class="rounded-full bg-muted px-3 py-0.5 text-xs font-medium" :class="pet.status === 'available' ? 'text-green-700 bg-green-100' : 'text-gray-600'">{{ statusLabel(pet.status) }}</span>
            </td>
            <td class="px-5 py-4 text-muted-foreground">{{ pet.team.name }}</td>
            <td class="px-5 py-4 text-muted-foreground/70">{{ formatDate(pet.created_at) }}</td>
            <td class="px-5 py-4">
              <div class="flex items-center gap-2">
                <a :href="'/admin/mascotas/' + pet.id" class="text-xs text-[#2D6A4F] hover:underline">Ver</a>
                <a :href="'/admin/mascotas/' + pet.id + '/editar'" class="text-xs text-muted-foreground hover:text-[#2D6A4F]">Editar</a>
                <button @click="destroy(pet.id)" class="text-xs text-red-500 hover:text-red-700">Eliminar</button>
              </div>
            </td>
          </tr>
          <tr v-if="pets.length === 0">
            <td colspan="7" class="px-5 py-8 text-center text-muted-foreground/70">No hay mascotas registradas.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="meta.last_page > 1" class="mt-6 flex justify-center gap-2">
      <a v-for="page in meta.last_page" :key="page" :href="'/admin/mascotas?page=' + page" class="rounded-lg px-3 py-1.5 text-sm" :class="page === meta.current_page ? 'bg-[#2D6A4F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'">{{ page }}</a>
    </div>
  </div>
</template>
