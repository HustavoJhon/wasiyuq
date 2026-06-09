<script setup lang="ts">
import { useForm, router } from '@inertiajs/vue3';
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

interface Vaccine {
    name: string;
    date: string;
    vet: string;
    next_due: string;
}

interface FollowUpEdit {
    id: number;
    adoption_id: number;
    scheduled_date: string;
    status: string;
    notes: string | null;
    drive_link: string | null;
    weight_kg: number | null;
    health_status: string | null;
    vaccines: Vaccine[];
    behavior: string | null;
}

interface AdoptionOption {
    id: number;
    pet: { id: number; name: string };
    adopter: { id: number; name: string };
}

const props = defineProps<{
    followUp: FollowUpEdit;
    adoptions: AdoptionOption[];
}>();

const form = useForm({
    adoption_id: String(props.followUp.adoption_id),
    scheduled_date: props.followUp.scheduled_date,
    status: props.followUp.status,
    notes: props.followUp.notes ?? '',
    drive_link: props.followUp.drive_link ?? '',
    weight_kg: props.followUp.weight_kg ?? '',
    health_status: props.followUp.health_status ?? '',
    vaccines: props.followUp.vaccines ?? [],
    behavior: props.followUp.behavior ?? '',
});

function addVaccine() {
    form.vaccines.push({ name: '', date: '', vet: '', next_due: '' });
}

function removeVaccine(i: number) {
    form.vaccines.splice(i, 1);
}

function submit() {
    form.put('/admin/seguimiento/' + props.followUp.id);
}

function destroy() {
    if (confirm('¿Estás seguro de eliminar este seguimiento? Esta acción no se puede deshacer.')) {
        router.delete('/admin/seguimiento/' + props.followUp.id);
    }
}
</script>

