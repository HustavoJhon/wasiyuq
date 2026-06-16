<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import { usePhotoUrl } from '@/composables/usePhotoUrl';

interface Pet {
    id: number;
    name: string;
    slug: string;
    species: string;
    status: string;
    photos: string[] | null;
    created_at: string;
    team: { id: number; name: string; slug: string };
}

interface Meta {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

interface Team {
    id: number;
    name: string;
    slug: string;
}

const props = defineProps<{
    pets: Pet[];
    meta: Meta;
    filters: { search?: string; species?: string; status?: string; team_id?: string };
    teams: Team[];
    stats: {
        by_status: Record<string, number>;
        by_species: Record<string, number>;
        by_team: Record<string, number>;
    };
}>();

const searchInput = ref(props.filters.search ?? '');
const selectedSpecies = ref(props.filters.species ?? '');
const selectedStatus = ref(props.filters.status ?? '');
const selectedTeam = ref(props.filters.team_id ?? '');

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

function applyFilters() {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        router.get('/admin/mascotas', {
            search: searchInput.value || '',
            species: selectedSpecies.value,
            status: selectedStatus.value,
            team_id: selectedTeam.value,
            page: 1,
        }, {
            preserveState: true,
            replace: true,
        });
    }, 300);
}

function clearFilters() {
    searchInput.value = '';
    selectedSpecies.value = '';
    selectedStatus.value = '';
    selectedTeam.value = '';
    router.get('/admin/mascotas', { page: 1 }, { preserveState: true, replace: true });
}

function hasFilters(): boolean {
    return !!(props.filters.search || props.filters.species || props.filters.status || props.filters.team_id);
}

const teamNames = computed(() => {
    const map: Record<string, string> = {};
    for (const t of props.teams) {
        map[String(t.id)] = t.name;
    }
    return map;
});

const { photoUrl } = usePhotoUrl();

const speciesLabels: Record<string, string> = {
    dog: 'Perro', cat: 'Gato', rabbit: 'Conejo', bird: 'Ave', other: 'Otro',
};

const speciesColors: Record<string, string> = {
    dog: '#16a34a', cat: '#eab308', rabbit: '#a855f7', bird: '#0ea5e9', other: '#78716c',
};

const statusLabels: Record<string, string> = {
    available: 'Disponible', adopted: 'Adoptado', in_process: 'En Proceso', withheld: 'Reservado',
};

const statusColors: Record<string, string> = {
    available: '#16a34a', adopted: '#2563eb', in_process: '#d97706', withheld: '#78716c',
};

function speciesLabel(s: string): string {
    return speciesLabels[s] ?? s;
}

const speciesEmoji: Record<string, string> = {
    dog: '🐕', cat: '🐈', rabbit: '🐇', bird: '🐦', other: '🐾',
};

function statusLabel(s: string): string {
    return statusLabels[s] ?? s;
}

function statusColor(s: string): string {
    const colors: Record<string, string> = {
        available: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
        adopted: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
        in_process: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
        withheld: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    };
    return colors[s] ?? 'bg-gray-100 text-gray-600';
}

function formatDate(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d));
}

function destroy(id: number): void {
    if (confirm('¿Eliminar esta mascota?')) {
        router.delete('/admin/mascotas/' + id);
    }
}

const CHART_RADIUS = 36;
const CHART_STROKE = 14;
const CHART_CIRCUMFERENCE = 2 * Math.PI * CHART_RADIUS;

function donutSegments(data: Record<string, number>, colorMap: Record<string, string>, nameMap?: Record<string, string>) {
    const entries = Object.entries(data);
    if (entries.length === 0) return [];
    const total = entries.reduce((sum, [, val]) => sum + Number(val), 0);
    if (total === 0) return [];
    const gap = 4;
    const totalGap = entries.length * gap;
    const available = 360 - totalGap;
    let currentAngle = 0;
    return entries.map(([key, val]) => {
        const numVal = Number(val);
        const pct = numVal / total;
        const angle = pct * available + gap;
        const startAngle = currentAngle + gap / 2;
        const offset = (startAngle / 360) * CHART_CIRCUMFERENCE;
        const length = (angle / 360) * CHART_CIRCUMFERENCE;
        currentAngle += angle;
        return {
            key,
            value: numVal,
            pct: Math.round(pct * 100),
            dasharray: `${Math.max(length, 0.5)} ${CHART_CIRCUMFERENCE}`,
            dashoffset: -offset,
            color: colorMap[key] ?? '#78716c',
            name: nameMap?.[key] ?? speciesLabels[key] ?? statusLabels[key] ?? key,
        };
    });
}

