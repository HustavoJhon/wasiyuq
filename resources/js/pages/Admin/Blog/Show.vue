<script setup lang="ts">
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

defineProps<{ post: BlogShow }>();

function formatDate(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(
        new Date(d),
    );
}
</script>

<template>
    <div>
        <a
            href="/admin/blog"
            class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-[#2D6A4F]"
        >
            <svg
                class="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                />
            </svg>
            Volver al blog
        </a>

        <div class="mt-4 flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-foreground">
                    {{ post.title }}
                </h1>
                <p class="mt-1 text-sm text-muted-foreground">
                    {{ post.team.name }}
                </p>
            </div>
            <div class="flex items-center gap-3">
                <span
                    class="rounded-full px-3 py-0.5 text-xs font-medium"
                    :class="
                        post.is_published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                    "
                    >{{ post.is_published ? 'Publicado' : 'Borrador' }}</span
                >
                <a
                    :href="`/admin/blog/${post.id}/editar`"
                    class="rounded-lg bg-[#2D6A4F] px-4 py-1.5 text-sm text-white hover:bg-[#1B4332]"
                    >Editar</a
                >
            </div>
        </div>

        <div class="mt-6 grid gap-6 lg:grid-cols-3">
            <div class="space-y-6 lg:col-span-2">
                <div
                    v-if="post.cover_image"
                    class="overflow-hidden rounded-xl border border-border"
                >
                    <img
                        :src="post.cover_image"
                        :alt="post.title"
                        class="w-full object-cover"
                    />
                </div>

                <div
                    v-if="post.excerpt"
                    class="text-sm font-medium text-muted-foreground italic"
                >
                    {{ post.excerpt }}
                </div>

                <div
                    v-if="post.tags && post.tags.length"
                    class="flex flex-wrap gap-2"
                >
                    <span
                        v-for="tag in post.tags"
                        :key="tag"
                        class="rounded-full bg-muted px-3 py-0.5 text-xs text-muted-foreground"
                        >{{ tag }}</span
                    >
                </div>

                <div class="prose prose-sm max-w-none text-muted-foreground">
                    {{ post.content }}
                </div>
            </div>

            <div class="space-y-4">
                <div class="rounded-xl border border-border bg-muted p-4">
                    <h3
                        class="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase"
                    >
                        Detalles
                    </h3>
                    <dl class="mt-3 space-y-3 text-sm">
                        <div v-if="post.category">
                            <dt class="text-muted-foreground/70">Categoría</dt>
                            <dd class="font-medium text-card-foreground">
                                {{ post.category }}
                            </dd>
                        </div>
                        <div>
                            <dt class="text-muted-foreground/70">Autor</dt>
                            <dd class="font-medium text-card-foreground">
                                {{ post.author.name }}
                            </dd>
                        </div>
                        <div>
                            <dt class="text-muted-foreground/70">
                                Organización
                            </dt>
                            <dd class="font-medium text-[#2D6A4F]">
                                {{ post.team.name }}
                            </dd>
                        </div>
                        <div v-if="post.published_at">
                            <dt class="text-muted-foreground/70">Publicado</dt>
                            <dd class="font-medium text-card-foreground">
                                {{ formatDate(post.published_at) }}
                            </dd>
                        </div>
                        <div>
                            <dt class="text-muted-foreground/70">Creado</dt>
                            <dd class="font-medium text-card-foreground">
                                {{ formatDate(post.created_at) }}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    </div>
</template>
