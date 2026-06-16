<script setup lang="ts">
interface Vaccine {
    name: string;
    date: string;
    vet: string;
    next_due: string;
}

interface FollowUpShow {
    id: number;
    scheduled_date: string;
    completed_date: string | null;
    status: string;
    notes: string | null;
    photos: string[];
    created_at: string;
    drive_link: string | null;
    weight_kg: number | null;
    health_status: string | null;
    vaccines: Vaccine[];
    behavior: string | null;
    adoption: {
        id: number;
        pet: { id: number; name: string; slug: string };
        adopter: { id: number; name: string; email: string };
    };
    created_by: { id: number; name: string };
}

defineProps<{ followUp: FollowUpShow }>();

function statusClass(s: string): string {
    const map: Record<string, string> = {
        pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
        completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
        missed: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    };

    return map[s] ?? 'bg-gray-100 text-gray-600';
}

function statusLabel(s: string): string {
    const labels: Record<string, string> = { pending: 'Pendiente', completed: 'Completado', missed: 'No Realizado' };

    return labels[s] ?? s;
}

function healthClass(s: string | null): string {
    const map: Record<string, string> = {
        good: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
        fair: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
        poor: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    };

    return map[s ?? ''] ?? '';
}

function healthLabel(s: string | null): string {
    const labels: Record<string, string> = { good: 'Bueno', fair: 'Regular', poor: 'Malo' };

    return s ? labels[s] ?? s : '—';
}

function formatDate(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d));
}
</script>

