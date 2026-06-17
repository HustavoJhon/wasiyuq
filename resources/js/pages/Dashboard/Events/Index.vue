<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import type { Team } from '@/types';
import { Search, Plus, Eye, Pencil, Trash2, CalendarDays, MapPin, Megaphone, Filter, X, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { ref, computed } from 'vue';

interface EventItem {
    id: number; title: string; slug: string; type: string; event_date: string | null; location: string | null; is_published: boolean; published_at: string | null; created_at: string; author: { id: number; name: string };
}
interface Meta { current_page: number; last_page: number; total: number; per_page: number; }

const props = defineProps<{ events: EventItem[]; meta: Meta; currentTeam?: Team | null }>();

const search = ref('');

const filtered = computed(() => {
    if (!search.value) return props.events;
    const q = search.value.toLowerCase();
    return props.events.filter(e => e.title.toLowerCase().includes(q) || e.author.name.toLowerCase().includes(q));
});

const stats = computed(() => ({
    total: props.events.length,
    published: props.events.filter(e => e.is_published).length,
    drafts: props.events.filter(e => !e.is_published).length,
}));

const typeLabels: Record<string, string> = { adoption_fair: 'Feria de Adopción', fundraiser: 'Recaudación', workshop: 'Taller', campaign: 'Campaña', other: 'Otro' };
const typeColors: Record<string, string> = { adoption_fair: 'bg-rose-100 text-rose-700', fundraiser: 'bg-amber-100 text-amber-700', workshop: 'bg-sky-100 text-sky-700', campaign: 'bg-violet-100 text-violet-700', other: 'bg-slate-100 text-slate-700' };
function formatDate(d: string) { return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d)); }
function destroy(id: number) { if (confirm('¿Eliminar este evento?')) router.delete(`/${slug}/eventos/${id}`); }
const slug = computed(() => { const m = window.location.pathname.match(/^\/([^/]+)/); return m ? m[1] : ''; });
</script>

