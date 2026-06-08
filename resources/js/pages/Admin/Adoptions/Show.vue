<script setup lang="ts">
interface FollowUp {
    id: number;
    scheduled_date: string;
    completed_date: string | null;
    status: string;
    notes: string | null;
}

interface Adoption {
    id: number;
    status: string;
    motivation: string;
    experience_with_pets: boolean;
    has_yard: boolean;
    housing_type: string;
    family_composition: string;
    notes: string | null;
    created_at: string;
    reviewed_at: string | null;
    pet: { id: number; name: string; slug: string; species: string; breed: string | null };
    adopter: { id: number; name: string; email: string };
    team: { id: number; name: string; slug: string };
    reviewer: { id: number; name: string } | null;
    follow_ups: FollowUp[];
}

defineProps<{ adoption: Adoption }>();

const speciesEmoji: Record<string, string> = { dog: '🐕', cat: '🐈', rabbit: '🐇', bird: '🐦', other: '🐾' };

function statusClass(status: string): string {
    const map: Record<string, string> = {
        pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
        approved: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
        rejected: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
        completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
        cancelled: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
    };
    return map[status] ?? 'bg-gray-100 text-gray-600';
}

function statusLabel(s: string): string {
    const labels: Record<string, string> = { pending: 'Pendiente', approved: 'Aprobada', rejected: 'Rechazada', completed: 'Completada', cancelled: 'Cancelada' };
    return labels[s] ?? s;
}

function fuStatusClass(s: string): string {
    const map: Record<string, string> = {
        pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
        completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
        missed: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    };
    return map[s] ?? 'bg-gray-100 text-gray-600';
}

function fuStatusLabel(s: string): string {
    const labels: Record<string, string> = { pending: 'Pendiente', completed: 'Completado', missed: 'No Realizado' };
    return labels[s] ?? s;
}

function formatDate(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d));
}

function initials(name: string): string {
    return name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
}
</script>

