<script setup lang="ts">
import { usePhotoUrl } from '@/composables/usePhotoUrl';
import {
    Dog, Cat, Rabbit, Bird, PawPrint, ArrowLeft, Pencil,
    MapPin, CalendarDays, Stethoscope, Ruler, User, Palette,
    Clock,
} from 'lucide-vue-next';
import { computed } from 'vue';

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
    team: { id: number; name: string; slug: string };
}

const props = defineProps<{ pet: Pet }>();
const pet = props.pet;
const team = pet.team;

const { photoUrl } = usePhotoUrl();

function speciesLabel(s: string): string {
    const labels: Record<string, string> = { dog: 'Perro', cat: 'Gato', rabbit: 'Conejo', bird: 'Ave', other: 'Otro' };
    return labels[s] ?? s;
}

function speciesIcon(s: string) {
    const icons: Record<string, any> = { dog: Dog, cat: Cat, rabbit: Rabbit, bird: Bird };
    return icons[s] ?? PawPrint;
}

function genderLabel(s: string): string { return s === 'male' ? 'Macho' : 'Hembra'; }
function sizeLabel(s: string): string {
    const labels: Record<string, string> = { small: 'Pequeño', medium: 'Mediano', large: 'Grande' };
    return labels[s] ?? s;
}

function statusClass(s: string): string {
    return s === 'available' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
        : s === 'adopted' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
        : s === 'in_process' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
}

function statusLabel(s: string): string {
    const labels: Record<string, string> = { available: 'Disponible', adopted: 'Adoptado', in_process: 'En proceso', withheld: 'Retenido' };
    return labels[s] ?? s;
}

function formatDate(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d));
}

function formatAge(y: number, m: number): string {
    const parts: string[] = [];
    if (y > 0) parts.push(`${y} ${y > 1 ? 'años' : 'año'}`);
    if (m > 0) parts.push(`${m} ${m > 1 ? 'meses' : 'mes'}`);
    return parts.length ? parts.join(' ') : '—';
}

const mainPhoto = computed(() => pet.photos?.[0] ?? null);
</script>

<template>
    <div class="mx-auto max-w-6xl">
        <a :href="'/' + team.slug + '/mascotas'"
            class="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-[#2D6A4F]">
            <ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Volver a mascotas
        </a>

        <!-- Header -->
        <div class="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div class="flex items-start gap-4">
                <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#2D6A4F]/10 dark:bg-[#2D6A4F]/20">
                    <component :is="speciesIcon(pet.species)" class="h-7 w-7 text-[#2D6A4F] dark:text-emerald-400" />
                </div>
                <div>
                    <div class="flex flex-wrap items-center gap-2">
                        <h1 class="text-2xl font-bold text-foreground">{{ pet.name }}</h1>
                        <span class="rounded-full px-2.5 py-0.5 text-xs font-medium" :class="statusClass(pet.status)">{{ statusLabel(pet.status) }}</span>
                    </div>
                    <p class="mt-1 text-sm text-muted-foreground">{{ speciesLabel(pet.species) }}{{ pet.breed ? ' · ' + pet.breed : '' }}</p>
                </div>
            </div>
            <a :href="'/' + team.slug + '/mascotas/' + pet.id + '/editar'"
                class="inline-flex items-center gap-1.5 self-start rounded-xl bg-[#2D6A4F] px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-[#2D6A4F]/20 transition hover:bg-[#245a40] hover:shadow-md">
                <Pencil class="h-4 w-4" />
                Editar
            </a>
        </div>

        <div class="mt-8 grid gap-8 lg:grid-cols-5">
            <!-- Photo gallery -->
            <div class="lg:col-span-2">
                <div v-if="pet.photos && pet.photos.length > 0" class="grid gap-3"
                    :class="pet.photos.length === 1 ? 'grid-cols-1' : 'grid-cols-2'">
                    <div v-for="(photo, i) in pet.photos" :key="i"
                        class="overflow-hidden rounded-2xl border border-border/50"
                        :class="i === 0 && pet.photos.length > 1 ? 'col-span-2' : ''">
                        <img :src="photoUrl(photo)" :alt="pet.name + ' ' + (i + 1)"
                            class="aspect-[4/3] w-full object-cover" loading="lazy" />
                    </div>
                </div>
                <div v-else class="flex aspect-[3/4] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30">
                    <div class="text-center">
                        <PawPrint class="mx-auto h-12 w-12 text-muted-foreground/25" />
                        <p class="mt-2 text-sm text-muted-foreground/40">Sin fotos</p>
                    </div>
                </div>
            </div>

            <!-- Info -->
            <div class="lg:col-span-3 space-y-6">
                <!-- Quick stats -->
                <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div class="rounded-xl border border-border/50 bg-card p-3.5">
                        <div class="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                            <Clock class="h-3.5 w-3.5 text-[#2D6A4F]" />
                            Edad
                        </div>
                        <p class="mt-1 text-base font-semibold text-foreground">{{ formatAge(pet.age_years, pet.age_months) }}</p>
                    </div>
                    <div class="rounded-xl border border-border/50 bg-card p-3.5">
                        <div class="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                            <Ruler class="h-3.5 w-3.5 text-[#2D6A4F]" />
                            Tamaño
                        </div>
                        <p class="mt-1 text-base font-semibold text-foreground">{{ sizeLabel(pet.size) }}</p>
                    </div>
                    <div class="rounded-xl border border-border/50 bg-card p-3.5">
                        <div class="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                            <User class="h-3.5 w-3.5 text-[#2D6A4F]" />
                            Sexo
                        </div>
                        <p class="mt-1 text-base font-semibold text-foreground">{{ genderLabel(pet.gender) }}</p>
                    </div>
                    <div class="rounded-xl border border-border/50 bg-card p-3.5">
                        <div class="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                            <Palette class="h-3.5 w-3.5 text-[#2D6A4F]" />
                            Color
                        </div>
                        <p class="mt-1 text-base font-semibold text-foreground capitalize">{{ pet.color || '—' }}</p>
                    </div>
                </div>

                <!-- Description -->
                <div v-if="pet.description" class="rounded-2xl border border-border/50 bg-card p-5">
                    <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                        <PawPrint class="h-4 w-4 text-[#2D6A4F]" />
                        Descripción
                    </h3>
                    <p class="text-sm leading-relaxed text-muted-foreground">{{ pet.description }}</p>
                </div>

                <!-- Medical notes -->
                <div v-if="pet.medical_notes" class="rounded-2xl border border-amber-200/50 bg-amber-50/30 p-5 dark:border-amber-900/30 dark:bg-amber-950/20">
                    <h3 class="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-800 dark:text-amber-400">
                        <Stethoscope class="h-4 w-4 text-amber-500" />
                        Notas médicas
                    </h3>
                    <p class="text-sm leading-relaxed text-amber-700/80 dark:text-amber-300/70">{{ pet.medical_notes }}</p>
                </div>

                <!-- Registration info -->
                <div class="rounded-2xl border border-border/50 bg-card p-5">
                    <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                        <CalendarDays class="h-4 w-4 text-[#2D6A4F]" />
                        Información de registro
                    </h3>
                    <div class="grid gap-3 text-sm sm:grid-cols-2">
                        <div>
                            <p class="text-xs text-muted-foreground/60">Fecha de registro</p>
                            <p class="mt-0.5 font-medium text-foreground">{{ formatDate(pet.created_at) }}</p>
                        </div>
                        <div>
                            <p class="text-xs text-muted-foreground/60">Organización</p>
                            <p class="mt-0.5 font-medium text-foreground">{{ team.name }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
