<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { CalendarDays, MapPin, Users, Search, Filter, ArrowUpDown, X, ArrowRight, ChevronRight } from 'lucide-vue-next';
import { ref } from 'vue';

interface Announcement {
    id: number;
    title: string;
    slug: string;
    description: string;
    event_date: string | null;
    location: string | null;
    type: string;
    cover_image: string | null;
    published_at: string | null;
    created_at: string;
    team: { id: number; name: string; slug: string };
    author: { id: number; name: string };
}

interface Meta {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

const props = defineProps<{
    events: Announcement[];
    meta: Meta;
    filters: { type?: string };
}>();

const mobileFiltersOpen = ref(false);

function applyFilters(newFilters: Record<string, string>) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(newFilters)) {
        if (value) params.set(key, value);
    }
    const qs = params.toString();
    router.get('/eventos' + (qs ? '?' + qs : ''), {}, { preserveState: true, replace: true });
}

let searchTimeout: ReturnType<typeof setTimeout> | null = null;
function onSearchInput(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        applyFilters({ ...props.filters, search: value || undefined as any });
    }, 400);
}

function typeLabel(type: string): string {
    const labels: Record<string, string> = { adoption_fair: 'Feria de Adopción', fundraiser: 'Recaudación', workshop: 'Taller', campaign: 'Campaña', other: 'Otro' };
    return labels[type] ?? type;
}

function typeIcon(type: string): string {
    const icons: Record<string, string> = { adoption_fair: '🏠', fundraiser: '💰', workshop: '📚', campaign: '📢', other: '📅' };
    return icons[type] ?? '📅';
}

const typeBadges: Record<string, { bg: string; text: string; dot: string }> = {
    adoption_fair: { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-400', dot: 'bg-rose-500' },
    fundraiser: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', dot: 'bg-amber-500' },
    workshop: { bg: 'bg-sky-100 dark:bg-sky-900/30', text: 'text-sky-700 dark:text-sky-400', dot: 'bg-sky-500' },
    campaign: { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-700 dark:text-violet-400', dot: 'bg-violet-500' },
    other: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-400', dot: 'bg-slate-500' },
};

function badgeFor(type: string) {
    return typeBadges[type] ?? typeBadges.other;
}

function formatDate(date: string | null): string {
    if (!date) return '';
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'long' }).format(new Date(date));
}

