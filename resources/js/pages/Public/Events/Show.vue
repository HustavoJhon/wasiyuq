<script setup lang="ts">
interface Announcement {
    id: number;
    title: string;
    slug: string;
    description: string;
    event_date: string | null;
    location: string | null;
    type: string;
    cover_image: string | null;
    is_published: boolean;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    team: {
        id: number;
        name: string;
        slug: string;
        logo: string | null;
        phone: string | null;
        city: string | null;
        state: string | null;
        website: string | null;
        social_links: Record<string, string> | null;
    };
    author: { id: number; name: string };
}

defineProps<{ event: Announcement }>();

const typeMeta: Record<string, { label: string; color: string; dot: string; icon: string }> = {
    adoption_fair: { label: 'Feria de Adopción', color: 'bg-rose-50 text-rose-700', dot: 'bg-rose-500', icon: '🐾' },
    fundraiser: { label: 'Recaudación', color: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500', icon: '💰' },
    workshop: { label: 'Taller', color: 'bg-sky-50 text-sky-700', dot: 'bg-sky-500', icon: '🔧' },
    campaign: { label: 'Campaña', color: 'bg-violet-50 text-violet-700', dot: 'bg-violet-500', icon: '📢' },
    other: { label: 'Otro', color: 'bg-slate-50 text-slate-700', dot: 'bg-slate-500', icon: '📌' },
};

function typeMetaFor(type: string) {
    return typeMeta[type] ?? typeMeta.other;
}

function formatDate(date: string | null): string {
    if (!date) {
        return '';
    }

    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    return new Date(date).toLocaleDateString('es-PE', options);
}

function formatTime(date: string | null): string {
    if (!date) {
        return '';
    }

    return new Date(date).toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

function socialIcon(platform: string): string {
    const icons: Record<string, string> = {
        facebook: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
        instagram: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2m-.2 2A3.6 3.6 0 004 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 003.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 010 2.5 1.25 1.25 0 010-2.5M12 7a5 5 0 110 10 5 5 0 010-10m0 2a3 3 0 100 6 3 3 0 000-6z',
        twitter: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z',
        tiktok: 'M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 11-5-5v2a3 3 0 103 3V0z',
        youtube: 'M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z',
        whatsapp: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
    };

    return icons[platform] ?? icons.facebook;
}
</script>

<template>
    <article class="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <a
            href="/eventos"
            class="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-[#2D6A4F] transition-colors"
        >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Todos los eventos
        </a>

        <div v-if="event.cover_image" class="group relative mt-6 overflow-hidden rounded-2xl">
            <img
                :src="event.cover_image"
                :alt="event.title"
                class="w-full object-cover transition duration-700 group-hover:scale-105"
                style="max-height: 480px;"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div class="absolute bottom-5 left-5 right-5">
                <div class="flex flex-wrap items-center gap-2">
                    <span
                        :class="[typeMetaFor(event.type).color, 'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium shadow-sm']"
                    >
                        <span :class="['h-1.5 w-1.5 rounded-full', typeMetaFor(event.type).dot]" />
                        {{ typeMetaFor(event.type).label }}
                    </span>
                    <span
                        class="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm backdrop-blur-sm"
                    >
                        <span class="h-1.5 w-1.5 rounded-full bg-white" />
                        Próximo evento
                    </span>
                </div>
            </div>
        </div>

        <div class="mt-8" :class="event.cover_image ? '' : ''">
            <div v-if="!event.cover_image" class="flex flex-wrap items-center gap-3">
                <span
                    :class="[typeMetaFor(event.type).color, 'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium']"
                >
                    <span :class="['h-1.5 w-1.5 rounded-full', typeMetaFor(event.type).dot]" />
                    {{ typeMetaFor(event.type).label }}
                </span>
                <span
                    class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-medium text-emerald-700"
                >
                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Próximo evento
                </span>
            </div>

            <h1 class="mt-4 text-4xl font-bold leading-tight text-foreground sm:text-5xl">
                {{ event.title }}
            </h1>
        </div>

        <div class="mt-10 grid gap-4 sm:grid-cols-2">
            <div class="flex items-start gap-4 rounded-xl border border-[#2D6A4F]/15 bg-gradient-to-br from-[#2D6A4F]/5 to-white dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40 p-5 transition hover:shadow-md hover:shadow-[#2D6A4F]/10 hover:border-[#2D6A4F]/25">
                <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#2D6A4F]/10">
                    <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <div>
                    <p class="text-xs font-bold tracking-wide text-[#2D6A4F] dark:text-emerald-400 uppercase">Fecha</p>
                    <p class="mt-0.5 text-sm font-semibold text-foreground">
                        {{ formatDate(event.event_date) }}
                    </p>
                    <p v-if="event.event_date" class="text-xs text-muted-foreground/60">
                        {{ formatTime(event.event_date) }}
                    </p>
                </div>
            </div>
            <div v-if="event.location" class="flex items-start gap-4 rounded-xl border border-[#2D6A4F]/15 bg-gradient-to-br from-[#2D6A4F]/5 to-white dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40 p-5 transition hover:shadow-md hover:shadow-[#2D6A4F]/10 hover:border-[#2D6A4F]/25">
                <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#2D6A4F]/10">
                    <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <div>
                    <p class="text-xs font-bold tracking-wide text-[#2D6A4F] dark:text-emerald-400 uppercase">Ubicación</p>
                    <p class="mt-0.5 text-sm font-semibold text-foreground">{{ event.location }}</p>
                    <a
                        :href="`https://www.google.com/maps/search/${encodeURIComponent(event.location)}`"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[#2D6A4F] hover:underline dark:text-emerald-400"
                    >
                        <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Ver en Google Maps
                    </a>
                </div>
            </div>
            <div class="flex items-start gap-4 rounded-xl border border-[#2D6A4F]/15 bg-gradient-to-br from-[#2D6A4F]/5 to-white dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40 p-5 transition hover:shadow-md hover:shadow-[#2D6A4F]/10 hover:border-[#2D6A4F]/25">
                <div v-if="event.team.logo" class="h-11 w-11 shrink-0 overflow-hidden rounded-lg ring-2 ring-[#2D6A4F]/20">
                    <img :src="event.team.logo" :alt="event.team.name" class="h-full w-full object-cover" />
                </div>
                <div v-else class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#2D6A4F]/10">
                    <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                </div>
                <div>
                    <p class="text-xs font-bold tracking-wide text-[#2D6A4F] dark:text-emerald-400 uppercase">Organiza</p>
                    <p class="mt-0.5 text-sm font-semibold text-foreground">{{ event.team.name }}</p>
                    <p v-if="event.team.city || event.team.state" class="text-xs text-muted-foreground/60">
                        {{ [event.team.city, event.team.state].filter(Boolean).join(', ') }}
                    </p>
                </div>
            </div>
            <div v-if="event.team.phone" class="flex items-start gap-4 rounded-xl border border-[#2D6A4F]/15 bg-gradient-to-br from-[#2D6A4F]/5 to-white dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40 p-5 transition hover:shadow-md hover:shadow-[#2D6A4F]/10 hover:border-[#2D6A4F]/25">
                <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#2D6A4F]/10">
                    <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                </div>
                <div>
                    <p class="text-xs font-bold tracking-wide text-[#2D6A4F] dark:text-emerald-400 uppercase">Contacto</p>
                    <a :href="`tel:${event.team.phone}`" class="mt-0.5 text-sm font-semibold text-[#2D6A4F] hover:underline dark:text-emerald-400">
                        {{ event.team.phone }}
                    </a>
                </div>
            </div>
        </div>

        <div class="mt-8 flex flex-wrap items-center gap-3 rounded-xl border border-[#2D6A4F]/15 bg-gradient-to-br from-[#2D6A4F]/5 to-white dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40 p-4">
            <span class="text-xs font-bold tracking-wide text-[#2D6A4F] dark:text-emerald-400 uppercase">Sigue al albergue:</span>
            <a
                v-if="event.team.website"
                :href="event.team.website"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 rounded-lg bg-[#2D6A4F]/10 px-3 py-1.5 text-xs font-semibold text-[#2D6A4F] transition hover:bg-[#2D6A4F]/20 dark:bg-[#2D6A4F]/20 dark:text-emerald-400 dark:hover:bg-[#2D6A4F]/30"
            >
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Sitio web
            </a>
            <template v-for="(url, platform) in event.team.social_links" :key="platform">
                <a
                    v-if="url"
                    :href="url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1.5 rounded-lg bg-[#2D6A4F]/10 px-3 py-1.5 text-xs font-semibold text-[#2D6A4F] transition hover:bg-[#2D6A4F]/20 dark:bg-[#2D6A4F]/20 dark:text-emerald-400 dark:hover:bg-[#2D6A4F]/30"
                >
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="socialIcon(platform)" />
                    </svg>
                    <span class="capitalize">{{ platform }}</span>
                </a>
            </template>
            <p v-if="!event.team.website && (!event.team.social_links || Object.values(event.team.social_links).every(v => !v))" class="text-xs text-muted-foreground/60">
                No hay redes sociales registradas.
            </p>
        </div>

        <div v-if="event.description" class="mt-12">
            <div class="rounded-xl border border-[#2D6A4F]/15 bg-gradient-to-br from-[#2D6A4F]/5 to-white dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40 p-6 sm:p-8">
                <h2 class="flex items-center gap-2 text-xl font-bold text-foreground">
                    <svg class="h-5 w-5 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Descripción del evento
                </h2>
                <div class="prose prose-gray prose-a:text-[#2D6A4F] max-w-none mt-4">
                    <p class="leading-relaxed text-muted-foreground whitespace-pre-line text-[15px]">
                        {{ event.description }}
                    </p>
                </div>
            </div>
        </div>
    </article>
</template>
