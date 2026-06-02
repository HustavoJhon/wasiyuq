<script setup lang="ts">
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
    if (years > 0) {
        return years + ' año' + (years > 1 ? 's' : '');
    }

    if (months > 0) {
        return months + ' mes' + (months > 1 ? 'es' : '');
    }

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
    const labels: Record<string, string> = { male: 'Macho', female: 'Hembra' };

    return labels[gender] ?? gender;
}
</script>

<template>
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="text-center">
            <h1
                class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
                Mascotas en adopción en Cusco
            </h1>
            <p class="mt-3 text-muted-foreground">
                Encuentra a tu compañero ideal. Todos esperan un hogar lleno de
                amor.
            </p>
        </div>

        <div class="mt-8 flex flex-wrap items-center gap-3">
            <span class="text-sm font-medium text-foreground"
                >Filtrar por:</span
            >
            <select
                :value="props.filters.species"
                @change="
                    (e) =>
                        updateFilters(
                            'species',
                            (e.target as HTMLSelectElement).value,
                        )
                "
                class="rounded-xl border border-border bg-card px-4 py-2 text-sm text-muted-foreground outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
            >
                <option value="">Especie</option>
                <option value="dog">Perro</option>
                <option value="cat">Gato</option>
                <option value="rabbit">Conejo</option>
                <option value="bird">Ave</option>
            </select>
            <select
                :value="props.filters.size"
                @change="
                    (e) =>
                        updateFilters(
                            'size',
                            (e.target as HTMLSelectElement).value,
                        )
                "
                class="rounded-xl border border-border bg-card px-4 py-2 text-sm text-muted-foreground outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
            >
                <option value="">Tamaño</option>
                <option value="small">Pequeño</option>
                <option value="medium">Mediano</option>
                <option value="large">Grande</option>
            </select>
            <select
                :value="props.filters.gender"
                @change="
                    (e) =>
                        updateFilters(
                            'gender',
                            (e.target as HTMLSelectElement).value,
                        )
                "
                class="rounded-xl border border-border bg-card px-4 py-2 text-sm text-muted-foreground outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
            >
                <option value="">Sexo</option>
                <option value="female">Hembra</option>
                <option value="male">Macho</option>
            </select>
        </div>

        <div v-if="pets.length === 0" class="mt-16 text-center">
            <p class="text-muted-foreground/70">
                No se encontraron mascotas con los filtros seleccionados.
            </p>
        </div>

        <div v-else class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div
                v-for="pet in pets"
                :key="pet.id"
                class="group overflow-hidden rounded-2xl border border-border bg-card transition hover:shadow-lg hover:shadow-black/5"
            >
                <div
                    v-if="pet.photos && pet.photos.length > 0"
                    class="aspect-[4/3] overflow-hidden"
                >
                    <img
                        :src="'/storage/' + pet.photos[0]"
                        :alt="pet.name"
                        class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                </div>
                <div
                    v-else
                    class="aspect-[4/3] bg-gradient-to-br from-muted to-muted/80"
                />
                <div class="p-5">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-foreground">
                            {{ pet.name }}
                        </h3>
                        <span
                            class="rounded-full bg-[#2D6A4F]/10 px-3 py-0.5 text-xs font-medium text-[#2D6A4F]"
                            >{{ speciesLabel(pet.species) }}</span
                        >
                    </div>
                    <div
                        class="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground"
                    >
                        <span
                            v-if="pet.breed"
                            class="rounded-md bg-muted px-2 py-1"
                            >{{ pet.breed }}</span
                        >
                        <span class="rounded-md bg-muted px-2 py-1">{{
                            formatAge(pet.age_years, pet.age_months)
                        }}</span>
                        <span class="rounded-md bg-muted px-2 py-1">{{
                            sizeLabel(pet.size)
                        }}</span>
                        <span class="rounded-md bg-muted px-2 py-1">{{
                            genderLabel(pet.gender)
                        }}</span>
                    </div>
                    <p class="mt-3 text-xs text-muted-foreground/70">
                        {{ pet.team.name }} &middot;
                        {{ pet.team.city ?? pet.team.state ?? '' }}
                    </p>
                    <a
                        :href="'/mascotas/' + pet.slug"
                        class="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#2D6A4F] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#246142]"
                        >Conocer más</a
                    >
                </div>
            </div>
        </div>

        <div v-if="meta.last_page > 1" class="mt-12 flex justify-center gap-2">
            <a
                v-for="page in meta.last_page"
                :key="page"
                :href="'/mascotas?page=' + page"
                class="rounded-xl px-4 py-2 text-sm"
                :class="
                    page === meta.current_page
                        ? 'bg-[#2D6A4F] text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                "
                >{{ page }}</a
            >
        </div>
    </div>
</template>
