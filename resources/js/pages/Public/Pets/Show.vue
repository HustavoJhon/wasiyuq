<script setup lang="ts">
import { useForm, usePage } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
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
    color: string | null;
    description: string;
    medical_notes: string | null;
    status: string;
    photos: string[] | null;
    team: {
        id: number;
        name: string;
        slug: string;
        bio: string | null;
        logo: string | null;
        website: string | null;
        phone: string | null;
        city: string | null;
        state: string | null;
    };
}

const props = defineProps<{ pet: Pet }>();
const page = usePage();
const isAuthenticated = !!page.props.auth?.user;
const showForm = ref(false);
const errors = computed(() => page.props.errors as Record<string, string>);

const lightboxIndex = ref<number | null>(null);
const zoomed = ref(false);

function openLightbox(index: number) {
    lightboxIndex.value = index;
    zoomed.value = false;
}

function closeLightbox() {
    lightboxIndex.value = null;
    zoomed.value = false;
}

function toggleZoom() {
    zoomed.value = !zoomed.value;
}

function prevPhoto() {
    if (lightboxIndex.value !== null && props.pet?.photos) {
        lightboxIndex.value = (lightboxIndex.value - 1 + props.pet?.photos.length) % props.pet?.photos.length;
        zoomed.value = false;
    }
}

function nextPhoto() {
    if (lightboxIndex.value !== null && props.pet?.photos) {
        lightboxIndex.value = (lightboxIndex.value + 1) % props.pet?.photos.length;
        zoomed.value = false;
    }
}

const form = useForm({
    motivation: '',
    experience_with_pets: false,
    has_yard: false,
    housing_type: 'house',
    family_composition: '',
    why_this_pet: '',
    has_children: null,
    other_pets: '',
    housing_ownership: '',
    hours_alone: '',
    veterinary_plan: '',
    agreement: false,
});

function submit(): void {
    form.post(`/mascotas/${props.pet.slug}/postular`, {
        preserveScroll: true,
        onSuccess: () => {
            showForm.value = false;
            form.reset();
        },
    });
}

function openForm(): void {
    if (!isAuthenticated) {
        window.location.href =
            '/login?redirect=' + encodeURIComponent(window.location.pathname);

        return;
    }

    showForm.value = true;
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
    const labels: Record<string, string> = { dog: 'Perro', cat: 'Gato', rabbit: 'Conejo', bird: 'Ave', other: 'Otro' };

    return labels[species] ?? species;
}

function sizeLabel(size: string): string {
    const labels: Record<string, string> = { small: 'Pequeño', medium: 'Mediano', large: 'Grande' };

    return labels[size] ?? size;
}

function genderLabel(gender: string): string {
    const labels: Record<string, string> = { male: 'Macho', female: 'Hembra' };

    return labels[gender] ?? gender;
}

function statusLabel(status: string): string {
    const labels: Record<string, string> = { available: 'Disponible', in_process: 'En Proceso', adopted: 'Adoptado', withheld: 'Reservado' };

    return labels[status] ?? status;
}

function statusColor(status: string): string {
    const colors: Record<string, string> = {
        available: 'bg-emerald-500',
        in_process: 'bg-amber-500',
        adopted: 'bg-blue-500',
        withheld: 'bg-gray-400',
    };

    return colors[status] ?? 'bg-gray-400';
}

function speciesEmoji(species: string): string {
    const icons: Record<string, string> = { dog: '🐕', cat: '🐈', rabbit: '🐇', bird: '🐦', other: '🐾' };

    return icons[species] ?? '🐾';
}
</script>

