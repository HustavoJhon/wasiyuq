<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { ref } from 'vue';

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    category: string;
    is_published: boolean;
    published_at: string | null;
    created_at: string;
    team: { id: number; name: string };
    author: { id: number; name: string };
}

interface Meta {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

const props = defineProps<{
    posts: BlogPost[];
    meta: Meta;
    filters?: { search?: string };
}>();

const search = ref(props.filters?.search ?? '');

const categoryEmoji: Record<string, string> = {
    salud: '🏥', adopcion: '🐾', cuidados: '🛁', historias: '📖', eventos: '📅', consejos: '💡',
};

const categoryColors: Record<string, string> = {
    salud: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    adopcion: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    cuidados: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
    historias: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    eventos: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    consejos: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

function formatDate(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d));
}

function destroy(id: number): void {
    if (confirm('¿Eliminar este artículo? Esta acción no se puede deshacer.')) {
        router.delete('/admin/blog/' + id);
    }
}

let debounceTimer: ReturnType<typeof setTimeout>;
function onSearchInput() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        router.get('/admin/blog', { search: search.value || undefined }, { preserveState: true, replace: true });
    }, 300);
}
</script>

<template>
    <div class="mx-auto max-w-6xl">
        <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div class="flex items-center gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2D6A4F]/10">
                    <svg class="h-6 w-6 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-foreground">Blog</h1>
                    <p class="mt-0.5 text-sm text-muted-foreground">Todos los artículos del blog.</p>
                </div>
            </div>
            <a href="/admin/blog/crear" class="inline-flex items-center gap-2 rounded-xl bg-[#2D6A4F] px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-[#2D6A4F]/20 transition hover:bg-[#245a40]">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Nuevo Artículo
            </a>
        </div>

        <div class="mb-6">
            <div class="relative max-w-md">
                <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    v-model="search" type="text" placeholder="Buscar artículos..."
                    class="h-10 w-full rounded-xl border border-[#2D6A4F]/15 bg-white/60 pl-9 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/40 focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 dark:border-[#2D6A4F]/30 dark:bg-black/20"
                    @input="onSearchInput"
                />
            </div>
        </div>

        <div v-if="posts.length === 0" class="mt-12 text-center">
            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2D6A4F]/10">
                <svg class="h-8 w-8 text-[#2D6A4F]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
            </div>
            <p class="mt-4 font-medium text-foreground">No hay artículos registrados</p>
            <p class="mt-1 text-sm text-muted-foreground/70">Creá el primer artículo para comenzar.</p>
        </div>

        <div v-else class="space-y-4">
            <div v-for="post in posts" :key="post.id" class="group rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 transition hover:border-[#2D6A4F]/30 hover:shadow-sm dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="flex items-start justify-between gap-4">
                    <div class="flex min-w-0 flex-1 items-start gap-4">
                        <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#2D6A4F]/15 bg-white text-lg dark:border-[#2D6A4F]/30 dark:bg-black/40">
                            {{ categoryEmoji[post.category] ?? '📝' }}
                        </div>
                        <div class="min-w-0 flex-1">
                            <div class="flex flex-wrap items-center gap-2">
                                <h3 class="text-base font-semibold text-foreground truncate">{{ post.title }}</h3>
                                <span v-if="post.category" class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" :class="categoryColors[post.category] ?? 'bg-muted text-muted-foreground'">{{ post.category }}</span>
                            </div>
                            <div class="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground/70">
                                <span class="inline-flex items-center gap-1">
                                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    {{ post.author.name }}
                                </span>
                                <span class="inline-flex items-center gap-1">
                                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    {{ post.team.name }}
                                </span>
                                <span class="inline-flex items-center gap-1">
                                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {{ post.published_at ? formatDate(post.published_at) : formatDate(post.created_at) }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="flex shrink-0 items-center gap-3">
                        <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-medium" :class="post.is_published ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'">
                            <span class="h-1.5 w-1.5 rounded-full" :class="post.is_published ? 'bg-emerald-500' : 'bg-gray-400'" />
                            {{ post.is_published ? 'Publicado' : 'Borrador' }}
                        </span>
                        <div class="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <a :href="'/admin/blog/' + post.id" class="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-[#2D6A4F]/10 hover:text-[#2D6A4F]">
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </a>
                            <a :href="'/admin/blog/' + post.id + '/editar'" class="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-[#2D6A4F]/10 hover:text-[#2D6A4F]">
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </a>
                            <button @click="destroy(post.id)" class="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30">
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="meta.last_page > 1" class="mt-8 flex items-center justify-center gap-2">
            <a
                v-for="page in meta.last_page"
                :key="page"
                :href="'/admin/blog?page=' + page + (search ? '&search=' + encodeURIComponent(search) : '')"
                class="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all"
                :class="page === meta.current_page ? 'bg-[#2D6A4F] text-white shadow-sm shadow-[#2D6A4F]/20' : 'border border-[#2D6A4F]/15 text-muted-foreground hover:border-[#2D6A4F]/30 hover:text-foreground dark:border-[#2D6A4F]/30'"
            >{{ page }}</a>
        </div>
    </div>
</template>
