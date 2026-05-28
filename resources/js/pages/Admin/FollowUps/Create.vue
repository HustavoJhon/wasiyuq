<script setup lang="ts">
interface AdoptionOption {
  id: number
  pet: { id: number; name: string }
  adopter: { id: number; name: string }
}

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

const props = defineProps<{ adoptions: AdoptionOption[] }>()

const form = useForm({
  adoption_id: '',
  scheduled_date: '',
  status: 'pending',
  notes: '',
})

function submit() {
  form.post('/admin/seguimiento')
}
</script>

<template>
  <div>
    <a href="/admin/seguimiento" class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-[#2D6A4F]">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      Volver a seguimiento
    </a>

    <div class="mt-4">
      <h1 class="text-2xl font-bold text-foreground">Nuevo seguimiento</h1>
    </div>

    <div class="mt-8 max-w-2xl">
      <form @submit.prevent="submit" class="space-y-6">
        <div class="space-y-2">
          <Label for="adoption_id">Adopción</Label>
          <Select v-model="form.adoption_id">
            <SelectTrigger id="adoption_id" class="w-full">
              <SelectValue placeholder="Selecciona una adopción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="a in adoptions" :key="a.id" :value="String(a.id)">
                {{ a.pet.name }} - {{ a.adopter.name }}
              </SelectItem>
            </SelectContent>
          </Select>
          <InputError :message="form.errors.adoption_id" />
        </div>

        <div class="space-y-2">
          <Label for="scheduled_date">Fecha programada</Label>
          <Input id="scheduled_date" v-model="form.scheduled_date" type="date" />
          <InputError :message="form.errors.scheduled_date" />
        </div>

        <div class="space-y-2">
          <Label for="status">Estado</Label>
          <Select v-model="form.status">
            <SelectTrigger id="status" class="w-full">
              <SelectValue placeholder="Selecciona un estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="completed">Completado</SelectItem>
              <SelectItem value="missed">Perdido</SelectItem>
            </SelectContent>
          </Select>
          <InputError :message="form.errors.status" />
        </div>

        <div class="space-y-2">
          <Label for="notes">Notas</Label>
          <textarea id="notes" v-model="form.notes" rows="4" class="border-input placeholder:text-muted-foreground flex w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" placeholder="Notas opcionales" />
          <InputError :message="form.errors.notes" />
        </div>

        <div class="flex items-center gap-4">
          <Button type="submit" :disabled="form.processing">
            {{ form.processing ? 'Guardando...' : 'Guardar' }}
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>
