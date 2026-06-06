<script setup lang="ts">
interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    cover_image: string | null;
    category: string;
    tags: string[] | null;
    published_at: string | null;
    created_at: string;
    team: { id: number; name: string; slug: string };
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
    filters: { category?: string };
}>();

const categories = [
    { slug: '', label: 'Todas', icon: '📚' },
    { slug: 'adopcion', label: 'Adopción', icon: '🐾' },
    { slug: 'salud', label: 'Salud animal', icon: '💚' },
    { slug: 'normativas', label: 'Normativas', icon: '📋' },
    { slug: 'historias', label: 'Historias', icon: '❤️' },
];

const categoryBadges: Record<string, string> = {
    adopcion: 'bg-rose-100 text-rose-800 ring-rose-300',
    salud: 'bg-emerald-100 text-emerald-800 ring-emerald-300',
    normativas: 'bg-sky-100 text-sky-800 ring-sky-300',
    historias: 'bg-amber-100 text-amber-800 ring-amber-300',
};

function formatDate(date: string | null): string {
    if (!date) {
return '';
}

    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'long' }).format(new Date(date));
}

function readingTime(text: string | null): string {
    if (!text) {
return '1 min';
}

    const words = text.split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));

    return `${minutes} min de lectura`;
}

function avatarLetter(name: string): string {
    return name.charAt(0).toUpperCase();
}

const avatarBg = ['bg-[#2D6A4F]', 'bg-amber-600', 'bg-sky-600', 'bg-rose-600', 'bg-violet-600'];

function authorBg(index: number): string {
    return avatarBg[index % avatarBg.length];
}
</script>

<template>
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="text-center">
            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2D6A4F]/10 dark:bg-[#2D6A4F]/20">
                <span class="text-3xl">📖</span>
            </div>
            <h1 class="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Blog de bienestar animal
            </h1>
            <p class="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
                Consejos, historias y novedades sobre adopción y cuidado de mascotas en Cusco.
            </p>
            <p class="mt-2 text-sm text-muted-foreground/60">
                {{ meta.total > 0 ? `${meta.total} artículo${meta.total !== 1 ? 's' : ''} publicados` : 'Explora nuestros artículos' }}
            </p>
        </div>

        <div class="mt-10">
            <div class="flex flex-wrap items-center justify-center gap-2">
                <a
                    v-for="cat in categories"
                    :key="cat.slug || 'all'"
                    :href="cat.slug ? '/blog?category=' + cat.slug : '/blog'"
                    class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all"
                    :class="
                        (cat.slug === '' && !filters.category) || filters.category === cat.slug
                            ? 'bg-[#2D6A4F] text-white shadow-md shadow-[#2D6A4F]/30'
                            : 'bg-[#2D6A4F]/10 text-[#2D6A4F] hover:bg-[#2D6A4F]/20 dark:bg-[#2D6A4F]/20 dark:text-emerald-400 dark:hover:bg-[#2D6A4F]/30'
                    "
                >
                    <span>{{ cat.icon }}</span>
                    {{ cat.label }}
                </a>
            </div>
        </div>

        <div v-if="posts.length === 0" class="mt-24 text-center">
            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted dark:bg-muted/50">
                <svg class="h-8 w-8 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
            </div>
            <p class="mt-4 text-lg font-medium text-foreground">No hay artículos en esta categoría</p>
            <p class="mt-1 text-sm text-muted-foreground/70">Explora otras categorías o vuelve más tarde.</p>
            <a
                href="/blog"
                class="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#2D6A4F] px-4 py-2 text-sm font-medium text-white shadow-sm shadow-[#2D6A4F]/30 transition hover:bg-[#1B4332]"
            >
                Ver todos los artículos
            </a>
        </div>

        <div v-else class="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <a
                v-for="(post, index) in posts"
                :key="post.id"
                :href="'/blog/' + post.slug"
                class="group flex flex-col overflow-hidden rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-[#2D6A4F]/4 to-white dark:from-[#2D6A4F]/15 dark:to-black/40 dark:border-[#2D6A4F]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#2D6A4F]/10"
            >
                <div class="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-[#2D6A4F]/10 to-[#2D6A4F]/5">
                    <img
                        v-if="post.cover_image"
                        :src="post.cover_image"
                        :alt="post.title"
                        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div v-else class="flex h-full w-full items-center justify-center">
                        <span class="text-5xl text-[#2D6A4F]/20">
                            {{ post.category === 'adopcion' ? '🐾' : post.category === 'salud' ? '💚' : post.category === 'normativas' ? '📋' : post.category === 'historias' ? '❤️' : '📖' }}
                        </span>
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    <div class="absolute bottom-3 left-3">
                        <span
                            class="inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-[#2D6A4F] shadow-sm backdrop-blur-sm"
                        >
                            <svg class="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {{ readingTime(post.excerpt || post.title) }}
                        </span>
                    </div>
                </div>

                <div class="flex flex-1 flex-col p-5">
                    <span
                        class="inline-flex w-fit items-center rounded-full px-3 py-0.5 text-xs font-semibold ring-1"
                        :class="categoryBadges[post.category] ?? 'bg-slate-100 text-slate-800 ring-slate-300'"
                    >
                        {{ post.category }}
                    </span>

                    <h3 class="mt-3 text-lg font-semibold leading-snug text-foreground group-hover:text-[#2D6A4F] transition-colors">
                        {{ post.title }}
                    </h3>

                    <p v-if="post.excerpt" class="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                        {{ post.excerpt }}
                    </p>

                    <div class="mt-4 flex items-center gap-3 border-t border-[#2D6A4F]/10 pt-4">
                        <div
                            :class="['flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shrink-0', authorBg(index)]"
                        >
                            {{ avatarLetter(post.author.name) }}
                        </div>
                        <div class="min-w-0 flex-1">
                            <p class="truncate text-sm font-semibold text-foreground">{{ post.author.name }}</p>
                            <p class="text-xs text-muted-foreground/60">{{ formatDate(post.published_at) }}</p>
                        </div>
                        <svg class="h-4 w-4 shrink-0 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </a>
        </div>

        <div v-if="meta.last_page > 1" class="mt-14 flex items-center justify-center gap-2">
            <a
                v-for="page in meta.last_page"
                :key="page"
                :href="'/blog?page=' + page + (filters.category ? '&category=' + filters.category : '')"
                class="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-all"
                :class="
                    page === meta.current_page
                        ? 'bg-[#2D6A4F] text-white shadow-md shadow-[#2D6A4F]/30'
                        : 'bg-[#2D6A4F]/10 text-[#2D6A4F] hover:bg-[#2D6A4F]/20 dark:bg-[#2D6A4F]/20 dark:text-emerald-400 dark:hover:bg-[#2D6A4F]/30'
                "
            >{{ page }}</a>
        </div>
    </div>
</template>
