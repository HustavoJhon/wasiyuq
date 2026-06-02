<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import type { Team } from '@/types';

defineProps<{
    currentTeam?: Team | null;
}>();

const form = useForm({
    title: '',
    excerpt: '',
    content: '',
    cover_image: '',
    category: '',
    tags: '',
    is_published: false,
});

function submit(): void {
    form.transform((data) => ({
        ...data,
        tags:
            typeof data.tags === 'string'
                ? data.tags
                      .split(',')
                      .map((t) => t.trim())
                      .filter(Boolean)
                : data.tags,
    })).post('/' + currentTeamSlug() + '/blog');
}

function currentTeamSlug(): string {
    const m = window.location.pathname.match(/^\/([^/]+)/);

    return m ? m[1] : '';
}
</script>

<template>
    <div>
        <a
            :href="`/${currentTeam?.slug}/blog`"
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

        <div class="mt-4">
            <h1 class="text-2xl font-bold text-foreground">Nuevo Artículo</h1>
            <p class="mt-1 text-sm text-muted-foreground">
                Publica un artículo para {{ currentTeam?.name }}.
            </p>
        </div>

        <form @submit.prevent="submit" class="mt-6 max-w-lg space-y-5">
            <div class="space-y-1.5">
                <label class="text-sm font-medium text-foreground"
                    >Título *</label
                >
                <input
                    v-model="form.title"
                    class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                    :disabled="form.processing"
                />
                <p v-if="form.errors.title" class="text-xs text-red-500">
                    {{ form.errors.title }}
                </p>
            </div>

            <div class="space-y-1.5">
                <label class="text-sm font-medium text-foreground"
                    >Extracto</label
                >
                <textarea
                    v-model="form.excerpt"
                    rows="2"
                    class="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                    :disabled="form.processing"
                    placeholder="Breve resumen del artículo"
                />
                <p v-if="form.errors.excerpt" class="text-xs text-red-500">
                    {{ form.errors.excerpt }}
                </p>
            </div>

            <div class="space-y-1.5">
                <label class="text-sm font-medium text-foreground"
                    >Contenido *</label
                >
                <textarea
                    v-model="form.content"
                    rows="12"
                    class="flex min-h-[250px] w-full rounded-md border border-input bg-transparent px-3 py-2 font-mono text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                    :disabled="form.processing"
                    placeholder="Soporta formato markdown: **negrita**, ## títulos, - listas, etc."
                />
                <p v-if="form.errors.content" class="text-xs text-red-500">
                    {{ form.errors.content }}
                </p>
                <p class="text-xs text-muted-foreground/70">
                    Usa formato markdown para dar estilo al contenido.
                </p>
            </div>

            <div class="space-y-1.5">
                <label class="text-sm font-medium text-foreground"
                    >URL de imagen de portada</label
                >
                <input
                    v-model="form.cover_image"
                    class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                    placeholder="https://..."
                    :disabled="form.processing"
                />
                <p v-if="form.errors.cover_image" class="text-xs text-red-500">
                    {{ form.errors.cover_image }}
                </p>
            </div>

            <div class="space-y-1.5">
                <label class="text-sm font-medium text-foreground"
                    >Categoría</label
                >
                <input
                    v-model="form.category"
                    class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                    placeholder="Ej: Salud, Adopción, Consejos"
                    :disabled="form.processing"
                />
                <p v-if="form.errors.category" class="text-xs text-red-500">
                    {{ form.errors.category }}
                </p>
            </div>

            <div class="space-y-1.5">
                <label class="text-sm font-medium text-foreground">Tags</label>
                <input
                    v-model="form.tags"
                    class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                    placeholder="separados por coma: perros, gatos, cuidados"
                    :disabled="form.processing"
                />
                <p class="text-xs text-muted-foreground/70">
                    Separa múltiples tags con coma.
                </p>
                <p v-if="form.errors.tags" class="text-xs text-red-500">
                    {{ form.errors.tags }}
                </p>
            </div>

            <div class="flex items-center gap-2">
                <input
                    id="is_published"
                    type="checkbox"
                    v-model="form.is_published"
                    class="h-4 w-4 rounded border-gray-300 text-[#2D6A4F] focus:ring-[#2D6A4F]"
                    :disabled="form.processing"
                />
                <label for="is_published" class="text-sm text-foreground"
                    >Publicar inmediatamente</label
                >
            </div>
            <p v-if="form.errors.is_published" class="text-xs text-red-500">
                {{ form.errors.is_published }}
            </p>

            <div class="flex items-center gap-3 pt-2">
                <button
                    type="submit"
                    :disabled="form.processing"
                    class="rounded-lg bg-[#2D6A4F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1B4332] disabled:opacity-50"
                >
                    {{ form.processing ? 'Guardando...' : 'Guardar' }}
                </button>
                <a
                    :href="`/${currentTeam?.slug}/blog`"
                    class="text-sm text-muted-foreground hover:text-foreground"
                    >Cancelar</a
                >
            </div>
        </form>
    </div>
</template>
