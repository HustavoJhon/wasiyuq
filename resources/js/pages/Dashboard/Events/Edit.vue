<script setup lang="ts">
import { useForm, router } from '@inertiajs/vue3'
import type { Team } from '@/types'

interface EventEdit {
  id: number
  title: string
  description: string
  type: string
  event_date: string | null
  location: string | null
  cover_image: string | null
  is_published: boolean
}

const props = defineProps<{
  event: EventEdit
  currentTeam?: Team | null
}>()

const form = useForm({
  title: props.event.title,
  description: props.event.description,
  type: props.event.type,
  event_date: props.event.event_date ?? '',
  location: props.event.location ?? '',
  cover_image: props.event.cover_image ?? '',
  is_published: props.event.is_published,
})

const typeOptions = [
  { value: 'adoption_fair', label: 'Feria de Adopción' },
  { value: 'fundraiser', label: 'Recaudación de Fondos' },
  { value: 'workshop', label: 'Taller' },
  { value: 'campaign', label: 'Campaña' },
  { value: 'other', label: 'Otro' },
]

function submit(): void {
  form.put('/' + currentTeamSlug() + '/eventos/' + props.event.id)
}

function destroy(id: number): void {
  if (confirm('¿Estás seguro de eliminar?')) {
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
    <a :href="`/${currentTeam?.slug}/eventos`" class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-[#2D6A4F]">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      Volver a eventos
    </a>

    <div class="mt-4 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">{{ event.title }}</h1>
        <p class="mt-1 text-sm text-muted-foreground">Editar evento.</p>
      </div>
      <button @click="destroy(event.id)" class="text-sm text-red-500 hover:text-red-700">Eliminar evento</button>
    </div>

    <form @submit.prevent="submit" class="mt-6 max-w-lg space-y-5">
      <div class="space-y-1.5">
        <label class="text-sm font-medium text-foreground">Título *</label>
        <input v-model="form.title" class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" :disabled="form.processing" />
        <p v-if="form.errors.title" class="text-xs text-red-500">{{ form.errors.title }}</p>
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium text-foreground">Descripción *</label>
        <textarea v-model="form.description" rows="4" class="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" :disabled="form.processing" />
        <p v-if="form.errors.description" class="text-xs text-red-500">{{ form.errors.description }}</p>
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium text-foreground">Tipo *</label>
        <select v-model="form.type" class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" :disabled="form.processing">
          <option v-for="opt in typeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
        <p v-if="form.errors.type" class="text-xs text-red-500">{{ form.errors.type }}</p>
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium text-foreground">Fecha del evento</label>
        <input v-model="form.event_date" type="date" class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" :disabled="form.processing" />
        <p v-if="form.errors.event_date" class="text-xs text-red-500">{{ form.errors.event_date }}</p>
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium text-foreground">Ubicación</label>
        <input v-model="form.location" class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" :disabled="form.processing" />
        <p v-if="form.errors.location" class="text-xs text-red-500">{{ form.errors.location }}</p>
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium text-foreground">URL de imagen</label>
        <input v-model="form.cover_image" class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="https://..." :disabled="form.processing" />
        <p v-if="form.errors.cover_image" class="text-xs text-red-500">{{ form.errors.cover_image }}</p>
      </div>

      <div class="flex items-center gap-2">
        <input id="is_published" type="checkbox" v-model="form.is_published" class="h-4 w-4 rounded border-gray-300 text-[#2D6A4F] focus:ring-[#2D6A4F]" :disabled="form.processing" />
        <label for="is_published" class="text-sm text-foreground">Publicado</label>
      </div>
      <p v-if="form.errors.is_published" class="text-xs text-red-500">{{ form.errors.is_published }}</p>

      <div class="flex items-center gap-3 pt-2">
        <button type="submit" :disabled="form.processing" class="rounded-lg bg-[#2D6A4F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1B4332] disabled:opacity-50">
          {{ form.processing ? 'Guardando...' : 'Guardar' }}
        </button>
        <a :href="`/${currentTeam?.slug}/eventos/${event.id}`" class="text-sm text-muted-foreground hover:text-foreground">Cancelar</a>
      </div>
    </form>
  </div>
</template>
