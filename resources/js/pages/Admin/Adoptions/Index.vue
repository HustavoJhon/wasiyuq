<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { ref, computed } from 'vue';

interface Adoption {
    id: number;
    status: string;
    created_at: string;
    pet: { id: number; name: string; slug: string; species: string };
    adopter: { id: number; name: string; email: string };
    team: { id: number; name: string; slug: string };
}

interface Meta {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

interface Stats {
    by_status: Record<string, number>;
    by_species: Record<string, number>;
    monthly: { month: string; count: number }[];
    recent_activity: number;
}

const props = defineProps<{
    adoptions: Adoption[];
    meta: Meta;
    filters?: { search?: string; status?: string; species?: string };
    stats?: Stats;
}>();

const search = ref(props.filters?.search ?? '');
const statusFilter = ref(props.filters?.status ?? '');
const speciesFilter = ref(props.filters?.species ?? '');

const speciesList = [
    { value: 'dog', label: 'Perros', emoji: '🐕' },
    { value: 'cat', label: 'Gatos', emoji: '🐈' },
    { value: 'rabbit', label: 'Conejos', emoji: '🐇' },
    { value: 'bird', label: 'Aves', emoji: '🐦' },
    { value: 'other', label: 'Otros', emoji: '🐾' },
];

const statusList = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'approved', label: 'Aprobada' },
    { value: 'rejected', label: 'Rechazada' },
    { value: 'completed', label: 'Completada' },
    { value: 'cancelled', label: 'Cancelada' },
];

const statusColors = {
    pending: 'bg-amber-500',
    approved: 'bg-blue-500',
    rejected: 'bg-red-500',
    completed: 'bg-emerald-500',
    cancelled: 'bg-gray-400',
} as Record<string, string>;

const chartColors = {
    pending: '#f59e0b',
    approved: '#3b82f6',
    rejected: '#ef4444',
    completed: '#10b981',
    cancelled: '#9ca3af',
} as Record<string, string>;

const speciesEmoji: Record<string, string> = { dog: '🐕', cat: '🐈', rabbit: '🐇', bird: '🐦', other: '🐾' };

const maxStatus = computed(() => Math.max(...Object.values(props.stats?.by_status ?? {}), 1));
const maxMonthly = computed(() => Math.max(...(props.stats?.monthly ?? []).map(m => m.count), 1));
const totalAdoptions = computed(() => Object.values(props.stats?.by_status ?? {}).reduce((a, b) => a + b, 0));

function statusClass(status: string): string {
    const map: Record<string, string> = {
        pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
        approved: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
        rejected: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
        completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
        cancelled: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
    };

    return map[status] ?? 'bg-gray-100 text-gray-600';
}

function statusLabel(s: string): string {
    const labels: Record<string, string> = { pending: 'Pendiente', approved: 'Aprobada', rejected: 'Rechazada', completed: 'Completada', cancelled: 'Cancelada' };

    return labels[s] ?? s;
}

function speciesLabel(s: string): string {
    const labels: Record<string, string> = { dog: 'Perro', cat: 'Gato', rabbit: 'Conejo', bird: 'Ave', other: 'Otro' };

    return labels[s] ?? s;
}

function formatDate(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d));
}

function formatMonth(m: string): string {
    const [y, mon] = m.split('-');
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    return months[parseInt(mon) - 1] + ' ' + y;
}

let debounceTimer: ReturnType<typeof setTimeout>;
function onSearchInput() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => applyFilters(), 300);
}

function applyFilters() {
    router.get('/admin/adopciones', {
        search: search.value || undefined,
        status: statusFilter.value || undefined,
        species: speciesFilter.value || undefined,
    }, { preserveState: true, replace: true });
}

function clearFilters() {
    search.value = '';
    statusFilter.value = '';
    speciesFilter.value = '';
    router.get('/admin/adopciones', {}, { preserveState: true, replace: true });
}

const hasActiveFilters = computed(() => !!(search.value || statusFilter.value || speciesFilter.value));
</script>

