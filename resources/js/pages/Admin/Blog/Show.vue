<script setup lang="ts">
import { computed } from 'vue';
import { marked } from 'marked';

interface BlogShow {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    cover_image: string | null;
    category: string | null;
    tags: string[] | null;
    is_published: boolean;
    published_at: string | null;
    created_at: string;
    team: { name: string; slug: string };
    author: { name: string };
}

const props = defineProps<{ post: BlogShow }>();

const renderedContent = computed(() => {
    try {
        return marked.parse(props.post.content);
    } catch {
        return props.post.content;
    }
});

const categoryEmoji: Record<string, string> = {
    salud: '🏥', adopcion: '🐾', cuidados: '🛁', historias: '📖', eventos: '📅', consejos: '💡',
};

function formatDate(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d));
}
</script>

<template>
    <div class="mx-auto max-w-5xl">
        <a href="/admin/blog" class="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-[#2D6A4F]">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Volver al blog
        </a>

        <div v-if="post.cover_image" class="mt-6 overflow-hidden rounded-2xl border border-[#2D6A4F]/15">
            <img :src="post.cover_image" :alt="post.title" class="w-full object-cover" style="max-height: 300px;" />
        </div>

        <div class="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div class="flex min-w-0 flex-1 items-start gap-4">
                <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 text-2xl dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                    {{ categoryEmoji[post.category ?? ''] ?? '📝' }}
                </div>
                <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-2">
                        <span v-if="post.category" class="rounded-full bg-[#2D6A4F]/10 px-2.5 py-0.5 text-xs font-medium text-[#2D6A4F] dark:bg-[#2D6A4F]/30 dark:text-emerald-400">{{ post.category }}</span>
                        <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-medium" :class="post.is_published ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'">
                            <span class="h-1.5 w-1.5 rounded-full" :class="post.is_published ? 'bg-emerald-500' : 'bg-gray-400'" />
                            {{ post.is_published ? 'Publicado' : 'Borrador' }}
                        </span>
                    </div>
                    <h1 class="mt-2 text-2xl font-bold text-foreground">{{ post.title }}</h1>
                    <p class="mt-0.5 text-sm text-muted-foreground">{{ post.team.name }} · por {{ post.author.name }}</p>
                </div>
            </div>
            <a :href="'/admin/blog/' + post.id + '/editar'" class="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#2D6A4F] px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-[#2D6A4F]/20 transition hover:bg-[#245a40]">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
            </a>
        </div>

        <div v-if="post.excerpt" class="mt-6 rounded-2xl border border-[#2D6A4F]/15 bg-[#2D6A4F]/4 p-4 dark:border-[#2D6A4F]/30 dark:bg-[#2D6A4F]/10">
            <p class="text-sm italic text-foreground/70">{{ post.excerpt }}</p>
        </div>

        <div v-if="post.tags && post.tags.length" class="mt-4 flex flex-wrap gap-2">
            <span v-for="tag in post.tags" :key="tag" class="rounded-full border border-[#2D6A4F]/15 px-3 py-0.5 text-xs text-muted-foreground dark:border-[#2D6A4F]/30">{{ tag }}</span>
        </div>

        <div class="mt-8 grid gap-6 lg:grid-cols-3">
            <div class="lg:col-span-2">
                <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                    <div class="flex items-center gap-2 mb-4">
                        <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h2 class="text-base font-semibold text-foreground">Contenido</h2>
                    </div>
                    <div class="prose prose-sm max-w-none text-foreground/80 leading-relaxed" v-html="renderedContent"></div>
                </div>
            </div>

            <div class="space-y-4">
                <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                    <div class="flex items-center gap-2">
                        <svg class="h-4 w-4 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 class="text-xs font-semibold tracking-wider text-foreground/70 uppercase">Detalles</h3>
                    </div>
                    <dl class="mt-4 divide-y divide-[#2D6A4F]/10 space-y-3 dark:divide-[#2D6A4F]/20">
                        <div v-if="post.category" class="flex items-center justify-between pt-3 first:pt-0">
                            <dt class="text-xs text-muted-foreground/70">Categoría</dt>
                            <dd class="text-sm font-medium text-foreground">{{ post.category }}</dd>
                        </div>
                        <div class="flex items-center justify-between pt-3">
                            <dt class="text-xs text-muted-foreground/70">Autor</dt>
                            <dd class="text-sm font-medium text-foreground">{{ post.author.name }}</dd>
                        </div>
                        <div class="flex items-center justify-between pt-3">
                            <dt class="text-xs text-muted-foreground/70">Organización</dt>
                            <dd class="text-sm font-medium text-[#2D6A4F]">{{ post.team.name }}</dd>
                        </div>
                        <div v-if="post.published_at" class="flex items-center justify-between pt-3">
                            <dt class="text-xs text-muted-foreground/70">Publicado</dt>
                            <dd class="text-sm font-medium text-foreground">{{ formatDate(post.published_at) }}</dd>
                        </div>
                        <div class="flex items-center justify-between pt-3">
                            <dt class="text-xs text-muted-foreground/70">Creado</dt>
                            <dd class="text-sm font-medium text-foreground">{{ formatDate(post.created_at) }}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    </div>
</template>
