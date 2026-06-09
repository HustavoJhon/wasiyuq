<script setup lang="ts">
import { router } from '@inertiajs/vue3';
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

function applyFilters(newFilters: { type?: string }) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(newFilters)) {
        if (value) params.set(key, value);
    }
    const qs = params.toString();
    router.get('/eventos' + (qs ? '?' + qs : ''), {}, { preserveState: true, replace: true });
}

function typeLabel(type: string): string {
    const labels: Record<string, string> = {
        adoption_fair: 'Feria de Adopción',
        fundraiser: 'Recaudación',
        workshop: 'Taller',
        campaign: 'Campaña',
        other: 'Otro',
    };

    return labels[type] ?? type;
}

const typeBadges: Record<string, { bg: string; text: string; dot: string }> = {
    adoption_fair: { bg: 'bg-rose-100', text: 'text-rose-800', dot: 'bg-rose-500' },
    fundraiser: { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500' },
    workshop: { bg: 'bg-sky-100', text: 'text-sky-800', dot: 'bg-sky-500' },
    campaign: { bg: 'bg-violet-100', text: 'text-violet-800', dot: 'bg-violet-500' },
    other: { bg: 'bg-slate-100', text: 'text-slate-800', dot: 'bg-slate-500' },
};

function badgeFor(type: string) {
    return typeBadges[type] ?? typeBadges.other;
}

function formatDate(date: string | null): string {
    if (!date) {
return '';
}

    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'long' }).format(new Date(date));
}

function daysUntil(date: string | null): number | null {
    if (!date) {
return null;
}

    const now = new Date();
    const event = new Date(date);
    const diff = Math.ceil((event.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return diff;
}

function truncate(text: string, len: number): string {
    if (text.length <= len) {
return text;
}

    return text.slice(0, len).trimEnd() + '…';
}
</script>

<template>
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="text-center">
            <h1 class="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Eventos de bienestar animal
            </h1>
            <p class="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Campañas de vacunación, ferias de adopción y más en toda la región Cusco.
            </p>
        </div>

        <div class="mt-10">
            <div class="flex flex-wrap items-center justify-between gap-4">
                <p class="text-sm font-medium text-[#2D6A4F] dark:text-emerald-400">
                    {{ meta.total > 0 ? `${meta.total} evento${meta.total !== 1 ? 's' : ''} encontrado${meta.total !== 1 ? 's' : ''}` : '0 eventos' }}
                </p>
                <div class="flex items-center gap-3">
                    <span class="text-sm font-medium text-foreground">Filtrar:</span>
                    <select
                        :value="props.filters.type"
                        @change="applyFilters({ type: ($event.target as HTMLSelectElement).value })"
                        class="rounded-xl border border-[#2D6A4F]/20 bg-[#2D6A4F]/5 px-4 py-2.5 text-sm font-medium text-[#2D6A4F] outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 dark:border-[#2D6A4F]/40 dark:bg-[#2D6A4F]/20 dark:text-emerald-400"
                    >
                        <option value="">Todos los tipos</option>
                        <option value="adoption_fair">Feria de Adopción</option>
                        <option value="fundraiser">Recaudación</option>
                        <option value="workshop">Taller</option>
                        <option value="campaign">Campaña</option>
                    </select>
                </div>
            </div>
        </div>

        <div v-if="events.length === 0" class="mt-24 text-center">
            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#2D6A4F]/10 dark:bg-[#2D6A4F]/20">
                <svg class="h-8 w-8 text-[#2D6A4F]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
            <p class="mt-4 text-lg font-medium text-foreground">No hay eventos programados</p>
            <p class="mt-1 text-sm text-muted-foreground/70">Vuelve a revisar más tarde para conocer las próximas actividades.</p>
        </div>

        <div v-else class="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <a
                v-for="event in events"
                :key="event.id"
                :href="'/eventos/' + event.slug"
                class="group flex flex-col overflow-hidden rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-[#2D6A4F]/4 to-white dark:from-[#2D6A4F]/15 dark:to-black/40 dark:border-[#2D6A4F]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#2D6A4F]/10"
            >
                <div class="relative aspect-[16/9] overflow-hidden">
                    <img
                        v-if="event.cover_image"
                        :src="event.cover_image"
                        :alt="event.title"
                        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div
                        v-else
                        :class="[badgeFor(event.type).bg, 'flex h-full w-full items-center justify-center transition duration-500 group-hover:scale-105']"
                    >
                        <span class="text-5xl opacity-40">📅</span>
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div class="absolute bottom-3 left-3">
                        <span
                            :class="[badgeFor(event.type).bg, badgeFor(event.type).text, 'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm']"
                        >
                            <span :class="['h-1.5 w-1.5 rounded-full', badgeFor(event.type).dot]" />
                            {{ typeLabel(event.type) }}
                        </span>
                    </div>
                </div>

                <div class="flex flex-1 flex-col p-5">
                    <div class="flex items-center gap-2 text-xs text-muted-foreground/70">
                        <svg class="h-4 w-4 shrink-0 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span class="font-medium text-foreground/80">{{ formatDate(event.event_date) }}</span>
                        <span v-if="event.location" class="text-muted-foreground/40">·</span>
                        <svg v-if="event.location" class="h-4 w-4 shrink-0 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span v-if="event.location" class="font-medium text-foreground/80">{{ event.location }}</span>
                    </div>

                    <h3 class="mt-3 text-lg font-semibold leading-snug text-foreground group-hover:text-[#2D6A4F] transition-colors">
                        {{ event.title }}
                    </h3>

                    <p v-if="event.description" class="mt-2 text-sm leading-relaxed text-muted-foreground flex-1">
                        {{ truncate(event.description, 120) }}
                    </p>

                    <div class="mt-4 flex items-center justify-between border-t border-[#2D6A4F]/10 pt-4">
                        <span class="flex items-center gap-1.5 text-xs font-medium text-[#2D6A4F]">
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            {{ event.team.name }}
                        </span>
                        <span v-if="daysUntil(event.event_date) !== null && daysUntil(event.event_date)! >= 0" class="text-xs font-bold text-[#2D6A4F]">
                            {{ daysUntil(event.event_date) === 0 ? 'Hoy' : `En ${daysUntil(event.event_date)} día${daysUntil(event.event_date)! > 1 ? 's' : ''}` }}
                        </span>
                        <span v-else-if="daysUntil(event.event_date) !== null && daysUntil(event.event_date)! < 0" class="text-xs font-medium text-muted-foreground/50">
                            Finalizado
                        </span>
                    </div>
                </div>
            </a>
        </div>

        <div v-if="meta.last_page > 1" class="mt-14 flex items-center justify-center gap-2">
            <button
                v-for="page in meta.last_page"
                :key="page"
                @click="applyFilters({ ...props.filters, page: String(page) })"
                class="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-all"
                :class="
                    page === meta.current_page
                        ? 'bg-[#2D6A4F] text-white shadow-md shadow-[#2D6A4F]/30'
                        : 'bg-[#2D6A4F]/10 text-[#2D6A4F] hover:bg-[#2D6A4F]/20 dark:bg-[#2D6A4F]/20 dark:text-emerald-400 dark:hover:bg-[#2D6A4F]/30'
                "
            >{{ page }}</button>
        </div>
    </div>
</template>
