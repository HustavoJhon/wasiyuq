<script setup lang="ts">
import { useForm, router } from '@inertiajs/vue3'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import InputError from '@/components/InputError.vue'

interface Membership {
  id: number
  role: string
  team: { id: number; name: string; slug: string }
}

interface Adoption {
  id: number
  status: string
  motivation: string | null
  created_at: string
  pet: { id: number; name: string; slug: string; species: string }
  team: { id: number; name: string; slug: string }
}

interface ProfileUser {
  id: number
  name: string
  email: string
  is_super_admin: boolean
  created_at: string
  team_memberships: Membership[]
}

const props = defineProps<{
  profile: ProfileUser
  adoptions: Adoption[]
}>()

const form = useForm({ name: props.profile.name })

function submit() {
  form.put('/admin/perfil')
}

function statusLabel(s: string): string {
  const labels: Record<string, string> = {
    pending: 'Pendiente',
    approved: 'Aprobada',
    rejected: 'Rechazada',
    completed: 'Completada',
    cancelled: 'Cancelada',
  }
  return labels[s] ?? s
}

function statusClass(s: string): string {
  const map: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-blue-100 text-blue-700',
    rejected: 'bg-red-100 text-red-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-gray-100 text-gray-600',
  }
  return map[s] ?? 'bg-gray-100 text-gray-600'
}

function formatDate(d: string): string {
  return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d))
}

function speciesLabel(s: string): string {
  const labels: Record<string, string> = { dog: 'Perro', cat: 'Gato', rabbit: 'Conejo', bird: 'Ave', other: 'Otro' }
  return labels[s] ?? s
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Mi Perfil</h1>
        <p class="mt-1 text-sm text-muted-foreground">Informacion de tu cuenta y actividad en la plataforma.</p>
      </div>
    </div>

    <div class="mt-8 grid gap-8 lg:grid-cols-3">
      <div class="space-y-6 lg:col-span-2">
        <div class="rounded-xl border border-border bg-card p-6">
          <h2 class="text-lg font-semibold text-card-foreground">Informacion personal</h2>

          <form @submit.prevent="submit" class="mt-4 space-y-4">
            <div>
              <Label for="name">Nombre</Label>
              <div class="mt-1 flex items-center gap-3">
                <Input id="name" v-model="form.name" class="max-w-xs" />
                <Button size="sm" type="submit" :disabled="form.processing">Guardar</Button>
              </div>
              <InputError :message="form.errors.name" />
            </div>
          </form>

          <div class="mt-6 space-y-4 border-t border-border/50 pt-6">
            <div>
              <p class="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">Correo electronico</p>
              <p class="mt-1 text-sm text-card-foreground">{{ profile.email }}</p>
              <p class="mt-1 text-xs text-muted-foreground/70">
                <a href="/settings/profile" class="text-[#2D6A4F] hover:underline">Cambiar correo</a>
              </p>
            </div>
            <div>
              <p class="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">Miembro desde</p>
              <p class="mt-1 text-sm text-card-foreground">{{ formatDate(profile.created_at) }}</p>
            </div>
            <div>
              <p class="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">Rol</p>
              <span class="mt-1 inline-block rounded-full px-3 py-0.5 text-xs font-medium" :class="profile.is_super_admin ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'">{{ profile.is_super_admin ? 'Super Admin' : 'Administrador' }}</span>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-border bg-card p-6">
          <h2 class="text-lg font-semibold text-card-foreground">Mis adopciones</h2>
          <p v-if="adoptions.length === 0" class="mt-4 text-sm text-muted-foreground/70">No has realizado ninguna adopcion.</p>
          <div v-else class="mt-4 space-y-3">
            <div v-for="adoption in adoptions" :key="adoption.id" class="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4">
              <div>
                <a :href="'/admin/adopciones/' + adoption.id" class="text-sm font-medium text-card-foreground hover:text-[#2D6A4F]">{{ adoption.pet.name }}</a>
                <p class="text-xs text-muted-foreground">{{ speciesLabel(adoption.pet.species) }} - {{ adoption.team.name }}</p>
              </div>
              <div class="text-right">
                <span class="rounded-full px-3 py-0.5 text-xs font-medium" :class="statusClass(adoption.status)">{{ statusLabel(adoption.status) }}</span>
                <p class="mt-0.5 text-xs text-muted-foreground/70">{{ formatDate(adoption.created_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="rounded-xl border border-border bg-card p-6">
          <h2 class="text-sm font-semibold text-card-foreground">Organizaciones</h2>
          <div v-if="profile.team_memberships.length === 0" class="mt-3 text-xs text-muted-foreground/70">Sin membresias.</div>
          <ul v-else class="mt-3 space-y-3">
            <li v-for="m in profile.team_memberships" :key="m.id" class="flex items-center justify-between">
              <a :href="'/admin/organizaciones/' + m.team.slug" class="text-sm text-card-foreground hover:text-[#2D6A4F]">{{ m.team.name }}</a>
              <span class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{{ m.role === 'owner' ? 'Duenta' : m.role === 'admin' ? 'Admin' : 'Miembro' }}</span>
            </li>
          </ul>
        </div>

        <div class="rounded-xl border border-border bg-card p-6">
          <h2 class="text-sm font-semibold text-card-foreground">Accesos rapidos</h2>
          <ul class="mt-3 space-y-2">
            <li><a href="/settings/profile" class="text-sm text-[#2D6A4F] hover:underline">Configuracion de perfil</a></li>
            <li><a href="/settings/security" class="text-sm text-[#2D6A4F] hover:underline">Seguridad y contrasena</a></li>
            <li><a href="/settings/appearance" class="text-sm text-[#2D6A4F] hover:underline">Apariencia</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
