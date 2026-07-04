<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { ShieldCheck, ShieldOff, Trash2, Star, MapPin, Phone } from 'lucide-vue-next';

interface Shelter { id: number; name: string; address: string; city: string | null; phone: string | null; is_verified: boolean; ratings_count: number; ratings_avg_rating: number | null; }
interface Meta { current_page: number; last_page: number; total: number; per_page: number; }
defineProps<{ shelters: Shelter[]; meta: Meta }>();

function toggleVerification(id: number) { router.post('/admin/albergues/' + id + '/verificar', {}, { preserveState: true }); }
function deleteShelter(id: number) { if (confirm('¿Eliminar este albergue?')) router.delete('/admin/albergues/' + id, { preserveState: true }); }
</script>

<template>
    <div class="mx-auto max-w-6xl">
        <div class="mb-6"><h1 class="text-2xl font-bold text-foreground">Albergues</h1><p class="mt-1 text-sm text-muted-foreground">{{ meta.total }} albergues registrados.</p></div>
        <div class="overflow-hidden rounded-xl border border-border/50 bg-card">
            <table class="w-full text-left text-sm">
                <thead class="border-b border-border/50 bg-muted text-xs font-medium text-muted-foreground uppercase"><tr><th class="px-5 py-3">Nombre</th><th class="px-5 py-3">Ciudad</th><th class="px-5 py-3">Teléfono</th><th class="px-5 py-3">Calificación</th><th class="px-5 py-3">Estado</th><th class="px-5 py-3"></th></tr></thead>
                <tbody class="divide-y divide-border/50">
                    <tr v-for="s in shelters" :key="s.id" class="hover:bg-muted/30 transition-colors">
                        <td class="px-5 py-3.5"><p class="font-medium text-foreground">{{ s.name }}</p><p class="text-xs text-muted-foreground/70 truncate max-w-[250px]">{{ s.address }}</p></td>
                        <td class="px-5 py-3.5 text-muted-foreground">{{ s.city ?? '—' }}</td>
                        <td class="px-5 py-3.5 text-muted-foreground">{{ s.phone ?? '—' }}</td>
                        <td class="px-5 py-3.5"><span class="text-amber-500">{{ '★'.repeat(Math.round(s.ratings_avg_rating ?? 0)) }}{{ '☆'.repeat(5 - Math.round(s.ratings_avg_rating ?? 0)) }}</span> <span class="text-xs text-muted-foreground">({{ s.ratings_count }})</span></td>
                        <td class="px-5 py-3.5"><span v-if="s.is_verified" class="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-medium text-teal-700"><ShieldCheck class="h-3 w-3" /> Verificado</span><span v-else class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600"><ShieldOff class="h-3 w-3" /> Sin verificar</span></td>
                        <td class="px-5 py-3.5"><div class="flex items-center gap-1"><button @click="toggleVerification(s.id)" class="rounded-lg p-1.5 text-muted-foreground transition hover:bg-teal-50 hover:text-teal-600"><ShieldCheck v-if="!s.is_verified" class="h-4 w-4" /><ShieldOff v-else class="h-4 w-4" /></button><button @click="deleteShelter(s.id)" class="rounded-lg p-1.5 text-muted-foreground transition hover:bg-red-50 hover:text-red-600"><Trash2 class="h-4 w-4" /></button></div></td>
                    </tr>
                    <tr v-if="shelters.length === 0"><td colspan="6" class="px-5 py-12 text-center text-muted-foreground">No hay albergues registrados.</td></tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