<template>
    <div class="min-h-screen bg-gradient-to-b from-white via-emerald-50/30 to-white dark:from-gray-950 dark:via-emerald-950/10 dark:to-gray-950">
        <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <a
                href="/mascotas"
                class="group inline-flex items-center gap-1.5 text-sm text-muted-foreground/70 transition-all duration-200 hover:text-[#2D6A4F] dark:hover:text-emerald-400"
            >
                <svg class="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Volver a mascotas
            </a>

            <div class="mt-6 grid gap-10 lg:grid-cols-5">
                <!-- Photo Gallery -->
                <div class="lg:col-span-3 space-y-4 animate-[fadeIn_0.6s_ease-out]">
                    <div
                        v-if="pet?.photos && pet?.photos.length > 0"
                        class="grid gap-4"
                        :class="pet?.photos.length === 1 ? 'grid-cols-1' : pet?.photos.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'"
                    >
                        <div
                            v-for="(photo, i) in pet?.photos"
                            :key="i"
                            class="group relative cursor-pointer overflow-hidden rounded-2xl border border-emerald-100/60 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/10 hover:-translate-y-0.5 dark:border-emerald-900/30 dark:bg-gray-900 dark:hover:shadow-emerald-900/30"
                            :class="i === 0 && pet?.photos.length > 1 ? 'col-span-2 sm:col-span-2 row-span-2' : 'aspect-[4/3]'"
                            @click="openLightbox(i)"
                        >
                            <img
                                :src="photoUrl(photo)"
                                :alt="pet.name + ' ' + (i + 1)"
                                class="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
                                loading="lazy"
                            />
                            <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            <div class="pointer-events-none absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-sm transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 scale-75 dark:bg-gray-800/90">
                                <svg class="h-4 w-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div
                        v-else
                        class="aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-100 via-emerald-50 to-white dark:from-gray-800 dark:via-gray-800/50 dark:to-gray-900 flex items-center justify-center"
                    >
                        <div class="text-center">
                            <svg class="mx-auto h-16 w-16 text-emerald-300 dark:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p class="mt-2 text-sm text-emerald-400 dark:text-emerald-500">Sin foto</p>
                        </div>
                    </div>
                </div>

                <!-- Pet Info -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Header -->
                    <div class="animate-[fadeIn_0.6s_ease-out_0.1s_both]">
                        <div class="flex items-start justify-between gap-4">
                            <div class="min-w-0">
                                <div class="flex items-center gap-2">
                                    <span class="text-2xl">{{ speciesEmoji(pet.species) }}</span>
                                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ pet.name }}</h1>
                                </div>
                                <p class="mt-1 text-muted-foreground">
                                    {{ pet.breed }} &middot; {{ speciesLabel(pet.species) }}
                                </p>
                            </div>
                            <span
                                class="shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-white shadow-sm"
                                :class="statusColor(pet.status)"
                            >
                                <span class="flex h-1.5 w-1.5 rounded-full bg-white/70" />
                                {{ statusLabel(pet.status) }}
                            </span>
                        </div>
                    </div>

                    <!-- Quick Stats -->
                    <div class="grid grid-cols-2 gap-3 animate-[fadeIn_0.6s_ease-out_0.2s_both]">
                        <div class="rounded-xl border border-emerald-100/60 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-emerald-200 dark:border-emerald-900/30 dark:bg-gray-900 dark:hover:border-emerald-700">
                            <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span class="text-xs font-medium uppercase tracking-wider">Edad</span>
                            </div>
                            <p class="mt-1.5 text-lg font-semibold text-gray-900 dark:text-gray-100">{{ formatAge(pet.age_years, pet.age_months) }}</p>
                        </div>
                        <div class="rounded-xl border border-emerald-100/60 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-emerald-200 dark:border-emerald-900/30 dark:bg-gray-900 dark:hover:border-emerald-700">
                            <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                </svg>
                                <span class="text-xs font-medium uppercase tracking-wider">Tamaño</span>
                            </div>
                            <p class="mt-1.5 text-lg font-semibold text-gray-900 dark:text-gray-100">{{ sizeLabel(pet.size) }}</p>
                        </div>
                        <div class="rounded-xl border border-emerald-100/60 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-emerald-200 dark:border-emerald-900/30 dark:bg-gray-900 dark:hover:border-emerald-700">
                            <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span class="text-xs font-medium uppercase tracking-wider">Sexo</span>
                            </div>
                            <p class="mt-1.5 text-lg font-semibold text-gray-900 dark:text-gray-100">{{ genderLabel(pet.gender) }}</p>
                        </div>
                        <div class="rounded-xl border border-emerald-100/60 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-emerald-200 dark:border-emerald-900/30 dark:bg-gray-900 dark:hover:border-emerald-700">
                            <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                </svg>
                                <span class="text-xs font-medium uppercase tracking-wider">Color</span>
                            </div>
                            <p class="mt-1.5 text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize">{{ pet.color || '—' }}</p>
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="animate-[fadeIn_0.6s_ease-out_0.3s_both]">
                        <div class="rounded-xl border border-emerald-100/60 bg-white p-5 shadow-sm dark:border-emerald-900/30 dark:bg-gray-900">
                            <h3 class="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                                <svg class="h-4 w-4 text-emerald-500 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                                Descripción
                            </h3>
                            <p class="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                {{ pet.description }}
                            </p>
                        </div>
                    </div>

                    <!-- Medical Notes -->
                    <div v-if="pet.medical_notes" class="animate-[fadeIn_0.6s_ease-out_0.35s_both]">
                        <div class="rounded-xl border border-amber-100 bg-amber-50/50 p-5 shadow-sm dark:border-amber-900/30 dark:bg-amber-950/20">
                            <h3 class="flex items-center gap-2 text-sm font-semibold text-amber-800 dark:text-amber-400">
                                <svg class="h-4 w-4 text-amber-500 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                                Notas médicas
                            </h3>
                            <p class="mt-2 text-sm leading-relaxed text-amber-700/80 dark:text-amber-300/70">{{ pet.medical_notes }}</p>
                        </div>
                    </div>

                    <!-- Organization -->
                    <div class="animate-[fadeIn_0.6s_ease-out_0.4s_both]">
                        <div class="rounded-xl border border-emerald-100/60 bg-white p-5 shadow-sm dark:border-emerald-900/30 dark:bg-gray-900">
                            <h3 class="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                                <svg class="h-4 w-4 text-emerald-500 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                Organización responsable
                            </h3>
                            <div class="mt-3 space-y-1.5">
                                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ pet.team.name }}</p>
                                <p v-if="pet.team.city" class="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {{ pet.team.city }}{{ pet.team.state ? ', ' + pet.team.state : '' }}
                                </p>
                                <p v-if="pet.team.phone" class="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {{ pet.team.phone }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Adopt Button -->
                    <div class="animate-[fadeIn_0.6s_ease-out_0.45s_both]">
                        <button
                            v-if="pet.status === 'available'"
                            class="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30 hover:from-emerald-500 hover:to-emerald-400 active:scale-[0.98] dark:from-emerald-700 dark:to-emerald-600 dark:hover:from-emerald-600 dark:hover:to-emerald-500"
                            @click="openForm()"
                        >
                            <span class="relative z-10 flex items-center gap-2">
                                <svg class="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                Quiero adoptarlo
                            </span>
                            <div class="absolute inset-0 -translate-x-full transition-transform duration-500 group-hover:translate-x-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0" />
                        </button>
                        <div
                            v-else
                            class="flex items-center justify-center gap-2 rounded-xl bg-gray-50 px-6 py-3.5 text-sm font-medium text-gray-400 border border-gray-100 dark:bg-gray-900 dark:text-gray-500 dark:border-gray-800"
                        >
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            {{ statusLabel(pet.status) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Lightbox Modal -->
        <Teleport to="body">
            <div
                v-if="lightboxIndex !== null && pet?.photos"
                class="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm"
                @click="closeLightbox"
            >
                <button
                    class="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:scale-110"
                    @click.stop="closeLightbox"
                >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <button
                    v-if="pet?.photos.length > 1"
                    class="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:scale-110"
                    @click.stop="prevPhoto"
                >
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <img
                    :src="photoUrl(pet?.photos[lightboxIndex])"
                    :alt="pet.name + ' ' + (lightboxIndex + 1)"
                    class="rounded-2xl object-contain shadow-2xl transition-all duration-300 cursor-zoom-in"
                    :class="zoomed ? 'max-h-none max-w-none h-auto w-auto cursor-zoom-out' : 'max-h-[90vh] max-w-[90vw]'"
                    @click.stop="toggleZoom"
                />

                <button
                    v-if="pet?.photos.length > 1"
                    class="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:scale-110"
                    @click.stop="nextPhoto"
                >
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                    <span
                        v-for="(_, i) in pet?.photos"
                        :key="i"
                        class="h-2 rounded-full transition-all duration-300 cursor-pointer"
                        :class="i === lightboxIndex ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'"
                        @click.stop="lightboxIndex = i; zoomed = false"
                    />
                </div>

                <button
                    class="absolute bottom-6 right-6 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:scale-110"
                    @click.stop="toggleZoom"
                    :title="zoomed ? 'Ajustar a pantalla' : 'Ver a tamaño real'"
                >
                    <svg v-if="!zoomed" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                    <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 11h-2v-2m0 0h-2m2 0v-2m0 2v2" />
                    </svg>
                </button>
            </div>
        </Teleport>

        <!-- Adoption Form Modal -->
        <div
            v-if="showForm"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            @click.self="showForm = false"
        >
            <div class="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card p-6 shadow-xl animate-[fadeIn_0.3s_ease-out]">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2D6A4F]/10">
                            <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <div>
                            <h2 class="text-lg font-semibold text-foreground">Solicitar adopción</h2>
                            <p class="text-sm text-muted-foreground">{{ pet.name }} · {{ pet.team.name }}</p>
                        </div>
                    </div>
                    <button class="text-muted-foreground hover:text-foreground" @click="showForm = false">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form class="mt-6 space-y-5" @submit.prevent="submit">
                    <!-- Motivación y vínculo -->
                    <div class="rounded-xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                        <div class="mb-4 flex items-center gap-2">
                            <svg class="h-4 w-4 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <h3 class="text-sm font-semibold text-foreground">Motivación y vínculo</h3>
                        </div>
                        <div class="space-y-4">
                            <div>
                                <label class="text-sm font-medium text-foreground">¿Por qué quieres adoptarlo?</label>
                                <textarea v-model="form.motivation"
                                    class="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-[#2D6A4F]"
                                    :class="errors.motivation ? 'border-red-500' : 'border-border'"
                                    rows="3" placeholder="Cuéntanos tu motivación (mín. 150 caracteres)..."
                                ></textarea>
                                <p v-if="errors.motivation" class="mt-1 text-xs text-red-500">{{ errors.motivation }}</p>
                            </div>
                            <div>
                                <label class="text-sm font-medium text-foreground">¿Qué te llamó la atención de {{ pet.name }}?</label>
                                <textarea v-model="form.why_this_pet"
                                    class="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[#2D6A4F]"
                                    rows="2" placeholder="Su personalidad, su historia, su aspecto..."
                                ></textarea>
                                <p v-if="errors.why_this_pet" class="mt-1 text-xs text-red-500">{{ errors.why_this_pet }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Tu hogar -->
                    <div class="rounded-xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                        <div class="mb-4 flex items-center gap-2">
                            <svg class="h-4 w-4 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <h3 class="text-sm font-semibold text-foreground">Tu hogar</h3>
                        </div>
                        <div class="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label class="text-sm font-medium text-foreground">Tipo de vivienda</label>
                                <select v-model="form.housing_type"
                                    class="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-[#2D6A4F]"
                                    :class="errors.housing_type ? 'border-red-500' : 'border-border'"
                                >
                                    <option value="house">Casa</option>
                                    <option value="apartment">Departamento</option>
                                    <option value="condo">Condominio</option>
                                    <option value="other">Otro</option>
                                </select>
                                <p v-if="errors.housing_type" class="mt-1 text-xs text-red-500">{{ errors.housing_type }}</p>
                            </div>
                            <div>
                                <label class="text-sm font-medium text-foreground">¿La vivienda es...</label>
                                <select v-model="form.housing_ownership"
                                    class="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[#2D6A4F]"
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="own">Propia</option>
                                    <option value="rent">Alquilada</option>
                                    <option value="other">Otro</option>
                                </select>
                                <p v-if="errors.housing_ownership" class="mt-1 text-xs text-red-500">{{ errors.housing_ownership }}</p>
                            </div>
                        </div>
                        <div class="mt-3 flex items-center gap-2">
                            <input id="yard" v-model="form.has_yard" type="checkbox"
                                class="rounded border-border text-[#2D6A4F] focus:ring-[#2D6A4F]"
                            />
                            <label for="yard" class="text-sm text-foreground">Tengo patio o jardín</label>
                        </div>
                    </div>

                    <!-- Tu familia -->
                    <div class="rounded-xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                        <div class="mb-4 flex items-center gap-2">
                            <svg class="h-4 w-4 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <h3 class="text-sm font-semibold text-foreground">Tu familia</h3>
                        </div>
                        <div class="space-y-4">
                            <div>
                                <label class="text-sm font-medium text-foreground">Composición del hogar</label>
                                <textarea v-model="form.family_composition"
                                    class="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-[#2D6A4F]"
                                    :class="errors.family_composition ? 'border-red-500' : 'border-border'"
                                    rows="2" placeholder="¿Con quién vives? ¿Hay niños?"
                                ></textarea>
                                <p v-if="errors.family_composition" class="mt-1 text-xs text-red-500">{{ errors.family_composition }}</p>
                            </div>
                            <div class="flex items-center gap-2">
                                <input id="children" v-model="form.has_children" type="checkbox"
                                    class="rounded border-border text-[#2D6A4F] focus:ring-[#2D6A4F]"
                                />
                                <label for="children" class="text-sm text-foreground">Hay niños en casa</label>
                            </div>
                            <div>
                                <label class="text-sm font-medium text-foreground">¿Tienes otras mascotas?</label>
                                <textarea v-model="form.other_pets"
                                    class="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[#2D6A4F]"
                                    rows="2" placeholder="Cuéntanos qué mascotas tienes actualmente o has tenido antes..."
                                ></textarea>
                                <p v-if="errors.other_pets" class="mt-1 text-xs text-red-500">{{ errors.other_pets }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Estilo de vida -->
                    <div class="rounded-xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                        <div class="mb-4 flex items-center gap-2">
                            <svg class="h-4 w-4 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 class="text-sm font-semibold text-foreground">Estilo de vida</h3>
                        </div>
                        <div class="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label class="text-sm font-medium text-foreground">Horas solo al día</label>
                                <div class="relative mt-1">
                                    <input v-model="form.hours_alone" type="number" min="0" max="24"
                                        class="w-full rounded-lg border border-border bg-background px-3 py-2 pr-8 text-sm outline-none focus:border-[#2D6A4F]"
                                        placeholder="8"
                                    />
                                    <span class="pointer-events-none absolute right-3 top-2 text-xs text-muted-foreground">hrs</span>
                                </div>
                                <p v-if="errors.hours_alone" class="mt-1 text-xs text-red-500">{{ errors.hours_alone }}</p>
                            </div>
                            <div>
                                <label class="text-sm font-medium text-foreground">Experiencia con mascotas</label>
                                <div class="mt-2 flex items-center gap-2">
                                    <input id="exp" v-model="form.experience_with_pets" type="checkbox"
                                        class="rounded border-border text-[#2D6A4F] focus:ring-[#2D6A4F]"
                                    />
                                    <label for="exp" class="text-sm text-foreground">Tengo experiencia previa</label>
                                </div>
                            </div>
                        </div>
                        <div class="mt-4">
                            <label class="text-sm font-medium text-foreground">Plan veterinario</label>
                            <textarea v-model="form.veterinary_plan"
                                class="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[#2D6A4F]"
                                rows="2" placeholder="¿Tienes veterinario de confianza? ¿Cómo planeas cubrir los gastos de salud (vacunas, esterilización, emergencias)?"
                            ></textarea>
                            <p v-if="errors.veterinary_plan" class="mt-1 text-xs text-red-500">{{ errors.veterinary_plan }}</p>
                        </div>
                    </div>

                    <!-- Compromiso -->
                    <div class="rounded-xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                        <div class="mb-4 flex items-center gap-2">
                            <svg class="h-4 w-4 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <h3 class="text-sm font-semibold text-foreground">Compromiso</h3>
                        </div>
                        <div class="flex items-start gap-2">
                            <input id="agreement" v-model="form.agreement" type="checkbox"
                                class="mt-0.5 rounded border-border text-[#2D6A4F] focus:ring-[#2D6A4F]"
                            />
                            <label for="agreement" class="text-sm leading-relaxed text-foreground">
                                Confirmo que estoy comprometido a brindarle un hogar responsable, con los cuidados necesarios durante toda su vida, y que entiendo que la entidad realizará un seguimiento posterior a la adopción.
                            </label>
                        </div>
                        <p v-if="errors.agreement" class="mt-1 text-xs text-red-500">{{ errors.agreement }}</p>
                    </div>

                    <button type="submit" :disabled="form.processing"
                        class="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-500 hover:to-emerald-400 hover:shadow-xl active:scale-[0.98]"
                        :class="{ 'opacity-50': form.processing }"
                    >
                        <span class="flex items-center justify-center gap-2">
                            <svg v-if="form.processing" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                            {{ form.processing ? 'Enviando...' : 'Enviar solicitud' }}
                        </span>
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<style>
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(12px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
