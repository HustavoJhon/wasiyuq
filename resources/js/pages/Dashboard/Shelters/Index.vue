<script setup lang="ts">
import { router, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';
import { Plus, Trash2, Star, MapPin, Phone, X, Home } from 'lucide-vue-next';

interface Shelter { id: number; name: string; address: string; city: string | null; phone: string | null; whatsapp: string | null; is_verified: boolean; ratings_count: number; ratings_avg_rating: number | null; services: string[] | null; }
interface Meta { current_page: number; last_page: number; total: number; per_page: number; }
defineProps<{ shelters: Shelter[]; meta: Meta }>();

const showForm = ref(false);
const form = useForm({ name: '', address: '', city: 'Cusco', phone: '', whatsapp: '', email: '', website: '', description: '', capacity: null as number | null, services: [] as string[] });
const serviceOptions = ['Adopciones', 'Rescate', 'Esterilización', 'Vacunación', 'Desparasitación', 'Emergencias', 'Hospedaje temporal', 'Voluntariado', 'Donaciones', 'Educación', 'Eventos comunitarios', 'Transporte animal'];
function toggleService(s: string) { const i = form.services.indexOf(s); if (i >= 0) form.services.splice(i, 1); else form.services.push(s); }
function submit() { form.post(window.location.pathname, { preserveState: true, onSuccess: () => { showForm.value = false; form.reset(); } }); }
function deleteShelter(id: number) { if (confirm('¿Eliminar este albergue?')) router.delete(window.location.pathname + '/' + id, { preserveState: true }); }
</script>

<template>
    <div class="mx-auto max-w-5xl">
        <div class="flex items-center justify-between mb-6"><div><h1 class="text-2xl font-bold text-foreground">Albergues</h1><p class="mt-1 text-sm text-muted-foreground">{{ meta.total }} albergues de tu organización.</p></div><button @click="showForm = true" class="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"><Plus class="h-4 w-4" /> Agregar</button></div>
        <div v-if="shelters.length === 0" class="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-card py-16"><Home class="h-12 w-12 text-muted-foreground/25" /><p class="mt-3 text-muted-foreground">No hay albergues registrados.</p><button @click="showForm = true" class="mt-4 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-white"><Plus class="h-4 w-4" /> Agregar el primero</button></div>
        <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="s in shelters" :key="s.id" class="rounded-xl border border-border/50 bg-card p-5">
                <div class="flex items-start justify-between"><span class="font-semibold text-foreground">{{ s.name }}</span><button @click="deleteShelter(s.id)" class="rounded-lg p-1 text-muted-foreground transition hover:bg-red-50 hover:text-red-600"><Trash2 class="h-4 w-4" /></button></div>
                <div class="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin class="h-3 w-3" />{{ s.address }}</div>
                <div class="mt-2 flex items-center gap-2"><span class="text-sm text-amber-500">{{ '★'.repeat(Math.round(s.ratings_avg_rating ?? 0)) }}</span><span class="text-xs text-muted-foreground">({{ s.ratings_count }})</span></div>
                <div v-if="s.services" class="mt-3 flex flex-wrap gap-1"><span v-for="sv in s.services.slice(0, 4)" :key="sv" class="rounded-md bg-teal-50 px-2 py-0.5 text-[10px] text-teal-700">{{ sv }}</span></div>
                <div v-if="s.phone" class="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><Phone class="h-3 w-3" />{{ s.phone }}</div>
                <div v-if="s.whatsapp" class="mt-1 text-xs text-[#25D366]">WA: {{ s.whatsapp }}</div>
            </div>
        </div>

        <Teleport to="body">
            <div v-if="showForm" class="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm p-4 pt-10 sm:pt-20" @click.self="showForm = false">
                <div class="relative w-full max-w-xl rounded-2xl border border-border/50 bg-card shadow-2xl" @click.stop>
                    <div class="flex items-center justify-between border-b border-border/50 px-6 py-4"><h2 class="text-lg font-semibold">Agregar albergue</h2><button @click="showForm = false" class="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"><X class="h-5 w-5" /></button></div>
                    <form @submit.prevent="submit" class="space-y-4 p-6">
                        <div class="grid gap-4 sm:grid-cols-2"><div><label class="block text-sm font-medium mb-1.5">Nombre *</label><input v-model="form.name" type="text" required class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-teal-500" /></div><div><label class="block text-sm font-medium mb-1.5">Ciudad</label><input v-model="form.city" type="text" class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-teal-500" /></div></div>
                        <div><label class="block text-sm font-medium mb-1.5">Dirección *</label><input v-model="form.address" type="text" required class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-teal-500" /></div>
                        <div class="grid gap-4 sm:grid-cols-3"><div><label class="block text-sm font-medium mb-1.5">Teléfono</label><input v-model="form.phone" type="text" class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-teal-500" /></div><div><label class="block text-sm font-medium mb-1.5">WhatsApp</label><input v-model="form.whatsapp" type="text" class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-teal-500" /></div><div><label class="block text-sm font-medium mb-1.5">Capacidad</label><input v-model.number="form.capacity" type="number" min="1" class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-teal-500" /></div></div>
                        <div><label class="block text-sm font-medium mb-1.5">Servicios</label><div class="flex flex-wrap gap-2"><button v-for="s in serviceOptions" :key="s" type="button" @click="toggleService(s)" class="rounded-lg border px-3 py-1.5 text-xs font-medium transition" :class="form.services.includes(s) ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-border text-muted-foreground hover:border-teal-300'">{{ s }}</button></div></div>
                        <div><label class="block text-sm font-medium mb-1.5">Descripción</label><textarea v-model="form.description" rows="2" class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-teal-500" /></div>
                        <div class="flex items-center justify-end gap-3 border-t border-border/50 pt-4"><button type="button" @click="showForm = false" class="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted">Cancelar</button><button type="submit" :disabled="form.processing" class="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition disabled:opacity-50">Agregar</button></div>
                    </form>
                </div>
            </div>
        </Teleport>
    </div>
</template>
