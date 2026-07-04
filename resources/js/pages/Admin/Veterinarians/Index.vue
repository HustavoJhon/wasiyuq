<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { ShieldCheck, ShieldOff, Trash2, Star, MapPin, Phone } from 'lucide-vue-next';

interface Veterinarian {
    id: number;
    name: string;
    address: string;
    city: string | null;
    phone: string | null;
    is_verified: boolean;
    ratings_count: number;
    ratings_avg_rating: number | null;
}

interface Meta {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

defineProps<{ veterinarians: Veterinarian[]; meta: Meta }>();

function toggleVerification(id: number) {
    router.post('/admin/veterinarias/' + id + '/verificar', {}, { preserveState: true });
}

function deleteVet(id: number) {
    if (confirm('¿Eliminar esta veterinaria?')) {
        router.delete('/admin/veterinarias/' + id, { preserveState: true });
    }
}
</script>

<template>
    <div class="mx-auto max-w-6xl">
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-foreground">Veterinarias</h1>
            <p class="mt-1 text-sm text-muted-foreground">{{ meta.total }} veterinarias registradas en la plataforma.</p>
        </div>

        <div class="overflow-hidden rounded-xl border border-border/50 bg-card">
            <table class="w-full text-left text-sm">
                <thead class="border-b border-border/50 bg-muted text-xs font-medium text-muted-foreground uppercase">
                    <tr>
                        <th class="px-5 py-3">Nombre</th>
                        <th class="px-5 py-3">Ciudad</th>
                        <th class="px-5 py-3">Teléfono</th>
                        <th class="px-5 py-3">Calificación</th>
                        <th class="px-5 py-3">Estado</th>
                        <th class="px-5 py-3"></th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-border/50">
                    <tr v-for="v in veterinarians" :key="v.id" class="hover:bg-muted/30 transition-colors">
                        <td class="px-5 py-3.5"><p class="font-medium text-foreground">{{ v.name }}</p><p class="text-xs text-muted-foreground/70 truncate max-w-[250px]">{{ v.address }}</p></td>
                        <td class="px-5 py-3.5 text-muted-foreground">{{ v.city ?? '—' }}</td>
                        <td class="px-5 py-3.5 text-muted-foreground">{{ v.phone ?? '—' }}</td>
                        <td class="px-5 py-3.5"><span class="text-amber-500">{{ '★'.repeat(Math.round(v.ratings_avg_rating ?? 0)) }}{{ '☆'.repeat(5 - Math.round(v.ratings_avg_rating ?? 0)) }}</span> <span class="text-xs text-muted-foreground">({{ v.ratings_count }})</span></td>
                        <td class="px-5 py-3.5">
                            <span v-if="v.is_verified" class="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"><ShieldCheck class="h-3 w-3" /> Verificada</span>
                            <span v-else class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"><ShieldOff class="h-3 w-3" /> Sin verificar</span>
                        </td>
                        <td class="px-5 py-3.5">
                            <div class="flex items-center gap-1">
                                <button @click="toggleVerification(v.id)" class="rounded-lg p-1.5 text-muted-foreground transition hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950" :title="v.is_verified ? 'Desmarcar' : 'Verificar'">
                                    <ShieldCheck v-if="!v.is_verified" class="h-4 w-4" />
                                    <ShieldOff v-else class="h-4 w-4" />
                                </button>
                                <button @click="deleteVet(v.id)" class="rounded-lg p-1.5 text-muted-foreground transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950">
                                    <Trash2 class="h-4 w-4" />
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="veterinarians.length === 0">
                        <td colspan="6" class="px-5 py-12 text-center text-muted-foreground">No hay veterinarias registradas.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
