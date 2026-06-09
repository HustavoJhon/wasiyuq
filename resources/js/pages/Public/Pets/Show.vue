<script setup lang="ts">
import { useForm, usePage } from '@inertiajs/vue3';
import { ref, computed } from 'vue';

interface Pet {
    id: number;
    name: string;
    slug: string;
    species: string;
    breed: string | null;
    age_years: number;
    age_months: number;
    gender: string;
    size: string;
    color: string | null;
    description: string;
    medical_notes: string | null;
    status: string;
    photos: string[] | null;
    team: {
        id: number;
        name: string;
        slug: string;
        bio: string | null;
        logo: string | null;
        website: string | null;
        phone: string | null;
        city: string | null;
        state: string | null;
    };
}

const props = defineProps<{ pet: Pet }>();
const page = usePage();
const isAuthenticated = !!page.props.auth?.user;
const showForm = ref(false);
const errors = computed(() => page.props.errors as Record<string, string>);

const form = useForm({
    motivation: '',
    experience_with_pets: false,
    has_yard: false,
    housing_type: 'house',
    family_composition: '',
    why_this_pet: '',
    has_children: null,
    other_pets: '',
    housing_ownership: '',
    hours_alone: '',
    veterinary_plan: '',
    agreement: false,
});

function submit(): void {
    form.post(`/mascotas/${props.pet.slug}/postular`, {
        preserveScroll: true,
        onSuccess: () => {
            showForm.value = false;
            form.reset();
        },
    });
}

function openForm(): void {
    if (!isAuthenticated) {
        window.location.href =
            '/login?redirect=' + encodeURIComponent(window.location.pathname);

        return;
    }

    showForm.value = true;
}

function formatAge(years: number, months: number): string {
    if (years > 0) {
        return years + ' año' + (years > 1 ? 's' : '');
    }

    if (months > 0) {
        return months + ' mes' + (months > 1 ? 'es' : '');
    }

    return 'Cachorro';
}

function speciesLabel(species: string): string {
    const labels: Record<string, string> = {
        dog: 'Perro',
        cat: 'Gato',
        rabbit: 'Conejo',
        bird: 'Ave',
        other: 'Otro',
    };

    return labels[species] ?? species;
}

function sizeLabel(size: string): string {
    const labels: Record<string, string> = {
        small: 'Pequeño',
        medium: 'Mediano',
        large: 'Grande',
    };

    return labels[size] ?? size;
}

function genderLabel(gender: string): string {
    const labels: Record<string, string> = { male: 'Macho', female: 'Hembra' };

    return labels[gender] ?? gender;
}

function statusLabel(status: string): string {
    const labels: Record<string, string> = {
        available: 'Disponible',
        in_process: 'En Proceso',
        adopted: 'Adoptado',
        withheld: 'Reservado',
    };

    return labels[status] ?? status;
}
</script>

