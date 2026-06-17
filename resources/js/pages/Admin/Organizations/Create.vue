<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { ref } from 'vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const form = useForm({
    name: '',
    bio: '',
    logo: null as File | null,
    website: '',
    phone: '',
    address: '',
    city: '',
    state: '',
});

const logoPreview = ref<string | null>(null);

function onLogoChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
        form.logo = file;
        const reader = new FileReader();
        reader.onload = () => { logoPreview.value = reader.result as string; };
        reader.readAsDataURL(file);
    }
}

function submit() {
    form.post('/admin/organizaciones');
}
</script>

<template>
    <div class="mx-auto max-w-3xl">
        <a href="/admin/organizaciones" class="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-[#2D6A4F]">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Volver a organizaciones
        </a>

        <div class="mb-8 mt-5">
            <div class="flex items-center gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2D6A4F]/10">
                    <svg class="h-6 w-6 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-foreground">Nueva Organización</h1>
                    <p class="mt-0.5 text-sm text-muted-foreground">Registrá una nueva entidad en la plataforma.</p>
                </div>
            </div>
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
                        <Input
                            id="name"
                            v-model="form.name"
                            type="text"
                            placeholder="Ej: Municipalidad de Cusco, Patitas Felices"
                            class="pl-9"
                            :disabled="form.processing"
                        />
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
                            id="bio"
                            v-model="form.bio"
                            rows="4"
                            class="block w-full rounded-xl border border-[#2D6A4F]/15 bg-white/60 py-2.5 pl-10 pr-4 text-sm text-foreground transition outline-none placeholder:text-muted-foreground/40 focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 dark:border-[#2D6A4F]/30 dark:bg-black/20"
                            placeholder="Contá un poco sobre la organización: su misión, visión, área de trabajo..."
                            :disabled="form.processing"
                        ></textarea>
                    </div>
                    <InputError :message="form.errors.bio" />
                </div>
            </div>

            <div class="rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="mb-5 flex items-center gap-2">
                    <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h2 class="text-base font-semibold text-foreground">Logo</h2>
                </div>
                <div class="flex flex-col gap-5 sm:flex-row sm:items-start">
                    <div class="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#2D6A4F]/15 bg-muted/30">
                        <img v-if="logoPreview" :src="logoPreview" alt="Preview" class="h-full w-full object-cover" />
                        <svg v-else class="h-10 w-10 text-muted-foreground/25" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div class="flex-1">
                        <Label for="logo">Imagen del logo</Label>
                        <input id="logo" type="file" accept="image/jpeg,image/png,image/webp"
                            @change="onLogoChange"
                            class="mt-2 block w-full cursor-pointer rounded-lg border border-border bg-background text-sm text-muted-foreground file:mr-4 file:border-0 file:bg-[#2D6A4F] file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-white file:cursor-pointer hover:file:bg-[#246142] file:transition-colors" />
                        <InputError :message="form.errors.logo" />
                        <p class="mt-1.5 text-xs text-muted-foreground/60">PNG, JPG o WebP. Máximo 2 MB.</p>
                    </div>
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
                            <Input
                                id="website"
                                v-model="form.website"
                                type="url"
                                placeholder="https://ejemplo.com"
                                class="pl-9"
                                :disabled="form.processing"
                            />
                        </div>
                        <InputError :message="form.errors.website" />
                    </div>

                    <div class="grid gap-2">
                        <Label for="phone">Teléfono</Label>
                        <div class="relative">
                            <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <Input
                                id="phone"
                                v-model="form.phone"
                                type="tel"
                                placeholder="+51 999 999 999"
                                class="pl-9"
                                :disabled="form.processing"
                            />
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
                        <Input
                            id="address"
                            v-model="form.address"
                            type="text"
                            placeholder="Av. Principal 123"
                            class="pl-9"
                            :disabled="form.processing"
                        />
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
                            <Input
                                id="city"
                                v-model="form.city"
                                type="text"
                                placeholder="Ej: Cusco"
                                class="pl-9"
                                :disabled="form.processing"
                            />
                        </div>
                        <InputError :message="form.errors.city" />
                    </div>

                    <div class="grid gap-2">
                        <Label for="state">Departamento</Label>
                        <Input
                            id="state"
                            v-model="form.state"
                            type="text"
                            placeholder="Ej: Cusco"
                            :disabled="form.processing"
                        />
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
                    {{ form.processing ? 'Guardando...' : 'Crear organización' }}
                </Button>
                <a href="/admin/organizaciones" class="text-sm font-medium text-muted-foreground transition hover:text-foreground">Cancelar</a>
            </div>
        </form>
    </div>
</template>
