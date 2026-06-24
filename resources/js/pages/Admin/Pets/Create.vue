<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
import InputError from '@/components/InputError.vue';
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

defineProps<{ teams: Team[] }>();

const form = useForm({
    team_id: '',
    name: '',
    species: '',
    breed: '',
    age_years: 0,
    age_months: 0,
    gender: '',
    size: '',
    color: '',
    status: '',
    description: '',
    medical_notes: '',
    photo: null as File | null,
    photo_urls: '',
});

const photoSource = ref<'file' | 'url'>('file');
const previewUrl = ref<string | null>(null);

function onPhotoChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];

    if (file) {
        form.photo = file;
        form.photo_urls = '';
        const reader = new FileReader();
        reader.onload = () => {
            previewUrl.value = reader.result as string;
        };
        reader.readAsDataURL(file);
    }
}

function onUrlInput() {
    form.photo = null;
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
    form.post('/admin/mascotas');
}

const ageInYears = computed({
    get: () => form.age_years,
    set: (val: number) => {
        form.age_years = Math.min(50, Math.max(0, val || 0));
    },
});

const ageInMonths = computed({
    get: () => form.age_months,
    set: (val: number) => {
        form.age_months = Math.min(11, Math.max(0, val || 0));
    },
});
</script>

<template>
    <div class="mx-auto max-w-4xl">
        <div class="mb-8">
            <div class="flex items-center gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2D6A4F]/10">
                    <svg class="h-6 w-6 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-foreground">
                        Nueva mascota
                    </h1>
                    <p class="mt-0.5 text-sm text-muted-foreground">
                        Completá los datos para registrar una mascota en la plataforma.
                    </p>
                </div>
            </div>
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
                            <SelectItem
                                v-for="team in teams"
                                :key="team.id"
                                :value="String(team.id)"
                            >
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
                            <Input
                                id="name"
                                v-model="form.name"
                                type="text"
                                placeholder="Ej: Luna, Max, Simba"
                                class="pl-9"
                            />
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
                                <SelectItem
                                    v-for="opt in speciesOptions"
                                    :key="opt.value"
                                    :value="opt.value"
                                >
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
                            <Input
                                id="breed"
                                v-model="form.breed"
                                type="text"
                                placeholder="Ej: Labrador, Persa, Mestizo"
                                class="pl-9"
                            />
                        </div>
                        <InputError :message="form.errors.breed" />
                    </div>

                    <div class="grid gap-2">
                        <Label for="color">Color</Label>
                        <div class="relative">
                            <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                            </svg>
                            <Input
                                id="color"
                                v-model="form.color"
                                type="text"
                                placeholder="Ej: Marrón, Blanco, Negro"
                                class="pl-9"
                            />
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
                                <SelectItem
                                    v-for="opt in genderOptions"
                                    :key="opt.value"
                                    :value="opt.value"
                                >
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
                        <Input
                            v-model.number="ageInYears"
                            type="number"
                            min="0"
                            max="50"
                            placeholder="0"
                        />
                        <InputError :message="form.errors.age_years" />
                    </div>

                    <div class="grid gap-2">
                        <Label>Edad (meses)</Label>
                        <Input
                            v-model.number="ageInMonths"
                            type="number"
                            min="0"
                            max="11"
                            placeholder="0"
                        />
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
                                <SelectItem
                                    v-for="opt in sizeOptions"
                                    :key="opt.value"
                                    :value="opt.value"
                                >
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
                                <SelectItem
                                    v-for="opt in statusOptions"
                                    :key="opt.value"
                                    :value="opt.value"
                                >
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
                    <button
                        type="button"
                        class="rounded-lg px-4 py-2 text-sm font-medium transition-all"
                        :class="photoSource === 'file'
                            ? 'bg-[#2D6A4F] text-white shadow-sm'
                            : 'bg-muted text-muted-foreground hover:text-foreground'"
                        @click="photoSource = 'file'"
                    >
                        <span class="flex items-center gap-1.5">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Subir archivo
                        </span>
                    </button>
                    <button
                        type="button"
                        class="rounded-lg px-4 py-2 text-sm font-medium transition-all"
                        :class="photoSource === 'url'
                            ? 'bg-[#2D6A4F] text-white shadow-sm'
                            : 'bg-muted text-muted-foreground hover:text-foreground'"
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
                            id="photo"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            @change="onPhotoChange"
                            class="block w-full cursor-pointer rounded-xl border border-[#2D6A4F]/15 bg-white/60 py-2.5 pl-4 pr-4 text-sm text-muted-foreground transition file:me-3 file:rounded-lg file:border-0 file:bg-[#2D6A4F] file:px-4 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-[#246142] dark:border-[#2D6A4F]/30 dark:bg-black/20"
                        />
                    </div>
                    <div v-if="previewUrl" class="mt-3 overflow-hidden rounded-xl border border-[#2D6A4F]/15">
                        <img :src="previewUrl" class="h-48 w-full object-cover" alt="Vista previa" />
                    </div>
                    <p class="text-xs text-muted-foreground">
                        JPG, PNG o WebP. Máximo 5 MB.
                    </p>
                    <InputError :message="form.errors.photo" />
                </div>

                <div v-else class="grid gap-2">
                    <Label for="photo_urls">Pegá los enlaces de las imágenes (uno por línea)</Label>
                    <div class="relative">
                        <textarea
                            id="photo_urls"
                            v-model="form.photo_urls"
                            rows="4"
                            placeholder="https://ejemplo.com/foto1.jpg&#10;https://ejemplo.com/foto2.jpg&#10;https://drive.google.com/file/d/..."
                            class="block w-full rounded-xl border border-[#2D6A4F]/15 bg-white/60 py-2.5 pl-4 pr-4 text-sm text-foreground transition outline-none placeholder:text-muted-foreground/40 focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 dark:border-[#2D6A4F]/30 dark:bg-black/20"
                            @input="onUrlInput"
                        ></textarea>
                    </div>
                    <p class="text-xs text-muted-foreground">
                        Podés usar enlaces directos de imágenes o links de Google Drive (uno por línea). Se descargarán y guardarán todas.
                    </p>
                    <InputError :message="form.errors.photo_urls" />
                </div>

                <div v-if="photoSource === 'url' && form.photo_urls" class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div v-for="(url, i) in form.photo_urls.split('\n').filter(u => u.trim())" :key="i" class="overflow-hidden rounded-xl border border-[#2D6A4F]/15">
                        <img :src="url.trim()" class="h-24 w-full object-cover" @error="(e) => (e.target as HTMLImageElement).style.display = 'none'" :alt="'Vista previa ' + (i + 1)" />
                    </div>
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
                                id="description"
                                v-model="form.description"
                                rows="4"
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
                                id="medical_notes"
                                v-model="form.medical_notes"
                                rows="4"
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
                    {{ form.processing ? 'Guardando...' : 'Guardar mascota' }}
                </Button>
                <a
                    href="/admin/mascotas"
                    class="text-sm font-medium text-muted-foreground transition hover:text-foreground"
                >Cancelar</a>
            </div>
        </form>
    </div>
</template>
