import { Head } from '@inertiajs/vue3';
import { computed } from 'vue';

interface SeoMeta {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
    publishedAt?: string;
    modifiedAt?: string;
    author?: string;
}

const defaults = {
    title: 'Wasiyuq — Adopción responsable en Cusco',
    description: 'Plataforma de adopción responsable de mascotas en Cusco, Perú.',
    image: '/icons/og-image.png',
    url: 'https://wasiyuq.pe',
    type: 'website',
};

export function useSeo(pageSeo?: SeoMeta) {
    const seo = computed(() => ({
        ...defaults,
        ...pageSeo,
    }));

    const pageTitle = computed(() => {
        const t = seo.value.title || defaults.title;
        if (t !== defaults.title) {
            return `${t} — Wasiyuq`;
        }
        return defaults.title;
    });

    const description = computed(() => seo.value.description || defaults.description);
    const ogImage = computed(() => seo.value.image || defaults.image);
    const ogUrl = computed(() => seo.value.url || defaults.url);
    const ogType = computed(() => seo.value.type || defaults.type);

    return {
        pageTitle,
        description,
        ogImage,
        ogUrl,
        ogType,
        seo,
    };
}
