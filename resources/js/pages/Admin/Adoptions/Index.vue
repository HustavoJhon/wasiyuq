<script setup lang="ts">
interface Adoption {
    id: number;
    status: string;
    created_at: string;
    pet: { id: number; name: string; slug: string; species: string };
    adopter: { id: number; name: string; email: string };
    team: { id: number; name: string; slug: string };
}

interface Meta {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

defineProps<{
    adoptions: Adoption[];
    meta: Meta;
}>();

const speciesEmoji: Record<string, string> = {
    dog: '🐕',
    cat: '🐈',
    rabbit: '🐇',
    bird: '🐦',
    other: '🐾',
};

function statusClass(status: string): string {
    const map: Record<string, string> = {
        pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
        approved: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
        rejected: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
        completed: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
        cancelled: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
    };

    return map[status] ?? 'bg-gray-100 text-gray-600';
}

function statusLabel(s: string): string {
    const labels: Record<string, string> = {
        pending: 'Pendiente',
        approved: 'Aprobada',
        rejected: 'Rechazada',
        completed: 'Completada',
        cancelled: 'Cancelada',
    };

    return labels[s] ?? s;
}

function formatDate(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(
        new Date(d),
    );
}
</script>

<template>
    <div>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl font-bold text-foreground">Adopciones</h1>
                <p class="mt-1 text-sm text-muted-foreground">
                    Todas las solicitudes de adopción.
                </p>
            </div>
        </div>

        <div class="mt-6 hidden overflow-x-auto rounded-xl border border-border bg-card md:block">
            <table class="w-full min-w-[550px] text-left text-sm">
                <thead class="border-b border-border/50 bg-muted text-xs font-medium text-muted-foreground uppercase">
                    <tr>
                        <th class="px-5 py-3">Mascota</th>
                        <th class="px-5 py-3">Adoptante</th>
                        <th class="px-5 py-3">Organización</th>
                        <th class="px-5 py-3">Estado</th>
                        <th class="px-5 py-3">Fecha</th>
                        <th class="px-5 py-3"></th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-border/50">
                    <tr v-for="adoption in adoptions" :key="adoption.id" class="hover:bg-muted">
                        <td class="px-5 py-4 font-medium text-card-foreground">{{ adoption.pet.name }}</td>
                        <td class="px-5 py-4">
                            <p class="text-card-foreground">{{ adoption.adopter.name }}</p>
                            <p class="text-xs text-muted-foreground/70">{{ adoption.adopter.email }}</p>
                        </td>
                        <td class="px-5 py-4 text-muted-foreground">{{ adoption.team.name }}</td>
                        <td class="px-5 py-4">
                            <span class="inline-block rounded-full px-3 py-0.5 text-xs font-medium" :class="statusClass(adoption.status)">{{ statusLabel(adoption.status) }}</span>
                        </td>
                        <td class="px-5 py-4 text-muted-foreground/70">{{ formatDate(adoption.created_at) }}</td>
                        <td class="px-5 py-4">
                            <a :href="'/admin/adopciones/' + adoption.id" class="text-sm font-medium text-[#2D6A4F] hover:underline dark:text-emerald-400">Ver</a>
                        </td>
                    </tr>
                    <tr v-if="adoptions.length === 0">
                        <td colspan="6" class="px-5 py-8 text-center text-muted-foreground/70">
                            No hay solicitudes de adopción.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="adoptions.length === 0" class="mt-6 md:hidden">
            <div class="rounded-xl border border-border bg-card px-5 py-8 text-center text-sm text-muted-foreground/70">
                No hay solicitudes de adopción.
            </div>
        </div>

        <div v-else class="mt-6 space-y-3 md:hidden">
            <div v-for="adoption in adoptions" :key="adoption.id" class="rounded-xl border border-border bg-card p-4 transition hover:shadow-sm">
                <div class="flex items-start justify-between gap-3">
                    <div class="flex items-center gap-3">
                        <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2D6A4F]/10 text-lg dark:bg-[#2D6A4F]/20">{{ speciesEmoji[adoption.pet.species] || '🐾' }}</span>
                        <div>
                            <p class="font-semibold text-card-foreground">{{ adoption.pet.name }}</p>
                            <p class="text-xs text-muted-foreground">{{ adoption.adopter.name }}</p>
                        </div>
                    </div>
                    <span class="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold" :class="statusClass(adoption.status)">{{ statusLabel(adoption.status) }}</span>
                </div>
                <div class="mt-3 flex items-center justify-between border-t border-border/50 pt-3">
                    <p class="text-[10px] text-muted-foreground/60">{{ adoption.team.name }} · {{ formatDate(adoption.created_at) }}</p>
                    <a :href="'/admin/adopciones/' + adoption.id" class="flex items-center gap-1 text-xs font-medium text-[#2D6A4F] dark:text-emerald-400">
                        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Ver detalle
                    </a>
                </div>
            </div>
        </div>

        <div v-if="meta.last_page > 1" class="mt-6 flex justify-center gap-2">
            <a
                v-for="page in meta.last_page"
                :key="page"
                :href="'/admin/adopciones?page=' + page"
                class="rounded-lg px-3 py-1.5 text-sm"
                :class="
                    page === meta.current_page
                        ? 'bg-[#2D6A4F] text-white dark:bg-emerald-500 dark:text-black'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                "
                >{{ page }}</a
            >
        </div>
    </div>
</template>
