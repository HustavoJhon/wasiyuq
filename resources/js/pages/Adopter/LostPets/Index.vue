<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { PawPrint, Search, MapPin, Calendar, ChevronLeft, ChevronRight, Edit, Trash2, CheckCircle2 } from 'lucide-vue-next';
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

interface Meta { current_page: number; last_page: number; total: number; per_page: number; }

defineProps<{ pets: LostPet[]; meta: Meta }>();

function speciesLabel(s: string): string { return { dog: 'Perro', cat: 'Gato', rabbit: 'Conejo', bird: 'Ave', other: 'Otro' }[s] ?? s; }
function statusLabel(s: string): string { return s === 'lost' ? 'Perdido' : 'Encontrado'; }
function formatDate(d: string): string { return new Intl.DateTimeFormat('es-PE', { dateStyle: 'long' }).format(new Date(d)); }

function deletePet(id: number) {
    if (confirm('¿Eliminar este reporte?')) {
        router.delete('/mi-adopcion/mascotas-perdidas/' + id, { preserveState: true });
    }
}

function toggleResolved(pet: LostPet) {
    router.put('/mi-adopcion/mascotas-perdidas/' + pet.id, {
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        color: pet.color,
        size: 'medium',
        last_seen_location: pet.last_seen_location,
        last_seen_date: pet.last_seen_date,
        contact_phone: '',
        status: pet.status,
        is_resolved: !pet.is_resolved,
    }, { preserveState: true });
}

const placeholderSrc = 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#e5e7eb"/><g transform="translate(200,150)"><circle cx="0" cy="-20" r="40" fill="#d1d5db"/><ellipse cx="-25" cy="15" rx="20" ry="25" fill="#d1d5db"/><ellipse cx="25" cy="15" rx="20" ry="25" fill="#d1d5db"/></g></svg>');
</script>

<template>
    <div class="mx-auto max-w-5xl">
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="text-2xl font-bold text-foreground">Mis mascotas perdidas</h1>
                <p class="mt-1 text-sm text-muted-foreground">{{ meta.total }} reportes desde tu cuenta.</p>
            </div>
            <a href="/mascotas-perdidas" class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#DC2626] to-[#EF4444] px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-red-500/20 transition">
                <Search class="h-4 w-4" /> Reportar mascota
            </a>
        </div>

        <div v-if="pets.length === 0" class="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-card py-16">
            <Search class="h-16 w-16 text-muted-foreground/20" />
            <h3 class="mt-4 text-lg font-semibold text-foreground">No tenés mascotas perdidas reportadas</h3>
            <p class="mt-1 text-sm text-muted-foreground">Si perdiste una mascota, reportala desde la sección pública.</p>
            <a href="/mascotas-perdidas" class="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#DC2626] to-[#EF4444] px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-red-500/20">
                Ir a mascotas perdidas
            </a>
        </div>

        <div v-else class="space-y-4">
            <div v-for="pet in pets" :key="pet.id" class="group overflow-hidden rounded-xl border border-border/50 bg-card transition hover:shadow-md">
                <div class="flex flex-col sm:flex-row">
                    <!-- Photo -->
                    <a :href="'/mascotas-perdidas/' + pet.id" class="sm:w-48 shrink-0">
                        <div class="aspect-[4/3] sm:aspect-square overflow-hidden bg-muted/50 sm:h-full">
                            <img v-if="pet.photos?.length" :src="photoUrl(pet.photos[0])" :alt="pet.name ?? 'Mascota'"
                                class="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                @error="($event.target as HTMLImageElement).src = placeholderSrc" />
                            <div v-else class="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/80">
                                <PawPrint class="h-12 w-12 text-muted-foreground/25" />
                            </div>
                        </div>
                    </a>
                    <!-- Info -->
                    <div class="flex flex-1 items-center justify-between p-4">
                        <a :href="'/mascotas-perdidas/' + pet.id" class="min-w-0 flex-1">
                            <div class="flex items-center gap-2 mb-1">
                                <span class="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase text-white"
                                    :class="pet.status === 'lost' ? 'bg-red-500' : 'bg-emerald-500'">
                                    {{ statusLabel(pet.status) }}
                                </span>
                                <span class="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                    {{ speciesLabel(pet.species) }}
                                </span>
                                <CheckCircle2 v-if="pet.is_resolved" class="h-4 w-4 text-emerald-500" />
                            </div>
                            <h3 class="font-semibold text-foreground">{{ pet.name ?? speciesLabel(pet.species) + ' perdido' }}</h3>
                            <div class="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground/60">
                                <MapPin class="h-3 w-3 shrink-0" />
                                <span class="truncate">{{ pet.last_seen_location }}</span>
                            </div>
                            <div class="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground/50">
                                <Calendar class="h-3 w-3 shrink-0" />
                                <span>{{ formatDate(pet.last_seen_date) }}</span>
                            </div>
                        </a>
                        <!-- Actions -->
                        <div class="flex items-center gap-1 ml-4 shrink-0">
                            <button @click="toggleResolved(pet)"
                                :title="pet.is_resolved ? 'Marcar como no resuelto' : 'Marcar como resuelto'"
                                class="rounded-lg p-2 text-muted-foreground transition hover:bg-emerald-50 hover:text-emerald-600"
                                :class="pet.is_resolved ? 'text-emerald-500' : ''">
                                <CheckCircle2 class="h-4 w-4" />
                            </button>
                            <a :href="'/mi-adopcion/mascotas-perdidas/' + pet.id + '/editar'"
                                class="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground">
                                <Edit class="h-4 w-4" />
                            </a>
                            <button @click="deletePet(pet.id)"
                                class="rounded-lg p-2 text-muted-foreground transition hover:bg-red-50 hover:text-red-600">
                                <Trash2 class="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
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
                    :class="page === meta.current_page ? 'bg-[#2D6A4F] text-white' : 'border border-border bg-card text-muted-foreground hover:bg-muted'">{{ page }}</a>
                <span v-else-if="Math.abs(page - meta.current_page) === 3" class="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground/50">...</span>
            </template>
            <a v-if="meta.current_page < meta.last_page" :href="'/mi-adopcion/mascotas-perdidas?page=' + (meta.current_page + 1)"
                class="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted">
                <ChevronRight class="h-4 w-4" />
            </a>
        </div>
    </div>
</template>
