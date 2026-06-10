<script setup lang="ts">
import { useForm, router } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
import InputError from '@/components/InputError.vue';
import { usePhotoUrl } from '@/composables/usePhotoUrl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Team {
    id: number;
    name: string;
    slug: string;
}

interface PetEdit {
    id: number;
    team_id: number;
    name: string;
    species: string;
    breed: string | null;
    age_years: number;
    age_months: number;
    gender: string;
    size: string;
    color: string | null;
    status: string;
    description: string | null;
    medical_notes: string | null;
    photos: string[] | null;
    team: Team;
}

const props = defineProps<{
    pet: PetEdit;
    teams: Team[];
}>();

const { photoUrl } = usePhotoUrl();

const existingPhoto = props.pet.photos?.length ? photoUrl(props.pet.photos[0]) : null;

const photoSource = ref<'file' | 'url'>('file');
const previewUrl = ref<string | null>(null);
const currentPreview = ref<string | null>(existingPhoto);
const urlPreviewError = ref(false);

const form = useForm({
    team_id: String(props.pet.team_id),
    name: props.pet.name,
    species: props.pet.species,
    breed: props.pet.breed ?? '',
    age_years: props.pet.age_years,
    age_months: props.pet.age_months,
    gender: props.pet.gender,
    size: props.pet.size,
    color: props.pet.color ?? '',
    status: props.pet.status,
    description: props.pet.description ?? '',
    medical_notes: props.pet.medical_notes ?? '',
    photo: null as File | null,
    photo_url: '',
});

function onPhotoChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
        form.photo = file;
        form.photo_url = '';
        urlPreviewError.value = false;
        const reader = new FileReader();
        reader.onload = () => {
            previewUrl.value = reader.result as string;
            currentPreview.value = null;
        };
        reader.readAsDataURL(file);
    }
}

function onUrlInput() {
    form.photo = null;
    urlPreviewError.value = false;
    if (form.photo_url && isValidUrl(form.photo_url)) {
        previewUrl.value = form.photo_url;
        currentPreview.value = null;
    } else {
        previewUrl.value = null;
    }
}

