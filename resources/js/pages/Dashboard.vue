<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import DoughnutChart from '@/components/charts/DoughnutChart.vue';

interface Stats {
    total_pets: number;
    available_pets: number;
    adopted_pets: number;
    in_process_pets: number;
    total_adoptions: number;
    pending_adoptions: number;
    total_events: number;
    total_blog_posts: number;
    pending_follow_ups: number;
}

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
}

interface Team {
    id: number;
    name: string;
    slug: string;
}

const props = defineProps<{
    stats: Stats;
    species_counts?: Record<string, number>;
    recent_adoptions: RecentAdoption[];
    recent_pets: RecentPet[];
    currentTeam: Team;
}>();

const page = usePage();
const user = page.props.auth?.user as { is_super_admin?: boolean } | undefined;

const speciesChart = computed(() => {
    if (!props.species_counts) return [];
    const labels: Record<string, string> = { dog: 'Perros', cat: 'Gatos', rabbit: 'Conejos', bird: 'Aves', other: 'Otros' };
    const colors: Record<string, string> = { dog: '#0EA5E9', cat: '#F59E0B', rabbit: '#EC4899', bird: '#8B5CF6', other: '#2D6A4F' };
    return Object.entries(props.species_counts).map(([k, v]) => ({
        label: labels[k] ?? k, value: Number(v), color: colors[k] ?? '#2D6A4F',
    }));
});

const petStatusData = computed(() => [
    { label: 'Disponibles', value: Number(props.stats.available_pets), color: '#10B981' },
    { label: 'En Proceso', value: Number(props.stats.in_process_pets), color: '#F59E0B' },
    { label: 'Adoptados', value: Number(props.stats.adopted_pets), color: '#3B82F6' },
].filter(d => d.value > 0));

const total = computed(() => props.stats.total_pets || 1);

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
        in_process: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    };
    return map[s] ?? 'bg-gray-100 text-gray-600';
}

function formatDate(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d));
}
</script>

