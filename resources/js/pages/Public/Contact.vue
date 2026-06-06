<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { ref } from 'vue';
import { toast } from 'vue-sonner';
import InputError from '@/components/InputError.vue';

interface Pet {
    id: number;
    name: string;
    slug: string;
    species: string;
    breed: string | null;
}

const props = defineProps<{
    selectedPet?: Pet | null;
}>();

const tab = ref<'contact' | 'login' | 'register'>('contact');

const form = useForm({
    name: '',
    email: '',
    subject: props.selectedPet ? 'Adopción de ' + props.selectedPet.name : '',
    message: props.selectedPet
        ? 'Hola, quiero adoptar a ' + props.selectedPet.name
        : '',
    pet: props.selectedPet?.slug ?? '',
});

function speciesLabel(s: string): string {
    const labels: Record<string, string> = {
        dog: 'Perro',
        cat: 'Gato',
        rabbit: 'Conejo',
        bird: 'Ave',
        other: 'Otro',
    };

    return labels[s] ?? s;
}

function handleSubmit() {
    form.post('/contacto', {
        onSuccess: () => {
            toast.success(
                'Mensaje enviado correctamente. Te responderemos pronto.',
            );
            form.reset();
        },
    });
}
</script>

<template>
    <div class="relative overflow-hidden">
        <div class="pointer-events-none absolute inset-0 -z-10">
            <div class="absolute -top-40 right-1/4 h-[600px] w-[600px] rounded-full bg-[#2D6A4F]/5 blur-3xl dark:bg-[#2D6A4F]/10" />
            <div class="absolute -bottom-40 left-1/4 h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-3xl dark:bg-emerald-500/10" />
        </div>

        <div class="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8">
            <div class="text-center">
                <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2D6A4F]/10 dark:bg-[#2D6A4F]/20">
                    <svg class="h-8 w-8 text-[#2D6A4F] dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </div>
                <h1 class="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                    Contacto
                </h1>
                <p class="mx-auto mt-3 max-w-lg text-base text-muted-foreground">
                    Estamos aquí para ayudarte. Elegí cómo querés comunicarte con nosotros.
                </p>
            </div>

            <div class="mx-auto mt-10 max-w-5xl">
                <div class="flex justify-center">
                    <div class="inline-flex rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-1.5 shadow-sm dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                        <button
                            class="rounded-xl px-6 py-2.5 text-sm font-semibold transition-all"
                            :class="
                                tab === 'contact'
                                    ? 'bg-[#2D6A4F] text-white shadow-md shadow-[#2D6A4F]/25'
                                    : 'text-muted-foreground hover:text-foreground'
                            "
                            @click="tab = 'contact'"
                        >
                            <span class="flex items-center gap-2">
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Contacto
                            </span>
                        </button>
                        <button
                            class="rounded-xl px-6 py-2.5 text-sm font-semibold transition-all"
                            :class="
                                tab === 'login'
                                    ? 'bg-[#2D6A4F] text-white shadow-md shadow-[#2D6A4F]/25'
                                    : 'text-muted-foreground hover:text-foreground'
                            "
                            @click="tab = 'login'"
                        >
                            <span class="flex items-center gap-2">
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                                Iniciar sesión
                            </span>
                        </button>
                        <button
                            class="rounded-xl px-6 py-2.5 text-sm font-semibold transition-all"
                            :class="
                                tab === 'register'
                                    ? 'bg-[#2D6A4F] text-white shadow-md shadow-[#2D6A4F]/25'
                                    : 'text-muted-foreground hover:text-foreground'
                            "
                            @click="tab = 'register'"
                        >
                            <span class="flex items-center gap-2">
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                Registrarse
                            </span>
                        </button>
                    </div>
                </div>

                <div
                    v-if="tab === 'contact'"
                    class="mt-12 grid gap-10 lg:grid-cols-5"
                >
                    <div class="lg:col-span-3">
                        <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-8 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                            <div
                                v-if="selectedPet"
                                class="mb-8 overflow-hidden rounded-xl border border-[#2D6A4F]/10 bg-[#2D6A4F]/5 p-4 dark:border-[#2D6A4F]/20 dark:bg-[#2D6A4F]/10"
                            >
                                <div class="flex items-center gap-4">
                                    <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#2D6A4F]/10 dark:bg-[#2D6A4F]/20">
                                        <svg class="h-7 w-7 text-[#2D6A4F] dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="text-sm font-semibold text-foreground">{{ selectedPet.name }}</p>
                                        <p class="text-xs text-muted-foreground">
                                            {{ speciesLabel(selectedPet.species) }}{{ selectedPet.breed ? ' - ' + selectedPet.breed : '' }}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <form @submit.prevent="handleSubmit" class="space-y-5">
                                <div class="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label class="text-sm font-medium text-foreground">Nombre completo</label>
                                        <div class="relative mt-1.5">
                                            <svg class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <input
                                                v-model="form.name"
                                                type="text"
                                                class="block w-full rounded-xl border border-[#2D6A4F]/15 bg-white/80 py-2.5 pl-10 pr-4 text-sm text-foreground transition outline-none placeholder:text-muted-foreground/40 focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 dark:border-[#2D6A4F]/30 dark:bg-black/30"
                                                :class="{ 'border-destructive': form.errors.name }"
                                                placeholder="Tu nombre"
                                            />
                                        </div>
                                        <InputError :message="form.errors.name" class="mt-1" />
                                    </div>
                                    <div>
                                        <label class="text-sm font-medium text-foreground">Correo electrónico</label>
                                        <div class="relative mt-1.5">
                                            <svg class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <input
                                                v-model="form.email"
                                                type="email"
                                                class="block w-full rounded-xl border border-[#2D6A4F]/15 bg-white/80 py-2.5 pl-10 pr-4 text-sm text-foreground transition outline-none placeholder:text-muted-foreground/40 focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 dark:border-[#2D6A4F]/30 dark:bg-black/30"
                                                :class="{ 'border-destructive': form.errors.email }"
                                                placeholder="correo@ejemplo.com"
                                            />
                                        </div>
                                        <InputError :message="form.errors.email" class="mt-1" />
                                    </div>
                                </div>

                                <input v-if="form.pet" v-model="form.pet" type="hidden" />

                                <div>
                                    <label class="text-sm font-medium text-foreground">Asunto</label>
                                    <div class="relative mt-1.5">
                                        <svg class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                        <select
                                            v-model="form.subject"
                                            class="block w-full rounded-xl border border-[#2D6A4F]/15 bg-white/80 py-2.5 pl-10 pr-10 text-sm text-foreground transition outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 dark:border-[#2D6A4F]/30 dark:bg-black/30"
                                            :class="{ 'border-destructive': form.errors.subject }"
                                        >
                                            <option value="" disabled>Seleccionar</option>
                                            <option>Adopción</option>
                                            <option>Mi entidad</option>
                                            <option>Reportar un problema</option>
                                            <option>Otro</option>
                                        </select>
                                    </div>
                                    <InputError :message="form.errors.subject" class="mt-1" />
                                </div>

                                <div>
                                    <label class="text-sm font-medium text-foreground">Mensaje</label>
                                    <div class="relative mt-1.5">
                                        <svg class="pointer-events-none absolute left-3.5 top-4 h-4 w-4 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                                        </svg>
                                        <textarea
                                            v-model="form.message"
                                            rows="4"
                                            class="block w-full rounded-xl border border-[#2D6A4F]/15 bg-white/80 py-2.5 pl-10 pr-4 text-sm text-foreground transition outline-none placeholder:text-muted-foreground/40 focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 dark:border-[#2D6A4F]/30 dark:bg-black/30"
                                            :class="{ 'border-destructive': form.errors.message }"
                                            placeholder="Escribí tu mensaje..."
                                        />
                                    </div>
                                    <InputError :message="form.errors.message" class="mt-1" />
                                </div>

                                <button
                                    type="submit"
                                    :disabled="form.processing"
                                    class="w-full rounded-xl bg-[#2D6A4F] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#2D6A4F]/20 transition hover:bg-[#246142] hover:shadow-xl hover:shadow-[#2D6A4F]/30 disabled:opacity-50"
                                >
                                    <span class="flex items-center justify-center gap-2">
                                        <svg v-if="form.processing" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                        {{ form.processing ? 'Enviando...' : 'Enviar mensaje' }}
                                    </span>
                                </button>
                            </form>
                        </div>
                    </div>

                    <div class="space-y-6 lg:col-span-2">
                        <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                            <h3 class="flex items-center gap-2 text-sm font-bold text-foreground">
                                <svg class="h-4 w-4 text-[#2D6A4F] dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Información de contacto
                            </h3>
                            <ul class="mt-4 space-y-4">
                                <li class="flex items-center gap-3 text-sm text-muted-foreground">
                                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2D6A4F]/10 dark:bg-[#2D6A4F]/20">
                                        <svg class="h-4 w-4 text-[#2D6A4F] dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </span>
                                    <span>info@wasiyuq.pe</span>
                                </li>
                                <li class="flex items-center gap-3 text-sm text-muted-foreground">
                                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2D6A4F]/10 dark:bg-[#2D6A4F]/20">
                                        <svg class="h-4 w-4 text-[#2D6A4F] dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </span>
                                    <span>Cusco, Perú</span>
                                </li>
                                <li class="flex items-center gap-3 text-sm text-muted-foreground">
                                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2D6A4F]/10 dark:bg-[#2D6A4F]/20">
                                        <svg class="h-4 w-4 text-[#2D6A4F] dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </span>
                                    <span>Respuesta en 24-48 hs</span>
                                </li>
                            </ul>
                        </div>

                        <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-br from-[#2D6A4F]/10 via-[#2D6A4F]/5 to-[#1B4332]/10 p-6 dark:border-[#2D6A4F]/40 dark:from-[#2D6A4F]/20 dark:via-[#1a2e24] dark:to-black/60">
                            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2D6A4F]/20 dark:bg-[#2D6A4F]/30">
                                <svg class="h-5 w-5 text-[#2D6A4F] dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h3 class="mt-4 text-sm font-bold text-foreground">¿Representás a una entidad?</h3>
                            <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
                                Registrate para publicar mascotas, eventos y anuncios en la plataforma.
                            </p>
                            <button
                                class="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#2D6A4F] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#2D6A4F]/20 transition hover:bg-[#246142]"
                                @click="tab = 'register'"
                            >
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Registrar entidad
                            </button>
                        </div>

                        <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                            <h3 class="flex items-center gap-2 text-sm font-bold text-foreground">
                                <svg class="h-4 w-4 text-[#2D6A4F] dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                Seguro y rápido
                            </h3>
                            <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
                                Tus datos están protegidos. Respondemos todos los mensajes en un máximo de 48 horas hábiles.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
