<script setup lang="ts">
import { usePhotoUrl } from '@/composables/usePhotoUrl';
import { Clock, CheckCircle, XCircle, ArrowRight, PawPrint } from 'lucide-vue-next';
import { computed } from 'vue';

const { photoUrl } = usePhotoUrl();

interface FollowUp { id: number; scheduled_date: string; completed_date: string | null; status: string; notes: string | null; adoption: { id: number; pet: { id: number; name: string; slug: string; species: string; photos: string[] | null }; team: { id: number; name: string; slug: string } }; }
const props = defineProps<{ followUps: FollowUp[] }>();

const stats = computed(() => ({ total: props.followUps.length, pending: props.followUps.filter(f => f.status === 'pending').length, completed: props.followUps.filter(f => f.status === 'completed').length }));

function statusClass(s: string) { const m: Record<string, string> = { pending: 'bg-amber-100 text-amber-700', completed: 'bg-green-100 text-green-700', missed: 'bg-red-100 text-red-700' }; return m[s] ?? 'bg-gray-100 text-gray-600'; }
function statusLabel(s: string) { const l: Record<string, string> = { pending: 'Pendiente', completed: 'Completado', missed: 'No Realizado' }; return l[s] ?? s; }
function speciesLabel(s: string) { const l: Record<string, string> = { dog: 'Perro', cat: 'Gato', other: 'Otro' }; return l[s] ?? s; }
function formatDate(d: string) { return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d)); }
</script>

<template>
    <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><h1 class="text-2xl font-bold text-foreground">Mi Seguimiento</h1><p class="mt-1 text-sm text-muted-foreground">Historial de seguimiento post-adopción.</p></div>
            <a href="/mi-adopcion/postulaciones" class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2D6A4F] to-[#40916C] px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-[#2D6A4F]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all">Mis postulaciones <ArrowRight class="h-4 w-4" /></a>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div class="rounded-xl border border-border/50 bg-card p-4"><p class="text-xs font-medium text-muted-foreground/70 uppercase">Total</p><p class="mt-1 text-2xl font-bold text-foreground">{{ stats.total }}</p></div>
            <div class="rounded-xl border border-amber-200/60 bg-amber-50/30 p-4 dark:border-amber-900/30 dark:bg-amber-950/20"><p class="text-xs font-medium text-amber-700/70 uppercase">Pendientes</p><p class="mt-1 text-2xl font-bold text-amber-700 dark:text-amber-400">{{ stats.pending }}</p></div>
            <div class="rounded-xl border border-emerald-200/60 bg-emerald-50/30 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20"><p class="text-xs font-medium text-emerald-700/70 uppercase">Completados</p><p class="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-400">{{ stats.completed }}</p></div>
        </div>

        <div v-if="followUps.length === 0" class="mt-16 flex flex-col items-center"><Clock class="h-16 w-16 text-muted-foreground/20" /><p class="mt-4 text-muted-foreground">No tienes seguimientos pendientes.</p></div>

        <div v-else class="mt-8 space-y-4">
            <div v-for="fu in followUps" :key="fu.id" class="rounded-xl border border-border/50 bg-card p-5 transition hover:shadow-sm">
                <div class="flex items-start gap-4">
                    <div class="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted"><img v-if="fu.adoption.pet.photos?.length" :src="photoUrl(fu.adoption.pet.photos[0])" :alt="fu.adoption.pet.name" class="h-full w-full object-cover" /><PawPrint v-else class="m-4 h-12 w-12 text-muted-foreground/20" /></div>
                    <div class="min-w-0 flex-1"><div class="flex items-start justify-between gap-2"><div><h3 class="text-lg font-semibold text-foreground">{{ fu.adoption.pet.name }}</h3><p class="text-sm text-muted-foreground">{{ speciesLabel(fu.adoption.pet.species) }} — {{ fu.adoption.team.name }}</p></div><span class="shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium" :class="statusClass(fu.status)"><Clock v-if="fu.status === 'pending'" class="h-3 w-3" /><CheckCircle v-else-if="fu.status === 'completed'" class="h-3 w-3" /><XCircle v-else class="h-3 w-3" />{{ statusLabel(fu.status) }}</span></div><p v-if="fu.notes" class="mt-2 text-sm text-muted-foreground/80 line-clamp-2">{{ fu.notes }}</p><div class="mt-3 flex items-center justify-between"><p class="text-xs text-muted-foreground/70">Programado: {{ formatDate(fu.scheduled_date) }}</p><a v-if="fu.status === 'pending'" :href="'/mi-adopcion/seguimientos/' + fu.id" class="inline-flex items-center gap-1 text-sm font-medium text-[#2D6A4F] hover:underline">Reportar <ArrowRight class="h-3 w-3" /></a></div></div>
                </div>
            </div>
        </div>
    </div>
</template>