<template>
    <div>
        <div class="mb-8 flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2D6A4F]/10">
                <svg class="h-6 w-6 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            </div>
            <div>
                <h1 class="text-2xl font-bold text-foreground">{{ currentTeam.name }}</h1>
                <p class="mt-0.5 text-sm text-muted-foreground">Panel de administración de tu organización.</p>
            </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Link
                :href="`/${currentTeam.slug}/mascotas`"
                class="block rounded-xl border border-border bg-card p-5 transition hover:border-[#2D6A4F] hover:shadow-md"
            >
                <p class="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase">Total Mascotas</p>
                <p class="mt-1 text-3xl font-bold text-card-foreground">{{ stats.total_pets }}</p>
                <div class="mt-2 flex gap-3 text-xs text-muted-foreground">
                    <span>{{ stats.available_pets }} disponibles</span>
                    <span>{{ stats.adopted_pets }} adoptados</span>
                </div>
            </Link>

            <Link
                :href="`/${currentTeam.slug}/adopciones`"
                class="block rounded-xl border border-border bg-card p-5 transition hover:border-[#2D6A4F] hover:shadow-md"
            >
                <p class="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase">Adopciones</p>
                <p class="mt-1 text-3xl font-bold text-card-foreground">{{ stats.total_adoptions }}</p>
                <div class="mt-2 flex gap-3 text-xs text-muted-foreground">
                    <span class="text-amber-600">{{ stats.pending_adoptions }} pendientes</span>
                </div>
            </Link>

            <Link
                :href="`/${currentTeam.slug}/seguimientos`"
                class="block rounded-xl border border-border bg-card p-5 transition hover:border-[#2D6A4F] hover:shadow-md"
            >
                <p class="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase">Seguimiento</p>
                <p class="mt-1 text-3xl font-bold text-card-foreground">{{ stats.pending_follow_ups }}</p>
                <p class="mt-2 text-xs text-muted-foreground">Visitas pendientes</p>
            </Link>

            <Link
                :href="`/${currentTeam.slug}/eventos`"
                class="block rounded-xl border border-border bg-card p-5 transition hover:border-[#2D6A4F] hover:shadow-md"
            >
                <p class="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase">Eventos</p>
                <p class="mt-1 text-3xl font-bold text-card-foreground">{{ stats.total_events }}</p>
            </Link>

            <Link
                :href="`/${currentTeam.slug}/blog`"
                class="block rounded-xl border border-border bg-card p-5 transition hover:border-[#2D6A4F] hover:shadow-md"
            >
                <p class="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase">Blog</p>
                <p class="mt-1 text-3xl font-bold text-card-foreground">{{ stats.total_blog_posts }}</p>
                <p class="mt-2 text-xs text-muted-foreground">Artículos publicados</p>
            </Link>
        </div>

        <div v-if="user?.is_super_admin" class="mt-4">
            <Link
                href="/admin"
                class="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-[#2D6A4F] hover:text-[#2D6A4F]"
            >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Ir al panel global de administración
            </Link>
        </div>

        <!-- Charts -->
        <div v-if="speciesChart.length > 0 || petStatusData.length > 0" class="mt-8 grid gap-6 lg:grid-cols-2">
            <div v-if="petStatusData.length > 0" class="rounded-2xl border border-border/50 bg-card p-5 sm:p-6">
                <h2 class="mb-4 text-base font-semibold text-foreground">Distribución de mascotas por estado</h2>
                <DoughnutChart v-if="petStatusData.length > 1" :data="petStatusData" :size="180" :innerRadius="50" />
                <div v-else class="py-6 text-center text-sm text-muted-foreground">No hay suficientes datos para mostrar.</div>
            </div>
            <div v-if="speciesChart.length > 0" class="rounded-2xl border border-border/50 bg-card p-5 sm:p-6">
                <h2 class="mb-4 text-base font-semibold text-foreground">Mascotas por especie</h2>
                <DoughnutChart v-if="speciesChart.length > 1" :data="speciesChart" :size="180" :innerRadius="50" />
                <div v-else class="py-6 text-center text-sm text-muted-foreground">No hay suficientes datos para mostrar.</div>
            </div>
        </div>

        <div class="mt-10 grid gap-8 lg:grid-cols-2">
            <div>
                <div class="mb-5 flex items-center justify-between">
                    <h2 class="text-lg font-semibold text-foreground">Últimas adopciones</h2>
                    <Link :href="`/${currentTeam.slug}/adopciones`" class="text-xs font-medium text-[#2D6A4F] hover:underline">Ver todas</Link>
                </div>
                <p v-if="recent_adoptions.length === 0" class="text-sm text-muted-foreground/70 italic">Sin adopciones recientes.</p>
                <div v-else class="space-y-3">
                    <div
                        v-for="adoption in recent_adoptions"
                        :key="adoption.id"
                        class="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4"
                    >
                        <div>
                            <p class="text-sm font-medium text-card-foreground">{{ adoption.pet.name }}</p>
                            <p class="text-xs text-muted-foreground">{{ adoption.adopter.name }}</p>
                        </div>
                        <div class="text-right">
                            <span class="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium" :class="statusClass(adoption.status)">{{ statusLabel(adoption.status) }}</span>
                            <p class="mt-0.5 text-xs text-muted-foreground/70">{{ formatDate(adoption.created_at) }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div class="mb-5 flex items-center justify-between">
                    <h2 class="text-lg font-semibold text-foreground">Últimas mascotas registradas</h2>
                    <Link :href="`/${currentTeam.slug}/mascotas`" class="text-xs font-medium text-[#2D6A4F] hover:underline">Ver todas</Link>
                </div>
                <p v-if="recent_pets.length === 0" class="text-sm text-muted-foreground/70 italic">Sin mascotas registradas.</p>
                <div v-else class="space-y-3">
                    <div
                        v-for="pet in recent_pets"
                        :key="pet.id"
                        class="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4"
                    >
                        <div>
                            <p class="text-sm font-medium text-card-foreground">{{ pet.name }}</p>
                            <p class="text-xs text-muted-foreground">{{ pet.species }}</p>
                        </div>
                        <div class="text-right">
                            <span class="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium" :class="statusClass(pet.status)">{{ statusLabel(pet.status) }}</span>
                            <p class="mt-0.5 text-xs text-muted-foreground/70">{{ formatDate(pet.created_at) }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
