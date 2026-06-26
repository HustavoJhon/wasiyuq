<script setup lang="ts">
import { ChevronRight, PawPrint, MapPin } from 'lucide-vue-next';
import { usePhotoUrl } from '@/composables/usePhotoUrl';
import CompatibilityBadge from '@/components/pets/CompatibilityBadge.vue';

const { photoUrl } = usePhotoUrl();

interface RecommendedPet {
    id: number;
    name: string;
    slug: string;
    species: string;
    species_label: string;
    breed: string | null;
    age_years: number;
    age_months: number;
    size: string;
    size_label: string;
    gender: string;
    photos: string[] | null;
    compatibility: number | null;
    team: { id: number; name: string; slug: string; city: string | null } | null;
}

defineProps<{ pets: RecommendedPet[] }>();

function formatAge(years: number, months: number): string {
    if (years > 0) return `${years} ${years > 1 ? 'años' : 'año'}`;
    if (months > 0) return `${months} ${months > 1 ? 'meses' : 'mes'}`;
    return 'Cachorro';
}

function genderLabel(g: string): string {
    return g === 'male' ? 'Macho' : 'Hembra';
}

const placeholderSrc = 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#e5e7eb"/><g transform="translate(200,150)"><circle cx="0" cy="-20" r="40" fill="#d1d5db"/><ellipse cx="-25" cy="15" rx="20" ry="25" fill="#d1d5db"/><ellipse cx="25" cy="15" rx="20" ry="25" fill="#d1d5db"/></g></svg>');
</script>

<template>
    <div v-if="pets.length > 0">
        <div class="flex items-center justify-between mb-4">
            <h2 class="flex items-center gap-2 text-lg font-semibold text-foreground">
                <PawPrint class="h-5 w-5 text-[#2D6A4F]" />
                Recomendadas para ti
            </h2>
            <a href="/mascotas?sort=compatibility" class="text-sm text-[#2D6A4F] hover:underline">
                Ver todas
            </a>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <a v-for="pet in pets" :key="pet.id"
                :href="'/mascotas/' + pet.slug"
                class="group relative flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5">
                <div class="aspect-[4/3] overflow-hidden bg-muted/50">
                    <img v-if="pet.photos && pet.photos.length > 0"
                        :src="photoUrl(pet.photos[0])" :alt="pet.name" loading="lazy"
                        class="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        @error="($event.target as HTMLImageElement).src = placeholderSrc" />
                    <div v-else class="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/80">
                        <PawPrint class="h-12 w-12 text-muted-foreground/25" />
                    </div>
                    <div class="absolute left-2 top-2 flex gap-1.5">
                        <span class="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-[#2D6A4F] shadow-sm">
                            {{ pet.species_label }}
                        </span>
                        <CompatibilityBadge :score="pet.compatibility" size="sm" />
                    </div>
                </div>
                <div class="flex flex-1 flex-col p-3">
                    <h3 class="text-sm font-semibold text-foreground group-hover:text-[#2D6A4F] transition-colors">
                        {{ pet.name }}
                    </h3>
                    <div class="mt-1 flex flex-wrap gap-1 text-[10px] text-muted-foreground">
                        <span v-if="pet.breed" class="rounded-md bg-muted/50 px-1.5 py-0.5">{{ pet.breed }}</span>
                        <span class="rounded-md bg-muted/50 px-1.5 py-0.5">{{ formatAge(pet.age_years, pet.age_months) }}</span>
                        <span class="rounded-md bg-muted/50 px-1.5 py-0.5">{{ genderLabel(pet.gender) }}</span>
                    </div>
                    <div class="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground/60">
                        <MapPin class="h-2.5 w-2.5" />
                        <span class="truncate">{{ pet.team?.name }}</span>
                    </div>
                </div>
            </a>
        </div>
    </div>
</template>
