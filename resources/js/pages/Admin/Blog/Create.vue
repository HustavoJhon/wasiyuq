<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
import { marked } from 'marked';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Team {
    id: number;
    name: string;
    slug: string;
}

defineProps<{ teams: Team[] }>();

const form = useForm({
    team_id: '',
    title: '',
    excerpt: '',
    content: '',
    cover_image: '',
    category: '',
    tags: '',
    is_published: false,
});

const categoryOptions = [
    { value: 'salud', label: 'Salud', emoji: '🏥' },
    { value: 'adopcion', label: 'Adopción', emoji: '🐾' },
    { value: 'cuidados', label: 'Cuidados', emoji: '🛁' },
    { value: 'historias', label: 'Historias', emoji: '📖' },
    { value: 'eventos', label: 'Eventos', emoji: '📅' },
    { value: 'consejos', label: 'Consejos', emoji: '💡' },
    { value: 'otro', label: 'Otro', emoji: '📝' },
];

const mdTab = ref<'write' | 'preview'>('write');

const renderedContent = computed(() => {
    try {
        return marked.parse(form.content);
    } catch {
        return form.content;
    }
});

function submit() {
    form.transform((data) => ({
        ...data,
        tags: typeof data.tags === 'string'
            ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
            : data.tags,
    })).post('/admin/blog');
}
</script>

