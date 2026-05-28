<script setup lang="ts">
import { router } from '@inertiajs/vue3'

interface Organization {
  id: number
  name: string
  slug: string
  city: string | null
  state: string | null
  pets_count: number
  adoptions_count: number
  announcements_count: number
  blog_posts_count: number
  created_at: string
}

interface Meta {
  current_page: number
  last_page: number
  total: number
  per_page: number
}

defineProps<{
  organizations: Organization[]
  meta: Meta
}>()

function formatDate(d: string): string {
  return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d))
}

function destroy(id: number): void {
  if (confirm('¿Eliminar esta organización?')) {
    router.delete('/admin/organizaciones/' + id)
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Organizaciones</h1>
        <p class="mt-1 text-sm text-muted-foreground">Entidades registradas en la plataforma.</p>
        <a href="/admin/organizaciones/crear" class="rounded-lg bg-[#2D6A4F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#246142]">Nueva Organización</a>
      </div>
    </div>

    <div class="mt-6 overflow-hidden rounded-xl border border-border bg-card">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-border/50 bg-muted text-xs font-medium uppercase text-muted-foreground">
          <tr>
            <th class="px-5 py-3">Nombre</th>
            <th class="px-5 py-3">Ubicación</th>
            <th class="px-5 py-3 text-center">Mascotas</th>
            <th class="px-5 py-3 text-center">Adopciones</th>
            <th class="px-5 py-3 text-center">Eventos</th>
            <th class="px-5 py-3 text-center">Blog</th>
            <th class="px-5 py-3">Registro</th>
            <th class="px-5 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border/50">
          <tr v-for="org in organizations" :key="org.id" class="hover:bg-muted">
            <td class="px-5 py-4">
              <a :href="'/admin/organizaciones/' + org.slug" class="font-medium text-[#2D6A4F] hover:underline">{{ org.name }}</a>
            </td>
            <td class="px-5 py-4 text-muted-foreground">{{ org.city ?? org.state ?? '-' }}</td>
            <td class="px-5 py-4 text-center text-muted-foreground">{{ org.pets_count }}</td>
            <td class="px-5 py-4 text-center text-muted-foreground">{{ org.adoptions_count }}</td>
            <td class="px-5 py-4 text-center text-muted-foreground">{{ org.announcements_count }}</td>
            <td class="px-5 py-4 text-center text-muted-foreground">{{ org.blog_posts_count }}</td>
            <td class="px-5 py-4 text-muted-foreground/70">{{ formatDate(org.created_at) }}</td>
            <td class="px-5 py-4">
              <div class="flex items-center gap-2">
                <a :href="'/admin/organizaciones/' + org.slug" class="text-xs text-[#2D6A4F] hover:underline">Ver</a>
                <a :href="'/admin/organizaciones/' + org.slug + '/editar'" class="text-xs text-muted-foreground hover:text-[#2D6A4F]">Editar</a>
                <button @click="destroy(org.id)" class="text-xs text-red-500 hover:text-red-700">Eliminar</button>
              </div>
            </td>
          </tr>
          <tr v-if="organizations.length === 0">
            <td colspan="8" class="px-5 py-8 text-center text-muted-foreground/70">No hay organizaciones registradas.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="meta.last_page > 1" class="mt-6 flex justify-center gap-2">
      <a v-for="page in meta.last_page" :key="page" :href="'/admin/organizaciones?page=' + page" class="rounded-lg px-3 py-1.5 text-sm" :class="page === meta.current_page ? 'bg-[#2D6A4F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'">{{ page }}</a>
    </div>
  </div>
</template>
