<script setup lang="ts">
import {
    ShieldCheck,
    Shield,
    ShieldHalf,
    Eye,
    Settings,
    CheckCircle2,
    ArrowLeft,
    Building2,
    Users,
    Mail,
    PawPrint,
    Heart,
    ClipboardList,
    FileText,
    CalendarDays,
    Megaphone,
    BarChart3,
    Database,
} from 'lucide-vue-next';

interface Permission { value: string; label: string }
interface PermissionGroup { module: string; permissions: Permission[] }
interface ModuleInfo { module: string; count: number }
interface UserRow {
    id: number;
    name: string;
    email: string;
}

interface Role {
    value: string;
    label: string;
    description: string;
    level: number;
    total_users: number;
}

const props = defineProps<{
    role: Role;
    permissions: PermissionGroup[];
    all_permissions: ModuleInfo[];
    users: UserRow[];
}>();

function levelColor(level: number): string {
    const map: Record<string, string> = {
        '10': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
        '9': 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
        '8': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
        '6': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400',
        '5': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
        '4': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
        '2': 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
        '1': 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
    };

    return map[String(level)] ?? 'bg-gray-100 text-gray-600';
}

function roleIcon(level: number) {
    if (level >= 9) {
return ShieldCheck;
}

    if (level >= 7) {
return Shield;
}

    if (level >= 5) {
return ShieldHalf;
}

    if (level >= 3) {
return Settings;
}

    return Eye;
}

const moduleIcons: Record<string, any> = {
    team: Building2,
    member: Users,
    invitation: Mail,
    pets: PawPrint,
    adoptions: Heart,
    'follow-ups': ClipboardList,
    blog: FileText,
    events: CalendarDays,
    announcements: Megaphone,
    reports: BarChart3,
    data: Database,
};

const moduleLabels: Record<string, string> = {
    team: 'Equipo', member: 'Miembros', invitation: 'Invitaciones',
    pets: 'Mascotas', adoptions: 'Adopciones', 'follow-ups': 'Seguimientos',
    blog: 'Blog', events: 'Eventos', announcements: 'Anuncios',
    reports: 'Reportes', data: 'Datos',
};

function permissionAction(p: string): string {
    const action = p.split(':')[1] ?? p;
    const map: Record<string, string> = {
        view: 'Ver', create: 'Crear', update: 'Editar', delete: 'Eliminar',
        add: 'Agregar', remove: 'Remover', cancel: 'Cancelar',
        'update-status': 'Cambiar estado', 'generate-docs': 'Generar documentos',
        export: 'Exportar',
    };

    return map[action] ?? action;
}

function totalPermissions() {
    return props.permissions.reduce((sum, g) => sum + g.permissions.length, 0);
}
</script>