<template>
    <div class="mx-auto max-w-5xl">
        <a href="/admin/adopciones" class="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-[#2D6A4F]">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Volver a adopciones
        </a>

        <div class="mt-6 rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div class="flex items-start gap-4">
                    <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#2D6A4F]/15 bg-white text-2xl dark:border-[#2D6A4F]/30 dark:bg-black/40">
                        {{ speciesEmoji[adoption.pet.species] ?? '🐾' }}
                    </div>
                    <div>
                        <div class="flex flex-wrap items-center gap-2">
                            <h1 class="text-2xl font-bold text-foreground">{{ adoption.pet.name }}</h1>
                            <span class="rounded-full px-3 py-0.5 text-xs font-medium" :class="statusClass(adoption.status)">{{ statusLabel(adoption.status) }}</span>
                        </div>
                        <p class="mt-0.5 text-sm text-muted-foreground">Adoptante: {{ adoption.adopter.name }} · {{ adoption.team.name }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-6 grid gap-6 lg:grid-cols-3">
            <div class="space-y-6 lg:col-span-2">
                <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                    <div class="mb-5 flex items-center gap-2">
                        <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h2 class="text-base font-semibold text-foreground">Detalles de la solicitud</h2>
                    </div>

                    <div class="grid gap-4">
                        <div>
                            <p class="text-xs font-medium text-muted-foreground/60 uppercase tracking-wide">Motivación</p>
                            <p class="mt-1 text-sm text-foreground leading-relaxed">{{ adoption.motivation }}</p>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div class="rounded-xl border border-[#2D6A4F]/10 bg-[#2D6A4F]/4 p-3 dark:border-[#2D6A4F]/20 dark:bg-[#2D6A4F]/10">
                                <p class="text-xs text-muted-foreground/70">Experiencia con mascotas</p>
                                <p class="mt-0.5 font-medium text-foreground">{{ adoption.experience_with_pets ? 'Sí' : 'No' }}</p>
                            </div>
                            <div class="rounded-xl border border-[#2D6A4F]/10 bg-[#2D6A4F]/4 p-3 dark:border-[#2D6A4F]/20 dark:bg-[#2D6A4F]/10">
                                <p class="text-xs text-muted-foreground/70">Tiene patio/yarda</p>
                                <p class="mt-0.5 font-medium text-foreground">{{ adoption.has_yard ? 'Sí' : 'No' }}</p>
                            </div>
                            <div class="rounded-xl border border-[#2D6A4F]/10 bg-[#2D6A4F]/4 p-3 dark:border-[#2D6A4F]/20 dark:bg-[#2D6A4F]/10">
                                <p class="text-xs text-muted-foreground/70">Tipo de vivienda</p>
                                <p class="mt-0.5 font-medium text-foreground">{{ adoption.housing_type }}</p>
                            </div>
                            <div class="rounded-xl border border-[#2D6A4F]/10 bg-[#2D6A4F]/4 p-3 dark:border-[#2D6A4F]/20 dark:bg-[#2D6A4F]/10">
                                <p class="text-xs text-muted-foreground/70">Composición familiar</p>
                                <p class="mt-0.5 font-medium text-foreground">{{ adoption.family_composition }}</p>
                            </div>
                        </div>

                        <div v-if="adoption.notes">
                            <p class="text-xs font-medium text-muted-foreground/60 uppercase tracking-wide">Notas</p>
                            <p class="mt-1 text-sm text-foreground">{{ adoption.notes }}</p>
                        </div>
                    </div>
                </div>

                <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                    <div class="mb-5 flex items-center gap-2">
                        <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h2 class="text-base font-semibold text-foreground">Seguimientos ({{ adoption.follow_ups.length }})</h2>
                    </div>

                    <div v-if="adoption.follow_ups.length === 0" class="text-sm text-muted-foreground/60">Sin seguimientos registrados.</div>
                    <div v-else class="space-y-3">
                        <div v-for="fu in adoption.follow_ups" :key="fu.id" class="rounded-xl border border-[#2D6A4F]/10 bg-[#2D6A4F]/4 p-4 dark:border-[#2D6A4F]/20 dark:bg-[#2D6A4F]/10">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <svg class="h-4 w-4 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span class="text-sm font-medium text-foreground">{{ formatDate(fu.scheduled_date) }}</span>
                                </div>
                                <span class="rounded-full px-2.5 py-0.5 text-xs font-medium" :class="fuStatusClass(fu.status)">{{ fuStatusLabel(fu.status) }}</span>
                            </div>
                            <p v-if="fu.notes" class="mt-2 text-xs text-muted-foreground">{{ fu.notes }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="space-y-4">
                <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                    <div class="flex items-center gap-2">
                        <svg class="h-4 w-4 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 class="text-xs font-semibold tracking-wider text-foreground/70 uppercase">Información</h3>
                    </div>
                    <dl class="mt-4 divide-y divide-[#2D6A4F]/10 space-y-3 dark:divide-[#2D6A4F]/20">
                        <div class="flex items-center justify-between pt-3 first:pt-0">
                            <dt class="text-xs text-muted-foreground/70">Adoptante</dt>
                            <dd class="text-sm font-medium text-foreground">{{ adoption.adopter.name }}</dd>
                        </div>
                        <div class="flex items-center justify-between pt-3">
                            <dt class="text-xs text-muted-foreground/70">Email</dt>
                            <dd class="text-sm font-medium text-foreground">{{ adoption.adopter.email }}</dd>
                        </div>
                        <div class="flex items-center justify-between pt-3">
                            <dt class="text-xs text-muted-foreground/70">Organización</dt>
                            <dd class="text-sm font-medium text-[#2D6A4F]">{{ adoption.team.name }}</dd>
                        </div>
                        <div class="flex items-center justify-between pt-3">
                            <dt class="text-xs text-muted-foreground/70">Raza</dt>
                            <dd class="text-sm font-medium text-foreground">{{ adoption.pet.breed ?? '—' }}</dd>
                        </div>
                        <div v-if="adoption.reviewer" class="flex items-center justify-between pt-3">
                            <dt class="text-xs text-muted-foreground/70">Revisado por</dt>
                            <dd class="text-sm font-medium text-foreground">{{ adoption.reviewer.name }}</dd>
                        </div>
                        <div v-if="adoption.reviewed_at" class="flex items-center justify-between pt-3">
                            <dt class="text-xs text-muted-foreground/70">Revisado el</dt>
                            <dd class="text-sm font-medium text-foreground">{{ formatDate(adoption.reviewed_at) }}</dd>
                        </div>
                        <div class="flex items-center justify-between pt-3">
                            <dt class="text-xs text-muted-foreground/70">Solicitud</dt>
                            <dd class="text-sm font-medium text-foreground">{{ formatDate(adoption.created_at) }}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    </div>
</template>
