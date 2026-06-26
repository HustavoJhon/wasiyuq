<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import type { Team } from '@/types';
import { usePhotoUrl } from '@/composables/usePhotoUrl';
import { Search, Eye, PawPrint, ChevronLeft, ChevronRight, X } from 'lucide-vue-next';
import { ref, computed } from 'vue';

const { photoUrl } = usePhotoUrl();

interface Adoption { id: number; status: string; created_at: string; pet: { id: number; name: string; slug: string; species: string; photos: string[] | null }; adopter: { id: number; name: string; email: string }; }
interface Meta { current_page: number; last_page: number; total: number; per_page: number; }

const props = defineProps<{ adoptions: Adoption[]; meta: Meta; currentTeam?: Team | null; filter?: string | null }>();

const search = ref('');
const statusFilter = ref(props.filter ?? '');

const filtered = computed(() => {
    return props.adoptions.filter(a => {
        if (search.value) {
            const q = search.value.toLowerCase();
            if (!a.pet.name.toLowerCase().includes(q) && !a.adopter.name.toLowerCase().includes(q)) return false;
        }
        if (statusFilter.value && a.status !== statusFilter.value) return false;
        return true;
    });
});

const stats = computed(() => ({
    total: props.adoptions.length,
    pending: props.adoptions.filter(a => a.status === 'pending').length,
    approved: props.adoptions.filter(a => a.status === 'approved').length,
    rejected: props.adoptions.filter(a => a.status === 'rejected').length,
    completed: props.adoptions.filter(a => a.status === 'completed').length,
}));

const hasFilters = computed(() => search.value || (statusFilter.value && statusFilter.value !== props.filter));

function applyFilter(status: string) { router.get(`/${props.currentTeam?.slug}/adopciones`, status ? { status } : {}); }
function clearFilters() { search.value = ''; applyFilter(''); }
function statusClass(s: string) { const m: Record<string, string> = { pending: 'bg-amber-100 text-amber-700', approved: 'bg-blue-100 text-blue-700', rejected: 'bg-red-100 text-red-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-gray-100 text-gray-500' }; return m[s] ?? 'bg-gray-100 text-gray-600'; }
function statusLabel(s: string) { const l: Record<string, string> = { pending: 'Pendiente', approved: 'Aprobada', rejected: 'Rechazada', completed: 'Completada', cancelled: 'Cancelada' }; return l[s] ?? s; }
function formatDate(d: string) { return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d)); }
</script>

