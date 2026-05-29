<script setup lang="ts">
interface FollowUpShow {
  id: number
  scheduled_date: string
  completed_date: string | null
  status: string
  notes: string | null
  photos: string[]
  created_at: string
  adoption: { id: number; pet: { id: number; name: string; slug: string }; adopter: { id: number; name: string; email: string } }
  created_by: { id: number; name: string }
}

defineProps<{ followUp: FollowUpShow }>()

function statusClass(status: string): string {
  const map: Record<string, string> = { pending: 'bg-amber-100 text-amber-700', completed: 'bg-green-100 text-green-700', missed: 'bg-red-100 text-red-700' }

  return map[status] ?? 'bg-gray-100 text-gray-600'
}

function statusLabel(s: string): string {
  const labels: Record<string, string> = { pending: 'Pendiente', completed: 'Completado', missed: 'No Realizado' }

  return labels[s] ?? s
}

function formatDate(d: string): string {
  return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d))
}
</script>

<template>
  <div>
    <a href="/admin/seguimiento" class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-[#2D6A4F]">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      Volver a seguimiento
    </a>

    <div class="mt-4 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Seguimiento #{{ followUp.id }}</h1>
        <p class="mt-1 text-sm text-muted-foreground">{{ followUp.adoption.pet.name }} - {{ followUp.adoption.adopter.name }}</p>
      </div>
      <span class="rounded-full px-4 py-1 text-sm font-medium" :class="statusClass(followUp.status)">{{ statusLabel(followUp.status) }}</span>
    </div>

    <div class="mt-8 grid gap-8 lg:grid-cols-2">
      <div>
        <h2 class="text-lg font-semibold text-foreground">Información de la visita</h2>
        <div class="mt-4 space-y-4">
          <div>
            <p class="text-xs text-muted-foreground/70">Mascota</p>
            <p class="mt-0.5 text-sm font-medium text-card-foreground">{{ followUp.adoption.pet.name }}</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground/70">Adoptante</p>
            <p class="mt-0.5 text-sm font-medium text-card-foreground">{{ followUp.adoption.adopter.name }}</p>
            <p class="text-xs text-muted-foreground/70">{{ followUp.adoption.adopter.email }}</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground/70">Fecha programada</p>
            <p class="mt-0.5 text-sm font-medium text-card-foreground">{{ formatDate(followUp.scheduled_date) }}</p>
          </div>
          <div v-if="followUp.completed_date">
            <p class="text-xs text-muted-foreground/70">Fecha de realización</p>
            <p class="mt-0.5 text-sm font-medium text-card-foreground">{{ formatDate(followUp.completed_date) }}</p>
          </div>
          <div v-if="followUp.notes">
            <p class="text-xs text-muted-foreground/70">Notas</p>
            <p class="mt-0.5 text-sm text-foreground">{{ followUp.notes }}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 class="text-lg font-semibold text-foreground">Fotos</h2>
        <div v-if="!followUp.photos || followUp.photos.length === 0" class="mt-4 text-sm text-muted-foreground/70">Sin fotos registradas.</div>
        <div v-else class="mt-4 grid grid-cols-2 gap-4">
          <img v-for="(photo, i) in followUp.photos" :key="i" :src="photo" class="rounded-lg border border-border object-cover" />
        </div>
      </div>
    </div>

    <div class="mt-8 flex items-center justify-between border-t border-border pt-6">
      <div>
        <p class="text-xs text-muted-foreground/70">Creado por</p>
        <p class="mt-0.5 text-sm font-medium text-card-foreground">{{ followUp.created_by.name }}</p>
        <p class="text-xs text-muted-foreground/70">{{ formatDate(followUp.created_at) }}</p>
      </div>
      <a :href="'/admin/seguimiento/' + followUp.id + '/editar'" class="inline-flex items-center gap-2 rounded-lg bg-[#2D6A4F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#245a40]">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
        Editar
      </a>
    </div>
  </div>
</template>
