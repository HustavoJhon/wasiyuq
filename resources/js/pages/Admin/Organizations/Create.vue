<script setup lang="ts">
import { useForm } from '@inertiajs/vue3'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import InputError from '@/components/InputError.vue'

const form = useForm({
  name: '',
  bio: '',
  website: '',
  phone: '',
  address: '',
  city: '',
  state: '',
})

function submit() {
  form.post('/admin/organizaciones')
}
</script>

<template>
  <div>
    <a href="/admin/organizaciones" class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-[#2D6A4F]">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      Volver a organizaciones
    </a>

    <div class="mt-4">
      <h1 class="text-2xl font-bold text-foreground">Nueva Organización</h1>
      <p class="mt-1 text-sm text-muted-foreground">Registra una nueva organización en la plataforma.</p>
    </div>

    <form @submit.prevent="submit" class="mt-6 max-w-lg space-y-5">
      <div class="space-y-1.5">
        <Label for="name">Nombre *</Label>
        <Input id="name" v-model="form.name" :disabled="form.processing" />
        <InputError :message="form.errors.name" />
      </div>

      <div class="space-y-1.5">
        <Label for="bio">Descripción</Label>
        <textarea id="bio" v-model="form.bio" rows="3" class="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" :disabled="form.processing" />
        <InputError :message="form.errors.bio" />
      </div>

      <div class="space-y-1.5">
        <Label for="website">Sitio web</Label>
        <Input id="website" v-model="form.website" placeholder="https://" :disabled="form.processing" />
        <InputError :message="form.errors.website" />
      </div>

      <div class="space-y-1.5">
        <Label for="phone">Teléfono</Label>
        <Input id="phone" v-model="form.phone" :disabled="form.processing" />
        <InputError :message="form.errors.phone" />
      </div>

      <div class="space-y-1.5">
        <Label for="address">Dirección</Label>
        <Input id="address" v-model="form.address" :disabled="form.processing" />
        <InputError :message="form.errors.address" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <Label for="city">Ciudad</Label>
          <Input id="city" v-model="form.city" :disabled="form.processing" />
          <InputError :message="form.errors.city" />
        </div>

        <div class="space-y-1.5">
          <Label for="state">Departamento</Label>
          <Input id="state" v-model="form.state" :disabled="form.processing" />
          <InputError :message="form.errors.state" />
        </div>
      </div>

      <div class="flex items-center gap-3 pt-2">
        <Button type="submit" :disabled="form.processing" class="bg-[#2D6A4F] text-white hover:bg-[#1B4332]">
          {{ form.processing ? 'Guardando...' : 'Guardar' }}
        </Button>
        <a href="/admin/organizaciones" class="text-sm text-muted-foreground hover:text-foreground">Cancelar</a>
      </div>
    </form>
  </div>
</template>