<template>
    <div class="mx-auto max-w-6xl">
        <div class="flex items-center justify-between"><div><h1 class="text-2xl font-bold text-foreground">Solicitudes de Adopción</h1><p class="mt-1 text-sm text-muted-foreground">Revisa y gestiona las postulaciones de {{ currentTeam?.name }}.</p></div></div>

        <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
            <div class="rounded-xl border border-border/50 bg-card p-4"><p class="text-xs font-medium text-muted-foreground/70 uppercase">Total</p><p class="mt-1 text-2xl font-bold text-foreground">{{ stats.total }}</p></div>
            <div class="rounded-xl border border-amber-200/60 bg-amber-50/30 p-4 dark:border-amber-900/30 dark:bg-amber-950/20"><p class="text-xs font-medium text-amber-700/70 uppercase">Pendientes</p><p class="mt-1 text-2xl font-bold text-amber-700 dark:text-amber-400">{{ stats.pending }}</p></div>
            <div class="rounded-xl border border-blue-200/60 bg-blue-50/30 p-4 dark:border-blue-900/30 dark:bg-blue-950/20"><p class="text-xs font-medium text-blue-700/70 uppercase">Aprobadas</p><p class="mt-1 text-2xl font-bold text-blue-700 dark:text-blue-400">{{ stats.approved }}</p></div>
            <div class="rounded-xl border border-red-200/60 bg-red-50/30 p-4 dark:border-red-900/30 dark:bg-red-950/20"><p class="text-xs font-medium text-red-700/70 uppercase">Rechazadas</p><p class="mt-1 text-2xl font-bold text-red-700 dark:text-red-400">{{ stats.rejected }}</p></div>
            <div class="rounded-xl border border-emerald-200/60 bg-emerald-50/30 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20"><p class="text-xs font-medium text-emerald-700/70 uppercase">Completadas</p><p class="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-400">{{ stats.completed }}</p></div>
        </div>

        <div class="mt-6 rounded-xl border border-border/50 bg-card p-3">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div class="relative flex-1"><Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" /><input v-model="search" type="text" placeholder="Buscar por mascota o adoptante..." class="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]" /></div>
                <div class="flex flex-wrap items-center gap-2">
                    <button v-for="f in [{l:'Pendientes',v:'pending'},{l:'Aprobadas',v:'approved'},{l:'Rechazadas',v:'rejected'},{l:'Completadas',v:'completed'}]" :key="f.v"
                        @click="applyFilter(f.v)" class="rounded-lg px-3 py-2 text-sm font-medium transition"
                        :class="(filter ?? '') === f.v ? 'bg-[#2D6A4F] text-white shadow-sm' : 'bg-muted text-muted-foreground hover:bg-muted/80'">{{ f.l }}</button>
                    <button v-if="filter" @click="applyFilter('')" class="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950"><X class="h-4 w-4" />Limpiar</button>
                </div>
            </div>
        </div>

        <!-- Desktop table -->
        <div class="mt-6 hidden sm:block overflow-hidden rounded-xl border border-border/50 bg-card">
            <table class="w-full text-left text-sm">
                <thead class="border-b border-border/50 bg-muted text-xs font-medium text-muted-foreground uppercase"><tr><th class="px-5 py-3">Mascota</th><th class="px-5 py-3">Adoptante</th><th class="px-5 py-3">Estado</th><th class="px-5 py-3">Fecha</th><th class="px-5 py-3"></th></tr></thead>
                <tbody class="divide-y divide-border/50">
                    <tr v-for="adoption in filtered" :key="adoption.id" class="hover:bg-muted/50 transition-colors">
                        <td class="px-5 py-3.5"><div class="flex items-center gap-3"><div class="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted"><img v-if="adoption.pet.photos?.length" :src="photoUrl(adoption.pet?.photos?.[0])" :alt="adoption.pet?.name ?? 'Mascota'" class="h-full w-full object-cover" /><div v-else class="flex h-full items-center justify-center text-muted-foreground/30"><PawPrint class="h-5 w-5" /></div></div><div><p class="font-medium text-foreground">{{ adoption.pet?.name ?? 'Mascota eliminada' }}</p><p class="text-xs text-muted-foreground/70">{{ adoption.pet?.species }}</p></div></div></td>
                        <td class="px-5 py-3.5"><p class="text-foreground">{{ adoption.adopter.name }}</p><p class="text-xs text-muted-foreground/70">{{ adoption.adopter.email }}</p></td>
                        <td class="px-5 py-3.5"><span class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium" :class="statusClass(adoption.status)">{{ statusLabel(adoption.status) }}</span></td>
                        <td class="px-5 py-3.5 text-xs text-muted-foreground/70 whitespace-nowrap">{{ formatDate(adoption.created_at) }}</td>
                        <td class="px-5 py-3.5"><a :href="`/${currentTeam?.slug}/adopciones/${adoption.id}`" class="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-[#2D6A4F] hover:bg-[#2D6A4F]/10"><Eye class="h-3.5 w-3.5" />Revisar</a></td>
                    </tr>
                    <tr v-if="filtered.length === 0"><td colspan="5" class="px-5 py-12 text-center"><PawPrint class="mx-auto h-10 w-10 text-muted-foreground/30" /><p class="mt-3 text-muted-foreground">{{ hasFilters ? 'No se encontraron solicitudes con esos filtros.' : 'No hay solicitudes de adopción.' }}</p></td></tr>
                </tbody>
            </table>
        </div>

        <!-- Mobile cards -->
        <div class="mt-6 grid gap-4 sm:hidden">
            <div v-if="filtered.length === 0" class="flex flex-col items-center py-12"><PawPrint class="h-10 w-10 text-muted-foreground/30" /><p class="mt-3 text-muted-foreground">{{ hasFilters ? 'No se encontraron solicitudes.' : 'No hay solicitudes de adopción.' }}</p></div>
            <div v-for="adoption in filtered" :key="adoption.id" class="rounded-xl border border-border/50 bg-card p-4">
                <div class="flex items-start gap-3">
                    <div class="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-muted"><img v-if="adoption.pet?.photos?.length" :src="photoUrl(adoption.pet?.photos?.[0])" :alt="adoption.pet?.name ?? 'Mascota'" class="h-full w-full object-cover" /><PawPrint v-else class="m-3 h-6 w-6 text-muted-foreground/30" /></div>
                    <div class="min-w-0 flex-1"><div class="flex items-start justify-between"><h3 class="font-semibold text-foreground truncate">{{ adoption.pet?.name ?? 'Mascota eliminada' }}</h3><span class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium" :class="statusClass(adoption.status)">{{ statusLabel(adoption.status) }}</span></div><p class="mt-0.5 text-xs text-muted-foreground">{{ adoption.adopter.name }} · {{ formatDate(adoption.created_at) }}</p><a :href="`/${currentTeam?.slug}/adopciones/${adoption.id}`" class="mt-2 inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-[#2D6A4F] hover:bg-[#2D6A4F]/10"><Eye class="h-3.5 w-3.5" /> Revisar</a></div>
                </div>
            </div>
        </div>

        <div v-if="meta.last_page > 1" class="mt-6 flex items-center justify-center gap-2">
            <button v-if="meta.current_page > 1" @click="router.get(`/${currentTeam?.slug}/adopciones?page=${meta.current_page - 1}`)" class="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted"><ChevronLeft class="h-4 w-4" /></button>
            <template v-for="page in meta.last_page" :key="page">
                <button v-if="page === 1 || page === meta.last_page || Math.abs(page - meta.current_page) <= 2" @click="router.get(`/${currentTeam?.slug}/adopciones?page=${page}`)" class="flex h-9 min-w-[36px] items-center justify-center rounded-lg px-3 text-sm font-medium" :class="page === meta.current_page ? 'bg-[#2D6A4F] text-white shadow-sm' : 'border border-border bg-card text-muted-foreground hover:bg-muted'">{{ page }}</button>
                <span v-else-if="Math.abs(page - meta.current_page) === 3" class="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground/50">...</span>
            </template>
            <button v-if="meta.current_page < meta.last_page" @click="router.get(`/${currentTeam?.slug}/adopciones?page=${meta.current_page + 1}`)" class="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted"><ChevronRight class="h-4 w-4" /></button>
        </div>
    </div>
</template>
