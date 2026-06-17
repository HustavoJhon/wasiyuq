<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { usePhotoUrl } from '@/composables/usePhotoUrl';
import type { Team } from '@/types';
import { ref, computed } from 'vue';
import {
    Dog, Cat, Rabbit, Bird, PawPrint, Search,
    Filter, X, Plus, Pencil, Trash2, Eye, CalendarDays,
    ChevronLeft, ChevronRight,
} from 'lucide-vue-next';

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
    status: string;
    photos: string[] | null;
    created_at: string;
    team: { id: number; name: string; slug: string };
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
    currentTeam?: Team | null;
}>();

const { photoUrl } = usePhotoUrl();

const search = ref('');
const speciesFilter = ref('');
const statusFilter = ref('');

const filteredPets = computed(() => {
    return props.pets.filter(p => {
        if (search.value) {
            const q = search.value.toLowerCase();
            const matchName = p.name.toLowerCase().includes(q);
            const matchBreed = (p.breed || '').toLowerCase().includes(q);
            if (!matchName && !matchBreed) return false;
        }
        if (speciesFilter.value && p.species !== speciesFilter.value) return false;
        if (statusFilter.value && p.status !== statusFilter.value) return false;
        return true;
    });
});

const hasFilters = computed(() => search.value || speciesFilter.value || statusFilter.value);

function clearFilters() {
    search.value = '';
    speciesFilter.value = '';
    statusFilter.value = '';
}

const stats = computed(() => ({
    total: props.pets.length,
    available: props.pets.filter(p => p.status === 'available').length,
    adopted: props.pets.filter(p => p.status === 'adopted').length,
    inProcess: props.pets.filter(p => p.status === 'in_process').length,
}));

function speciesLabel(s: string): string {
    const labels: Record<string, string> = { dog: 'Perro', cat: 'Gato', rabbit: 'Conejo', bird: 'Ave', other: 'Otro' };
    return labels[s] ?? s;
}

function speciesIcon(s: string) {
    const icons: Record<string, any> = { dog: Dog, cat: Cat, rabbit: Rabbit, bird: Bird };
    return icons[s] ?? PawPrint;
}

function statusLabel(s: string): string {
    const labels: Record<string, string> = { available: 'Disponible', adopted: 'Adoptado', in_process: 'En Proceso', withheld: 'Reservado' };
    return labels[s] ?? s;
}

function statusClass(s: string): string {
    return s === 'available' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
        : s === 'adopted' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
        : s === 'in_process' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
}

function sizeLabel(s: string): string {
    const labels: Record<string, string> = { small: 'Pequeño', medium: 'Mediano', large: 'Grande' };
    return labels[s] ?? s;
}

function genderLabel(g: string): string {
    return g === 'male' ? 'Macho' : 'Hembra';
}

function formatDate(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d));
}

function destroy(id: number): void {
    if (confirm('¿Eliminar esta mascota?')) {
        router.delete(`/${props.currentTeam?.slug}/mascotas/${id}`);
    }
}

const slug = computed(() => props.currentTeam?.slug ?? '');
</script>

