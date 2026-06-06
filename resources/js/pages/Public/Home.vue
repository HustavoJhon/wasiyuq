<script setup lang="ts">
import {
    Search,
    Dog,
    Cat,
    Rabbit,
    Bird,
    PawPrint,
    Heart,
    Building2,
    ShieldCheck,
    Sparkles,
    ChevronDown,
    ArrowRight,
    CheckCircle,
    MapPin,
    FileText,
    Eye,
} from 'lucide-vue-next';
import { ref, onMounted } from 'vue';
import type { Component } from 'vue';

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
    photos: string[] | null;
    team: { name: string; city: string | null; state: string | null };
}

const props = defineProps<{
    stats: { adopted: number; organizations: number; pets_available: number };
    species: Record<string, number>;
    recentPets: Pet[];
}>();

const faqOpen = ref<number | null>(null);
const animatedStats = ref({ adopted: 0, organizations: 0, pets_available: 0 });
const statsRef = ref<HTMLElement | null>(null);

const speciesInfo: { key: string; icon: Component; label: string }[] = [
    { key: 'dog', icon: Dog, label: 'Perros' },
    { key: 'cat', icon: Cat, label: 'Gatos' },
    { key: 'rabbit', icon: Rabbit, label: 'Conejos' },
    { key: 'bird', icon: Bird, label: 'Aves' },
    { key: 'other', icon: PawPrint, label: 'Otros' },
];

const speciesIcon = (s: string) => {
    const icons: Record<string, Component> = { dog: Dog, cat: Cat, rabbit: Rabbit, bird: Bird };

    return icons[s] || PawPrint;
};

const stepIcons: Component[] = [Eye, FileText, Heart];
const stepLabels = ['Explora', 'Postula', 'Adopta'];
const stepDescriptions = [
    'Encuentra a tu compañero ideal entre las mascotas disponibles en Cusco.',
    'Completa tu perfil y postula a la mascota que robó tu corazón.',
    'Recibe seguimiento y acompañamiento durante los primeros 12 meses.',
];

const features = [
    { icon: ShieldCheck, title: 'Entidades Verificadas', desc: 'Todos los albergues, municipalidades y ONGs son verificados para garantizar adopciones seguras.' },
    { icon: Heart, title: 'Acompañamiento Continuo', desc: 'Seguimiento durante los primeros 12 meses para asegurar el bienestar de la mascota.' },
    { icon: Sparkles, title: 'Proceso Simple', desc: 'Postula desde cualquier dispositivo y recibe notificaciones en tiempo real.' },
    { icon: MapPin, title: 'Visibilidad Regional', desc: 'Llega a adoptantes en toda la región del Cusco. Miles de familias te ven cada día.' },
];

const impactItems = [
    { valueKey: 'adopted' as const, label: 'Mascotas adoptadas con éxito', color: 'from-[#2D6A4F] to-[#40916C]' },
    { valueKey: 'organizations' as const, label: 'Entidades verificadas en la red', color: 'from-[#40916C] to-[#52B788]' },
    { valueKey: 'pets_available' as const, label: 'Mascotas esperando un hogar', color: 'from-[#52B788] to-[#74C69D]' },
    { value: 100, label: 'Seguimiento post-adopción', color: 'from-[#74C69D] to-[#95D5B2]' },
];

const faqs = [
    { q: '¿Cuáles son los requisitos para adoptar?', a: 'Debes ser mayor de edad, contar con un documento de identidad vigente, demostrar que tienes un espacio adecuado para la mascota y firmar un compromiso de adopción responsable.' },
    { q: '¿La plataforma tiene algún costo?', a: 'Wasiyuq es completamente gratuito para adoptantes. Las entidades registradas pueden publicar mascotas sin costo alguno.' },
    { q: '¿Cómo sé que una entidad es confiable?', a: 'Todas las entidades en Wasiyuq pasan por un proceso de verificación. Revisamos documentos, realizamos visitas de campo y validamos su trayectoria.' },
    { q: '¿Qué pasa si la adopción no funciona?', a: 'Wasiyuq realiza un seguimiento durante los primeros 12 meses. Si surgen problemas, nuestro equipo de soporte te guiará para encontrar la mejor solución.' },
    { q: '¿Puedo adoptar si vivo fuera de Cusco?', a: 'Sí, siempre que puedas trasladarte a Cusco para conocer a la mascota y completar el proceso.' },
];

