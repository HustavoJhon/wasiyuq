<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { ref } from 'vue';
import { ArrowLeft, Upload, X, Save } from 'lucide-vue-next';
import { usePhotoUrl } from '@/composables/usePhotoUrl';

const { photoUrl } = usePhotoUrl();

interface LostPet {
    id: number; name: string | null; species: string; breed: string | null; color: string | null;
    size: string | null; age_description: string | null; description: string | null;
    last_seen_location: string; last_seen_date: string; contact_phone: string | null;
    contact_email: string | null; photos: string[] | null; status: 'lost' | 'found'; is_resolved: boolean;
}

const props = defineProps<{ pet: LostPet }>();

const form = useForm({
    _method: 'put',
    name: props.pet.name ?? '',
    species: props.pet.species,
    breed: props.pet.breed ?? '',
    color: props.pet.color ?? '',
    size: props.pet.size ?? '',
    age_description: props.pet.age_description ?? '',
    description: props.pet.description ?? '',
    last_seen_location: props.pet.last_seen_location,
    last_seen_date: props.pet.last_seen_date,
    contact_phone: props.pet.contact_phone ?? '',
    contact_email: props.pet.contact_email ?? '',
    status: props.pet.status,
    is_resolved: props.pet.is_resolved,
    photo: null as File | null,
    photo_url: '',
});

const photoPreview = ref(props.pet.photos?.[0] ?? null);

function onPhotoChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) { form.photo = file; const r = new FileReader(); r.onload = () => photoPreview.value = r.result as string; r.readAsDataURL(file); }
}

function submit() {
    form.post('/mi-adopcion/mascotas-perdidas/' + props.pet.id, { forceFormData: true });
}
</script>

<template>
    <div class="mx-auto max-w-2xl">
        <a href="/mi-adopcion/mascotas-perdidas" class="mb-6 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted"><ArrowLeft class="h-4 w-4" /> Volver</a>

        <div class="rounded-2xl border border-border/50 bg-card">
            <div class="border-b border-border/50 px-6 py-4"><h1 class="text-xl font-bold text-foreground">Editar reporte</h1></div>
            <form @submit.prevent="submit" class="space-y-5 p-6">
                <!-- Photo -->
                <div>
                    <label class="block text-sm font-medium mb-2">Foto</label>
                    <div v-if="photoPreview" class="relative mb-3 overflow-hidden rounded-xl border border-border/50">
                        <img :src="photoPreview.startsWith('data:') ? photoPreview : photoUrl(photoPreview)" class="h-40 w-full object-cover" />
                        <button type="button" @click="photoPreview = null; form.photo = null" class="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white">×</button>
                    </div>
                    <label class="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground hover:border-[#DC2626]"><Upload class="h-4 w-4" />{{ photoPreview ? 'Cambiar foto' : 'Subir foto' }}<input type="file" accept="image/*" class="hidden" @change="onPhotoChange" /></label>
                </div>

                <!-- Status -->
                <div class="grid grid-cols-2 gap-3">
                    <label class="cursor-pointer rounded-xl border-2 p-4 text-center" :class="form.status === 'lost' ? 'border-red-500 bg-red-50' : 'border-border'" @click="form.status = 'lost'"><input type="radio" v-model="form.status" value="lost" class="sr-only" /><p class="font-semibold">Perdido</p></label>
                    <label class="cursor-pointer rounded-xl border-2 p-4 text-center" :class="form.status === 'found' ? 'border-emerald-500 bg-emerald-50' : 'border-border'" @click="form.status = 'found'"><input type="radio" v-model="form.status" value="found" class="sr-only" /><p class="font-semibold">Encontrado</p></label>
                </div>

                <div><label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" v-model="form.is_resolved" :true-value="true" :false-value="false" class="rounded" /><span class="text-sm font-medium">Marcar como resuelto</span></label></div>

                <div class="grid gap-4 sm:grid-cols-2">
                    <div><label class="block text-sm font-medium mb-1.5">Nombre</label><input v-model="form.name" type="text" class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-[#DC2626]" /></div>
                    <div><label class="block text-sm font-medium mb-1.5">Especie *</label><select v-model="form.species" class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-[#DC2626]"><option value="dog">Perro</option><option value="cat">Gato</option><option value="rabbit">Conejo</option><option value="bird">Ave</option><option value="other">Otro</option></select></div>
                </div>
                <div class="grid gap-4 sm:grid-cols-3">
                    <div><label class="block text-sm font-medium mb-1.5">Raza</label><input v-model="form.breed" type="text" class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-[#DC2626]" /></div>
                    <div><label class="block text-sm font-medium mb-1.5">Color</label><input v-model="form.color" type="text" class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-[#DC2626]" /></div>
                    <div><label class="block text-sm font-medium mb-1.5">Tamaño</label><select v-model="form.size" class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-[#DC2626]"><option value="">--</option><option value="small">Pequeño</option><option value="medium">Mediano</option><option value="large">Grande</option></select></div>
                </div>
                <div class="grid gap-4 sm:grid-cols-2">
                    <div><label class="block text-sm font-medium mb-1.5">Edad aprox.</label><input v-model="form.age_description" type="text" class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-[#DC2626]" /></div>
                    <div><label class="block text-sm font-medium mb-1.5">Fecha *</label><input v-model="form.last_seen_date" type="date" required class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-[#DC2626]" /></div>
                </div>
                <div><label class="block text-sm font-medium mb-1.5">Ubicación *</label><input v-model="form.last_seen_location" type="text" required class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-[#DC2626]" /></div>
                <div><label class="block text-sm font-medium mb-1.5">Descripción</label><textarea v-model="form.description" rows="3" class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-[#DC2626]" /></div>
                <div class="grid gap-4 sm:grid-cols-2">
                    <div><label class="block text-sm font-medium mb-1.5">Teléfono</label><input v-model="form.contact_phone" type="text" class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-[#DC2626]" /></div>
                    <div><label class="block text-sm font-medium mb-1.5">Correo</label><input v-model="form.contact_email" type="email" class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-[#DC2626]" /></div>
                </div>
                <div class="flex items-center justify-end gap-3 border-t border-border/50 pt-4">
                    <a href="/mi-adopcion/mascotas-perdidas" class="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted">Cancelar</a>
                    <button type="submit" :disabled="form.processing" class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#DC2626] to-[#EF4444] px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-red-500/20 transition disabled:opacity-50"><Save class="h-4 w-4" /> Guardar</button>
                </div>
            </form>
        </div>
    </div>
</template>
