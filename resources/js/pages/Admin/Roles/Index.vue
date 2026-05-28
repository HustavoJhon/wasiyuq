<script setup lang="ts">
import { computed } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

interface Role {
  value: string
  label: string
  description: string
  level: number
  modules: Record<string, any>
  total_permissions: number
}

const props = defineProps<{
  roles: Role[]
}>()

const rolesByLevel = computed(() => {
  return [...props.roles].sort((a, b) => b.level - a.level)
})

const getLevelColor = (level: number) => {
  if (level >= 9) return 'bg-red-100 text-red-800'
  if (level >= 7) return 'bg-purple-100 text-purple-800'
  if (level >= 5) return 'bg-blue-100 text-blue-800'
  if (level >= 3) return 'bg-green-100 text-green-800'
  return 'bg-gray-100 text-gray-800'
}
</script>

<template>
  <DashboardLayout>
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Gestión de Roles</h1>
        <p class="mt-1 text-sm text-muted-foreground">Explora los diferentes roles disponibles y sus permisos</p>
      </div>

      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <a
          v-for="role in rolesByLevel"
          :key="role.value"
          :href="`/admin/roles/${role.value}`"
          class="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition hover:border-[#2D6A4F] hover:shadow-lg"
        >
          <!-- Background gradient effect -->
          <div class="absolute inset-0 bg-gradient-to-br from-[#2D6A4F]/5 to-transparent opacity-0 transition group-hover:opacity-100" />

          <!-- Content -->
          <div class="relative space-y-3">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-lg font-bold text-card-foreground">{{ role.label }}</h3>
                <p class="mt-1 text-xs text-muted-foreground">{{ role.description }}</p>
              </div>
              <span :class="['rounded-full px-2.5 py-0.5 text-xs font-semibold', getLevelColor(role.level)]">
                Nivel {{ role.level }}
              </span>
            </div>

            <!-- Modules preview -->
            <div class="space-y-2 pt-2">
              <p class="text-xs font-semibold text-muted-foreground">Módulos disponibles:</p>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="module_name in Object.keys(role.modules)"
                  :key="module_name"
                  class="inline-block rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {{ module_name }}
                </span>
              </div>
            </div>

            <!-- Stats -->
            <div class="border-t border-border/50 pt-2 text-xs text-muted-foreground/70">
              {{ role.total_permissions }} permisos · {{ Object.keys(role.modules).length }} módulos
            </div>
          </div>

          <!-- Arrow indicator -->
          <div class="absolute right-4 bottom-4 text-[#2D6A4F]/50 transition group-hover:translate-x-1">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </a>
      </div>
    </div>
  </DashboardLayout>
</template>
