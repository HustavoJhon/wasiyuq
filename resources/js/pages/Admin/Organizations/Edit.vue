<script setup lang="ts">
import { useForm, router } from '@inertiajs/vue3';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Member {
    id: number;
    name: string;
    email: string;
    pivot: { role: string };
}

interface OrganizationEdit {
    id: number;
    name: string;
    slug: string;
    bio: string | null;
    website: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    logo: string | null;
    social_links: Record<string, string> | null;
    members: Member[];
}

const props = defineProps<{ organization: OrganizationEdit }>();

const form = useForm({
    name: props.organization.name,
    bio: props.organization.bio ?? '',
    website: props.organization.website ?? '',
    phone: props.organization.phone ?? '',
    address: props.organization.address ?? '',
    city: props.organization.city ?? '',
    state: props.organization.state ?? '',
});

function submit() {
    form.put(`/admin/organizaciones/${props.organization.id}`);
}

function destroy(id: number) {
    if (confirm('¿Estás seguro de eliminar esta organización? Esta acción no se puede deshacer.')) {
        router.delete(`/admin/organizaciones/${id}`);
    }
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

function initials(name: string): string {
    return name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
}
</script>

<template>
    <div class="mx-auto max-w-4xl">
        <a href="/admin/organizaciones" class="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-[#2D6A4F]">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Volver a organizaciones
        </a>

        <div class="mb-8 mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div class="flex items-center gap-4">
                <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#2D6A4F]/10 text-xl font-bold text-[#2D6A4F] dark:bg-[#2D6A4F]/20 dark:text-emerald-400">
                    {{ initials(organization.name) }}
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-foreground">{{ organization.name }}</h1>
                    <p class="mt-0.5 text-sm text-muted-foreground">Editá la información de la organización.</p>
                </div>
            </div>
            <button @click="destroy(organization.id)" class="inline-flex items-center gap-1.5 self-start rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30">
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
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 class="text-base font-semibold text-foreground">Información básica</h2>
                </div>

                <div class="grid gap-2">
                    <Label for="name">Nombre de la organización</Label>
                    <div class="relative">
                        <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <Input id="name" v-model="form.name" type="text" placeholder="Nombre de la organización" class="pl-9" :disabled="form.processing" />
                    </div>
                    <InputError :message="form.errors.name" />
                </div>

                <div class="mt-5 grid gap-2">
                    <Label for="bio">Descripción</Label>
                    <div class="relative">
                        <svg class="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        <textarea
                            id="bio" v-model="form.bio" rows="4"
                            class="block w-full rounded-xl border border-[#2D6A4F]/15 bg-white/60 py-2.5 pl-10 pr-4 text-sm text-foreground transition outline-none placeholder:text-muted-foreground/40 focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 dark:border-[#2D6A4F]/30 dark:bg-black/20"
                            placeholder="Descripción de la organización" :disabled="form.processing"
                        ></textarea>
                    </div>
                    <InputError :message="form.errors.bio" />
                </div>
            </div>

            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="mb-5 flex items-center gap-2">
                    <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <h2 class="text-base font-semibold text-foreground">Contacto</h2>
                </div>

                <div class="grid gap-5 sm:grid-cols-2">
                    <div class="grid gap-2">
                        <Label for="website">Sitio web</Label>
                        <div class="relative">
                            <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            <Input id="website" v-model="form.website" type="url" placeholder="https://ejemplo.com" class="pl-9" :disabled="form.processing" />
                        </div>
                        <InputError :message="form.errors.website" />
                    </div>
                    <div class="grid gap-2">
                        <Label for="phone">Teléfono</Label>
                        <div class="relative">
                            <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <Input id="phone" v-model="form.phone" type="tel" placeholder="+51 999 999 999" class="pl-9" :disabled="form.processing" />
                        </div>
                        <InputError :message="form.errors.phone" />
                    </div>
                </div>

                <div class="mt-5 grid gap-2">
                    <Label for="address">Dirección</Label>
                    <div class="relative">
                        <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <Input id="address" v-model="form.address" type="text" placeholder="Av. Principal 123" class="pl-9" :disabled="form.processing" />
                    </div>
                    <InputError :message="form.errors.address" />
                </div>

                <div class="mt-5 grid gap-5 sm:grid-cols-2">
                    <div class="grid gap-2">
                        <Label for="city">Ciudad</Label>
                        <div class="relative">
                            <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <Input id="city" v-model="form.city" type="text" placeholder="Ej: Cusco" class="pl-9" :disabled="form.processing" />
                        </div>
                        <InputError :message="form.errors.city" />
                    </div>
                    <div class="grid gap-2">
                        <Label for="state">Departamento</Label>
                        <Input id="state" v-model="form.state" type="text" placeholder="Ej: Cusco" :disabled="form.processing" />
                        <InputError :message="form.errors.state" />
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-4 rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <Button type="submit" :disabled="form.processing" class="min-w-[160px]">
                    <svg v-if="form.processing" class="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <svg v-else class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {{ form.processing ? 'Guardando...' : 'Guardar cambios' }}
                </Button>
                <a :href="'/admin/organizaciones/' + organization.slug" class="text-sm font-medium text-muted-foreground transition hover:text-foreground">Cancelar</a>
            </div>
        </form>

        <div class="mt-8 rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
            <div class="mb-5 flex items-center gap-2">
                <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h2 class="text-base font-semibold text-foreground">Miembros ({{ organization.members.length }})</h2>
            </div>

            <div v-if="organization.members.length === 0" class="text-sm text-muted-foreground/60">No hay miembros registrados.</div>
            <div v-else class="divide-y divide-[#2D6A4F]/10 dark:divide-[#2D6A4F]/20">
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
    </div>
</template>