function isValidUrl(str: string): boolean {
    try {
        const url = new URL(str);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

function handleUrlError() {
    urlPreviewError.value = true;
    previewUrl.value = null;
}

const speciesOptions = [
    { value: 'dog', label: 'Perro' },
    { value: 'cat', label: 'Gato' },
    { value: 'rabbit', label: 'Conejo' },
    { value: 'bird', label: 'Ave' },
    { value: 'other', label: 'Otro' },
];

const genderOptions = [
    { value: 'male', label: 'Macho' },
    { value: 'female', label: 'Hembra' },
];

const sizeOptions = [
    { value: 'small', label: 'Pequeño' },
    { value: 'medium', label: 'Mediano' },
    { value: 'large', label: 'Grande' },
];

const statusOptions = [
    { value: 'available', label: 'Disponible' },
    { value: 'adopted', label: 'Adoptado' },
    { value: 'in_process', label: 'En proceso' },
    { value: 'withheld', label: 'Retenido' },
];

function submit() {
    form.put('/admin/mascotas/' + props.pet.id);
}

function deletePet() {
    if (confirm('¿Estás seguro de eliminar esta mascota? Esta acción no se puede deshacer.')) {
        router.delete('/admin/mascotas/' + props.pet.id);
    }
}

const ageInYears = computed({
    get: () => form.age_years,
    set: (val: number) => { form.age_years = Math.min(50, Math.max(0, val || 0)); },
});

const ageInMonths = computed({
    get: () => form.age_months,
    set: (val: number) => { form.age_months = Math.min(11, Math.max(0, val || 0)); },
});
</script>

<template>
    <div class="mx-auto max-w-4xl">
        <a href="/admin/mascotas" class="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-[#2D6A4F]">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Volver a mascotas
        </a>

        <div class="mb-8 mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div class="flex items-center gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2D6A4F]/10">
                    <svg class="h-6 w-6 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-foreground">{{ pet.name }}</h1>
                    <p class="mt-0.5 text-sm text-muted-foreground">Actualizá los datos de la mascota.</p>
                </div>
            </div>
            <button type="button" @click="deletePet" class="inline-flex items-center gap-1.5 self-start rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Eliminar
            </button>
        </div>

        <form @submit.prevent="submit" class="space-y-8">
            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="mb-5 flex items-center gap-2">
                    <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h2 class="text-base font-semibold text-foreground">Organización</h2>
                </div>
                <div class="grid gap-2">
                    <Label for="team_id">¿A qué organización pertenece?</Label>
                    <Select v-model="form.team_id" name="team_id">
                        <SelectTrigger class="w-full">
                            <SelectValue placeholder="Seleccionar organización" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="team in teams" :key="team.id" :value="String(team.id)">
                                {{ team.name }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError :message="form.errors.team_id" />
                </div>
            </div>

            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="mb-5 flex items-center gap-2">
                    <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h2 class="text-base font-semibold text-foreground">Información básica</h2>
                </div>

                <div class="grid gap-5 sm:grid-cols-2">
                    <div class="grid gap-2">
                        <Label for="name">Nombre</Label>
                        <div class="relative">
                            <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                            </svg>
                            <Input id="name" v-model="form.name" type="text" placeholder="Ej: Luna, Max, Simba" class="pl-9" />
                        </div>
                        <InputError :message="form.errors.name" />
                    </div>

                    <div class="grid gap-2">
                        <Label for="species">Especie</Label>
                        <Select v-model="form.species" name="species">
                            <SelectTrigger class="w-full">
                                <SelectValue placeholder="¿Perro, gato...?" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="opt in speciesOptions" :key="opt.value" :value="opt.value">
                                    <span class="flex items-center gap-2">
                                        <span v-if="opt.value === 'dog'">🐶</span>
                                        <span v-else-if="opt.value === 'cat'">🐱</span>
                                        <span v-else-if="opt.value === 'rabbit'">🐰</span>
                                        <span v-else-if="opt.value === 'bird'">🐦</span>
                                        <span v-else>🐾</span>
                                        {{ opt.label }}
                                    </span>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError :message="form.errors.species" />
                    </div>

                    <div class="grid gap-2">
                        <Label for="breed">Raza</Label>
                        <div class="relative">
                            <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <Input id="breed" v-model="form.breed" type="text" placeholder="Ej: Labrador, Persa, Mestizo" class="pl-9" />
                        </div>
                        <InputError :message="form.errors.breed" />
                    </div>

                    <div class="grid gap-2">
                        <Label for="color">Color</Label>
                        <div class="relative">
                            <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                            </svg>
                            <Input id="color" v-model="form.color" type="text" placeholder="Ej: Marrón, Blanco, Negro" class="pl-9" />
                        </div>
                        <InputError :message="form.errors.color" />
                    </div>
                </div>

                <div class="mt-5 grid gap-5 sm:grid-cols-3">
                    <div class="grid gap-2">
                        <Label for="gender">Sexo</Label>
                        <Select v-model="form.gender" name="gender">
                            <SelectTrigger class="w-full">
                                <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="opt in genderOptions" :key="opt.value" :value="opt.value">
                                    <span class="flex items-center gap-2">
                                        <span v-if="opt.value === 'male'">♂️</span>
                                        <span v-else>♀️</span>
                                        {{ opt.label }}
                                    </span>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError :message="form.errors.gender" />
                    </div>

                    <div class="grid gap-2">
                        <Label>Edad (años)</Label>
                        <Input v-model.number="ageInYears" type="number" min="0" max="50" placeholder="0" />
                        <InputError :message="form.errors.age_years" />
                    </div>

                    <div class="grid gap-2">
                        <Label>Edad (meses)</Label>
                        <Input v-model.number="ageInMonths" type="number" min="0" max="11" placeholder="0" />
                        <InputError :message="form.errors.age_months" />
                    </div>
                </div>

                <div class="mt-5 grid gap-5 sm:grid-cols-2">
                    <div class="grid gap-2">
                        <Label for="size">Tamaño</Label>
                        <Select v-model="form.size" name="size">
                            <SelectTrigger class="w-full">
                                <SelectValue placeholder="¿Qué tan grande es?" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="opt in sizeOptions" :key="opt.value" :value="opt.value">
                                    <span class="flex items-center gap-2">
                                        <svg v-if="opt.value === 'small'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                        <svg v-else-if="opt.value === 'medium'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                        <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                        {{ opt.label }}
                                    </span>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError :message="form.errors.size" />
                    </div>

                    <div class="grid gap-2">
                        <Label for="status">Estado</Label>
                        <Select v-model="form.status" name="status">
                            <SelectTrigger class="w-full">
                                <SelectValue placeholder="¿Está disponible?" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
                                    <span class="flex items-center gap-2">
                                        <span v-if="opt.value === 'available'" class="flex h-2 w-2 rounded-full bg-green-500" />
                                        <span v-else-if="opt.value === 'adopted'" class="flex h-2 w-2 rounded-full bg-blue-500" />
                                        <span v-else-if="opt.value === 'in_process'" class="flex h-2 w-2 rounded-full bg-amber-500" />
                                        <span v-else class="flex h-2 w-2 rounded-full bg-gray-400" />
                                        {{ opt.label }}
                                    </span>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError :message="form.errors.status" />
                    </div>
                </div>
            </div>

            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="mb-5 flex items-center gap-2">
                    <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h2 class="text-base font-semibold text-foreground">Foto</h2>
                </div>

                <div class="mb-4 flex gap-2">
                    <button type="button"
                        class="rounded-lg px-4 py-2 text-sm font-medium transition-all"
                        :class="photoSource === 'file' ? 'bg-[#2D6A4F] text-white shadow-sm' : 'bg-muted text-muted-foreground hover:text-foreground'"
                        @click="photoSource = 'file'"
                    >
                        <span class="flex items-center gap-1.5">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Subir archivo
                        </span>
                    </button>
                    <button type="button"
                        class="rounded-lg px-4 py-2 text-sm font-medium transition-all"
                        :class="photoSource === 'url' ? 'bg-[#2D6A4F] text-white shadow-sm' : 'bg-muted text-muted-foreground hover:text-foreground'"
                        @click="photoSource = 'url'"
                    >
                        <span class="flex items-center gap-1.5">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            Pegar URL
                        </span>
                    </button>
                </div>

                <div v-if="photoSource === 'file'" class="grid gap-2">
                    <Label for="photo">Seleccioná una imagen</Label>
                    <div class="relative">
                        <input
                            id="photo" type="file" accept="image/jpeg,image/png,image/webp" @change="onPhotoChange"
                            class="block w-full cursor-pointer rounded-xl border border-[#2D6A4F]/15 bg-white/60 py-2.5 pl-4 pr-4 text-sm text-muted-foreground transition file:me-3 file:rounded-lg file:border-0 file:bg-[#2D6A4F] file:px-4 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-[#246142] dark:border-[#2D6A4F]/30 dark:bg-black/20"
                        />
                    </div>
                    <p class="text-xs text-muted-foreground">JPG, PNG o WebP. Máximo 5 MB.</p>
                    <InputError :message="form.errors.photo" />
                </div>

                <div v-else class="grid gap-2">
                    <Label for="photo_url">Pegá el enlace de la imagen</Label>
                    <div class="relative">
                        <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <Input id="photo_url" v-model="form.photo_url" type="url" placeholder="https://ejemplo.com/foto.jpg" class="pl-9" @input="onUrlInput" />
                    </div>
                    <p class="text-xs text-muted-foreground">Podés usar enlaces de Facebook, Instagram, Google Drive, etc.</p>
                    <InputError :message="form.errors.photo_url" />
                </div>

                <div v-if="previewUrl" class="mt-4 overflow-hidden rounded-xl border border-[#2D6A4F]/15">
                    <img :src="previewUrl" class="max-h-64 w-full object-cover" :class="{ 'opacity-60': urlPreviewError }" @error="handleUrlError" alt="Vista previa" />
                </div>
                <div v-else-if="currentPreview" class="mt-4 overflow-hidden rounded-xl border border-[#2D6A4F]/15">
                    <img :src="currentPreview" class="max-h-64 w-full object-cover" alt="Foto actual" />
                </div>
            </div>

            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="mb-5 flex items-center gap-2">
                    <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h2 class="text-base font-semibold text-foreground">Información adicional</h2>
                </div>

                <div class="grid gap-5">
                    <div class="grid gap-2">
                        <Label for="description">Descripción</Label>
                        <div class="relative">
                            <svg class="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            <textarea
                                id="description" v-model="form.description" rows="4"
                                class="block w-full rounded-xl border border-[#2D6A4F]/15 bg-white/60 py-2.5 pl-10 pr-4 text-sm text-foreground transition outline-none placeholder:text-muted-foreground/40 focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 dark:border-[#2D6A4F]/30 dark:bg-black/20"
                                placeholder="Contá un poco sobre la mascota: su personalidad, historia, gustos..."
                            ></textarea>
                        </div>
                        <InputError :message="form.errors.description" />
                    </div>

                    <div class="grid gap-2">
                        <Label for="medical_notes">Notas médicas</Label>
                        <div class="relative">
                            <svg class="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            <textarea
                                id="medical_notes" v-model="form.medical_notes" rows="4"
                                class="block w-full rounded-xl border border-[#2D6A4F]/15 bg-white/60 py-2.5 pl-10 pr-4 text-sm text-foreground transition outline-none placeholder:text-muted-foreground/40 focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 dark:border-[#2D6A4F]/30 dark:bg-black/20"
                                placeholder="Vacunas, desparasitación, esterilización, condiciones de salud..."
                            ></textarea>
                        </div>
                        <InputError :message="form.errors.medical_notes" />
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-4 rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <Button type="submit" :disabled="form.processing" class="min-w-[140px]">
                    <svg v-if="form.processing" class="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <svg v-else class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {{ form.processing ? 'Guardando...' : 'Guardar cambios' }}
                </Button>
                <a :href="'/admin/mascotas/' + pet.id" class="text-sm font-medium text-muted-foreground transition hover:text-foreground">Cancelar</a>
            </div>
        </form>
    </div>
</template>
