<script setup lang="ts">
import { router } from '@inertiajs/vue3'
import { ref } from 'vue'

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
    team: { id: number; name: string; slug: string }
  }
}

const props = defineProps<{
  followUp: FollowUp
}>()

const notes = ref('')
const photos = ref<File[]>([])
const submitting = ref(false)

function handlePhotoInput(e: Event): void {
  const input = e.target as HTMLInputElement
  if (input.files) {
    photos.value = Array.from(input.files)
  }
}

function submitReport(): void {
  if (submitting.value) return
  submitting.value = true

  const formData = new FormData()
  formData.append('notes', notes.value)
  for (const photo of photos.value) {
    formData.append('photos[]', photo)
  }

  router.post(`/mi-adopcion/seguimientos/${props.followUp.id}/reportar`, formData, {
    onFinish: () => { submitting.value = false },
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
  <div class="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
    <a href="/mi-adopcion/seguimientos" class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-[#2D6A4F]">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      Volver a seguimientos
    </a>

    <div class="mt-4 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Reportar Seguimiento</h1>
        <p class="mt-1 text-sm text-muted-foreground">{{ followUp.adoption.pet.name }} — {{ followUp.adoption.team.name }}</p>
      </div>
      <span class="rounded-full px-4 py-1 text-sm font-medium" :class="statusClass(followUp.status)">{{ statusLabel(followUp.status) }}</span>
    </div>

    <div v-if="followUp.status !== 'pending'" class="mt-8 rounded-xl border border-border bg-card p-6 text-center">
      <p class="text-muted-foreground/70">Este seguimiento ya fue reportado.</p>
    </div>

    <div v-else class="mt-8 space-y-6">
      <div class="rounded-xl border border-border bg-card p-6">
        <h2 class="text-sm font-semibold text-foreground">Información del hito</h2>
        <div class="mt-3 space-y-2">
          <p class="text-xs text-muted-foreground/70">{{ followUp.notes }}</p>
          <p class="text-xs text-muted-foreground/70">Programado: {{ formatDate(followUp.scheduled_date) }}</p>
        </div>
      </div>

      <div class="rounded-xl border border-border bg-card p-6">
        <h2 class="text-sm font-semibold text-foreground">Tu reporte</h2>
        <div class="mt-4 space-y-4">
          <textarea v-model="notes" placeholder="Cuéntanos cómo está tu mascota, cómo va la adaptación..." class="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-[#2D6A4F]" rows="5"></textarea>

          <div>
            <label class="text-xs font-medium text-muted-foreground/70">Fotos (opcional)</label>
            <input type="file" multiple accept="image/*" class="mt-2 block w-full text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-[#2D6A4F] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#246142]" @change="handlePhotoInput" />
          </div>

          <button
            class="w-full rounded-xl bg-[#2D6A4F] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#246142] disabled:opacity-50"
            :disabled="submitting"
            @click="submitReport()"
          >
            {{ submitting ? 'Enviando...' : 'Enviar reporte' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
