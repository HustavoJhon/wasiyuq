<script setup lang="ts">
import { useForm, usePage } from '@inertiajs/vue3'
import { ref, computed } from 'vue'

interface Pet {
  id: number
  name: string
  slug: string
  species: string
  breed: string | null
  age_years: number
  age_months: number
  gender: string
  size: string
  color: string | null
  description: string
  medical_notes: string | null
  status: string
  photos: string[] | null
  team: { id: number; name: string; slug: string; bio: string | null; logo: string | null; website: string | null; phone: string | null; city: string | null; state: string | null }
}

const props = defineProps<{ pet: Pet }>()
const page = usePage()
const isAuthenticated = !!page.props.auth?.user
const showForm = ref(false)
const errors = computed(() => page.props.errors as Record<string, string>)

const form = useForm({
  motivation: '',
  experience_with_pets: false,
  has_yard: false,
  housing_type: 'house',
  family_composition: '',
})

function submit(): void {
  form.post(`/mascotas/${props.pet.slug}/postular`, {
    preserveScroll: true,
    onSuccess: () => {
      showForm.value = false
      form.reset()
    },
  })
}

function openForm(): void {
  if (!isAuthenticated) {
    window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)

    return
  }

  showForm.value = true
}

function formatAge(years: number, months: number): string {
  if (years > 0) {
return years + ' año' + (years > 1 ? 's' : '')
}

  if (months > 0) {
return months + ' mes' + (months > 1 ? 'es' : '')
}

  return 'Cachorro'
}

function speciesLabel(species: string): string {
  const labels: Record<string, string> = { dog: 'Perro', cat: 'Gato', rabbit: 'Conejo', bird: 'Ave', other: 'Otro' }

  return labels[species] ?? species
}

function sizeLabel(size: string): string {
  const labels: Record<string, string> = { small: 'Pequeño', medium: 'Mediano', large: 'Grande' }

  return labels[size] ?? size
}

function genderLabel(gender: string): string {
  const labels: Record<string, string> = { male: 'Macho', female: 'Hembra' }

  return labels[gender] ?? gender
}

