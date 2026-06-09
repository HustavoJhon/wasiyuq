<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePhotoUrl } from '@/composables/usePhotoUrl';

interface Pet {
    id: number;
    name: string;
    slug: string;
    species: string;
    status: string;
    photos: string[] | null;
    created_at: string;
}

interface Member {
    id: number;
    name: string;
    email: string;
    pivot: { role: string };
}

interface Organization {
    id: number;
    name: string;
    slug: string;
    bio: string | null;
    logo: string | null;
    website: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    social_links: Record<string, string> | null;
    pets_count: number;
    adoptions_count: number;
    announcements_count: number;
    blog_posts_count: number;
    members_count: number;
    pets: Pet[];
    members: Member[];
}

const props = defineProps<{
    organization: Organization;
    speciesStats: Record<string, number>;
    statusStats: Record<string, number>;
}>();

const petSearch = ref('');

const filteredPets = computed(() => {
    if (!petSearch.value) return props.organization.pets;
    const q = petSearch.value.toLowerCase();
    return props.organization.pets.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.species.toLowerCase().includes(q)
    );
});

const { photoUrl } = usePhotoUrl();

function speciesLabel(s: string): string {
    return speciesLabels[s] ?? s;
}

function statusLabel(s: string): string {
    return statusLabels[s] ?? s;
}

function statusColor(s: string): string {
    const colors: Record<string, string> = {
        available: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
        adopted: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
        in_process: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
        withheld: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    };
    return colors[s] ?? 'bg-gray-100 text-gray-600';
}

function formatDate(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(d));
}

function initials(name: string): string {
    return name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
}

function roleLabel(r: string): string {
    const labels: Record<string, string> = { owner: 'Propietario', admin: 'Administrador', member: 'Miembro' };
    return labels[r] ?? r;
}

function roleColor(r: string): string {
    const colors: Record<string, string> = {
        owner: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
        admin: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
        member: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    };
    return colors[r] ?? 'bg-gray-100 text-gray-600';
}

const speciesEntries = computed(() => Object.entries(props.speciesStats));
const statusEntries = computed(() => Object.entries(props.statusStats));
</script>

