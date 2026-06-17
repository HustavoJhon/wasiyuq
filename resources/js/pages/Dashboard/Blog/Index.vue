<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import type { Team } from '@/types';
import { Search, Plus, Eye, Pencil, Trash2, FileText, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { ref, computed } from 'vue';

interface BlogPost { id: number; title: string; slug: string; category: string | null; is_published: boolean; published_at: string | null; created_at: string; author: { id: number; name: string }; }
interface Meta { current_page: number; last_page: number; total: number; per_page: number; }

const props = defineProps<{ posts: BlogPost[]; meta: Meta; currentTeam?: Team | null }>();

const search = ref('');
const filtered = computed(() => {
    if (!search.value) return props.posts;
    const q = search.value.toLowerCase();
    return props.posts.filter(p => p.title.toLowerCase().includes(q) || p.author.name.toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q));
});

const stats = computed(() => ({ total: props.posts.length, published: props.posts.filter(p => p.is_published).length, drafts: props.posts.filter(p => !p.is_published).length }));

function formatDate(d: string) { return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d)); }
function destroy(id: number) { if (confirm('¿Eliminar este artículo?')) router.delete(`/${slug}/blog/${id}`); }
const slug = computed(() => { const m = window.location.pathname.match(/^\/([^/]+)/); return m ? m[1] : ''; });
</script>

