<script setup lang="ts">
import { router, useForm, usePage } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import {
    ArrowLeft, MapPin, Phone, Star, ShieldCheck, Mail, Globe,
    MessageCircle, Clock, User, Navigation,
} from 'lucide-vue-next';

const page = usePage();
const isAuthenticated = computed(() => !!page.props.auth?.user);

interface Rating {
    id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    user: { id: number; name: string };
}

interface Veterinarian {
    id: number;
    name: string;
    address: string;
    city: string | null;
    phone: string | null;
    whatsapp: string | null;
    email: string | null;
    website: string | null;
    description: string | null;
    services: string[] | null;
    photos: string[] | null;
    is_verified: boolean;
    average_rating: number;
    ratings_count: number;
    latitude: number | null;
    longitude: number | null;
    ratings: Rating[];
}

interface UserRating {
    id: number;
    rating: number;
    comment: string | null;
}

const props = defineProps<{ veterinarian: Veterinarian; userRating: UserRating | null }>();

const ratingForm = useForm({
    rating: props.userRating?.rating ?? 0,
    comment: props.userRating?.comment ?? '',
});

const hoverRating = ref(0);
const displayRating = computed(() => hoverRating.value || ratingForm.rating);

function setRating(n: number) {
    ratingForm.rating = n;
}

function submitRating() {
    ratingForm.post('/veterinarias/' + props.veterinarian.id + '/calificar', {
        preserveState: true,
    });
}

function renderStars(n: number, interactive = false): string[] {
    return Array.from({ length: 5 }, (_, i) => {
        if (interactive && i < displayRating.value) return '★';
        if (i < Math.round(n)) return '★';
        return '☆';
    });
}

function formatDate(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d));
}

function openMaps(vet: Veterinarian) {
    if (vet.latitude && vet.longitude) {
        window.open(`https://www.google.com/maps?q=${vet.latitude},${vet.longitude}`, '_blank');
    } else {
        window.open(`https://www.google.com/maps/search/${encodeURIComponent(vet.name + ' ' + vet.address)}`, '_blank');
    }
}
</script>