<template>
    <div>
        <a href="/admin/organizaciones" class="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-[#2D6A4F]">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Volver a organizaciones
        </a>

        <div class="mt-5 rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
            <div class="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
                <div class="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#2D6A4F]/10 text-2xl font-bold text-[#2D6A4F] dark:bg-[#2D6A4F]/20 dark:text-emerald-400">
                    {{ initials(organization.name) }}
                </div>
                <div class="min-w-0 flex-1">
                    <h1 class="text-2xl font-bold text-foreground">{{ organization.name }}</h1>
                    <p v-if="organization.city || organization.state" class="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {{ organization.city }}{{ organization.state ? ', ' + organization.state : '' }}
                    </p>
                    <p v-if="organization.bio" class="mt-3 text-sm leading-relaxed text-muted-foreground">{{ organization.bio }}</p>
                    <div class="mt-4 flex flex-wrap items-center gap-4 text-sm">
                        <a v-if="organization.website" :href="organization.website" target="_blank" class="inline-flex items-center gap-1.5 rounded-lg border border-[#2D6A4F]/15 px-3 py-1.5 text-muted-foreground transition hover:border-[#2D6A4F]/30 hover:text-[#2D6A4F]">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            {{ organization.website.replace(/^https?:\/\//, '') }}
                        </a>
                        <span v-if="organization.phone" class="inline-flex items-center gap-1.5 text-muted-foreground">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {{ organization.phone }}
                        </span>
                        <span v-if="organization.address" class="inline-flex items-center gap-1.5 text-muted-foreground">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {{ organization.address }}
                        </span>
                    </div>
                </div>
                <a :href="'/admin/organizaciones/' + organization.slug + '/editar'" class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#2D6A4F]/20 px-4 py-2 text-sm font-medium text-[#2D6A4F] transition hover:bg-[#2D6A4F]/5 dark:text-emerald-400">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                </a>
            </div>
        </div>

        <div class="mt-5 grid gap-4 sm:grid-cols-4">
            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-4 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2D6A4F]/10">
                        <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-2xl font-bold text-foreground">{{ organization.pets_count }}</p>
                        <p class="text-xs text-muted-foreground">Mascotas</p>
                    </div>
                </div>
            </div>
            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-4 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                        <svg class="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-2xl font-bold text-foreground">{{ organization.adoptions_count }}</p>
                        <p class="text-xs text-muted-foreground">Adopciones</p>
                    </div>
                </div>
            </div>
            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-4 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                        <svg class="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-2xl font-bold text-foreground">{{ organization.announcements_count }}</p>
                        <p class="text-xs text-muted-foreground">Eventos</p>
                    </div>
                </div>
            </div>
            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-4 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                        <svg class="h-5 w-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-2xl font-bold text-foreground">{{ organization.blog_posts_count }}</p>
                        <p class="text-xs text-muted-foreground">Artículos</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-5 grid gap-5 lg:grid-cols-2">
            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <h3 class="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <svg class="h-4 w-4 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Mascotas por especie
                </h3>
                <div v-if="speciesEntries.length === 0" class="mt-4 text-sm text-muted-foreground/60">Sin datos</div>
                <div v-else class="mt-4 space-y-3">
                    <div v-for="[key, count] in speciesEntries" :key="key" class="flex items-center gap-3">
                        <span class="inline-block h-3 w-3 rounded" :style="{ backgroundColor: speciesColors[key] ?? '#78716c' }" />
                        <span class="flex-1 text-sm text-muted-foreground">{{ speciesLabels[key] ?? key }}</span>
                        <span class="text-sm font-medium text-foreground">{{ count }}</span>
                    </div>
                </div>
            </div>

            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <h3 class="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <svg class="h-4 w-4 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Mascotas por estado
                </h3>
                <div v-if="statusEntries.length === 0" class="mt-4 text-sm text-muted-foreground/60">Sin datos</div>
                <div v-else class="mt-4 space-y-3">
                    <div v-for="[key, count] in statusEntries" :key="key" class="flex items-center gap-3">
                        <span class="inline-block h-3 w-3 rounded" :style="{ backgroundColor: statusColors[key] ?? '#78716c' }" />
                        <span class="flex-1 text-sm text-muted-foreground">{{ statusLabels[key] ?? key }}</span>
                        <span class="text-sm font-medium text-foreground">{{ count }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-5 rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
            <div class="flex flex-wrap items-center justify-between gap-3">
                <h2 class="flex items-center gap-2 text-base font-semibold text-foreground">
                    <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Miembros ({{ organization.members_count }})
                </h2>
            </div>
            <div v-if="organization.members.length === 0" class="mt-4 text-sm text-muted-foreground/60">Sin miembros.</div>
            <div v-else class="mt-4 divide-y divide-[#2D6A4F]/10 dark:divide-[#2D6A4F]/20">
                <div v-for="member in organization.members" :key="member.id" class="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div class="flex items-center gap-3">
                        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2D6A4F]/10 text-xs font-bold text-[#2D6A4F] dark:bg-[#2D6A4F]/20 dark:text-emerald-400">
                            {{ member.name.charAt(0).toUpperCase() }}
                        </div>
                        <div>
                            <p class="text-sm font-medium text-foreground">{{ member.name }}</p>
                            <p class="text-xs text-muted-foreground">{{ member.email }}</p>
                        </div>
                    </div>
                    <span class="rounded-full px-3 py-0.5 text-xs font-medium" :class="roleColor(member.pivot.role)">{{ roleLabel(member.pivot.role) }}</span>
                </div>
            </div>
        </div>

        <div class="mt-5 rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
            <div class="flex flex-wrap items-center justify-between gap-3">
                <h2 class="flex items-center gap-2 text-base font-semibold text-foreground">
                    <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Mascotas (últimas {{ organization.pets.length }})
                </h2>
                <div class="relative w-full sm:w-64">
                    <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        v-model="petSearch"
                        type="text"
                        placeholder="Buscar en esta organización..."
                        class="block w-full rounded-xl border border-[#2D6A4F]/15 bg-white/60 py-2 pl-9 pr-4 text-sm text-foreground transition outline-none placeholder:text-muted-foreground/40 focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 dark:border-[#2D6A4F]/30 dark:bg-black/20"
                    />
                </div>
            </div>

            <div v-if="organization.pets.length === 0" class="mt-6 flex flex-col items-center justify-center py-8 text-muted-foreground/50">
                <svg class="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="mt-2 text-sm font-medium text-foreground/60">Sin mascotas registradas</p>
            </div>
            <div v-else class="mt-4 divide-y divide-[#2D6A4F]/10 dark:divide-[#2D6A4F]/20">
                <div v-for="pet in filteredPets" :key="pet.id" class="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                    <div class="flex items-center gap-3 min-w-0">
                        <div class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#2D6A4F]/10 text-lg dark:bg-[#2D6A4F]/20">
                            <img v-if="pet.photos && pet.photos.length > 0" :src="photoUrl(pet.photos[0])" :alt="pet.name" class="h-full w-full object-cover" />
                            <span v-else>🐾</span>
                        </div>
                        <div class="min-w-0">
                            <a :href="'/admin/mascotas/' + pet.id" class="text-sm font-medium text-foreground transition hover:text-[#2D6A4F] dark:hover:text-emerald-400">{{ pet.name }}</a>
                            <p class="text-xs text-muted-foreground">{{ speciesLabel(pet.species) }} · {{ formatDate(pet.created_at) }}</p>
                        </div>
                    </div>
                    <span class="shrink-0 rounded-full px-3 py-0.5 text-xs font-medium" :class="statusColor(pet.status)">{{ statusLabel(pet.status) }}</span>
                </div>
                <div v-if="filteredPets.length === 0" class="py-8 text-center text-sm text-muted-foreground/60">
                    No se encontraron mascotas con "{{ petSearch }}"
                </div>
            </div>
        </div>
    </div>
</template>