function statusLabel(status: string): string {
  const labels: Record<string, string> = { available: 'Disponible', in_process: 'En Proceso', adopted: 'Adoptado', withheld: 'Reservado' }

  return labels[status] ?? status
}
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
    <a href="/mascotas" class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-[#2D6A4F]">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      Volver a mascotas
    </a>

    <div class="mt-6 grid gap-12 lg:grid-cols-2">
      <div v-if="pet.photos && pet.photos.length > 0" class="aspect-[4/3] overflow-hidden rounded-2xl">
        <img :src="'/storage/' + pet.photos[0]" :alt="pet.name" class="h-full w-full object-cover" />
      </div>
      <div v-else class="aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-muted to-muted/80" />

      <div>
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-3xl font-bold text-foreground">{{ pet.name }}</h1>
            <p class="mt-1 text-muted-foreground">{{ pet.breed }} &middot; {{ speciesLabel(pet.species) }}</p>
          </div>
          <span class="rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700">{{ statusLabel(pet.status) }}</span>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-muted p-5">
          <div><span class="text-xs text-muted-foreground/70">Edad</span><p class="text-sm font-medium text-foreground">{{ formatAge(pet.age_years, pet.age_months) }}</p></div>
          <div><span class="text-xs text-muted-foreground/70">Tamaño</span><p class="text-sm font-medium text-foreground">{{ sizeLabel(pet.size) }}</p></div>
          <div><span class="text-xs text-muted-foreground/70">Sexo</span><p class="text-sm font-medium text-foreground">{{ genderLabel(pet.gender) }}</p></div>
          <div><span class="text-xs text-muted-foreground/70">Color</span><p class="text-sm font-medium text-foreground">{{ pet.color }}</p></div>
        </div>

        <div class="mt-6">
          <h3 class="text-sm font-semibold text-foreground">Descripción</h3>
          <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{{ pet.description }}</p>
        </div>

        <div v-if="pet.medical_notes" class="mt-6">
          <h3 class="text-sm font-semibold text-foreground">Notas médicas</h3>
          <p class="mt-1 text-sm text-muted-foreground">{{ pet.medical_notes }}</p>
        </div>

        <div class="mt-6 rounded-2xl border border-border bg-muted/50 p-4">
          <p class="text-xs text-muted-foreground/70">Entidad responsable</p>
          <p class="mt-0.5 text-sm font-medium text-foreground">{{ pet.team.name }}</p>
          <p class="text-xs text-muted-foreground/70">{{ pet.team.city }}, {{ pet.team.state }}</p>
          <p v-if="pet.team.phone" class="mt-1 text-xs text-muted-foreground/70">{{ pet.team.phone }}</p>
        </div>

        <button v-if="pet.status === 'available'" class="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-[#2D6A4F] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2D6A4F]/25 transition hover:bg-[#246142]" @click="openForm()">Quiero adoptarlo</button>
      </div>
    </div>

    <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="showForm = false">
      <div class="w-full max-w-lg rounded-2xl bg-card p-6 shadow-xl">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-foreground">Solicitar adopción</h2>
          <button class="text-muted-foreground hover:text-foreground" @click="showForm = false">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <p class="mt-1 text-sm text-muted-foreground">{{ pet.name }} — {{ pet.team.name }}</p>

        <form class="mt-6 space-y-4" @submit.prevent="submit">
          <div>
            <label class="text-sm font-medium text-foreground">¿Por qué quieres adoptarlo?</label>
            <textarea v-model="form.motivation" class="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-[#2D6A4F]" :class="errors.motivation ? 'border-red-500' : 'border-border'" rows="4" placeholder="Cuéntanos tu motivación (mín. 150 caracteres)..."></textarea>
            <p v-if="errors.motivation" class="mt-1 text-xs text-red-500">{{ errors.motivation }}</p>
          </div>

          <div class="flex items-center gap-2">
            <input id="exp" v-model="form.experience_with_pets" type="checkbox" class="rounded border-border text-[#2D6A4F] focus:ring-[#2D6A4F]" />
            <label for="exp" class="text-sm text-foreground">Tengo experiencia con mascotas</label>
          </div>

          <div class="flex items-center gap-2">
            <input id="yard" v-model="form.has_yard" type="checkbox" class="rounded border-border text-[#2D6A4F] focus:ring-[#2D6A4F]" />
            <label for="yard" class="text-sm text-foreground">Tengo patio o jardín</label>
          </div>

          <div>
            <label class="text-sm font-medium text-foreground">Tipo de vivienda</label>
            <select v-model="form.housing_type" class="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-[#2D6A4F]" :class="errors.housing_type ? 'border-red-500' : 'border-border'">
              <option value="house">Casa</option>
              <option value="apartment">Departamento</option>
              <option value="condo">Condominio</option>
              <option value="other">Otro</option>
            </select>
            <p v-if="errors.housing_type" class="mt-1 text-xs text-red-500">{{ errors.housing_type }}</p>
          </div>

          <div>
            <label class="text-sm font-medium text-foreground">Composición del hogar</label>
            <textarea v-model="form.family_composition" class="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-[#2D6A4F]" :class="errors.family_composition ? 'border-red-500' : 'border-border'" rows="2" placeholder="¿Con quién vives? ¿Hay niños u otras mascotas?"></textarea>
            <p v-if="errors.family_composition" class="mt-1 text-xs text-red-500">{{ errors.family_composition }}</p>
          </div>

          <button type="submit" :disabled="form.processing" class="w-full rounded-xl bg-[#2D6A4F] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#246142]" :class="{ 'opacity-50': form.processing }">
            {{ form.processing ? 'Enviando...' : 'Enviar solicitud' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
