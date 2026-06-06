<script setup lang="ts">
import {
    Dog,
    Cat,
    Rabbit,
    Bird,
    Search,
    PawPrint,
    MapPin,
    ChevronLeft,
    ChevronRight,
} from 'lucide-vue-next';
import { computed } from 'vue';

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
    team: {
        id: number;
        name: string;
        slug: string;
        city: string | null;
        state: string | null;
    };
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
    filters: {
        species?: string;
        size?: string;
        gender?: string;
        search?: string;
    };
}>();

const emit = defineEmits<{
    updateFilters: [
        filters: {
            species?: string;
            size?: string;
            gender?: string;
            search?: string;
        },
    ];
}>();

function updateFilters(field: string, value: string) {
    emit('updateFilters', { ...props.filters, [field]: value });
}

function formatAge(years: number, months: number): string {
    if (years > 0) return `${years} ${years > 1 ? 'años' : 'año'}`;
    if (months > 0) return `${months} ${months > 1 ? 'meses' : 'mes'}`;
    return 'Cachorro';
}

function speciesLabel(species: string): string {
    const labels: Record<string, string> = {
        dog: 'Perro',
        cat: 'Gato',
        rabbit: 'Conejo',
        bird: 'Ave',
        other: 'Otro',
    };
    return labels[species] ?? species;
}

function sizeLabel(size: string): string {
    const labels: Record<string, string> = {
        small: 'Pequeño',
        medium: 'Mediano',
        large: 'Grande',
    };
    return labels[size] ?? size;
}

function genderLabel(gender: string): string {
    return gender === 'male' ? 'Macho' : 'Hembra';
}

const speciesIcon = computed(() => (species: string) => {
    const icons: Record<string, any> = {
        dog: Dog,
        cat: Cat,
        rabbit: Rabbit,
        bird: Bird,
    };
    return icons[species] ?? PawPrint;
});

const filterOptions = {
    species: [
        { value: '', label: 'Todas' },
        { value: 'dog', label: 'Perros' },
        { value: 'cat', label: 'Gatos' },
        { value: 'rabbit', label: 'Conejos' },
        { value: 'bird', label: 'Aves' },
    ],
    size: [
        { value: '', label: 'Cualquier tamaño' },
        { value: 'small', label: 'Pequeño' },
        { value: 'medium', label: 'Mediano' },
        { value: 'large', label: 'Grande' },
    ],
    gender: [
        { value: '', label: 'Cualquier sexo' },
        { value: 'female', label: 'Hembra' },
        { value: 'male', label: 'Macho' },
    ],
};

const placeholderSrc =
    'data:image/svg+xml;base64,' +
    btoa(
        '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#e5e7eb"/><g transform="translate(200,150)"><circle cx="0" cy="-20" r="40" fill="#d1d5db"/><ellipse cx="-25" cy="15" rx="20" ry="25" fill="#d1d5db"/><ellipse cx="25" cy="15" rx="20" ry="25" fill="#d1d5db"/></g></svg>',
    );
</script>

