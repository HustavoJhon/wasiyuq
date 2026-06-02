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

function formatDate(date: string | null): string {
    if (!date) {
        return '';
    }

    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'long' }).format(
        new Date(date),
    );
}
</script>

<template>
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="text-center">
            <h1
                class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
                Blog de bienestar animal
            </h1>
            <p class="mt-3 text-muted-foreground">
                Consejos, historias y novedades sobre adopción y cuidado de
                mascotas en Cusco.
            </p>
        </div>

        <div class="mt-8 flex flex-wrap items-center gap-3">
            <span class="text-sm font-medium text-foreground">Categorías:</span>
            <a
                :href="'/blog'"
                class="rounded-full px-4 py-1.5 text-xs font-medium"
                :class="
                    !filters.category
                        ? 'bg-[#2D6A4F] text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                "
                >Todas</a
            >
            <a
                :href="'/blog?category=adopcion'"
                class="rounded-full px-4 py-1.5 text-xs font-medium"
                :class="
                    filters.category === 'adopcion'
                        ? 'bg-[#2D6A4F] text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                "
                >Adopción</a
            >
            <a
                :href="'/blog?category=salud'"
                class="rounded-full px-4 py-1.5 text-xs font-medium"
                :class="
                    filters.category === 'salud'
                        ? 'bg-[#2D6A4F] text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                "
                >Salud animal</a
            >
            <a
                :href="'/blog?category=normativas'"
                class="rounded-full px-4 py-1.5 text-xs font-medium"
                :class="
                    filters.category === 'normativas'
                        ? 'bg-[#2D6A4F] text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                "
                >Normativas</a
            >
            <a
                :href="'/blog?category=historias'"
                class="rounded-full px-4 py-1.5 text-xs font-medium"
                :class="
                    filters.category === 'historias'
                        ? 'bg-[#2D6A4F] text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                "
                >Historias</a
            >
        </div>

        <div v-if="posts.length === 0" class="mt-16 text-center">
            <p class="text-muted-foreground/70">
                No hay artículos publicados aún.
            </p>
        </div>

        <div v-else class="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <a
                v-for="post in posts"
                :key="post.id"
                :href="'/blog/' + post.slug"
                class="group overflow-hidden rounded-2xl border border-border bg-card transition hover:shadow-lg hover:shadow-black/5"
            >
                <div
                    class="aspect-[16/9] bg-gradient-to-br from-muted to-muted/80"
                />
                <div class="p-5">
                    <span
                        class="rounded-full bg-[#2D6A4F]/10 px-3 py-0.5 text-xs font-medium text-[#2D6A4F]"
                        >{{ post.category }}</span
                    >
                    <h3
                        class="mt-3 text-lg font-semibold text-foreground group-hover:text-[#2D6A4F]"
                    >
                        {{ post.title }}
                    </h3>
                    <p
                        class="mt-2 text-sm leading-relaxed text-muted-foreground"
                    >
                        {{ post.excerpt }}
                    </p>
                    <div
                        class="mt-4 flex items-center justify-between text-xs text-muted-foreground/70"
                    >
                        <span>{{ post.author.name }}</span>
                        <span>{{ formatDate(post.published_at) }}</span>
                    </div>
                </div>
            </a>
        </div>

        <div v-if="meta.last_page > 1" class="mt-12 flex justify-center gap-2">
            <a
                v-for="page in meta.last_page"
                :key="page"
                :href="'/blog?page=' + page"
                class="rounded-xl px-4 py-2 text-sm"
                :class="
                    page === meta.current_page
                        ? 'bg-[#2D6A4F] text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                "
                >{{ page }}</a
            >
        </div>
    </div>
</template>
