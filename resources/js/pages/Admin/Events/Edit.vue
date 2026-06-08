<script setup lang="ts">
import { useForm, router } from '@inertiajs/vue3';
import { ref } from 'vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Team {
    id: number;
    name: string;
    slug: string;
}

interface EventEdit {
    id: number;
    team_id: number;
    title: string;
    slug: string;
    description: string | null;
    event_date: string | null;
    location: string | null;
    type: string;
    cover_image: string | null;
    is_published: boolean;
    team: { name: string };
}

const props = defineProps<{ event: EventEdit; teams: Team[] }>();

const isMapsUrl = (v: string | null) => v?.startsWith('http');
const locationSource = ref<'text' | 'maps'>(isMapsUrl(props.event.location) ? 'maps' : 'text');

const form = useForm({
    team_id: String(props.event.team_id),
    title: props.event.title,
    description: props.event.description ?? '',
    event_date: props.event.event_date ?? '',
    location: props.event.location ?? '',
    type: props.event.type,
    cover_image: props.event.cover_image ?? '',
    is_published: props.event.is_published,
});

const typeOptions = [
    { value: 'adoption_fair', label: 'Feria de adopción', icon: '🏐' },
    { value: 'fundraiser', label: 'Recaudación', icon: '💰' },
    { value: 'workshop', label: 'Taller', icon: '🔧' },
    { value: 'campaign', label: 'Campaña', icon: '📢' },
    { value: 'other', label: 'Otro', icon: '📅' },
];

function submit() {
    form.put(`/admin/eventos/${props.event.id}`);
}

function destroy(id: number) {
    if (confirm('¿Estás seguro de eliminar este evento? Esta acción no se puede deshacer.')) {
        router.delete(`/admin/eventos/${id}`);
    }
}

const typeLabels: Record<string, string> = {
    adoption_fair: 'Feria de Adopción',
    fundraiser: 'Recaudación',
    workshop: 'Taller',
    campaign: 'Campaña',
    other: 'Otro',
};

const typeIcons: Record<string, string> = {
    adoption_fair: '🏐', fundraiser: '💰', workshop: '🔧', campaign: '📢', other: '📅',
};
</script>