function formatAge(years: number, months: number): string {
    if (years > 0) {
return `${years} ${years > 1 ? 'años' : 'año'}`;
}

    if (months > 0) {
return `${months} ${months > 1 ? 'meses' : 'mes'}`;
}

    return 'Cachorro';
}

function sizeLabel(size: string): string {
    const labels: Record<string, string> = { small: 'Pequeño', medium: 'Mediano', large: 'Grande' };

    return labels[size] || size;
}

function speciesLabel(species: string): string {
    const labels: Record<string, string> = { dog: 'Perro', cat: 'Gato', rabbit: 'Conejo', bird: 'Ave', other: 'Otro' };

    return labels[species] ?? species;
}

onMounted(() => {
    document.querySelectorAll('.reveal').forEach((el) => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('reveal-visible');
                    observer.disconnect();
                }
            },
            { threshold: 0.15 },
        );
        observer.observe(el);
    });
});

onMounted(() => {
    if (statsRef.value) {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    const steps = 60;
                    const interval = 2000 / steps;
                    const targets = [
                        { key: 'adopted' as const, value: props.stats.adopted },
                        { key: 'organizations' as const, value: props.stats.organizations },
                        { key: 'pets_available' as const, value: props.stats.pets_available },
                    ];
                    let step = 0;
                    const timer = setInterval(() => {
                        step++;

                        for (const t of targets) {
                            animatedStats.value[t.key] = Math.min(Math.round((t.value / steps) * step), t.value);
                        }

                        if (step >= steps) {
clearInterval(timer);
}
                    }, interval);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 },
        );
        observer.observe(statsRef.value);
    }
});
</script>

