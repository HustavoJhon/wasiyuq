<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import {
    PawPrint, Building2, Handshake, Users, CalendarDays, FileText,
    ClipboardList, TrendingUp, Heart, Dog, Activity,
} from 'lucide-vue-next';
import { computed } from 'vue';
import { Badge } from '@/components/ui/badge';
import DoughnutChart from '@/components/charts/DoughnutChart.vue';
import admin from '@/routes/admin';

interface Stats {
    total_pets: number;
    available_pets: number;
    adopted_pets: number;
    total_organizations: number;
    total_adoptions: number;
    pending_adoptions: number;
    total_events: number;
    total_blog_posts: number;
    pending_follow_ups: number;
    total_users: number;
}

interface TrendItem { label: string; value: number }

interface RecentAdoption {
    id: number;
    status: string;
    created_at: string;
    pet: { id: number; name: string; slug: string };
    adopter: { id: number; name: string };
}

interface RecentPet {
    id: number;
    name: string;
    slug: string;
    species: string;
    status: string;
    created_at: string;
    team: { id: number; name: string };
}

const props = defineProps<{
    stats: Stats;
    species_counts?: Record<string, number>;
    recent_adoptions: RecentAdoption[];
    recent_pets: RecentPet[];
    adoptions_trend: TrendItem[];
}>();

const maxTrend = computed(() => Math.max(...props.adoptions_trend.map(t => t.value), 1));

const speciesChart = computed(() => {
    if (!props.species_counts) return [];
    const labels: Record<string, string> = { dog: 'Perros', cat: 'Gatos', rabbit: 'Conejos', bird: 'Aves', other: 'Otros' };
    const colors: Record<string, string> = { dog: '#0EA5E9', cat: '#F59E0B', rabbit: '#EC4899', bird: '#8B5CF6', other: '#2D6A4F' };
    return Object.entries(props.species_counts).map(([k, v]) => ({
        label: labels[k] ?? k, value: Number(v), color: colors[k] ?? '#2D6A4F',
    }));
});

function statusLabel(s: string): string {
    const map: Record<string, string> = {
        pending: 'Pendiente', approved: 'Aprobada', rejected: 'Rechazada',
        completed: 'Completada', cancelled: 'Cancelada',
        available: 'Disponible', adopted: 'Adoptado', in_process: 'En Proceso',
    };

    return map[s] ?? s;
}

function statusClass(s: string): string {
    const map: Record<string, string> = {
        pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
        approved: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
        rejected: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
        completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
        cancelled: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
        available: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
        adopted: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    };

    return map[s] ?? 'bg-gray-100 text-gray-600';
}

function formatDate(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d));
}

const petStatusPct = computed(() => {
    const total = props.stats.total_pets || 1;

    return {
        available: (props.stats.available_pets / total * 100),
        adopted: (props.stats.adopted_pets / total * 100),
        other: ((total - props.stats.available_pets - props.stats.adopted_pets) / total * 100),
    };
});

const metricCards = [
    { title: 'Total Mascotas', value: props.stats.total_pets, sub: `${props.stats.available_pets} disponibles · ${props.stats.adopted_pets} adoptados`, icon: PawPrint, href: admin.pets.index().url, color: 'text-emerald-600' },
    { title: 'Organizaciones', value: props.stats.total_organizations, icon: Building2, href: admin.organizations.index().url, color: 'text-sky-600' },
    { title: 'Adopciones', value: props.stats.total_adoptions, sub: `${props.stats.pending_adoptions} pendientes`, icon: Heart, href: admin.adoptions.index().url, color: 'text-amber-600' },
    { title: 'Usuarios', value: props.stats.total_users, icon: Users, href: admin.users.index().url, color: 'text-purple-600' },
    { title: 'Eventos', value: props.stats.total_events, icon: CalendarDays, href: admin.events.index().url, color: 'text-rose-600' },
    { title: 'Blog', value: props.stats.total_blog_posts, icon: FileText, href: admin.blog.index().url, color: 'text-indigo-600' },
    { title: 'Seguimientos Pend.', value: props.stats.pending_follow_ups, icon: ClipboardList, href: admin.followUps.index().url, color: props.stats.pending_follow_ups > 0 ? 'text-red-600' : 'text-muted-foreground' },
    { title: 'Pico Mensual', value: props.adoptions_trend.length > 0 ? Math.max(...props.adoptions_trend.map(t => t.value)) : 0, sub: 'Adopciones en un mes', icon: TrendingUp, color: 'text-[#2D6A4F]' },
];
</script>

