<script setup lang="ts">
interface User {
  id: number
  name: string
  email: string
  is_super_admin: boolean
  email_verified_at: string | null
  created_at: string
  memberships: { team: { name: string }, role: string }[]
}

interface Meta {
  current_page: number
  last_page: number
  total: number
  per_page: number
}

defineProps<{
  users: User[]
  meta: Meta
}>()

function formatDate(d: string): string {
  return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d))
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Usuarios</h1>
        <p class="mt-1 text-sm text-muted-foreground">Todos los usuarios registrados en la plataforma.</p>
      </div>
    </div>

    <div class="mt-6 overflow-hidden rounded-xl border border-border bg-card">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-border/50 bg-muted text-xs font-medium uppercase text-muted-foreground">
          <tr>
            <th class="px-5 py-3">Nombre</th>
            <th class="px-5 py-3">Email</th>
            <th class="px-5 py-3">Verificado</th>
            <th class="px-5 py-3">Super Admin</th>
            <th class="px-5 py-3">Equipos</th>
            <th class="px-5 py-3">Registro</th>
            <th class="px-5 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border/50">
          <tr v-for="user in users" :key="user.id" class="hover:bg-muted">
            <td class="px-5 py-4 font-medium text-card-foreground">{{ user.name }}</td>
            <td class="px-5 py-4 text-muted-foreground">{{ user.email }}</td>
            <td class="px-5 py-4">
              <span class="rounded-full px-3 py-0.5 text-xs font-medium" :class="user.email_verified_at ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">{{ user.email_verified_at ? 'Sí' : 'No' }}</span>
            </td>
            <td class="px-5 py-4">
              <span class="rounded-full px-3 py-0.5 text-xs font-medium" :class="user.is_super_admin ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'">{{ user.is_super_admin ? 'Sí' : 'No' }}</span>
            </td>
            <td class="px-5 py-4 text-muted-foreground">
              <template v-if="user.memberships.length > 0">
                <span v-for="(m, i) in user.memberships" :key="i">{{ m.team.name }}<span v-if="i < user.memberships.length - 1">, </span></span>
              </template>
              <span v-else class="text-gray-400">—</span>
            </td>
            <td class="px-5 py-4 text-gray-400">{{ formatDate(user.created_at) }}</td>
            <td class="px-5 py-4">
              <a :href="'/admin/usuarios/' + user.id" class="text-sm text-[#2D6A4F] hover:underline">Ver perfil</a>
            </td>
          </tr>
          <tr v-if="users.length === 0">
            <td colspan="7" class="px-5 py-8 text-center text-gray-400">No hay usuarios registrados.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="meta.last_page > 1" class="mt-6 flex justify-center gap-2">
      <a v-for="page in meta.last_page" :key="page" :href="'/admin/usuarios?page=' + page" class="rounded-lg px-3 py-1.5 text-sm" :class="page === meta.current_page ? 'bg-[#2D6A4F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'">{{ page }}</a>
    </div>
  </div>
</template>