const statusChart = computed(() => donutSegments(props.stats.by_status, statusColors));
const speciesChart = computed(() => donutSegments(props.stats.by_species, speciesColors));
const teamChart = computed(() => {
    const byTeam = props.stats.by_team;
    const palette = ['#16a34a', '#2563eb', '#d97706', '#a855f7', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16', '#06b6d4'];
    const teamColorMap: Record<string, string> = {};
    let i = 0;
    for (const teamId of Object.keys(byTeam)) {
        teamColorMap[teamId] = palette[i % palette.length];
        i++;
    }
    return donutSegments(byTeam, teamColorMap, teamNames.value);
});

const pageLinks = computed(() => {
    const links = [];
    for (let i = 1; i <= props.meta.last_page; i++) {
        links.push(i);
    }
    return links;
});
</script>

<template>
    <div>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl font-bold text-foreground">Mascotas</h1>
                <p class="mt-1 text-sm text-muted-foreground">
                    {{ meta.total }} mascota{{ meta.total !== 1 ? 's' : '' }} registrada{{ meta.total !== 1 ? 's' : '' }} en la plataforma.
                </p>
            </div>
            <a
                href="/admin/mascotas/crear"
                class="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#2D6A4F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#246142]"
            >
                <svg class="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Nueva Mascota
            </a>
        </div>

        <div class="mt-6 grid gap-4 sm:grid-cols-3">
            <div v-for="(chart, idx) in [
                { label: 'Por estado', data: statusChart, empty: Object.keys(stats.by_status).length === 0 },
                { label: 'Por especie', data: speciesChart, empty: Object.keys(stats.by_species).length === 0 },
                { label: 'Por organización', data: teamChart, empty: Object.keys(stats.by_team).length === 0 },
            ]" :key="idx" class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <h3 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{{ chart.label }}</h3>
                <div v-if="chart.empty" class="mt-6 flex flex-col items-center justify-center py-4 text-muted-foreground/50">
                    <svg class="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    </svg>
                    <p class="mt-2 text-xs">Sin datos</p>
                </div>
                <template v-else>
                    <div class="mt-3 flex items-center justify-center">
                        <svg viewBox="0 0 100 100" class="h-32 w-32">
                            <circle cx="50" cy="50" r="36" fill="none" stroke="#e2e8f0" stroke-width="14" class="dark:stroke-neutral-700" />
                            <g v-for="item in chart.data" :key="item.key">
                                <circle
                                    cx="50" cy="50" r="36"
                                    fill="none"
                                    :stroke="item.color"
                                    stroke-width="14"
                                    stroke-linecap="round"
                                    :stroke-dasharray="item.dasharray"
                                    :stroke-dashoffset="item.dashoffset"
                                    transform="rotate(-90 50 50)"
                                    class="transition-all duration-300 hover:opacity-80"
                                    style="filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.2))"
                                />
                            </g>
                            <text x="50" y="44" text-anchor="middle" class="fill-foreground text-[22px] font-bold" dominant-baseline="central">{{ meta.total }}</text>
                            <text x="50" y="62" text-anchor="middle" class="fill-muted-foreground text-[9px]" dominant-baseline="central">total</text>
                        </svg>
                    </div>
                    <div class="mt-3 space-y-2">
                        <div v-for="item in chart.data" :key="item.key" class="flex items-center gap-2">
                            <span class="inline-block h-3 w-3 shrink-0 rounded" :style="{ backgroundColor: item.color }" />
                            <div class="flex-1 min-w-0">
                                <div class="flex items-baseline justify-between gap-2">
                                    <span class="truncate text-xs font-medium text-foreground">{{ item.name }}</span>
                                    <span class="shrink-0 text-xs tabular-nums text-muted-foreground">
                                        <strong class="text-foreground">{{ item.value }}</strong>
                                        <span v-if="item.pct > 0" class="ml-0.5">({{ item.pct }}%)</span>
                                    </span>
                                </div>
                                <div class="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                    <div class="h-full rounded-full transition-all" :style="{ width: item.pct + '%', backgroundColor: item.color }" />
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <div class="mt-6 rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
            <div class="flex flex-wrap items-end gap-3">
                <div class="min-w-0 flex-1">
                    <label for="search" class="text-xs font-medium text-muted-foreground">Buscar</label>
                    <div class="relative mt-1">
                        <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            id="search"
                            v-model="searchInput"
                            type="text"
                            placeholder="Buscar por nombre, raza o color..."
                            class="block w-full rounded-xl border border-[#2D6A4F]/15 bg-white/60 py-2 pl-9 pr-4 text-sm text-foreground transition outline-none placeholder:text-muted-foreground/40 focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 dark:border-[#2D6A4F]/30 dark:bg-black/20"
                            @input="applyFilters"
                        />
                    </div>
                </div>
                <div class="w-full sm:w-40">
                    <label for="filter-species" class="text-xs font-medium text-muted-foreground">Especie</label>
                    <select
                        id="filter-species"
                        v-model="selectedSpecies"
                        class="mt-1 block w-full rounded-xl border border-[#2D6A4F]/15 bg-white/60 py-2 pl-3 pr-8 text-sm text-foreground transition outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 dark:border-[#2D6A4F]/30 dark:bg-black/20"
                        @change="applyFilters"
                    >
                        <option value="">Todas</option>
                        <option value="dog">🐕 Perro</option>
                        <option value="cat">🐈 Gato</option>
                        <option value="rabbit">🐰 Conejo</option>
                        <option value="bird">🐦 Ave</option>
                        <option value="other">🐾 Otra</option>
                    </select>
                </div>
                <div class="w-full sm:w-40">
                    <label for="filter-status" class="text-xs font-medium text-muted-foreground">Estado</label>
                    <select
                        id="filter-status"
                        v-model="selectedStatus"
                        class="mt-1 block w-full rounded-xl border border-[#2D6A4F]/15 bg-white/60 py-2 pl-3 pr-8 text-sm text-foreground transition outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 dark:border-[#2D6A4F]/30 dark:bg-black/20"
                        @change="applyFilters"
                    >
                        <option value="">Todos</option>
                        <option value="available">Disponible</option>
                        <option value="adopted">Adoptado</option>
                        <option value="in_process">En Proceso</option>
                        <option value="withheld">Reservado</option>
                    </select>
                </div>
                <div class="w-full sm:w-44">
                    <label for="filter-team" class="text-xs font-medium text-muted-foreground">Organización</label>
                    <select
                        id="filter-team"
                        v-model="selectedTeam"
                        class="mt-1 block w-full rounded-xl border border-[#2D6A4F]/15 bg-white/60 py-2 pl-3 pr-8 text-sm text-foreground transition outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 dark:border-[#2D6A4F]/30 dark:bg-black/20"
                        @change="applyFilters"
                    >
                        <option value="">Todas</option>
                        <option v-for="team in teams" :key="team.id" :value="String(team.id)">
                            {{ team.name }}
                        </option>
                    </select>
                </div>
                <button
                    v-if="hasFilters()"
                    type="button"
                    class="flex h-[38px] items-center gap-1 self-end rounded-xl border border-[#2D6A4F]/15 px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-muted"
                    @click="clearFilters"
                >
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Limpiar
                </button>
            </div>
        </div>

        <div class="mt-6 hidden overflow-x-auto rounded-xl border border-border bg-card md:block">
            <table class="w-full min-w-[640px] text-left text-sm">
                <thead class="border-b border-border/50 bg-muted text-xs font-medium text-muted-foreground uppercase">
                    <tr>
                        <th class="px-5 py-3">Foto</th>
                        <th class="px-5 py-3">Nombre</th>
                        <th class="px-5 py-3">Especie</th>
                        <th class="px-5 py-3">Estado</th>
                        <th class="px-5 py-3">Organización</th>
                        <th class="px-5 py-3">Registro</th>
                        <th class="px-5 py-3">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-border/50">
                    <tr
                        v-for="pet in pets"
                        :key="pet.id"
                        class="hover:bg-muted"
                    >
                        <td class="px-5 py-4">
                            <div
                                v-if="pet.photos && pet.photos.length > 0"
                                class="h-10 w-10 overflow-hidden rounded-lg bg-muted"
                            >
                                <img
                                    :src="photoUrl(pet.photos[0])"
                                    :alt="pet.name"
                                    class="h-full w-full object-cover"
                                />
                            </div>
                            <div v-else class="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-lg">
                                {{ speciesEmoji[pet.species] || '🐾' }}
                            </div>
                        </td>
                        <td class="px-5 py-4 font-medium text-card-foreground">
                            {{ pet.name }}
                        </td>
                        <td class="px-5 py-4 text-muted-foreground">
                            {{ speciesLabel(pet.species) }}
                        </td>
                        <td class="px-5 py-4">
                            <span class="inline-block rounded-full px-3 py-0.5 text-xs font-medium" :class="statusColor(pet.status)">{{ statusLabel(pet.status) }}</span>
                        </td>
                        <td class="px-5 py-4 text-muted-foreground">
                            {{ pet.team.name }}
                        </td>
                        <td class="px-5 py-4 text-muted-foreground/70">
                            {{ formatDate(pet.created_at) }}
                        </td>
                        <td class="px-5 py-4">
                            <div class="flex items-center gap-2">
                                <a :href="'/admin/mascotas/' + pet.id" class="inline-flex items-center gap-1 rounded-lg border border-[#2D6A4F]/20 px-2.5 py-1 text-xs font-medium text-[#2D6A4F] transition hover:bg-[#2D6A4F]/5">
                                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Ver
                                </a>
                                <a :href="'/admin/mascotas/' + pet.id + '/editar'" class="rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground transition hover:text-[#2D6A4F]">Editar</a>
                                <button @click="destroy(pet.id)" class="rounded-lg px-2.5 py-1 text-xs font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/30">Eliminar</button>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="pets.length === 0">
                        <td colspan="7" class="px-5 py-12 text-center text-muted-foreground/70">
                            <svg class="mx-auto h-8 w-8 text-muted-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p class="mt-2 font-medium">No se encontraron mascotas</p>
                            <p class="mt-0.5 text-xs">Probá cambiando los filtros de búsqueda.</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="pets.length === 0" class="mt-6 md:hidden">
            <div class="rounded-xl border border-border bg-card px-5 py-8 text-center text-sm text-muted-foreground/70">
                No se encontraron mascotas.
            </div>
        </div>

        <div v-else class="mt-6 space-y-3 md:hidden">
            <div
                v-for="pet in pets"
                :key="pet.id"
                class="rounded-xl border border-border bg-card p-4 transition hover:shadow-sm"
            >
                <div class="flex items-start gap-4">
                    <div class="shrink-0">
                        <div
                            v-if="pet.photos && pet.photos.length > 0"
                            class="h-14 w-14 overflow-hidden rounded-xl bg-muted"
                        >
                            <img
                                :src="photoUrl(pet.photos[0])"
                                :alt="pet.name"
                                class="h-full w-full object-cover"
                            />
                        </div>
                        <div v-else class="flex h-14 w-14 items-center justify-center rounded-xl bg-[#2D6A4F]/10 text-xl dark:bg-[#2D6A4F]/20">
                            {{ speciesEmoji[pet.species] || '🐾' }}
                        </div>
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="flex items-start justify-between gap-2">
                            <div>
                                <p class="font-semibold text-card-foreground">{{ pet.name }}</p>
                                <p class="text-xs text-muted-foreground">{{ speciesLabel(pet.species) }} · {{ pet.team.name }}</p>
                            </div>
                            <span class="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold" :class="statusColor(pet.status)">{{ statusLabel(pet.status) }}</span>
                        </div>
                        <p class="mt-1.5 text-xs text-muted-foreground/70">{{ formatDate(pet.created_at) }}</p>
                        <div class="mt-3 flex items-center gap-3 border-t border-border/50 pt-3">
                            <a :href="'/admin/mascotas/' + pet.id" class="flex items-center gap-1 text-xs font-medium text-[#2D6A4F] dark:text-emerald-400">
                                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Ver
                            </a>
                            <a :href="'/admin/mascotas/' + pet.id + '/editar'" class="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-[#2D6A4F] dark:hover:text-emerald-400">
                                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Editar
                            </a>
                            <button @click="destroy(pet.id)" class="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700">
                                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="meta.last_page > 1" class="mt-6 flex items-center justify-center gap-2">
            <a
                v-for="page in pageLinks"
                :key="page"
                :href="'/admin/mascotas?page=' + page + (hasFilters() ? '&search=' + (filters.search || '') + '&species=' + (filters.species || '') + '&status=' + (filters.status || '') + '&team_id=' + (filters.team_id || '') : '')"
                class="rounded-lg px-3 py-1.5 text-sm transition"
                :class="
                    page === meta.current_page
                        ? 'bg-[#2D6A4F] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
                "
            >{{ page }}</a>
        </div>
    </div>
</template>
