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

function formatDate(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(
        new Date(d),
    );
}
</script>

<template>
    <div>
        <a
            :href="`/${currentTeam?.slug}/eventos`"
            class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-[#2D6A4F]"
        >
            <svg
                class="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                />
            </svg>
            Volver a eventos
        </a>

        <div class="mt-4 flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-foreground">
                    {{ event.title }}
                </h1>
            </div>
            <div class="flex items-center gap-3">
                <span
                    class="rounded-full px-3 py-0.5 text-xs font-medium"
                    :class="
                        event.is_published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                    "
                    >{{ event.is_published ? 'Publicado' : 'Borrador' }}</span
                >
                <a
                    :href="`/${currentTeam?.slug}/eventos/${event.id}/editar`"
                    class="rounded-lg bg-[#2D6A4F] px-4 py-1.5 text-sm text-white hover:bg-[#1B4332]"
                    >Editar</a
                >
            </div>
        </div>

        <div class="mt-6 grid gap-6 lg:grid-cols-3">
            <div class="space-y-6 lg:col-span-2">
                <div class="rounded-xl border border-border bg-card p-6">
                    <h2 class="text-lg font-semibold text-foreground">
                        Descripción
                    </h2>
                    <p
                        class="mt-3 text-sm leading-relaxed text-muted-foreground"
                    >
                        {{ event.description }}
                    </p>
                </div>
            </div>

            <div class="space-y-4">
                <div class="rounded-xl border border-border bg-muted p-4">
                    <h3
                        class="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase"
                    >
                        Detalles
                    </h3>
                    <dl class="mt-3 space-y-3 text-sm">
                        <div>
                            <dt class="text-muted-foreground/70">Tipo</dt>
                            <dd class="font-medium text-card-foreground">
                                {{ typeLabels[event.type] ?? event.type }}
                            </dd>
                        </div>
                        <div v-if="event.event_date">
                            <dt class="text-muted-foreground/70">
                                Fecha del evento
                            </dt>
                            <dd class="font-medium text-card-foreground">
                                {{ formatDate(event.event_date) }}
                            </dd>
                        </div>
                        <div v-if="event.location">
                            <dt class="text-muted-foreground/70">Ubicación</dt>
                            <dd class="font-medium text-card-foreground">
                                {{ event.location }}
                            </dd>
                        </div>
                        <div>
                            <dt class="text-muted-foreground/70">Autor</dt>
                            <dd class="font-medium text-card-foreground">
                                {{ event.author.name }}
                            </dd>
                        </div>
                        <div v-if="event.published_at">
                            <dt class="text-muted-foreground/70">Publicado</dt>
                            <dd class="font-medium text-card-foreground">
                                {{ formatDate(event.published_at) }}
                            </dd>
                        </div>
                        <div>
                            <dt class="text-muted-foreground/70">Creado</dt>
                            <dd class="font-medium text-card-foreground">
                                {{ formatDate(event.created_at) }}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    </div>
</template>
