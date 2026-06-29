<script setup lang="ts">
import {
    Dog, Cat, Rabbit, Bird, PawPrint, MapPin, Phone, Mail,
    Calendar, ChevronLeft, ArrowLeft, Clock, CheckCircle2,
    Share2, MessageCircle,
} from 'lucide-vue-next';
import { usePhotoUrl } from '@/composables/usePhotoUrl';

const { photoUrl } = usePhotoUrl();

interface LostPet {
    id: number;
    name: string | null;
    species: string;
    breed: string | null;
    color: string | null;
    size: string | null;
    age_description: string | null;
    description: string | null;
    last_seen_location: string;
    last_seen_date: string;
    contact_phone: string | null;
    contact_email: string | null;
    photos: string[] | null;
    status: 'lost' | 'found';
    is_resolved: boolean;
    created_at: string;
    updated_at: string;
    team: { id: number; name: string; slug: string; city: string | null } | null;
}

defineProps<{ pet: LostPet }>();

function speciesLabel(s: string): string {
    return { dog: 'Perro', cat: 'Gato', rabbit: 'Conejo', bird: 'Ave', other: 'Otro' }[s] ?? s;
}

function sizeLabel(s: string | null): string {
    return { small: 'Pequeño', medium: 'Mediano', large: 'Grande' }[s ?? ''] ?? '—';
}

function statusLabel(s: string): string {
    return s === 'lost' ? 'Perdido' : 'Encontrado';
}

function statusColor(s: string): string {
    return s === 'lost' ? 'bg-red-500' : 'bg-emerald-500';
}

function formatDate(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'long' }).format(new Date(d));
}

function formatDateTime(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(d));
}

const speciesIcon = (s: string) => ({ dog: Dog, cat: Cat, rabbit: Rabbit, bird: Bird } as Record<string, any>)[s] ?? PawPrint;