<template>
    <div class="mx-auto max-w-4xl">
        <a href="/admin/blog" class="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-[#2D6A4F]">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Volver al blog
        </a>

        <div class="mb-8 mt-5">
            <div class="flex items-center gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2D6A4F]/10">
                    <svg class="h-6 w-6 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-foreground">Nuevo Artículo</h1>
                    <p class="mt-0.5 text-sm text-muted-foreground">Creá un nuevo artículo para el blog.</p>
                </div>
            </div>
        </div>

        <form @submit.prevent="submit" class="space-y-6">
            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="mb-5 flex items-center gap-2">
                    <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h2 class="text-base font-semibold text-foreground">Organización</h2>
                </div>
                <div class="grid gap-2">
                    <Label for="team_id">¿A qué organización pertenece?</Label>
                    <Select v-model="form.team_id" name="team_id">
                        <SelectTrigger class="w-full">
                            <SelectValue placeholder="Seleccionar organización" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="team in teams" :key="team.id" :value="String(team.id)">
                                {{ team.name }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError :message="form.errors.team_id" />
                </div>
            </div>

            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="mb-5 flex items-center gap-2">
                    <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h2 class="text-base font-semibold text-foreground">Información del artículo</h2>
                </div>

                <div class="grid gap-5">
                    <div class="grid gap-2">
                        <Label for="title">Título del artículo</Label>
                        <div class="relative">
                            <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                            </svg>
                            <Input id="title" v-model="form.title" type="text" placeholder="Ej: Cómo cuidar a tu mascota en verano" class="pl-9" :disabled="form.processing" />
                        </div>
                        <InputError :message="form.errors.title" />
                    </div>

                    <div class="grid gap-5 sm:grid-cols-2">
                        <div class="grid gap-2">
                            <Label for="category">Categoría</Label>
                            <Select v-model="form.category" name="category">
                                <SelectTrigger class="w-full">
                                    <SelectValue placeholder="Seleccionar categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="opt in categoryOptions" :key="opt.value" :value="opt.value">
                                        <span class="flex items-center gap-2">{{ opt.emoji }} {{ opt.label }}</span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError :message="form.errors.category" />
                        </div>
                        <div class="grid gap-2">
                            <Label for="tags">Tags</Label>
                            <div class="relative">
                                <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                <Input id="tags" v-model="form.tags" type="text" placeholder="perros, gatos, cuidados" class="pl-9" :disabled="form.processing" />
                            </div>
                            <p class="text-xs text-muted-foreground">Separados por coma.</p>
                            <InputError :message="form.errors.tags" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="mb-5 flex items-center gap-2">
                    <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h2 class="text-base font-semibold text-foreground">Imagen de portada</h2>
                </div>
                <div class="grid gap-2">
                    <Label for="cover_image">URL de la imagen</Label>
                    <div class="relative">
                        <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <Input id="cover_image" v-model="form.cover_image" type="url" placeholder="https://ejemplo.com/imagen.jpg" class="pl-9" :disabled="form.processing" />
                    </div>
                    <InputError :message="form.errors.cover_image" />
                </div>
            </div>

            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="mb-5 flex items-center gap-2">
                    <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h2 class="text-base font-semibold text-foreground">Contenido</h2>
                </div>

                <div class="grid gap-5">
                    <div class="grid gap-2">
                        <Label for="excerpt">Extracto</Label>
                        <div class="relative">
                            <svg class="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            <textarea
                                id="excerpt" v-model="form.excerpt" rows="2"
                                class="block w-full rounded-xl border border-[#2D6A4F]/15 bg-white/60 py-2.5 pl-10 pr-4 text-sm text-foreground transition outline-none placeholder:text-muted-foreground/40 focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 dark:border-[#2D6A4F]/30 dark:bg-black/20"
                                placeholder="Breve resumen del artículo" :disabled="form.processing"
                            ></textarea>
                        </div>
                        <InputError :message="form.errors.excerpt" />
                    </div>

                    <div class="grid gap-2">
                        <Label for="content">Contenido del artículo</Label>
                        <div class="mb-2 flex gap-2">
                            <button type="button"
                                class="rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
                                :class="mdTab === 'write' ? 'bg-[#2D6A4F] text-white shadow-sm' : 'bg-muted text-muted-foreground hover:text-foreground'"
                                @click="mdTab = 'write'"
                            >
                                <span class="flex items-center gap-1.5">
                                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Escribir
                                </span>
                            </button>
                            <button type="button"
                                class="rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
                                :class="mdTab === 'preview' ? 'bg-[#2D6A4F] text-white shadow-sm' : 'bg-muted text-muted-foreground hover:text-foreground'"
                                @click="mdTab = 'preview'"
                            >
                                <span class="flex items-center gap-1.5">
                                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Vista previa
                                </span>
                            </button>
                            <span class="ml-auto self-center text-xs text-muted-foreground/50">Markdown</span>
                        </div>
                        <div v-if="mdTab === 'write'" class="relative">
                            <svg class="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            <textarea
                                id="content" v-model="form.content" rows="12"
                                class="block w-full rounded-xl border border-[#2D6A4F]/15 bg-white/60 py-2.5 pl-10 pr-4 text-sm text-foreground transition outline-none placeholder:text-muted-foreground/40 focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 dark:border-[#2D6A4F]/30 dark:bg-black/20"
                                placeholder="Escribí el contenido del artículo aquí... (soporta **Markdown**)"
                                :disabled="form.processing"
                            ></textarea>
                        </div>
                        <div v-else class="min-h-[200px] rounded-xl border border-[#2D6A4F]/15 bg-white/60 p-4 text-sm leading-relaxed dark:border-[#2D6A4F]/30 dark:bg-black/20">
                            <div v-if="form.content" class="prose prose-sm max-w-none dark:prose-invert" v-html="renderedContent"></div>
                            <p v-else class="text-muted-foreground/40 italic">Sin contenido para previsualizar.</p>
                        </div>
                        <InputError :message="form.errors.content" />
                    </div>
                </div>

                <div class="mt-5 flex items-start gap-3 rounded-xl border border-[#2D6A4F]/10 bg-[#2D6A4F]/4 p-4 dark:border-[#2D6A4F]/20 dark:bg-[#2D6A4F]/10">
                    <input
                        id="is_published" type="checkbox" v-model="form.is_published"
                        class="mt-0.5 h-4 w-4 shrink-0 rounded border-[#2D6A4F]/30 text-[#2D6A4F] focus:ring-[#2D6A4F]"
                        :disabled="form.processing"
                    />
                    <div>
                        <Label for="is_published" class="font-medium text-foreground">Publicar inmediatamente</Label>
                        <p class="mt-0.5 text-xs text-muted-foreground/70">El artículo será visible para el público en la web.</p>
                    </div>
                </div>
                <InputError :message="form.errors.is_published" />
            </div>

            <div class="flex items-center gap-4 rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <Button type="submit" :disabled="form.processing" class="min-w-[140px]">
                    <svg v-if="form.processing" class="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <svg v-else class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {{ form.processing ? 'Guardando...' : 'Crear artículo' }}
                </Button>
                <a href="/admin/blog" class="text-sm font-medium text-muted-foreground transition hover:text-foreground">Cancelar</a>
            </div>
        </form>
    </div>
</template>
