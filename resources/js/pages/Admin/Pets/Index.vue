<script setup lang="ts">
import { router } from '@inertiajs/vue3';

interface Pet {
    id: number;
    name: string;
    slug: string;
    species: string;
    status: string;
    photos: string[] | null;
    created_at: string;
    team: { id: number; name: string; slug: string };
}

interface Meta {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

defineProps<{
    pets: Pet[];
    meta: Meta;
}>();

function photoUrl(path: string | null | undefined): string {
    if (!path || typeof path !== 'string') {
        return 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E';
    }

    return path.startsWith('http') ? path : `/storage/${path}`;
}

function speciesLabel(s: string): string {
    const labels: Record<string, string> = {
        dog: 'Perro',
        cat: 'Gato',
        rabbit: 'Conejo',
        bird: 'Ave',
        other: 'Otro',
    };

    return labels[s] ?? s;
}

const speciesEmoji: Record<string, string> = {
    dog: '🐕',
    cat: '🐈',
    rabbit: '🐇',
    bird: '🐦',
    other: '🐾',
};

function statusLabel(s: string): string {
    const labels: Record<string, string> = {
        available: 'Disponible',
        adopted: 'Adoptado',
        in_process: 'En Proceso',
        withheld: 'Reservado',
    };

    return labels[s] ?? s;
}

function statusColor(s: string): string {
    const colors: Record<string, string> = {
        available: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
        adopted: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
        in_process: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
        withheld: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    };
    return colors[s] ?? 'bg-gray-100 text-gray-600';
}

function formatDate(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(
        new Date(d),
    );
}

function destroy(id: number): void {
    if (confirm('¿Eliminar esta mascota?')) {
        router.delete('/admin/mascotas/' + id);
    }
}
</script>

<template>
    <div>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl font-bold text-foreground">Mascotas</h1>
                <p class="mt-1 text-sm text-muted-foreground">
                    Todas las mascotas registradas en la plataforma.
                </p>
            </div>
            <a
                href="/admin/mascotas/crear"
                class="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#2D6A4F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#246142]"
            >
                <svg class="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Nueva Mascota
            </a>
        </div>

        <div class="mt-6 hidden overflow-x-auto rounded-xl border border-border bg-card md:block">
            <table class="w-full min-w-[640px] text-left text-sm">
                <thead class="border-b border-border/50 bg-muted text-xs font-medium text-muted-foreground uppercase">
                    <tr>
                        <th class="px-5 py-3">Foto</th>
                        <th class="px-5 py-3">Nombre</th>
                        <th class="px-5 py-3">Especie</th>
                        <th class="px-5 py-3">Estado</th>
                        <th class="px-5 py-3">Organización</th>
                        <th class="px-5 py-3">Registro</th>
                        <th class="px-5 py-3">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-border/50">
                    <tr
                        v-for="pet in pets"
                        :key="pet.id"
                        class="hover:bg-muted"
                    >
                        <td class="px-5 py-4">
                            <div
                                v-if="pet.photos && pet.photos.length > 0"
                                class="h-10 w-10 overflow-hidden rounded-lg bg-muted"
                            >
                                <img
                                    :src="photoUrl(pet.photos[0])"
                                    :alt="pet.name"
                                    class="h-full w-full object-cover"
                                />
                            </div>
                            <div v-else class="h-10 w-10 rounded-lg bg-muted" />
                        </td>
                        <td class="px-5 py-4 font-medium text-card-foreground">
                            {{ pet.name }}
                        </td>
                        <td class="px-5 py-4 text-muted-foreground">
                            {{ speciesLabel(pet.species) }}
                        </td>
                        <td class="px-5 py-4">
                            <span class="inline-block rounded-full px-3 py-0.5 text-xs font-medium" :class="statusColor(pet.status)">{{ statusLabel(pet.status) }}</span>
                        </td>
                        <td class="px-5 py-4 text-muted-foreground">
                            {{ pet.team.name }}
                        </td>
                        <td class="px-5 py-4 text-muted-foreground/70">
                            {{ formatDate(pet.created_at) }}
                        </td>
                        <td class="px-5 py-4">
                            <div class="flex items-center gap-2">
                                <a :href="'/admin/mascotas/' + pet.id" class="text-xs text-[#2D6A4F] hover:underline">Ver</a>
                                <a :href="'/admin/mascotas/' + pet.id + '/editar'" class="text-xs text-muted-foreground hover:text-[#2D6A4F]">Editar</a>
                                <button @click="destroy(pet.id)" class="text-xs text-red-500 hover:text-red-700">Eliminar</button>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="pets.length === 0">
                        <td colspan="7" class="px-5 py-8 text-center text-muted-foreground/70">
                            No hay mascotas registradas.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="pets.length === 0" class="mt-6 md:hidden">
            <div class="rounded-xl border border-border bg-card px-5 py-8 text-center text-sm text-muted-foreground/70">
                No hay mascotas registradas.
            </div>
        </div>

        <div v-else class="mt-6 space-y-3 md:hidden">
            <div
                v-for="pet in pets"
                :key="pet.id"
                class="rounded-xl border border-border bg-card p-4 transition hover:shadow-sm"
            >
                <div class="flex items-start gap-4">
                    <div class="shrink-0">
                        <div
                            v-if="pet.photos && pet.photos.length > 0"
                            class="h-14 w-14 overflow-hidden rounded-xl bg-muted"
                        >
                            <img
                                :src="photoUrl(pet.photos[0])"
                                :alt="pet.name"
                                class="h-full w-full object-cover"
                            />
                        </div>
                        <div v-else class="flex h-14 w-14 items-center justify-center rounded-xl bg-[#2D6A4F]/10 text-xl dark:bg-[#2D6A4F]/20">
                            {{ speciesEmoji[pet.species] || '🐾' }}
                        </div>
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="flex items-start justify-between gap-2">
                            <div>
                                <p class="font-semibold text-card-foreground">{{ pet.name }}</p>
                                <p class="text-xs text-muted-foreground">{{ speciesLabel(pet.species) }} · {{ pet.team.name }}</p>
                            </div>
                            <span class="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold" :class="statusColor(pet.status)">{{ statusLabel(pet.status) }}</span>
                        </div>
                        <p class="mt-1.5 text-xs text-muted-foreground/70">{{ formatDate(pet.created_at) }}</p>
                        <div class="mt-3 flex items-center gap-3 border-t border-border/50 pt-3">
                            <a :href="'/admin/mascotas/' + pet.id" class="flex items-center gap-1 text-xs font-medium text-[#2D6A4F] dark:text-emerald-400">
                                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Ver
                            </a>
                            <a :href="'/admin/mascotas/' + pet.id + '/editar'" class="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-[#2D6A4F] dark:hover:text-emerald-400">
                                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Editar
                            </a>
                            <button @click="destroy(pet.id)" class="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700">
                                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="meta.last_page > 1" class="mt-6 flex justify-center gap-2">
            <a
                v-for="page in meta.last_page"
                :key="page"
                :href="'/admin/mascotas?page=' + page"
                class="rounded-lg px-3 py-1.5 text-sm"
                :class="
                    page === meta.current_page
                        ? 'bg-[#2D6A4F] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                "
                >{{ page }}</a
            >
        </div>
    </div>
</template>
