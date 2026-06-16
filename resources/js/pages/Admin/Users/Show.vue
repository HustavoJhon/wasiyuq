<script setup lang="ts">
import { Link, useForm, router } from '@inertiajs/vue3';
import { ref } from 'vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Permission {
    key: string;
    label: string;
}

interface ModuleInfo {
    name: string;
    permissions: Permission[];
}

interface Membership {
    id: number;
    team: { id: number; name: string; slug: string };
    role: string;
    role_label: string;
    role_description: string;
    modules: ModuleInfo[];
}

interface UserDetail {
    id: number;
    name: string;
    email: string;
    is_super_admin: boolean;
    email_verified_at: string | null;
    created_at: string;
    memberships: Membership[];
    adoptions_count: number;
}

interface Team {
    id: number;
    name: string;
}

const props = defineProps<{
    user: UserDetail;
    teams: Team[];
}>();

const form = useForm({
    name: props.user.name,
    email: props.user.email,
    password: '',
    is_super_admin: props.user.is_super_admin,
});

const openModules = ref<Record<string, boolean>>({});

function toggleModule(teamName: string, moduleName: string) {
    const key = `${teamName}-${moduleName}`;
    openModules.value[key] = !openModules.value[key];
}

function isModuleOpen(teamName: string, moduleName: string): boolean {
    return !!openModules.value[`${teamName}-${moduleName}`];
}

function saveUser() {
    form.put('/admin/usuarios/' + props.user.id);
}

function destroyUser() {
    if (confirm(`¿Eliminar a "${props.user.name}"? Esta acción no se puede deshacer.`)) {
        router.delete('/admin/usuarios/' + props.user.id);
    }
}

function formatDate(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d));
}

function initials(name: string): string {
    return name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
}

function roleBadgeClass(role: string): string {
    const map: Record<string, string> = {
        owner: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
        admin: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
        organization_manager: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
        pet_manager: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
        blog_editor: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400',
        adoptions_coordinator: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400',
        member: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
        viewer: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
    };

    return map[role] ?? 'bg-gray-100 text-gray-600';
}

function moduleIcon(module: string): string {
    const icons: Record<string, string> = {
        team: '🏢', members: '👥', invitations: '📨',
        pets: '🐾', adoptions: '❤️',
        'follow-ups': '📋', blog: '📝',
        events: '📅', announcements: '📢',
        reports: '📊', data: '📁',
    };

    return icons[module] ?? '📌';
}

function permissionActionIcon(key: string): string {
    const action = key.split(':')[1];
    const icons: Record<string, string> = {
        view: '👁️', create: '➕', update: '✏️',
        delete: '🗑️', add: '➕', remove: '➖',
        cancel: '❌', 'update-status': '🔄',
        'generate-docs': '📄', export: '📥',
    };

    return icons[action] ?? '•';
}
</script>