function shareWhatsApp(pet: LostPet) {
    const text = pet.status === 'lost'
        ? `¡Ayuda! ${pet.name ?? 'Mascota'} está perdid${pet.species === 'cat' ? 'a' : 'o'} en ${pet.last_seen_location}. Mirá: ${window.location.href}`
        : `Encontré un${pet.species === 'cat' ? 'a' : ''} ${pet.species === 'cat' ? 'gat' : 'perr'}${pet.species === 'cat' ? 'a' : 'o'} en ${pet.last_seen_location}. ¿Lo conocés? ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}
</script>

<template>
    <div class="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div class="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
            <!-- Back -->
            <a href="/mascotas-perdidas" class="mb-6 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
                <ArrowLeft class="h-4 w-4" />
                Volver a mascotas perdidas
            </a>

            <div class="grid gap-10 lg:grid-cols-5">
                <!-- Main -->
                <div class="lg:col-span-3 space-y-6">
                    <!-- Photo -->
                    <div v-if="pet?.photos && pet.photos.length > 0" class="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
                        <img :src="photoUrl(pet.photos[0])" :alt="pet.name ?? 'Mascota'" class="w-full aspect-[4/3] object-cover" />
                    </div>
                    <div v-else class="flex aspect-[4/3] items-center justify-center rounded-2xl border border-border/50 bg-card">
                        <component :is="speciesIcon(pet.species)" class="h-24 w-24 text-muted-foreground/20" />
                    </div>

                    <!-- Header -->
                    <div>
                        <div class="flex items-center gap-3 mb-3">
                            <span class="rounded-full px-3 py-1 text-xs font-semibold uppercase text-white" :class="statusColor(pet.status)">
                                {{ statusLabel(pet.status) }}
                            </span>
                            <span class="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                                <component :is="speciesIcon(pet.species)" class="h-3.5 w-3.5" />
                                {{ speciesLabel(pet.species) }}
                            </span>
                            <span v-if="pet.is_resolved" class="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                                <CheckCircle2 class="h-3.5 w-3.5" /> Resuelto
                            </span>
                        </div>
                        <h1 class="text-3xl font-bold text-foreground">{{ pet.name ?? speciesLabel(pet.species) + ' perdid' + (pet.species === 'cat' ? 'o' : 'o') }}</h1>
                    </div>

                    <!-- Details grid -->
                    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        <div v-if="pet.breed" class="rounded-xl border border-border/50 bg-card p-4">
                            <p class="text-xs text-muted-foreground/70">Raza</p>
                            <p class="mt-1 font-semibold text-foreground">{{ pet.breed }}</p>
                        </div>
                        <div v-if="pet.color" class="rounded-xl border border-border/50 bg-card p-4">
                            <p class="text-xs text-muted-foreground/70">Color</p>
                            <p class="mt-1 font-semibold text-foreground">{{ pet.color }}</p>
                        </div>
                        <div v-if="pet.size" class="rounded-xl border border-border/50 bg-card p-4">
                            <p class="text-xs text-muted-foreground/70">Tamaño</p>
                            <p class="mt-1 font-semibold text-foreground">{{ sizeLabel(pet.size) }}</p>
                        </div>
                        <div v-if="pet.age_description" class="rounded-xl border border-border/50 bg-card p-4">
                            <p class="text-xs text-muted-foreground/70">Edad aprox.</p>
                            <p class="mt-1 font-semibold text-foreground">{{ pet.age_description }}</p>
                        </div>
                        <div class="rounded-xl border border-border/50 bg-card p-4">
                            <p class="text-xs text-muted-foreground/70">Última vez visto</p>
                            <p class="mt-1 font-semibold text-foreground text-sm">{{ formatDate(pet.last_seen_date) }}</p>
                        </div>
                        <div class="rounded-xl border border-border/50 bg-card p-4">
                            <p class="text-xs text-muted-foreground/70">Publicado</p>
                            <p class="mt-1 font-semibold text-foreground text-sm">{{ formatDateTime(pet.created_at) }}</p>
                        </div>
                    </div>

                    <!-- Location -->
                    <div class="rounded-2xl border border-border/50 bg-card p-5">
                        <div class="flex items-start gap-3">
                            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400">
                                <MapPin class="h-5 w-5" />
                            </div>
                            <div>
                                <p class="text-sm font-semibold text-foreground">Última ubicación</p>
                                <p class="mt-1 text-muted-foreground">{{ pet.last_seen_location }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Description -->
                    <div v-if="pet.description" class="rounded-2xl border border-border/50 bg-card p-5">
                        <h3 class="text-sm font-semibold text-foreground mb-2">Descripción</h3>
                        <p class="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">{{ pet.description }}</p>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="lg:col-span-2 space-y-5">
                    <!-- Contact Card -->
                    <div class="rounded-2xl border border-border/50 bg-card p-5">
                        <h3 class="text-sm font-semibold text-foreground mb-4">Información de contacto</h3>
                        <div class="space-y-3">
                            <a v-if="pet.contact_phone" :href="'tel:' + pet.contact_phone"
                                class="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted hover:border-[#DC2626]">
                                <Phone class="h-4 w-4 text-[#DC2626]" />
                                {{ pet.contact_phone }}
                            </a>
                            <a v-if="pet.contact_email" :href="'mailto:' + pet.contact_email"
                                class="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted hover:border-[#DC2626]">
                                <Mail class="h-4 w-4 text-[#DC2626]" />
                                {{ pet.contact_email }}
                            </a>
                            <div v-if="!pet.contact_phone && !pet.contact_email" class="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                                <Phone class="h-4 w-4" /> Sin datos de contacto
                            </div>
                        </div>
                    </div>

                    <!-- Team -->
                    <div v-if="pet.team" class="rounded-2xl border border-border/50 bg-card p-5">
                        <h3 class="text-sm font-semibold text-foreground mb-3">Publicado por</h3>
                        <p class="text-sm font-medium text-foreground">{{ pet.team.name }}</p>
                        <p v-if="pet.team.city" class="text-xs text-muted-foreground mt-0.5">{{ pet.team.city }}</p>
                    </div>

                    <!-- Share -->
                    <div class="rounded-2xl border border-border/50 bg-card p-5">
                        <h3 class="text-sm font-semibold text-foreground mb-3">Compartir para ayudar</h3>
                        <div class="grid grid-cols-2 gap-2">
                            <button @click="shareWhatsApp(pet)"
                                class="flex items-center justify-center gap-2 rounded-xl bg-[#25D366]/10 px-4 py-2.5 text-sm font-medium text-[#25D366] transition hover:bg-[#25D366]/20">
                                <MessageCircle class="h-4 w-4" />
                                WhatsApp
                            </button>
                            <button @click="navigator.clipboard?.writeText(window.location.href)"
                                class="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
                                <Share2 class="h-4 w-4" />
                                Copiar enlace
                            </button>
                        </div>
                    </div>

                    <!-- Posted date -->
                    <div class="flex items-center gap-2 text-xs text-muted-foreground/60 px-1">
                        <Clock class="h-3.5 w-3.5" />
                        Publicado el {{ formatDateTime(pet.created_at) }}
                        <span v-if="pet.updated_at !== pet.created_at">· Actualizado {{ formatDateTime(pet.updated_at) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
