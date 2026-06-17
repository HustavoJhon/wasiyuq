<script setup lang="ts">
import { router, useForm } from '@inertiajs/vue3';
import { ArrowLeft, Save } from 'lucide-vue-next';
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
}

interface Team {
    id: number;
    name: string;
    slug: string;
}

const props = defineProps<{ pet: Pet; team: Team }>();

const form = useForm({
    name: props.pet.name,
    species: props.pet.species,
    breed: props.pet.breed ?? '',
    gender: props.pet.gender,
    size: props.pet.size,
    color: props.pet.color ?? '',
    status: props.pet.status,
    description: props.pet.description ?? '',
    medical_notes: props.pet.medical_notes ?? '',
    age_years: props.pet.age_years,
    age_months: props.pet.age_months,
});

function submit() {
    form.put('/' + props.team.slug + '/mascotas/' + props.pet.id);
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
</script>

<template>
    <div class="mx-auto max-w-3xl">
        <a :href="'/' + team.slug + '/mascotas'"
            class="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-[#2D6A4F]">
            <ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Volver a mascotas
        </a>

        <div class="mt-5 mb-8">
            <h1 class="text-2xl font-bold text-foreground">Editar {{ pet.name }}</h1>
            <p class="mt-1 text-sm text-muted-foreground">Actualiza los datos de la mascota.</p>
        </div>

        <form @submit.prevent="submit" class="space-y-8">
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
                        <Label for="name">Nombre</Label>
                        <Input id="name" v-model="form.name" type="text" placeholder="Nombre de la mascota" />
                        <InputError :message="form.errors.name" />
                    </div>
                    <div class="grid gap-2">
                        <Label for="species">Especie</Label>
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
                        <Label for="gender">Sexo</Label>
                        <Select v-model="form.gender" name="gender">
                            <SelectTrigger><SelectValue placeholder="Seleccionar sexo" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="opt in genderOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError :message="form.errors.gender" />
                    </div>
                    <div class="grid gap-2">
                        <Label for="size">Tamaño</Label>
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
                        <Label for="status">Estado</Label>
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
                    Contenido
                </h2>
                <div class="space-y-4">
                    <div class="grid gap-2">
                        <Label for="description">Descripción</Label>
                        <textarea id="description" v-model="form.description" rows="4"
                            class="flex min-h-[80px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-xs outline-none transition focus-visible:border-[#2D6A4F] focus-visible:ring-1 focus-visible:ring-[#2D6A4F]"
                            placeholder="Descripción de la mascota"></textarea>
                        <InputError :message="form.errors.description" />
                    </div>
                    <div class="grid gap-2">
                        <Label for="medical_notes">Notas médicas</Label>
                        <textarea id="medical_notes" v-model="form.medical_notes" rows="3"
                            class="flex min-h-[80px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-xs outline-none transition focus-visible:border-[#2D6A4F] focus-visible:ring-1 focus-visible:ring-[#2D6A4F]"
                            placeholder="Notas médicas relevantes"></textarea>
                        <InputError :message="form.errors.medical_notes" />
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-5 sm:p-6">
                <Button type="submit" :disabled="form.processing"
                    class="inline-flex items-center gap-2 bg-gradient-to-r from-[#2D6A4F] to-[#40916C] hover:from-[#245a40] hover:to-[#34855a]">
                    <Save class="h-4 w-4" />
                    {{ form.processing ? 'Guardando...' : 'Guardar cambios' }}
                </Button>
                <a :href="'/' + team.slug + '/mascotas'" class="text-sm text-muted-foreground transition hover:text-foreground">Cancelar</a>
            </div>
        </form>
    </div>
</template>
