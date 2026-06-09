<script setup lang="ts">
import { usePhotoUrl } from '@/composables/usePhotoUrl';

interface Pet {
    id: number;
    name: string;
    slug: string;
    species: string;
    breed: string | null;
    gender: string;
    size: string;
    color: string | null;
    status: string;
    description: string | null;
    medical_notes: string | null;
    photos: string[];
    age_years: number;
    age_months: number;
    created_at: string;
    adoptions_count: number;
    team: { id: number; name: string; slug: string };
}

const props = defineProps<{ pet: Pet }>();
const pet = props.pet;

const { photoUrl } = usePhotoUrl();

function speciesLabel(s: string): string {
    const labels: Record<string, string> = { dog: 'Perro', cat: 'Gato', rabbit: 'Conejo', bird: 'Ave', other: 'Otro' };
    return labels[s] ?? s;
}

function genderLabel(s: string): string {
    const labels: Record<string, string> = { male: 'Macho', female: 'Hembra' };
    return labels[s] ?? s;
}

function sizeLabel(s: string): string {
    const labels: Record<string, string> = { small: 'Pequeño', medium: 'Mediano', large: 'Grande' };
    return labels[s] ?? s;
}

function statusClass(s: string): string {
    const colors: Record<string, string> = {
        available: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
        adopted: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
        in_process: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
        withheld: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    };
    return colors[s] ?? 'bg-gray-100 text-gray-600';
}

function statusLabel(s: string): string {
    const labels: Record<string, string> = { available: 'Disponible', adopted: 'Adoptado', in_process: 'En proceso', withheld: 'Retenido' };
    return labels[s] ?? s;
}

function formatDate(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d));
}

function speciesIcon(s: string): string {
    const icons: Record<string, string> = {
        dog: '🐕', cat: '🐈', rabbit: '🐇', bird: '🐦', other: '🐾',
    };
    return icons[s] ?? '🐾';
}
</script>

<template>
    <div class="mx-auto max-w-5xl">
        <a href="/admin/mascotas" class="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-[#2D6A4F]">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Volver a mascotas
        </a>

        <div class="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-5">
            <div class="lg:col-span-2">
                <div v-if="pet.photos && pet.photos.length > 0" class="overflow-hidden rounded-2xl border border-[#2D6A4F]/15">
                    <img :src="photoUrl(pet.photos[0])" :alt="pet.name" class="w-full object-cover" />
                </div>
                <div v-else class="flex aspect-[3/4] items-center justify-center rounded-2xl border border-dashed border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 dark:from-[#2D6A4F]/15 dark:to-black/40">
                    <div class="text-center">
                        <svg class="mx-auto h-16 w-16 text-muted-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p class="mt-2 text-sm text-muted-foreground/40">Sin foto</p>
                    </div>
                </div>
            </div>

            <div class="lg:col-span-3">
                <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                    <div class="flex items-start justify-between">
                        <div class="flex items-center gap-3">
                            <div>
                                <h1 class="text-2xl font-bold text-foreground">{{ pet.name }}</h1>
                                <div class="mt-2 flex flex-wrap items-center gap-2">
                                    <span class="rounded-full bg-[#2D6A4F]/10 px-3 py-0.5 text-xs font-medium text-[#2D6A4F] dark:bg-[#2D6A4F]/30 dark:text-emerald-400">
                                        {{ speciesIcon(pet.species) }} {{ speciesLabel(pet.species) }}
                                    </span>
                                    <span class="rounded-full px-3 py-0.5 text-xs font-medium" :class="statusClass(pet.status)">{{ statusLabel(pet.status) }}</span>
                                    <span class="rounded-full bg-muted px-3 py-0.5 text-xs font-medium text-muted-foreground">{{ sizeLabel(pet.size) }}</span>
                                </div>
                            </div>
                        </div>
                        <a :href="'/admin/mascotas/' + pet.id + '/editar'" class="inline-flex items-center gap-1.5 rounded-xl bg-[#2D6A4F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#245a40]">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Editar
                        </a>
                    </div>

                    <div class="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                        <div>
                            <p class="text-xs font-medium text-muted-foreground/60 uppercase tracking-wide">Raza</p>
                            <p class="mt-0.5 font-medium text-foreground">{{ pet.breed ?? '—' }}</p>
                        </div>
                        <div>
                            <p class="text-xs font-medium text-muted-foreground/60 uppercase tracking-wide">Edad</p>
                            <p class="mt-0.5 font-medium text-foreground">
                                {{ pet.age_years > 0 ? pet.age_years + ' años' : '' }}{{ pet.age_years > 0 && pet.age_months > 0 ? ' ' : '' }}{{ pet.age_months > 0 ? pet.age_months + ' meses' : pet.age_years === 0 && pet.age_months === 0 ? '—' : '' }}
                            </p>
                        </div>
                        <div>
                            <p class="text-xs font-medium text-muted-foreground/60 uppercase tracking-wide">Sexo</p>
                            <p class="mt-0.5 font-medium text-foreground">{{ genderLabel(pet.gender) }}</p>
                        </div>
                        <div>
                            <p class="text-xs font-medium text-muted-foreground/60 uppercase tracking-wide">Color</p>
                            <p class="mt-0.5 font-medium text-foreground">{{ pet.color ?? '—' }}</p>
                        </div>
                        <div>
                            <p class="text-xs font-medium text-muted-foreground/60 uppercase tracking-wide">Organización</p>
                            <a :href="'/admin/organizaciones/' + pet.team.slug" class="mt-0.5 inline-flex items-center gap-1 font-medium text-[#2D6A4F] hover:underline">
                                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                {{ pet.team.name }}
                            </a>
                        </div>
                        <div>
                            <p class="text-xs font-medium text-muted-foreground/60 uppercase tracking-wide">Registro</p>
                            <p class="mt-0.5 font-medium text-foreground">{{ formatDate(pet.created_at) }}</p>
                        </div>
                    </div>

                    <div v-if="pet.description" class="mt-6 rounded-xl border border-[#2D6A4F]/10 bg-[#2D6A4F]/4 p-4 dark:border-[#2D6A4F]/20 dark:bg-[#2D6A4F]/10">
                        <p class="text-xs font-medium text-muted-foreground/60 uppercase tracking-wide">Descripción</p>
                        <p class="mt-1 text-sm text-foreground leading-relaxed">{{ pet.description }}</p>
                    </div>

                    <div v-if="pet.medical_notes" class="mt-4 rounded-xl border border-amber-200/50 bg-amber-50/50 p-4 dark:border-amber-900/30 dark:bg-amber-950/20">
                        <div class="flex items-center gap-1.5">
                            <svg class="h-4 w-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p class="text-xs font-medium text-amber-700 dark:text-amber-400 uppercase tracking-wide">Notas médicas</p>
                        </div>
                        <p class="mt-1 text-sm text-amber-900/80 dark:text-amber-200/80">{{ pet.medical_notes }}</p>
                    </div>

                    <div class="mt-6 flex gap-4">
                        <div class="flex-1 rounded-xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 px-4 py-3 text-center dark:from-[#2D6A4F]/15 dark:to-black/40">
                            <p class="text-xl font-bold text-[#2D6A4F] dark:text-emerald-400">{{ pet.adoptions_count ?? 0 }}</p>
                            <p class="text-xs text-muted-foreground">Adopciones</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