<template>
    <div class="mx-auto max-w-6xl">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div><h1 class="text-2xl font-bold text-foreground">Eventos y Comunicados</h1><p class="mt-1 text-sm text-muted-foreground">Gestiona los eventos de <span class="font-medium text-foreground">{{ currentTeam?.name }}</span>.</p></div>
            <a :href="`/${currentTeam?.slug}/eventos/crear`" class="self-stretch sm:self-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2D6A4F] to-[#40916C] px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-[#2D6A4F]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all"><Plus class="h-4 w-4" />Nuevo Evento</a>
        </div>

        <div class="mt-6 grid grid-cols-3 gap-3">
            <div class="rounded-xl border border-border/50 bg-card p-4"><p class="text-xs font-medium text-muted-foreground/70 uppercase">Total</p><p class="mt-1 text-2xl font-bold text-foreground">{{ stats.total }}</p></div>
            <div class="rounded-xl border border-emerald-200/60 bg-emerald-50/30 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20"><p class="text-xs font-medium text-emerald-700/70 uppercase">Publicados</p><p class="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-400">{{ stats.published }}</p></div>
            <div class="rounded-xl border border-gray-200/60 bg-gray-50/30 p-4 dark:border-gray-800 dark:bg-gray-900/30"><p class="text-xs font-medium text-gray-600 uppercase">Borradores</p><p class="mt-1 text-2xl font-bold text-gray-700 dark:text-gray-400">{{ stats.drafts }}</p></div>
        </div>

        <div class="mt-6 rounded-xl border border-border/50 bg-card p-3">
            <div class="relative">
                <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                <input v-model="search" type="text" placeholder="Buscar eventos por título o autor..." class="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]" />
            </div>
        </div>

        <!-- Empty state -->
        <div v-if="filtered.length === 0" class="mt-12 flex flex-col items-center"><CalendarDays class="h-12 w-12 text-muted-foreground/30" /><p class="mt-4 font-medium text-foreground">No hay eventos</p><p class="mt-1 text-sm text-muted-foreground/70">{{ search ? 'Sin resultados para esa búsqueda.' : 'Crea tu primer evento para comenzar.' }}</p></div>

        <!-- Desktop table -->
        <div v-if="filtered.length > 0" class="mt-6 hidden sm:block overflow-hidden rounded-xl border border-border/50 bg-card">
            <table class="w-full text-left text-sm">
                <thead class="border-b border-border/50 bg-muted text-xs font-medium text-muted-foreground uppercase"><tr><th class="px-5 py-3">Evento</th><th class="px-5 py-3">Tipo</th><th class="px-5 py-3">Fecha</th><th class="px-5 py-3">Estado</th><th class="px-5 py-3 text-right">Acciones</th></tr></thead>
                <tbody class="divide-y divide-border/50">
                    <tr v-for="event in filtered" :key="event.id" class="hover:bg-muted/50 transition-colors">
                        <td class="px-5 py-3.5"><p class="font-medium text-foreground">{{ event.title }}</p><p class="mt-0.5 text-xs text-muted-foreground/60">por {{ event.author.name }}</p></td>
                        <td class="px-5 py-3.5"><span class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium" :class="typeColors[event.type] ?? typeColors.other">{{ typeLabels[event.type] ?? event.type }}</span></td>
                        <td class="px-5 py-3.5 text-xs text-muted-foreground/70 whitespace-nowrap">{{ event.event_date ? formatDate(event.event_date) : '—' }}</td>
                        <td class="px-5 py-3.5"><span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium" :class="event.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'"><span class="h-1.5 w-1.5 rounded-full" :class="event.is_published ? 'bg-emerald-500' : 'bg-gray-400'" />{{ event.is_published ? 'Publicado' : 'Borrador' }}</span></td>
                        <td class="px-5 py-3.5"><div class="flex items-center justify-end gap-1.5">
                            <a :href="`/${currentTeam?.slug}/eventos/${event.id}`" class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#2D6A4F] hover:bg-[#2D6A4F]/10"><Eye class="h-3.5 w-3.5" />Ver</a>
                            <a :href="`/${currentTeam?.slug}/eventos/${event.id}/editar`" class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"><Pencil class="h-3.5 w-3.5" />Editar</a>
                            <button @click="destroy(event.id)" class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950"><Trash2 class="h-3.5 w-3.5" />Eliminar</button>
                        </div></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Mobile cards -->
        <div v-if="filtered.length > 0" class="mt-6 grid gap-4 sm:hidden">
            <div v-for="event in filtered" :key="event.id" class="rounded-xl border border-border/50 bg-card p-4">
                <div class="flex items-start justify-between gap-3"><div class="min-w-0 flex-1"><p class="font-semibold text-foreground truncate">{{ event.title }}</p><p class="mt-0.5 text-xs text-muted-foreground/60">por {{ event.author.name }}</p></div><span class="shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium" :class="event.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'"><span class="h-1.5 w-1.5 rounded-full" :class="event.is_published ? 'bg-emerald-500' : 'bg-gray-400'" />{{ event.is_published ? 'Publicado' : 'Borrador' }}</span></div>
                <div class="mt-3 flex flex-wrap items-center gap-2"><span class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium" :class="typeColors[event.type] ?? typeColors.other">{{ typeLabels[event.type] ?? event.type }}</span><span v-if="event.event_date" class="text-xs text-muted-foreground/70">{{ formatDate(event.event_date) }}</span></div>
                <div class="mt-3 flex items-stretch gap-1 border-t border-border/50 pt-3">
                    <a :href="`/${currentTeam?.slug}/eventos/${event.id}`" class="flex flex-1 items-center justify-center gap-1 rounded-lg px-1.5 py-2 text-[11px] font-medium text-[#2D6A4F] hover:bg-[#2D6A4F]/10"><Eye class="h-3.5 w-3.5 shrink-0" /><span class="hidden xs:inline">Ver</span></a>
                    <a :href="`/${currentTeam?.slug}/eventos/${event.id}/editar`" class="flex flex-1 items-center justify-center gap-1 rounded-lg px-1.5 py-2 text-[11px] font-medium text-muted-foreground hover:bg-muted"><Pencil class="h-3.5 w-3.5 shrink-0" /><span class="hidden xs:inline">Editar</span></a>
                    <button @click="destroy(event.id)" class="flex flex-1 items-center justify-center gap-1 rounded-lg px-1.5 py-2 text-[11px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950"><Trash2 class="h-3.5 w-3.5 shrink-0" /><span class="hidden xs:inline">Eliminar</span></button>
                </div>
            </div>
        </div>

        <div v-if="meta.last_page > 1" class="mt-6 flex items-center justify-center gap-2">
            <button v-if="meta.current_page > 1" @click="router.get(`/${slug}/eventos?page=${meta.current_page - 1}`)" class="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted"><ChevronLeft class="h-4 w-4" /></button>
            <template v-for="page in meta.last_page" :key="page">
                <button v-if="page === 1 || page === meta.last_page || Math.abs(page - meta.current_page) <= 2" @click="router.get(`/${slug}/eventos?page=${page}`)" class="flex h-9 min-w-[36px] items-center justify-center rounded-lg px-3 text-sm font-medium" :class="page === meta.current_page ? 'bg-[#2D6A4F] text-white shadow-sm' : 'border border-border bg-card text-muted-foreground hover:bg-muted'">{{ page }}</button>
                <span v-else-if="Math.abs(page - meta.current_page) === 3" class="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground/50">...</span>
            </template>
            <button v-if="meta.current_page < meta.last_page" @click="router.get(`/${slug}/eventos?page=${meta.current_page + 1}`)" class="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted"><ChevronRight class="h-4 w-4" /></button>
        </div>
    </div>
</template>