<template>
    <div class="mx-auto max-w-4xl">
        <a href="/admin/eventos" class="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-[#2D6A4F]">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Volver a eventos
        </a>

        <div class="mb-8 mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div class="flex items-center gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 text-xl dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                    {{ typeIcons[event.type] ?? '📅' }}
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-foreground">{{ event.title }}</h1>
                    <p class="mt-0.5 text-sm text-muted-foreground">Editá los datos del evento.</p>
                </div>
            </div>
            <button type="button" @click="destroy(event.id)" class="inline-flex items-center gap-1.5 self-start rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Eliminar
            </button>
        </div>

        <form @submit.prevent="submit" class="space-y-6">
            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="mb-5 flex items-center gap-2">
                    <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h2 class="text-base font-semibold text-foreground">Organización</h2>
                </div>
                <div class="grid gap-2">
                    <Label for="team_id">¿A qué organización pertenece?</Label>
                    <Select v-model="form.team_id" name="team_id">
                        <SelectTrigger class="w-full">
                            <SelectValue :placeholder="event.team.name" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="team in teams" :key="team.id" :value="String(team.id)">
                                {{ team.name }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError :message="form.errors.team_id" />
                </div>
            </div>

            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="mb-5 flex items-center gap-2">
                    <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h2 class="text-base font-semibold text-foreground">Información del evento</h2>
                </div>

                <div class="grid gap-5">
                    <div class="grid gap-2">
                        <Label for="title">Título del evento</Label>
                        <div class="relative">
                            <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                            </svg>
                            <Input id="title" v-model="form.title" type="text" placeholder="Título del evento" class="pl-9" :disabled="form.processing" />
                        </div>
                        <InputError :message="form.errors.title" />
                    </div>

                    <div class="grid gap-2">
                        <Label for="type">Tipo de evento</Label>
                        <Select v-model="form.type" name="type">
                            <SelectTrigger class="w-full">
                                <SelectValue :placeholder="typeLabels[form.type] ?? form.type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="opt in typeOptions" :key="opt.value" :value="opt.value">
                                    <span class="flex items-center gap-2">{{ opt.icon }} {{ opt.label }}</span>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError :message="form.errors.type" />
                    </div>

                    <div class="grid gap-5 sm:grid-cols-2">
                        <div class="grid gap-2">
                            <Label for="event_date">Fecha del evento</Label>
                            <Input id="event_date" type="date" v-model="form.event_date" class="[&::-webkit-calendar-picker-indicator]:ml-auto" :disabled="form.processing" />
                            <InputError :message="form.errors.event_date" />
                        </div>
                        <div class="grid gap-2">
                            <Label for="location">Ubicación</Label>
                            <div class="mb-3 flex gap-2">
                                <button type="button"
                                    class="rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
                                    :class="locationSource === 'text' ? 'bg-[#2D6A4F] text-white shadow-sm' : 'bg-muted text-muted-foreground hover:text-foreground'"
                                    @click="locationSource = 'text'"
                                >
                                    <span class="flex items-center gap-1.5">
                                        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Dirección
                                    </span>
                                </button>
                                <button type="button"
                                    class="rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
                                    :class="locationSource === 'maps' ? 'bg-[#2D6A4F] text-white shadow-sm' : 'bg-muted text-muted-foreground hover:text-foreground'"
                                    @click="locationSource = 'maps'"
                                >
                                    <span class="flex items-center gap-1.5">
                                        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                        Google Maps
                                    </span>
                                </button>
                            </div>
                            <div v-if="locationSource === 'text'" class="relative">
                                <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <Input id="location" v-model="form.location" type="text" placeholder="Ej: Parque Central, Cusco" class="pl-9" :disabled="form.processing" />
                            </div>
                            <div v-else class="relative">
                                <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                <Input id="location_maps" v-model="form.location" type="url" placeholder="https://maps.google.com/?q=..." class="pl-9" :disabled="form.processing" />
                            </div>
                            <p class="text-xs text-muted-foreground">Podés escribir una dirección o pegar un link de Google Maps.</p>
                            <InputError :message="form.errors.location" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="mb-5 flex items-center gap-2">
                    <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h2 class="text-base font-semibold text-foreground">Imagen de portada</h2>
                </div>
                <div class="grid gap-2">
                    <Label for="cover_image">URL de la imagen</Label>
                    <div class="relative">
                        <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <Input id="cover_image" v-model="form.cover_image" type="url" placeholder="https://ejemplo.com/imagen.jpg" class="pl-9" :disabled="form.processing" />
                    </div>
                    <p class="text-xs text-muted-foreground">Pegá el enlace de la imagen de portada del evento.</p>
                    <InputError :message="form.errors.cover_image" />
                </div>
            </div>

            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="mb-5 flex items-center gap-2">
                    <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h2 class="text-base font-semibold text-foreground">Descripción</h2>
                </div>
                <div class="grid gap-2">
                    <Label for="description">Descripción del evento</Label>
                    <div class="relative">
                        <svg class="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        <textarea
                            id="description" v-model="form.description" rows="4"
                            class="block w-full rounded-xl border border-[#2D6A4F]/15 bg-white/60 py-2.5 pl-10 pr-4 text-sm text-foreground transition outline-none placeholder:text-muted-foreground/40 focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 dark:border-[#2D6A4F]/30 dark:bg-black/20"
                            placeholder="Contá de qué trata el evento, actividades, horarios..."
                            :disabled="form.processing"
                        ></textarea>
                    </div>
                    <InputError :message="form.errors.description" />
                </div>

                <div class="mt-5 flex items-start gap-3 rounded-xl border border-[#2D6A4F]/10 bg-[#2D6A4F]/4 p-4 dark:border-[#2D6A4F]/20 dark:bg-[#2D6A4F]/10">
                    <input
                        id="is_published" type="checkbox" v-model="form.is_published"
                        class="mt-0.5 h-4 w-4 shrink-0 rounded border-[#2D6A4F]/30 text-[#2D6A4F] focus:ring-[#2D6A4F]"
                        :disabled="form.processing"
                    />
                    <div>
                        <Label for="is_published" class="font-medium text-foreground">Publicado</Label>
                        <p class="mt-0.5 text-xs text-muted-foreground/70">El evento será visible para el público en la web.</p>
                    </div>
                </div>
                <InputError :message="form.errors.is_published" />
            </div>

            <div class="flex items-center gap-4 rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <Button type="submit" :disabled="form.processing" class="min-w-[140px]">
                    <svg v-if="form.processing" class="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <svg v-else class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {{ form.processing ? 'Guardando...' : 'Guardar cambios' }}
                </Button>
                <a :href="'/admin/eventos/' + event.id" class="text-sm font-medium text-muted-foreground transition hover:text-foreground">Cancelar</a>
            </div>
        </form>
    </div>
</template>
