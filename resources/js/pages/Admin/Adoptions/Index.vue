<script setup lang="ts">
interface Adoption {
  id: number
  status: string
  created_at: string
  pet: { id: number; name: string; slug: string; species: string }
  adopter: { id: number; name: string; email: string }
  team: { id: number; name: string; slug: string }
}

interface Meta {
  current_page: number
  last_page: number
  total: number
  per_page: number
}

defineProps<{
  adoptions: Adoption[]
  meta: Meta
}>()

function statusClass(status: string): string {
  const map: Record<string, string> = { pending: 'bg-amber-100 text-amber-700', approved: 'bg-blue-100 text-blue-700', rejected: 'bg-red-100 text-red-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-gray-100 text-gray-500' }
  return map[status] ?? 'bg-gray-100 text-gray-600'
}

function statusLabel(s: string): string {
  const labels: Record<string, string> = { pending: 'Pendiente', approved: 'Aprobada', rejected: 'Rechazada', completed: 'Completada', cancelled: 'Cancelada' }
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
        <h1 class="text-2xl font-bold text-foreground">Adopciones</h1>
        <p class="mt-1 text-sm text-muted-foreground">Todas las solicitudes de adopción.</p>
      </div>
    </div>

    <div class="mt-6 overflow-hidden rounded-xl border border-border bg-card">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-border/50 bg-muted text-xs font-medium uppercase text-muted-foreground">
          <tr>
            <th class="px-5 py-3">Mascota</th>
            <th class="px-5 py-3">Adoptante</th>
            <th class="px-5 py-3">Organización</th>
            <th class="px-5 py-3">Estado</th>
            <th class="px-5 py-3">Fecha</th>
            <th class="px-5 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border/50">
          <tr v-for="adoption in adoptions" :key="adoption.id" class="hover:bg-muted">
            <td class="px-5 py-4 font-medium text-card-foreground">{{ adoption.pet.name }}</td>
            <td class="px-5 py-4">
              <p class="text-card-foreground">{{ adoption.adopter.name }}</p>
              <p class="text-xs text-muted-foreground/70">{{ adoption.adopter.email }}</p>
            </td>
            <td class="px-5 py-4 text-muted-foreground">{{ adoption.team.name }}</td>
            <td class="px-5 py-4">
              <span class="rounded-full px-3 py-0.5 text-xs font-medium" :class="statusClass(adoption.status)">{{ statusLabel(adoption.status) }}</span>
            </td>
            <td class="px-5 py-4 text-muted-foreground/70">{{ formatDate(adoption.created_at) }}</td>
            <td class="px-5 py-4">
              <a :href="'/admin/adopciones/' + adoption.id" class="text-sm text-[#2D6A4F] hover:underline">Ver</a>
            </td>
          </tr>
          <tr v-if="adoptions.length === 0">
            <td colspan="6" class="px-5 py-8 text-center text-muted-foreground/70">No hay solicitudes de adopción.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="meta.last_page > 1" class="mt-6 flex justify-center gap-2">
      <a v-for="page in meta.last_page" :key="page" :href="'/admin/adopciones?page=' + page" class="rounded-lg px-3 py-1.5 text-sm" :class="page === meta.current_page ? 'bg-[#2D6A4F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'">{{ page }}</a>
    </div>
  </div>
</template>
