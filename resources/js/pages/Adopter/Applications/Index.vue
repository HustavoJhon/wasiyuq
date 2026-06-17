<script setup lang="ts">
import { usePhotoUrl } from '@/composables/usePhotoUrl';
import { PawPrint, Clock, CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-vue-next';
import { computed } from 'vue';

const { photoUrl } = usePhotoUrl();

interface Application { id: number; status: string; motivation: string; created_at: string; pet: { id: number; name: string; slug: string; species: string; photos: string[] | null }; }
const props = defineProps<{ applications: Application[] }>();

const stats = computed(() => ({
    total: props.applications.length,
    pending: props.applications.filter(a => a.status === 'pending').length,
    approved: props.applications.filter(a => a.status === 'approved').length,
    completed: props.applications.filter(a => a.status === 'completed').length,
}));

function statusClass(s: string) { const m: Record<string, string> = { pending: 'bg-amber-100 text-amber-700', approved: 'bg-blue-100 text-blue-700', rejected: 'bg-red-100 text-red-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-gray-100 text-gray-500' }; return m[s] ?? 'bg-gray-100 text-gray-600'; }
function statusLabel(s: string) { const l: Record<string, string> = { pending: 'Pendiente', approved: 'Aprobada', rejected: 'Rechazada', completed: 'Completada', cancelled: 'Cancelada' }; return l[s] ?? s; }
function statusIcon(s: string) { return s === 'pending' ? Clock : s === 'approved' ? CheckCircle : s === 'rejected' ? XCircle : s === 'completed' ? CheckCircle : AlertCircle; }
function speciesLabel(s: string) { const l: Record<string, string> = { dog: 'Perro', cat: 'Gato', other: 'Otro' }; return l[s] ?? s; }
function formatDate(d: string) { return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d)); }
</script>

<template>
    <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><h1 class="text-2xl font-bold text-foreground">Mis Postulaciones</h1><p class="mt-1 text-sm text-muted-foreground">Seguimiento de tus solicitudes de adopción.</p></div>
            <a href="/mascotas" class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2D6A4F] to-[#40916C] px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-[#2D6A4F]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all">Ver mascotas <ArrowRight class="h-4 w-4" /></a>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div class="rounded-xl border border-border/50 bg-card p-4"><p class="text-xs font-medium text-muted-foreground/70 uppercase">Total</p><p class="mt-1 text-2xl font-bold text-foreground">{{ stats.total }}</p></div>
            <div class="rounded-xl border border-amber-200/60 bg-amber-50/30 p-4 dark:border-amber-900/30 dark:bg-amber-950/20"><p class="text-xs font-medium text-amber-700/70 uppercase">Pendientes</p><p class="mt-1 text-2xl font-bold text-amber-700 dark:text-amber-400">{{ stats.pending }}</p></div>
            <div class="rounded-xl border border-blue-200/60 bg-blue-50/30 p-4 dark:border-blue-900/30 dark:bg-blue-950/20"><p class="text-xs font-medium text-blue-700/70 uppercase">Aprobadas</p><p class="mt-1 text-2xl font-bold text-blue-700 dark:text-blue-400">{{ stats.approved }}</p></div>
            <div class="rounded-xl border border-emerald-200/60 bg-emerald-50/30 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20"><p class="text-xs font-medium text-emerald-700/70 uppercase">Completadas</p><p class="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-400">{{ stats.completed }}</p></div>
        </div>

        <div v-if="applications.length === 0" class="mt-16 flex flex-col items-center"><PawPrint class="h-16 w-16 text-muted-foreground/20" /><p class="mt-4 text-muted-foreground">No has enviado ninguna postulación aún.</p><a href="/mascotas" class="mt-4 rounded-xl bg-[#2D6A4F] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#246142]">Explorar mascotas</a></div>

        <div v-else class="mt-8 space-y-4">
            <div v-for="app in applications" :key="app.id" class="group rounded-xl border border-border/50 bg-card p-5 transition hover:shadow-sm">
                <div class="flex items-start gap-4">
                    <div class="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted"><img v-if="app.pet.photos?.length" :src="photoUrl(app.pet.photos[0])" :alt="app.pet.name" class="h-full w-full object-cover" /><div v-else class="flex h-full items-center justify-center text-muted-foreground/20"><PawPrint class="h-8 w-8" /></div></div>
                    <div class="min-w-0 flex-1">
                        <div class="flex items-start justify-between gap-2">
                            <div><h3 class="text-lg font-semibold text-foreground">{{ app.pet.name }}</h3><p class="text-sm text-muted-foreground">{{ speciesLabel(app.pet.species) }} · {{ formatDate(app.created_at) }}</p></div>
                            <span class="shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium" :class="statusClass(app.status)"><component :is="statusIcon(app.status)" class="h-3 w-3" />{{ statusLabel(app.status) }}</span>
                        </div>
                        <p class="mt-2 line-clamp-2 text-sm text-muted-foreground/80">{{ app.motivation }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