<template>
    <div class="mx-auto max-w-6xl">
        <a href="/admin/roles"
            class="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-[#2D6A4F]">
            <ArrowLeft class="h-4 w-4" />
            Volver a Roles
        </a>

        <div class="mb-8 mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl"
                    :class="role.level >= 9 ? 'bg-purple-100 dark:bg-purple-900/30' : role.level >= 7 ? 'bg-blue-100 dark:bg-blue-900/30' : role.level >= 5 ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-gray-100 dark:bg-gray-800'">
                    <component :is="roleIcon(role.level)" class="h-6 w-6"
                        :class="role.level >= 9 ? 'text-purple-600' : role.level >= 7 ? 'text-blue-600' : role.level >= 5 ? 'text-emerald-600' : 'text-muted-foreground/70'" />
                </div>
                <div>
                    <div class="flex items-center gap-3">
                        <h1 class="text-2xl font-bold text-foreground">{{ role.label }}</h1>
                        <span class="rounded-full px-2.5 py-0.5 text-xs font-medium" :class="levelColor(role.level)">Nivel {{ role.level }}</span>
                    </div>
                    <p class="mt-0.5 text-sm text-muted-foreground">{{ role.description }}</p>
                </div>
            </div>
        </div>

        <div class="mb-8 grid grid-cols-3 gap-4">
            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-4 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <p class="text-xs font-medium text-muted-foreground/70 uppercase tracking-wide">Módulos</p>
                <p class="mt-1 text-2xl font-bold text-foreground">{{ permissions.length }}</p>
            </div>
            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-4 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <p class="text-xs font-medium text-muted-foreground/70 uppercase tracking-wide">Permisos Totales</p>
                <p class="mt-1 text-2xl font-bold text-foreground">{{ totalPermissions() }}</p>
            </div>
            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-4 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <p class="text-xs font-medium text-muted-foreground/70 uppercase tracking-wide">Usuarios con este rol</p>
                <p class="mt-1 text-2xl font-bold text-foreground">{{ role.total_users }}</p>
            </div>
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
            <div class="space-y-6 lg:col-span-2">
                <div v-for="group in permissions" :key="group.module"
                    class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                    <div class="mb-4 flex items-center justify-between">
                        <div class="flex items-center gap-2.5">
                            <div class="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2D6A4F]/15 bg-white dark:border-[#2D6A4F]/30 dark:bg-black/40">
                                <component :is="moduleIcons[group.module]" class="h-4 w-4 text-[#2D6A4F]" />
                            </div>
                            <h3 class="text-base font-semibold text-foreground capitalize">{{ moduleLabels[group.module] ?? group.module }}</h3>
                        </div>
                        <span class="rounded-full bg-[#2D6A4F]/10 px-2.5 py-0.5 text-xs font-medium text-[#2D6A4F] dark:bg-[#2D6A4F]/20">{{ group.permissions.length }} permisos</span>
                    </div>

                    <div class="flex flex-wrap gap-2">
                        <div v-for="p in group.permissions" :key="p.value"
                            class="flex items-center gap-1.5 rounded-xl border border-[#2D6A4F]/10 bg-[#2D6A4F]/4 px-3 py-2 dark:border-[#2D6A4F]/20 dark:bg-[#2D6A4F]/10">
                            <CheckCircle2 class="h-4 w-4 text-emerald-500" />
                            <span class="text-sm text-foreground">{{ permissionAction(p.value) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="space-y-4">
                <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                    <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Users class="h-4 w-4 text-[#2D6A4F]" />
                        Usuarios ({{ users.length }})
                    </h3>
                    <div v-if="users.length === 0" class="py-6 text-center text-sm text-muted-foreground">
                        Ningún usuario tiene este rol actualmente.
                    </div>
                    <ul v-else class="space-y-1.5">
                        <li v-for="user in users" :key="user.id">
                            <a :href="'/admin/usuarios/' + user.id"
                                class="flex items-center justify-between rounded-lg border border-[#2D6A4F]/10 bg-[#2D6A4F]/4 px-3 py-2.5 transition hover:border-[#2D6A4F]/30 dark:border-[#2D6A4F]/20 dark:bg-[#2D6A4F]/10 dark:hover:border-[#2D6A4F]/40">
                                <span class="flex items-center gap-2 text-sm text-foreground">
                                    {{ user.name }}
                                </span>
                                <span class="text-xs text-muted-foreground/60">{{ user.email }}</span>
                            </a>
                        </li>
                    </ul>
                </div>

                <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                    <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                        <BarChart3 class="h-4 w-4 text-[#2D6A4F]" />
                        Todos los módulos
                    </h3>
                    <ul class="space-y-2">
                        <li v-for="mod in all_permissions" :key="mod.module"
                            class="flex items-center justify-between rounded-lg border border-[#2D6A4F]/10 bg-[#2D6A4F]/4 px-3 py-2.5 dark:border-[#2D6A4F]/20 dark:bg-[#2D6A4F]/10">
                            <span class="flex items-center gap-2 text-sm text-foreground">
                                <component :is="moduleIcons[mod.module]" class="h-3.5 w-3.5 text-muted-foreground/70" />
                                {{ moduleLabels[mod.module] ?? mod.module }}
                            </span>
                            <span class="text-xs text-muted-foreground/60">{{ mod.count }} permisos</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
