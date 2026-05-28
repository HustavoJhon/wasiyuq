<script setup lang="ts">
import { useForm, router } from '@inertiajs/vue3'
import { Button } from '@/components/ui/button'

interface UserDetail {
  id: number
  name: string
  email: string
  is_super_admin: boolean
  email_verified_at: string | null
  created_at: string
  memberships: { id: number, team: { id: number, name: string, slug: string }, role: string }[]
  adoptions_count: number
}

const props = defineProps<{ user: UserDetail }>()

const form = useForm({ is_super_admin: props.user.is_super_admin })

function toggleSuperAdmin() {
  form.is_super_admin = !form.is_super_admin
  form.put('/admin/usuarios/' + props.user.id + '/role')
}

function formatDate(d: string): string {
  return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d))
}
</script>

<template>
  <div>
    <a href="/admin/usuarios" class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-[#2D6A4F]">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      Volver a usuarios
    </a>

    <div class="mt-6 rounded-xl border border-border bg-card p-6">
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-2xl font-bold text-foreground">{{ user.name }}</h1>
          <p class="mt-1 text-sm text-muted-foreground">{{ user.email }}</p>
        </div>
        <span class="rounded-full px-3 py-0.5 text-xs font-medium" :class="user.email_verified_at ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">{{ user.email_verified_at ? 'Verificado' : 'No verificado' }}</span>
      </div>

      <div class="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
        <span>Registrado: {{ formatDate(user.created_at) }}</span>
      </div>

      <div class="mt-4 flex items-center gap-3">
        <span class="text-sm text-muted-foreground">Super Admin</span>
        <Button variant="outline" size="sm" @click="toggleSuperAdmin">
          {{ form.is_super_admin ? 'Remover' : 'Otorgar' }}
        </Button>
      </div>
    </div>

    <div class="mt-8">
      <h2 class="text-lg font-semibold text-foreground">Membresías en equipos</h2>
      <div v-if="user.memberships.length === 0" class="mt-3 text-sm text-muted-foreground/70">Sin membresías.</div>
      <div v-else class="mt-3 overflow-hidden rounded-xl border border-border bg-card">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-border/50 bg-muted text-xs font-medium uppercase text-muted-foreground">
            <tr>
              <th class="px-5 py-3">Organización</th>
              <th class="px-5 py-3">Rol</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border/50">
            <tr v-for="m in user.memberships" :key="m.id" class="hover:bg-muted">
              <td class="px-5 py-4 font-medium text-card-foreground">{{ m.team.name }}</td>
              <td class="px-5 py-4 text-muted-foreground">{{ m.role }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="mt-8 grid grid-cols-3 gap-4">
      <div class="rounded-lg border border-border bg-muted p-4 text-center">
        <p class="text-2xl font-bold text-card-foreground">{{ user.adoptions_count }}</p>
        <p class="text-xs text-muted-foreground">Adopciones</p>
      </div>
    </div>
  </div>
</template>
