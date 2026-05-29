<script setup lang="ts">
interface Permission {
  value: string
  label: string
}

interface PermissionGroup {
  module: string
  permissions: Permission[]
}

interface ModuleInfo {
  module: string
  count: number
}

interface Role {
  value: string
  label: string
  description: string
  level: number
}

defineProps<{
  role: Role
  permissions: PermissionGroup[]
  all_permissions: ModuleInfo[]
}>()

const getLevelColor = (level: number) => {
  if (level >= 9) {
return 'bg-red-100 text-red-800'
}

  if (level >= 7) {
return 'bg-purple-100 text-purple-800'
}

  if (level >= 5) {
return 'bg-blue-100 text-blue-800'
}

  if (level >= 3) {
return 'bg-green-100 text-green-800'
}

  return 'bg-gray-100 text-gray-800'
}

const getRoleDescription = (role_value: string) => {
  const descriptions: Record<string, string> = {
    'owner': 'Tiene acceso total y control ilimitado sobre toda la organización',
    'admin': 'Administración completa incluyendo gestión de equipos y todos los módulos',
    'organization_manager': 'Gestiona la organización, mascotas, adopciones y seguimientos',
    'pet_manager': 'Responsable del registro y gestión de mascotas',
    'blog_editor': 'Crea y edita contenido de blog, eventos y anuncios',
    'adoptions_coordinator': 'Coordina el proceso de adopciones y seguimientos post-adopción',
    'member': 'Acceso básico con permisos de lectura sobre mascotas, adopciones y blog',
    'viewer': 'Acceso de solo lectura a toda la información',
  }

  return descriptions[role_value] || ''
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="space-y-4 border-b border-border pb-8">
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-3xl font-bold text-foreground">{{ role.label }}</h1>
          <p class="mt-2 text-sm text-muted-foreground">{{ role.description }}</p>
        </div>
        <span :class="['rounded-full px-3 py-1 text-sm font-semibold', getLevelColor(role.level)]">
          Nivel {{ role.level }}
        </span>
      </div>

      <div class="max-w-2xl rounded-lg bg-muted/50 p-4">
        <p class="text-sm text-muted-foreground">{{ getRoleDescription(role.value) }}</p>
      </div>
    </div>

    <!-- Permissions by module -->
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-foreground">Permisos por Módulo</h2>

      <div class="grid gap-6 md:grid-cols-2">
        <div
          v-for="group in permissions"
          :key="group.module"
          class="rounded-xl border border-border bg-card p-6"
        >
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-bold text-card-foreground capitalize">{{ group.module }}</h3>
              <span class="rounded-full bg-[#2D6A4F]/10 px-3 py-1 text-xs font-semibold text-[#2D6A4F]">
                {{ group.permissions.length }} permisos
              </span>
            </div>

            <ul class="space-y-2">
              <li
                v-for="permission in group.permissions"
                :key="permission.value"
                class="flex items-start gap-3 rounded-lg bg-muted/30 p-3"
              >
                <svg class="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                <div>
                  <p class="text-sm font-medium text-card-foreground">{{ permission.label }}</p>
                  <p class="text-xs text-muted-foreground">{{ permission.value }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary stats -->
    <div class="grid gap-4 md:grid-cols-3 border-t border-border pt-8">
      <div class="rounded-lg bg-muted/50 p-4">
        <p class="text-xs font-semibold text-muted-foreground uppercase">Módulos</p>
        <p class="mt-1 text-2xl font-bold text-foreground">{{ permissions.length }}</p>
      </div>
      <div class="rounded-lg bg-muted/50 p-4">
        <p class="text-xs font-semibold text-muted-foreground uppercase">Permisos Totales</p>
        <p class="mt-1 text-2xl font-bold text-foreground">{{ permissions.reduce((sum, g) => sum + g.permissions.length, 0) }}</p>
      </div>
      <div class="rounded-lg bg-muted/50 p-4">
        <p class="text-xs font-semibold text-muted-foreground uppercase">Módulos Disponibles</p>
        <p class="mt-1 text-2xl font-bold text-foreground">{{ all_permissions.length }}</p>
      </div>
    </div>

    <!-- Back button -->
    <a href="/admin/roles" class="inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted/80">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Volver a Roles
    </a>
  </div>
</template>