<template>
    <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <a
            href="/mascotas"
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
            Volver a mascotas
        </a>

        <div class="mt-6 grid gap-12 lg:grid-cols-2">
            <div
                v-if="pet.photos && pet.photos.length > 0"
                class="aspect-[4/3] overflow-hidden rounded-2xl"
            >
                <img
                    :src="'/storage/' + pet.photos[0]"
                    :alt="pet.name"
                    class="h-full w-full object-cover"
                />
            </div>
            <div
                v-else
                class="aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-muted to-muted/80"
            />

            <div>
                <div class="flex items-start justify-between">
                    <div>
                        <h1 class="text-3xl font-bold text-foreground">
                            {{ pet.name }}
                        </h1>
                        <p class="mt-1 text-muted-foreground">
                            {{ pet.breed }} &middot;
                            {{ speciesLabel(pet.species) }}
                        </p>
                    </div>
                    <span
                        class="rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700"
                        >{{ statusLabel(pet.status) }}</span
                    >
                </div>

                <div
                    class="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-muted p-5"
                >
                    <div>
                        <span class="text-xs text-muted-foreground/70"
                            >Edad</span
                        >
                        <p class="text-sm font-medium text-foreground">
                            {{ formatAge(pet.age_years, pet.age_months) }}
                        </p>
                    </div>
                    <div>
                        <span class="text-xs text-muted-foreground/70"
                            >Tamaño</span
                        >
                        <p class="text-sm font-medium text-foreground">
                            {{ sizeLabel(pet.size) }}
                        </p>
                    </div>
                    <div>
                        <span class="text-xs text-muted-foreground/70"
                            >Sexo</span
                        >
                        <p class="text-sm font-medium text-foreground">
                            {{ genderLabel(pet.gender) }}
                        </p>
                    </div>
                    <div>
                        <span class="text-xs text-muted-foreground/70"
                            >Color</span
                        >
                        <p class="text-sm font-medium text-foreground">
                            {{ pet.color }}
                        </p>
                    </div>
                </div>

                <div class="mt-6">
                    <h3 class="text-sm font-semibold text-foreground">
                        Descripción
                    </h3>
                    <p
                        class="mt-2 text-sm leading-relaxed text-muted-foreground"
                    >
                        {{ pet.description }}
                    </p>
                </div>

                <div v-if="pet.medical_notes" class="mt-6">
                    <h3 class="text-sm font-semibold text-foreground">
                        Notas médicas
                    </h3>
                    <p class="mt-1 text-sm text-muted-foreground">
                        {{ pet.medical_notes }}
                    </p>
                </div>

                <div
                    class="mt-6 rounded-2xl border border-border bg-muted/50 p-4"
                >
                    <p class="text-xs text-muted-foreground/70">
                        Entidad responsable
                    </p>
                    <p class="mt-0.5 text-sm font-medium text-foreground">
                        {{ pet.team.name }}
                    </p>
                    <p class="text-xs text-muted-foreground/70">
                        {{ pet.team.city }}, {{ pet.team.state }}
                    </p>
                    <p
                        v-if="pet.team.phone"
                        class="mt-1 text-xs text-muted-foreground/70"
                    >
                        {{ pet.team.phone }}
                    </p>
                </div>

                <button
                    v-if="pet.status === 'available'"
                    class="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-[#2D6A4F] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2D6A4F]/25 transition hover:bg-[#246142]"
                    @click="openForm()"
                >
                    Quiero adoptarlo
                </button>
            </div>
        </div>

        <div
            v-if="showForm"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            @click.self="showForm = false"
        >
            <div class="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card p-6 shadow-xl">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2D6A4F]/10">
                            <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <div>
                            <h2 class="text-lg font-semibold text-foreground">Solicitar adopción</h2>
                            <p class="text-sm text-muted-foreground">{{ pet.name }} · {{ pet.team.name }}</p>
                        </div>
                    </div>
                    <button class="text-muted-foreground hover:text-foreground" @click="showForm = false">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form class="mt-6 space-y-5" @submit.prevent="submit">
                    <!-- Motivación y vínculo -->
                    <div class="rounded-xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                        <div class="mb-4 flex items-center gap-2">
                            <svg class="h-4 w-4 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <h3 class="text-sm font-semibold text-foreground">Motivación y vínculo</h3>
                        </div>
                        <div class="space-y-4">
                            <div>
                                <label class="text-sm font-medium text-foreground">¿Por qué quieres adoptarlo?</label>
                                <textarea v-model="form.motivation"
                                    class="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-[#2D6A4F]"
                                    :class="errors.motivation ? 'border-red-500' : 'border-border'"
                                    rows="3" placeholder="Cuéntanos tu motivación (mín. 150 caracteres)..."
                                ></textarea>
                                <p v-if="errors.motivation" class="mt-1 text-xs text-red-500">{{ errors.motivation }}</p>
                            </div>
                            <div>
                                <label class="text-sm font-medium text-foreground">¿Qué te llamó la atención de {{ pet.name }}?</label>
                                <textarea v-model="form.why_this_pet"
                                    class="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[#2D6A4F]"
                                    rows="2" placeholder="Su personalidad, su historia, su aspecto..."
                                ></textarea>
                                <p v-if="errors.why_this_pet" class="mt-1 text-xs text-red-500">{{ errors.why_this_pet }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Tu hogar -->
                    <div class="rounded-xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                        <div class="mb-4 flex items-center gap-2">
                            <svg class="h-4 w-4 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <h3 class="text-sm font-semibold text-foreground">Tu hogar</h3>
                        </div>
                        <div class="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label class="text-sm font-medium text-foreground">Tipo de vivienda</label>
                                <select v-model="form.housing_type"
                                    class="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-[#2D6A4F]"
                                    :class="errors.housing_type ? 'border-red-500' : 'border-border'"
                                >
                                    <option value="house">Casa</option>
                                    <option value="apartment">Departamento</option>
                                    <option value="condo">Condominio</option>
                                    <option value="other">Otro</option>
                                </select>
                                <p v-if="errors.housing_type" class="mt-1 text-xs text-red-500">{{ errors.housing_type }}</p>
                            </div>
                            <div>
                                <label class="text-sm font-medium text-foreground">¿La vivienda es...</label>
                                <select v-model="form.housing_ownership"
                                    class="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[#2D6A4F]"
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="own">Propia</option>
                                    <option value="rent">Alquilada</option>
                                    <option value="other">Otro</option>
                                </select>
                                <p v-if="errors.housing_ownership" class="mt-1 text-xs text-red-500">{{ errors.housing_ownership }}</p>
                            </div>
                        </div>
                        <div class="mt-3 flex items-center gap-2">
                            <input id="yard" v-model="form.has_yard" type="checkbox"
                                class="rounded border-border text-[#2D6A4F] focus:ring-[#2D6A4F]"
                            />
                            <label for="yard" class="text-sm text-foreground">Tengo patio o jardín</label>
                        </div>
                    </div>

                    <!-- Tu familia -->
                    <div class="rounded-xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                        <div class="mb-4 flex items-center gap-2">
                            <svg class="h-4 w-4 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <h3 class="text-sm font-semibold text-foreground">Tu familia</h3>
                        </div>
                        <div class="space-y-4">
                            <div>
                                <label class="text-sm font-medium text-foreground">Composición del hogar</label>
                                <textarea v-model="form.family_composition"
                                    class="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-[#2D6A4F]"
                                    :class="errors.family_composition ? 'border-red-500' : 'border-border'"
                                    rows="2" placeholder="¿Con quién vives? ¿Hay niños?"
                                ></textarea>
                                <p v-if="errors.family_composition" class="mt-1 text-xs text-red-500">{{ errors.family_composition }}</p>
                            </div>
                            <div class="flex items-center gap-2">
                                <input id="children" v-model="form.has_children" type="checkbox"
                                    class="rounded border-border text-[#2D6A4F] focus:ring-[#2D6A4F]"
                                />
                                <label for="children" class="text-sm text-foreground">Hay niños en casa</label>
                            </div>
                            <div>
                                <label class="text-sm font-medium text-foreground">¿Tienes otras mascotas?</label>
                                <textarea v-model="form.other_pets"
                                    class="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[#2D6A4F]"
                                    rows="2" placeholder="Cuéntanos qué mascotas tienes actualmente o has tenido antes..."
                                ></textarea>
                                <p v-if="errors.other_pets" class="mt-1 text-xs text-red-500">{{ errors.other_pets }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Estilo de vida -->
                    <div class="rounded-xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                        <div class="mb-4 flex items-center gap-2">
                            <svg class="h-4 w-4 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 class="text-sm font-semibold text-foreground">Estilo de vida</h3>
                        </div>
                        <div class="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label class="text-sm font-medium text-foreground">Horas solo al día</label>
                                <div class="relative mt-1">
                                    <input v-model="form.hours_alone" type="number" min="0" max="24"
                                        class="w-full rounded-lg border border-border bg-background px-3 py-2 pr-8 text-sm outline-none focus:border-[#2D6A4F]"
                                        placeholder="8"
                                    />
                                    <span class="pointer-events-none absolute right-3 top-2 text-xs text-muted-foreground">hrs</span>
                                </div>
                                <p v-if="errors.hours_alone" class="mt-1 text-xs text-red-500">{{ errors.hours_alone }}</p>
                            </div>
                            <div>
                                <label class="text-sm font-medium text-foreground">Experiencia con mascotas</label>
                                <div class="mt-2 flex items-center gap-2">
                                    <input id="exp" v-model="form.experience_with_pets" type="checkbox"
                                        class="rounded border-border text-[#2D6A4F] focus:ring-[#2D6A4F]"
                                    />
                                    <label for="exp" class="text-sm text-foreground">Tengo experiencia previa</label>
                                </div>
                            </div>
                        </div>
                        <div class="mt-4">
                            <label class="text-sm font-medium text-foreground">Plan veterinario</label>
                            <textarea v-model="form.veterinary_plan"
                                class="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[#2D6A4F]"
                                rows="2" placeholder="¿Tienes veterinario de confianza? ¿Cómo planeas cubrir los gastos de salud (vacunas, esterilización, emergencias)?"
                            ></textarea>
                            <p v-if="errors.veterinary_plan" class="mt-1 text-xs text-red-500">{{ errors.veterinary_plan }}</p>
                        </div>
                    </div>

                    <!-- Compromiso -->
                    <div class="rounded-xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-5 dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                        <div class="mb-4 flex items-center gap-2">
                            <svg class="h-4 w-4 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <h3 class="text-sm font-semibold text-foreground">Compromiso</h3>
                        </div>
                        <div class="flex items-start gap-2">
                            <input id="agreement" v-model="form.agreement" type="checkbox"
                                class="mt-0.5 rounded border-border text-[#2D6A4F] focus:ring-[#2D6A4F]"
                            />
                            <label for="agreement" class="text-sm leading-relaxed text-foreground">
                                Confirmo que estoy comprometido a brindarle un hogar responsable, con los cuidados necesarios durante toda su vida, y que entiendo que la entidad realizará un seguimiento posterior a la adopción.
                            </label>
                        </div>
                        <p v-if="errors.agreement" class="mt-1 text-xs text-red-500">{{ errors.agreement }}</p>
                    </div>

                    <button type="submit" :disabled="form.processing"
                        class="w-full rounded-xl bg-[#2D6A4F] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#246142]"
                        :class="{ 'opacity-50': form.processing }"
                    >
                        <span class="flex items-center justify-center gap-2">
                            <svg v-if="form.processing" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                            {{ form.processing ? 'Enviando...' : 'Enviar solicitud' }}
                        </span>
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>
