<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { ref } from 'vue';

interface FollowUp {
    id: number;
    scheduled_date: string;
    completed_date: string | null;
    status: string;
    notes: string | null;
    created_at: string;
    adoption: {
        id: number;
        pet: { id: number; name: string; slug: string };
        adopter: { id: number; name: string };
    };
    created_by: { id: number; name: string };
}

interface Team {
    id: number;
    name: string;
}

interface Meta {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

interface Filters {
    search?: string;
    status?: string;
    team_id?: string;
    date_from?: string;
    date_to?: string;
}

const props = defineProps<{
    followUps: FollowUp[];
    meta: Meta;
    filters?: Filters;
    teams: Team[];
}>();

const search = ref(props.filters?.search ?? '');
const selectedStatus = ref(props.filters?.status ?? '');
const selectedTeam = ref(props.filters?.team_id ?? '');
const dateFrom = ref(props.filters?.date_from ?? '');
const dateTo = ref(props.filters?.date_to ?? '');

function statusClass(status: string): string {
    const map: Record<string, string> = {
        pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
        completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
        missed: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    };

    return map[status] ?? 'bg-gray-100 text-gray-600';
}

function statusLabel(s: string): string {
    const labels: Record<string, string> = { pending: 'Pendiente', completed: 'Completado', missed: 'No Realizado' };

    return labels[s] ?? s;
}

function formatDate(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d));
}

function destroy(id: number): void {
    if (confirm('¿Eliminar este seguimiento? Esta acción no se puede deshacer.')) {
        router.delete('/admin/seguimiento/' + id);
    }
}

function hasFilters(): boolean {
    return !!(props.filters?.search || props.filters?.status || props.filters?.team_id || props.filters?.date_from || props.filters?.date_to);
}

function applyFilters() {
    router.get('/admin/seguimiento', {
        search: search.value || undefined,
        status: selectedStatus.value || undefined,
        team_id: selectedTeam.value || undefined,
        date_from: dateFrom.value || undefined,
        date_to: dateTo.value || undefined,
    }, { preserveState: true, replace: true });
}

function clearFilters() {
    search.value = '';
    selectedStatus.value = '';
    selectedTeam.value = '';
    dateFrom.value = '';
    dateTo.value = '';
    router.get('/admin/seguimiento', { page: 1 }, { preserveState: true, replace: true });
}
</script>