<template>
    <div class="mx-auto max-w-5xl">
        <a href="/admin/seguimiento" class="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-[#2D6A4F]">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Volver a seguimiento
        </a>

        <div class="mt-6 rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div class="flex items-start gap-4">
                    <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#2D6A4F]/15 bg-white text-xl dark:border-[#2D6A4F]/30 dark:bg-black/40">
                        <svg class="h-6 w-6 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <div>
                        <div class="flex flex-wrap items-center gap-2">
                            <h1 class="text-2xl font-bold text-foreground">Seguimiento #{{ followUp.id }}</h1>
                            <span class="rounded-full px-3 py-0.5 text-xs font-medium" :class="statusClass(followUp.status)">{{ statusLabel(followUp.status) }}</span>
                        </div>
                        <p class="mt-0.5 text-sm text-muted-foreground">{{ followUp.adoption.pet.name }} · {{ followUp.adoption.adopter.name }}</p>
                    </div>
                </div>
                <a :href="'/admin/seguimiento/' + followUp.id + '/editar'" class="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#2D6A4F] px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-[#2D6A4F]/20 transition hover:bg-[#245a40]">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                </a>
            </div>
        </div>

        <div class="mt-6 grid gap-6 lg:grid-cols-3">
            <div class="space-y-6 lg:col-span-2">
                <!-- Notas -->
                <div v-if="followUp.notes || followUp.behavior" class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                    <div class="mb-5 flex items-center gap-2">
                        <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 class="text-base font-semibold text-foreground">Información de la visita</h2>
                    </div>
                    <div v-if="followUp.behavior" class="mb-4 rounded-xl border border-[#2D6A4F]/10 bg-[#2D6A4F]/4 p-4 dark:border-[#2D6A4F]/20 dark:bg-[#2D6A4F]/10">
                        <p class="text-xs font-medium text-muted-foreground/60 uppercase tracking-wide">Comportamiento</p>
                        <p class="mt-1 text-sm text-foreground leading-relaxed">{{ followUp.behavior }}</p>
                    </div>
                    <div v-if="followUp.notes" class="rounded-xl border border-[#2D6A4F]/10 bg-[#2D6A4F]/4 p-4 dark:border-[#2D6A4F]/20 dark:bg-[#2D6A4F]/10">
                        <p class="text-xs font-medium text-muted-foreground/60 uppercase tracking-wide">Notas</p>
                        <p class="mt-1 text-sm text-foreground leading-relaxed">{{ followUp.notes }}</p>
                    </div>
                </div>
                <div v-if="!followUp.notes && !followUp.behavior" class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                    <div class="mb-5 flex items-center gap-2">
                        <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 class="text-base font-semibold text-foreground">Información de la visita</h2>
                    </div>
                    <p class="text-sm text-muted-foreground/60 italic">Sin información registrada.</p>
                </div>

                <!-- Salud y peso -->
                <div v-if="followUp.weight_kg || followUp.health_status" class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                    <div class="mb-5 flex items-center gap-2">
                        <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <h2 class="text-base font-semibold text-foreground">Salud y bienestar</h2>
                    </div>
                    <div class="grid gap-4 sm:grid-cols-2">
                        <div v-if="followUp.weight_kg" class="rounded-xl border border-[#2D6A4F]/10 bg-[#2D6A4F]/4 p-4 dark:border-[#2D6A4F]/20 dark:bg-[#2D6A4F]/10">
                            <p class="text-xs font-medium text-muted-foreground/60 uppercase tracking-wide">Peso</p>
                            <p class="mt-1 text-lg font-semibold text-foreground">{{ followUp.weight_kg }} kg</p>
                        </div>
                        <div v-if="followUp.health_status" class="rounded-xl border border-[#2D6A4F]/10 bg-[#2D6A4F]/4 p-4 dark:border-[#2D6A4F]/20 dark:bg-[#2D6A4F]/10">
                            <p class="text-xs font-medium text-muted-foreground/60 uppercase tracking-wide">Estado de salud</p>
                            <span class="mt-1 inline-block rounded-full px-3 py-0.5 text-xs font-medium" :class="healthClass(followUp.health_status)">{{ healthLabel(followUp.health_status) }}</span>
                        </div>
                    </div>
                </div>

                <!-- Vacunas -->
                <div v-if="followUp.vaccines && followUp.vaccines.length > 0" class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                    <div class="mb-5 flex items-center gap-2">
                        <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <h2 class="text-base font-semibold text-foreground">Vacunas</h2>
                    </div>
                    <div class="space-y-3">
                        <div v-for="(v, i) in followUp.vaccines" :key="i" class="rounded-xl border border-[#2D6A4F]/10 bg-[#2D6A4F]/4 p-4 dark:border-[#2D6A4F]/20 dark:bg-[#2D6A4F]/10">
                            <div class="mb-2 flex items-center justify-between">
                                <span class="text-sm font-semibold text-foreground">{{ v.name }}</span>
                                <span class="text-xs text-muted-foreground">{{ v.date ? formatDate(v.date) : '' }}</span>
                            </div>
                            <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                <span v-if="v.vet">Veterinario: {{ v.vet }}</span>
                                <span v-if="v.next_due">Próxima dosis: {{ formatDate(v.next_due) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Fotos -->
                <div v-if="followUp.photos && followUp.photos.length > 0" class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                    <div class="mb-5 flex items-center gap-2">
                        <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h2 class="text-base font-semibold text-foreground">Fotos</h2>
                    </div>
                    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        <img v-for="(photo, i) in followUp.photos" :key="i" :src="photo" class="rounded-xl border border-[#2D6A4F]/15 object-cover dark:border-[#2D6A4F]/30" />
                    </div>
                </div>
            </div>

            <div class="space-y-4">
                <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                    <div class="flex items-center gap-2">
                        <svg class="h-4 w-4 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 class="text-xs font-semibold tracking-wider text-foreground/70 uppercase">Detalles</h3>
                    </div>
                    <dl class="mt-4 divide-y divide-[#2D6A4F]/10 space-y-3 dark:divide-[#2D6A4F]/20">
                        <div class="flex items-center justify-between pt-3 first:pt-0">
                            <dt class="text-xs text-muted-foreground/70">Mascota</dt>
                            <dd class="text-sm font-medium text-foreground">{{ followUp.adoption.pet.name }}</dd>
                        </div>
                        <div class="flex items-center justify-between pt-3">
                            <dt class="text-xs text-muted-foreground/70">Adoptante</dt>
                            <dd class="text-sm font-medium text-foreground">{{ followUp.adoption.adopter.name }}</dd>
                        </div>
                        <div class="flex items-center justify-between pt-3">
                            <dt class="text-xs text-muted-foreground/70">Email</dt>
                            <dd class="text-sm font-medium text-foreground">{{ followUp.adoption.adopter.email }}</dd>
                        </div>
                        <div class="flex items-center justify-between pt-3">
                            <dt class="text-xs text-muted-foreground/70">Fecha programada</dt>
                            <dd class="text-sm font-medium text-foreground">{{ formatDate(followUp.scheduled_date) }}</dd>
                        </div>
                        <div v-if="followUp.completed_date" class="flex items-center justify-between pt-3">
                            <dt class="text-xs text-muted-foreground/70">Fecha realizada</dt>
                            <dd class="text-sm font-medium text-foreground">{{ formatDate(followUp.completed_date) }}</dd>
                        </div>
                        <div v-if="followUp.weight_kg" class="flex items-center justify-between pt-3">
                            <dt class="text-xs text-muted-foreground/70">Peso</dt>
                            <dd class="text-sm font-medium text-foreground">{{ followUp.weight_kg }} kg</dd>
                        </div>
                        <div v-if="followUp.health_status" class="flex items-center justify-between pt-3">
                            <dt class="text-xs text-muted-foreground/70">Salud</dt>
                            <dd class="text-sm font-medium text-foreground">{{ healthLabel(followUp.health_status) }}</dd>
                        </div>
                        <div v-if="followUp.drive_link" class="flex items-center justify-between pt-3">
                            <dt class="text-xs text-muted-foreground/70">Drive</dt>
                            <dd>
                                <a :href="followUp.drive_link" target="_blank" class="inline-flex items-center gap-1 text-sm font-medium text-[#2D6A4F] hover:underline">
                                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    Abrir
                                </a>
                            </dd>
                        </div>
                        <div class="flex items-center justify-between pt-3">
                            <dt class="text-xs text-muted-foreground/70">Creado por</dt>
                            <dd class="text-sm font-medium text-foreground">{{ followUp.created_by.name }}</dd>
                        </div>
                        <div class="flex items-center justify-between pt-3">
                            <dt class="text-xs text-muted-foreground/70">Registrado</dt>
                            <dd class="text-sm font-medium text-foreground">{{ formatDate(followUp.created_at) }}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    </div>
</template>
