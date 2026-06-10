<script setup lang="ts">
import { router, useForm } from '@inertiajs/vue3';

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

const props = defineProps<{
    pet: Pet;
    team: Team;
}>();

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
</script>

<template>
    <div class="mx-auto max-w-2xl">
        <a :href="'/' + team.slug + '/mascotas'" class="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-[#2D6A4F]">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Volver a mascotas
        </a>

        <h1 class="mt-6 text-2xl font-bold text-foreground">Editar {{ pet.name }}</h1>

        <form @submit.prevent="submit" class="mt-8 space-y-6">
            <div class="grid gap-4 sm:grid-cols-2">
                <div>
                    <label class="block text-sm font-medium text-foreground">Nombre</label>
                    <input v-model="form.name" class="mt-1 block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-foreground">Especie</label>
                    <select v-model="form.species" class="mt-1 block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground">
                        <option value="dog">Perro</option>
                        <option value="cat">Gato</option>
                        <option value="rabbit">Conejo</option>
                        <option value="bird">Ave</option>
                        <option value="other">Otro</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-foreground">Raza</label>
                    <input v-model="form.breed" class="mt-1 block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-foreground">Sexo</label>
                    <select v-model="form.gender" class="mt-1 block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground">
                        <option value="male">Macho</option>
                        <option value="female">Hembra</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-foreground">Tamaño</label>
                    <select v-model="form.size" class="mt-1 block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground">
                        <option value="small">Pequeño</option>
                        <option value="medium">Mediano</option>
                        <option value="large">Grande</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-foreground">Color</label>
                    <input v-model="form.color" class="mt-1 block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-foreground">Años</label>
                    <input v-model.number="form.age_years" type="number" min="0" class="mt-1 block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-foreground">Meses</label>
                    <input v-model.number="form.age_months" type="number" min="0" max="11" class="mt-1 block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-foreground">Estado</label>
                    <select v-model="form.status" class="mt-1 block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground">
                        <option value="available">Disponible</option>
                        <option value="in_process">En proceso</option>
                        <option value="adopted">Adoptado</option>
                        <option value="withheld">Retenido</option>
                    </select>
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-foreground">Descripción</label>
                <textarea v-model="form.description" rows="4" class="mt-1 block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"></textarea>
            </div>

            <div>
                <label class="block text-sm font-medium text-foreground">Notas médicas</label>
                <textarea v-model="form.medical_notes" rows="3" class="mt-1 block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"></textarea>
            </div>

            <div class="flex items-center gap-4">
                <button type="submit" :disabled="form.processing" class="rounded-lg bg-[#2D6A4F] px-6 py-2 text-sm font-medium text-white transition hover:bg-[#245a40]">
                    Guardar cambios
                </button>
                <a :href="'/' + team.slug + '/mascotas'" class="text-sm text-muted-foreground hover:text-foreground">Cancelar</a>
            </div>
        </form>
    </div>
</template>
