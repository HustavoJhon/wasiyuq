<script setup lang="ts">
interface Announcement {
    id: number;
    title: string;
    slug: string;
    description: string;
    event_date: string | null;
    location: string | null;
    type: string;
    cover_image: string | null;
    is_published: boolean;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    team: {
        id: number;
        name: string;
        slug: string;
        logo: string | null;
        phone: string | null;
        city: string | null;
        state: string | null;
    };
    author: { id: number; name: string };
}

defineProps<{ event: Announcement }>();

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

function formatDate(date: string | null): string {
    if (!date) {
        return '';
    }

    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'long' }).format(
        new Date(date),
    );
}
</script>

<template>
    <div class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <a
            href="/eventos"
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
            Todos los eventos
        </a>

        <div class="mt-6 flex flex-wrap items-center gap-3">
            <span
                class="rounded-full bg-amber-100 px-4 py-1 text-sm font-medium text-amber-700"
                >{{ typeLabel(event.type) }}</span
            >
            <span
                class="rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700"
                >Próximo</span
            >
        </div>

        <h1 class="mt-4 text-3xl font-bold text-foreground">
            {{ event.title }}
        </h1>

        <div class="mt-8 grid gap-4 sm:grid-cols-2">
            <div class="rounded-xl bg-muted p-4">
                <p class="text-xs text-muted-foreground/70">Fecha</p>
                <p class="mt-0.5 text-sm font-medium text-foreground">
                    {{ formatDate(event.event_date) }}
                </p>
            </div>
            <div class="rounded-xl bg-muted p-4">
                <p class="text-xs text-muted-foreground/70">Ubicación</p>
                <p class="mt-0.5 text-sm font-medium text-foreground">
                    {{ event.location }}
                </p>
            </div>
            <div class="rounded-xl bg-muted p-4">
                <p class="text-xs text-muted-foreground/70">Organiza</p>
                <p class="mt-0.5 text-sm font-medium text-foreground">
                    {{ event.team.name }}
                </p>
            </div>
            <div v-if="event.team.phone" class="rounded-xl bg-muted p-4">
                <p class="text-xs text-muted-foreground/70">Contacto</p>
                <p class="mt-0.5 text-sm font-medium text-foreground">
                    {{ event.team.phone }}
                </p>
            </div>
        </div>

        <div class="mt-8">
            <h3 class="text-sm font-semibold text-foreground">
                Descripción del evento
            </h3>
            <p
                class="mt-2 text-sm leading-relaxed whitespace-pre-line text-muted-foreground"
            >
                {{ event.description }}
            </p>
        </div>
    </div>
</template>