<template>
    <div class="mx-auto max-w-5xl">
        <Link href="/admin/usuarios" class="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-[#2D6A4F]">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Volver a usuarios
        </Link>

        <div class="mt-6 rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div class="flex items-center gap-4">
                    <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#2D6A4F]/10 text-xl font-bold text-[#2D6A4F] dark:bg-[#2D6A4F]/20 dark:text-emerald-400">
                        {{ initials(user.name) }}
                    </div>
                    <div>
                        <div class="flex flex-wrap items-center gap-2">
                            <h1 class="text-2xl font-bold text-foreground">{{ user.name }}</h1>
                            <span v-if="user.is_super_admin" class="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                Super Admin
                            </span>
                            <span class="inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-medium" :class="user.email_verified_at ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'">
                                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path v-if="user.email_verified_at" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m9.364-5.364a9 9 0 11-12.728 0" />
                                </svg>
                                {{ user.email_verified_at ? 'Verificado' : 'No verificado' }}
                            </span>
                        </div>
                        <p class="mt-1 text-sm text-muted-foreground">{{ user.email }} · Registrado {{ formatDate(user.created_at) }}</p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <Link :href="'/admin/usuarios/' + user.id + '/editar'">
                        <Button variant="outline" size="sm" class="shrink-0">Editar Usuario</Button>
                    </Link>
                    <Button variant="outline" size="sm" class="shrink-0 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:hover:bg-red-950/30" @click="destroyUser">Eliminar</Button>
                </div>
            </div>
        </div>

        <div class="mt-6 grid gap-4 sm:grid-cols-3">
            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 px-5 py-5 text-center dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <p class="text-3xl font-bold text-[#2D6A4F] dark:text-emerald-400">{{ user.adoptions_count }}</p>
                <div class="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Adopciones
                </div>
            </div>
            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 px-5 py-5 text-center dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <p class="text-3xl font-bold text-[#2D6A4F] dark:text-emerald-400">{{ user.memberships.length }}</p>
                <div class="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Equipos
                </div>
            </div>
            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 px-5 py-5 text-center dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <p class="text-3xl font-bold text-[#2D6A4F] dark:text-emerald-400">{{ user.email_verified_at ? formatDate(user.email_verified_at) : '—' }}</p>
                <div class="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Verificado
                </div>
            </div>
        </div>

        <div class="mt-6 grid gap-6 lg:grid-cols-2">
            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="mb-5 flex items-center gap-2">
                    <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h2 class="text-base font-semibold text-foreground">Datos del Usuario</h2>
                </div>
                <form @submit.prevent="saveUser" class="space-y-4">
                    <div>
                        <Label for="show-name">Nombre</Label>
                        <Input id="show-name" v-model="form.name" class="mt-1" />
                    </div>
                    <div>
                        <Label for="show-email">Correo electrónico</Label>
                        <Input id="show-email" v-model="form.email" type="email" class="mt-1" />
                    </div>
                    <div>
                        <Label for="show-password">Nueva contraseña <span class="text-muted-foreground/60">(dejá vacío para mantener la actual)</span></Label>
                        <Input id="show-password" v-model="form.password" type="password" class="mt-1" />
                    </div>
                    <div class="flex items-center gap-2">
                        <Checkbox id="show-super-admin" :checked="form.is_super_admin" @update:checked="form.is_super_admin = !!$event" />
                        <Label for="show-super-admin" class="text-sm font-normal">Super Admin</Label>
                    </div>
                    <p v-if="form.recentlySuccessful" class="text-xs text-emerald-600">Datos guardados correctamente.</p>
                    <Button type="submit" :disabled="form.processing" class="bg-[#2D6A4F] hover:bg-[#245a40]">
                        {{ form.processing ? 'Guardando...' : 'Guardar Cambios' }}
                    </Button>
                </form>
            </div>

            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="mb-5 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <h2 class="text-base font-semibold text-foreground">Membresías y Permisos</h2>
                    </div>
                </div>

                <div v-if="user.memberships.length === 0" class="text-sm text-muted-foreground/60">Sin membresías.</div>
                <div v-else class="space-y-4">
                    <div v-for="m in user.memberships" :key="m.id" class="rounded-xl border border-[#2D6A4F]/10 p-4 dark:border-[#2D6A4F]/20">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2D6A4F]/10 text-xs font-bold text-[#2D6A4F] dark:bg-[#2D6A4F]/20 dark:text-emerald-400">
                                    {{ m.team.name.charAt(0).toUpperCase() }}
                                </div>
                                <div>
                                    <a :href="'/admin/organizaciones/' + m.team.slug" class="text-sm font-medium text-foreground transition hover:text-[#2D6A4F]">{{ m.team.name }}</a>
                                    <span class="ml-2 rounded-full px-2 py-0.5 text-[10px] font-medium" :class="roleBadgeClass(m.role)">{{ m.role_label }}</span>
                                </div>
                            </div>
                        </div>

                        <p class="mt-2 text-xs text-muted-foreground/70">{{ m.role_description }}</p>

                        <div class="mt-3 space-y-1.5">
                            <div v-for="mod in m.modules" :key="mod.name" class="rounded-lg border border-[#2D6A4F]/5 bg-[#2D6A4F]/3 px-3 py-2 dark:border-[#2D6A4F]/10 dark:bg-[#2D6A4F]/5">
                                <button @click="toggleModule(m.team.name, mod.name)" class="flex w-full items-center justify-between text-left">
                                    <span class="text-xs font-medium text-foreground">
                                        {{ moduleIcon(mod.name) }} {{ mod.name.charAt(0).toUpperCase() + mod.name.slice(1) }}
                                    </span>
                                    <svg class="h-3 w-3 text-muted-foreground/60 transition" :class="isModuleOpen(m.team.name, mod.name) ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <div v-if="isModuleOpen(m.team.name, mod.name)" class="mt-2 flex flex-wrap gap-1.5 border-t border-[#2D6A4F]/5 pt-2 dark:border-[#2D6A4F]/10">
                                    <span v-for="p in mod.permissions" :key="p.key" class="inline-flex items-center gap-1 rounded-md bg-white/60 px-2 py-0.5 text-[10px] text-muted-foreground dark:bg-black/20">
                                        {{ permissionActionIcon(p.key) }} {{ p.label }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
