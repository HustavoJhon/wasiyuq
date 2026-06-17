<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { ref } from 'vue';
import { ArrowLeft, Upload, ImagePlus, Save } from 'lucide-vue-next';
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
import type { Team } from '@/types';

const props = defineProps<{ team: Team }>();

const form = useForm({
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
});

const previewUrl = ref<string | null>(null);

function onPhotoChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
        form.photo = file;
        const reader = new FileReader();
        reader.onload = () => { previewUrl.value = reader.result as string; };
        reader.readAsDataURL(file);
    }
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
    form.post(`/${props.team.slug}/mascotas`);
}
</script>

<template>
    <div class="mx-auto max-w-3xl">
        <a :href="'/' + team.slug + '/mascotas'"
            class="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-[#2D6A4F]">
            <ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Volver a mascotas
        </a>

        <div class="mt-5 mb-8">
            <h1 class="text-2xl font-bold text-foreground">Nueva mascota</h1>
            <p class="mt-1 text-sm text-muted-foreground">Registra una nueva mascota en {{ team.name }}.</p>
        </div>

        <form @submit.prevent="submit" class="space-y-8">
            <!-- Photo upload -->
            <div class="rounded-2xl border border-border/50 bg-card p-5 sm:p-6">
                <h2 class="mb-5 flex items-center gap-2 text-base font-semibold text-foreground">
                    <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2D6A4F]/10 text-[#2D6A4F]">
                        <ImagePlus class="h-4 w-4" />
                    </span>
                    Foto principal
                </h2>
                <div class="grid gap-4">
                    <input id="photo" type="file" accept="image/jpeg,image/png,image/webp"
                        @change="onPhotoChange"
                        class="block w-full cursor-pointer rounded-lg border border-border bg-background text-sm text-muted-foreground file:mr-4 file:border-0 file:bg-[#2D6A4F] file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-white hover:file:bg-[#246142] file:cursor-pointer file:transition-colors" />
                    <InputError :message="form.errors.photo" />
                    <div v-if="previewUrl" class="overflow-hidden rounded-xl border border-border/50">
                        <img :src="previewUrl" class="aspect-[4/3] w-full object-cover" alt="Vista previa" />
                    </div>
                </div>
            </div>

            <!-- Basic info -->
            <div class="rounded-2xl border border-border/50 bg-card p-5 sm:p-6">
                <h2 class="mb-5 flex items-center gap-2 text-base font-semibold text-foreground">
                    <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2D6A4F]/10 text-[#2D6A4F]">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </span>
                    Información básica
                </h2>
                <div class="grid gap-4 sm:grid-cols-2">
                    <div class="grid gap-2 sm:col-span-2">
                        <Label for="name">Nombre <span class="text-red-400">*</span></Label>
                        <Input id="name" v-model="form.name" type="text" placeholder="Nombre de la mascota" />
                        <InputError :message="form.errors.name" />
                    </div>
                    <div class="grid gap-2">
                        <Label for="species">Especie <span class="text-red-400">*</span></Label>
                        <Select v-model="form.species" name="species">
                            <SelectTrigger><SelectValue placeholder="Seleccionar especie" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="opt in speciesOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError :message="form.errors.species" />
                    </div>
                    <div class="grid gap-2">
                        <Label for="breed">Raza</Label>
                        <Input id="breed" v-model="form.breed" type="text" placeholder="Raza" />
                        <InputError :message="form.errors.breed" />
                    </div>
                    <div class="grid gap-2">
                        <Label for="gender">Sexo <span class="text-red-400">*</span></Label>
                        <Select v-model="form.gender" name="gender">
                            <SelectTrigger><SelectValue placeholder="Seleccionar sexo" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="opt in genderOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError :message="form.errors.gender" />
                    </div>
                    <div class="grid gap-2">
                        <Label for="size">Tamaño <span class="text-red-400">*</span></Label>
                        <Select v-model="form.size" name="size">
                            <SelectTrigger><SelectValue placeholder="Seleccionar tamaño" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="opt in sizeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError :message="form.errors.size" />
                    </div>
                    <div class="grid gap-2">
                        <Label for="age_years">Edad (años)</Label>
                        <Input id="age_years" v-model.number="form.age_years" type="number" min="0" />
                        <InputError :message="form.errors.age_years" />
                    </div>
                    <div class="grid gap-2">
                        <Label for="age_months">Edad (meses)</Label>
                        <Input id="age_months" v-model.number="form.age_months" type="number" min="0" max="11" />
                        <InputError :message="form.errors.age_months" />
                    </div>
                    <div class="grid gap-2">
                        <Label for="color">Color</Label>
                        <Input id="color" v-model="form.color" type="text" placeholder="Color" />
                        <InputError :message="form.errors.color" />
                    </div>
                    <div class="grid gap-2">
                        <Label for="status">Estado <span class="text-red-400">*</span></Label>
                        <Select v-model="form.status" name="status">
                            <SelectTrigger><SelectValue placeholder="Seleccionar estado" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError :message="form.errors.status" />
                    </div>
                </div>
            </div>

            <!-- Content -->
            <div class="rounded-2xl border border-border/50 bg-card p-5 sm:p-6">
                <h2 class="mb-5 flex items-center gap-2 text-base font-semibold text-foreground">
                    <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2D6A4F]/10 text-[#2D6A4F]">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                    </span>
                    Descripción
                </h2>
                <div class="space-y-4">
                    <div class="grid gap-2">
                        <Label for="description">Acerca de la mascota</Label>
                        <textarea id="description" v-model="form.description" rows="4"
                            class="flex min-h-[80px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-xs outline-none transition focus-visible:border-[#2D6A4F] focus-visible:ring-1 focus-visible:ring-[#2D6A4F]"
                            placeholder="Describe su personalidad, historia, cuidados especiales..."></textarea>
                        <InputError :message="form.errors.description" />
                    </div>
                    <div class="grid gap-2">
                        <Label for="medical_notes">Notas médicas</Label>
                        <textarea id="medical_notes" v-model="form.medical_notes" rows="3"
                            class="flex min-h-[80px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-xs outline-none transition focus-visible:border-[#2D6A4F] focus-visible:ring-1 focus-visible:ring-[#2D6A4F]"
                            placeholder="Vacunas, esterilización, condiciones especiales..."></textarea>
                        <InputError :message="form.errors.medical_notes" />
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-5 sm:p-6">
                <Button type="submit" :disabled="form.processing"
                    class="inline-flex items-center gap-2 bg-gradient-to-r from-[#2D6A4F] to-[#40916C] hover:from-[#245a40] hover:to-[#34855a]">
                    <Save class="h-4 w-4" />
                    {{ form.processing ? 'Guardando...' : 'Guardar mascota' }}
                </Button>
                <a :href="'/' + team.slug + '/mascotas'" class="text-sm text-muted-foreground transition hover:text-foreground">Cancelar</a>
            </div>
        </form>
    </div>
</template>
