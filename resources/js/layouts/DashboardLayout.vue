<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { usePage } from '@inertiajs/vue3';
import { useMediaQuery } from '@/composables/useMediaQuery';

const collapsed = ref(false);
const mobileOpen = ref(false);

const isMobile = useMediaQuery('(max-width: 767px)');

const sidebarWidth = computed(() => (collapsed.value ? 'w-16' : 'w-64'));
const mainMargin = computed(() => {
    if (isMobile.value) return 'ml-0';
    return collapsed.value ? 'ml-16' : 'ml-64';
});

watch(isMobile, (mobile) => {
    if (mobile) mobileOpen.value = false;
});

function toggleSidebar() {
    if (isMobile.value) {
        mobileOpen.value = !mobileOpen.value;
    } else {
        collapsed.value = !collapsed.value;
    }
}

interface NavItem {
    href: string;
    label: string;
    icon: string;
}

interface Divider {
    type: 'divider';
}

interface User {
    is_super_admin?: boolean;
}

interface CurrentTeam {
    id: number;
    name: string;
    slug: string;
}

type SidebarItem = NavItem | Divider;

const page = usePage();
const user = page.props.auth?.user as User | undefined;
const isSuperAdmin = !!user?.is_super_admin;
const currentTeam = computed<CurrentTeam | null>(() => (page.props.currentTeam as CurrentTeam | null) ?? null);

const teamSlug = computed(() => {
    if (isSuperAdmin) return null;
    return currentTeam.value?.slug ?? null;
});

function isActive(path: string): boolean {
    return window.location.pathname.startsWith(path);
}

function isDashboardActive(paths: string[]): boolean {
    return paths.some(p => isActive(p)) && paths.every(p => window.location.pathname !== p);
}

