<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { ref } from 'vue';

interface Organization {
    id: number;
    name: string;
    slug: string;
    logo: string | null;
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

const props = defineProps<{
    organizations: Organization[];
    meta: Meta;
    filters: { search?: string };
    stats: {
        total_organizations: number;
        total_pets: number;
        total_adoptions: number;
        total_events: number;
    };
}>();

const searchInput = ref(props.filters.search ?? '');

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

function applyFilters() {
    if (searchTimeout) {
clearTimeout(searchTimeout);
}

    searchTimeout = setTimeout(() => {
        router.get('/admin/organizaciones', {
            search: searchInput.value || '',
            page: 1,
        }, {
            preserveState: true,
            replace: true,
        });
    }, 300);
}

function clearSearch() {
    searchInput.value = '';
    router.get('/admin/organizaciones', { page: 1 }, { preserveState: true, replace: true });
}

function formatDate(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d));
}

function destroy(id: number): void {
    if (confirm('¿Eliminar esta organización?')) {
        router.delete('/admin/organizaciones/' + id);
    }
}

function initials(name: string): string {
    return name
        .split(' ')
        .map(w => w[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

const pageLinks = () => {
    const links = [];

    for (let i = 1; i <= props.meta.last_page; i++) {
        links.push(i);
    }

    return links;
};
</script>

<template>
    <div>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl font-bold text-foreground">Organizaciones</h1>
                <p class="mt-1 text-sm text-muted-foreground">
                    {{ meta.total }} entidad{{ meta.total !== 1 ? 'es' : '' }} registrada{{ meta.total !== 1 ? 's' : '' }} en la plataforma.
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

        <div class="mt-6 grid gap-4 sm:grid-cols-4">
            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2D6A4F]/10">
                        <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-2xl font-bold text-foreground">{{ stats.total_organizations }}</p>
                        <p class="text-xs text-muted-foreground">Organizaciones</p>
                    </div>
                </div>
            </div>
            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                        <svg class="h-5 w-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-2xl font-bold text-foreground">{{ stats.total_pets }}</p>
                        <p class="text-xs text-muted-foreground">Mascotas</p>
                    </div>
                </div>
            </div>
            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                        <svg class="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-2xl font-bold text-foreground">{{ stats.total_adoptions }}</p>
                        <p class="text-xs text-muted-foreground">Adopciones</p>
                    </div>
                </div>
            </div>
            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                        <svg class="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-2xl font-bold text-foreground">{{ stats.total_events }}</p>
                        <p class="text-xs text-muted-foreground">Eventos</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-6 rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
            <div class="flex flex-wrap items-end gap-3">
                <div class="min-w-0 flex-1">
                    <label for="search" class="text-xs font-medium text-muted-foreground">Buscar</label>
                    <div class="relative mt-1">
                        <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            id="search"
                            v-model="searchInput"
                            type="text"
                            placeholder="Buscar por nombre, ciudad o descripción..."
                            class="block w-full rounded-xl border border-[#2D6A4F]/15 bg-white/60 py-2 pl-9 pr-4 text-sm text-foreground transition outline-none placeholder:text-muted-foreground/40 focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 dark:border-[#2D6A4F]/30 dark:bg-black/20"
                            @input="applyFilters"
                        />
                    </div>
                </div>
                <button
                    v-if="filters.search"
                    type="button"
                    class="flex h-[38px] items-center gap-1 self-end rounded-xl border border-[#2D6A4F]/15 px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-muted"
                    @click="clearSearch"
                >
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Limpiar
                </button>
            </div>
        </div>

        <div class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div
                v-for="org in organizations"
                :key="org.id"
                class="group rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 transition-all hover:shadow-md hover:shadow-[#2D6A4F]/5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40"
            >
                <div class="flex items-start gap-4">
                    <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2D6A4F]/10 text-sm font-bold text-[#2D6A4F] dark:bg-[#2D6A4F]/20 dark:text-emerald-400">
                        {{ initials(org.name) }}
                    </div>
                    <div class="min-w-0 flex-1">
                        <a :href="'/admin/organizaciones/' + org.slug" class="font-semibold text-foreground transition hover:text-[#2D6A4F] dark:hover:text-emerald-400">
                            {{ org.name }}
                        </a>
                        <p class="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                            <svg class="h-3 w-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {{ org.city ?? org.state ?? 'Sin ubicación' }}
                        </p>
                    </div>
                </div>

                <div class="mt-4 grid grid-cols-4 divide-x divide-[#2D6A4F]/10 rounded-xl border border-[#2D6A4F]/10 bg-[#2D6A4F]/5 dark:divide-[#2D6A4F]/20 dark:border-[#2D6A4F]/20 dark:bg-[#2D6A4F]/10">
                    <div class="flex flex-col items-center py-3">
                        <p class="text-sm font-bold text-foreground">{{ org.pets_count }}</p>
                        <p class="text-[10px] text-muted-foreground">Mascotas</p>
                    </div>
                    <div class="flex flex-col items-center py-3">
                        <p class="text-sm font-bold text-foreground">{{ org.adoptions_count }}</p>
                        <p class="text-[10px] text-muted-foreground">Adopciones</p>
                    </div>
                    <div class="flex flex-col items-center py-3">
                        <p class="text-sm font-bold text-foreground">{{ org.announcements_count }}</p>
                        <p class="text-[10px] text-muted-foreground">Eventos</p>
                    </div>
                    <div class="flex flex-col items-center py-3">
                        <p class="text-sm font-bold text-foreground">{{ org.blog_posts_count }}</p>
                        <p class="text-[10px] text-muted-foreground">Blog</p>
                    </div>
                </div>

                <div class="mt-4 flex items-center justify-between">
                    <span class="text-[10px] text-muted-foreground/60">{{ formatDate(org.created_at) }}</span>
                    <div class="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <a :href="'/admin/organizaciones/' + org.slug" class="inline-flex items-center gap-1 rounded-lg border border-[#2D6A4F]/20 px-2.5 py-1 text-xs font-medium text-[#2D6A4F] transition hover:bg-[#2D6A4F]/5 dark:text-emerald-400">
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Ver
                        </a>
                        <a :href="'/admin/organizaciones/' + org.slug + '/editar'" class="rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground transition hover:text-[#2D6A4F] dark:hover:text-emerald-400">Editar</a>
                        <button @click="destroy(org.id)" class="rounded-lg px-2.5 py-1 text-xs font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/30">Eliminar</button>
                    </div>
                </div>
            </div>

            <div v-if="organizations.length === 0" class="col-span-full flex flex-col items-center justify-center py-16 text-muted-foreground/50">
                <svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p class="mt-3 font-medium text-foreground/60">No se encontraron organizaciones</p>
                <p v-if="filters.search" class="mt-1 text-xs">Probá cambiando el término de búsqueda.</p>
                <p v-else class="mt-1 text-xs">Creá una nueva organización para empezar.</p>
            </div>
        </div>

        <div v-if="meta.last_page > 1" class="mt-6 flex items-center justify-center gap-2">
            <a
                v-for="page in pageLinks()"
                :key="page"
                :href="'/admin/organizaciones?page=' + page + (filters.search ? '&search=' + filters.search : '')"
                class="rounded-lg px-3 py-1.5 text-sm transition"
                :class="
                    page === meta.current_page
                        ? 'bg-[#2D6A4F] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
                "
            >{{ page }}</a>
        </div>
    </div>
</template>
