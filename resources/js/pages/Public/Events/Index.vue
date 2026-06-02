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

const emit = defineEmits<{
    updateFilters: [filters: { type?: string }];
}>();

function updateFilters(newFilters: { type?: string }) {
    emit('updateFilters', newFilters);
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
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="text-center">
            <h1
                class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
                Eventos de bienestar animal
            </h1>
            <p class="mt-3 text-muted-foreground">
                Campañas de vacunación, ferias de adopción y más en toda la
                región Cusco.
            </p>
        </div>

        <div class="mt-8">
            <div class="flex flex-wrap items-center gap-3">
                <span class="text-sm font-medium text-foreground"
                    >Filtrar:</span
                >
                <select
                    :value="props.filters.type"
                    @change="
                        (e) =>
                            updateFilters({
                                type: (e.target as HTMLSelectElement).value,
                            })
                    "
                    class="rounded-xl border border-border bg-card px-4 py-2 text-sm text-muted-foreground outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                >
                    <option value="">Tipo</option>
                    <option value="adoption_fair">Feria de Adopción</option>
                    <option value="fundraiser">Recaudación</option>
                    <option value="workshop">Taller</option>
                    <option value="campaign">Campaña</option>
                </select>
            </div>
        </div>

        <div v-if="events.length === 0" class="mt-16 text-center">
            <p class="text-muted-foreground/70">
                No hay eventos programados actualmente.
            </p>
        </div>

        <div v-else class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <a
                v-for="event in events"
                :key="event.id"
                :href="'/eventos/' + event.slug"
                class="overflow-hidden rounded-2xl border border-border bg-card transition hover:shadow-lg hover:shadow-black/5"
            >
                <div
                    class="flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 py-10"
                >
                    <span
                        class="rounded-full bg-amber-200/60 px-4 py-1.5 text-xs font-medium text-amber-800"
                        >{{ typeLabel(event.type) }}</span
                    >
                </div>
                <div class="p-5">
                    <div
                        class="flex items-center gap-2 text-xs text-muted-foreground/70"
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
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        {{ formatDate(event.event_date) }}
                    </div>
                    <h3 class="mt-2 text-lg font-semibold text-foreground">
                        {{ event.title }}
                    </h3>
                    <div class="mt-3 space-y-1 text-sm text-muted-foreground">
                        <p v-if="event.location">📍 {{ event.location }}</p>
                    </div>
                    <p class="mt-3 text-xs text-muted-foreground/70">
                        {{ event.team.name }}
                    </p>
                </div>
            </a>
        </div>

        <div v-if="meta.last_page > 1" class="mt-12 flex justify-center gap-2">
            <a
                v-for="page in meta.last_page"
                :key="page"
                :href="'/eventos?page=' + page"
                class="rounded-xl px-4 py-2 text-sm"
                :class="
                    page === meta.current_page
                        ? 'bg-[#2D6A4F] text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                "
                >{{ page }}</a
            >
        </div>
    </div>
</template>
