<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { ref } from 'vue';
import { usePhotoUrl } from '@/composables/usePhotoUrl';

const { photoUrl } = usePhotoUrl();

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
    pet: {
        id: number;
        name: string;
        slug: string;
        species: string;
        breed: string | null;
        photos: string[] | null;
    };
    adopter: { id: number; name: string; email: string };
    follow_ups: FollowUp[];
}

const props = defineProps<{
    adoption: Adoption;
    currentTeam?: { id: number; name: string; slug: string } | null;
}>();

const rejectNotes = ref('');
const showRejectForm = ref(false);

function approve(): void {
    if (!props.currentTeam) {
        return;
    }

    router.post(
        `/${props.currentTeam.slug}/adopciones/${props.adoption.id}/aprobar`,
    );
}

function reject(): void {
    if (!props.currentTeam) {
        return;
    }

    router.post(
        `/${props.currentTeam.slug}/adopciones/${props.adoption.id}/rechazar`,
        {
            notes: rejectNotes.value,
        },
    );
}

function statusClass(s: string): string {
    const map: Record<string, string> = {
        pending: 'bg-amber-100 text-amber-700',
        approved: 'bg-blue-100 text-blue-700',
        rejected: 'bg-red-100 text-red-700',
        completed: 'bg-green-100 text-green-700',
        cancelled: 'bg-gray-100 text-gray-500',
    };

    return map[s] ?? 'bg-gray-100 text-gray-600';
}

function statusLabel(s: string): string {
    const labels: Record<string, string> = {
        pending: 'Pendiente',
        approved: 'Aprobada',
        rejected: 'Rechazada',
        completed: 'Completada',
        cancelled: 'Cancelada',
    };

    return labels[s] ?? s;
}

function formatDate(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(
        new Date(d),
    );
}

const housingLabels: Record<string, string> = {
    house: 'Casa',
    apartment: 'Departamento',
    condo: 'Condominio',
    other: 'Otro',
};
</script>