<template>
    <div class="mx-auto max-w-6xl">
        <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div class="flex items-center gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2D6A4F]/10">
                    <svg class="h-6 w-6 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-foreground">Adopciones</h1>
                    <p class="mt-0.5 text-sm text-muted-foreground">Todas las solicitudes de adopción del refugio.</p>
                </div>
            </div>
        </div>

        <div v-if="stats" class="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-4 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <p class="text-xs font-medium text-muted-foreground/70 uppercase tracking-wide">Total</p>
                <p class="mt-1 text-2xl font-bold text-foreground">{{ totalAdoptions }}</p>
            </div>
            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-4 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <p class="text-xs font-medium text-muted-foreground/70 uppercase tracking-wide">Pendientes</p>
                <p class="mt-1 text-2xl font-bold text-amber-500">{{ stats.by_status.pending ?? 0 }}</p>
            </div>
            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-4 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <p class="text-xs font-medium text-muted-foreground/70 uppercase tracking-wide">Completadas</p>
                <p class="mt-1 text-2xl font-bold text-emerald-500">{{ stats.by_status.completed ?? 0 }}</p>
            </div>
            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-4 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <p class="text-xs font-medium text-muted-foreground/70 uppercase tracking-wide">Últimos 30 días</p>
                <p class="mt-1 text-2xl font-bold text-[#2D6A4F]">{{ stats.recent_activity }}</p>
            </div>
        </div>

        <div v-if="stats" class="mb-6 grid gap-6 lg:grid-cols-2">
            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="mb-4 flex items-center gap-2">
                    <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h2 class="text-sm font-semibold text-foreground">Por estado</h2>
                </div>
                <div class="space-y-2.5">
                    <div v-for="st in statusList" :key="st.value" class="flex items-center gap-3">
                        <span class="w-24 text-xs text-muted-foreground/80">{{ st.label }}</span>
                        <div class="flex-1 h-4 rounded-full bg-[#2D6A4F]/8 dark:bg-[#2D6A4F]/15 overflow-hidden">
                            <div class="h-full rounded-full transition-all duration-500" :style="{ width: ((stats.by_status[st.value] ?? 0) / maxStatus * 100) + '%', backgroundColor: chartColors[st.value] }"></div>
                        </div>
                        <span class="w-8 text-right text-xs font-medium text-foreground">{{ stats.by_status[st.value] ?? 0 }}</span>
                    </div>
                </div>
            </div>

            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="mb-4 flex items-center gap-2">
                    <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h2 class="text-sm font-semibold text-foreground">Por especie</h2>
                </div>
                <div class="space-y-2.5">
                    <div v-for="sp in speciesList" :key="sp.value" class="flex items-center gap-3">
                        <span class="flex w-24 items-center gap-1.5 text-xs text-muted-foreground/80"><span>{{ sp.emoji }}</span> {{ sp.label }}</span>
                        <div class="flex-1 h-4 rounded-full bg-[#2D6A4F]/8 dark:bg-[#2D6A4F]/15 overflow-hidden">
                            <div class="h-full rounded-full bg-[#2D6A4F] transition-all duration-500" :style="{ width: ((stats.by_species[sp.value] ?? 0) / Math.max(...Object.values(stats.by_species), 1) * 100) + '%' }"></div>
                        </div>
                        <span class="w-8 text-right text-xs font-medium text-foreground">{{ stats.by_species[sp.value] ?? 0 }}</span>
                    </div>
                </div>
            </div>
        </div>



        <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex flex-1 flex-wrap items-center gap-2">
                <div class="relative max-w-xs flex-1">
                    <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input v-model="search" type="text" placeholder="Buscar adopciones..."
                        class="h-9 w-full rounded-xl border border-[#2D6A4F]/15 bg-white/60 pl-9 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/40 focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 dark:border-[#2D6A4F]/30 dark:bg-black/20"
                        @input="onSearchInput"
                    />
                </div>
                <select v-model="statusFilter" @change="applyFilters"
                    class="h-9 rounded-xl border border-[#2D6A4F]/15 bg-white/60 px-3 text-sm text-foreground outline-none transition focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 dark:border-[#2D6A4F]/30 dark:bg-black/20">
                    <option value="">Todos los estados</option>
                    <option v-for="st in statusList" :key="st.value" :value="st.value">{{ st.label }}</option>
                </select>
                <select v-model="speciesFilter" @change="applyFilters"
                    class="h-9 rounded-xl border border-[#2D6A4F]/15 bg-white/60 px-3 text-sm text-foreground outline-none transition focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 dark:border-[#2D6A4F]/30 dark:bg-black/20">
                    <option value="">Todas las especies</option>
                    <option v-for="sp in speciesList" :key="sp.value" :value="sp.value">{{ sp.emoji }} {{ sp.label }}</option>
                </select>
                <button v-if="hasActiveFilters" @click="clearFilters"
                    class="h-9 rounded-xl border border-[#2D6A4F]/15 px-3 text-sm text-muted-foreground transition hover:bg-[#2D6A4F]/8 hover:text-foreground dark:border-[#2D6A4F]/30">
                    Limpiar
                </button>
            </div>
            <p class="text-xs text-muted-foreground/60 whitespace-nowrap">{{ meta.total }} resultado{{ meta.total !== 1 ? 's' : '' }}</p>
        </div>

        <div v-if="adoptions.length === 0" class="mt-8 text-center">
            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2D6A4F]/10">
                <svg class="h-8 w-8 text-[#2D6A4F]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </div>
            <p class="mt-4 font-medium text-foreground">No hay solicitudes de adopción</p>
            <p class="mt-1 text-sm text-muted-foreground/70">Las solicitudes aparecerán aquí cuando los adoptantes se registren.</p>
        </div>

        <div v-else class="space-y-4">
            <div v-for="adoption in adoptions" :key="adoption.id" class="group rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 transition hover:border-[#2D6A4F]/30 hover:shadow-sm dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="flex items-start justify-between gap-4">
                    <div class="flex min-w-0 flex-1 items-start gap-4">
                        <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#2D6A4F]/15 bg-white text-lg dark:border-[#2D6A4F]/30 dark:bg-black/40">
                            {{ speciesEmoji[adoption.pet.species] ?? '🐾' }}
                        </div>
                        <div class="min-w-0 flex-1">
                            <div class="flex flex-wrap items-center gap-2">
                                <h3 class="text-base font-semibold text-foreground truncate">{{ adoption.pet.name }}</h3>
                                <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium" :class="statusClass(adoption.status)">{{ statusLabel(adoption.status) }}</span>
                            </div>
                            <div class="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground/70">
                                <span class="inline-flex items-center gap-1">
                                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    {{ adoption.adopter.name }}
                                </span>
                                <span class="inline-flex items-center gap-1">
                                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {{ adoption.adopter.email }}
                                </span>
                                <span class="inline-flex items-center gap-1">
                                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    {{ adoption.team.name }}
                                </span>
                                <span class="inline-flex items-center gap-1">
                                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {{ formatDate(adoption.created_at) }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <a :href="'/admin/adopciones/' + adoption.id" class="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground opacity-100 sm:opacity-0 transition hover:bg-[#2D6A4F]/10 hover:text-[#2D6A4F] sm:group-hover:opacity-100">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>

        <div v-if="meta.last_page > 1" class="mt-8 flex items-center justify-center gap-2">
            <a v-for="page in meta.last_page" :key="page"
                :href="'/admin/adopciones?page=' + page + (search ? '&search=' + encodeURIComponent(search) : '') + (statusFilter ? '&status=' + statusFilter : '') + (speciesFilter ? '&species=' + speciesFilter : '')"
                class="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all"
                :class="page === meta.current_page ? 'bg-[#2D6A4F] text-white shadow-sm shadow-[#2D6A4F]/20' : 'border border-[#2D6A4F]/15 text-muted-foreground hover:border-[#2D6A4F]/30 hover:text-foreground dark:border-[#2D6A4F]/30'"
            >{{ page }}</a>
        </div>
    </div>
</template>
