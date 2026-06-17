<script setup lang="ts">
import { Search, FileText, ChevronRight, X } from 'lucide-vue-next';
import { ref } from 'vue';

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

const props = defineProps<{
    posts: BlogPost[];
    meta: Meta;
    filters: { category?: string };
}>();

const mobileFiltersOpen = ref(false);
const searchQuery = ref('');

const categories = [
    { slug: '', label: 'Todas', icon: '📚' },
    { slug: 'adopcion', label: 'Adopción', icon: '🐾' },
    { slug: 'salud', label: 'Salud animal', icon: '💚' },
    { slug: 'normativas', label: 'Normativas', icon: '📋' },
    { slug: 'historias', label: 'Historias', icon: '❤️' },
];

const categoryBadges: Record<string, string> = {
    adopcion: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    salud: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    normativas: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
    historias: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

function formatDate(date: string | null): string {
    if (!date) return '';
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'long' }).format(new Date(date));
}

function readingTime(text: string | null): string {
    if (!text) return '1 min';
    const words = text.split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / 200))} min`;
}

function avatarLetter(name: string): string {
    return name.charAt(0).toUpperCase();
}

const avatarBg = ['bg-[#2D6A4F]', 'bg-amber-600', 'bg-sky-600', 'bg-rose-600', 'bg-violet-600'];
function authorBg(index: number): string {
    return avatarBg[index % avatarBg.length];
}

function goSearch() {
    const q = searchQuery.value.trim();
    window.location.href = '/blog' + (q ? '?search=' + encodeURIComponent(q) : '');
}

function onSearchKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') goSearch();
}
</script>

<template>
    <div class="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <!-- Hero -->
        <section class="relative overflow-hidden bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#40916C] px-4 pb-16 pt-24 sm:px-6 lg:px-8">
            <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            <div class="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
            <div class="absolute bottom-0 left-0 -mb-20 -ml-20 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
            <div class="relative mx-auto max-w-7xl">
                <div class="mx-auto max-w-2xl text-center">
                    <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 shadow-lg backdrop-blur-sm">
                        <FileText class="h-8 w-8 text-white" />
                    </div>
                    <h1 class="text-4xl font-bold tracking-tight text-white sm:text-5xl">Blog de bienestar animal</h1>
                    <p class="mt-4 text-lg text-green-100/80">
                        {{ meta.total > 0 ? `${meta.total} artículo${meta.total !== 1 ? 's' : ''}` : 'Explora nuestros artículos' }} sobre adopción y cuidado de mascotas en Cusco
                    </p>
                    <div class="mx-auto mt-8 flex max-w-lg items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-1 backdrop-blur-md focus-within:border-white/30 focus-within:bg-white/15">
                        <Search class="h-5 w-5 shrink-0 text-green-100/60" />
                        <input v-model="searchQuery" @keydown="onSearchKeydown" type="text"
                            placeholder="Buscar artículos..."
                            class="h-12 w-full border-0 bg-transparent text-white placeholder-green-100/50 outline-none" />
                        <button @click="goSearch"
                            class="shrink-0 rounded-xl bg-white/20 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/30">
                            Buscar
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <!-- Category pills -->
            <div class="-mt-8 mb-8 rounded-2xl border border-border/50 bg-card/80 p-3 shadow-lg backdrop-blur-xl">
                <div class="flex flex-wrap items-center justify-center gap-2">
                    <a v-for="cat in categories" :key="cat.slug || 'all'"
                        :href="cat.slug ? '/blog?category=' + cat.slug : '/blog'"
                        class="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200"
                        :class="(cat.slug === '' && !filters.category) || filters.category === cat.slug
                            ? 'bg-[#2D6A4F] text-white shadow-md shadow-[#2D6A4F]/20'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'">
                        <span>{{ cat.icon }}</span>
                        {{ cat.label }}
                    </a>
                </div>
            </div>

            <!-- Empty state -->
            <div v-if="posts.length === 0" class="flex flex-col items-center justify-center py-24">
                <div class="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                    <FileText class="h-10 w-10 text-muted-foreground/50" />
                </div>
                <h3 class="mt-6 text-lg font-semibold text-foreground">No hay artículos</h3>
                <p class="mt-2 text-sm text-muted-foreground">No encontramos artículos en esta categoría.</p>
                <a href="/blog"
                    class="mt-6 rounded-xl bg-[#2D6A4F] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#246142]">
                    Ver todos los artículos
                </a>
            </div>

            <!-- Posts grid -->
            <div v-else class="grid gap-6 pb-16 sm:grid-cols-2 lg:grid-cols-3">
                <a v-for="(post, index) in posts" :key="post.id"
                    :href="'/blog/' + post.slug"
                    class="group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5">
                    <!-- Cover -->
                    <div class="relative aspect-[16/9] overflow-hidden bg-muted/50">
                        <img v-if="post.cover_image"
                            :src="post.cover_image" :alt="post.title"
                            class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                        <div v-else class="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                            <span class="text-5xl opacity-20">{{ post.category === 'adopcion' ? '🐾' : post.category === 'salud' ? '💚' : post.category === 'normativas' ? '📋' : post.category === 'historias' ? '❤️' : '📖' }}</span>
                        </div>
                        <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        <div class="absolute bottom-3 left-3">
                            <span class="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold text-[#2D6A4F] shadow-sm backdrop-blur-sm">
                                <FileText class="h-3 w-3" />
                                {{ readingTime(post.excerpt || post.title) }}
                            </span>
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="flex flex-1 flex-col p-5">
                        <span :class="['inline-flex w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold', categoryBadges[post.category] ?? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400']">
                            {{ post.category }}
                        </span>

                        <h3 class="mt-2 text-lg font-semibold leading-snug text-foreground group-hover:text-[#2D6A4F] transition-colors">
                            {{ post.title }}
                        </h3>

                        <p v-if="post.excerpt" class="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                            {{ post.excerpt }}
                        </p>

                        <div class="mt-4 flex items-center gap-3 border-t border-border/50 pt-3">
                            <div :class="['flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white', authorBg(index)]">
                                {{ avatarLetter(post.author.name) }}
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="truncate text-sm font-semibold text-foreground">{{ post.author.name }}</p>
                                <p class="text-xs text-muted-foreground/60">{{ formatDate(post.published_at) }}</p>
                            </div>
                            <ChevronRight class="h-4 w-4 shrink-0 text-muted-foreground/30 transition group-hover:translate-x-0.5 group-hover:text-[#2D6A4F]" />
                        </div>
                    </div>
                </a>
            </div>

            <!-- Pagination -->
            <div v-if="meta.last_page > 1" class="flex items-center justify-center gap-2 pb-16">
                <a v-for="page in meta.last_page" :key="page"
                    :href="'/blog?page=' + page + (filters.category ? '&category=' + filters.category : '')"
                    class="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-all"
                    :class="page === meta.current_page
                        ? 'bg-[#2D6A4F] text-white shadow-md shadow-[#2D6A4F]/30'
                        : 'bg-[#2D6A4F]/10 text-[#2D6A4F] hover:bg-[#2D6A4F]/20 dark:bg-[#2D6A4F]/20 dark:text-emerald-400 dark:hover:bg-[#2D6A4F]/30'">
                    {{ page }}
                </a>
            </div>
        </div>
    </div>
</template>
