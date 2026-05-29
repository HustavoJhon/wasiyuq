<script setup lang="ts">
import { router } from '@inertiajs/vue3'
import { ref } from 'vue'
import type { Team } from '@/types'

interface FollowUp {
  id: number
  scheduled_date: string
  completed_date: string | null
  status: string
  notes: string | null
  photos: string[]
  created_at: string
  adoption: {
    id: number
    pet: { id: number; name: string; slug: string; species: string; photos: string[] | null }
    adopter: { id: number; name: string; email: string }
  }
  created_by: { id: number; name: string }
}

const props = defineProps<{
  followUp: FollowUp
  currentTeam?: Team | null
}>()

const showScheduleForm = ref(false)
const scheduleDate = ref('')
const scheduleNotes = ref('')

function markCompleted(): void {
  router.post(`/${props.currentTeam?.slug}/seguimientos/${props.followUp.id}/completar`)
}

function markMissed(): void {
  router.post(`/${props.currentTeam?.slug}/seguimientos/${props.followUp.id}/no-realizado`)
}

function scheduleFollowUp(): void {
  router.post(`/${props.currentTeam?.slug}/seguimientos`, {
    adoption_id: props.followUp.adoption.id,
    scheduled_date: scheduleDate.value,
    notes: scheduleNotes.value,
  })
}

function statusClass(s: string): string {
  const map: Record<string, string> = { pending: 'bg-amber-100 text-amber-700', completed: 'bg-green-100 text-green-700', missed: 'bg-red-100 text-red-700' }

  return map[s] ?? 'bg-gray-100 text-gray-600'
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
    <a :href="`/${currentTeam?.slug}/seguimientos`" class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-[#2D6A4F]">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      Volver a seguimientos
    </a>

    <div class="mt-4 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Hito de Seguimiento</h1>
        <p class="mt-1 text-sm text-muted-foreground">{{ followUp.adoption.pet.name }} — {{ followUp.adoption.adopter.name }}</p>
      </div>
      <span class="rounded-full px-4 py-1 text-sm font-medium" :class="statusClass(followUp.status)">{{ statusLabel(followUp.status) }}</span>
    </div>

    <div class="mt-8 grid gap-8 lg:grid-cols-3">
      <div class="lg:col-span-2 space-y-8">
        <div class="rounded-xl border border-border bg-card p-6">
          <h2 class="text-lg font-semibold text-foreground">Detalles del hito</h2>
          <div class="mt-4 space-y-4">
            <div>
              <p class="text-xs text-muted-foreground/70">Notas / Descripción</p>
              <p class="mt-0.5 text-sm text-foreground">{{ followUp.notes ?? 'Sin descripción' }}</p>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-muted-foreground/70">Fecha programada</p>
                <p class="mt-0.5 text-sm font-medium text-card-foreground">{{ formatDate(followUp.scheduled_date) }}</p>
              </div>
              <div v-if="followUp.completed_date">
                <p class="text-xs text-muted-foreground/70">Fecha de realización</p>
                <p class="mt-0.5 text-sm font-medium text-card-foreground">{{ formatDate(followUp.completed_date) }}</p>
              </div>
            </div>
            <div>
              <p class="text-xs text-muted-foreground/70">Creado por</p>
              <p class="mt-0.5 text-sm font-medium text-card-foreground">{{ followUp.created_by.name }}</p>
            </div>
          </div>
        </div>

        <div v-if="followUp.photos && followUp.photos.length > 0" class="rounded-xl border border-border bg-card p-6">
          <h2 class="text-lg font-semibold text-foreground">Fotos</h2>
          <div class="mt-4 grid grid-cols-3 gap-4">
            <img v-for="(photo, i) in followUp.photos" :key="i" :src="'/storage/' + photo" class="rounded-lg border border-border object-cover h-32 w-full" />
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="rounded-xl border border-border bg-card p-6">
          <h2 class="text-sm font-semibold text-foreground">Acciones</h2>

          <div v-if="followUp.status === 'pending'" class="mt-4 space-y-3">
            <button class="w-full rounded-xl bg-[#2D6A4F] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#246142]" @click="markCompleted()">
              Marcar como completado
            </button>
            <button class="w-full rounded-xl border border-amber-200 px-4 py-2.5 text-sm font-medium text-amber-600 transition hover:bg-amber-50" @click="markMissed()">
              Marcar como no realizado
            </button>
          </div>

          <div v-else class="mt-4">
            <p class="text-sm text-muted-foreground/70">Este hito ya fue procesado.</p>
          </div>
        </div>

        <div class="rounded-xl border border-border bg-card p-6">
          <h2 class="text-sm font-semibold text-foreground">Programar nuevo hito</h2>
          <button v-if="!showScheduleForm" class="mt-4 w-full rounded-xl bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted/80" @click="showScheduleForm = true">
            + Agregar seguimiento
          </button>

          <div v-else class="mt-4 space-y-3">
            <input v-model="scheduleDate" type="date" class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[#2D6A4F]" />
            <textarea v-model="scheduleNotes" placeholder="Descripción del hito..." class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[#2D6A4F]" rows="3"></textarea>
            <button class="w-full rounded-xl bg-[#2D6A4F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#246142]" @click="scheduleFollowUp()">
              Programar
            </button>
          </div>
        </div>

        <div class="rounded-xl border border-border bg-card p-6">
          <h2 class="text-sm font-semibold text-foreground">Información de la adopción</h2>
          <div class="mt-3 space-y-2">
            <p class="text-sm font-medium text-card-foreground">{{ followUp.adoption.pet.name }}</p>
            <p class="text-xs text-muted-foreground">{{ followUp.adoption.adopter.name }}</p>
            <p class="text-xs text-muted-foreground/70">{{ followUp.adoption.adopter.email }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
