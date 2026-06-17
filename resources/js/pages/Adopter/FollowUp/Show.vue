<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { ref } from 'vue';
import { ArrowLeft, Send, Clock, CheckCircle, XCircle, ImagePlus } from 'lucide-vue-next';

interface FollowUp { id: number; scheduled_date: string; completed_date: string | null; status: string; notes: string | null; photos: string[]; created_at: string; adoption: { id: number; pet: { id: number; name: string; slug: string; species: string; photos: string[] | null }; team: { id: number; name: string; slug: string } }; }
const props = defineProps<{ followUp: FollowUp }>();

const notes = ref('');
const photos = ref<File[]>([]);
const submitting = ref(false);

function handlePhotoInput(e: Event) { const input = e.target as HTMLInputElement; if (input.files) photos.value = Array.from(input.files); }
function submitReport() { if (submitting.value) return; submitting.value = true; const fd = new FormData(); fd.append('notes', notes.value); for (const p of photos.value) fd.append('photos[]', p); router.post(`/mi-adopcion/seguimientos/${props.followUp.id}/reportar`, fd, { onFinish: () => submitting.value = false }); }
function statusClass(s: string) { const m: Record<string, string> = { pending: 'bg-amber-100 text-amber-700', completed: 'bg-green-100 text-green-700', missed: 'bg-red-100 text-red-700' }; return m[s] ?? 'bg-gray-100 text-gray-600'; }
function statusLabel(s: string) { const l: Record<string, string> = { pending: 'Pendiente', completed: 'Completado', missed: 'No Realizado' }; return l[s] ?? s; }
function formatDate(d: string) { return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d)); }
</script>

<template>
    <div class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <a href="/mi-adopcion/seguimientos" class="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-[#2D6A4F]"><ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />Volver a seguimientos</a>

        <div class="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div><h1 class="text-2xl font-bold text-foreground">Reportar Seguimiento</h1><p class="mt-1 text-sm text-muted-foreground">{{ followUp.adoption.pet.name }} — {{ followUp.adoption.team.name }}</p></div>
            <span class="self-start inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium" :class="statusClass(followUp.status)"><Clock v-if="followUp.status === 'pending'" class="h-4 w-4" /><CheckCircle v-else-if="followUp.status === 'completed'" class="h-4 w-4" /><XCircle v-else class="h-4 w-4" />{{ statusLabel(followUp.status) }}</span>
        </div>

        <div v-if="followUp.status !== 'pending'" class="mt-10 rounded-2xl border border-border/50 bg-card p-8 text-center"><Clock class="mx-auto h-12 w-12 text-muted-foreground/30" /><p class="mt-4 text-muted-foreground">Este seguimiento ya fue reportado.</p></div>

        <div v-else class="mt-8 space-y-6">
            <div class="rounded-2xl border border-border/50 bg-card p-6">
                <h2 class="text-sm font-semibold text-foreground">Información del hito</h2>
                <div class="mt-3 space-y-2"><p class="text-sm text-muted-foreground">{{ followUp.notes }}</p><p class="text-xs text-muted-foreground/70">Programado: {{ formatDate(followUp.scheduled_date) }}</p></div>
            </div>

            <div class="rounded-2xl border border-border/50 bg-card p-6">
                <h2 class="text-sm font-semibold text-foreground">Tu reporte</h2>
                <div class="mt-4 space-y-4">
                    <textarea v-model="notes" placeholder="Cuéntanos cómo está tu mascota, cómo va la adaptación..." class="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]" rows="5"></textarea>
                    <div><label class="text-xs font-medium text-muted-foreground/70">Fotos (opcional)</label><input type="file" multiple accept="image/*" class="mt-2 block w-full cursor-pointer rounded-lg border border-border bg-background text-sm text-muted-foreground file:mr-4 file:border-0 file:bg-[#2D6A4F] file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-white file:cursor-pointer hover:file:bg-[#246142] file:transition-colors" @change="handlePhotoInput" /></div>
                    <button class="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2D6A4F] to-[#40916C] px-4 py-3 text-sm font-medium text-white shadow-md shadow-[#2D6A4F]/20 transition-all hover:shadow-lg disabled:opacity-50" :disabled="submitting" @click="submitReport()"><Send class="h-4 w-4" />{{ submitting ? 'Enviando...' : 'Enviar reporte' }}</button>
                </div>
            </div>
        </div>
    </div>
</template>
