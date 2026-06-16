<script setup lang="ts">
import { useForm, Link } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
}

interface TeamRole {
    value: string;
    label: string;
}

const props = defineProps<{
    teams: Team[];
    teamRoles: TeamRole[];
}>();

const form = useForm({
    name: '',
    email: '',
    password: '',
    verified: false,
    is_super_admin: false,
    team_id: '',
    team_role: 'member',
});

function submit() {
    form.post('/admin/usuarios');
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
            <h1 class="text-xl font-bold text-foreground">Crear Usuario</h1>
            <p class="mt-1 text-sm text-muted-foreground">Creá un nuevo usuario en la plataforma.</p>

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
                    <Label for="password">Contraseña</Label>
                    <Input id="password" v-model="form.password" type="password" class="mt-1.5" :class="{ 'border-red-500': form.errors.password }" />
                    <p v-if="form.errors.password" class="mt-1 text-xs text-red-500">{{ form.errors.password }}</p>
                </div>

                <div class="flex items-center gap-2">
                    <Checkbox id="verified" v-model:checked="form.verified" />
                    <Label for="verified" class="text-sm font-normal">Marcar como verificado</Label>
                </div>

                <div class="flex items-center gap-2">
                    <Checkbox id="is_super_admin" v-model:checked="form.is_super_admin" />
                    <Label for="is_super_admin" class="text-sm font-normal">Hacer Super Admin</Label>
                </div>

                <div class="border-t border-[#2D6A4F]/10 pt-5 dark:border-[#2D6A4F]/20">
                    <h2 class="text-sm font-semibold text-foreground">Asignar a un equipo (opcional)</h2>
                    <div class="mt-3 grid gap-4 sm:grid-cols-2">
                        <div>
                            <Label for="team">Equipo</Label>
                            <Select v-model="form.team_id">
                                <SelectTrigger id="team" class="mt-1.5">
                                    <SelectValue placeholder="Seleccionar equipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem :value="undefined">Sin equipo</SelectItem>
                                    <SelectItem v-for="t in teams" :key="t.id" :value="String(t.id)">{{ t.name }}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label for="team-role">Rol en el equipo</Label>
                            <Select v-model="form.team_role">
                                <SelectTrigger id="team-role" class="mt-1.5">
                                    <SelectValue placeholder="Seleccionar rol" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="r in teamRoles" :key="r.value" :value="r.value">{{ r.label }}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-end gap-3 pt-2">
                    <Link href="/admin/usuarios" class="text-sm text-muted-foreground transition hover:text-foreground">Cancelar</Link>
                    <Button type="submit" :disabled="form.processing" class="bg-[#2D6A4F] hover:bg-[#245a40]">
                        {{ form.processing ? 'Creando...' : 'Crear Usuario' }}
                    </Button>
                </div>
            </form>
        </div>
    </div>
</template>