<template>
    <div class="mx-auto max-w-6xl">
        <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div class="flex items-center gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2D6A4F]/10">
                    <svg class="h-6 w-6 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-foreground">Seguimiento</h1>
                    <p class="mt-0.5 text-sm text-muted-foreground">Visitas de seguimiento post-adopción.</p>
                </div>
            </div>
            <a href="/admin/seguimiento/crear" class="inline-flex items-center gap-2 rounded-xl bg-[#2D6A4F] px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-[#2D6A4F]/20 transition hover:bg-[#245a40]">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Nuevo Seguimiento
            </a>
        </div>

        <div class="mb-6 rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
            <div class="flex flex-wrap items-end gap-3">
                <div class="w-full">
                    <label for="search" class="text-xs font-medium text-muted-foreground">Buscar</label>
                    <div class="relative mt-1">
                        <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            id="search"
                            v-model="search"
                            type="text"
                            placeholder="Buscar por mascota, adoptante o creador..."
                            class="block w-full rounded-xl border border-[#2D6A4F]/15 bg-white/60 py-2 pl-9 pr-4 text-sm text-foreground transition outline-none placeholder:text-muted-foreground/40 focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 dark:border-[#2D6A4F]/30 dark:bg-black/20"
                            @input="applyFilters"
                        />
                    </div>
                </div>
                <div class="grid w-full grid-cols-2 gap-3 sm:flex sm:w-auto sm:flex-1 sm:grid-cols-none">
                    <div>
                        <label for="filter-status" class="text-xs font-medium text-muted-foreground">Estado</label>
                        <select
                            id="filter-status"
                            v-model="selectedStatus"
                            class="mt-1 block w-full rounded-xl border border-[#2D6A4F]/15 bg-white/60 py-2 pl-3 pr-8 text-sm text-foreground transition outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 dark:border-[#2D6A4F]/30 dark:bg-black/20"
                            @change="applyFilters"
                        >
                            <option value="">Todos</option>
                            <option value="pending">Pendiente</option>
                            <option value="completed">Completado</option>
                            <option value="missed">No Realizado</option>
                        </select>
                    </div>
                    <div>
                        <label for="filter-team" class="text-xs font-medium text-muted-foreground">Organización</label>
                        <select
                            id="filter-team"
                            v-model="selectedTeam"
                            class="mt-1 block w-full rounded-xl border border-[#2D6A4F]/15 bg-white/60 py-2 pl-3 pr-8 text-sm text-foreground transition outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 dark:border-[#2D6A4F]/30 dark:bg-black/20"
                            @change="applyFilters"
                        >
                            <option value="">Todas</option>
                            <option v-for="team in teams" :key="team.id" :value="String(team.id)">{{ team.name }}</option>
                        </select>
                    </div>
                    <div>
                        <label for="filter-date-from" class="text-xs font-medium text-muted-foreground">Desde</label>
                        <input
                            id="filter-date-from"
                            v-model="dateFrom"
                            type="date"
                            class="mt-1 block w-full rounded-xl border border-[#2D6A4F]/15 bg-white/60 py-2 pl-3 pr-3 text-sm text-foreground transition outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 dark:border-[#2D6A4F]/30 dark:bg-black/20"
                            @change="applyFilters"
                        />
                    </div>
                    <div>
                        <label for="filter-date-to" class="text-xs font-medium text-muted-foreground">Hasta</label>
                        <input
                            id="filter-date-to"
                            v-model="dateTo"
                            type="date"
                            class="mt-1 block w-full rounded-xl border border-[#2D6A4F]/15 bg-white/60 py-2 pl-3 pr-3 text-sm text-foreground transition outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 dark:border-[#2D6A4F]/30 dark:bg-black/20"
                            @change="applyFilters"
                        />
                    </div>
                </div>
                <button
                    v-if="hasFilters()"
                    type="button"
                    class="flex h-[38px] w-full items-center justify-center gap-1 self-end rounded-xl border border-[#2D6A4F]/15 px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-muted sm:w-auto"
                    @click="clearFilters"
                >
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Limpiar filtros
                </button>
            </div>
        </div>

        <div v-if="followUps.length === 0" class="mt-12 text-center">
            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2D6A4F]/10">
                <svg class="h-8 w-8 text-[#2D6A4F]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            </div>
            <p class="mt-4 font-medium text-foreground">No hay seguimientos registrados</p>
            <p class="mt-1 text-sm text-muted-foreground/70">Creá el primer seguimiento para comenzar.</p>
        </div>

        <div v-else class="space-y-4">
            <div v-for="fu in followUps" :key="fu.id" class="group rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 transition hover:border-[#2D6A4F]/30 hover:shadow-sm dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="flex items-start justify-between gap-4">
                    <div class="flex min-w-0 flex-1 items-start gap-4">
                        <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#2D6A4F]/15 bg-white text-lg dark:border-[#2D6A4F]/30 dark:bg-black/40">
                            <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div class="min-w-0 flex-1">
                            <div class="flex flex-wrap items-center gap-2">
                                <h3 class="text-base font-semibold text-foreground truncate">{{ fu.adoption.pet.name }}</h3>
                                <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium" :class="statusClass(fu.status)">{{ statusLabel(fu.status) }}</span>
                            </div>
                            <div class="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground/70">
                                <span class="inline-flex items-center gap-1">
                                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    {{ fu.adoption.adopter.name }}
                                </span>
                                <span class="inline-flex items-center gap-1">
                                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {{ formatDate(fu.scheduled_date) }}
                                </span>
                                <span class="inline-flex items-center gap-1">
                                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    {{ fu.created_by.name }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <a :href="'/admin/seguimiento/' + fu.id" class="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-[#2D6A4F]/10 hover:text-[#2D6A4F]">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </a>
                        <a :href="'/admin/seguimiento/' + fu.id + '/editar'" class="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-[#2D6A4F]/10 hover:text-[#2D6A4F]">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </a>
                        <button @click="destroy(fu.id)" class="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="meta.last_page > 1" class="mt-8 flex items-center justify-center gap-2">
            <a v-for="page in meta.last_page" :key="page"
                :href="'/admin/seguimiento?page=' + page + (filters?.search ? '&search=' + encodeURIComponent(filters.search) : '') + (filters?.status ? '&status=' + filters.status : '') + (filters?.team_id ? '&team_id=' + filters.team_id : '') + (filters?.date_from ? '&date_from=' + filters.date_from : '') + (filters?.date_to ? '&date_to=' + filters.date_to : '')"
                class="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all"
                :class="page === meta.current_page ? 'bg-[#2D6A4F] text-white shadow-sm shadow-[#2D6A4F]/20' : 'border border-[#2D6A4F]/15 text-muted-foreground hover:border-[#2D6A4F]/30 hover:text-foreground dark:border-[#2D6A4F]/30'"
            >{{ page }}</a>
        </div>
    </div>
</template>
