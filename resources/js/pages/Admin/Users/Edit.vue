<script setup lang="ts">
import { useForm, Link } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Team {
    id: number;
    name: string;
    slug: string;
}

interface Membership {
    id: number;
    team: Team;
    role: string;
}

interface UserDetail {
    id: number;
    name: string;
    email: string;
    is_super_admin: boolean;
    email_verified_at: string | null;
    created_at: string;
    memberships: Membership[];
}

const props = defineProps<{
    user: UserDetail;
    teams: Team[];
    teamRoles: { value: string; label: string }[];
}>();

const form = useForm({
    name: props.user.name,
    email: props.user.email,
    password: '',
    is_super_admin: props.user.is_super_admin,
});

function submit() {
    form.put('/admin/usuarios/' + props.user.id);
}

function initials(name: string): string {
    return name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
}

function roleLabel(r: string): string {
    const labels: Record<string, string> = { owner: 'Propietario', admin: 'Administrador', member: 'Miembro' };

    return labels[r] ?? r;
}
</script>

<template>
    <div class="mx-auto max-w-2xl">
        <Link href="/admin/usuarios" class="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-[#2D6A4F]">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Volver a usuarios
        </Link>

        <div class="mt-6 rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
            <div class="flex items-center gap-4">
                <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#2D6A4F]/10 text-lg font-bold text-[#2D6A4F] dark:bg-[#2D6A4F]/20 dark:text-emerald-400">
                    {{ initials(user.name) }}
                </div>
                <div>
                    <h1 class="text-xl font-bold text-foreground">Editar Usuario</h1>
                    <p class="mt-0.5 text-sm text-muted-foreground">Actualizá los datos del usuario.</p>
                </div>
            </div>

            <form @submit.prevent="submit" class="mt-6 space-y-5">
                <div>
                    <Label for="name">Nombre</Label>
                    <Input id="name" v-model="form.name" type="text" class="mt-1.5" :class="{ 'border-red-500': form.errors.name }" />
                    <p v-if="form.errors.name" class="mt-1 text-xs text-red-500">{{ form.errors.name }}</p>
                </div>

                <div>
                    <Label for="email">Correo electrónico</Label>
                    <Input id="email" v-model="form.email" type="email" class="mt-1.5" :class="{ 'border-red-500': form.errors.email }" />
                    <p v-if="form.errors.email" class="mt-1 text-xs text-red-500">{{ form.errors.email }}</p>
                </div>

                <div>
                    <Label for="password">Nueva contraseña <span class="text-muted-foreground/60">(dejá vacío para mantener la actual)</span></Label>
                    <Input id="password" v-model="form.password" type="password" class="mt-1.5" :class="{ 'border-red-500': form.errors.password }" />
                    <p v-if="form.errors.password" class="mt-1 text-xs text-red-500">{{ form.errors.password }}</p>
                </div>

                <div class="flex items-center gap-2">
                    <Checkbox id="is_super_admin" :checked="form.is_super_admin" @update:checked="form.is_super_admin = !!$event" />
                    <Label for="is_super_admin" class="text-sm font-normal">Es Super Admin</Label>
                </div>

                <div v-if="user.memberships.length > 0" class="border-t border-[#2D6A4F]/10 pt-5 dark:border-[#2D6A4F]/20">
                    <h2 class="text-sm font-semibold text-foreground">Membresías</h2>
                    <div class="mt-3 space-y-2">
                        <div v-for="m in user.memberships" :key="m.id" class="flex items-center justify-between rounded-lg border border-[#2D6A4F]/10 px-4 py-2.5 dark:border-[#2D6A4F]/20">
                            <span class="text-sm font-medium text-foreground">{{ m.team.name }}</span>
                            <span class="rounded-full px-3 py-0.5 text-xs font-medium"
                                :class="m.role === 'owner' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' : m.role === 'admin' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'"
                            >{{ roleLabel(m.role) }}</span>
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-end gap-3 pt-2">
                    <Link href="/admin/usuarios" class="text-sm text-muted-foreground transition hover:text-foreground">Cancelar</Link>
                    <Button type="submit" :disabled="form.processing" class="bg-[#2D6A4F] hover:bg-[#245a40]">
                        {{ form.processing ? 'Guardando...' : 'Guardar Cambios' }}
                    </Button>
                </div>
            </form>
        </div>
    </div>
</template>
