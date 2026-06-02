<script setup lang="ts">
import { useForm, router } from '@inertiajs/vue3';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    slug: string;
}

interface EventEdit {
    id: number;
    team_id: number;
    title: string;
    slug: string;
    description: string | null;
    event_date: string | null;
    location: string | null;
    type: string;
    cover_image: string | null;
    is_published: boolean;
    team: { name: string };
}

const props = defineProps<{ event: EventEdit; teams: Team[] }>();

const form = useForm({
    team_id: String(props.event.team_id),
    title: props.event.title,
    description: props.event.description ?? '',
    event_date: props.event.event_date ?? '',
    location: props.event.location ?? '',
    type: props.event.type,
    cover_image: props.event.cover_image ?? '',
    is_published: props.event.is_published,
});

function submit() {
    form.put(`/admin/eventos/${props.event.id}`);
}

function destroy(id: number) {
    if (confirm('¿Estás seguro de eliminar?')) {
        router.delete(`/admin/eventos/${id}`);
    }
}
</script>

<template>
    <div>
        <a
            href="/admin/eventos"
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
            Volver a eventos
        </a>

        <div class="mt-4 flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-foreground">
                    {{ event.title }}
                </h1>
                <p class="mt-1 text-sm text-muted-foreground">
                    Editar evento o campaña.
                </p>
            </div>
            <button
                @click="destroy(event.id)"
                class="text-sm text-red-500 hover:text-red-700"
            >
                Eliminar evento
            </button>
        </div>

        <form @submit.prevent="submit" class="mt-6 max-w-lg space-y-5">
            <div class="space-y-1.5">
                <Label for="team_id">Organización *</Label>
                <Select @update:model-value="(v: string) => (form.team_id = v)">
                    <SelectTrigger class="w-full">
                        <SelectValue :placeholder="event.team.name" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem
                            v-for="team in teams"
                            :key="team.id"
                            :value="String(team.id)"
                            >{{ team.name }}</SelectItem
                        >
                    </SelectContent>
                </Select>
                <InputError :message="form.errors.team_id" />
            </div>

            <div class="space-y-1.5">
                <Label for="title">Título *</Label>
                <Input
                    id="title"
                    v-model="form.title"
                    :disabled="form.processing"
                />
                <InputError :message="form.errors.title" />
            </div>

            <div class="space-y-1.5">
                <Label for="description">Descripción</Label>
                <textarea
                    id="description"
                    v-model="form.description"
                    rows="4"
                    class="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="form.processing"
                />
                <InputError :message="form.errors.description" />
            </div>

            <div class="space-y-1.5">
                <Label for="event_date">Fecha del evento</Label>
                <Input
                    id="event_date"
                    type="date"
                    v-model="form.event_date"
                    :disabled="form.processing"
                />
                <InputError :message="form.errors.event_date" />
            </div>

            <div class="space-y-1.5">
                <Label for="location">Ubicación</Label>
                <Input
                    id="location"
                    v-model="form.location"
                    :disabled="form.processing"
                />
                <InputError :message="form.errors.location" />
            </div>

            <div class="space-y-1.5">
                <Label for="type">Tipo *</Label>
                <Select @update:model-value="(v: string) => (form.type = v)">
                    <SelectTrigger class="w-full">
                        <SelectValue :placeholder="form.type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="adoption_fair"
                            >Feria de adopción</SelectItem
                        >
                        <SelectItem value="fundraiser">Recaudación</SelectItem>
                        <SelectItem value="workshop">Taller</SelectItem>
                        <SelectItem value="campaign">Campaña</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                </Select>
                <InputError :message="form.errors.type" />
            </div>

            <div class="space-y-1.5">
                <Label for="cover_image">URL de imagen de portada</Label>
                <Input
                    id="cover_image"
                    v-model="form.cover_image"
                    placeholder="https://"
                    :disabled="form.processing"
                />
                <InputError :message="form.errors.cover_image" />
            </div>

            <div class="flex items-center gap-2">
                <input
                    id="is_published"
                    type="checkbox"
                    v-model="form.is_published"
                    class="h-4 w-4 rounded border-gray-300 text-[#2D6A4F] focus:ring-[#2D6A4F]"
                    :disabled="form.processing"
                />
                <Label for="is_published" class="!m-0">Publicado</Label>
            </div>
            <InputError :message="form.errors.is_published" />

            <div class="flex items-center gap-3 pt-2">
                <Button
                    type="submit"
                    :disabled="form.processing"
                    class="bg-[#2D6A4F] text-white hover:bg-[#1B4332]"
                >
                    {{ form.processing ? 'Guardando...' : 'Guardar' }}
                </Button>
                <a
                    :href="`/admin/eventos/${event.id}`"
                    class="text-sm text-muted-foreground hover:text-foreground"
                    >Cancelar</a
                >
            </div>
        </form>
    </div>
</template>
