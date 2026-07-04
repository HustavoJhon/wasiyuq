<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { ref } from 'vue';
import { ArrowLeft, Upload, ImagePlus, Save } from 'lucide-vue-next';

const form = useForm({
    name: '',
    species: '',
    breed: '',
    age_years: 0,
    age_months: 0,
    gender: '',
    size: '',
    color: '',
    status: 'available',
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

function submit() {
    form.post('/mi-adopcion/mascotas', { forceFormData: true });
}
</script>

<template>
    <div class="mx-auto max-w-3xl">
        <a href="/mi-adopcion/mascotas" class="mb-6 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
            <ArrowLeft class="h-4 w-4" />
            Volver a mis mascotas
        </a>

        <div class="rounded-2xl border border-border/50 bg-card">
            <div class="border-b border-border/50 px-6 py-4">
                <h1 class="text-xl font-bold text-foreground">Publicar mascota en adopción</h1>
                <p class="mt-1 text-sm text-muted-foreground">Completa los datos de la mascota que querés dar en adopción.</p>
            </div>

            <form @submit.prevent="submit" class="space-y-5 p-6">
                <!-- Photo -->
                <div>
                    <label class="block text-sm font-medium text-foreground mb-2">Foto</label>
                    <div v-if="previewUrl" class="relative mb-3 overflow-hidden rounded-xl border border-border/50">
                        <img :src="previewUrl" class="h-48 w-full object-cover" />
                        <button type="button" @click="previewUrl = null; form.photo = null"
                            class="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70">×</button>
                    </div>
                    <label class="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-4 text-sm text-muted-foreground transition hover:border-[#2D6A4F] hover:text-[#2D6A4F]">
                        <ImagePlus class="h-5 w-5" />
                        {{ previewUrl ? 'Cambiar imagen' : 'Subir foto (opcional)' }}
                        <input type="file" accept="image/*" class="hidden" @change="onPhotoChange" />
                    </label>
                </div>

                <!-- Name -->
                <div>
                    <label class="block text-sm font-medium text-foreground mb-1.5">Nombre *</label>
                    <input v-model="form.name" type="text" required
                        class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                        placeholder="Nombre de la mascota" />
                </div>

                <!-- Species + Gender -->
                <div class="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Especie *</label>
                        <select v-model="form.species" required
                            class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]">
                            <option value="" disabled>Seleccionar...</option>
                            <option v-for="s in speciesOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Sexo *</label>
                        <select v-model="form.gender" required
                            class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]">
                            <option value="" disabled>Seleccionar...</option>
                            <option v-for="g in genderOptions" :key="g.value" :value="g.value">{{ g.label }}</option>
                        </select>
                    </div>
                </div>

                <!-- Breed + Size + Color -->
                <div class="grid gap-4 sm:grid-cols-3">
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Raza</label>
                        <input v-model="form.breed" type="text"
                            class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                            placeholder="Opcional" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Tamaño</label>
                        <select v-model="form.size"
                            class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]">
                            <option value="">Seleccionar...</option>
                            <option v-for="s in sizeOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Color</label>
                        <input v-model="form.color" type="text"
                            class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                            placeholder="Opcional" />
                    </div>
                </div>

                <!-- Age -->
                <div class="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Años</label>
                        <input v-model.number="form.age_years" type="number" min="0" max="30"
                            class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Meses</label>
                        <input v-model.number="form.age_months" type="number" min="0" max="11"
                            class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]" />
                    </div>
                </div>

                <!-- Description -->
                <div>
                    <label class="block text-sm font-medium text-foreground mb-1.5">Descripción</label>
                    <textarea v-model="form.description" rows="3"
                        class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                        placeholder="Historia, personalidad, comportamiento..." />
                </div>

                <!-- Medical Notes -->
                <div>
                    <label class="block text-sm font-medium text-foreground mb-1.5">Notas veterinarias</label>
                    <textarea v-model="form.medical_notes" rows="2"
                        class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                        placeholder="Esterilizado, vacunas, condiciones..." />
                </div>

                <!-- Submit -->
                <div class="flex items-center justify-end gap-3 border-t border-border/50 pt-4">
                    <a href="/mi-adopcion/mascotas"
                        class="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted">
                        Cancelar
                    </a>
                    <button type="submit" :disabled="form.processing"
                        class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2D6A4F] to-[#40916C] px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-[#2D6A4F]/20 transition hover:from-[#246142] hover:to-[#347D5A] disabled:opacity-50">
                        <Save class="h-4 w-4" />
                        Publicar mascota
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