<template>
    <div class="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <section
            class="relative overflow-hidden bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#40916C] px-4 pb-20 pt-24 sm:px-6 lg:px-8"
        >
            <div
                class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"
            />
            <div
                class="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-white/5 blur-3xl"
            />
            <div
                class="absolute bottom-0 left-0 -mb-20 -ml-20 h-96 w-96 rounded-full bg-white/5 blur-3xl"
            />

            <div class="relative mx-auto max-w-7xl">
                <div class="mx-auto max-w-2xl text-center">
                    <div
                        class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 shadow-lg backdrop-blur-sm"
                    >
                        <PawPrint class="h-8 w-8 text-white" />
                    </div>
                    <h1
                        class="text-4xl font-bold tracking-tight text-white sm:text-5xl"
                    >
                        Mascotas en adopción
                    </h1>
                    <p class="mt-4 text-lg text-green-100/80">
                        {{ meta.total }} mascotas esperan un hogar lleno de amor
                        en Cusco
                    </p>

                    <div
                        class="mx-auto mt-8 flex max-w-lg items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-1 backdrop-blur-md focus-within:border-white/30 focus-within:bg-white/15"
                    >
                        <Search class="h-5 w-5 shrink-0 text-green-100/60" />
                        <input
                            type="text"
                            :value="filters.search"
                            @input="
                                updateFilters(
                                    'search',
                                    ($event.target as HTMLInputElement).value,
                                )
                            "
                            placeholder="Buscar por nombre, raza..."
                            class="h-12 w-full border-0 bg-transparent text-white placeholder-green-100/50 outline-none"
                        />
                    </div>
                </div>
            </div>
        </section>

        <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
                class="-mt-8 mb-8 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-border/50 bg-card/80 p-3 shadow-lg backdrop-blur-xl sm:gap-3"
            >
                <button
                    v-for="opt in filterOptions.species"
                    :key="opt.value"
                    @click="updateFilters('species', opt.value)"
                    class="rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200"
                    :class="
                        (filters.species || '') === opt.value
                            ? 'bg-[#2D6A4F] text-white shadow-md shadow-[#2D6A4F]/20'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    "
                >
                    <component
                        :is="speciesIcon(opt.value)"
                        v-if="opt.value"
                        class="mr-1.5 inline-block h-4 w-4"
                    />
                    {{ opt.label }}
                </button>

                <span
                    class="mx-1 hidden h-6 w-px bg-border sm:block"
                />

                <select
                    :value="filters.size || ''"
                    @change="
                        updateFilters(
                            'size',
                            ($event.target as HTMLSelectElement).value,
                        )
                    "
                    class="rounded-xl border border-border bg-transparent px-3 py-2 text-sm text-muted-foreground outline-none transition focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                >
                    <option
                        v-for="opt in filterOptions.size"
                        :key="opt.value"
                        :value="opt.value"
                    >
                        {{ opt.label }}
                    </option>
                </select>

                <select
                    :value="filters.gender || ''"
                    @change="
                        updateFilters(
                            'gender',
                            ($event.target as HTMLSelectElement).value,
                        )
                    "
                    class="rounded-xl border border-border bg-transparent px-3 py-2 text-sm text-muted-foreground outline-none transition focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                >
                    <option
                        v-for="opt in filterOptions.gender"
                        :key="opt.value"
                        :value="opt.value"
                    >
                        {{ opt.label }}
                    </option>
                </select>

                <button
                    v-if="filters.species || filters.size || filters.gender || filters.search"
                    @click="
                        emit('updateFilters', {
                            species: '',
                            size: '',
                            gender: '',
                            search: '',
                        })
                    "
                    class="rounded-xl px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                >
                    Limpiar
                </button>
            </div>

            <div
                v-if="pets.length === 0"
                class="flex flex-col items-center justify-center py-24"
            >
                <div
                    class="flex h-24 w-24 items-center justify-center rounded-full bg-muted"
                >
                    <Search class="h-10 w-10 text-muted-foreground/50" />
                </div>
                <h3 class="mt-6 text-lg font-semibold text-foreground">
                    No encontramos mascotas
                </h3>
                <p class="mt-2 text-sm text-muted-foreground">
                    Intentá con otros filtros o volvé a intentar más tarde.
                </p>
                <button
                    @click="
                        emit('updateFilters', {
                            species: '',
                            size: '',
                            gender: '',
                            search: '',
                        })
                    "
                    class="mt-6 rounded-xl bg-[#2D6A4F] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#246142]"
                >
                    Limpiar filtros
                </button>
            </div>

            <div
                v-else
                class="grid gap-6 pb-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
                <a
                    v-for="pet in pets"
                    :key="pet.id"
                    :href="'/mascotas/' + pet.slug"
                    class="group relative overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5"
                >
                    <div class="aspect-[4/3] overflow-hidden">
                        <img
                            v-if="pet.photos && pet.photos.length > 0"
                            :src="'/storage/' + pet.photos[0]"
                            :alt="pet.name"
                            loading="lazy"
                            class="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                            @error="
                                ($event.target as HTMLImageElement).src =
                                    placeholderSrc
                            "
                        />
                        <div
                            v-else
                            class="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/80"
                        >
                            <component
                                :is="speciesIcon(pet.species)"
                                class="h-16 w-16 text-muted-foreground/30"
                            />
                        </div>
                        <div
                            class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        />
                        <div
                            class="absolute right-3 top-3 flex gap-1.5 opacity-0 transition-all duration-300 group-hover:opacity-100"
                        >
                            <span
                                class="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#2D6A4F] shadow-lg backdrop-blur-sm"
                            >
                                {{ speciesLabel(pet.species) }}
                            </span>
                        </div>
                    </div>

                    <div class="p-5">
                        <div class="flex items-start justify-between gap-2">
                            <h3
                                class="text-lg font-semibold text-foreground group-hover:text-[#2D6A4F]"
                            >
                                {{ pet.name }}
                            </h3>
                            <span
                                class="shrink-0 rounded-full bg-gradient-to-r from-[#2D6A4F] to-[#40916C] px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow-sm"
                            >
                                {{ sizeLabel(pet.size) }}
                            </span>
                        </div>

                        <div
                            class="mt-3 flex flex-wrap gap-1.5 text-xs text-muted-foreground"
                        >
                            <span
                                v-if="pet.breed"
                                class="rounded-lg bg-muted px-2.5 py-1 font-medium"
                            >
                                {{ pet.breed }}
                            </span>
                            <span
                                class="rounded-lg bg-muted px-2.5 py-1 font-medium"
                            >
                                {{ formatAge(pet.age_years, pet.age_months) }}
                            </span>
                            <span
                                class="rounded-lg bg-muted px-2.5 py-1 font-medium"
                            >
                                {{ genderLabel(pet.gender) }}
                            </span>
                        </div>

                        <div
                            class="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground/70"
                        >
                            <MapPin class="h-3.5 w-3.5" />
                            {{ pet.team.name }}
                            <template
                                v-if="pet.team.city || pet.team.state"
                            >
                                &middot;
                                {{ pet.team.city ?? pet.team.state }}
                            </template>
                        </div>

                        <div
                            class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2D6A4F] to-[#40916C] px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-[#2D6A4F]/20 transition-all duration-200 group-hover:shadow-lg group-hover:shadow-[#2D6A4F]/30"
                        >
                            Conocer más
                            <ChevronRight class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </div>
                    </div>
                </a>
            </div>

            <div
                v-if="meta.last_page > 1"
                class="flex items-center justify-center gap-2 pb-16"
            >
                <a
                    v-if="meta.current_page > 1"
                    :href="'/mascotas?page=' + (meta.current_page - 1)"
                    class="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                    <ChevronLeft class="h-4 w-4" />
                </a>

                <template v-for="page in meta.last_page" :key="page">
                    <span
                        v-if="
                            page === 1 ||
                            page === meta.last_page ||
                            Math.abs(page - meta.current_page) <= 2
                        "
                        :href="'/mascotas?page=' + page"
                        class="flex h-10 min-w-[40px] items-center justify-center rounded-xl px-3 text-sm font-medium transition"
                        :class="
                            page === meta.current_page
                                ? 'bg-gradient-to-r from-[#2D6A4F] to-[#40916C] text-white shadow-md shadow-[#2D6A4F]/20'
                                : 'border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
                        "
                    >
                        {{ page }}
                    </span>
                    <span
                        v-else-if="
                            Math.abs(page - meta.current_page) === 3
                        "
                        class="flex h-10 w-10 items-center justify-center text-sm text-muted-foreground/50"
                    >
                        ...
                    </span>
                </template>

                <a
                    v-if="meta.current_page < meta.last_page"
                    :href="'/mascotas?page=' + (meta.current_page + 1)"
                    class="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                    <ChevronRight class="h-4 w-4" />
                </a>
            </div>
        </section>
    </div>
</template>
