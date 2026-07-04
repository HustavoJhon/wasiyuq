<script setup lang="ts">
import { router, usePage } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
import {
    Search, MapPin, Phone, Star, ChevronLeft, ChevronRight, Filter, X,
    Plus, Stethoscope, Mail, Globe, MessageCircle, ShieldCheck, Navigation,
} from 'lucide-vue-next';
import { useForm } from '@inertiajs/vue3';

const page = usePage();
const isAuthenticated = computed(() => !!page.props.auth?.user);

interface Veterinarian {
    id: number;
    name: string;
    address: string;
    city: string | null;
    phone: string | null;
    whatsapp: string | null;
    email: string | null;
    website: string | null;
    description: string | null;
    services: string[] | null;
    photos: string[] | null;
    is_verified: boolean;
    average_rating: number;
    ratings_count: number;
    latitude: number | null;
    longitude: number | null;
}

interface Meta {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

const props = defineProps<{ veterinarians: Veterinarian[]; meta: Meta; filters: { city?: string; search?: string; sort?: string }; cities: string[] }>();

const showForm = ref(false);

function applyFilters(newFilters: Record<string, string>) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(newFilters)) {
        if (value) params.set(key, value);
    }
    const qs = params.toString();
    router.get('/mi-adopcion/veterinarias' + (qs ? '?' + qs : ''), {}, { preserveState: true, replace: true });
}

let searchTimeout: ReturnType<typeof setTimeout> | null = null;
function onSearchInput(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        applyFilters({ ...props.filters, search: value });
    }, 400);
}

const hasActiveFilters = computed(() => !!(props.filters.city || props.filters.search || props.filters.sort));

function renderStars(rating: number): string {
    if (rating === 0) return '☆☆☆☆☆';
    return Array.from({ length: 5 }, (_, i) => i < Math.round(rating) ? '★' : '☆').join('');
}

function starColor(rating: number): string {
    if (rating >= 4) return 'text-amber-500';
    if (rating >= 3) return 'text-amber-400';
    return 'text-gray-300';
}

// Add vet form
const form = useForm({
    name: '',
    address: '',
    city: 'Cusco',
    phone: '',
    whatsapp: '',
    email: '',
    website: '',
    description: '',
    services: [] as string[],
});

const serviceOptions = ['Consultas', 'Vacunas', 'Cirugía', 'Emergencias 24h', 'Peluquería', 'Hospitalización', 'Radiografías', 'Laboratorio', 'Farmacia', 'Pet shop', 'Guardería', 'Domicilio'];

function toggleService(service: string) {
    const idx = form.services.indexOf(service);
    if (idx >= 0) form.services.splice(idx, 1);
    else form.services.push(service);
}

function addVet() {
    form.post('/mi-adopcion/veterinarias/agregar', {
        preserveState: true,
        onSuccess: () => {
            showForm.value = false;
            form.reset();
        },
    });
}
</script>

