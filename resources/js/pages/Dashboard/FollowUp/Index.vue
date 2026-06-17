<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import type { Team } from '@/types';
import { usePhotoUrl } from '@/composables/usePhotoUrl';
import { Search, Eye, ClipboardList, X } from 'lucide-vue-next';
import { ref, computed } from 'vue';

const { photoUrl } = usePhotoUrl();

interface FollowUp {
    id: number;
    scheduled_date: string;
    completed_date: string | null;
    status: string;
    notes: string | null;
    adoption: { id: number; pet: { id: number; name: string; slug: string; species: string; photos: string[] | null }; adopter: { id: number; name: string; email: string } };
    created_by: { id: number; name: string };
}

const props = defineProps<{ followUps: FollowUp[]; currentTeam?: Team | null; filter?: string | null }>();

const search = ref('');
const statusFilter = ref(props.filter ?? '');

const filtered = computed(() => {
    return props.followUps.filter(fu => {
        if (search.value) {
            const q = search.value.toLowerCase();
            if (!fu.adoption.pet.name.toLowerCase().includes(q) && !fu.adoption.adopter.name.toLowerCase().includes(q)) return false;
        }
        if (statusFilter.value && fu.status !== statusFilter.value) return false;
        return true;
    });
});

const stats = computed(() => ({
    total: props.followUps.length,
    pending: props.followUps.filter(f => f.status === 'pending').length,
    completed: props.followUps.filter(f => f.status === 'completed').length,
    missed: props.followUps.filter(f => f.status === 'missed').length,
}));

function applyFilter(status: string) { router.get(`/${props.currentTeam?.slug}/seguimientos`, status ? { status } : {}); }
function clearFilters() { search.value = ''; applyFilter(''); }
function statusClass(s: string) {
    const map: Record<string, string> = { pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400', completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400', missed: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' };
    return map[s] ?? 'bg-gray-100 text-gray-600';
}
function statusLabel(s: string) { const l: Record<string, string> = { pending: 'Pendiente', completed: 'Completado', missed: 'No Realizado' }; return l[s] ?? s; }
function formatDate(d: string) { return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d)); }
function speciesLabel(s: string) { const l: Record<string, string> = { dog: 'Perro', cat: 'Gato', other: 'Otro' }; return l[s] ?? s; }
</script>

