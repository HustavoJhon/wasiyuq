<script setup lang="ts">
import { ref } from 'vue'
import { useForm, router } from '@inertiajs/vue3'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import InputError from '@/components/InputError.vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Team {
  id: number
  name: string
  slug: string
}

interface PetEdit {
  id: number
  team_id: number
  name: string
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
  team: Team
}

const props = defineProps<{
  pet: PetEdit
  teams: Team[]
}>()

function photoUrl(path: string): string {
  return path.startsWith('http') ? path : `/storage/${path}`
}

const existingPhoto = props.pet.photos?.length ? photoUrl(props.pet.photos[0]) : null

const previewUrl = ref<string | null>(null)
const currentPreview = ref<string | null>(existingPhoto)

const form = useForm({
  team_id: String(props.pet.team_id),
  name: props.pet.name,
  species: props.pet.species,
  breed: props.pet.breed ?? '',
  age_years: props.pet.age_years,
  age_months: props.pet.age_months,
  gender: props.pet.gender,
  size: props.pet.size,
  color: props.pet.color ?? '',
  status: props.pet.status,
  description: props.pet.description ?? '',
  medical_notes: props.pet.medical_notes ?? '',
  photo: null as File | null,
})

function onPhotoChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    form.photo = file
    const reader = new FileReader()
    reader.onload = () => {
      previewUrl.value = reader.result as string
      currentPreview.value = null
    }
    reader.readAsDataURL(file)
  }
}

const speciesOptions = [
  { value: 'dog', label: 'Perro' },
  { value: 'cat', label: 'Gato' },
  { value: 'rabbit', label: 'Conejo' },
  { value: 'bird', label: 'Ave' },
  { value: 'other', label: 'Otro' },
]

const genderOptions = [
  { value: 'male', label: 'Macho' },
  { value: 'female', label: 'Hembra' },
]

const sizeOptions = [
  { value: 'small', label: 'Pequeño' },
  { value: 'medium', label: 'Mediano' },
  { value: 'large', label: 'Grande' },
]

const statusOptions = [
  { value: 'available', label: 'Disponible' },
  { value: 'adopted', label: 'Adoptado' },
  { value: 'in_process', label: 'En proceso' },
  { value: 'withheld', label: 'Retenido' },
]

function submit() {
  form.put('/admin/mascotas/' + props.pet.id)
}

function deletePet() {
  if (confirm('¿Estás seguro?')) {
    router.delete('/admin/mascotas/' + props.pet.id)
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Editar mascota</h1>
        <p class="mt-1 text-sm text-muted-foreground">Actualiza los datos de {{ pet.name }}.</p>
      </div>
    </div>

    <form @submit.prevent="submit" class="mt-6 max-w-2xl space-y-6">
      <div class="grid gap-2">
        <Label for="team_id">Organización</Label>
        <Select v-model="form.team_id" name="team_id">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Seleccionar organización" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="team in teams" :key="team.id" :value="String(team.id)">
              {{ team.name }}
            </SelectItem>
          </SelectContent>
        </Select>
        <InputError :message="form.errors.team_id" />
      </div>

      <div class="grid gap-2">
        <Label for="name">Nombre</Label>
        <Input id="name" v-model="form.name" type="text" placeholder="Nombre de la mascota" />
        <InputError :message="form.errors.name" />
      </div>

      <div class="grid gap-2">
        <Label for="species">Especie</Label>
        <Select v-model="form.species" name="species">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Seleccionar especie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="opt in speciesOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </SelectItem>
          </SelectContent>
        </Select>
        <InputError :message="form.errors.species" />
      </div>

      <div class="grid gap-2">
        <Label for="breed">Raza</Label>
        <Input id="breed" v-model="form.breed" type="text" placeholder="Raza" />
        <InputError :message="form.errors.breed" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label for="age_years">Edad (años)</Label>
          <Input id="age_years" v-model="form.age_years" type="number" min="0" />
          <InputError :message="form.errors.age_years" />
        </div>
        <div class="grid gap-2">
          <Label for="age_months">Edad (meses)</Label>
          <Input id="age_months" v-model="form.age_months" type="number" min="0" />
          <InputError :message="form.errors.age_months" />
        </div>
      </div>

      <div class="grid gap-2">
        <Label for="gender">Sexo</Label>
        <Select v-model="form.gender" name="gender">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Seleccionar sexo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="opt in genderOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </SelectItem>
          </SelectContent>
        </Select>
        <InputError :message="form.errors.gender" />
      </div>

      <div class="grid gap-2">
        <Label for="size">Tamaño</Label>
        <Select v-model="form.size" name="size">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Seleccionar tamaño" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="opt in sizeOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </SelectItem>
          </SelectContent>
        </Select>
        <InputError :message="form.errors.size" />
      </div>

      <div class="grid gap-2">
        <Label for="color">Color</Label>
        <Input id="color" v-model="form.color" type="text" placeholder="Color" />
        <InputError :message="form.errors.color" />
      </div>

      <div class="grid gap-2">
        <Label for="status">Estado</Label>
        <Select v-model="form.status" name="status">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Seleccionar estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </SelectItem>
          </SelectContent>
        </Select>
        <InputError :message="form.errors.status" />
      </div>

      <div class="grid gap-2">
        <Label for="photo">Foto</Label>
        <input
          id="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          @change="onPhotoChange"
          class="block w-full cursor-pointer rounded-lg border border-input bg-transparent text-sm text-muted-foreground file:me-4 file:border-0 file:bg-[#2D6A4F] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#246142]"
        />
        <div v-if="currentPreview" class="mt-2 overflow-hidden rounded-lg border border-border">
          <img :src="currentPreview" class="h-48 w-full object-cover" />
        </div>
        <div v-else-if="previewUrl" class="mt-2 overflow-hidden rounded-lg border border-border">
          <img :src="previewUrl" class="h-48 w-full object-cover" />
        </div>
        <InputError :message="form.errors.photo" />
      </div>

      <div class="grid gap-2">
        <Label for="description">Descripción</Label>
        <textarea id="description" v-model="form.description" rows="4" class="border-input focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50" placeholder="Descripción de la mascota"></textarea>
        <InputError :message="form.errors.description" />
      </div>

      <div class="grid gap-2">
        <Label for="medical_notes">Notas médicas</Label>
        <textarea id="medical_notes" v-model="form.medical_notes" rows="4" class="border-input focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50" placeholder="Notas médicas"></textarea>
        <InputError :message="form.errors.medical_notes" />
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <Button type="submit" :disabled="form.processing">Guardar cambios</Button>
          <a :href="'/admin/mascotas/' + pet.id" class="text-sm text-muted-foreground hover:text-foreground">Cancelar</a>
        </div>
        <Button type="button" variant="destructive" @click="deletePet">Eliminar</Button>
      </div>
    </form>
  </div>
</template>