<template>
    <div class="mx-auto max-w-5xl">
        <!-- Header compact -->
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="text-2xl font-bold text-foreground flex items-center gap-2"><Stethoscope class="h-6 w-6 text-blue-500" /> Veterinarias</h1>
                <p class="mt-1 text-sm text-muted-foreground">{{ meta.total }} veterinarias registradas.</p>
            </div>
            <button v-if="isAuthenticated" @click="showForm = true" class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-blue-500/20 transition hover:from-[#1D4ED8] hover:to-[#2563EB]"><Plus class="h-4 w-4" /> Agregar</button>
        </div>

        <!-- Filters -->
        <div class="mb-6 rounded-2xl border border-border/50 bg-card/80 p-4 shadow-sm">
            <div class="flex flex-wrap items-center gap-3">
                <div class="flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                    <Filter class="h-4 w-4" />
                    <span>Filtros</span>
                </div>
                        <select :value="filters.city || ''"
                            @change="applyFilters({ ...props.filters, city: ($event.target as HTMLSelectElement).value })"
                            class="rounded-xl border border-border bg-transparent px-3 py-2 text-sm text-muted-foreground outline-none focus:border-[#2563EB]">
                            <option value="">Todas las ciudades</option>
                            <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
                        </select>
                        <select :value="filters.sort || ''"
                            @change="applyFilters({ ...props.filters, sort: ($event.target as HTMLSelectElement).value })"
                            class="rounded-xl border border-border bg-transparent px-3 py-2 text-sm text-muted-foreground outline-none focus:border-[#2563EB]">
                            <option value="">Más recientes</option>
                            <option value="rating">Mejor calificadas</option>
                        </select>
                        <button v-if="hasActiveFilters"
                            @click="applyFilters({ city: '', search: '', sort: '' })"
                            class="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50">
                            <X class="h-4 w-4" /> Limpiar
                        </button>
                        <input :value="filters.search" @input="onSearchInput" type="text" placeholder="Buscar por nombre..." class="rounded-xl border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-[#2563EB] w-48" />
                    </div>
                </div>

            <!-- Empty -->
            <div v-if="veterinarians.length === 0" class="flex flex-col items-center justify-center py-24">
                <Stethoscope class="h-16 w-16 text-muted-foreground/25" />
                <h3 class="mt-4 text-lg font-semibold text-foreground">No hay veterinarias</h3>
                <p class="mt-1 text-sm text-muted-foreground">No se encontraron veterinarias con esos filtros.</p>
                <button v-if="isAuthenticated" @click="showForm = true"
                    class="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] px-5 py-2.5 text-sm font-medium text-white">
                    <Plus class="h-4 w-4" /> Agregar la primera
                </button>
            </div>

            <!-- Cards -->
            <div v-else class="grid gap-5 pb-16 sm:grid-cols-2 lg:grid-cols-3">
                <a v-for="vet in veterinarians" :key="vet.id"
                    :href="'/mi-adopcion/veterinarias/' + vet.id"
                    class="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5">
                    <div class="absolute right-3 top-3">
                        <ShieldCheck v-if="vet.is_verified" class="h-5 w-5 text-blue-500" title="Verificada" />
                    </div>
                    <div class="flex flex-1 flex-col p-5">
                        <h3 class="text-base font-semibold text-foreground group-hover:text-[#2563EB] transition-colors">{{ vet.name }}</h3>
                        <div class="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground/60">
                            <MapPin class="h-3 w-3 shrink-0" />
                            <span class="truncate">{{ vet.address }}</span>
                        </div>
                        <div class="mt-2 flex items-center gap-1.5">
                            <span class="text-sm" :class="starColor(vet.average_rating)">{{ renderStars(vet.average_rating) }}</span>
                            <span class="text-xs text-muted-foreground">({{ vet.ratings_count }})</span>
                        </div>
                        <div v-if="vet.services" class="mt-3 flex flex-wrap gap-1">
                            <span v-for="s in vet.services.slice(0, 3)" :key="s" class="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">{{ s }}</span>
                            <span v-if="vet.services.length > 3" class="text-[10px] text-muted-foreground self-center">+{{ vet.services.length - 3 }}</span>
                        </div>
                        <div class="mt-3 flex items-center gap-3 text-xs text-muted-foreground/50">
                            <span v-if="vet.phone" class="flex items-center gap-1"><Phone class="h-3 w-3" />{{ vet.phone }}</span>
                            <span v-if="vet.whatsapp" class="flex items-center gap-1 text-[#25D366]"><MessageCircle class="h-3 w-3" />WhatsApp</span>
                        </div>
                    </div>
                </a>
            </div>

            <!-- Pagination -->
            <div v-if="meta.last_page > 1" class="flex items-center justify-center gap-2 pb-16">
                <button v-if="meta.current_page > 1"
                    @click="applyFilters({ ...props.filters, page: String(meta.current_page - 1) })"
                    class="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition hover:bg-muted">
                    <ChevronLeft class="h-4 w-4" />
                </button>
                <template v-for="p in meta.last_page" :key="p">
                    <button v-if="p === 1 || p === meta.last_page || Math.abs(p - meta.current_page) <= 2"
                        @click="applyFilters({ ...props.filters, page: String(p) })"
                        class="flex h-10 min-w-[40px] items-center justify-center rounded-xl px-3 text-sm font-medium transition"
                        :class="p === meta.current_page ? 'bg-[#2563EB] text-white' : 'border border-border bg-card text-muted-foreground hover:bg-muted'">
                        {{ p }}
                    </button>
                    <span v-else-if="Math.abs(p - meta.current_page) === 3" class="flex h-10 w-10 items-center justify-center text-sm text-muted-foreground/50">...</span>
                </template>
                <button v-if="meta.current_page < meta.last_page"
                    @click="applyFilters({ ...props.filters, page: String(meta.current_page + 1) })"
                    class="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition hover:bg-muted">
                    <ChevronRight class="h-4 w-4" />
                </button>
            </div>

        <!-- Add Vet Modal -->
        <Teleport to="body">
            <div v-if="showForm" class="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm p-4 pt-10 sm:pt-20" @click.self="showForm = false">
                <div class="relative w-full max-w-xl rounded-2xl border border-border/50 bg-card shadow-2xl" @click.stop>
                    <div class="flex items-center justify-between border-b border-border/50 px-6 py-4">
                        <h2 class="text-lg font-semibold text-foreground">Agregar veterinaria</h2>
                        <button @click="showForm = false" class="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted">
                            <X class="h-5 w-5" />
                        </button>
                    </div>
                    <form @submit.prevent="addVet" class="space-y-4 p-6">
                        <div class="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label class="block text-sm font-medium mb-1.5">Nombre *</label>
                                <input v-model="form.name" type="text" required class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-[#2563EB]" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1.5">Ciudad</label>
                                <input v-model="form.city" type="text" class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-[#2563EB]" />
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1.5">Dirección *</label>
                            <input v-model="form.address" type="text" required class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-[#2563EB]" />
                        </div>
                        <div class="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label class="block text-sm font-medium mb-1.5">Teléfono</label>
                                <input v-model="form.phone" type="text" class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-[#2563EB]" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1.5">WhatsApp</label>
                                <input v-model="form.whatsapp" type="text" class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-[#2563EB]" />
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1.5">Servicios</label>
                            <div class="flex flex-wrap gap-2">
                                <button v-for="s in serviceOptions" :key="s" type="button"
                                    @click="toggleService(s)"
                                    class="rounded-lg border px-3 py-1.5 text-xs font-medium transition"
                                    :class="form.services.includes(s) ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/30' : 'border-border text-muted-foreground hover:border-blue-300'">
                                    {{ s }}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1.5">Descripción</label>
                            <textarea v-model="form.description" rows="2" class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-[#2563EB]" />
                        </div>
                        <div class="flex items-center justify-end gap-3 border-t border-border/50 pt-4">
                            <button type="button" @click="showForm = false" class="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted">Cancelar</button>
                            <button type="submit" :disabled="form.processing" class="rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] px-5 py-2.5 text-sm font-medium text-white transition disabled:opacity-50">Agregar</button>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>
    </div>
</template>
