<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Users, Settings, User, Shield } from 'lucide-vue-next';

interface Member { id: number; name: string; email: string; avatar: string | null; role: string; role_label: string; }
interface Team { id: number; name: string; slug: string; }

const props = defineProps<{ members: Member[]; currentTeam: Team }>();

function avatarLetter(name: string) { return name.charAt(0).toUpperCase(); }
function avatarColor(i: number) { const c = ['bg-[#2D6A4F]', 'bg-amber-600', 'bg-sky-600', 'bg-rose-600', 'bg-violet-600']; return c[i % c.length]; }
function roleIcon(role: string) { return role === 'owner' ? Shield : role === 'admin' ? Settings : User; }
</script>

<template>
    <div class="mx-auto max-w-4xl">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl font-bold text-foreground">Miembros del equipo</h1>
                <p class="mt-1 text-sm text-muted-foreground">{{ currentTeam.name }}</p>
            </div>
            <Link :href="`/settings/teams/${currentTeam.slug}`" class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2D6A4F] to-[#40916C] px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-[#2D6A4F]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <Settings class="h-4 w-4" />Gestionar equipo
            </Link>
        </div>

        <div class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div class="rounded-xl border border-border/50 bg-card p-4"><p class="text-xs font-medium text-muted-foreground/70 uppercase">Miembros</p><p class="mt-1 text-2xl font-bold text-foreground">{{ members.length }}</p></div>
            <div class="rounded-xl border border-amber-200/60 bg-amber-50/30 p-4 dark:border-amber-900/30 dark:bg-amber-950/20"><p class="text-xs font-medium text-amber-700/70 uppercase">Owners</p><p class="mt-1 text-2xl font-bold text-amber-700 dark:text-amber-400">{{ members.filter(m => m.role === 'owner').length }}</p></div>
            <div class="rounded-xl border border-blue-200/60 bg-blue-50/30 p-4 dark:border-blue-900/30 dark:bg-blue-950/20"><p class="text-xs font-medium text-blue-700/70 uppercase">Admins</p><p class="mt-1 text-2xl font-bold text-blue-700 dark:text-blue-400">{{ members.filter(m => m.role === 'admin').length }}</p></div>
        </div>

        <div v-if="members.length === 0" class="mt-12 flex flex-col items-center"><Users class="h-12 w-12 text-muted-foreground/30" /><p class="mt-4 text-muted-foreground">No hay miembros en este equipo.</p></div>

        <div v-else class="mt-8 grid gap-3 sm:grid-cols-2">
            <div v-for="(member, i) in members" :key="member.id" class="flex items-center gap-4 rounded-xl border border-border/50 bg-card p-4 transition hover:shadow-sm">
                <div :class="['flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm', avatarColor(i)]">{{ avatarLetter(member.name) }}</div>
                <div class="min-w-0 flex-1"><p class="font-semibold text-foreground truncate">{{ member.name }}</p><p class="text-xs text-muted-foreground truncate">{{ member.email }}</p></div>
                <span class="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"><component :is="roleIcon(member.role)" class="h-3 w-3" />{{ member.role_label }}</span>
            </div>
        </div>

        <p class="mt-8 rounded-xl border border-border/50 bg-muted/30 p-4 text-center text-xs text-muted-foreground/60">Para invitar, cambiar roles o eliminar miembros, usa el botón "Gestionar equipo".</p>
    </div>
</template>