function daysUntil(date: string | null): number | null {
    if (!date) return null;
    const now = new Date();
    const event = new Date(date);
    return Math.ceil((event.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function truncate(text: string, len: number): string {
    if (text.length <= len) return text;
    return text.slice(0, len).trimEnd() + '…';
}

const sortOptions = { future: 'Próximos', all: 'Todos', past: 'Pasados' };
const currentSort = ref('future');
</script>

<template>
    <div class="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <!-- Hero -->
        <section class="relative overflow-hidden bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#40916C] px-4 pb-16 pt-24 sm:px-6 lg:px-8">
            <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            <div class="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
            <div class="absolute bottom-0 left-0 -mb-20 -ml-20 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
            <div class="relative mx-auto max-w-7xl">
                <div class="mx-auto max-w-2xl text-center">
                    <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 shadow-lg backdrop-blur-sm">
                        <CalendarDays class="h-8 w-8 text-white" />
                    </div>
                    <h1 class="text-4xl font-bold tracking-tight text-white sm:text-5xl">Eventos de bienestar animal</h1>
                    <p class="mt-4 text-lg text-green-100/80">
                        {{ meta.total > 0 ? `${meta.total} evento${meta.total !== 1 ? 's' : ''} encontrado${meta.total !== 1 ? 's' : ''}` : 'Próximamente' }} en Cusco
                    </p>
                    <div class="mx-auto mt-8 flex max-w-lg items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-1 backdrop-blur-md focus-within:border-white/30 focus-within:bg-white/15">
                        <Search class="h-5 w-5 shrink-0 text-green-100/60" />
                        <input
                            type="text"
                            @input="onSearchInput"
                            placeholder="Buscar eventos..."
                            class="h-12 w-full border-0 bg-transparent text-white placeholder-green-100/50 outline-none"
                        />
                    </div>
                </div>
            </div>
        </section>

        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <!-- Filter bar -->
            <div class="-mt-8 mb-8 rounded-2xl border border-border/50 bg-card/80 p-3 shadow-lg backdrop-blur-xl">
                <div class="flex flex-wrap items-center justify-between gap-3">
                    <div class="flex items-center gap-2">
                        <span class="text-sm font-medium text-muted-foreground">{{ meta.total }} evento{{ meta.total !== 1 ? 's' : '' }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <select
                            :value="filters.type || ''"
                            @change="applyFilters({ type: ($event.target as HTMLSelectElement).value })"
                            class="rounded-xl border border-border bg-transparent px-3 py-2 text-sm text-muted-foreground outline-none transition focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]">
                            <option value="">Todos los tipos</option>
                            <option value="adoption_fair">Feria de Adopción</option>
                            <option value="fundraiser">Recaudación</option>
                            <option value="workshop">Taller</option>
                            <option value="campaign">Campaña</option>
                        </select>
                        <button v-if="filters.type"
                            @click="applyFilters({ type: '' })"
                            class="rounded-xl p-2 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950">
                            <X class="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Empty state -->
            <div v-if="events.length === 0" class="flex flex-col items-center justify-center py-24">
                <div class="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                    <CalendarDays class="h-10 w-10 text-muted-foreground/50" />
                </div>
                <h3 class="mt-6 text-lg font-semibold text-foreground">No hay eventos</h3>
                <p class="mt-2 text-sm text-muted-foreground">No encontramos eventos con esos filtros. Intentá de nuevo.</p>
                <button @click="applyFilters({ type: '' })"
                    class="mt-6 rounded-xl bg-[#2D6A4F] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#246142]">
                    Ver todos
                </button>
            </div>

            <!-- Events grid -->
            <div v-else class="grid gap-6 pb-16 sm:grid-cols-2 lg:grid-cols-3">
                <a v-for="event in events" :key="event.id"
                    :href="'/eventos/' + event.slug"
                    class="group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5">
                    <!-- Cover -->
                    <div class="relative aspect-[16/9] overflow-hidden bg-muted/50">
                        <img v-if="event.cover_image"
                            :src="event.cover_image" :alt="event.title"
                            class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                        <div v-else class="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                            <span class="text-5xl opacity-30">{{ typeIcon(event.type) }}</span>
                        </div>
                        <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div class="absolute bottom-3 left-3">
                            <span :class="[badgeFor(event.type).bg, badgeFor(event.type).text, 'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm']">
                                <span :class="['h-1.5 w-1.5 rounded-full', badgeFor(event.type).dot]" />
                                {{ typeLabel(event.type) }}
                            </span>
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="flex flex-1 flex-col p-5">
                        <div class="flex items-center gap-2 text-xs text-muted-foreground/70">
                            <CalendarDays class="h-3.5 w-3.5 shrink-0 text-[#2D6A4F]" />
                            <span class="font-medium text-foreground/80">{{ formatDate(event.event_date) }}</span>
                        </div>

                        <h3 class="mt-2 text-lg font-semibold leading-snug text-foreground group-hover:text-[#2D6A4F] transition-colors">
                            {{ event.title }}
                        </h3>

                        <p v-if="event.description" class="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                            {{ truncate(event.description, 120) }}
                        </p>

                        <div class="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                            <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <MapPin class="h-3 w-3 shrink-0 text-muted-foreground/50" />
                                <span class="truncate max-w-[120px]">{{ event.location || event.team.name }}</span>
                            </div>

                            <div class="flex items-center gap-2">
                                <span v-if="daysUntil(event.event_date) !== null && daysUntil(event.event_date)! >= 0"
                                    class="inline-flex items-center gap-1 rounded-full bg-[#2D6A4F]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#2D6A4F]">
                                    {{ daysUntil(event.event_date) === 0 ? 'Hoy' : `En ${daysUntil(event.event_date)} día${daysUntil(event.event_date)! > 1 ? 's' : ''}` }}
                                </span>
                                <span v-else-if="daysUntil(event.event_date) !== null && daysUntil(event.event_date)! < 0"
                                    class="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                                    Finalizado
                                </span>
                                <ChevronRight class="h-4 w-4 text-muted-foreground/30 transition group-hover:translate-x-0.5 group-hover:text-[#2D6A4F]" />
                            </div>
                        </div>
                    </div>
                </a>
            </div>

            <!-- Pagination -->
            <div v-if="meta.last_page > 1" class="flex items-center justify-center gap-2 pb-16">
                <a v-for="page in meta.last_page" :key="page"
                    :href="'/eventos?page=' + page + (filters.type ? '&type=' + filters.type : '')"
                    class="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-all"
                    :class="page === meta.current_page
                        ? 'bg-[#2D6A4F] text-white shadow-md shadow-[#2D6A4F]/30'
                        : 'bg-[#2D6A4F]/10 text-[#2D6A4F] hover:bg-[#2D6A4F]/20 dark:bg-[#2D6A4F]/20 dark:text-emerald-400 dark:hover:bg-[#2D6A4F]/30'">
                    {{ page }}
                </a>
            </div>
        </div>
    </div>
</template>