<template>
    <div class="overflow-hidden">
        <!-- HERO -->
        <section class="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#40916C]">
            <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            <div class="pointer-events-none absolute top-1/4 -left-32 h-96 w-96 animate-pulse rounded-full bg-white/5 blur-3xl" style="animation-duration: 8s" />
            <div class="pointer-events-none absolute top-1/3 -right-32 h-80 w-80 animate-pulse rounded-full bg-white/5 blur-3xl" style="animation-duration: 6s; animation-delay: 1s" />
            <div class="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 animate-pulse rounded-full bg-white/5 blur-3xl" style="animation-duration: 10s; animation-delay: 2s" />

            <div class="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    <div class="reveal translate-y-8 opacity-0 transition-all duration-700 ease-out [&.reveal-visible]:translate-y-0 [&.reveal-visible]:opacity-100">
                        <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-medium text-green-100 backdrop-blur-sm">
                            <Sparkles class="h-3.5 w-3.5" />
                            Adopción responsable en Cusco
                        </div>
                        <h1 class="mb-6 text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                            Dale un hogar a
                            <span class="text-transparent bg-clip-text bg-gradient-to-r from-green-200 to-green-100">quien más lo necesita</span>
                        </h1>
                        <p class="mb-8 max-w-xl text-lg text-green-100/80 sm:text-xl">
                            Conectamos mascotas en adopción con familias responsables en Cusco. Cada animal merece una segunda oportunidad.
                        </p>
                        <div class="mb-8 flex flex-col gap-3 sm:flex-row">
                            <div class="relative flex-1">
                                <Search class="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-white/50" />
                                <input type="text" placeholder="Busca por raza, ubicación..." class="w-full rounded-xl border-0 bg-white/15 py-3.5 pr-4 pl-12 text-sm text-white placeholder-white/50 backdrop-blur-sm transition focus:bg-white/20 focus:ring-2 focus:ring-white/30 focus:outline-none" />
                            </div>
                            <a href="/mascotas" class="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-[#1B4332] shadow-lg shadow-black/10 transition-all hover:bg-green-50 hover:shadow-xl hover:-translate-y-0.5">
                                Buscar <ArrowRight class="h-4 w-4" />
                            </a>
                        </div>
                        <div class="mb-6 flex flex-wrap gap-2">
                            <a v-for="s in speciesInfo" :key="s.key" :href="'/mascotas?species=' + s.key" class="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3.5 py-1.5 text-sm text-white backdrop-blur-sm transition hover:bg-white/20 hover:scale-105">
                                <component :is="s.icon" class="h-4 w-4" />
                                {{ s.label }}
                            </a>
                        </div>
                        <div ref="statsRef" class="flex flex-wrap gap-8 sm:gap-10">
                            <div>
                                <p class="text-3xl font-bold text-white sm:text-4xl tabular-nums">{{ animatedStats.adopted }}+</p>
                                <p class="text-sm text-green-100/70">Mascotas adoptadas</p>
                            </div>
                            <div>
                                <p class="text-3xl font-bold text-white sm:text-4xl tabular-nums">{{ animatedStats.organizations }}+</p>
                                <p class="text-sm text-green-100/70">Entidades verificadas</p>
                            </div>
                            <div>
                                <p class="text-3xl font-bold text-white sm:text-4xl tabular-nums">{{ animatedStats.pets_available }}+</p>
                                <p class="text-sm text-green-100/70">Mascotas disponibles</p>
                            </div>
                        </div>
                    </div>

                    <div class="hidden lg:block">
                        <div class="reveal translate-y-8 opacity-0 transition-all delay-200 duration-700 ease-out [&.reveal-visible]:translate-y-0 [&.reveal-visible]:opacity-100">
                            <div class="grid grid-cols-2 gap-4">
                                <div class="space-y-4">
                                    <div v-for="(pet, i) in recentPets.filter((_, idx) => idx % 2 === 0)" :key="pet.id" class="group overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-lg shadow-black/5 backdrop-blur-sm transition-all hover:bg-white/15 hover:-translate-y-1 hover:shadow-xl" :style="{ animationDelay: `${i * 150}ms` }">
                                        <a :href="'/mascotas/' + pet.slug">
                                            <div class="aspect-[4/3] overflow-hidden">
                                                <img v-if="pet.photos?.[0]" :src="'/storage/' + pet.photos[0]" :alt="pet.name" class="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                                                <div v-else class="flex h-full items-center justify-center bg-gradient-to-br from-[#40916C] to-[#2D6A4F]">
                                                    <component :is="speciesIcon(pet.species)" class="h-10 w-10 text-white/60" />
                                                </div>
                                            </div>
                                            <div class="p-4">
                                                <div class="flex items-center justify-between">
                                                    <h3 class="font-bold text-white">{{ pet.name }}</h3>
                                                    <span class="rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-green-100">{{ sizeLabel(pet.size) }}</span>
                                                </div>
                                                <p class="mt-1 text-sm text-green-100/70">{{ pet.breed || speciesLabel(pet.species) }} &bull; {{ formatAge(pet.age_years, pet.age_months) }}</p>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                                <div class="space-y-4 pt-8">
                                    <div v-for="(pet, i) in recentPets.filter((_, idx) => idx % 2 === 1)" :key="pet.id" class="group overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-lg shadow-black/5 backdrop-blur-sm transition-all hover:bg-white/15 hover:-translate-y-1 hover:shadow-xl" :style="{ animationDelay: `${i * 150}ms` }">
                                        <a :href="'/mascotas/' + pet.slug">
                                            <div class="aspect-[4/3] overflow-hidden">
                                                <img v-if="pet.photos?.[0]" :src="'/storage/' + pet.photos[0]" :alt="pet.name" class="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                                                <div v-else class="flex h-full items-center justify-center bg-gradient-to-br from-[#52B788] to-[#40916C]">
                                                    <component :is="speciesIcon(pet.species)" class="h-10 w-10 text-white/60" />
                                                </div>
                                            </div>
                                            <div class="p-4">
                                                <div class="flex items-center justify-between">
                                                    <h3 class="font-bold text-white">{{ pet.name }}</h3>
                                                    <span class="rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-green-100">{{ sizeLabel(pet.size) }}</span>
                                                </div>
                                                <p class="mt-1 text-sm text-green-100/70">{{ pet.breed || speciesLabel(pet.species) }} &bull; {{ formatAge(pet.age_years, pet.age_months) }}</p>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </section>

        <!-- SPECIES -->
        <section class="py-20 sm:py-28">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="reveal translate-y-8 opacity-0 transition-all duration-700 ease-out [&.reveal-visible]:translate-y-0 [&.reveal-visible]:opacity-100">
                    <div class="mb-10 text-center sm:mb-16">
                        <div class="mb-4 inline-flex items-center gap-2 rounded-full bg-[#2D6A4F]/10 px-4 py-1.5 text-xs font-medium text-[#2D6A4F]">
                            <PawPrint class="h-3.5 w-3.5" />
                            Mascotas en adopción
                        </div>
                        <h2 class="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                            Mascotas <span class="text-[#2D6A4F]">disponibles</span>
                        </h2>
                        <p class="mx-auto max-w-2xl text-lg text-muted-foreground">Conoce cuántos animalitos de cada especie están esperando un hogar.</p>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                    <a v-for="(s, i) in speciesInfo" :key="s.key" :href="'/mascotas?species=' + s.key"
                        class="group reveal translate-y-8 opacity-0 transition-all duration-700 ease-out [&.reveal-visible]:translate-y-0 [&.reveal-visible]:opacity-100"
                        :style="{ transitionDelay: `${i * 100}ms` }">
                        <div class="relative overflow-hidden rounded-2xl border border-border bg-card p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-black/5">
                            <div class="absolute inset-0 bg-gradient-to-br from-[#2D6A4F]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            <div class="relative">
                                <div class="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-[#2D6A4F]/10 text-[#2D6A4F] transition-all duration-300 group-hover:bg-[#2D6A4F] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#2D6A4F]/25">
                                    <component :is="s.icon" class="h-7 w-7" />
                                </div>
                                <h3 class="mb-1 text-sm font-bold text-foreground">{{ s.label }}</h3>
                                <span class="inline-flex items-center rounded-full bg-[#2D6A4F]/10 px-3 py-1 text-xs font-medium text-[#2D6A4F] transition-all group-hover:bg-[#2D6A4F] group-hover:text-white">
                                    {{ species[s.key] ?? 0 }} mascotas
                                </span>
                            </div>
                        </div>
                    </a>
                </div>

                <div class="reveal translate-y-8 opacity-0 transition-all delay-300 duration-700 ease-out [&.reveal-visible]:translate-y-0 [&.reveal-visible]:opacity-100">
                    <div class="mx-auto mt-10 max-w-2xl rounded-2xl border border-border bg-gradient-to-br from-card to-muted/50 p-6 text-center sm:mt-16 sm:p-12">
                        <Building2 class="mx-auto mb-4 h-8 w-8 text-[#2D6A4F]" />
                        <h3 class="mb-4 text-2xl font-bold text-foreground md:text-3xl">¿Eres un albergue o refugio?</h3>
                        <p class="mx-auto mb-6 max-w-xl text-muted-foreground">Únete a nuestra red y ayuda a más mascotas a encontrar un hogar.</p>
                        <a href="/contacto" class="inline-flex items-center gap-2 rounded-xl bg-[#2D6A4F] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#2D6A4F]/25 transition-all hover:bg-[#246142] hover:-translate-y-0.5 hover:shadow-xl">
                            Registrar mi entidad <ArrowRight class="h-4 w-4" />
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- FEATURES -->
        <section class="bg-muted/30 py-20 sm:py-28">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="reveal translate-y-8 opacity-0 transition-all duration-700 ease-out [&.reveal-visible]:translate-y-0 [&.reveal-visible]:opacity-100">
                    <div class="mb-10 text-center sm:mb-16">
                        <div class="mb-4 inline-flex items-center gap-2 rounded-full bg-[#2D6A4F]/10 px-4 py-1.5 text-xs font-medium text-[#2D6A4F]">
                            <ShieldCheck class="h-3.5 w-3.5" />
                            ¿Por qué Wasiyuq?
                        </div>
                        <h2 class="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                            Beneficios de adoptar con <span class="text-[#2D6A4F]">Wasiyuq</span>
                        </h2>
                        <p class="mx-auto max-w-2xl text-lg text-muted-foreground">Hacemos que la adopción responsable sea sencilla, segura y transparente para todos.</p>
                    </div>
                </div>

                <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div v-for="(feature, i) in features" :key="feature.title"
                        class="reveal translate-y-8 opacity-0 transition-all duration-700 ease-out [&.reveal-visible]:translate-y-0 [&.reveal-visible]:opacity-100"
                        :style="{ transitionDelay: `${i * 150}ms` }">
                        <div class="group h-full rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#2D6A4F]/5">
                            <div class="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2D6A4F]/10 text-[#2D6A4F] transition-all duration-300 group-hover:bg-[#2D6A4F] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#2D6A4F]/25">
                                <component :is="feature.icon" class="h-6 w-6" />
                            </div>
                            <h3 class="mb-2 text-lg font-bold text-foreground">{{ feature.title }}</h3>
                            <p class="text-sm leading-relaxed text-muted-foreground">{{ feature.desc }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- HOW IT WORKS -->
        <section class="py-20 sm:py-28">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="reveal translate-y-8 opacity-0 transition-all duration-700 ease-out [&.reveal-visible]:translate-y-0 [&.reveal-visible]:opacity-100">
                    <div class="mb-14 text-center">
                        <h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">¿Cómo funciona?</h2>
                        <p class="mt-4 text-lg text-muted-foreground">Tres pasos simples para cambiar una vida</p>
                    </div>
                </div>
                <div class="relative grid gap-8 sm:grid-cols-3">
                    <div class="hidden sm:block absolute top-12 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-0.5 bg-gradient-to-r from-[#2D6A4F]/20 via-[#2D6A4F] to-[#2D6A4F]/20" />
                    <div v-for="(step, i) in stepLabels" :key="step"
                        class="reveal translate-y-8 opacity-0 transition-all duration-700 ease-out [&.reveal-visible]:translate-y-0 [&.reveal-visible]:opacity-100 text-center"
                        :style="{ transitionDelay: `${i * 200}ms` }">
                        <div class="relative mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2D6A4F] to-[#40916C] text-white shadow-lg shadow-[#2D6A4F]/25 transition-transform duration-300 hover:scale-110">
                            <component :is="stepIcons[i]" class="h-9 w-9" />
                            <div class="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-[#2D6A4F] shadow-md">{{ i + 1 }}</div>
                        </div>
                        <h3 class="mt-6 text-xl font-bold text-foreground">{{ step }}</h3>
                        <p class="mt-2 text-sm text-muted-foreground">{{ stepDescriptions[i] }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- IMPACT -->
        <section class="bg-muted/30 py-20 sm:py-28">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="reveal translate-y-8 opacity-0 transition-all duration-700 ease-out [&.reveal-visible]:translate-y-0 [&.reveal-visible]:opacity-100">
                    <div class="lg:grid lg:grid-cols-12 lg:items-center lg:gap-16">
                        <div class="lg:col-span-5">
                            <div class="mb-8">
                                <div class="mb-4 inline-flex items-center gap-2 rounded-full bg-[#2D6A4F]/10 px-4 py-1.5 text-xs font-medium text-[#2D6A4F]">
                                    <Heart class="h-3.5 w-3.5" />
                                    Impacto en Cusco
                                </div>
                                <h2 class="mb-2 text-3xl font-bold tracking-tight text-foreground lg:text-4xl">Nuestra comunidad crece cada día</h2>
                                <p class="text-muted-foreground">Gracias a nuestra comunidad, cada día más mascotas encuentran un hogar.</p>
                            </div>
                            <blockquote class="relative rounded-2xl border border-border bg-card p-6">
                                <Heart class="absolute top-4 right-4 h-6 w-6 text-[#2D6A4F]/20" />
                                <p class="text-lg text-foreground italic leading-relaxed">"Wasiyuq nos permitió encontrar un hogar para más de 50 perritos en solo tres meses. La plataforma es muy fácil de usar y el equipo de soporte siempre está disponible."</p>
                                <div class="mt-6 flex items-center gap-3">
                                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#2D6A4F] to-[#40916C] text-sm font-bold text-white shadow-md">MG</div>
                                    <div>
                                        <div class="font-bold text-foreground">María García</div>
                                        <div class="text-xs text-muted-foreground">Fundadora | Patitas Cusco</div>
                                    </div>
                                </div>
                            </blockquote>
                        </div>

                        <div class="mt-10 lg:col-span-6 lg:col-end-13 lg:mt-0">
                            <div class="grid grid-cols-2 gap-4">
                                <div v-for="(item, i) in impactItems" :key="item.label"
                                    class="reveal translate-y-8 opacity-0 transition-all duration-700 ease-out [&.reveal-visible]:translate-y-0 [&.reveal-visible]:opacity-100 rounded-2xl border border-border bg-card p-6 sm:p-8"
                                    :style="{ transitionDelay: `${i * 150}ms` }">
                                    <div class="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                        <div class="h-full rounded-full bg-gradient-to-r transition-all duration-1000"
                                            :class="item.color"
                                            :style="{ width: `${Math.min((item.value || animatedStats[item.valueKey as keyof typeof animatedStats] || 0) / 100 * 100, 100)}%` }" />
                                    </div>
                                    <div class="text-3xl font-bold text-foreground sm:text-4xl tabular-nums">
                                        {{ item.value ?? animatedStats[item.valueKey as keyof typeof animatedStats] }}+
                                    </div>
                                    <p class="mt-1 text-sm text-muted-foreground">{{ item.label }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- RECENT PETS -->
        <section v-if="recentPets.length > 0" class="py-20 sm:py-28">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="reveal translate-y-8 opacity-0 transition-all duration-700 ease-out [&.reveal-visible]:translate-y-0 [&.reveal-visible]:opacity-100">
                    <div class="mb-10 flex items-end justify-between sm:mb-14">
                        <div>
                            <div class="mb-2 inline-flex items-center gap-2 rounded-full bg-[#2D6A4F]/10 px-4 py-1.5 text-xs font-medium text-[#2D6A4F]">
                                <PawPrint class="h-3.5 w-3.5" />
                                Recién llegados
                            </div>
                            <h2 class="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">Últimas mascotas</h2>
                        </div>
                        <a href="/mascotas" class="hidden items-center gap-1.5 text-sm font-medium text-[#2D6A4F] transition hover:text-[#246142] sm:inline-flex">
                            Ver todas <ArrowRight class="h-4 w-4" />
                        </a>
                    </div>
                </div>

                <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <a v-for="(pet, i) in recentPets" :key="pet.id" :href="'/mascotas/' + pet.slug"
                        class="group reveal translate-y-8 opacity-0 transition-all duration-700 ease-out [&.reveal-visible]:translate-y-0 [&.reveal-visible]:opacity-100"
                        :style="{ transitionDelay: `${i * 150}ms` }">
                        <div class="overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-black/5">
                            <div class="aspect-[4/3] overflow-hidden">
                                <img v-if="pet.photos?.[0]" :src="'/storage/' + pet.photos[0]" :alt="pet.name" loading="lazy" class="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                                <div v-else class="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/80">
                                    <component :is="speciesIcon(pet.species)" class="h-10 w-10 text-muted-foreground/30" />
                                </div>
                            </div>
                            <div class="p-4">
                                <div class="flex items-center justify-between">
                                    <h3 class="font-semibold text-foreground group-hover:text-[#2D6A4F]">{{ pet.name }}</h3>
                                    <span class="rounded-full bg-[#2D6A4F]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#2D6A4F]">{{ sizeLabel(pet.size) }}</span>
                                </div>
                                <p class="mt-1 text-xs text-muted-foreground">{{ pet.breed || speciesLabel(pet.species) }} &bull; {{ formatAge(pet.age_years, pet.age_months) }}</p>
                                <div class="mt-3 flex items-center gap-1 text-xs text-muted-foreground/70">
                                    <MapPin class="h-3 w-3" />
                                    {{ pet.team.city || pet.team.state || pet.team.name }}
                                </div>
                            </div>
                        </div>
                    </a>
                </div>

                <div class="mt-8 text-center sm:hidden">
                    <a href="/mascotas" class="inline-flex items-center gap-1.5 text-sm font-medium text-[#2D6A4F] hover:text-[#246142]">
                        Ver todas las mascotas <ArrowRight class="h-4 w-4" />
                    </a>
                </div>
            </div>
        </section>

        <!-- FAQ -->
        <section class="bg-muted/30 py-20 sm:py-28">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="reveal translate-y-8 opacity-0 transition-all duration-700 ease-out [&.reveal-visible]:translate-y-0 [&.reveal-visible]:opacity-100">
                    <div class="grid gap-10 md:grid-cols-5">
                        <div class="md:col-span-2">
                            <div class="max-w-xs">
                                <div class="mb-4 inline-flex items-center gap-2 rounded-full bg-[#2D6A4F]/10 px-4 py-1.5 text-xs font-medium text-[#2D6A4F]">
                                    <CheckCircle class="h-3.5 w-3.5" />
                                    FAQ
                                </div>
                                <h2 class="text-3xl font-bold tracking-tight text-foreground md:text-4xl md:leading-tight">Preguntas<br />frecuentes</h2>
                                <p class="mt-2 hidden text-muted-foreground md:block">Resolvemos tus dudas sobre el proceso de adopción responsable.</p>
                            </div>
                        </div>
                        <div class="md:col-span-3">
                            <div class="divide-y divide-border rounded-2xl border border-border bg-card">
                                <div v-for="(faq, i) in faqs" :key="i">
                                    <button @click="faqOpen = faqOpen === i ? null : i" class="group flex w-full items-center justify-between gap-3 px-6 py-5 text-left font-semibold text-foreground transition hover:text-[#2D6A4F]">
                                        <span>{{ faq.q }}</span>
                                        <ChevronDown class="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300" :class="{ 'rotate-180': faqOpen === i }" />
                                    </button>
                                    <div v-if="faqOpen === i" class="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">{{ faq.a }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA -->
        <section class="relative overflow-hidden bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#40916C] py-20 sm:py-28">
            <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            <div class="pointer-events-none absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />
            <div class="pointer-events-none absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-white/5 blur-3xl" />
            <div class="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 shadow-lg backdrop-blur-sm">
                    <Heart class="h-8 w-8 text-white" />
                </div>
                <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">Únete a la manada</h2>
                <p class="mx-auto mt-4 max-w-2xl text-lg text-green-100/80">Registra tu albergue, municipalidad u ONG y comienza a publicar mascotas en adopción.</p>
                <div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <a href="/contacto" class="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-[#1B4332] shadow-lg transition-all hover:bg-green-50 hover:-translate-y-0.5 hover:shadow-xl">
                        Registrar mi entidad <ArrowRight class="h-4 w-4" />
                    </a>
                    <a href="/mascotas" class="inline-flex items-center gap-2 rounded-xl border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:-translate-y-0.5">
                        Ver mascotas
                    </a>
                </div>
            </div>
        </section>
    </div>
</template>
