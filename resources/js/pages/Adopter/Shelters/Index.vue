<script setup lang="ts">
import { router, usePage, useForm } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
import { Search, MapPin, Phone, Star, ChevronLeft, ChevronRight, Filter, X, Plus, Home, ShieldCheck, MessageCircle, Navigation } from 'lucide-vue-next';

const page = usePage();
const isAuthenticated = computed(() => !!page.props.auth?.user);

interface Shelter {
    id: number; name: string; address: string; city: string | null; phone: string | null; whatsapp: string | null;
    description: string | null; services: string[] | null; capacity: number | null; is_verified: boolean; average_rating: number; ratings_count: number;
}

interface Meta { current_page: number; last_page: number; total: number; per_page: number; }
const props = defineProps<{ shelters: Shelter[]; meta: Meta; filters: { city?: string; search?: string; sort?: string }; cities: string[] }>();
const showForm = ref(false);

function applyFilters(f: Record<string, string>) {
    const p = new URLSearchParams(); for (const [k, v] of Object.entries(f)) if (v) p.set(k, v);
    router.get('/mi-adopcion/albergues' + (p.toString() ? '?' + p : ''), {}, { preserveState: true, replace: true });
}
let t: ReturnType<typeof setTimeout> | null = null;
function onSearchInput(e: Event) { const v = (e.target as HTMLInputElement).value; if (t) clearTimeout(t); t = setTimeout(() => applyFilters({ ...props.filters, search: v }), 400); }
const hasActiveFilters = computed(() => !!(props.filters.city || props.filters.search || props.filters.sort));

function renderStars(r: number): string { return Array.from({ length: 5 }, (_, i) => i < Math.round(r) ? '★' : '☆').join(''); }
function starColor(r: number): string { return r >= 4 ? 'text-amber-500' : r >= 3 ? 'text-amber-400' : 'text-gray-300'; }

const form = useForm({
    name: '', address: '', city: 'Cusco', phone: '', whatsapp: '', email: '', website: '', description: '', capacity: null as number | null, services: [] as string[],
});
const serviceOptions = ['Adopciones', 'Rescate', 'Esterilización', 'Vacunación', 'Desparasitación', 'Emergencias', 'Hospedaje temporal', 'Voluntariado', 'Donaciones', 'Educación', 'Eventos comunitarios', 'Transporte animal'];
function toggleService(s: string) { const i = form.services.indexOf(s); if (i >= 0) form.services.splice(i, 1); else form.services.push(s); }
function addShelter() { form.post('/mi-adopcion/albergues/agregar', { preserveState: true, onSuccess: () => { showForm.value = false; form.reset(); } }); }
</script>

