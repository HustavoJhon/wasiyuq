<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import {
    LayoutGrid,
    PawPrint,
    ClipboardList,
    FileText,
    CalendarDays,
    Users,
    Shield,
    Search,
} from 'lucide-vue-next';
import { computed, ref, watch } from 'vue';
import { dashboard } from '@/routes';

const props = defineProps<{
    open: boolean;
}>();

const emit = defineEmits<{
    'update:open': [value: boolean];
}>();

const page = usePage();
const query = ref('');
const inputRef = ref<HTMLInputElement | null>(null);

const teamSlug = computed(
    () => (page.props.currentTeam as { slug: string } | null)?.slug ?? '',
);

const allItems = computed(() => {
    const slug = teamSlug.value;

    return [
        {
            title: 'Dashboard',
            href: slug ? dashboard(slug).url : '/',
            icon: LayoutGrid,
        },
        {
            title: 'Mascotas',
            href: slug ? `/${slug}/mascotas` : '/mascotas',
            icon: PawPrint,
        },
        {
            title: 'Adopciones',
            href: slug ? `/${slug}/adopciones` : '/adopciones',
            icon: ClipboardList,
        },
        {
            title: 'Blog',
            href: slug ? `/${slug}/blog` : '/blog',
            icon: FileText,
        },
        {
            title: 'Eventos',
            href: slug ? `/${slug}/eventos` : '/eventos',
            icon: CalendarDays,
        },
        { title: 'Usuarios', href: '/admin/usuarios', icon: Users },
        { title: 'Roles', href: '/admin/roles', icon: Shield },
    ];
});

const filtered = computed(() => {
    const q = query.value.toLowerCase().trim();

    if (!q) {
        return allItems.value;
    }

    return allItems.value.filter((i) => i.title.toLowerCase().includes(q));
});

function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
        emit('update:open', false);
    }
}

watch(
    () => props.open,
    (val) => {
        if (val) {
            query.value = '';
            setTimeout(() => inputRef.value?.focus(), 50);
        }
    },
);
</script>

<template>
    <Teleport to="body">
        <div v-if="open" class="fixed inset-0 z-50" @keydown="onKeydown">
            <div
                class="fixed inset-0 bg-black/50 backdrop-blur-sm"
                @click="emit('update:open', false)"
            />
            <div
                class="fixed inset-0 flex items-start justify-center pt-[15vh]"
            >
                <div
                    class="w-full max-w-lg rounded-xl border bg-background shadow-2xl"
                >
                    <div class="flex items-center border-b px-4">
                        <Search
                            class="mr-3 size-4 shrink-0 text-muted-foreground"
                        />
                        <input
                            ref="inputRef"
                            v-model="query"
                            class="flex h-14 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                            placeholder="Buscar páginas..."
                        />
                        <kbd
                            class="hidden items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground/60 md:inline-flex"
                        >
                            ESC
                        </kbd>
                    </div>
                    <div class="max-h-72 overflow-y-auto p-2">
                        <Link
                            v-for="item in filtered"
                            :key="item.href"
                            :href="item.href"
                            class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                            @click="emit('update:open', false)"
                        >
                            <component
                                :is="item.icon"
                                class="size-4 shrink-0 text-muted-foreground"
                            />
                            <span>{{ item.title }}</span>
                        </Link>
                        <p
                            v-if="filtered.length === 0"
                            class="py-6 text-center text-sm text-muted-foreground"
                        >
                            No se encontraron resultados.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>
