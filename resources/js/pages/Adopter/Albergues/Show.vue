<script setup lang="ts">
import { useForm, usePage } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import { ArrowLeft, MapPin, Phone, Star, Globe, MessageCircle, PawPrint, Calendar, Heart, Mail, Users } from 'lucide-vue-next';
import { usePhotoUrl } from '@/composables/usePhotoUrl';

const { photoUrl } = usePhotoUrl();
const page = usePage();
const isAuthenticated = computed(() => !!page.props.auth?.user);

interface Rating { id: number; rating: number; comment: string | null; created_at: string; user: { id: number; name: string }; }
interface Albergue { id: number; name: string; slug: string; bio: string | null; logo: string | null; address: string | null; city: string | null; phone: string | null; website: string | null; social_links: any; average_rating: number; ratings_count: number; ratings: Rating[]; }
interface UserRating { id: number; rating: number; comment: string | null; }
interface Stats { pets_count: number; available_pets: number; adopted_pets: number; events_count: number; }

const props = defineProps<{ albergue: Albergue; userRating: UserRating | null; stats: Stats }>();

const ratingForm = useForm({ rating: props.userRating?.rating ?? 0, comment: props.userRating?.comment ?? '' });
const hoverRating = ref(0);
const displayRating = computed(() => hoverRating.value || ratingForm.rating);
function setRating(n: number) { ratingForm.rating = n; }
function submitRating() { ratingForm.post('/mi-adopcion/albergues/' + props.albergue.slug + '/calificar', { preserveState: true }); }
function renderStars(n: number): string[] { return Array.from({ length: 5 }, (_, i) => i < Math.round(n) ? '★' : '☆'); }
function formatDate(d: string): string { return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d)); }
</script>