<template>
    <div class="mx-auto max-w-7xl">
        <div class="mb-8 flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2D6A4F]/10">
                <svg class="h-6 w-6 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            </div>
            <div>
                <h1 class="text-2xl font-bold text-foreground">Panel de Administración</h1>
                <p class="mt-0.5 text-sm text-muted-foreground">Vista general de toda la plataforma Wasiyuq.</p>
            </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            <Link v-for="card in metricCards" :key="card.title"
                v-bind="card.href ? { href: card.href } : {}"
                class="group rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 transition hover:border-[#2D6A4F]/30 hover:shadow-sm dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="flex items-start justify-between">
                    <p class="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase">{{ card.title }}</p>
                    <component :is="card.icon" class="h-5 w-5 text-muted-foreground/60 transition-transform group-hover:scale-110" />
                </div>
                <p class="mt-2 text-3xl font-bold text-foreground">{{ card.value }}</p>
                <p v-if="card.sub" class="mt-1.5 text-xs text-muted-foreground">{{ card.sub }}</p>
            </Link>
        </div>

        <div class="mt-8 grid gap-6 lg:grid-cols-3">
            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40 lg:col-span-2">
                <div class="mb-6 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <h2 class="text-base font-semibold text-foreground">Actividad de Adopciones</h2>
                    </div>
                    <span class="text-xs text-muted-foreground/60">Últimos 12 meses</span>
                </div>
                <div class="flex items-end gap-2" style="height: 180px;">
                    <div v-for="t in adoptions_trend" :key="t.label" class="flex flex-1 flex-col items-center gap-1.5 h-full justify-end">
                        <span class="text-[10px] font-medium text-foreground/70">{{ t.value }}</span>
                        <div class="w-full rounded-t-lg bg-[#2D6A4F] transition-all duration-500"
                            :style="{ height: (t.value / maxTrend * 140) + 'px', minHeight: t.value > 0 ? '4px' : '0px', opacity: 0.6 + (t.value / maxTrend * 0.4) }"></div>
                        <span class="text-[10px] font-medium text-muted-foreground/60">{{ t.label }}</span>
                    </div>
                </div>
            </div>

            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="mb-5 flex items-center gap-2">
                    <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                    <h2 class="text-base font-semibold text-foreground">Estado de Mascotas</h2>
                </div>
                <div class="space-y-4">
                    <div>
                        <div class="flex items-center justify-between text-sm">
                            <span class="flex items-center gap-2"><span class="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Disponibles</span>
                            <span class="font-medium text-foreground">{{ stats.available_pets }}</span>
                        </div>
                        <div class="mt-1.5 h-2.5 w-full rounded-full bg-[#2D6A4F]/8 dark:bg-[#2D6A4F]/15 overflow-hidden">
                            <div class="h-full rounded-full bg-emerald-500 transition-all duration-500" :style="{ width: petStatusPct.available + '%' }"></div>
                        </div>
                    </div>
                    <div>
                        <div class="flex items-center justify-between text-sm">
                            <span class="flex items-center gap-2"><span class="h-2.5 w-2.5 rounded-full bg-blue-500" /> Adoptados</span>
                            <span class="font-medium text-foreground">{{ stats.adopted_pets }}</span>
                        </div>
                        <div class="mt-1.5 h-2.5 w-full rounded-full bg-[#2D6A4F]/8 dark:bg-[#2D6A4F]/15 overflow-hidden">
                            <div class="h-full rounded-full bg-blue-500 transition-all duration-500" :style="{ width: petStatusPct.adopted + '%' }"></div>
                        </div>
                    </div>
                    <div>
                        <div class="flex items-center justify-between text-sm">
                            <span class="flex items-center gap-2"><span class="h-2.5 w-2.5 rounded-full bg-amber-400" /> Otros</span>
                            <span class="font-medium text-foreground">{{ stats.total_pets - stats.available_pets - stats.adopted_pets }}</span>
                        </div>
                        <div class="mt-1.5 h-2.5 w-full rounded-full bg-[#2D6A4F]/8 dark:bg-[#2D6A4F]/15 overflow-hidden">
                            <div class="h-full rounded-full bg-amber-400 transition-all duration-500" :style="{ width: petStatusPct.other + '%' }"></div>
                        </div>
                    </div>
                </div>
                <div class="mt-5 flex items-center justify-between rounded-xl border border-[#2D6A4F]/10 bg-[#2D6A4F]/4 px-4 py-3 dark:border-[#2D6A4F]/20 dark:bg-[#2D6A4F]/10">
                    <span class="text-sm text-muted-foreground">Total mascotas</span>
                    <span class="text-lg font-bold text-foreground">{{ stats.total_pets }}</span>
                </div>
            </div>

            <div v-if="speciesChart.length > 1" class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="mb-4 flex items-center gap-2">
                    <Dog class="h-5 w-5 text-[#2D6A4F]" />
                    <h2 class="text-base font-semibold text-foreground">Mascotas por especie</h2>
                </div>
                <DoughnutChart :data="speciesChart" :size="160" :innerRadius="45" />
            </div>
        </div>

        <div class="mt-8 grid gap-6 lg:grid-cols-2">
            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="mb-5 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <h2 class="text-base font-semibold text-foreground">Últimas Adopciones</h2>
                    </div>
                    <Link :href="admin.adoptions.index().url" class="text-xs font-medium text-[#2D6A4F] hover:underline">Ver todas</Link>
                </div>
                <p v-if="recent_adoptions.length === 0" class="text-sm text-muted-foreground/60 italic">Sin adopciones recientes.</p>
                <div v-else class="space-y-2.5">
                    <div v-for="a in recent_adoptions" :key="a.id"
                        class="flex items-center justify-between rounded-xl border border-[#2D6A4F]/10 bg-[#2D6A4F]/4 px-4 py-3 transition hover:bg-[#2D6A4F]/8 dark:border-[#2D6A4F]/20 dark:bg-[#2D6A4F]/10 dark:hover:bg-[#2D6A4F]/15">
                        <div class="flex items-center gap-3">
                            <div class="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2D6A4F]/15 bg-white dark:border-[#2D6A4F]/30 dark:bg-black/40">
                                <Heart class="h-4 w-4 text-[#2D6A4F]" />
                            </div>
                            <div>
                                <p class="text-sm font-medium text-foreground">{{ a.pet?.name ?? 'Mascota eliminada' }}</p>
                                <p class="text-xs text-muted-foreground/70">{{ a.adopter.name }}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="rounded-full px-2.5 py-0.5 text-xs font-medium" :class="statusClass(a.status)">{{ statusLabel(a.status) }}</span>
                            <span class="text-xs text-muted-foreground/60">{{ formatDate(a.created_at) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="mb-5 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        <h2 class="text-base font-semibold text-foreground">Últimas Mascotas</h2>
                    </div>
                    <Link :href="admin.pets.index().url" class="text-xs font-medium text-[#2D6A4F] hover:underline">Ver todas</Link>
                </div>
                <p v-if="recent_pets.length === 0" class="text-sm text-muted-foreground/60 italic">Sin mascotas registradas.</p>
                <div v-else class="space-y-2.5">
                    <div v-for="p in recent_pets" :key="p.id"
                        class="flex items-center justify-between rounded-xl border border-[#2D6A4F]/10 bg-[#2D6A4F]/4 px-4 py-3 transition hover:bg-[#2D6A4F]/8 dark:border-[#2D6A4F]/20 dark:bg-[#2D6A4F]/10 dark:hover:bg-[#2D6A4F]/15">
                        <div class="flex items-center gap-3">
                            <div class="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2D6A4F]/15 bg-white dark:border-[#2D6A4F]/30 dark:bg-black/40">
                                <Dog class="h-4 w-4 text-[#2D6A4F]" />
                            </div>
                            <div>
                                <p class="text-sm font-medium text-foreground">{{ p.name }}</p>
                                <p class="text-xs text-muted-foreground/70">{{ p.team.name }}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="rounded-full px-2.5 py-0.5 text-xs font-medium" :class="statusClass(p.status)">{{ statusLabel(p.status) }}</span>
                            <span class="text-xs text-muted-foreground/60">{{ formatDate(p.created_at) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