<template>
    <div class="mx-auto max-w-5xl">
        <div class="flex items-center justify-between mb-6">
            <div><h1 class="text-2xl font-bold text-foreground">Albergues</h1><p class="mt-1 text-sm text-muted-foreground">{{ meta.total }} albergues registrados.</p></div>
            <button v-if="isAuthenticated" @click="showForm = true" class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#14B8A6] px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-teal-500/20 transition hover:from-[#0F766E] hover:to-[#0D9488]"><Plus class="h-4 w-4" /> Agregar albergue</button>
        </div>

        <!-- Filters -->
        <div class="mb-6 rounded-2xl border border-border/50 bg-card/80 p-4 shadow-sm">
            <div class="flex flex-wrap items-center gap-3">
                <div class="flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground"><Filter class="h-4 w-4" /> Filtros</div>
                <select :value="filters.city || ''" @change="applyFilters({ ...props.filters, city: ($event.target as HTMLSelectElement).value })" class="rounded-xl border border-border bg-transparent px-3 py-2 text-sm text-muted-foreground outline-none focus:border-teal-500"><option value="">Todas las ciudades</option><option v-for="c in cities" :key="c" :value="c">{{ c }}</option></select>
                <select :value="filters.sort || ''" @change="applyFilters({ ...props.filters, sort: ($event.target as HTMLSelectElement).value })" class="rounded-xl border border-border bg-transparent px-3 py-2 text-sm text-muted-foreground outline-none focus:border-teal-500"><option value="">Más recientes</option><option value="rating">Mejor calificados</option></select>
                <input :value="filters.search" @input="onSearchInput" type="text" placeholder="Buscar..." class="rounded-xl border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500 w-48" />
                <button v-if="hasActiveFilters" @click="applyFilters({ city: '', search: '', sort: '' })" class="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50"><X class="h-4 w-4" /> Limpiar</button>
            </div>
        </div>

        <!-- Grid -->
        <div v-if="shelters.length === 0" class="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-card py-16"><Home class="h-12 w-12 text-muted-foreground/25" /><p class="mt-3 text-muted-foreground">No hay albergues registrados.</p></div>
        <div v-else class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <a v-for="s in shelters" :key="s.id" :href="'/mi-adopcion/albergues/' + s.id" class="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all hover:-translate-y-1 hover:shadow-xl">
                <div class="absolute right-3 top-3"><ShieldCheck v-if="s.is_verified" class="h-5 w-5 text-teal-500" /></div>
                <div class="flex flex-1 flex-col p-5">
                    <h3 class="text-base font-semibold text-foreground group-hover:text-teal-600 transition-colors">{{ s.name }}</h3>
                    <div class="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground/60"><MapPin class="h-3 w-3 shrink-0" /><span class="truncate">{{ s.address }}</span></div>
                    <div class="mt-2 flex items-center gap-1.5"><span class="text-sm" :class="starColor(s.average_rating)">{{ renderStars(s.average_rating) }}</span><span class="text-xs text-muted-foreground">({{ s.ratings_count }})</span></div>
                    <div v-if="s.capacity" class="mt-1 text-xs text-muted-foreground">Capacidad: {{ s.capacity }} animales</div>
                    <div v-if="s.services" class="mt-3 flex flex-wrap gap-1"><span v-for="sv in s.services.slice(0, 3)" :key="sv" class="rounded-md bg-teal-50 px-2 py-0.5 text-[10px] font-medium text-teal-700 dark:bg-teal-950/30 dark:text-teal-400">{{ sv }}</span><span v-if="s.services.length > 3" class="text-[10px] text-muted-foreground self-center">+{{ s.services.length - 3 }}</span></div>
                    <div class="mt-3 flex items-center gap-3 text-xs text-muted-foreground/50"><span v-if="s.phone" class="flex items-center gap-1"><Phone class="h-3 w-3" />{{ s.phone }}</span><span v-if="s.whatsapp" class="flex items-center gap-1 text-[#25D366]"><MessageCircle class="h-3 w-3" />WA</span></div>
                </div>
            </a>
        </div>

        <!-- Pagination -->
        <div v-if="meta.last_page > 1" class="mt-6 flex items-center justify-center gap-2">
            <button v-if="meta.current_page > 1" @click="applyFilters({ ...props.filters, page: String(meta.current_page - 1) })" class="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted"><ChevronLeft class="h-4 w-4" /></button>
            <template v-for="p in meta.last_page" :key="p"><button v-if="p === 1 || p === meta.last_page || Math.abs(p - meta.current_page) <= 2" @click="applyFilters({ ...props.filters, page: String(p) })" class="flex h-9 min-w-[36px] items-center justify-center rounded-lg px-3 text-sm font-medium" :class="p === meta.current_page ? 'bg-teal-600 text-white' : 'border border-border bg-card text-muted-foreground hover:bg-muted'">{{ p }}</button><span v-else-if="Math.abs(p - meta.current_page) === 3" class="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground/50">...</span></template>
            <button v-if="meta.current_page < meta.last_page" @click="applyFilters({ ...props.filters, page: String(meta.current_page + 1) })" class="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted"><ChevronRight class="h-4 w-4" /></button>
        </div>

        <!-- Add Modal -->
        <Teleport to="body">
            <div v-if="showForm" class="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm p-4 pt-10 sm:pt-20" @click.self="showForm = false">
                <div class="relative w-full max-w-xl rounded-2xl border border-border/50 bg-card shadow-2xl" @click.stop>
                    <div class="flex items-center justify-between border-b border-border/50 px-6 py-4"><h2 class="text-lg font-semibold">Agregar albergue</h2><button @click="showForm = false" class="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"><X class="h-5 w-5" /></button></div>
                    <form @submit.prevent="addShelter" class="space-y-4 p-6">
                        <div class="grid gap-4 sm:grid-cols-2"><div><label class="block text-sm font-medium mb-1.5">Nombre *</label><input v-model="form.name" type="text" required class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-teal-500" /></div><div><label class="block text-sm font-medium mb-1.5">Ciudad</label><input v-model="form.city" type="text" class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-teal-500" /></div></div>
                        <div><label class="block text-sm font-medium mb-1.5">Dirección *</label><input v-model="form.address" type="text" required class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-teal-500" /></div>
                        <div class="grid gap-4 sm:grid-cols-3"><div><label class="block text-sm font-medium mb-1.5">Teléfono</label><input v-model="form.phone" type="text" class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-teal-500" /></div><div><label class="block text-sm font-medium mb-1.5">WhatsApp</label><input v-model="form.whatsapp" type="text" class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-teal-500" /></div><div><label class="block text-sm font-medium mb-1.5">Capacidad</label><input v-model.number="form.capacity" type="number" min="1" class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-teal-500" placeholder="N° de animales" /></div></div>
                        <div><label class="block text-sm font-medium mb-1.5">Servicios</label><div class="flex flex-wrap gap-2"><button v-for="s in serviceOptions" :key="s" type="button" @click="toggleService(s)" class="rounded-lg border px-3 py-1.5 text-xs font-medium transition" :class="form.services.includes(s) ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-border text-muted-foreground hover:border-teal-300'">{{ s }}</button></div></div>
                        <div><label class="block text-sm font-medium mb-1.5">Descripción</label><textarea v-model="form.description" rows="2" class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-teal-500" /></div>
                        <div class="flex items-center justify-end gap-3 border-t border-border/50 pt-4"><button type="button" @click="showForm = false" class="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted">Cancelar</button><button type="submit" :disabled="form.processing" class="rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 px-5 py-2.5 text-sm font-medium text-white transition disabled:opacity-50">Agregar</button></div>
                    </form>
                </div>
            </div>
        </Teleport>
    </div>
</template>
