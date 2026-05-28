<script setup lang="ts">
interface FollowUp {
  id: number
  scheduled_date: string
  completed_date: string | null
  status: string
  notes: string | null
}

interface Adoption {
  id: number
  status: string
  motivation: string
  experience_with_pets: boolean
  has_yard: boolean
  housing_type: string
  family_composition: string
  notes: string | null
  created_at: string
  reviewed_at: string | null
  pet: { id: number; name: string; slug: string; species: string; breed: string | null }
  adopter: { id: number; name: string; email: string }
  team: { id: number; name: string; slug: string }
  reviewer: { id: number; name: string } | null
  follow_ups: FollowUp[]
}

defineProps<{ adoption: Adoption }>()

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
    <a href="/admin/adopciones" class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-[#2D6A4F]">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      Volver a adopciones
    </a>

    <div class="mt-4 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Adopción #{{ adoption.id }}</h1>
        <p class="mt-1 text-sm text-muted-foreground">{{ adoption.pet.name }} - {{ adoption.team.name }}</p>
      </div>
      <span class="rounded-full px-4 py-1 text-sm font-medium" :class="statusClass(adoption.status)">{{ statusLabel(adoption.status) }}</span>
    </div>

    <div class="mt-8 grid gap-8 lg:grid-cols-2">
      <div>
        <h2 class="text-lg font-semibold text-foreground">Información de la solicitud</h2>
        <div class="mt-4 space-y-4">
          <div>
            <p class="text-xs text-muted-foreground/70">Motivación</p>
            <p class="mt-0.5 text-sm text-foreground">{{ adoption.motivation }}</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs text-muted-foreground/70">Experiencia con mascotas</p>
              <p class="mt-0.5 text-sm font-medium text-card-foreground">{{ adoption.experience_with_pets ? 'Sí' : 'No' }}</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground/70">Tiene patio/yarda</p>
              <p class="mt-0.5 text-sm font-medium text-card-foreground">{{ adoption.has_yard ? 'Sí' : 'No' }}</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground/70">Tipo de vivienda</p>
              <p class="mt-0.5 text-sm font-medium text-card-foreground">{{ adoption.housing_type }}</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground/70">Composición familiar</p>
              <p class="mt-0.5 text-sm font-medium text-card-foreground">{{ adoption.family_composition }}</p>
            </div>
          </div>
          <div v-if="adoption.notes">
            <p class="text-xs text-muted-foreground/70">Notas</p>
            <p class="mt-0.5 text-sm text-foreground">{{ adoption.notes }}</p>
          </div>
          <div v-if="adoption.reviewer">
            <p class="text-xs text-muted-foreground/70">Revisado por</p>
            <p class="mt-0.5 text-sm font-medium text-card-foreground">{{ adoption.reviewer.name }}</p>
            <p v-if="adoption.reviewed_at" class="text-xs text-muted-foreground/70">{{ formatDate(adoption.reviewed_at) }}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 class="text-lg font-semibold text-foreground">Seguimiento</h2>
        <div v-if="adoption.follow_ups.length === 0" class="mt-4 text-sm text-muted-foreground/70">Sin seguimientos registrados.</div>
        <div v-else class="mt-4 space-y-3">
          <div v-for="fu in adoption.follow_ups" :key="fu.id" class="rounded-lg border border-border/50 bg-muted/30 p-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-card-foreground">{{ formatDate(fu.scheduled_date) }}</span>
              <span class="rounded-full bg-muted px-3 py-0.5 text-xs font-medium" :class="fu.status === 'completed' ? 'text-green-700 bg-green-100' : fu.status === 'missed' ? 'text-red-700 bg-red-100' : 'text-amber-700 bg-amber-100'">{{ fu.status }}</span>
            </div>
            <p v-if="fu.notes" class="mt-2 text-xs text-muted-foreground">{{ fu.notes }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
