<script setup lang="ts">
interface EventShow {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    event_date: string | null;
    location: string | null;
    type: string;
    cover_image: string | null;
    is_published: boolean;
    published_at: string | null;
    created_at: string;
    team: { name: string; slug: string };
    author: { name: string };
}

defineProps<{ event: EventShow }>();

const typeLabels: Record<string, string> = {
    adoption_fair: 'Feria de Adopción',
    fundraiser: 'Recaudación',
    workshop: 'Taller',
    campaign: 'Campaña',
    other: 'Otro',
};

const typeColors: Record<string, string> = {
    adoption_fair: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    fundraiser: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    workshop: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
    campaign: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    other: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
};

const typeIcons: Record<string, string> = {
    adoption_fair: '🏐', fundraiser: '💰', workshop: '🔧', campaign: '📢', other: '📅',
};

function formatDate(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d));
}

function initials(name: string): string {
    return name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
}
</script>

<template>
    <div class="mx-auto max-w-5xl">
        <a href="/admin/eventos" class="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-[#2D6A4F]">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Volver a eventos
        </a>

        <div v-if="event.cover_image" class="mt-6 overflow-hidden rounded-2xl border border-[#2D6A4F]/15">
            <img :src="event.cover_image" :alt="event.title" class="w-full object-cover" style="max-height: 280px;" />
        </div>

        <div class="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div class="flex min-w-0 flex-1 items-start gap-4">
                <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 text-2xl dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                    {{ typeIcons[event.type] ?? '📅' }}
                </div>
                <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-2">
                        <span class="rounded-full px-2.5 py-0.5 text-xs font-medium" :class="typeColors[event.type] ?? typeColors.other">{{ typeLabels[event.type] ?? event.type }}</span>
                        <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-medium" :class="event.is_published ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'">
                            <span class="h-1.5 w-1.5 rounded-full" :class="event.is_published ? 'bg-emerald-500' : 'bg-gray-400'" />
                            {{ event.is_published ? 'Publicado' : 'Borrador' }}
                        </span>
                    </div>
                    <h1 class="mt-2 text-2xl font-bold text-foreground">{{ event.title }}</h1>
                    <p class="mt-0.5 text-sm text-muted-foreground">{{ event.team.name }} · por {{ event.author.name }}</p>
                </div>
            </div>
            <a :href="'/admin/eventos/' + event.id + '/editar'" class="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#2D6A4F] px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-[#2D6A4F]/20 transition hover:bg-[#245a40]">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
            </a>
        </div>

        <div class="mt-8 grid gap-6 lg:grid-cols-3">
            <div class="space-y-6 lg:col-span-2">
                <div v-if="event.description" class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                    <div class="flex items-center gap-2">
                        <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h2 class="text-base font-semibold text-foreground">Descripción</h2>
                    </div>
                    <p class="mt-4 text-sm leading-relaxed text-foreground/80 whitespace-pre-line">{{ event.description }}</p>
                </div>
            </div>

            <div class="space-y-4">
                <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                    <div class="flex items-center gap-2">
                        <svg class="h-4 w-4 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 class="text-xs font-semibold tracking-wider text-foreground/70 uppercase">Detalles</h3>
                    </div>
                    <dl class="mt-4 divide-y divide-[#2D6A4F]/10 space-y-3 dark:divide-[#2D6A4F]/20">
                        <div class="flex items-center justify-between pt-3 first:pt-0">
                            <dt class="text-xs text-muted-foreground/70">Tipo</dt>
                            <dd class="rounded-full px-2.5 py-0.5 text-xs font-medium" :class="typeColors[event.type] ?? typeColors.other">{{ typeLabels[event.type] ?? event.type }}</dd>
                        </div>
                        <div v-if="event.event_date" class="flex items-center justify-between pt-3">
                            <dt class="text-xs text-muted-foreground/70">Fecha del evento</dt>
                            <dd class="text-sm font-medium text-foreground">{{ formatDate(event.event_date) }}</dd>
                        </div>
                        <div v-if="event.location" class="flex items-center justify-between pt-3">
                            <dt class="text-xs text-muted-foreground/70">Ubicación</dt>
                            <dd class="text-sm font-medium text-foreground">
                                <span v-if="event.location.startsWith('http')">
                                    <a :href="event.location" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-[#2D6A4F] hover:underline">
                                        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Ver en Google Maps
                                    </a>
                                </span>
                                <span v-else>{{ event.location }}</span>
                            </dd>
                        </div>
                        <div class="flex items-center justify-between pt-3">
                            <dt class="text-xs text-muted-foreground/70">Organización</dt>
                            <dd class="text-sm font-medium text-[#2D6A4F]">{{ event.team.name }}</dd>
                        </div>
                        <div class="flex items-center justify-between pt-3">
                            <dt class="text-xs text-muted-foreground/70">Autor</dt>
                            <dd class="text-sm font-medium text-foreground">{{ event.author.name }}</dd>
                        </div>
                        <div v-if="event.published_at" class="flex items-center justify-between pt-3">
                            <dt class="text-xs text-muted-foreground/70">Fecha de publicación</dt>
                            <dd class="text-sm font-medium text-foreground">{{ formatDate(event.published_at) }}</dd>
                        </div>
                        <div class="flex items-center justify-between pt-3">
                            <dt class="text-xs text-muted-foreground/70">Creado</dt>
                            <dd class="text-sm font-medium text-foreground">{{ formatDate(event.created_at) }}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    </div>
</template>
