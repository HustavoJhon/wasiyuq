<script setup lang="ts">
import { usePhotoUrl } from '@/composables/usePhotoUrl';
import RecommendedPets from '@/components/pets/RecommendedPets.vue';

const { photoUrl } = usePhotoUrl();

interface RecommendedPet {
    id: number;
    name: string;
    slug: string;
    species: string;
    species_label: string;
    breed: string | null;
    age_years: number;
    age_months: number;
    size: string;
    size_label: string;
    gender: string;
    photos: string[] | null;
    compatibility: number | null;
    team: { id: number; name: string; slug: string; city: string | null } | null;
}

interface Application {
    id: number;
    name: string;
    slug: string;
    species: string;
    status: string;
    created_at: string;
    pet: { id: number; name: string; slug: string; species: string; photos: string[] | null };
}

interface Stats {
    total_applications: number;
    pending_applications: number;
    approved_applications: number;
    completed_adoptions: number;
    pending_follow_ups: number;
    recent_applications: Application[];
}

defineProps<{ stats: Stats; recommendedPets: RecommendedPet[] }>();

function statusLabel(s: string): string {
    const labels: Record<string, string> = { pending: 'Pendiente', approved: 'Aprobada', rejected: 'Rechazada', completed: 'Completada', cancelled: 'Cancelada' };

    return labels[s] ?? s;
}

function statusClass(s: string): string {
    const map: Record<string, string> = { pending: 'bg-amber-100 text-amber-700', approved: 'bg-blue-100 text-blue-700', rejected: 'bg-red-100 text-red-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-gray-100 text-gray-500' };

    return map[s] ?? 'bg-gray-100 text-gray-600';
}

function formatDate(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d));
}
</script>

<template>
    <div class="mx-auto max-w-5xl">
        <div class="mb-8">
            <h1 class="text-2xl font-bold text-foreground">Mis Actividades</h1>
            <p class="mt-1 text-sm text-muted-foreground">Resumen de tus postulaciones y seguimientos.</p>
        </div>

        <!-- Recommended Pets -->
        <RecommendedPets v-if="recommendedPets && recommendedPets.length > 0" :pets="recommendedPets" class="mb-8" />

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div class="rounded-xl border border-border bg-card p-5">
                <p class="text-sm text-muted-foreground">Postulaciones</p>
                <p class="mt-1 text-3xl font-bold text-foreground">{{ stats.total_applications }}</p>
            </div>
            <div class="rounded-xl border border-border bg-card p-5">
                <p class="text-sm text-muted-foreground">Pendientes</p>
                <p class="mt-1 text-3xl font-bold text-amber-600">{{ stats.pending_applications }}</p>
            </div>
            <div class="rounded-xl border border-border bg-card p-5">
                <p class="text-sm text-muted-foreground">Aprobadas</p>
                <p class="mt-1 text-3xl font-bold text-blue-600">{{ stats.approved_applications }}</p>
            </div>
            <div class="rounded-xl border border-border bg-card p-5">
                <p class="text-sm text-muted-foreground">Seguimientos pendientes</p>
                <p class="mt-1 text-3xl font-bold text-amber-600">{{ stats.pending_follow_ups }}</p>
            </div>
        </div>

        <div class="mt-8 grid gap-6 lg:grid-cols-2">
            <div class="rounded-xl border border-border bg-card">
                <div class="flex items-center justify-between border-b border-border px-5 py-4">
                    <h2 class="font-semibold text-foreground">Últimas Postulaciones</h2>
                    <a href="/mi-adopcion/postulaciones" class="text-sm text-[#2D6A4F] hover:underline">Ver todas</a>
                </div>
                <div v-if="stats.recent_applications.length === 0" class="p-8 text-center text-sm text-muted-foreground/70">
                    Aún no has postulado a ninguna mascota.
                </div>
                <div v-else class="divide-y divide-border">
                    <div v-for="app in stats.recent_applications" :key="app.id" class="flex items-center gap-4 px-5 py-4">
                        <div class="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                            <img v-if="app.pet.photos?.length" :src="photoUrl(app.pet.photos[0])" :alt="app.pet.name" class="h-full w-full object-cover" />
                        </div>
                        <div class="min-w-0 flex-1">
                            <p class="font-medium text-foreground">{{ app.pet.name }}</p>
                            <p class="text-xs text-muted-foreground">{{ formatDate(app.created_at) }}</p>
                        </div>
                        <span class="rounded-full px-2.5 py-0.5 text-xs font-medium" :class="statusClass(app.status)">{{ statusLabel(app.status) }}</span>
                    </div>
                </div>
            </div>

            <div class="rounded-xl border border-border bg-card">
                <div class="flex items-center justify-between border-b border-border px-5 py-4">
                    <h2 class="font-semibold text-foreground">Acceso Rápido</h2>
                </div>
                <div class="space-y-2 p-5">
                    <a href="/mi-adopcion/postulaciones" class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Mis Postulaciones
                    </a>
                    <a href="/mi-adopcion/seguimientos" class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        Mi Seguimiento
                    </a>
                    <a href="/mascotas" class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        Buscar mascotas
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>