const navItems = computed<SidebarItem[]>(() => {
    if (isSuperAdmin) {
        return [
            { href: '/admin', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
            { type: 'divider' },
            { href: '/admin/mascotas', label: 'Mascotas', icon: 'M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5' },
            { href: '/admin/organizaciones', label: 'Organizaciones', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
            { href: '/admin/eventos', label: 'Eventos', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
            { href: '/admin/blog', label: 'Blog', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
            { href: '/admin/usuarios', label: 'Usuarios', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
            { href: '/admin/roles', label: 'Roles', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
            { type: 'divider' },
            { href: '/admin/adopciones', label: 'Adopciones', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
            { href: '/admin/seguimiento', label: 'Seguimiento', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
        ];
    }

    const slug = teamSlug.value;
    if (!slug) return [];

    return [
        { href: `/${slug}/dashboard`, label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { type: 'divider' },
        { href: `/${slug}/mascotas`, label: 'Mascotas', icon: 'M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5' },
        { href: `/${slug}/eventos`, label: 'Eventos', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { href: `/${slug}/blog`, label: 'Blog', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
        { type: 'divider' },
        { href: `/${slug}/adopciones`, label: 'Adopciones', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
        { href: `/${slug}/seguimientos`, label: 'Seguimiento', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    ];
});

const bottomItems = computed<NavItem[]>(() => {
    const items: NavItem[] = [
        { href: '/settings/profile', label: 'Mi Perfil', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        { href: '/', label: 'Volver al sitio', icon: 'M10 19l-7-7m0 0l7-7m-7 7h18' },
    ];
    return items;
});

function isNavActive(item: NavItem): boolean {
    if (isSuperAdmin) {
        if (item.href === '/admin') {
            const adminPaths = ['/admin/mascotas', '/admin/organizaciones', '/admin/eventos', '/admin/blog', '/admin/usuarios', '/admin/roles', '/admin/adopciones', '/admin/seguimiento'];
            return window.location.pathname === '/admin' || (isActive('/admin') && !adminPaths.some(p => isActive(p)));
        }
        return isActive(item.href);
    }

    const slug = teamSlug.value;
    if (!slug) return false;

    if (item.href === `/${slug}/dashboard`) {
        const teamPaths = [`/${slug}/mascotas`, `/${slug}/eventos`, `/${slug}/blog`, `/${slug}/adopciones`, `/${slug}/seguimientos`];
        return window.location.pathname === item.href || (isActive(`/${slug}/`) && !teamPaths.some(p => isActive(p)));
    }
    return isActive(item.href);
}
</script>

<template>
    <div class="flex min-h-screen bg-muted/30">
        <Transition name="backdrop">
            <div
                v-if="mobileOpen && isMobile"
                class="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
                @click="mobileOpen = false"
            />
        </Transition>

        <aside
            class="fixed top-0 left-0 z-40 flex h-screen flex-col border-r border-border bg-card shadow-lg transition-all duration-300 md:shadow-none"
            :class="[
                isMobile
                    ? mobileOpen
                        ? 'translate-x-0'
                        : '-translate-x-full'
                    : sidebarWidth,
            ]"
        >
            <div
                class="flex h-16 items-center border-b border-border/50 px-3"
                :class="collapsed && !isMobile ? 'justify-center' : 'gap-2 px-6'"
            >
                <span
                    class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2D6A4F] text-sm font-bold text-white"
                >W</span>
                <Transition name="fade">
                    <span v-if="!collapsed || isMobile" class="text-lg font-bold text-card-foreground whitespace-nowrap">{{ isSuperAdmin ? 'Wasiyuq Admin' : 'Mi Organización' }}</span>
                </Transition>
            </div>

            <nav class="flex-1 space-y-1 overflow-y-auto p-3">
                <template v-for="item in navItems" :key="'href' in item ? item.href : item.type">
                    <div v-if="'type' in item && item.type === 'divider'" class="my-3 border-t border-border/50" />

                    <a
                        v-else
                        :href="(item as NavItem).href"
                        class="group relative flex items-center rounded-lg text-sm font-medium transition"
                        :class="[
                            collapsed && !isMobile ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
                            isNavActive(item as NavItem)
                                ? 'bg-[#2D6A4F] text-white'
                                : 'text-muted-foreground hover:bg-accent'
                        ]"
                        :title="collapsed && !isMobile ? (item as NavItem).label : undefined"
                    >
                        <svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="(item as NavItem).icon" />
                        </svg>
                        <Transition name="fade">
                            <span v-if="!collapsed || isMobile">{{ (item as NavItem).label }}</span>
                        </Transition>
                    </a>
                </template>
            </nav>

            <div class="space-y-1 border-t border-border/50 p-3">
                <a
                    v-for="item in bottomItems"
                    :key="item.href"
                    :href="item.href"
                    class="group relative flex items-center rounded-lg text-sm transition"
                    :class="[
                        collapsed && !isMobile ? 'justify-center p-2.5' : 'gap-3 px-3 py-2',
                        isActive(item.href)
                            ? 'bg-[#2D6A4F] text-white'
                            : 'text-muted-foreground hover:bg-accent'
                    ]"
                    :title="collapsed && !isMobile ? item.label : undefined"
                >
                    <svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
                    </svg>
                    <Transition name="fade">
                        <span v-if="!collapsed || isMobile">{{ item.label }}</span>
                    </Transition>
                </a>
            </div>
        </aside>

        <div
            class="flex flex-1 flex-col transition-all duration-300"
            :class="mainMargin"
        >
            <header
                class="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-card/95 backdrop-blur-sm px-4 sm:px-6"
            >
                <button
                    class="rounded-lg p-2 text-muted-foreground transition hover:bg-accent"
                    @click="toggleSidebar"
                >
                    <svg
                        class="h-5 w-5 transition-transform duration-300"
                        :class="{ 'rotate-180': !isMobile && collapsed }"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                </button>

                <div class="flex items-center gap-4">
                    <a
                        href="/settings/profile"
                        class="text-sm text-muted-foreground hover:text-foreground"
                    >Mi Perfil</a>
                </div>
            </header>

            <main class="flex-1 p-4 sm:p-6">
                <slot />
            </main>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
.backdrop-enter-active,
.backdrop-leave-active {
    transition: opacity 0.3s ease;
}
.backdrop-enter-from,
.backdrop-leave-to {
    opacity: 0;
}
</style>
