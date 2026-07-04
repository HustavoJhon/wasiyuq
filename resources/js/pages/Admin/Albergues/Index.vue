<script setup lang="ts">
import { PawPrint, Star, MapPin, Phone, Globe } from 'lucide-vue-next';

interface Albergue { id: number; name: string; slug: string; city: string | null; phone: string | null; website: string | null; pets_count: number; ratings_count: number; ratings_avg_rating: number | null; }
interface Meta { current_page: number; last_page: number; total: number; per_page: number; }
defineProps<{ albergues: Albergue[]; meta: Meta }>();
</script>

<template>
    <div class="mx-auto max-w-6xl">
        <div class="mb-6"><h1 class="text-2xl font-bold text-foreground">Albergues</h1><p class="mt-1 text-sm text-muted-foreground">{{ meta.total }} organizaciones registradas.</p></div>
        <div class="overflow-hidden rounded-xl border border-border/50 bg-card">
            <table class="w-full text-left text-sm">
                <thead class="border-b border-border/50 bg-muted text-xs font-medium text-muted-foreground uppercase"><tr><th class="px-5 py-3">Nombre</th><th class="px-5 py-3">Ciudad</th><th class="px-5 py-3">Contacto</th><th class="px-5 py-3">Mascotas</th><th class="px-5 py-3">Calificación</th></tr></thead>
                <tbody class="divide-y divide-border/50">
                    <tr v-for="a in albergues" :key="a.id" class="hover:bg-muted/30 transition-colors">
                        <td class="px-5 py-3.5"><a :href="'/mi-adopcion/albergues/' + a.slug" class="font-medium text-foreground hover:text-teal-600">{{ a.name }}</a></td>
                        <td class="px-5 py-3.5 text-muted-foreground">{{ a.city ?? '—' }}</td>
                        <td class="px-5 py-3.5 text-muted-foreground text-xs"><div v-if="a.phone" class="flex items-center gap-1"><Phone class="h-3 w-3" />{{ a.phone }}</div><div v-if="a.website" class="flex items-center gap-1 mt-0.5"><Globe class="h-3 w-3" />{{ a.website }}</div></td>
                        <td class="px-5 py-3.5"><span class="inline-flex items-center gap-1 text-muted-foreground"><PawPrint class="h-3.5 w-3.5" />{{ a.pets_count }}</span></td>
                        <td class="px-5 py-3.5"><span class="text-amber-500">{{ '★'.repeat(Math.round(a.ratings_avg_rating ?? 0)) }}</span> <span class="text-xs text-muted-foreground">({{ a.ratings_count }})</span></td>
                    </tr>
                    <tr v-if="albergues.length === 0"><td colspan="5" class="px-5 py-12 text-center text-muted-foreground">No hay organizaciones registradas.</td></tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
