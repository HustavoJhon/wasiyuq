<script setup lang="ts">
import { useForm, usePage } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import { ArrowLeft, MapPin, Phone, Star, Globe, MessageCircle, PawPrint, Calendar, Heart, Edit, Share2, DollarSign, Camera, Facebook, Instagram, Youtube } from 'lucide-vue-next';
import { usePhotoUrl } from '@/composables/usePhotoUrl';

const { photoUrl } = usePhotoUrl();
const page = usePage();
const isAuthenticated = computed(() => !!page.props.auth?.user);
const currentTeam = computed(() => page.props.currentTeam as { slug: string; isPersonal: boolean } | null);

interface Rating { id: number; rating: number; comment: string | null; created_at: string; user: { id: number; name: string }; }
interface Albergue { id: number; name: string; slug: string; bio: string | null; logo: string | null; address: string | null; city: string | null; phone: string | null; website: string | null; social_links: Record<string,string> | null; map_embed: string | null; gallery: string[] | null; support_info: Record<string,string> | null; average_rating: number; ratings_count: number; ratings: Rating[]; }
interface UserRating { id: number; rating: number; comment: string | null; }
interface Stats { pets_count: number; available_pets: number; adopted_pets: number; events_count: number; }

const props = defineProps<{ albergue: Albergue; userRating: UserRating | null; stats: Stats }>();

const canEdit = computed(() => currentTeam.value?.slug === props.albergue.slug && !currentTeam.value?.isPersonal);

const ratingForm = useForm({ rating: props.userRating?.rating ?? 0, comment: props.userRating?.comment ?? '' });
const hoverRating = ref(0);
const displayRating = computed(() => hoverRating.value || ratingForm.rating);
function setRating(n: number) { ratingForm.rating = n; }
function submitRating() { ratingForm.post('/mi-adopcion/albergues/' + props.albergue.slug + '/calificar', { preserveState: true }); }
function renderStars(n: number): string[] { return Array.from({ length: 5 }, (_, i) => i < Math.round(n) ? '★' : '☆'); }
function formatDate(d: string): string { return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d)); }

const socialIcons: Record<string, any> = { facebook: Facebook, instagram: Camera, twitter: Share2, youtube: Youtube };
</script>

<template>
    <div class="mx-auto max-w-5xl">
        <div class="flex items-center justify-between mb-6">
            <a href="/mi-adopcion/albergues" class="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted"><ArrowLeft class="h-4 w-4" /> Volver a albergues</a>
            <a v-if="canEdit" :href="'/' + albergue.slug + '/perfil'" class="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"><Edit class="h-4 w-4" /> Editar perfil</a>
        </div>

        <!-- Header compact -->
        <div class="mb-6 flex items-center gap-4 rounded-xl border border-border/50 bg-card p-4">
            <div class="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                <img v-if="albergue.logo" :src="photoUrl(albergue.logo)" :alt="albergue.name" class="h-full w-full object-cover" />
                <div v-else class="flex h-full items-center justify-center text-teal-500"><PawPrint class="h-7 w-7" /></div>
            </div>
            <div class="min-w-0 flex-1">
                <h1 class="text-lg font-bold text-foreground truncate">{{ albergue.name }}</h1>
                <div class="flex items-center gap-2 text-sm">
                    <span class="text-amber-500">{{ renderStars(albergue.average_rating ?? 0).join('') }}</span>
                    <span class="text-muted-foreground">{{ albergue.average_rating }} <span class="text-xs opacity-60">({{ albergue.ratings_count }})</span></span>
                    <span v-if="albergue.city" class="text-muted-foreground/50 text-xs flex items-center gap-1"><MapPin class="h-3 w-3" />{{ albergue.city }}</span>
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
                <div v-if="albergue.bio" class="rounded-2xl border border-border/50 bg-card p-6">
                    <h3 class="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Heart class="h-4 w-4 text-teal-500" /> Sobre nosotros</h3>
                    <p class="text-muted-foreground leading-relaxed text-sm whitespace-pre-wrap">{{ albergue.bio }}</p>
                </div>

                <!-- Redes sociales -->
                <div v-if="albergue.social_links && Object.values(albergue.social_links).filter(Boolean).length" class="rounded-2xl border border-border/50 bg-card p-5">
                    <h3 class="text-sm font-semibold text-foreground mb-3">Redes sociales</h3>
                    <div class="flex flex-wrap gap-2">
                        <a v-for="(url, platform) in albergue.social_links" :key="platform" v-if="url" :href="url" target="_blank"
                            class="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
                            <component :is="socialIcons[platform]" v-if="socialIcons[platform]" class="h-3.5 w-3.5" />
                            <Globe v-else class="h-3.5 w-3.5" />
                            {{ platform }}
                        </a>
                    </div>
                </div>

                <!-- Map -->
                <div v-if="albergue.map_embed" class="rounded-2xl border border-border/50 bg-card overflow-hidden">
                    <div class="px-5 pt-5"><h3 class="text-sm font-semibold text-foreground flex items-center gap-2"><MapPin class="h-4 w-4 text-teal-500" /> Ubicación</h3></div>
                    <div class="p-3"><div class="overflow-hidden rounded-xl" v-html="albergue.map_embed" style="height: 300px;" /></div>
                </div>

                <!-- Gallery -->
                <div v-if="albergue.gallery?.length" class="rounded-2xl border border-border/50 bg-card p-5">
                    <h3 class="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Camera class="h-4 w-4 text-teal-500" /> Galería</h3>
                    <div class="grid grid-cols-3 gap-2">
                        <div v-for="(url, i) in albergue.gallery" :key="i" class="aspect-square overflow-hidden rounded-xl border border-border bg-muted">
                            <img :src="url" :alt="albergue.name + ' ' + (i+1)" class="h-full w-full object-cover" />
                        </div>
                    </div>
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
                        <a :href="'/mascotas?team=' + albergue.slug" class="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted hover:border-teal-300"><PawPrint class="h-4 w-4 text-teal-500" />Ver mascotas</a>
                    </div>
                </div>

                <!-- Support info -->
                <div v-if="albergue.support_info && Object.keys(albergue.support_info).length" class="rounded-2xl border border-border/50 bg-card p-5">
                    <h3 class="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><DollarSign class="h-4 w-4 text-teal-500" /> Cuentas de apoyo / donaciones</h3>
                    <div class="space-y-2">
                        <div v-for="(value, key) in albergue.support_info" :key="key"
                            class="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm"
                            v-show="value">
                            <span class="text-muted-foreground uppercase text-xs font-semibold">{{ key }}</span>
                            <span class="font-medium text-foreground">{{ value || '—' }}</span>
                        </div>
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