<template>
    <div class="mx-auto max-w-6xl">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><h1 class="text-2xl font-bold text-foreground">Blog</h1><p class="mt-1 text-sm text-muted-foreground">Artículos publicados por {{ currentTeam?.name }}.</p></div>
            <a :href="`/${currentTeam?.slug}/blog/crear`" class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2D6A4F] to-[#40916C] px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-[#2D6A4F]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all"><Plus class="h-4 w-4" />Nuevo Artículo</a>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div class="rounded-xl border border-border/50 bg-card p-4"><p class="text-xs font-medium text-muted-foreground/70 uppercase">Total</p><p class="mt-1 text-2xl font-bold text-foreground">{{ stats.total }}</p></div>
            <div class="rounded-xl border border-emerald-200/60 bg-emerald-50/30 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20"><p class="text-xs font-medium text-emerald-700/70 uppercase">Publicados</p><p class="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-400">{{ stats.published }}</p></div>
            <div class="rounded-xl border border-gray-200/60 bg-gray-50/30 p-4 dark:border-gray-800 dark:bg-gray-900/30"><p class="text-xs font-medium text-gray-600 uppercase">Borradores</p><p class="mt-1 text-2xl font-bold text-gray-700 dark:text-gray-400">{{ stats.drafts }}</p></div>
        </div>

        <div class="mt-6 rounded-xl border border-border/50 bg-card p-3">
            <div class="relative"><Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" /><input v-model="search" type="text" placeholder="Buscar por título, autor o categoría..." class="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]" /></div>
        </div>

        <!-- Empty state -->
        <div v-if="filtered.length === 0" class="mt-12 flex flex-col items-center"><FileText class="h-12 w-12 text-muted-foreground/30" /><p class="mt-4 font-medium text-foreground">No hay artículos</p><p class="mt-1 text-sm text-muted-foreground/70">{{ search ? 'Sin resultados para esa búsqueda.' : 'Crea tu primer artículo para comenzar.' }}</p></div>

        <!-- Desktop table -->
        <div v-if="filtered.length > 0" class="mt-6 hidden sm:block overflow-hidden rounded-xl border border-border/50 bg-card">
            <table class="w-full text-left text-sm">
                <thead class="border-b border-border/50 bg-muted text-xs font-medium text-muted-foreground uppercase"><tr><th class="px-5 py-3">Título</th><th class="px-5 py-3">Categoría</th><th class="px-5 py-3">Autor</th><th class="px-5 py-3">Publicado</th><th class="px-5 py-3">Fecha</th><th class="px-5 py-3 text-right">Acciones</th></tr></thead>
                <tbody class="divide-y divide-border/50">
                    <tr v-for="post in filtered" :key="post.id" class="hover:bg-muted/50 transition-colors">
                        <td class="px-5 py-3.5 font-medium text-foreground">{{ post.title }}</td>
                        <td class="px-5 py-3.5 text-muted-foreground">{{ post.category ?? '—' }}</td>
                        <td class="px-5 py-3.5 text-muted-foreground">{{ post.author.name }}</td>
                        <td class="px-5 py-3.5"><span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium" :class="post.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'"><span class="h-1.5 w-1.5 rounded-full" :class="post.is_published ? 'bg-emerald-500' : 'bg-gray-400'" />{{ post.is_published ? 'Sí' : 'No' }}</span></td>
                        <td class="px-5 py-3.5 text-xs text-muted-foreground/70 whitespace-nowrap">{{ post.published_at ? formatDate(post.published_at) : formatDate(post.created_at) }}</td>
                        <td class="px-5 py-3.5"><div class="flex items-center justify-end gap-1.5">
                            <a :href="`/${currentTeam?.slug}/blog/${post.id}`" class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#2D6A4F] hover:bg-[#2D6A4F]/10"><Eye class="h-3.5 w-3.5" />Ver</a>
                            <a :href="`/${currentTeam?.slug}/blog/${post.id}/editar`" class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"><Pencil class="h-3.5 w-3.5" />Editar</a>
                            <button @click="destroy(post.id)" class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950"><Trash2 class="h-3.5 w-3.5" />Eliminar</button>
                        </div></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Mobile cards -->
        <div v-if="filtered.length > 0" class="mt-6 grid gap-4 sm:hidden">
            <div v-for="post in filtered" :key="post.id" class="rounded-xl border border-border/50 bg-card p-4">
                <div class="flex items-start justify-between gap-3"><h3 class="font-semibold text-foreground flex-1">{{ post.title }}</h3><span class="shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium" :class="post.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'"><span class="h-1.5 w-1.5 rounded-full" :class="post.is_published ? 'bg-emerald-500' : 'bg-gray-400'" />{{ post.is_published ? 'Publicado' : 'Borrador' }}</span></div>
                <div class="mt-2 flex items-center gap-2 text-xs text-muted-foreground"><span>{{ post.category ?? 'Sin categoría' }}</span><span>·</span><span>{{ post.author.name }}</span><span>·</span><span>{{ formatDate(post.published_at || post.created_at) }}</span></div>
                <div class="mt-3 flex items-center gap-2 border-t border-border/50 pt-3">
                    <a :href="`/${currentTeam?.slug}/blog/${post.id}`" class="flex-1 rounded-lg py-2 text-center text-xs font-medium text-[#2D6A4F] hover:bg-[#2D6A4F]/10"><Eye class="inline h-3.5 w-3.5" /> Ver</a>
                    <a :href="`/${currentTeam?.slug}/blog/${post.id}/editar`" class="flex-1 rounded-lg py-2 text-center text-xs font-medium text-muted-foreground hover:bg-muted"><Pencil class="inline h-3.5 w-3.5" /> Editar</a>
                    <button @click="destroy(post.id)" class="flex-1 rounded-lg py-2 text-center text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950"><Trash2 class="inline h-3.5 w-3.5" /> Eliminar</button>
                </div>
            </div>
        </div>

        <div v-if="meta.last_page > 1" class="mt-6 flex items-center justify-center gap-2">
            <button v-if="meta.current_page > 1" @click="router.get(`/${slug}/blog?page=${meta.current_page - 1}`)" class="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted"><ChevronLeft class="h-4 w-4" /></button>
            <template v-for="page in meta.last_page" :key="page">
                <button v-if="page === 1 || page === meta.last_page || Math.abs(page - meta.current_page) <= 2" @click="router.get(`/${slug}/blog?page=${page}`)" class="flex h-9 min-w-[36px] items-center justify-center rounded-lg px-3 text-sm font-medium" :class="page === meta.current_page ? 'bg-[#2D6A4F] text-white shadow-sm' : 'border border-border bg-card text-muted-foreground hover:bg-muted'">{{ page }}</button>
                <span v-else-if="Math.abs(page - meta.current_page) === 3" class="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground/50">...</span>
            </template>
            <button v-if="meta.current_page < meta.last_page" @click="router.get(`/${slug}/blog?page=${meta.current_page + 1}`)" class="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted"><ChevronRight class="h-4 w-4" /></button>
        </div>
    </div>
</template>
