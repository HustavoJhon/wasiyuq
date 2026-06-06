<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import type { Team } from '@/types';

interface EventItem {
    id: number;
    title: string;
    slug: string;
    type: string;
    event_date: string | null;
    location: string | null;
    is_published: boolean;
    published_at: string | null;
    created_at: string;
    author: { id: number; name: string };
}

interface Meta {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

defineProps<{
    events: EventItem[];
    meta: Meta;
    currentTeam?: Team | null;
}>();

const typeLabels: Record<string, string> = {
    adoption_fair: 'Feria de Adopción',
    fundraiser: 'Recaudación de Fondos',
    workshop: 'Taller',
    campaign: 'Campaña',
    other: 'Otro',
};

const typeColors: Record<string, string> = {
    adoption_fair: 'bg-rose-100 text-rose-700',
    fundraiser: 'bg-amber-100 text-amber-700',
    workshop: 'bg-sky-100 text-sky-700',
    campaign: 'bg-violet-100 text-violet-700',
    other: 'bg-slate-100 text-slate-700',
};

function formatDate(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d));
}

function destroy(id: number): void {
    if (confirm('¿Eliminar este evento?')) {
        router.delete('/' + currentTeamSlug() + '/eventos/' + id);
    }
}

function currentTeamSlug(): string {
    const m = window.location.pathname.match(/^\/([^/]+)/);

    return m ? m[1] : '';
}
</script>

<template>
    <div>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl font-bold text-foreground">Eventos y Comunicados</h1>
                <p class="mt-1 text-sm text-muted-foreground">
                    Gestiona los eventos de <span class="font-medium text-foreground">{{ currentTeam?.name }}</span>.
                </p>
            </div>
            <a
                :href="`/${currentTeam?.slug}/eventos/crear`"
                class="inline-flex items-center gap-2 rounded-lg bg-[#2D6A4F] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#246142] shadow-sm shadow-[#2D6A4F]/20"
            >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Nuevo Evento
            </a>
        </div>

        <div v-if="events.length === 0" class="mt-12 text-center">
            <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <svg class="h-7 w-7 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
            <p class="mt-4 font-medium text-foreground">No hay eventos registrados</p>
            <p class="mt-1 text-sm text-muted-foreground/70">Crea tu primer evento para comenzar.</p>
        </div>

        <div v-else class="mt-6 space-y-3">
            <div class="hidden rounded-xl border border-border bg-card md:block">
                <table class="w-full text-left text-sm">
                    <thead class="border-b border-border/50 bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <tr>
                            <th class="px-5 py-3.5">Evento</th>
                            <th class="px-5 py-3.5">Tipo</th>
                            <th class="px-5 py-3.5">Fecha</th>
                            <th class="px-5 py-3.5">Estado</th>
                            <th class="px-5 py-3.5 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border/50">
                        <tr
                            v-for="event in events"
                            :key="event.id"
                            class="hover:bg-muted/50 transition-colors"
                        >
                            <td class="px-5 py-4">
                                <p class="font-medium text-card-foreground">{{ event.title }}</p>
                                <p class="mt-0.5 text-xs text-muted-foreground/60">por {{ event.author.name }}</p>
                            </td>
                            <td class="px-5 py-4">
                                <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" :class="typeColors[event.type] ?? typeColors.other">
                                    {{ typeLabels[event.type] ?? event.type }}
                                </span>
                            </td>
                            <td class="px-5 py-4 text-muted-foreground/70 whitespace-nowrap">
                                {{ event.event_date ? formatDate(event.event_date) : '—' }}
                            </td>
                            <td class="px-5 py-4">
                                <span
                                    class="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-medium"
                                    :class="event.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'"
                                >
                                    <span class="h-1.5 w-1.5 rounded-full" :class="event.is_published ? 'bg-emerald-500' : 'bg-gray-400'" />
                                    {{ event.is_published ? 'Publicado' : 'Borrador' }}
                                </span>
                            </td>
                            <td class="px-5 py-4">
                                <div class="flex items-center justify-end gap-3">
                                    <a
                                        :href="`/${currentTeam?.slug}/eventos/${event.id}`"
                                        class="text-xs font-medium text-[#2D6A4F] hover:text-[#1B4332] transition-colors"
                                    >Ver</a>
                                    <a
                                        :href="`/${currentTeam?.slug}/eventos/${event.id}/editar`"
                                        class="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                                    >Editar</a>
                                    <button
                                        @click="destroy(event.id)"
                                        class="text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
                                    >Eliminar</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="space-y-3 md:hidden">
                <div
                    v-for="event in events"
                    :key="event.id"
                    class="rounded-xl border border-border bg-card p-4"
                >
                    <div class="flex items-start justify-between gap-3">
                        <div class="min-w-0 flex-1">
                            <p class="font-medium text-card-foreground truncate">{{ event.title }}</p>
                            <p class="mt-0.5 text-xs text-muted-foreground/60">por {{ event.author.name }}</p>
                        </div>
                        <span
                            class="shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
                            :class="event.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'"
                        >
                            <span class="h-1.5 w-1.5 rounded-full" :class="event.is_published ? 'bg-emerald-500' : 'bg-gray-400'" />
                            {{ event.is_published ? 'Publicado' : 'Borrador' }}
                        </span>
                    </div>
                    <div class="mt-3 flex flex-wrap items-center gap-2">
                        <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" :class="typeColors[event.type] ?? typeColors.other">
                            {{ typeLabels[event.type] ?? event.type }}
                        </span>
                        <span v-if="event.event_date" class="text-xs text-muted-foreground/70">{{ formatDate(event.event_date) }}</span>
                    </div>
                    <div class="mt-3 flex items-center gap-3 border-t border-border/50 pt-3">
                        <a
                            :href="`/${currentTeam?.slug}/eventos/${event.id}`"
                            class="text-xs font-medium text-[#2D6A4F] hover:text-[#1B4332] transition-colors"
                        >Ver</a>
                        <a
                            :href="`/${currentTeam?.slug}/eventos/${event.id}/editar`"
                            class="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >Editar</a>
                        <button
                            @click="destroy(event.id)"
                            class="text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
                        >Eliminar</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="meta.last_page > 1" class="mt-8 flex items-center justify-center gap-2">
            <a
                v-for="page in meta.last_page"
                :key="page"
                :href="`/${currentTeam?.slug}/eventos?page=${page}`"
                class="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all"
                :class="
                    page === meta.current_page
                        ? 'bg-[#2D6A4F] text-white shadow-sm shadow-[#2D6A4F]/20'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                "
            >{{ page }}</a>
        </div>
    </div>
</template>