<template>
    <div class="mx-auto max-w-6xl">
        <!-- Header -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl font-bold text-foreground">Mascotas</h1>
                <p class="mt-1 text-sm text-muted-foreground">
                    Mascotas registradas en {{ currentTeam?.name }}
                </p>
            </div>
            <a :href="`/${slug}/mascotas/crear`"
                class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2D6A4F] to-[#40916C] px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-[#2D6A4F]/20 transition-all hover:shadow-lg hover:shadow-[#2D6A4F]/30 hover:-translate-y-0.5">
                <Plus class="h-4 w-4" />
                Nueva Mascota
            </a>
        </div>

        <!-- Stats cards -->
        <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div class="rounded-xl border border-border/50 bg-card p-4">
                <p class="text-xs font-medium text-muted-foreground/70 uppercase tracking-wide">Total</p>
                <p class="mt-1 text-2xl font-bold text-foreground">{{ stats.total }}</p>
            </div>
            <div class="rounded-xl border border-emerald-200/60 bg-emerald-50/30 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20">
                <p class="text-xs font-medium text-emerald-700/70 dark:text-emerald-400/70 uppercase tracking-wide">Disponibles</p>
                <p class="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-400">{{ stats.available }}</p>
            </div>
            <div class="rounded-xl border border-amber-200/60 bg-amber-50/30 p-4 dark:border-amber-900/30 dark:bg-amber-950/20">
                <p class="text-xs font-medium text-amber-700/70 dark:text-amber-400/70 uppercase tracking-wide">En Proceso</p>
                <p class="mt-1 text-2xl font-bold text-amber-700 dark:text-amber-400">{{ stats.inProcess }}</p>
            </div>
            <div class="rounded-xl border border-blue-200/60 bg-blue-50/30 p-4 dark:border-blue-900/30 dark:bg-blue-950/20">
                <p class="text-xs font-medium text-blue-700/70 dark:text-blue-400/70 uppercase tracking-wide">Adoptados</p>
                <p class="mt-1 text-2xl font-bold text-blue-700 dark:text-blue-400">{{ stats.adopted }}</p>
            </div>
        </div>

        <!-- Search + filters -->
        <div class="mt-6 rounded-xl border border-border/50 bg-card p-3">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div class="relative flex-1">
                    <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                    <input v-model="search" type="text" placeholder="Buscar por nombre o raza..."
                        class="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder-muted-foreground/50 outline-none transition focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]" />
                </div>
                <div class="flex items-center gap-2">
                    <select v-model="speciesFilter"
                        class="rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground outline-none transition focus:border-[#2D6A4F]">
                        <option value="">Todas las especies</option>
                        <option value="dog">Perros</option>
                        <option value="cat">Gatos</option>
                        <option value="rabbit">Conejos</option>
                        <option value="bird">Aves</option>
                    </select>
                    <select v-model="statusFilter"
                        class="rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground outline-none transition focus:border-[#2D6A4F]">
                        <option value="">Todos los estados</option>
                        <option value="available">Disponible</option>
                        <option value="in_process">En Proceso</option>
                        <option value="adopted">Adoptado</option>
                        <option value="withheld">Reservado</option>
                    </select>
                    <button v-if="hasFilters" @click="clearFilters"
                        class="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950">
                        <X class="h-4 w-4" />
                        <span class="hidden sm:inline">Limpiar</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Desktop table (hidden on mobile) -->
        <div class="mt-6 hidden sm:block overflow-hidden rounded-xl border border-border/50 bg-card">
            <table class="w-full text-left text-sm">
                <thead class="border-b border-border/50 bg-muted text-xs font-medium text-muted-foreground uppercase">
                    <tr>
                        <th class="px-5 py-3">Mascota</th>
                        <th class="px-5 py-3">Especie</th>
                        <th class="px-5 py-3">Estado</th>
                        <th class="px-5 py-3">Raza</th>
                        <th class="px-5 py-3">Registro</th>
                        <th class="px-5 py-3">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-border/50">
                    <tr v-for="pet in filteredPets" :key="pet.id" class="hover:bg-muted/50 transition-colors">
                        <td class="px-5 py-3.5">
                            <div class="flex items-center gap-3">
                                <div class="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                                    <img v-if="pet.photos && pet.photos.length > 0"
                                        :src="photoUrl(pet.photos[0])" :alt="pet.name"
                                        class="h-full w-full object-cover" />
                                    <div v-else class="flex h-full items-center justify-center text-muted-foreground/30">
                                        <component :is="speciesIcon(pet.species)" class="h-5 w-5" />
                                    </div>
                                </div>
                                <span class="font-medium text-foreground">{{ pet.name }}</span>
                            </div>
                        </td>
                        <td class="px-5 py-3.5 text-muted-foreground">{{ speciesLabel(pet.species) }}</td>
                        <td class="px-5 py-3.5">
                            <span class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium" :class="statusClass(pet.status)">
                                {{ statusLabel(pet.status) }}
                            </span>
                        </td>
                        <td class="px-5 py-3.5 text-muted-foreground">{{ pet.breed || '—' }}</td>
                        <td class="px-5 py-3.5 text-xs text-muted-foreground/70">{{ formatDate(pet.created_at) }}</td>
                        <td class="px-5 py-3.5">
                            <div class="flex items-center gap-1.5">
                                <a :href="`/${slug}/mascotas/${pet.id}`"
                                    class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#2D6A4F] transition hover:bg-[#2D6A4F]/10">
                                    <Eye class="h-3.5 w-3.5" />
                                    Ver
                                </a>
                                <a :href="`/${slug}/mascotas/${pet.id}/editar`"
                                    class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
                                    <Pencil class="h-3.5 w-3.5" />
                                    Editar
                                </a>
                                <button @click="destroy(pet.id)"
                                    class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950">
                                    <Trash2 class="h-3.5 w-3.5" />
                                    Eliminar
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="filteredPets.length === 0">
                        <td colspan="6" class="px-5 py-12 text-center">
                            <PawPrint class="mx-auto h-10 w-10 text-muted-foreground/30" />
                            <p class="mt-3 text-muted-foreground">
                                {{ hasFilters ? 'No se encontraron mascotas con esos filtros.' : 'No hay mascotas registradas.' }}
                            </p>
                            <button v-if="hasFilters" @click="clearFilters"
                                class="mt-3 rounded-lg bg-[#2D6A4F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#246142]">
                                Limpiar filtros
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Mobile card list (hidden on desktop) -->
        <div class="mt-6 grid gap-4 sm:hidden">
            <div v-if="filteredPets.length === 0" class="flex flex-col items-center py-12">
                <PawPrint class="h-10 w-10 text-muted-foreground/30" />
                <p class="mt-3 text-muted-foreground">
                    {{ hasFilters ? 'No se encontraron mascotas con esos filtros.' : 'No hay mascotas registradas.' }}
                </p>
                <button v-if="hasFilters" @click="clearFilters"
                    class="mt-3 rounded-lg bg-[#2D6A4F] px-4 py-2 text-sm font-medium text-white">
                    Limpiar filtros
                </button>
            </div>

            <div v-for="pet in filteredPets" :key="pet.id"
                class="overflow-hidden rounded-xl border border-border/50 bg-card">
                <div class="flex items-center gap-3 p-4">
                    <div class="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                        <img v-if="pet.photos && pet.photos.length > 0"
                            :src="photoUrl(pet.photos[0])" :alt="pet.name"
                            class="h-full w-full object-cover" />
                        <div v-else class="flex h-full items-center justify-center text-muted-foreground/30">
                            <component :is="speciesIcon(pet.species)" class="h-6 w-6" />
                        </div>
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-2">
                            <h3 class="font-semibold text-foreground truncate">{{ pet.name }}</h3>
                            <span class="inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium" :class="statusClass(pet.status)">
                                {{ statusLabel(pet.status) }}
                            </span>
                        </div>
                        <p class="mt-0.5 text-xs text-muted-foreground">
                            {{ speciesLabel(pet.species) }} · {{ pet.breed || sizeLabel(pet.size) }} · {{ formatDate(pet.created_at) }}
                        </p>
                    </div>
                </div>
                <div class="flex border-t border-border/50">
                    <a :href="`/${slug}/mascotas/${pet.id}`"
                        class="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-[#2D6A4F] transition hover:bg-[#2D6A4F]/5">
                        <Eye class="h-3.5 w-3.5" /> Ver
                    </a>
                    <a :href="`/${slug}/mascotas/${pet.id}/editar`"
                        class="flex flex-1 items-center justify-center gap-1.5 border-x border-border/50 py-2.5 text-xs font-medium text-muted-foreground transition hover:bg-muted">
                        <Pencil class="h-3.5 w-3.5" /> Editar
                    </a>
                    <button @click="destroy(pet.id)"
                        class="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950">
                        <Trash2 class="h-3.5 w-3.5" /> Eliminar
                    </button>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <div v-if="meta.last_page > 1" class="mt-6 flex items-center justify-center gap-2">
            <button v-if="meta.current_page > 1"
                @click="router.get(`/${slug}/mascotas?page=${meta.current_page - 1}`)"
                class="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:bg-muted">
                <ChevronLeft class="h-4 w-4" />
            </button>
            <template v-for="page in meta.last_page" :key="page">
                <button v-if="page === 1 || page === meta.last_page || Math.abs(page - meta.current_page) <= 2"
                    @click="router.get(`/${slug}/mascotas?page=${page}`)"
                    class="flex h-9 min-w-[36px] items-center justify-center rounded-lg px-3 text-sm font-medium transition"
                    :class="page === meta.current_page
                        ? 'bg-[#2D6A4F] text-white shadow-sm'
                        : 'border border-border bg-card text-muted-foreground hover:bg-muted'">
                    {{ page }}
                </button>
                <span v-else-if="Math.abs(page - meta.current_page) === 3"
                    class="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground/50">...</span>
            </template>
            <button v-if="meta.current_page < meta.last_page"
                @click="router.get(`/${slug}/mascotas?page=${meta.current_page + 1}`)"
                class="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:bg-muted">
                <ChevronRight class="h-4 w-4" />
            </button>
        </div>
    </div>
</template>
