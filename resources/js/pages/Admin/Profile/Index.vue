<script setup lang="ts">
import { useForm, router } from '@inertiajs/vue3';
import AppearanceTabs from '@/components/AppearanceTabs.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Membership {
    id: number;
    role: string;
    team: { id: number; name: string; slug: string };
}

interface Adoption {
    id: number;
    status: string;
    motivation: string | null;
    created_at: string;
    pet: { id: number; name: string; slug: string; species: string };
    team: { id: number; name: string; slug: string };
}

interface ProfileUser {
    id: number;
    name: string;
    email: string;
    is_super_admin: boolean;
    created_at: string;
    team_memberships: Membership[];
}

const props = defineProps<{
    profile: ProfileUser;
    adoptions: Adoption[];
}>();

const form = useForm({ name: props.profile.name });

function submit() {
    form.put('/admin/perfil');
}

function statusLabel(s: string): string {
    const labels: Record<string, string> = {
        pending: 'Pendiente',
        approved: 'Aprobada',
        rejected: 'Rechazada',
        completed: 'Completada',
        cancelled: 'Cancelada',
    };

    return labels[s] ?? s;
}

function statusClass(s: string): string {
    const map: Record<string, string> = {
        pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
        approved: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
        rejected: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
        completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
        cancelled: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    };

    return map[s] ?? 'bg-gray-100 text-gray-600';
}

function formatDate(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d));
}

function speciesEmoji(s: string): string {
    const map: Record<string, string> = { dog: '🐕', cat: '🐈', rabbit: '🐇', bird: '🐦', other: '🐾' };

    return map[s] ?? '🐾';
}

function roleLabel(r: string): string {
    const labels: Record<string, string> = { owner: 'Dueña', admin: 'Admin', member: 'Miembro' };

    return labels[r] ?? r;
}

function destroyUser() {
    if (confirm('¿Estás segura de eliminar tu cuenta? Esta acción no se puede deshacer.')) {
        router.delete('/admin/usuarios/' + props.profile.id);
    }
}
</script>

