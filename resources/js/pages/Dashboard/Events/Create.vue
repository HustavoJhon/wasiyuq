<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import type { Team } from '@/types';

defineProps<{
    currentTeam?: Team | null;
}>();

const form = useForm({
    title: '',
    description: '',
    type: 'other',
    event_date: '',
    location: '',
    cover_image: '',
    is_published: false,
});

const typeOptions = [
    { value: 'adoption_fair', label: 'Feria de Adopción' },
    { value: 'fundraiser', label: 'Recaudación de Fondos' },
    { value: 'workshop', label: 'Taller' },
    { value: 'campaign', label: 'Campaña' },
    { value: 'other', label: 'Otro' },
];

function submit(): void {
    form.post('/' + currentTeamSlug() + '/eventos');
}

function currentTeamSlug(): string {
    const m = window.location.pathname.match(/^\/([^/]+)/);

    return m ? m[1] : '';
}
</script>

<template>
    <div>
        <a
            :href="`/${currentTeam?.slug}/eventos`"
            class="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-[#2D6A4F] transition-colors"
        >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Volver a eventos
        </a>

        <div class="mt-6">
            <h1 class="text-2xl font-bold text-foreground">Nuevo Evento</h1>
            <p class="mt-1 text-sm text-muted-foreground">
                Crea un evento o comunicado para <span class="font-medium text-foreground">{{ currentTeam?.name }}</span>.
            </p>
        </div>

        <form @submit.prevent="submit" class="mt-8 max-w-2xl">
            <div class="space-y-8">
                <div class="rounded-xl border border-border bg-card p-6">
                    <h2 class="flex items-center gap-2 text-base font-semibold text-foreground">
                        <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Información básica
                    </h2>

                    <div class="mt-5 grid gap-5">
                        <div class="space-y-1.5">
                            <label class="text-sm font-medium text-foreground">Título *</label>
                            <input
                                v-model="form.title"
                                class="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-[#2D6A4F]/20 focus-visible:border-[#2D6A4F] focus-visible:outline-none"
                                :disabled="form.processing"
                                placeholder="Nombre del evento"
                            />
                            <p v-if="form.errors.title" class="text-xs text-red-500">{{ form.errors.title }}</p>
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-sm font-medium text-foreground">Descripción *</label>
                            <textarea
                                v-model="form.description"
                                rows="5"
                                class="flex min-h-[120px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-[#2D6A4F]/20 focus-visible:border-[#2D6A4F] focus-visible:outline-none"
                                :disabled="form.processing"
                                placeholder="Describe el evento, propósito, actividades..."
                            />
                            <p v-if="form.errors.description" class="text-xs text-red-500">{{ form.errors.description }}</p>
                        </div>

                        <div class="grid gap-5 sm:grid-cols-2">
                            <div class="space-y-1.5">
                                <label class="text-sm font-medium text-foreground">Tipo *</label>
                                <select
                                    v-model="form.type"
                                    class="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-[#2D6A4F]/20 focus-visible:border-[#2D6A4F] focus-visible:outline-none"
                                    :disabled="form.processing"
                                >
                                    <option v-for="opt in typeOptions" :key="opt.value" :value="opt.value">
                                        {{ opt.label }}
                                    </option>
                                </select>
                                <p v-if="form.errors.type" class="text-xs text-red-500">{{ form.errors.type }}</p>
                            </div>

                            <div class="space-y-1.5">
                                <label class="text-sm font-medium text-foreground">Fecha del evento</label>
                                <input
                                    v-model="form.event_date"
                                    type="date"
                                    class="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-[#2D6A4F]/20 focus-visible:border-[#2D6A4F] focus-visible:outline-none"
                                    :disabled="form.processing"
                                />
                                <p v-if="form.errors.event_date" class="text-xs text-red-500">{{ form.errors.event_date }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="rounded-xl border border-border bg-card p-6">
                    <h2 class="flex items-center gap-2 text-base font-semibold text-foreground">
                        <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Ubicación y medios
                    </h2>

                    <div class="mt-5 grid gap-5">
                        <div class="space-y-1.5">
                            <label class="text-sm font-medium text-foreground">Ubicación</label>
                            <input
                                v-model="form.location"
                                class="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-[#2D6A4F]/20 focus-visible:border-[#2D6A4F] focus-visible:outline-none"
                                placeholder="Dirección o lugar del evento"
                                :disabled="form.processing"
                            />
                            <p v-if="form.errors.location" class="text-xs text-red-500">{{ form.errors.location }}</p>
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-sm font-medium text-foreground">URL de imagen de portada</label>
                            <input
                                v-model="form.cover_image"
                                class="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-[#2D6A4F]/20 focus-visible:border-[#2D6A4F] focus-visible:outline-none"
                                placeholder="https://ejemplo.com/imagen.jpg"
                                :disabled="form.processing"
                            />
                            <p v-if="form.errors.cover_image" class="text-xs text-red-500">{{ form.errors.cover_image }}</p>
                        </div>
                    </div>
                </div>

                <div class="rounded-xl border border-border bg-card p-6">
                    <h2 class="flex items-center gap-2 text-base font-semibold text-foreground">
                        <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Publicación
                    </h2>

                    <div class="mt-5">
                        <label class="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                v-model="form.is_published"
                                class="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#2D6A4F] focus:ring-[#2D6A4F]"
                                :disabled="form.processing"
                            />
                            <div>
                                <span class="text-sm font-medium text-foreground">Publicar inmediatamente</span>
                                <p class="text-xs text-muted-foreground/70 mt-0.5">El evento será visible para el público al guardarlo.</p>
                            </div>
                        </label>
                        <p v-if="form.errors.is_published" class="text-xs text-red-500 mt-2">{{ form.errors.is_published }}</p>
                    </div>
                </div>

                <div class="flex items-center gap-3">
                    <button
                        type="submit"
                        :disabled="form.processing"
                        class="inline-flex items-center gap-2 rounded-lg bg-[#2D6A4F] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1B4332] disabled:opacity-50 shadow-sm shadow-[#2D6A4F]/20"
                    >
                        <svg v-if="form.processing" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {{ form.processing ? 'Guardando...' : 'Guardar evento' }}
                    </button>
                    <a
                        :href="`/${currentTeam?.slug}/eventos`"
                        class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >Cancelar</a>
                </div>
            </div>
        </form>
    </div>
</template>
