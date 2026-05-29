<script setup lang="ts">
interface PetShow {
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
  status: string
  description: string | null
  medical_notes: string | null
  photos: string[] | null
  created_at: string
  team: { id: number, name: string, slug: string }
  adoptions_count: number
}

const props = defineProps<{ pet: PetShow }>()

function photoUrl(path: string): string {
  return path.startsWith('http') ? path : `/storage/${path}`
}

function speciesLabel(s: string): string {
  const labels: Record<string, string> = { dog: 'Perro', cat: 'Gato', rabbit: 'Conejo', bird: 'Ave', other: 'Otro' }

  return labels[s] ?? s
}

function genderLabel(s: string): string {
  const labels: Record<string, string> = { male: 'Macho', female: 'Hembra' }

  return labels[s] ?? s
}

function sizeLabel(s: string): string {
  const labels: Record<string, string> = { small: 'Pequeño', medium: 'Mediano', large: 'Grande' }

  return labels[s] ?? s
}

function statusClass(s: string): string {
  const classes: Record<string, string> = { available: 'text-green-700 bg-green-100', adopted: 'text-blue-700 bg-blue-100', in_process: 'text-amber-700 bg-amber-100', withheld: 'text-gray-600 bg-gray-100' }

  return classes[s] ?? 'text-gray-600 bg-gray-100'
}

function statusLabel(s: string): string {
  const labels: Record<string, string> = { available: 'Disponible', adopted: 'Adoptado', in_process: 'En proceso', withheld: 'Retenido' }

  return labels[s] ?? s
}

function formatDate(d: string): string {
  return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d))
}
</script>

<template>
  <div>
    <a href="/admin/mascotas" class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-[#2D6A4F]">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      Volver a mascotas
    </a>

    <div class="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div v-if="pet.photos && pet.photos.length > 0" class="lg:col-span-1">
        <img :src="photoUrl(pet.photos[0])" :alt="pet.name" class="w-full rounded-xl object-cover shadow-sm" />
      </div>
      <div v-else class="lg:col-span-1 flex aspect-[3/4] items-center justify-center rounded-xl bg-muted">
        <svg class="h-12 w-12 text-muted-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
      </div>

      <div class="lg:col-span-2">
        <div class="rounded-xl border border-border bg-card p-6">
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-2xl font-bold text-foreground">{{ pet.name }}</h1>
              <p class="mt-1 text-sm text-muted-foreground">
                <span class="rounded-full bg-muted px-3 py-0.5 text-xs font-medium">{{ speciesLabel(pet.species) }}</span>
                <span class="ml-2 rounded-full px-3 py-0.5 text-xs font-medium" :class="statusClass(pet.status)">{{ statusLabel(pet.status) }}</span>
                <span class="ml-2 rounded-full bg-muted px-3 py-0.5 text-xs font-medium text-muted-foreground">{{ sizeLabel(pet.size) }}</span>
              </p>
            </div>
            <a :href="'/admin/mascotas/' + pet.id + '/editar'" class="rounded-lg bg-[#2D6A4F] px-4 py-2 text-sm font-medium text-white hover:bg-[#245a40]">Editar</a>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-6 text-sm">
            <div>
              <p class="text-muted-foreground/70">Raza</p>
              <p class="font-medium text-card-foreground">{{ pet.breed ?? '—' }}</p>
            </div>
            <div>
              <p class="text-muted-foreground/70">Edad</p>
              <p class="font-medium text-card-foreground">{{ pet.age_years > 0 ? pet.age_years + ' años' : '' }}{{ pet.age_years > 0 && pet.age_months > 0 ? ' ' : '' }}{{ pet.age_months > 0 ? pet.age_months + ' meses' : pet.age_years === 0 && pet.age_months === 0 ? '—' : '' }}</p>
            </div>
            <div>
              <p class="text-muted-foreground/70">Sexo</p>
              <p class="font-medium text-card-foreground">{{ genderLabel(pet.gender) }}</p>
            </div>
            <div>
              <p class="text-muted-foreground/70">Color</p>
              <p class="font-medium text-card-foreground">{{ pet.color ?? '—' }}</p>
            </div>
            <div>
              <p class="text-muted-foreground/70">Organización</p>
              <a :href="'/admin/organizaciones/' + pet.team.slug" class="font-medium text-[#2D6A4F] hover:underline">{{ pet.team.name }}</a>
            </div>
            <div>
              <p class="text-muted-foreground/70">Registro</p>
              <p class="font-medium text-card-foreground">{{ formatDate(pet.created_at) }}</p>
            </div>
          </div>

          <div v-if="pet.description" class="mt-6">
            <h2 class="text-sm font-semibold text-card-foreground">Descripción</h2>
            <p class="mt-1 text-sm text-muted-foreground">{{ pet.description }}</p>
          </div>

          <div v-if="pet.medical_notes" class="mt-6">
            <h2 class="text-sm font-semibold text-card-foreground">Notas médicas</h2>
            <p class="mt-1 text-sm text-muted-foreground">{{ pet.medical_notes }}</p>
          </div>

          <div class="mt-6 flex gap-4">
            <div class="rounded-lg border border-border bg-muted px-4 py-3 text-center">
              <p class="text-xl font-bold text-card-foreground">{{ pet.adoptions_count }}</p>
              <p class="text-xs text-muted-foreground">Adopciones</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
