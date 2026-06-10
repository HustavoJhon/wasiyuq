<script setup lang="ts">
import { Link } from '@inertiajs/vue3';

interface Member {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    role: string;
    role_label: string;
}

interface Team {
    id: number;
    name: string;
    slug: string;
}

defineProps<{
    members: Member[];
    currentTeam: Team;
}>();
</script>

<template>
    <div>
        <div class="mb-8 flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-foreground">Miembros del equipo</h1>
                <p class="mt-1 text-sm text-muted-foreground">{{ currentTeam.name }}</p>
            </div>
            <Link
                :href="`/settings/teams/${currentTeam.slug}`"
                class="rounded-lg bg-[#2D6A4F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#246142]"
            >
                Gestionar equipo
            </Link>
        </div>

        <div v-if="members.length === 0" class="text-sm text-muted-foreground/70 italic">
            No hay miembros en este equipo.
        </div>

        <div v-else class="space-y-2">
            <div
                v-for="member in members"
                :key="member.id"
                class="flex items-center justify-between rounded-lg border border-border bg-card p-4"
            >
                <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#2D6A4F]/10 text-sm font-bold text-[#2D6A4F]">
                        {{ member.name.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                        <p class="text-sm font-medium text-card-foreground">{{ member.name }}</p>
                        <p class="text-xs text-muted-foreground">{{ member.email }}</p>
                    </div>
                </div>
                <span class="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    {{ member.role_label }}
                </span>
            </div>
        </div>

        <p class="mt-6 text-xs text-muted-foreground/60">
            Para invitar, cambiar roles o eliminar miembros, usa el botón "Gestionar equipo".
        </p>
    </div>
</template>
