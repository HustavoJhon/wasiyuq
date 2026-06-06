<script setup lang="ts">
import { router } from '@inertiajs/vue3';

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

defineProps<{
    posts: BlogPost[];
    meta: Meta;
}>();

const categoryEmoji: Record<string, string> = {
    'salud': '🏥',
    'adopcion': '🐾',
    'cuidados': '🛁',
    'historias': '📖',
    'eventos': '📅',
    'consejos': '💡',
};

function formatDate(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(
        new Date(d),
    );
}

function destroy(id: number): void {
    if (confirm('¿Eliminar este artículo?')) {
        router.delete('/admin/blog/' + id);
    }
}
</script>

<template>
    <div>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl font-bold text-foreground">Blog</h1>
                <p class="mt-1 text-sm text-muted-foreground">
                    Todos los artículos del blog.
                </p>
            </div>
            <a
                href="/admin/blog/crear"
                class="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#2D6A4F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#246142]"
            >
                <svg class="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Nuevo Artículo
            </a>
        </div>

        <div class="mt-6 hidden overflow-x-auto rounded-xl border border-border bg-card md:block">
            <table class="w-full min-w-[650px] text-left text-sm">
                <thead class="border-b border-border/50 bg-muted text-xs font-medium text-muted-foreground uppercase">
                    <tr>
                        <th class="px-5 py-3">Título</th>
                        <th class="px-5 py-3">Categoría</th>
                        <th class="px-5 py-3">Autor</th>
                        <th class="px-5 py-3">Organización</th>
                        <th class="px-5 py-3">Publicado</th>
                        <th class="px-5 py-3">Fecha</th>
                        <th class="px-5 py-3">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-border/50">
                    <tr v-for="post in posts" :key="post.id" class="hover:bg-muted">
                        <td class="px-5 py-4 font-medium text-card-foreground max-w-[200px] truncate">{{ post.title }}</td>
                        <td class="px-5 py-4 text-muted-foreground">{{ post.category }}</td>
                        <td class="px-5 py-4 text-muted-foreground">{{ post.author.name }}</td>
                        <td class="px-5 py-4 text-muted-foreground">{{ post.team.name }}</td>
                        <td class="px-5 py-4">
                            <span class="inline-block rounded-full px-3 py-0.5 text-xs font-medium" :class="post.is_published ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'">{{ post.is_published ? 'Sí' : 'No' }}</span>
                        </td>
                        <td class="px-5 py-4 text-muted-foreground/70">{{ post.published_at ? formatDate(post.published_at) : formatDate(post.created_at) }}</td>
                        <td class="px-5 py-4">
                            <div class="flex items-center gap-2">
                                <a :href="'/admin/blog/' + post.id" class="text-xs text-[#2D6A4F] hover:underline dark:text-emerald-400">Ver</a>
                                <a :href="'/admin/blog/' + post.id + '/editar'" class="text-xs text-muted-foreground hover:text-[#2D6A4F] dark:hover:text-emerald-400">Editar</a>
                                <button @click="destroy(post.id)" class="text-xs text-red-500 hover:text-red-700">Eliminar</button>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="posts.length === 0">
                        <td colspan="7" class="px-5 py-8 text-center text-muted-foreground/70">
                            No hay artículos registrados.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="posts.length === 0" class="mt-6 md:hidden">
            <div class="rounded-xl border border-border bg-card px-5 py-8 text-center text-sm text-muted-foreground/70">
                No hay artículos registrados.
            </div>
        </div>

        <div v-else class="mt-6 space-y-2 md:hidden">
            <div v-for="post in posts" :key="post.id" class="rounded-xl border border-border bg-card px-3 py-3 transition hover:shadow-sm sm:px-4">
                <div class="flex items-start justify-between gap-2">
                    <div class="min-w-0 flex-1">
                        <p class="text-sm font-semibold text-card-foreground truncate">{{ post.title }}</p>
                        <p class="mt-0.5 truncate text-xs text-muted-foreground">
                            {{ categoryEmoji[post.category] || '📝' }} {{ post.category }}
                        </p>
                    </div>
                    <span class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold leading-tight" :class="post.is_published ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'">{{ post.is_published ? 'Pub' : 'Bor' }}</span>
                </div>
                <div class="mt-2 flex items-center justify-between border-t border-border/50 pt-2">
                    <p class="truncate text-[10px] text-muted-foreground/60">{{ post.team.name }} · {{ post.published_at ? formatDate(post.published_at) : formatDate(post.created_at) }}</p>
                    <div class="flex shrink-0 items-center gap-0.5">
                        <a :href="'/admin/blog/' + post.id" class="flex items-center justify-center rounded-lg p-1 text-[#2D6A4F] transition hover:bg-[#2D6A4F]/10 dark:text-emerald-400 dark:hover:bg-emerald-900/30" title="Ver">
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </a>
                        <a :href="'/admin/blog/' + post.id + '/editar'" class="flex items-center justify-center rounded-lg p-1 text-muted-foreground transition hover:bg-accent hover:text-[#2D6A4F] dark:hover:text-emerald-400" title="Editar">
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </a>
                        <button @click="destroy(post.id)" class="flex items-center justify-center rounded-lg p-1 text-red-500 transition hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20" title="Eliminar">
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="meta.last_page > 1" class="mt-6 flex justify-center gap-2">
            <a
                v-for="page in meta.last_page"
                :key="page"
                :href="'/admin/blog?page=' + page"
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