<template>
    <div class="mx-auto max-w-6xl">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl font-bold text-foreground">Seguimiento Post-Adopción</h1>
                <p class="mt-1 text-sm text-muted-foreground">Control de hitos de seguimiento de {{ currentTeam?.name }}.</p>
            </div>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-2.5 sm:gap-3 sm:grid-cols-4">
            <div class="rounded-xl border border-border/50 bg-card p-3 sm:p-4"><p class="text-[10px] sm:text-xs font-medium text-muted-foreground/70 uppercase">Total</p><p class="mt-0.5 text-xl sm:text-2xl font-bold text-foreground">{{ stats.total }}</p></div>
            <div class="rounded-xl border border-amber-200/60 bg-amber-50/30 p-3 sm:p-4 dark:border-amber-900/30 dark:bg-amber-950/20"><p class="text-[10px] sm:text-xs font-medium text-amber-700/70 uppercase">Pendientes</p><p class="mt-0.5 text-xl sm:text-2xl font-bold text-amber-700 dark:text-amber-400">{{ stats.pending }}</p></div>
            <div class="rounded-xl border border-emerald-200/60 bg-emerald-50/30 p-3 sm:p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20"><p class="text-[10px] sm:text-xs font-medium text-emerald-700/70 uppercase">Completados</p><p class="mt-0.5 text-xl sm:text-2xl font-bold text-emerald-700 dark:text-emerald-400">{{ stats.completed }}</p></div>
            <div class="rounded-xl border border-red-200/60 bg-red-50/30 p-3 sm:p-4 dark:border-red-900/30 dark:bg-red-950/20"><p class="text-[10px] sm:text-xs font-medium text-red-700/70 uppercase">No Realizados</p><p class="mt-0.5 text-xl sm:text-2xl font-bold text-red-700 dark:text-red-400">{{ stats.missed }}</p></div>
        </div>

        <div class="mt-5 sm:mt-6 rounded-xl border border-border/50 bg-card p-3">
            <div class="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <div class="relative flex-1">
                    <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                    <input v-model="search" type="text" placeholder="Buscar por mascota o adoptante..." class="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]" />
                </div>
                <div class="flex flex-wrap items-center gap-1.5">
                    <button v-for="f in [{l:'Pendientes',v:'pending'},{l:'Completados',v:'completed'},{l:'No Realizados',v:'missed'}]" :key="f.v"
                        @click="applyFilter(f.v)"
                        class="rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-medium transition"
                        :class="(filter ?? '') === f.v ? 'bg-[#2D6A4F] text-white shadow-sm' : 'bg-muted text-muted-foreground hover:bg-muted/80'">
                        {{ f.l }}
                    </button>
                    <button v-if="filter" @click="applyFilter('')" class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950"><X class="h-3.5 w-3.5" /><span class="hidden sm:inline">Limpiar</span></button>
                </div>
            </div>
        </div>

        <!-- Desktop table -->
        <div class="mt-5 sm:mt-6 hidden sm:block overflow-hidden rounded-xl border border-border/50 bg-card">
            <table class="w-full text-left text-sm">
                <thead class="border-b border-border/50 bg-muted text-xs font-medium text-muted-foreground uppercase"><tr><th class="px-5 py-3">Mascota</th><th class="px-5 py-3">Adoptante</th><th class="px-5 py-3">Hito</th><th class="px-5 py-3">Fecha</th><th class="px-5 py-3">Estado</th><th class="px-5 py-3"></th></tr></thead>
                <tbody class="divide-y divide-border/50">
                    <tr v-for="fu in filtered" :key="fu.id" class="hover:bg-muted/50 transition-colors">
                        <td class="px-5 py-3.5">
                            <div class="flex items-center gap-3">
                                <div class="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                                    <img v-if="fu.adoption.pet.photos?.length" :src="photoUrl(fu.adoption.pet.photos[0])" :alt="fu.adoption.pet.name" class="h-full w-full object-cover" />
                                    <div v-else class="flex h-full items-center justify-center text-muted-foreground/30"><ClipboardList class="h-5 w-5" /></div>
                                </div>
                                <div><p class="font-medium text-foreground">{{ fu.adoption.pet.name }}</p><p class="text-xs text-muted-foreground/70">{{ speciesLabel(fu.adoption.pet.species) }}</p></div>
                            </div>
                        </td>
                        <td class="px-5 py-3.5"><p class="text-foreground">{{ fu.adoption.adopter.name }}</p><p class="text-xs text-muted-foreground/70">{{ fu.adoption.adopter.email }}</p></td>
                        <td class="px-5 py-3.5 text-muted-foreground max-w-[200px] truncate">{{ fu.notes || '—' }}</td>
                        <td class="px-5 py-3.5 text-xs text-muted-foreground/70 whitespace-nowrap">{{ formatDate(fu.scheduled_date) }}</td>
                        <td class="px-5 py-3.5"><span class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium" :class="statusClass(fu.status)">{{ statusLabel(fu.status) }}</span></td>
                        <td class="px-5 py-3.5"><a :href="`/${currentTeam?.slug}/seguimientos/${fu.id}`" class="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-[#2D6A4F] transition hover:bg-[#2D6A4F]/10"><Eye class="h-3.5 w-3.5" />Ver</a></td>
                    </tr>
                    <tr v-if="filtered.length === 0"><td colspan="6" class="px-5 py-12 text-center"><ClipboardList class="mx-auto h-10 w-10 text-muted-foreground/30" /><p class="mt-3 text-muted-foreground">{{ search || statusFilter ? 'No se encontraron seguimientos con esos filtros.' : 'No hay seguimientos registrados.' }}</p></td></tr>
                </tbody>
            </table>
        </div>

        <!-- Mobile cards -->
        <div class="mt-5 space-y-3 sm:hidden">
            <div v-if="filtered.length === 0" class="flex flex-col items-center py-16"><ClipboardList class="h-12 w-12 text-muted-foreground/25" /><p class="mt-4 text-sm text-muted-foreground">{{ search || statusFilter ? 'No se encontraron seguimientos.' : 'No hay seguimientos registrados.' }}</p></div>
            <div v-for="fu in filtered" :key="fu.id" class="rounded-xl border border-border/50 bg-card overflow-hidden">
                <div class="flex items-center gap-3 p-4">
                    <div class="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                        <img v-if="fu.adoption.pet.photos?.length" :src="photoUrl(fu.adoption.pet.photos[0])" :alt="fu.adoption.pet.name" class="h-full w-full object-cover" />
                        <ClipboardList v-else class="m-3.5 h-7 w-7 text-muted-foreground/25" />
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="flex items-start justify-between gap-2">
                            <h3 class="font-semibold text-foreground text-sm truncate">{{ fu.adoption.pet.name }}</h3>
                            <span class="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium" :class="statusClass(fu.status)">{{ statusLabel(fu.status) }}</span>
                        </div>
                        <p class="mt-0.5 text-xs text-muted-foreground">{{ fu.adoption.adopter.name }}</p>
                        <p class="text-[11px] text-muted-foreground/60">{{ formatDate(fu.scheduled_date) }}</p>
                        <p v-if="fu.notes" class="mt-1 text-xs text-muted-foreground/70 line-clamp-2">{{ fu.notes }}</p>
                    </div>
                </div>
                <a :href="`/${currentTeam?.slug}/seguimientos/${fu.id}`" class="flex items-center justify-center gap-1.5 border-t border-border/50 py-2.5 text-xs font-medium text-[#2D6A4F] transition hover:bg-[#2D6A4F]/5 active:bg-[#2D6A4F]/10">
                    <Eye class="h-3.5 w-3.5" /> Ver detalle
                </a>
            </div>
        </div>
    </div>
</template>
