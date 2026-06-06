<script setup lang="ts">
import type { Team } from '@/types';

interface EventItem {
    id: number;
    title: string;
    slug: string;
    description: string;
    type: string;
    event_date: string | null;
    location: string | null;
    cover_image: string | null;
    is_published: boolean;
    published_at: string | null;
    created_at: string;
    author: { name: string };
}

defineProps<{
    event: EventItem;
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
</script>

<template>
    <div>
        <a
            :href="`/${currentTeam?.slug}/eventos`"
            class="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-[#2D6A4F] transition-colors"
        >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Volver a eventos
        </a>

        <div class="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-3">
                    <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" :class="typeColors[event.type] ?? typeColors.other">
                        {{ typeLabels[event.type] ?? event.type }}
                    </span>
                    <span
                        class="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-medium"
                        :class="event.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'"
                    >
                        <span class="h-1.5 w-1.5 rounded-full" :class="event.is_published ? 'bg-emerald-500' : 'bg-gray-400'" />
                        {{ event.is_published ? 'Publicado' : 'Borrador' }}
                    </span>
                </div>
                <h1 class="mt-3 text-2xl font-bold text-foreground">{{ event.title }}</h1>
                <p class="mt-1 text-sm text-muted-foreground">por {{ event.author.name }}</p>
            </div>
            <a
                :href="`/${currentTeam?.slug}/eventos/${event.id}/editar`"
                class="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#2D6A4F] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1B4332] shadow-sm shadow-[#2D6A4F]/20"
            >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
            </a>
        </div>

        <div v-if="event.cover_image" class="mt-8 overflow-hidden rounded-xl border border-border">
            <img
                :src="event.cover_image"
                :alt="event.title"
                class="w-full object-cover"
                style="max-height: 300px;"
            />
        </div>

        <div class="mt-8 grid gap-6 lg:grid-cols-3">
            <div class="space-y-6 lg:col-span-2">
                <div v-if="event.description" class="rounded-xl border border-border bg-card p-6">
                    <h2 class="flex items-center gap-2 text-lg font-semibold text-foreground">
                        <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Descripción
                    </h2>
                    <p class="mt-4 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                        {{ event.description }}
                    </p>
                </div>
            </div>

            <div class="space-y-4">
                <div class="rounded-xl border border-border bg-card p-5">
                    <h3 class="flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Detalles del evento
                    </h3>
                    <dl class="mt-4 space-y-4 divide-y divide-border/50">
                        <div class="pt-4 first:pt-0">
                            <dt class="text-xs text-muted-foreground/70">Tipo</dt>
                            <dd class="mt-0.5 font-medium text-card-foreground">
                                <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" :class="typeColors[event.type] ?? typeColors.other">
                                    {{ typeLabels[event.type] ?? event.type }}
                                </span>
                            </dd>
                        </div>
                        <div v-if="event.event_date" class="pt-4">
                            <dt class="text-xs text-muted-foreground/70">Fecha del evento</dt>
                            <dd class="mt-0.5 font-medium text-card-foreground">{{ formatDate(event.event_date) }}</dd>
                        </div>
                        <div v-if="event.location" class="pt-4">
                            <dt class="text-xs text-muted-foreground/70">Ubicación</dt>
                            <dd class="mt-0.5 font-medium text-card-foreground">{{ event.location }}</dd>
                        </div>
                        <div class="pt-4">
                            <dt class="text-xs text-muted-foreground/70">Autor</dt>
                            <dd class="mt-0.5 font-medium text-card-foreground">{{ event.author.name }}</dd>
                        </div>
                        <div v-if="event.published_at" class="pt-4">
                            <dt class="text-xs text-muted-foreground/70">Fecha de publicación</dt>
                            <dd class="mt-0.5 font-medium text-card-foreground">{{ formatDate(event.published_at) }}</dd>
                        </div>
                        <div class="pt-4">
                            <dt class="text-xs text-muted-foreground/70">Creado</dt>
                            <dd class="mt-0.5 font-medium text-card-foreground">{{ formatDate(event.created_at) }}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    </div>
</template>
