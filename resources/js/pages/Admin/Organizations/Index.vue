<script setup lang="ts">
import { router } from '@inertiajs/vue3';

interface Organization {
    id: number;
    name: string;
    slug: string;
    city: string | null;
    state: string | null;
    pets_count: number;
    adoptions_count: number;
    announcements_count: number;
    blog_posts_count: number;
    created_at: string;
}

interface Meta {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

defineProps<{
    organizations: Organization[];
    meta: Meta;
}>();

function formatDate(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(
        new Date(d),
    );
}

function destroy(id: number): void {
    if (confirm('¿Eliminar esta organización?')) {
        router.delete('/admin/organizaciones/' + id);
    }
}
</script>

<template>
    <div>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl font-bold text-foreground">
                    Organizaciones
                </h1>
                <p class="mt-1 text-sm text-muted-foreground">
                    Entidades registradas en la plataforma.
                </p>
            </div>
            <a
                href="/admin/organizaciones/crear"
                class="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#2D6A4F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#246142]"
            >
                <svg class="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Nueva Organización
            </a>
        </div>

        <div class="mt-6 hidden overflow-x-auto rounded-xl border border-border bg-card md:block">
            <table class="w-full min-w-[700px] text-left text-sm">
                <thead class="border-b border-border/50 bg-muted text-xs font-medium text-muted-foreground uppercase">
                    <tr>
                        <th class="px-5 py-3">Nombre</th>
                        <th class="px-5 py-3">Ubicación</th>
                        <th class="px-5 py-3 text-center">Mascotas</th>
                        <th class="px-5 py-3 text-center">Adopciones</th>
                        <th class="px-5 py-3 text-center">Eventos</th>
                        <th class="px-5 py-3 text-center">Blog</th>
                        <th class="px-5 py-3">Registro</th>
                        <th class="px-5 py-3">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-border/50">
                    <tr v-for="org in organizations" :key="org.id" class="hover:bg-muted">
                        <td class="px-5 py-4">
                            <a :href="'/admin/organizaciones/' + org.slug" class="font-medium text-[#2D6A4F] hover:underline dark:text-emerald-400">{{ org.name }}</a>
                        </td>
                        <td class="px-5 py-4 text-muted-foreground">
                            {{ org.city ?? org.state ?? '-' }}
                        </td>
                        <td class="px-5 py-4 text-center text-muted-foreground">{{ org.pets_count }}</td>
                        <td class="px-5 py-4 text-center text-muted-foreground">{{ org.adoptions_count }}</td>
                        <td class="px-5 py-4 text-center text-muted-foreground">{{ org.announcements_count }}</td>
                        <td class="px-5 py-4 text-center text-muted-foreground">{{ org.blog_posts_count }}</td>
                        <td class="px-5 py-4 text-muted-foreground/70">{{ formatDate(org.created_at) }}</td>
                        <td class="px-5 py-4">
                            <div class="flex items-center gap-2">
                                <a :href="'/admin/organizaciones/' + org.slug" class="text-xs text-[#2D6A4F] hover:underline dark:text-emerald-400">Ver</a>
                                <a :href="'/admin/organizaciones/' + org.slug + '/editar'" class="text-xs text-muted-foreground hover:text-[#2D6A4F] dark:hover:text-emerald-400">Editar</a>
                                <button @click="destroy(org.id)" class="text-xs text-red-500 hover:text-red-700">Eliminar</button>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="organizations.length === 0">
                        <td colspan="8" class="px-5 py-8 text-center text-muted-foreground/70">
                            No hay organizaciones registradas.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="organizations.length === 0" class="mt-6 md:hidden">
            <div class="rounded-xl border border-border bg-card px-5 py-8 text-center text-sm text-muted-foreground/70">
                No hay organizaciones registradas.
            </div>
        </div>

        <div v-else class="mt-6 space-y-3 md:hidden">
            <div v-for="org in organizations" :key="org.id" class="rounded-xl border border-border bg-card p-4 transition hover:shadow-sm">
                <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0 flex-1">
                        <a :href="'/admin/organizaciones/' + org.slug" class="font-semibold text-[#2D6A4F] hover:underline dark:text-emerald-400">{{ org.name }}</a>
                        <p class="mt-0.5 text-xs text-muted-foreground">
                            {{ org.city ?? org.state ?? 'Sin ubicación' }}
                        </p>
                    </div>
                    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2D6A4F]/10 text-sm font-bold text-[#2D6A4F] dark:bg-[#2D6A4F]/20 dark:text-emerald-400">
                        {{ org.name.charAt(0).toUpperCase() }}
                    </div>
                </div>

                <div class="mt-4 grid grid-cols-4 gap-2 border-t border-border/50 pt-4">
                    <div class="text-center">
                        <p class="text-sm font-bold text-foreground">{{ org.pets_count }}</p>
                        <p class="text-[10px] text-muted-foreground">Mascotas</p>
                    </div>
                    <div class="text-center">
                        <p class="text-sm font-bold text-foreground">{{ org.adoptions_count }}</p>
                        <p class="text-[10px] text-muted-foreground">Adopciones</p>
                    </div>
                    <div class="text-center">
                        <p class="text-sm font-bold text-foreground">{{ org.announcements_count }}</p>
                        <p class="text-[10px] text-muted-foreground">Eventos</p>
                    </div>
                    <div class="text-center">
                        <p class="text-sm font-bold text-foreground">{{ org.blog_posts_count }}</p>
                        <p class="text-[10px] text-muted-foreground">Blog</p>
                    </div>
                </div>

                <div class="mt-3 flex items-center justify-between border-t border-border/50 pt-3">
                    <p class="text-[10px] text-muted-foreground/60">{{ formatDate(org.created_at) }}</p>
                    <div class="flex items-center gap-3">
                        <a :href="'/admin/organizaciones/' + org.slug" class="flex items-center gap-1 text-xs font-medium text-[#2D6A4F] dark:text-emerald-400">
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Ver
                        </a>
                        <a :href="'/admin/organizaciones/' + org.slug + '/editar'" class="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-[#2D6A4F] dark:hover:text-emerald-400">
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Editar
                        </a>
                        <button @click="destroy(org.id)" class="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700">
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="meta.last_page > 1" class="mt-6 flex justify-center gap-2">
            <a
                v-for="page in meta.last_page"
                :key="page"
                :href="'/admin/organizaciones?page=' + page"
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
