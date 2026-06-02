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
    if (confirm('¿Estás seguro de eliminar?')) {
        router.delete(`/admin/organizaciones/${id}`);
    }
}

function roleLabel(r: string): string {
    const labels: Record<string, string> = {
        owner: 'Propietario',
        admin: 'Administrador',
        member: 'Miembro',
    };

    return labels[r] ?? r;
}
</script>

<template>
    <div>
        <a
            href="/admin/organizaciones"
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
            Volver a organizaciones
        </a>

        <div class="mt-4 flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-foreground">
                    {{ organization.name }}
                </h1>
                <p class="mt-1 text-sm text-muted-foreground">
                    Editar información de la organización.
                </p>
            </div>
            <button
                @click="destroy(organization.id)"
                class="text-sm text-red-500 hover:text-red-700"
            >
                Eliminar organización
            </button>
        </div>

        <form @submit.prevent="submit" class="mt-6 max-w-lg space-y-5">
            <div class="space-y-1.5">
                <Label for="name">Nombre *</Label>
                <Input
                    id="name"
                    v-model="form.name"
                    :disabled="form.processing"
                />
                <InputError :message="form.errors.name" />
            </div>

            <div class="space-y-1.5">
                <Label for="bio">Descripción</Label>
                <textarea
                    id="bio"
                    v-model="form.bio"
                    rows="3"
                    class="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="form.processing"
                />
                <InputError :message="form.errors.bio" />
            </div>

            <div class="space-y-1.5">
                <Label for="website">Sitio web</Label>
                <Input
                    id="website"
                    v-model="form.website"
                    placeholder="https://"
                    :disabled="form.processing"
                />
                <InputError :message="form.errors.website" />
            </div>

            <div class="space-y-1.5">
                <Label for="phone">Teléfono</Label>
                <Input
                    id="phone"
                    v-model="form.phone"
                    :disabled="form.processing"
                />
                <InputError :message="form.errors.phone" />
            </div>

            <div class="space-y-1.5">
                <Label for="address">Dirección</Label>
                <Input
                    id="address"
                    v-model="form.address"
                    :disabled="form.processing"
                />
                <InputError :message="form.errors.address" />
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                    <Label for="city">Ciudad</Label>
                    <Input
                        id="city"
                        v-model="form.city"
                        :disabled="form.processing"
                    />
                    <InputError :message="form.errors.city" />
                </div>

                <div class="space-y-1.5">
                    <Label for="state">Departamento</Label>
                    <Input
                        id="state"
                        v-model="form.state"
                        :disabled="form.processing"
                    />
                    <InputError :message="form.errors.state" />
                </div>
            </div>

            <div class="flex items-center gap-3 pt-2">
                <Button
                    type="submit"
                    :disabled="form.processing"
                    class="bg-[#2D6A4F] text-white hover:bg-[#1B4332]"
                >
                    {{ form.processing ? 'Guardando...' : 'Guardar' }}
                </Button>
                <a
                    :href="`/admin/organizaciones/${organization.id}`"
                    class="text-sm text-muted-foreground hover:text-foreground"
                    >Cancelar</a
                >
            </div>
        </form>

        <div class="mt-10">
            <h2 class="text-lg font-semibold text-foreground">Miembros</h2>
            <p class="mt-1 text-sm text-muted-foreground">
                Usuarios pertenecientes a esta organización.
            </p>

            <div
                class="mt-4 overflow-hidden rounded-xl border border-border bg-card"
            >
                <table class="w-full text-left text-sm">
                    <thead
                        class="border-b border-border/50 bg-muted text-xs font-medium text-muted-foreground uppercase"
                    >
                        <tr>
                            <th class="px-5 py-3">Nombre</th>
                            <th class="px-5 py-3">Email</th>
                            <th class="px-5 py-3">Rol</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border/50">
                        <tr
                            v-for="member in organization.members"
                            :key="member.id"
                            class="hover:bg-muted"
                        >
                            <td
                                class="px-5 py-4 font-medium text-card-foreground"
                            >
                                {{ member.name }}
                            </td>
                            <td class="px-5 py-4 text-muted-foreground">
                                {{ member.email }}
                            </td>
                            <td class="px-5 py-4">
                                <span
                                    class="rounded-full px-3 py-0.5 text-xs font-medium"
                                    :class="
                                        member.pivot.role === 'owner'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : member.pivot.role === 'admin'
                                              ? 'bg-blue-100 text-blue-700'
                                              : 'bg-gray-100 text-gray-600'
                                    "
                                    >{{ roleLabel(member.pivot.role) }}</span
                                >
                            </td>
                        </tr>
                        <tr v-if="organization.members.length === 0">
                            <td
                                colspan="3"
                                class="px-5 py-8 text-center text-muted-foreground/70"
                            >
                                No hay miembros registrados.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