<template>
    <div class="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div class="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
            <a href="/veterinarias" class="mb-6 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
                <ArrowLeft class="h-4 w-4" /> Volver a veterinarias
            </a>

            <div class="grid gap-10 lg:grid-cols-5">
                <div class="lg:col-span-3 space-y-6">
                    <!-- Header -->
                    <div>
                        <div class="flex items-center gap-3 mb-3">
                            <ShieldCheck v-if="veterinarian.is_verified" class="h-5 w-5 text-blue-500" title="Verificada" />
                            <span class="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                                <MapPin class="h-3.5 w-3.5" />
                                {{ veterinarian.city ?? 'Cusco' }}
                            </span>
                        </div>
                        <h1 class="text-3xl font-bold text-foreground">{{ veterinarian.name }}</h1>
                        <div class="mt-2 flex items-center gap-2">
                            <span class="text-xl text-amber-500">{{ renderStars(veterinarian.average_rating).join('') }}</span>
                            <span class="text-sm text-muted-foreground">{{ veterinarian.average_rating }} ({{ veterinarian.ratings_count }} calificaciones)</span>
                        </div>
                    </div>

                    <!-- Description -->
                    <div v-if="veterinarian.description" class="rounded-2xl border border-border/50 bg-card p-5">
                        <p class="text-muted-foreground leading-relaxed text-sm whitespace-pre-wrap">{{ veterinarian.description }}</p>
                    </div>

                    <!-- Services -->
                    <div v-if="veterinarian.services?.length" class="rounded-2xl border border-border/50 bg-card p-5">
                        <h3 class="text-sm font-semibold text-foreground mb-3">Servicios</h3>
                        <div class="flex flex-wrap gap-2">
                            <span v-for="s in veterinarian.services" :key="s" class="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">{{ s }}</span>
                        </div>
                    </div>

                    <!-- Map placeholder -->
                    <button @click="openMaps(veterinarian)"
                        class="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border/50 bg-card p-8 text-sm text-muted-foreground transition hover:border-blue-300 hover:text-blue-600">
                        <Navigation class="h-5 w-5" />
                        Ver en Google Maps — {{ veterinarian.address }}
                    </button>

                    <!-- Ratings list -->
                    <div v-if="veterinarian.ratings?.length" class="rounded-2xl border border-border/50 bg-card p-5">
                        <h3 class="text-sm font-semibold text-foreground mb-4">Calificaciones</h3>
                        <div class="divide-y divide-border/50">
                            <div v-for="r in veterinarian.ratings" :key="r.id" class="py-3 first:pt-0 last:pb-0">
                                <div class="flex items-center gap-2">
                                    <div class="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700 dark:bg-blue-950/40">
                                        {{ r.user.name.charAt(0).toUpperCase() }}
                                    </div>
                                    <span class="text-sm font-medium text-foreground">{{ r.user.name }}</span>
                                    <span class="text-xs text-amber-500">{{ renderStars(r.rating).join('') }}</span>
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
                            <a v-if="veterinarian.phone" :href="'tel:' + veterinarian.phone"
                                class="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted hover:border-blue-300">
                                <Phone class="h-4 w-4 text-blue-500" /> {{ veterinarian.phone }}
                            </a>
                            <a v-if="veterinarian.whatsapp" :href="'https://wa.me/51' + veterinarian.whatsapp.replace(/[^0-9]/g, '').replace(/^0+/, '')"
                                target="_blank" class="flex items-center gap-3 rounded-xl border border-border bg-[#25D366]/5 px-4 py-3 text-sm font-medium text-foreground transition hover:bg-[#25D366]/10 hover:border-[#25D366]">
                                <MessageCircle class="h-4 w-4 text-[#25D366]" /> {{ veterinarian.whatsapp }}
                            </a>
                            <a v-if="veterinarian.email" :href="'mailto:' + veterinarian.email"
                                class="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted hover:border-blue-300">
                                <Mail class="h-4 w-4 text-blue-500" /> {{ veterinarian.email }}
                            </a>
                            <a v-if="veterinarian.website" :href="veterinarian.website" target="_blank"
                                class="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted hover:border-blue-300">
                                <Globe class="h-4 w-4 text-blue-500" /> Sitio web
                            </a>
                        </div>
                    </div>

                    <!-- Map button -->
                    <button @click="openMaps(veterinarian)" class="w-full rounded-2xl border border-border/50 bg-card p-4 text-left transition hover:border-blue-300">
                        <div class="flex items-center gap-3">
                            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/30">
                                <Navigation class="h-5 w-5" />
                            </div>
                            <div>
                                <p class="text-sm font-medium text-foreground">Cómo llegar</p>
                                <p class="text-xs text-muted-foreground mt-0.5">{{ veterinarian.address }}</p>
                            </div>
                        </div>
                    </button>

                    <!-- Rating form -->
                    <div v-if="isAuthenticated" class="rounded-2xl border border-border/50 bg-card p-5">
                        <h3 class="text-sm font-semibold text-foreground mb-4">
                            {{ userRating ? 'Tu calificación' : 'Calificar veterinaria' }}
                        </h3>
                        <div class="flex gap-1 mb-3">
                            <button v-for="n in 5" :key="n" type="button"
                                @click="setRating(n)"
                                @mouseenter="hoverRating = n"
                                @mouseleave="hoverRating = 0"
                                class="text-2xl transition-colors"
                                :class="n <= displayRating ? 'text-amber-500' : 'text-gray-300'">
                                ★
                            </button>
                        </div>
                        <textarea v-model="ratingForm.comment" rows="2" placeholder="Deja un comentario (opcional)..."
                            class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-blue-300 mb-3" />
                        <button @click="submitRating" :disabled="ratingForm.rating === 0 || ratingForm.processing"
                            class="w-full rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] px-4 py-2.5 text-sm font-medium text-white transition disabled:opacity-50">
                            {{ userRating ? 'Actualizar calificación' : 'Enviar calificación' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
