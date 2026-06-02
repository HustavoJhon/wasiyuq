<script setup lang="ts">
import { router } from '@inertiajs/vue3';

interface FollowUp {
    id: number;
    scheduled_date: string;
    completed_date: string | null;
    status: string;
    notes: string | null;
    created_at: string;
    adoption: {
        id: number;
        pet: { id: number; name: string; slug: string };
        adopter: { id: number; name: string };
    };
    created_by: { id: number; name: string };
}

interface Meta {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

defineProps<{
    followUps: FollowUp[];
    meta: Meta;
}>();

function statusClass(status: string): string {
    const map: Record<string, string> = {
        pending: 'bg-amber-100 text-amber-700',
        completed: 'bg-green-100 text-green-700',
        missed: 'bg-red-100 text-red-700',
    };

    return map[status] ?? 'bg-gray-100 text-gray-600';
}

function statusLabel(s: string): string {
    const labels: Record<string, string> = {
        pending: 'Pendiente',
        completed: 'Completado',
        missed: 'No Realizado',
    };

    return labels[s] ?? s;
}

function formatDate(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(
        new Date(d),
    );
}

function destroy(id: number): void {
    if (confirm('¿Eliminar este seguimiento?')) {
        router.delete('/admin/seguimiento/' + id);
    }
}
</script>

<template>
    <div>
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-foreground">Seguimiento</h1>
                <p class="mt-1 text-sm text-muted-foreground">
                    Visitas de seguimiento post-adopción.
                </p>
                <a
                    href="/admin/seguimiento/crear"
                    class="rounded-lg bg-[#2D6A4F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#246142]"
                    >Nuevo Seguimiento</a
                >
            </div>
        </div>

        <div
            class="mt-6 overflow-hidden rounded-xl border border-border bg-card"
        >
            <table class="w-full text-left text-sm">
                <thead
                    class="border-b border-border/50 bg-muted text-xs font-medium text-muted-foreground uppercase"
                >
                    <tr>
                        <th class="px-5 py-3">Mascota</th>
                        <th class="px-5 py-3">Adoptante</th>
                        <th class="px-5 py-3">Fecha programada</th>
                        <th class="px-5 py-3">Estado</th>
                        <th class="px-5 py-3">Creado por</th>
                        <th class="px-5 py-3">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-border/50">
                    <tr
                        v-for="fu in followUps"
                        :key="fu.id"
                        class="hover:bg-muted"
                    >
                        <td class="px-5 py-4 font-medium text-card-foreground">
                            {{ fu.adoption.pet.name }}
                        </td>
                        <td class="px-5 py-4 text-muted-foreground">
                            {{ fu.adoption.adopter.name }}
                        </td>
                        <td class="px-5 py-4 text-muted-foreground">
                            {{ formatDate(fu.scheduled_date) }}
                        </td>
                        <td class="px-5 py-4">
                            <span
                                class="rounded-full px-3 py-0.5 text-xs font-medium"
                                :class="statusClass(fu.status)"
                                >{{ statusLabel(fu.status) }}</span
                            >
                        </td>
                        <td class="px-5 py-4 text-muted-foreground/70">
                            {{ fu.created_by.name }}
                        </td>
                        <td class="px-5 py-4">
                            <div class="flex items-center gap-2">
                                <a
                                    :href="'/admin/seguimiento/' + fu.id"
                                    class="text-xs text-[#2D6A4F] hover:underline"
                                    >Ver</a
                                >
                                <a
                                    :href="
                                        '/admin/seguimiento/' +
                                        fu.id +
                                        '/editar'
                                    "
                                    class="text-xs text-muted-foreground hover:text-[#2D6A4F]"
                                    >Editar</a
                                >
                                <button
                                    @click="destroy(fu.id)"
                                    class="text-xs text-red-500 hover:text-red-700"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="followUps.length === 0">
                        <td
                            colspan="6"
                            class="px-5 py-8 text-center text-muted-foreground/70"
                        >
                            No hay seguimientos registrados.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="meta.last_page > 1" class="mt-6 flex justify-center gap-2">
            <a
                v-for="page in meta.last_page"
                :key="page"
                :href="'/admin/seguimiento?page=' + page"
                class="rounded-lg px-3 py-1.5 text-sm"
                :class="
                    page === meta.current_page
                        ? 'bg-[#2D6A4F] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                "
                >{{ page }}</a
            >
        </div>
    </div>
</template>
