<script setup lang="ts">
import { router, usePage } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import { Search, MapPin, Phone, Star, ChevronLeft, ChevronRight, Filter, X, Home, PawPrint, ShieldCheck, MessageCircle, Globe, Users } from 'lucide-vue-next';
import { usePhotoUrl } from '@/composables/usePhotoUrl';

const { photoUrl } = usePhotoUrl();
const page = usePage();

interface Albergue { id: number; name: string; slug: string; bio: string | null; logo: string | null; address: string | null; city: string | null; phone: string | null; website: string | null; pets_count: number; ratings_count: number; ratings_avg_rating: number | null; }
interface Meta { current_page: number; last_page: number; total: number; per_page: number; }
const props = defineProps<{ albergues: Albergue[]; meta: Meta; filters: { city?: string; search?: string; sort?: string }; cities: string[] }>();

function applyFilters(f: Record<string, string>) { const p = new URLSearchParams(); for (const [k, v] of Object.entries(f)) if (v) p.set(k, v); router.get('/mi-adopcion/albergues' + (p.toString() ? '?' + p : ''), {}, { preserveState: true, replace: true }); }
let t: ReturnType<typeof setTimeout> | null = null;
function onSearchInput(e: Event) { const v = (e.target as HTMLInputElement).value; if (t) clearTimeout(t); t = setTimeout(() => applyFilters({ ...props.filters, search: v }), 400); }
const hasFilters = computed(() => !!(props.filters.city || props.filters.search || props.filters.sort));
function renderStars(r: number): string { return Array.from({ length: 5 }, (_, i) => i < Math.round(r) ? '★' : '☆').join(''); }
</script>

<template>
    <div class="mx-auto max-w-5xl">
        <div class="mb-6"><h1 class="text-2xl font-bold text-foreground">Albergues</h1><p class="mt-1 text-sm text-muted-foreground">{{ meta.total }} organizaciones de adopcion en Cusco.</p></div>

        <div class="mb-6 rounded-2xl border border-border/50 bg-card/80 p-4 shadow-sm">
            <div class="flex flex-wrap items-center gap-3">
                <div class="flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground"><Filter class="h-4 w-4" /> Filtros</div>
                <select :value="filters.city || ''" @change="applyFilters({ ...props.filters, city: ($event.target as HTMLSelectElement).value })" class="rounded-xl border border-border bg-transparent px-3 py-2 text-sm text-muted-foreground outline-none focus:border-teal-500"><option value="">Todas las ciudades</option><option v-for="c in cities" :key="c" :value="c">{{ c }}</option></select>
                <select :value="filters.sort || ''" @change="applyFilters({ ...props.filters, sort: ($event.target as HTMLSelectElement).value })" class="rounded-xl border border-border bg-transparent px-3 py-2 text-sm text-muted-foreground outline-none focus:border-teal-500"><option value="">Más recientes</option><option value="rating">Mejor calificados</option></select>
                <input :value="filters.search" @input="onSearchInput" type="text" placeholder="Buscar..." class="rounded-xl border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500 w-48" />
                <button v-if="hasFilters" @click="applyFilters({ city: '', search: '', sort: '' })" class="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50"><X class="h-4 w-4" /> Limpiar</button>
            </div>
        </div>

        <div v-if="albergues.length === 0" class="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-card py-16"><Home class="h-12 w-12 text-muted-foreground/25" /><p class="mt-3 text-muted-foreground">No hay albergues registrados.</p></div>
        <div v-else class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <a v-for="a in albergues" :key="a.id" :href="'/mi-adopcion/albergues/' + a.slug" class="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all hover:-translate-y-1 hover:shadow-xl">
                <div class="aspect-[4/3] overflow-hidden bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-950 dark:to-teal-900">
                    <img v-if="a.logo" :src="photoUrl(a.logo)" :alt="a.name" class="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                    <div v-else class="flex h-full items-center justify-center"><PawPrint class="h-16 w-16 text-teal-300/40 dark:text-teal-700/30" /></div>
                </div>
                <div class="flex flex-1 flex-col p-5">
                    <h3 class="text-base font-semibold text-foreground group-hover:text-teal-600">{{ a.name }}</h3>
                    <div v-if="a.city" class="mt-1 flex items-center gap-1 text-xs text-muted-foreground/60"><MapPin class="h-3 w-3 shrink-0" />{{ a.city }}</div>
                    <div v-if="a.bio" class="mt-2 text-xs text-muted-foreground line-clamp-2">{{ a.bio }}</div>
                    <div class="mt-2 flex items-center gap-1.5"><span class="text-sm text-amber-500">{{ renderStars(a.ratings_avg_rating ?? 0) }}</span><span class="text-xs text-muted-foreground">({{ a.ratings_count }})</span></div>
                    <div class="mt-auto pt-3 flex items-center gap-3 text-xs text-muted-foreground/50">
                        <span class="flex items-center gap-1"><PawPrint class="h-3 w-3" />{{ a.pets_count }} mascotas</span>
                    </div>
                </div>
            </a>
        </div>

        <div v-if="meta.last_page > 1" class="mt-6 flex items-center justify-center gap-2">
            <button v-if="meta.current_page > 1" @click="applyFilters({ ...props.filters, page: String(meta.current_page - 1) })" class="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted"><ChevronLeft class="h-4 w-4" /></button>
            <template v-for="p in meta.last_page" :key="p"><button v-if="p === 1 || p === meta.last_page || Math.abs(p - meta.current_page) <= 2" @click="applyFilters({ ...props.filters, page: String(p) })" class="flex h-9 min-w-[36px] items-center justify-center rounded-lg px-3 text-sm font-medium" :class="p === meta.current_page ? 'bg-teal-600 text-white' : 'border border-border bg-card text-muted-foreground hover:bg-muted'">{{ p }}</button><span v-else-if="Math.abs(p - meta.current_page) === 3" class="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground/50">...</span></template>
            <button v-if="meta.current_page < meta.last_page" @click="applyFilters({ ...props.filters, page: String(meta.current_page + 1) })" class="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted"><ChevronRight class="h-4 w-4" /></button>
        </div>
    </div>
</template>
