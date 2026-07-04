<script setup lang="ts">
import { PawPrint, Plus, ChevronLeft, ChevronRight, Search } from 'lucide-vue-next';
import { usePhotoUrl } from '@/composables/usePhotoUrl';

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
    status: string;
    photos: string[] | null;
    team: { id: number; name: string; slug: string } | null;
}

interface Meta {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

defineProps<{ pets: Pet[]; meta: Meta }>();

function speciesLabel(s: string): string {
    return { dog: 'Perro', cat: 'Gato', rabbit: 'Conejo', bird: 'Ave', other: 'Otro' }[s] ?? s;
}

function statusLabel(s: string): string {
    return { available: 'Disponible', in_process: 'En proceso', adopted: 'Adoptado', withheld: 'Reservado' }[s] ?? s;
}

function formatAge(y: number, m: number): string {
    if (y > 0) return `${y} ${y > 1 ? 'años' : 'año'}`;
    if (m > 0) return `${m} ${m > 1 ? 'meses' : 'mes'}`;
    return 'Cachorro';
}

const placeholderSrc = 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#e5e7eb"/><g transform="translate(200,150)"><circle cx="0" cy="-20" r="40" fill="#d1d5db"/><ellipse cx="-25" cy="15" rx="20" ry="25" fill="#d1d5db"/><ellipse cx="25" cy="15" rx="20" ry="25" fill="#d1d5db"/></g></svg>');
</script>

<template>
    <div class="mx-auto max-w-5xl">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-foreground">Mis Mascotas</h1>
                <p class="mt-1 text-sm text-muted-foreground">Mascotas que has publicado en adopción.</p>
            </div>
            <a href="/mi-adopcion/mascotas/publicar"
                class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2D6A4F] to-[#40916C] px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-[#2D6A4F]/20 transition hover:from-[#246142] hover:to-[#347D5A]">
                <Plus class="h-4 w-4" />
                Publicar mascota
            </a>
        </div>

        <div v-if="pets.length === 0" class="mt-12 flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-card py-16">
            <PawPrint class="h-16 w-16 text-muted-foreground/20" />
            <h3 class="mt-4 text-lg font-semibold text-foreground">No has publicado mascotas</h3>
            <p class="mt-1 text-sm text-muted-foreground">Publicá tu primera mascota en adopción.</p>
            <a href="/mi-adopcion/mascotas/publicar"
                class="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2D6A4F] to-[#40916C] px-5 py-2.5 text-sm font-medium text-white">
                <Plus class="h-4 w-4" /> Publicar mascota
            </a>
        </div>

        <div v-else class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <a v-for="pet in pets" :key="pet.id"
                :href="'/mascotas/' + pet.slug"
                class="group overflow-hidden rounded-xl border border-border/50 bg-card transition hover:-translate-y-1 hover:shadow-lg">
                <div class="aspect-[4/3] overflow-hidden bg-muted/50">
                    <img v-if="pet.photos?.length" :src="photoUrl(pet.photos[0])" :alt="pet.name"
                        class="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        @error="($event.target as HTMLImageElement).src = placeholderSrc" />
                    <div v-else class="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/80">
                        <PawPrint class="h-12 w-12 text-muted-foreground/25" />
                    </div>
                    <span class="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold text-[#2D6A4F]">
                        {{ speciesLabel(pet.species) }}
                    </span>
                </div>
                <div class="p-4">
                    <h3 class="font-semibold text-foreground">{{ pet.name }}</h3>
                    <div class="mt-1 flex flex-wrap gap-1 text-xs text-muted-foreground">
                        <span v-if="pet.breed" class="rounded-md bg-muted/50 px-1.5 py-0.5">{{ pet.breed }}</span>
                        <span class="rounded-md bg-muted/50 px-1.5 py-0.5">{{ formatAge(pet.age_years, pet.age_months) }}</span>
                    </div>
                </div>
            </a>
        </div>

        <div v-if="meta.last_page > 1" class="mt-6 flex items-center justify-center gap-2">
            <a v-if="meta.current_page > 1" :href="'/mi-adopcion/mascotas?page=' + (meta.current_page - 1)"
                class="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted">
                <ChevronLeft class="h-4 w-4" />
            </a>
            <template v-for="page in meta.last_page" :key="page">
                <a v-if="page === 1 || page === meta.last_page || Math.abs(page - meta.current_page) <= 2"
                    :href="'/mi-adopcion/mascotas?page=' + page"
                    class="flex h-9 min-w-[36px] items-center justify-center rounded-lg px-3 text-sm font-medium"
                    :class="page === meta.current_page ? 'bg-[#2D6A4F] text-white' : 'border border-border bg-card text-muted-foreground hover:bg-muted'">
                    {{ page }}
                </a>
                <span v-else-if="Math.abs(page - meta.current_page) === 3" class="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground/50">...</span>
            </template>
            <a v-if="meta.current_page < meta.last_page" :href="'/mi-adopcion/mascotas?page=' + (meta.current_page + 1)"
                class="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted">
                <ChevronRight class="h-4 w-4" />
            </a>
        </div>
    </div>
</template>
