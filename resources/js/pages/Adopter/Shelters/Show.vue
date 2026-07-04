<script setup lang="ts">
import { useForm, usePage } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import { ArrowLeft, MapPin, Phone, Star, ShieldCheck, Mail, Globe, MessageCircle, Home, Navigation } from 'lucide-vue-next';

const page = usePage();
const isAuthenticated = computed(() => !!page.props.auth?.user);

interface Rating { id: number; rating: number; comment: string | null; created_at: string; user: { id: number; name: string }; }
interface Shelter { id: number; name: string; address: string; city: string | null; phone: string | null; whatsapp: string | null; email: string | null; website: string | null; description: string | null; services: string[] | null; capacity: number | null; is_verified: boolean; average_rating: number; ratings_count: number; ratings: Rating[]; }
interface UserRating { id: number; rating: number; comment: string | null; }

const props = defineProps<{ shelter: Shelter; userRating: UserRating | null }>();

const ratingForm = useForm({ rating: props.userRating?.rating ?? 0, comment: props.userRating?.comment ?? '' });
const hoverRating = ref(0);
const displayRating = computed(() => hoverRating.value || ratingForm.rating);

function setRating(n: number) { ratingForm.rating = n; }
function submitRating() { ratingForm.post('/mi-adopcion/albergues/' + props.shelter.id + '/calificar', { preserveState: true }); }
function renderStars(n: number): string[] { return Array.from({ length: 5 }, (_, i) => i < Math.round(n) ? '★' : '☆'); }
function formatDate(d: string): string { return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d)); }
function openMaps(s: Shelter) { if (s.latitude && s.longitude) window.open(`https://www.google.com/maps?q=${s.latitude},${s.longitude}`, '_blank'); else window.open(`https://www.google.com/maps/search/${encodeURIComponent(s.name + ' ' + s.address)}`, '_blank'); }
</script>

<template>
    <div class="mx-auto max-w-5xl">
        <a href="/mi-adopcion/albergues" class="mb-6 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted"><ArrowLeft class="h-4 w-4" /> Volver a albergues</a>

        <div class="grid gap-10 lg:grid-cols-5">
            <div class="lg:col-span-3 space-y-6">
                <div><div class="flex items-center gap-3 mb-3"><ShieldCheck v-if="shelter.is_verified" class="h-5 w-5 text-teal-500" /><span class="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"><MapPin class="h-3.5 w-3.5" />{{ shelter.city ?? 'Cusco' }}</span></div><h1 class="text-3xl font-bold text-foreground">{{ shelter.name }}</h1><div class="mt-2 flex items-center gap-2"><span class="text-xl text-amber-500">{{ renderStars(shelter.average_rating).join('') }}</span><span class="text-sm text-muted-foreground">{{ shelter.average_rating }} ({{ shelter.ratings_count }} calificaciones)</span></div></div>
                <div v-if="shelter.capacity" class="rounded-xl border border-border/50 bg-card p-4"><p class="text-xs text-muted-foreground">Capacidad</p><p class="mt-1 font-semibold text-foreground">{{ shelter.capacity }} animales</p></div>
                <div v-if="shelter.description" class="rounded-2xl border border-border/50 bg-card p-5"><p class="text-muted-foreground leading-relaxed text-sm whitespace-pre-wrap">{{ shelter.description }}</p></div>
                <div v-if="shelter.services?.length" class="rounded-2xl border border-border/50 bg-card p-5"><h3 class="text-sm font-semibold text-foreground mb-3">Servicios</h3><div class="flex flex-wrap gap-2"><span v-for="s in shelter.services" :key="s" class="rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 dark:bg-teal-950/30 dark:text-teal-400">{{ s }}</span></div></div>
                <button @click="openMaps(shelter)" class="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border/50 bg-card p-8 text-sm text-muted-foreground transition hover:border-teal-300 hover:text-teal-600"><Navigation class="h-5 w-5" />Ver en Google Maps — {{ shelter.address }}</button>

                <div v-if="shelter.ratings?.length" class="rounded-2xl border border-border/50 bg-card p-5"><h3 class="text-sm font-semibold text-foreground mb-4">Calificaciones</h3><div class="divide-y divide-border/50"><div v-for="r in shelter.ratings" :key="r.id" class="py-3 first:pt-0 last:pb-0"><div class="flex items-center gap-2"><div class="flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 text-[10px] font-bold text-teal-700">{{ r.user.name.charAt(0).toUpperCase() }}</div><span class="text-sm font-medium text-foreground">{{ r.user.name }}</span><span class="text-xs text-amber-500">{{ renderStars(r.rating).join('') }}</span></div><p v-if="r.comment" class="mt-1 ml-9 text-sm text-muted-foreground">{{ r.comment }}</p></div></div></div>
            </div>

            <div class="lg:col-span-2 space-y-5">
                <div class="rounded-2xl border border-border/50 bg-card p-5"><h3 class="text-sm font-semibold text-foreground mb-4">Contacto</h3><div class="space-y-2">
                    <a v-if="shelter.phone" :href="'tel:' + shelter.phone" class="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted hover:border-teal-300"><Phone class="h-4 w-4 text-teal-500" />{{ shelter.phone }}</a>
                    <a v-if="shelter.whatsapp" :href="'https://wa.me/51' + shelter.whatsapp.replace(/[^0-9]/g, '').replace(/^0+/, '')" target="_blank" class="flex items-center gap-3 rounded-xl border border-border bg-[#25D366]/5 px-4 py-3 text-sm font-medium text-foreground transition hover:bg-[#25D366]/10 hover:border-[#25D366]"><MessageCircle class="h-4 w-4 text-[#25D366]" />{{ shelter.whatsapp }}</a>
                    <a v-if="shelter.email" :href="'mailto:' + shelter.email" class="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted hover:border-teal-300"><Mail class="h-4 w-4 text-teal-500" />{{ shelter.email }}</a>
                    <a v-if="shelter.website" :href="shelter.website" target="_blank" class="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted hover:border-teal-300"><Globe class="h-4 w-4 text-teal-500" />Sitio web</a>
                </div></div>

                <div v-if="isAuthenticated" class="rounded-2xl border border-border/50 bg-card p-5"><h3 class="text-sm font-semibold text-foreground mb-4">{{ userRating ? 'Tu calificación' : 'Calificar albergue' }}</h3><div class="flex gap-1 mb-3"><button v-for="n in 5" :key="n" type="button" @click="setRating(n)" @mouseenter="hoverRating = n" @mouseleave="hoverRating = 0" class="text-2xl transition-colors" :class="n <= displayRating ? 'text-amber-500' : 'text-gray-300'">★</button></div><textarea v-model="ratingForm.comment" rows="2" placeholder="Deja un comentario..." class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-teal-300 mb-3" /><button @click="submitRating" :disabled="ratingForm.rating === 0 || ratingForm.processing" class="w-full rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2.5 text-sm font-medium text-white transition disabled:opacity-50">{{ userRating ? 'Actualizar' : 'Enviar calificación' }}</button></div>
            </div>
        </div>
    </div>
</template>
