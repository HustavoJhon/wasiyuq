<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import admin from '@/routes/admin';

interface Stats {
    total_pets: number;
    available_pets: number;
    adopted_pets: number;
    total_organizations: number;
    total_adoptions: number;
    pending_adoptions: number;
    total_events: number;
    total_blog_posts: number;
    pending_follow_ups: number;
    total_users: number;
}

interface RecentAdoption {
    id: number;
    status: string;
    created_at: string;
    pet: { id: number; name: string; slug: string };
    adopter: { id: number; name: string };
}

interface RecentPet {
    id: number;
    name: string;
    slug: string;
    species: string;
    status: string;
    created_at: string;
    team: { id: number; name: string };
}

defineProps<{
    stats: Stats;
    recent_adoptions: RecentAdoption[];
    recent_pets: RecentPet[];
}>();

function statusLabel(status: string): string {
    const labels: Record<string, string> = {
        pending: 'Pendiente',
        approved: 'Aprobada',
        rejected: 'Rechazada',
        completed: 'Completada',
        cancelled: 'Cancelada',
        available: 'Disponible',
        adopted: 'Adoptado',
        in_process: 'En Proceso',
    };

    return labels[status] ?? status;
}

function formatDate(date: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(
        new Date(date),
    );
}
</script>

<template>
    <div>
        <h1 class="text-2xl font-bold text-foreground">
            Panel de Administración
        </h1>
        <p class="mt-1 text-sm text-muted-foreground">
            Vista general de toda la plataforma Wasiyuq.
        </p>

        <div
            class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
            <Link
                :href="admin.pets.index().url"
                class="block rounded-xl border border-border bg-card p-5 transition hover:border-[#2D6A4F] hover:shadow-md"
            >
                <p
                    class="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase"
                >
                    Total Mascotas
                </p>
                <p class="mt-1 text-3xl font-bold text-card-foreground">
                    {{ stats.total_pets }}
                </p>
                <div class="mt-2 flex gap-3 text-xs text-muted-foreground">
                    <span>{{ stats.available_pets }} disponibles</span>
                    <span>{{ stats.adopted_pets }} adoptados</span>
                </div>
            </Link>

            <Link
                :href="admin.organizations.index().url"
                class="block rounded-xl border border-border bg-card p-5 transition hover:border-[#2D6A4F] hover:shadow-md"
            >
                <p
                    class="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase"
                >
                    Organizaciones
                </p>
                <p class="mt-1 text-3xl font-bold text-card-foreground">
                    {{ stats.total_organizations }}
                </p>
                <p class="mt-2 text-xs text-muted-foreground">
                    Entidades registradas
                </p>
            </Link>

            <Link
                :href="admin.adoptions.index().url"
                class="block rounded-xl border border-border bg-card p-5 transition hover:border-[#2D6A4F] hover:shadow-md"
            >
                <p
                    class="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase"
                >
                    Adopciones
                </p>
                <p class="mt-1 text-3xl font-bold text-card-foreground">
                    {{ stats.total_adoptions }}
                </p>
                <div class="mt-2 flex gap-3 text-xs text-muted-foreground">
                    <span class="text-amber-600"
                        >{{ stats.pending_adoptions }} pendientes</span
                    >
                </div>
            </Link>

            <Link
                :href="admin.followUps.index().url"
                class="block rounded-xl border border-border bg-card p-5 transition hover:border-[#2D6A4F] hover:shadow-md"
            >
                <p
                    class="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase"
                >
                    Seguimiento
                </p>
                <p class="mt-1 text-3xl font-bold text-card-foreground">
                    {{ stats.pending_follow_ups }}
                </p>
                <p class="mt-2 text-xs text-muted-foreground">
                    Visitas pendientes
                </p>
            </Link>

            <Link
                :href="admin.users.index().url"
                class="block rounded-xl border border-border bg-card p-5 transition hover:border-[#2D6A4F] hover:shadow-md"
            >
                <p
                    class="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase"
                >
                    Usuarios
                </p>
                <p class="mt-1 text-3xl font-bold text-card-foreground">
                    {{ stats.total_users }}
                </p>
                <p class="mt-2 text-xs text-muted-foreground">
                    Cuentas registradas
                </p>
            </Link>

            <Link
                :href="admin.events.index().url"
                class="block rounded-xl border border-border bg-card p-5 transition hover:border-[#2D6A4F] hover:shadow-md"
            >
                <p
                    class="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase"
                >
                    Eventos
                </p>
                <p class="mt-1 text-3xl font-bold text-card-foreground">
                    {{ stats.total_events }}
                </p>
            </Link>

            <Link
                :href="admin.blog.index().url"
                class="block rounded-xl border border-border bg-card p-5 transition hover:border-[#2D6A4F] hover:shadow-md"
            >
                <p
                    class="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase"
                >
                    Blog
                </p>
                <p class="mt-1 text-3xl font-bold text-card-foreground">
                    {{ stats.total_blog_posts }}
                </p>
                <p class="mt-2 text-xs text-muted-foreground">
                    Artículos publicados
                </p>
            </Link>
        </div>

        <div class="mt-10 grid gap-8 lg:grid-cols-2">
            <div>
                <h2 class="text-lg font-semibold text-foreground">
                    Últimas adopciones
                </h2>
                <div
                    v-if="recent_adoptions.length === 0"
                    class="mt-4 text-sm text-muted-foreground/70"
                >
                    Sin adopciones recientes.
                </div>
                <div v-else class="mt-4 space-y-3">
                    <div
                        v-for="adoption in recent_adoptions"
                        :key="adoption.id"
                        class="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4"
                    >
                        <div>
                            <p class="text-sm font-medium text-card-foreground">
                                {{ adoption.pet.name }}
                            </p>
                            <p class="text-xs text-muted-foreground">
                                {{ adoption.adopter.name }}
                            </p>
                        </div>
                        <div class="text-right">
                            <span
                                class="rounded-full bg-muted px-3 py-0.5 text-xs font-medium text-muted-foreground"
                                >{{ statusLabel(adoption.status) }}</span
                            >
                            <p class="mt-0.5 text-xs text-muted-foreground/70">
                                {{ formatDate(adoption.created_at) }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h2 class="text-lg font-semibold text-foreground">
                    Últimas mascotas registradas
                </h2>
                <div
                    v-if="recent_pets.length === 0"
                    class="mt-4 text-sm text-muted-foreground/70"
                >
                    Sin mascotas registradas.
                </div>
                <div v-else class="mt-4 space-y-3">
                    <div
                        v-for="pet in recent_pets"
                        :key="pet.id"
                        class="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4"
                    >
                        <div>
                            <p class="text-sm font-medium text-card-foreground">
                                {{ pet.name }}
                            </p>
                            <p class="text-xs text-muted-foreground">
                                {{ pet.team.name }}
                            </p>
                        </div>
                        <div class="text-right">
                            <span
                                class="rounded-full bg-muted px-3 py-0.5 text-xs font-medium text-muted-foreground"
                                >{{ statusLabel(pet.status) }}</span
                            >
                            <p class="mt-0.5 text-xs text-muted-foreground/70">
                                {{ formatDate(pet.created_at) }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
