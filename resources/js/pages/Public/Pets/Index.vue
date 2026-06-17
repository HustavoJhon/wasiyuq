<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import {
    Dog, Cat, Rabbit, Bird, Search, PawPrint, MapPin,
    ChevronLeft, ChevronRight, SlidersHorizontal, ArrowUpDown, X,
    Filter,
} from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { usePhotoUrl } from '@/composables/usePhotoUrl';
import DoughnutChart from '@/components/charts/DoughnutChart.vue';

const { photoUrl } = usePhotoUrl();

interface Pet {
    id: number;
    name: string;
    slug: string;
    species: string;
    breed: string | null;
    age_years: number;
    age_months: number;
    gender: string;
    size: string;
    color: string | null;
    status: string;
    photos: string[] | null;
    team: { id: number; name: string; slug: string; city: string | null; state: string | null };
}

interface Meta {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

const props = defineProps<{
    pets: Pet[];
    meta: Meta;
    filters: { species?: string; size?: string; gender?: string; search?: string; sort?: string };
    speciesCounts: Record<string, number>;
    statusCounts: Record<string, number>;
}>();

const mobileFiltersOpen = ref(false);

function applyFilters(newFilters: Record<string, string>) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(newFilters)) {
        if (value) params.set(key, value);
    }
    const qs = params.toString();
    router.get('/mascotas' + (qs ? '?' + qs : ''), {}, { preserveState: true, replace: true });
}

let searchTimeout: ReturnType<typeof setTimeout> | null = null;
function onSearchInput(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        applyFilters({ ...props.filters, search: value });
    }, 400);
}

function formatAge(years: number, months: number): string {
    if (years > 0) return `${years} ${years > 1 ? 'años' : 'año'}`;
    if (months > 0) return `${months} ${months > 1 ? 'meses' : 'mes'}`;
    return 'Cachorro';
}

function speciesLabel(s: string): string {
    const labels: Record<string, string> = { dog: 'Perro', cat: 'Gato', rabbit: 'Conejo', bird: 'Ave', other: 'Otro' };
    return labels[s] ?? s;
}

function sizeLabel(s: string): string {
    const labels: Record<string, string> = { small: 'Pequeño', medium: 'Mediano', large: 'Grande' };
    return labels[s] ?? s;
}

function genderLabel(g: string): string {
    return g === 'male' ? 'Macho' : 'Hembra';
}

function statusLabel(s: string): string {
    const labels: Record<string, string> = { available: 'Disponible', in_process: 'En Proceso', adopted: 'Adoptado', withheld: 'Reservado' };
    return labels[s] ?? s;
}

function statusColor(s: string): string {
    const colors: Record<string, string> = { available: 'bg-emerald-500', in_process: 'bg-amber-500', adopted: 'bg-blue-500', withheld: 'bg-gray-400' };
    return colors[s] ?? 'bg-gray-400';
}

const speciesIcon = (s: string) => {
    const icons: Record<string, any> = { dog: Dog, cat: Cat, rabbit: Rabbit, bird: Bird };
    return icons[s] ?? PawPrint;
};

const speciesOptions = [
    { value: '', label: 'Todas las especies', icon: PawPrint, color: '#2D6A4F' },
    { value: 'dog', label: 'Perros', icon: Dog, color: '#0EA5E9' },
    { value: 'cat', label: 'Gatos', icon: Cat, color: '#F59E0B' },
    { value: 'rabbit', label: 'Conejos', icon: Rabbit, color: '#EC4899' },
    { value: 'bird', label: 'Aves', icon: Bird, color: '#8B5CF6' },
];

const activeSpecies = computed(() => speciesOptions.find(o => o.value === (props.filters.species || '')) || speciesOptions[0]);

const hasActiveFilters = computed(() => !!(props.filters.species || props.filters.size || props.filters.gender || props.filters.search || props.filters.sort));

