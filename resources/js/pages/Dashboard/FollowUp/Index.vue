<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import type { Team } from '@/types';

interface FollowUp {
    id: number;
    scheduled_date: string;
    completed_date: string | null;
    status: string;
    notes: string | null;
    adoption: {
        id: number;
        pet: {
            id: number;
            name: string;
            slug: string;
            species: string;
            photos: string[] | null;
        };
        adopter: { id: number; name: string; email: string };
    };
    created_by: { id: number; name: string };
}

const props = defineProps<{
    followUps: FollowUp[];
    currentTeam?: Team | null;
    filter?: string | null;
}>();

const statusFilters = [
    { label: 'Todos', value: '' },
    { label: 'Pendientes', value: 'pending' },
    { label: 'Completados', value: 'completed' },
    { label: 'No Realizados', value: 'missed' },
];

function applyFilter(status: string): void {
    router.get(
        `/${props.currentTeam?.slug}/seguimientos`,
        status ? { status } : {},
    );
}

function statusClass(status: string): string {
    const map: Record<string, string> = {
        pending: 'bg-amber-100 text-amber-700',
        completed: 'bg-green-100 text-green-700',
        missed: 'bg-red-100 text-red-700',
    };

    return map[status] ?? 'bg-gray-100 text-gray-600';
}

function statusLabel(s: string): string {
    const labels: Record<string, string> = {
        pending: 'Pendiente',
        completed: 'Completado',
        missed: 'No Realizado',
    };

    return labels[s] ?? s;
}

function formatDate(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(
        new Date(d),
    );
}

function speciesLabel(s: string): string {
    const labels: Record<string, string> = {
        dog: 'Perro',
        cat: 'Gato',
        other: 'Otro',
    };

    return labels[s] ?? s;
}
</script>

<template>
    <div>
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-foreground">
                    Seguimiento Post-Adopción
                </h1>
                <p class="mt-1 text-sm text-muted-foreground">
                    Control de hitos de seguimiento de {{ currentTeam?.name }}.
                </p>
            </div>
        </div>

        <div class="mt-6 flex flex-wrap gap-2">
            <button
                v-for="f in statusFilters"
                :key="f.value"
                class="rounded-lg px-4 py-2 text-sm font-medium transition"
                :class="
                    (filter ?? '') === f.value
                        ? 'bg-[#2D6A4F] text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                "
                @click="applyFilter(f.value)"
            >
                {{ f.label }}
            </button>
        </div>

        <div
            class="mt-4 overflow-hidden rounded-xl border border-border bg-card"
        >
            <table class="w-full text-left text-sm">
                <thead
                    class="border-b border-border/50 bg-muted text-xs font-medium text-muted-foreground uppercase"
                >
                    <tr>
                        <th class="px-5 py-3">Mascota</th>
                        <th class="px-5 py-3">Adoptante</th>
                        <th class="px-5 py-3">Hito</th>
                        <th class="px-5 py-3">Fecha</th>
                        <th class="px-5 py-3">Estado</th>
                        <th class="px-5 py-3"></th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-border/50">
                    <tr
                        v-for="fu in followUps"
                        :key="fu.id"
                        class="hover:bg-muted"
                    >
                        <td class="px-5 py-4">
                            <div class="flex items-center gap-3">
                                <div
                                    v-if="
                                        fu.adoption.pet.photos &&
                                        fu.adoption.pet.photos.length > 0
                                    "
                                    class="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-muted"
                                >
                                    <img
                                        :src="
                                            '/storage/' +
                                            fu.adoption.pet.photos[0]
                                        "
                                        :alt="fu.adoption.pet.name"
                                        class="h-full w-full object-cover"
                                    />
                                </div>
                                <div>
                                    <p class="font-medium text-card-foreground">
                                        {{ fu.adoption.pet.name }}
                                    </p>
                                    <p class="text-xs text-muted-foreground/70">
                                        {{
                                            speciesLabel(
                                                fu.adoption.pet.species,
                                            )
                                        }}
                                    </p>
                                </div>
                            </div>
                        </td>
                        <td class="px-5 py-4">
                            <p class="text-card-foreground">
                                {{ fu.adoption.adopter.name }}
                            </p>
                            <p class="text-xs text-muted-foreground/70">
                                {{ fu.adoption.adopter.email }}
                            </p>
                        </td>
                        <td class="px-5 py-4 text-muted-foreground/70">
                            {{ fu.notes ?? '—' }}
                        </td>
                        <td class="px-5 py-4 text-muted-foreground/70">
                            {{ formatDate(fu.scheduled_date) }}
                        </td>
                        <td class="px-5 py-4">
                            <span
                                class="rounded-full px-3 py-0.5 text-xs font-medium"
                                :class="statusClass(fu.status)"
                                >{{ statusLabel(fu.status) }}</span
                            >
                        </td>
                        <td class="px-5 py-4">
                            <a
                                :href="`/${currentTeam?.slug}/seguimientos/${fu.id}`"
                                class="text-sm text-[#2D6A4F] hover:underline"
                                >Ver</a
                            >
                        </td>
                    </tr>
                    <tr v-if="followUps.length === 0">
                        <td
                            colspan="6"
                            class="px-5 py-8 text-center text-muted-foreground/70"
                        >
                            No hay seguimientos registrados.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