<template>
    <div class="mx-auto max-w-5xl">
        <a href="/mi-adopcion/albergues" class="mb-6 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted"><ArrowLeft class="h-4 w-4" /> Volver a albergues</a>

        <!-- Header -->
        <div class="mb-8 rounded-2xl border border-border/50 bg-card overflow-hidden">
            <div class="h-32 bg-gradient-to-r from-teal-600 to-teal-400"></div>
            <div class="-mt-12 px-6 pb-6">
                <div class="flex items-end gap-4">
                    <div class="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-card bg-white shadow-md">
                        <img v-if="albergue.logo" :src="photoUrl(albergue.logo)" :alt="albergue.name" class="h-full w-full object-cover" />
                        <div v-else class="flex h-full items-center justify-center bg-teal-100 text-teal-600"><PawPrint class="h-10 w-10" /></div>
                    </div>
                    <div class="pb-1 flex-1">
                        <h1 class="text-2xl font-bold text-foreground">{{ albergue.name }}</h1>
                        <div class="flex items-center gap-2 mt-1">
                            <span class="text-amber-500">{{ renderStars(albergue.average_rating ?? 0).join('') }}</span>
                            <span class="text-sm text-muted-foreground">{{ albergue.average_rating }} ({{ albergue.ratings_count }} calificaciones)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid gap-10 lg:grid-cols-5">
            <div class="lg:col-span-3 space-y-6">
                <!-- Stats -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div class="rounded-xl border border-border/50 bg-card p-4 text-center"><p class="text-2xl font-bold text-foreground">{{ stats.pets_count }}</p><p class="text-xs text-muted-foreground mt-1">Mascotas</p></div>
                    <div class="rounded-xl border border-border/50 bg-card p-4 text-center"><p class="text-2xl font-bold text-emerald-600">{{ stats.available_pets }}</p><p class="text-xs text-muted-foreground mt-1">Disponibles</p></div>
                    <div class="rounded-xl border border-border/50 bg-card p-4 text-center"><p class="text-2xl font-bold text-blue-600">{{ stats.adopted_pets }}</p><p class="text-xs text-muted-foreground mt-1">Adoptadas</p></div>
                    <div class="rounded-xl border border-border/50 bg-card p-4 text-center"><p class="text-2xl font-bold text-amber-600">{{ stats.events_count }}</p><p class="text-xs text-muted-foreground mt-1">Eventos</p></div>
                </div>

                <!-- Bio -->
                <div v-if="albergue.bio" class="rounded-2xl border border-border/50 bg-card p-5">
                    <h3 class="text-sm font-semibold text-foreground mb-2">Sobre nosotros</h3>
                    <p class="text-muted-foreground leading-relaxed text-sm whitespace-pre-wrap">{{ albergue.bio }}</p>
                </div>

                <!-- Ratings list -->
                <div v-if="albergue.ratings?.length" class="rounded-2xl border border-border/50 bg-card p-5">
                    <h3 class="text-sm font-semibold text-foreground mb-4">Comentarios</h3>
                    <div class="divide-y divide-border/50">
                        <div v-for="r in albergue.ratings" :key="r.id" class="py-3 first:pt-0 last:pb-0">
                            <div class="flex items-center gap-2">
                                <div class="flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 text-[10px] font-bold text-teal-700">{{ r.user.name.charAt(0).toUpperCase() }}</div>
                                <span class="text-sm font-medium text-foreground">{{ r.user.name }}</span>
                                <span class="text-xs text-amber-500">{{ renderStars(r.rating).join('') }}</span>
                                <span class="text-[10px] text-muted-foreground/50 ml-auto">{{ formatDate(r.created_at) }}</span>
                            </div>
                            <p v-if="r.comment" class="mt-1 ml-9 text-sm text-muted-foreground">{{ r.comment }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sidebar -->
            <div class="lg:col-span-2 space-y-5">
                <!-- Contact -->
                <div class="rounded-2xl border border-border/50 bg-card p-5">
                    <h3 class="text-sm font-semibold text-foreground mb-4">Contacto</h3>
                    <div class="space-y-2">
                        <div v-if="albergue.address" class="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground"><MapPin class="h-4 w-4 text-teal-500 shrink-0" />{{ albergue.address }}{{ albergue.city ? ', ' + albergue.city : '' }}</div>
                        <a v-if="albergue.phone" :href="'tel:' + albergue.phone" class="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted hover:border-teal-300"><Phone class="h-4 w-4 text-teal-500" />{{ albergue.phone }}</a>
                        <a v-if="albergue.website" :href="albergue.website" target="_blank" class="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted hover:border-teal-300"><Globe class="h-4 w-4 text-teal-500" />Sitio web</a>
                        <a :href="'/mascotas?team=' + albergue.slug" class="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted hover:border-teal-300"><PawPrint class="h-4 w-4 text-teal-500" />Ver mascotas de {{ albergue.name }}</a>
                    </div>
                </div>

                <!-- Rating form -->
                <div v-if="isAuthenticated" class="rounded-2xl border border-border/50 bg-card p-5">
                    <h3 class="text-sm font-semibold text-foreground mb-4">{{ userRating ? 'Tu calificación' : 'Calificar albergue' }}</h3>
                    <div class="flex gap-1 mb-3"><button v-for="n in 5" :key="n" type="button" @click="setRating(n)" @mouseenter="hoverRating = n" @mouseleave="hoverRating = 0" class="text-2xl transition-colors" :class="n <= displayRating ? 'text-amber-500' : 'text-gray-300'">★</button></div>
                    <textarea v-model="ratingForm.comment" rows="2" placeholder="Deja un comentario..." class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-teal-300 mb-3" />
                    <button @click="submitRating" :disabled="ratingForm.rating === 0 || ratingForm.processing" class="w-full rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2.5 text-sm font-medium text-white transition disabled:opacity-50">{{ userRating ? 'Actualizar' : 'Enviar calificación' }}</button>
                </div>
            </div>
        </div>
    </div>
</template>