const chartData = computed(() => {
    const labels: Record<string, string> = { dog: 'Perros', cat: 'Gatos', rabbit: 'Conejos', bird: 'Aves', other: 'Otros' };
    const colors: Record<string, string> = { dog: '#0EA5E9', cat: '#F59E0B', rabbit: '#EC4899', bird: '#8B5CF6', other: '#2D6A4F' };
    return speciesOptions
        .filter(o => o.value !== '')
        .map(o => ({
            label: labels[o.value] ?? o.label,
            value: Number(props.speciesCounts[o.value] ?? 0),
            color: colors[o.value] ?? '#2D6A4F',
        }))
        .filter(d => d.value > 0);
});

const placeholderSrc = 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#e5e7eb"/><g transform="translate(200,150)"><circle cx="0" cy="-20" r="40" fill="#d1d5db"/><ellipse cx="-25" cy="15" rx="20" ry="25" fill="#d1d5db"/><ellipse cx="25" cy="15" rx="20" ry="25" fill="#d1d5db"/></g></svg>');
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
                        <PawPrint class="h-8 w-8 text-white" />
                    </div>
                    <h1 class="text-4xl font-bold tracking-tight text-white sm:text-5xl">Mascotas en adopción</h1>
                    <p class="mt-4 text-lg text-green-100/80">
                        {{ meta.total }} mascotas esperan un hogar lleno de amor en Cusco
                    </p>
                    <div class="mx-auto mt-8 flex max-w-lg items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-1 backdrop-blur-md focus-within:border-white/30 focus-within:bg-white/15">
                        <Search class="h-5 w-5 shrink-0 text-green-100/60" />
                        <input
                            type="text"
                            :value="filters.search"
                            @input="onSearchInput"
                            placeholder="Buscar por nombre, raza..."
                            class="h-12 w-full border-0 bg-transparent text-white placeholder-green-100/50 outline-none"
                        />
                    </div>
                </div>
            </div>
        </section>

        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <!-- Stats / Species pills -->
            <div class="-mt-8 mb-6 rounded-2xl border border-border/50 bg-card/80 p-4 shadow-lg backdrop-blur-xl">
                <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                    <a v-for="opt in speciesOptions" :key="opt.value"
                        :href="opt.value ? '/mascotas?species=' + opt.value : '/mascotas'"
                        class="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200"
                        :class="activeSpecies.value === opt.value
                            ? 'bg-[#2D6A4F] text-white shadow-md shadow-[#2D6A4F]/20'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'">
                        <component :is="opt.icon" class="h-4 w-4" />
                        {{ opt.label }}
                        <span v-if="opt.value" class="ml-0.5 text-xs opacity-70">({{ speciesCounts[opt.value] ?? 0 }})</span>
                    </a>
                </div>
            </div>

            <!-- Chart + filters row -->
            <div class="mb-8 grid gap-6 lg:grid-cols-3">
                <!-- Donut chart (desktop sidebar) -->
                <div v-if="chartData.length > 1" class="hidden lg:block">
                    <div class="rounded-2xl border border-border/50 bg-card/80 p-5 shadow-sm">
                        <h3 class="mb-3 text-sm font-semibold text-foreground">Distribución por especie</h3>
                        <DoughnutChart :data="chartData" :size="180" :innerRadius="50" />
                    </div>
                </div>

                <!-- Main content area -->
                <div :class="chartData.length > 1 ? 'lg:col-span-2' : 'lg:col-span-3'">
                    <!-- Filter bar -->
                    <div class="rounded-2xl border border-border/50 bg-card/80 p-3 shadow-sm">
                        <!-- Desktop filters -->
                        <div class="hidden items-center gap-3 sm:flex">
                            <div class="flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                                <SlidersHorizontal class="h-4 w-4" />
                                <span>Filtros</span>
                            </div>

                            <select
                                :value="filters.size || ''"
                                @change="applyFilters({ ...props.filters, size: ($event.target as HTMLSelectElement).value })"
                                class="rounded-xl border border-border bg-transparent px-3 py-2 text-sm text-muted-foreground outline-none transition focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]">
                                <option value="">Cualquier tamaño</option>
                                <option value="small">Pequeño</option>
                                <option value="medium">Mediano</option>
                                <option value="large">Grande</option>
                            </select>

                            <select
                                :value="filters.gender || ''"
                                @change="applyFilters({ ...props.filters, gender: ($event.target as HTMLSelectElement).value })"
                                class="rounded-xl border border-border bg-transparent px-3 py-2 text-sm text-muted-foreground outline-none transition focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]">
                                <option value="">Cualquier sexo</option>
                                <option value="female">Hembra</option>
                                <option value="male">Macho</option>
                            </select>

                            <span class="h-5 w-px bg-border" />

                            <select
                                :value="filters.sort || 'recent'"
                                @change="applyFilters({ ...props.filters, sort: ($event.target as HTMLSelectElement).value })"
                                class="rounded-xl border border-border bg-transparent px-3 py-2 text-sm text-muted-foreground outline-none transition focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]">
                                <option value="recent">Más recientes</option>
                                <option value="oldest">Más antiguos</option>
                            </select>

                            <button v-if="hasActiveFilters"
                                @click="applyFilters({ species: '', size: '', gender: '', search: '', sort: '' })"
                                class="ml-auto inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950">
                                <X class="h-4 w-4" />
                                Limpiar
                            </button>
                        </div>

                        <!-- Mobile filter toggle + active pills -->
                        <div class="flex items-center gap-3 sm:hidden">
                            <button @click="mobileFiltersOpen = !mobileFiltersOpen"
                                class="inline-flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-4 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted">
                                <Filter class="h-4 w-4" />
                                Filtros
                                <span v-if="hasActiveFilters" class="flex h-5 w-5 items-center justify-center rounded-full bg-[#2D6A4F] text-[10px] font-bold text-white">
                                    {{ (filters.size ? 1 : 0) + (filters.gender ? 1 : 0) }}
                                </span>
                            </button>

                            <select
                                :value="filters.sort || 'recent'"
                                @change="applyFilters({ ...props.filters, sort: ($event.target as HTMLSelectElement).value })"
                                class="flex-1 rounded-xl border border-border bg-transparent px-3 py-2.5 text-sm text-muted-foreground outline-none transition focus:border-[#2D6A4F]">
                                <option value="recent">Más recientes</option>
                                <option value="oldest">Más antiguos</option>
                            </select>

                            <button v-if="hasActiveFilters"
                                @click="applyFilters({ species: '', size: '', gender: '', search: '', sort: '' })"
                                class="rounded-xl p-2.5 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950">
                                <X class="h-4 w-4" />
                            </button>
                        </div>

                        <!-- Mobile expanded filters -->
                        <div v-if="mobileFiltersOpen" class="mt-3 space-y-2 sm:hidden">
                            <select
                                :value="filters.size || ''"
                                @change="applyFilters({ ...props.filters, size: ($event.target as HTMLSelectElement).value })"
                                class="w-full rounded-xl border border-border bg-transparent px-3 py-2.5 text-sm text-muted-foreground outline-none transition focus:border-[#2D6A4F]">
                                <option value="">Cualquier tamaño</option>
                                <option value="small">Pequeño</option>
                                <option value="medium">Mediano</option>
                                <option value="large">Grande</option>
                            </select>
                            <select
                                :value="filters.gender || ''"
                                @change="applyFilters({ ...props.filters, gender: ($event.target as HTMLSelectElement).value })"
                                class="w-full rounded-xl border border-border bg-transparent px-3 py-2.5 text-sm text-muted-foreground outline-none transition focus:border-[#2D6A4F]">
                                <option value="">Cualquier sexo</option>
                                <option value="female">Hembra</option>
                                <option value="male">Macho</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty state -->
            <div v-if="pets.length === 0" class="flex flex-col items-center justify-center py-24">
                <div class="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                    <Search class="h-10 w-10 text-muted-foreground/50" />
                </div>
                <h3 class="mt-6 text-lg font-semibold text-foreground">No encontramos mascotas</h3>
                <p class="mt-2 text-sm text-muted-foreground">Intentá con otros filtros o volvé a intentar más tarde.</p>
                <button @click="applyFilters({ species: '', size: '', gender: '', search: '', sort: '' })"
                    class="mt-6 rounded-xl bg-[#2D6A4F] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#246142]">
                    Limpiar filtros
                </button>
            </div>

            <!-- Pet cards grid -->
            <div v-else class="grid gap-5 pb-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <a v-for="pet in pets" :key="pet.id"
                    :href="'/mascotas/' + pet.slug"
                    class="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5">
                    <!-- Photo -->
                    <div class="aspect-[4/3] overflow-hidden bg-muted/50">
                        <img v-if="pet.photos && pet.photos.length > 0"
                            :src="photoUrl(pet.photos[0])" :alt="pet.name" loading="lazy"
                            class="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                            @error="($event.target as HTMLImageElement).src = placeholderSrc" />
                        <div v-else class="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/80">
                            <component :is="speciesIcon(pet.species)" class="h-16 w-16 text-muted-foreground/25" />
                        </div>
                        <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <!-- Status badge -->
                        <div class="absolute left-3 top-3">
                            <span class="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#2D6A4F] shadow-sm backdrop-blur-sm">
                                {{ speciesLabel(pet.species) }}
                            </span>
                        </div>
                    </div>

                    <!-- Info -->
                    <div class="flex flex-1 flex-col p-4">
                        <div class="mb-2 flex items-start justify-between gap-2">
                            <h3 class="text-base font-semibold text-foreground group-hover:text-[#2D6A4F] transition-colors leading-snug">
                                {{ pet.name }}
                            </h3>
                            <span class="shrink-0 rounded-full bg-gradient-to-r from-[#2D6A4F] to-[#40916C] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow-sm">
                                {{ sizeLabel(pet.size) }}
                            </span>
                        </div>

                        <div class="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                            <span v-if="pet.breed" class="rounded-lg bg-muted/50 px-2 py-0.5 font-medium">{{ pet.breed }}</span>
                            <span class="rounded-lg bg-muted/50 px-2 py-0.5 font-medium">{{ formatAge(pet.age_years, pet.age_months) }}</span>
                            <span class="rounded-lg bg-muted/50 px-2 py-0.5 font-medium">{{ genderLabel(pet.gender) }}</span>
                        </div>

                        <div class="mt-auto pt-3 flex items-center gap-1.5 text-xs text-muted-foreground/70">
                            <MapPin class="h-3 w-3 shrink-0" />
                            <span class="truncate">{{ pet.team.name }}</span>
                            <template v-if="pet.team.city"> &middot; {{ pet.team.city }}</template>
                        </div>

                        <div class="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#2D6A4F] to-[#40916C] px-4 py-2 text-sm font-medium text-white shadow-md shadow-[#2D6A4F]/15 transition-all duration-200 group-hover:shadow-lg group-hover:shadow-[#2D6A4F]/25">
                            Conocer más
                            <ChevronRight class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </div>
                    </div>
                </a>
            </div>

            <!-- Pagination -->
            <div v-if="meta.last_page > 1" class="flex items-center justify-center gap-2 pb-16">
                <button v-if="meta.current_page > 1"
                    @click="applyFilters({ ...props.filters, page: String(meta.current_page - 1) })"
                    class="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground">
                    <ChevronLeft class="h-4 w-4" />
                </button>
                <template v-for="page in meta.last_page" :key="page">
                    <button v-if="page === 1 || page === meta.last_page || Math.abs(page - meta.current_page) <= 2"
                        @click="applyFilters({ ...props.filters, page: String(page) })"
                        class="flex h-10 min-w-[40px] items-center justify-center rounded-xl px-3 text-sm font-medium transition"
                        :class="page === meta.current_page
                            ? 'bg-gradient-to-r from-[#2D6A4F] to-[#40916C] text-white shadow-md shadow-[#2D6A4F]/20'
                            : 'border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'">
                        {{ page }}
                    </button>
                    <span v-else-if="Math.abs(page - meta.current_page) === 3"
                        class="flex h-10 w-10 items-center justify-center text-sm text-muted-foreground/50">...</span>
                </template>
                <button v-if="meta.current_page < meta.last_page"
                    @click="applyFilters({ ...props.filters, page: String(meta.current_page + 1) })"
                    class="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground">
                    <ChevronRight class="h-4 w-4" />
                </button>
            </div>
        </div>
    </div>
</template>