<template>
    <div class="mx-auto max-w-4xl">
        <a href="/admin/seguimiento" class="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-[#2D6A4F]">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Volver a seguimiento
        </a>

        <div class="mb-8 mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div class="flex items-center gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2D6A4F]/10">
                    <svg class="h-6 w-6 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-foreground">Editar seguimiento</h1>
                    <p class="mt-0.5 text-sm text-muted-foreground">Actualizá los datos del seguimiento.</p>
                </div>
            </div>
            <button type="button" @click="destroy" class="inline-flex items-center gap-1.5 self-start rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Eliminar
            </button>
        </div>

        <form @submit.prevent="submit" class="space-y-6">
            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="mb-5 flex items-center gap-2">
                    <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <h2 class="text-base font-semibold text-foreground">Adopción</h2>
                </div>
                <div class="grid gap-2">
                    <Label for="adoption_id">¿A qué adopción corresponde?</Label>
                    <Select v-model="form.adoption_id" name="adoption_id">
                        <SelectTrigger class="w-full">
                            <SelectValue placeholder="Seleccionar adopción" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="a in adoptions" :key="a.id" :value="String(a.id)">
                                {{ a.pet.name }} — {{ a.adopter.name }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError :message="form.errors.adoption_id" />
                </div>
            </div>

            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="mb-5 flex items-center gap-2">
                    <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h2 class="text-base font-semibold text-foreground">Fecha y estado</h2>
                </div>

                <div class="grid gap-5 sm:grid-cols-2">
                    <div class="grid gap-2">
                        <Label for="scheduled_date">Fecha programada</Label>
                        <Input id="scheduled_date" v-model="form.scheduled_date" type="date" :disabled="form.processing" />
                        <InputError :message="form.errors.scheduled_date" />
                    </div>
                    <div class="grid gap-2">
                        <Label for="status">Estado</Label>
                        <Select v-model="form.status" name="status">
                            <SelectTrigger class="w-full">
                                <SelectValue placeholder="Seleccionar estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">
                                    <span class="flex items-center gap-2"><span class="h-2 w-2 rounded-full bg-amber-500" /> Pendiente</span>
                                </SelectItem>
                                <SelectItem value="completed">
                                    <span class="flex items-center gap-2"><span class="h-2 w-2 rounded-full bg-emerald-500" /> Completado</span>
                                </SelectItem>
                                <SelectItem value="missed">
                                    <span class="flex items-center gap-2"><span class="h-2 w-2 rounded-full bg-red-500" /> No Realizado</span>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError :message="form.errors.status" />
                    </div>
                </div>
            </div>

            <!-- Enlace de Drive -->
            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="mb-5 flex items-center gap-2">
                    <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h2 class="text-base font-semibold text-foreground">Enlace de seguimiento</h2>
                </div>
                <div class="grid gap-2">
                    <Label for="drive_link">Link de Google Drive</Label>
                    <Input id="drive_link" v-model="form.drive_link" type="url" placeholder="https://drive.google.com/drive/folders/..." :disabled="form.processing" />
                    <InputError :message="form.errors.drive_link" />
                </div>
            </div>

            <!-- Salud y peso -->
            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="mb-5 flex items-center gap-2">
                    <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <h2 class="text-base font-semibold text-foreground">Salud y bienestar</h2>
                </div>
                <div class="grid gap-5 sm:grid-cols-2">
                    <div class="grid gap-2">
                        <Label for="weight_kg">Peso actual (kg)</Label>
                        <Input id="weight_kg" v-model="form.weight_kg" type="number" step="0.1" min="0" placeholder="5.2" :disabled="form.processing" />
                        <InputError :message="form.errors.weight_kg" />
                    </div>
                    <div class="grid gap-2">
                        <Label for="health_status">Estado de salud general</Label>
                        <Select v-model="form.health_status" name="health_status">
                            <SelectTrigger class="w-full">
                                <SelectValue placeholder="Seleccionar estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="good"><span class="flex items-center gap-2"><span class="h-2 w-2 rounded-full bg-emerald-500" /> Bueno</span></SelectItem>
                                <SelectItem value="fair"><span class="flex items-center gap-2"><span class="h-2 w-2 rounded-full bg-amber-500" /> Regular</span></SelectItem>
                                <SelectItem value="poor"><span class="flex items-center gap-2"><span class="h-2 w-2 rounded-full bg-red-500" /> Malo</span></SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError :message="form.errors.health_status" />
                    </div>
                </div>
            </div>

            <!-- Vacunas -->
            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="mb-5 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <h2 class="text-base font-semibold text-foreground">Vacunas</h2>
                    </div>
                    <button type="button" @click="addVaccine" class="inline-flex items-center gap-1 rounded-lg bg-[#2D6A4F] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#245a40]">
                        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                        Agregar vacuna
                    </button>
                </div>
                <div v-if="form.vaccines.length === 0" class="text-sm text-muted-foreground/60 italic">No se registraron vacunas aún.</div>
                <div v-for="(v, i) in form.vaccines" :key="i" class="mb-4 rounded-xl border border-[#2D6A4F]/10 bg-[#2D6A4F]/4 p-4 dark:border-[#2D6A4F]/20 dark:bg-[#2D6A4F]/10">
                    <div class="mb-3 flex items-center justify-between">
                        <span class="text-sm font-medium text-foreground">Vacuna #{{ i + 1 }}</span>
                        <button type="button" @click="removeVaccine(i)" class="text-xs text-red-500 hover:text-red-700">Eliminar</button>
                    </div>
                    <div class="grid gap-4 sm:grid-cols-2">
                        <div class="grid gap-1.5">
                            <Label :for="'vaccine_name_' + i">Nombre</Label>
                            <Input :id="'vaccine_name_' + i" v-model="v.name" placeholder="Rabia, Múltiple, etc." />
                        </div>
                        <div class="grid gap-1.5">
                            <Label :for="'vaccine_date_' + i">Fecha de aplicación</Label>
                            <Input :id="'vaccine_date_' + i" v-model="v.date" type="date" />
                        </div>
                        <div class="grid gap-1.5">
                            <Label :for="'vaccine_vet_' + i">Veterinario / Clínica</Label>
                            <Input :id="'vaccine_vet_' + i" v-model="v.vet" placeholder="Dr. Pérez - VetClinic" />
                        </div>
                        <div class="grid gap-1.5">
                            <Label :for="'vaccine_next_' + i">Próxima dosis</Label>
                            <Input :id="'vaccine_next_' + i" v-model="v.next_due" type="date" />
                        </div>
                    </div>
                </div>
                <InputError :message="form.errors.vaccines" />
            </div>

            <!-- Comportamiento -->
            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="mb-5 flex items-center gap-2">
                    <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 class="text-base font-semibold text-foreground">Comportamiento</h2>
                </div>
                <div class="grid gap-2">
                    <Label for="behavior">Comportamiento observado</Label>
                    <div class="relative">
                        <svg class="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <textarea id="behavior" v-model="form.behavior" rows="3"
                            class="block w-full rounded-xl border border-[#2D6A4F]/15 bg-white/60 py-2.5 pl-10 pr-4 text-sm text-foreground transition outline-none placeholder:text-muted-foreground/40 focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 dark:border-[#2D6A4F]/30 dark:bg-black/20"
                            placeholder="Cómo se comporta la mascota?" :disabled="form.processing"
                        ></textarea>
                    </div>
                    <InputError :message="form.errors.behavior" />
                </div>
            </div>

            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="mb-5 flex items-center gap-2">
                    <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h2 class="text-base font-semibold text-foreground">Notas</h2>
                </div>
                <div class="grid gap-2">
                    <Label for="notes">Notas de la visita</Label>
                    <div class="relative">
                        <svg class="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        <textarea
                            id="notes" v-model="form.notes" rows="4"
                            class="block w-full rounded-xl border border-[#2D6A4F]/15 bg-white/60 py-2.5 pl-10 pr-4 text-sm text-foreground transition outline-none placeholder:text-muted-foreground/40 focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 dark:border-[#2D6A4F]/30 dark:bg-black/20"
                            placeholder="Observaciones, resultados de la visita..." :disabled="form.processing"
                        ></textarea>
                    </div>
                    <InputError :message="form.errors.notes" />
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
                <a :href="'/admin/seguimiento/' + followUp.id" class="text-sm font-medium text-muted-foreground transition hover:text-foreground">Cancelar</a>
            </div>
        </form>
    </div>
</template>