<template>
    <div class="mx-auto max-w-6xl">
        <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2D6A4F]/10">
                    <svg class="h-6 w-6 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-foreground">Mi perfil</h1>
                    <p class="mt-0.5 text-sm text-muted-foreground">Información de tu cuenta y actividad en la plataforma.</p>
                </div>
            </div>
        </div>

        <div class="grid gap-8 lg:grid-cols-3">
            <div class="space-y-6 lg:col-span-2">
                <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                    <div class="mb-5 flex items-center gap-2">
                        <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <h2 class="text-base font-semibold text-foreground">Información personal</h2>
                    </div>

                    <form @submit.prevent="submit" class="grid gap-4 sm:grid-cols-3">
                        <div class="sm:col-span-2">
                            <Label for="name">Nombre</Label>
                            <div class="mt-1 flex items-center gap-3">
                                <Input id="name" v-model="form.name" class="w-full" :disabled="form.processing" />
                                <Button size="sm" type="submit" :disabled="form.processing">
                                    {{ form.processing ? 'Guardando...' : 'Guardar' }}
                                </Button>
                            </div>
                            <InputError :message="form.errors.name" />
                        </div>
                    </form>

                    <div class="mt-6 grid gap-5 border-t border-[#2D6A4F]/10 pt-6 sm:grid-cols-3 dark:border-[#2D6A4F]/20">
                        <div>
                            <p class="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase">Correo electrónico</p>
                            <p class="mt-1 text-sm text-foreground">{{ profile.email }}</p>
                            <a href="/settings/profile" class="mt-0.5 inline-block text-xs text-[#2D6A4F] hover:underline">Cambiar correo</a>
                        </div>
                        <div>
                            <p class="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase">Miembro desde</p>
                            <p class="mt-1 text-sm text-foreground">{{ formatDate(profile.created_at) }}</p>
                        </div>
                        <div>
                            <p class="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase">Rol</p>
                            <span class="mt-1 inline-block rounded-full px-3 py-0.5 text-xs font-medium"
                                :class="profile.is_super_admin
                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400'
                                    : 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400'">
                                {{ profile.is_super_admin ? 'Super Admin' : 'Administrador' }}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                    <div class="mb-5 flex items-center gap-2">
                        <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <h2 class="text-base font-semibold text-foreground">Mis adopciones</h2>
                    </div>

                    <p v-if="adoptions.length === 0" class="text-sm text-muted-foreground/60 italic">No has realizado ninguna adopción.</p>

                    <div v-else class="space-y-3">
                        <div v-for="adoption in adoptions" :key="adoption.id"
                            class="flex items-center justify-between rounded-xl border border-[#2D6A4F]/10 bg-[#2D6A4F]/4 p-4 transition hover:bg-[#2D6A4F]/8 dark:border-[#2D6A4F]/20 dark:bg-[#2D6A4F]/10 dark:hover:bg-[#2D6A4F]/15">
                            <div class="flex items-center gap-3">
                                <span class="text-lg">{{ speciesEmoji(adoption.pet?.species) }}</span>
                                <div>
                                    <a :href="'/admin/adopciones/' + adoption.id"
                                        class="text-sm font-medium text-foreground hover:text-[#2D6A4F]">
                                        {{ adoption.pet?.name ?? 'Mascota eliminada' }}
                                    </a>
                                    <p class="text-xs text-muted-foreground">{{ adoption.team.name }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <span class="rounded-full px-3 py-0.5 text-xs font-medium"
                                    :class="statusClass(adoption.status)">{{ statusLabel(adoption.status) }}</span>
                                <span class="text-xs text-muted-foreground/70">{{ formatDate(adoption.created_at) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="space-y-6">
                <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                    <h3 class="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <svg class="h-4 w-4 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Organizaciones
                    </h3>
                    <div v-if="profile.team_memberships.length === 0" class="mt-3 text-xs text-muted-foreground/60 italic">
                        Sin membresías.
                    </div>
                    <ul v-else class="mt-3 space-y-3">
                        <li v-for="m in profile.team_memberships" :key="m.id"
                            class="flex items-center justify-between rounded-lg border border-[#2D6A4F]/10 bg-[#2D6A4F]/4 px-3 py-2.5 dark:border-[#2D6A4F]/20 dark:bg-[#2D6A4F]/10">
                            <a :href="'/admin/organizaciones/' + m.team.slug"
                                class="text-sm font-medium text-foreground hover:text-[#2D6A4F]">
                                {{ m.team.name }}
                            </a>
                            <span class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                {{ roleLabel(m.role) }}
                            </span>
                        </li>
                    </ul>
                </div>

                <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                    <h3 class="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <svg class="h-4 w-4 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Accesos rápidos
                    </h3>
                    <ul class="mt-3 space-y-2">
                        <li>
                            <a href="/settings/profile" class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition hover:bg-[#2D6A4F]/8 dark:hover:bg-[#2D6A4F]/15">
                                <svg class="h-4 w-4 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Configuración de perfil
                            </a>
                        </li>
                        <li>
                            <a href="/settings/security" class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition hover:bg-[#2D6A4F]/8 dark:hover:bg-[#2D6A4F]/15">
                                <svg class="h-4 w-4 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                Seguridad y contraseña
                            </a>
                        </li>
                        <li>
                            <div class="rounded-lg border border-[#2D6A4F]/10 bg-[#2D6A4F]/4 px-3 py-2.5 dark:border-[#2D6A4F]/20 dark:bg-[#2D6A4F]/10">
                                <p class="flex items-center gap-2 text-xs font-medium text-muted-foreground/80 mb-2">
                                    <svg class="h-3.5 w-3.5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                    </svg>
                                    Apariencia
                                </p>
                                <AppearanceTabs />
                            </div>
                        </li>
                    </ul>
                </div>

                <div class="rounded-2xl border border-red-200 bg-gradient-to-b from-white to-red-50/50 p-5 dark:border-red-900/40 dark:from-red-950/20 dark:to-black/40">
                    <h3 class="flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        Zona de peligro
                    </h3>
                    <p class="mt-2 text-xs text-red-600/70 dark:text-red-400/70">Eliminar tu cuenta es irreversible. Todos tus datos serán borrados.</p>
                    <button type="button" @click="destroyUser"
                        class="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-500 transition hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30">
                        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Eliminar cuenta
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