<template>
    <div>
        <a
            :href="`/${currentTeam?.slug}/adopciones`"
            class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-[#2D6A4F]"
        >
            <svg
                class="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                />
            </svg>
            Volver a solicitudes
        </a>

        <div class="mt-4 flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-foreground">
                    Solicitud de Adopción
                </h1>
                <p class="mt-1 text-sm text-muted-foreground">
                    {{ adoption.pet?.name ?? 'Mascota eliminada' }} — Postulante:
                    {{ adoption.adopter.name }}
                </p>
            </div>
            <span
                class="rounded-full px-4 py-1 text-sm font-medium"
                :class="statusClass(adoption.status)"
                >{{ statusLabel(adoption.status) }}</span
            >
        </div>

        <div class="mt-8 grid gap-8 lg:grid-cols-3">
            <div class="space-y-8 lg:col-span-2">
                <div class="rounded-xl border border-border bg-card p-6">
                    <h2 class="text-lg font-semibold text-foreground">
                        Información de la mascota
                    </h2>
                    <div class="mt-4 flex items-start gap-4">
                        <div
                            v-if="
                                adoption.pet?.photos?.length > 0
                            "
                            class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-muted"
                        >
                            <img
                                :src="photoUrl(adoption.pet?.photos?.[0] ?? '')"
                                :alt="adoption.pet?.name ?? 'Mascota'"
                                class="h-full w-full object-cover"
                            />
                        </div>
                        <div>
                            <p
                                class="text-lg font-semibold text-card-foreground"
                            >
                                {{ adoption.pet?.name ?? 'Mascota eliminada' }}
                            </p>
                            <p class="text-sm text-muted-foreground">
                                {{ adoption.pet?.species }} —
                                {{ adoption.pet?.breed }}
                            </p>
                            <a
                                :href="'/mascotas/' + adoption.pet?.slug"
                                class="mt-2 inline-flex text-sm text-[#2D6A4F] hover:underline"
                                >Ver perfil público</a
                            >
                        </div>
                    </div>
                </div>

                <div class="rounded-xl border border-border bg-card p-6">
                    <h2 class="text-lg font-semibold text-foreground">
                        Motivación del adoptante
                    </h2>
                    <p
                        class="mt-3 text-sm leading-relaxed text-muted-foreground"
                    >
                        {{ adoption.motivation }}
                    </p>

                    <h3 class="mt-6 text-sm font-semibold text-foreground">
                        Detalles del hogar
                    </h3>
                    <div class="mt-3 grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-xs text-muted-foreground/70">
                                Experiencia con mascotas
                            </p>
                            <p
                                class="mt-0.5 text-sm font-medium text-card-foreground"
                            >
                                {{
                                    adoption.experience_with_pets ? 'Sí' : 'No'
                                }}
                            </p>
                        </div>
                        <div>
                            <p class="text-xs text-muted-foreground/70">
                                Tiene patio/jardín
                            </p>
                            <p
                                class="mt-0.5 text-sm font-medium text-card-foreground"
                            >
                                {{ adoption.has_yard ? 'Sí' : 'No' }}
                            </p>
                        </div>
                        <div>
                            <p class="text-xs text-muted-foreground/70">
                                Tipo de vivienda
                            </p>
                            <p
                                class="mt-0.5 text-sm font-medium text-card-foreground"
                            >
                                {{
                                    housingLabels[adoption.housing_type] ??
                                    adoption.housing_type
                                }}
                            </p>
                        </div>
                        <div>
                            <p class="text-xs text-muted-foreground/70">
                                Composición familiar
                            </p>
                            <p
                                class="mt-0.5 text-sm font-medium text-card-foreground"
                            >
                                {{ adoption.family_composition }}
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    v-if="adoption.follow_ups.length > 0"
                    class="rounded-xl border border-border bg-card p-6"
                >
                    <h2 class="text-lg font-semibold text-foreground">
                        Seguimiento
                    </h2>
                    <div class="mt-4 space-y-3">
                        <div
                            v-for="fu in adoption.follow_ups"
                            :key="fu.id"
                            class="rounded-lg border border-border/50 bg-muted/30 p-4"
                        >
                            <div class="flex items-center justify-between">
                                <span
                                    class="text-sm font-medium text-card-foreground"
                                    >{{ formatDate(fu.scheduled_date) }}</span
                                >
                                <span
                                    class="rounded-full px-3 py-0.5 text-xs font-medium"
                                    :class="
                                        fu.status === 'completed'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-amber-100 text-amber-700'
                                    "
                                    >{{
                                        fu.status === 'completed'
                                            ? 'Completado'
                                            : 'Pendiente'
                                    }}</span
                                >
                            </div>
                            <p
                                v-if="fu.notes"
                                class="mt-2 text-xs text-muted-foreground"
                            >
                                {{ fu.notes }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="space-y-4">
                <div class="rounded-xl border border-border bg-card p-6">
                    <h2 class="text-sm font-semibold text-foreground">
                        Acciones
                    </h2>

                    <div
                        v-if="adoption.status === 'pending'"
                        class="mt-4 space-y-3"
                    >
                        <button
                            class="w-full rounded-xl bg-[#2D6A4F] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#246142]"
                            @click="approve()"
                        >
                            Aprobar solicitud
                        </button>
                        <button
                            class="w-full rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                            @click="showRejectForm = !showRejectForm"
                        >
                            Rechazar solicitud
                        </button>

                        <div v-if="showRejectForm" class="mt-3 space-y-3">
                            <textarea
                                v-model="rejectNotes"
                                placeholder="Motivo del rechazo (opcional)..."
                                class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[#2D6A4F]"
                                rows="3"
                            ></textarea>
                            <button
                                class="w-full rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                                @click="reject()"
                            >
                                Confirmar rechazo
                            </button>
                        </div>
                    </div>

                    <div v-else class="mt-4">
                        <p class="text-sm text-muted-foreground/70">
                            Esta solicitud ya fue revisada.
                        </p>
                    </div>
                </div>

                <div class="rounded-xl border border-border bg-card p-6">
                    <h2 class="text-sm font-semibold text-foreground">
                        Información del postulante
                    </h2>
                    <div class="mt-3 space-y-2">
                        <p class="text-sm text-card-foreground">
                            {{ adoption.adopter.name }}
                        </p>
                        <p class="text-xs text-muted-foreground">
                            {{ adoption.adopter.email }}
                        </p>
                    </div>
                </div>

                <div class="rounded-xl border border-border bg-card p-6">
                    <p class="text-xs text-muted-foreground/70">
                        Fecha de postulación
                    </p>
                    <p class="mt-0.5 text-sm font-medium text-card-foreground">
                        {{ formatDate(adoption.created_at) }}
                    </p>
                    <p
                        v-if="adoption.reviewed_at"
                        class="mt-2 text-xs text-muted-foreground/70"
                    >
                        Revisada el {{ formatDate(adoption.reviewed_at) }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
