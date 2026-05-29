<script setup lang="ts">
import { useForm } from '@inertiajs/vue3'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import InputError from '@/components/InputError.vue'

interface Pet {
  id: number
  name: string
  slug: string
  species: string
  breed: string | null
}

const props = defineProps<{
  selectedPet?: Pet | null
}>()

const tab = ref<'contact' | 'login' | 'register'>('contact')

const form = useForm({
  name: '',
  email: '',
  subject: props.selectedPet ? 'Adopción de ' + props.selectedPet.name : '',
  message: props.selectedPet ? 'Hola, quiero adoptar a ' + props.selectedPet.name : '',
  pet: props.selectedPet?.slug ?? '',
})

function speciesLabel(s: string): string {
  const labels: Record<string, string> = { dog: 'Perro', cat: 'Gato', rabbit: 'Conejo', bird: 'Ave', other: 'Otro' }

  return labels[s] ?? s
}

function handleSubmit() {
  form.post('/contacto', {
    onSuccess: () => {
      toast.success('Mensaje enviado correctamente. Te responderemos pronto.')
      form.reset()
    },
  })
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Contacto</h1>
      <p class="mt-3 text-muted-foreground">Estamos aquí para ayudarte. Elegí cómo querés comunicarte con nosotros.</p>
    </div>

    <div class="mt-10 mx-auto max-w-5xl">
      <div class="flex border-b border-border">
        <button class="px-6 py-3 text-sm font-medium transition border-b-2 -mb-px" :class="tab === 'contact' ? 'border-[#2D6A4F] text-[#2D6A4F]' : 'border-transparent text-muted-foreground hover:text-foreground'" @click="tab = 'contact'">Contacto</button>
        <button class="px-6 py-3 text-sm font-medium transition border-b-2 -mb-px" :class="tab === 'login' ? 'border-[#2D6A4F] text-[#2D6A4F]' : 'border-transparent text-muted-foreground hover:text-foreground'" @click="tab = 'login'">Iniciar sesión</button>
        <button class="px-6 py-3 text-sm font-medium transition border-b-2 -mb-px" :class="tab === 'register' ? 'border-[#2D6A4F] text-[#2D6A4F]' : 'border-transparent text-muted-foreground hover:text-foreground'" @click="tab = 'register'">Registrarse</button>
      </div>

      <div v-if="tab === 'contact'" class="mt-10 grid gap-12 lg:grid-cols-2">
        <div>
          <div v-if="selectedPet" class="mb-6 overflow-hidden rounded-2xl border border-border bg-card">
            <div class="flex items-center gap-4 p-4">
              <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#2D6A4F]/10">
                <svg class="h-7 w-7 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/></svg>
              </div>
              <div>
                <p class="text-sm font-semibold text-card-foreground">{{ selectedPet.name }}</p>
                <p class="text-xs text-muted-foreground">{{ speciesLabel(selectedPet.species) }}{{ selectedPet.breed ? ' - ' + selectedPet.breed : '' }}</p>
              </div>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-5">
            <div>
              <label class="text-sm font-medium text-foreground">Nombre completo</label>
              <input v-model="form.name" type="text" class="mt-1 block w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/50 focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]" :class="{ 'border-destructive': form.errors.name }" placeholder="Tu nombre">
              <InputError :message="form.errors.name" class="mt-1" />
            </div>
            <div>
              <label class="text-sm font-medium text-foreground">Correo electrónico</label>
              <input v-model="form.email" type="email" class="mt-1 block w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/50 focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]" :class="{ 'border-destructive': form.errors.email }" placeholder="correo@ejemplo.com">
              <InputError :message="form.errors.email" class="mt-1" />
            </div>
            <input v-if="form.pet" v-model="form.pet" type="hidden">
            <div>
              <label class="text-sm font-medium text-foreground">Asunto</label>
              <select v-model="form.subject" class="mt-1 block w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]" :class="{ 'border-destructive': form.errors.subject }">
                <option value="" disabled>Seleccionar</option>
                <option>Adopción</option>
                <option>Mi entidad</option>
                <option>Reportar un problema</option>
                <option>Otro</option>
              </select>
              <InputError :message="form.errors.subject" class="mt-1" />
            </div>
            <div>
              <label class="text-sm font-medium text-foreground">Mensaje</label>
              <textarea v-model="form.message" rows="4" class="mt-1 block w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/50 focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]" :class="{ 'border-destructive': form.errors.message }" placeholder="Escribí tu mensaje..." />
              <InputError :message="form.errors.message" class="mt-1" />
            </div>
            <button type="submit" :disabled="form.processing" class="w-full rounded-xl bg-[#2D6A4F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#246142] disabled:opacity-50">{{ form.processing ? 'Enviando...' : 'Enviar mensaje' }}</button>
          </form>
        </div>

        <div class="space-y-6">
          <div class="rounded-2xl bg-muted p-6">
            <h3 class="text-sm font-semibold text-foreground">Información de contacto</h3>
            <ul class="mt-4 space-y-3">
              <li class="flex items-start gap-3 text-sm text-muted-foreground">
                <svg class="mt-0.5 h-5 w-5 shrink-0 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <span>info@wasiyuq.pe</span>
              </li>
              <li class="flex items-start gap-3 text-sm text-muted-foreground">
                <svg class="mt-0.5 h-5 w-5 shrink-0 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span>Cusco, Perú</span>
              </li>
            </ul>
          </div>

          <div class="rounded-2xl bg-[#2D6A4F]/5 p-6">
            <h3 class="text-sm font-semibold text-foreground">¿Representás a una entidad?</h3>
            <p class="mt-2 text-sm text-muted-foreground">Registrate para publicar mascotas, eventos y anuncios en la plataforma.</p>
            <button class="mt-4 rounded-xl bg-[#2D6A4F] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#246142]" @click="tab = 'register'">Registrar entidad</button>
          </div>
        </div>
      </div>

      <div v-if="tab === 'login'" class="mx-auto mt-10 max-w-md">
        <form class="space-y-5">
          <div>
            <label class="text-sm font-medium text-foreground">Correo electrónico</label>
            <input type="email" class="mt-1 block w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/50 focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]" placeholder="correo@ejemplo.com">
          </div>
          <div>
            <label class="text-sm font-medium text-foreground">Contraseña</label>
            <input type="password" class="mt-1 block w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/50 focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]" placeholder="••••••••">
          </div>
          <button type="submit" class="w-full rounded-xl bg-[#2D6A4F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#246142]">Iniciar sesión</button>
          <p class="text-center text-sm text-muted-foreground">¿No tenés cuenta? <button class="font-medium text-[#2D6A4F] hover:underline" @click="tab = 'register'">Registrate</button></p>
        </form>
      </div>

      <div v-if="tab === 'register'" class="mx-auto mt-10 max-w-md">
        <form class="space-y-5">
          <div>
            <label class="text-sm font-medium text-foreground">Nombre completo</label>
            <input type="text" class="mt-1 block w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/50 focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]" placeholder="Tu nombre">
          </div>
          <div>
            <label class="text-sm font-medium text-foreground">Correo electrónico</label>
            <input type="email" class="mt-1 block w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/50 focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]" placeholder="correo@ejemplo.com">
          </div>
          <div>
            <label class="text-sm font-medium text-foreground">Contraseña</label>
            <input type="password" class="mt-1 block w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/50 focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]" placeholder="••••••••">
          </div>
          <div>
            <label class="text-sm font-medium text-foreground">Tipo de usuario</label>
            <select class="mt-1 block w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]">
              <option>Adoptante</option>
              <option>Entidad (Municipalidad/Albergue/ONG)</option>
              <option>Veterinario</option>
            </select>
          </div>
          <button type="submit" class="w-full rounded-xl bg-[#2D6A4F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#246142]">Crear cuenta</button>
          <p class="text-center text-sm text-muted-foreground">¿Ya tenés cuenta? <button class="font-medium text-[#2D6A4F] hover:underline" @click="tab = 'login'">Iniciá sesión</button></p>
        </form>
      </div>
    </div>
  </div>
</template>
