<script setup lang="ts">
import { PawPrint, Search, MapPin, Calendar, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { usePhotoUrl } from '@/composables/usePhotoUrl';

const { photoUrl } = usePhotoUrl();

interface LostPet {
    id: number;
    name: string | null;
    species: string;
    breed: string | null;
    color: string | null;
    description: string | null;
    last_seen_location: string;
    last_seen_date: string;
    photos: string[] | null;
    status: 'lost' | 'found';
    is_resolved: boolean;
    created_at: string;
}

interface Meta {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

defineProps<{ pets: LostPet[]; meta: Meta }>();

function speciesLabel(s: string): string {
    return { dog: 'Perro', cat: 'Gato', rabbit: 'Conejo', bird: 'Ave', other: 'Otro' }[s] ?? s;
}

function statusLabel(s: string): string {
    return s === 'lost' ? 'Perdido' : 'Encontrado';
}

function statusColor(s: string): string {
    return s === 'lost' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700';
}

function formatDate(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'long' }).format(new Date(d));
}

const placeholderSrc = 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#e5e7eb"/><g transform="translate(200,150)"><circle cx="0" cy="-20" r="40" fill="#d1d5db"/><ellipse cx="-25" cy="15" rx="20" ry="25" fill="#d1d5db"/><ellipse cx="25" cy="15" rx="20" ry="25" fill="#d1d5db"/></g></svg>');
</script>

<template>
    <div class="mx-auto max-w-5xl">
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-foreground">Mis mascotas perdidas</h1>
            <p class="mt-1 text-sm text-muted-foreground">Reportes de mascotas perdidas que hiciste desde tu cuenta.</p>
        </div>

        <div v-if="pets.length === 0" class="mt-8 flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-card py-16">
            <Search class="h-16 w-16 text-muted-foreground/20" />
            <h3 class="mt-4 text-lg font-semibold text-foreground">No tenés mascotas perdidas reportadas</h3>
            <p class="mt-1 text-sm text-muted-foreground">Si perdiste una mascota, reportala desde la sección pública.</p>
            <a href="/mascotas-perdidas" class="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#DC2626] to-[#EF4444] px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-red-500/20">
                Ir a mascotas perdidas
            </a>
        </div>

        <div v-else class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <a v-for="pet in pets" :key="pet.id"
                :href="'/mascotas-perdidas/' + pet.id"
                class="group overflow-hidden rounded-xl border border-border/50 bg-card transition hover:-translate-y-1 hover:shadow-lg">
                <div class="aspect-[4/3] overflow-hidden bg-muted/50">
                    <img v-if="pet.photos?.length" :src="photoUrl(pet.photos[0])" :alt="pet.name ?? 'Mascota'"
                        class="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        @error="($event.target as HTMLImageElement).src = placeholderSrc" />
                    <div v-else class="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/80">
                        <PawPrint class="h-12 w-12 text-muted-foreground/25" />
                    </div>
                    <div class="absolute left-3 top-3 flex gap-1.5">
                        <span class="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase shadow-sm"
                            :class="pet.status === 'lost' ? 'bg-red-500/90 text-white' : 'bg-emerald-500/90 text-white'">
                            {{ statusLabel(pet.status) }}
                        </span>
                        <span class="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-red-600">
                            {{ speciesLabel(pet.species) }}
                        </span>
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="font-semibold text-foreground">{{ pet.name ?? speciesLabel(pet.species) + ' perdido' }}</h3>
                    <div class="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground/60">
                        <MapPin class="h-3 w-3 shrink-0" />
                        <span class="truncate">{{ pet.last_seen_location }}</span>
                    </div>
                    <div class="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground/50">
                        <Calendar class="h-3 w-3 shrink-0" />
                        <span>{{ formatDate(pet.last_seen_date) }}</span>
                    </div>
                </div>
            </a>
        </div>

        <div v-if="meta.last_page > 1" class="mt-6 flex items-center justify-center gap-2">
            <a v-if="meta.current_page > 1" :href="'/mi-adopcion/mascotas-perdidas?page=' + (meta.current_page - 1)"
                class="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted">
                <ChevronLeft class="h-4 w-4" />
            </a>
            <template v-for="page in meta.last_page" :key="page">
                <a v-if="page === 1 || page === meta.last_page || Math.abs(page - meta.current_page) <= 2"
                    :href="'/mi-adopcion/mascotas-perdidas?page=' + page"
                    class="flex h-9 min-w-[36px] items-center justify-center rounded-lg px-3 text-sm font-medium"
                    :class="page === meta.current_page ? 'bg-[#2D6A4F] text-white' : 'border border-border bg-card text-muted-foreground hover:bg-muted'">
                    {{ page }}
                </a>
                <span v-else-if="Math.abs(page - meta.current_page) === 3" class="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground/50">...</span>
            </template>
            <a v-if="meta.current_page < meta.last_page" :href="'/mi-adopcion/mascotas-perdidas?page=' + (meta.current_page + 1)"
                class="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted">
                <ChevronRight class="h-4 w-4" />
            </a>
        </div>
    </div>
</template>
