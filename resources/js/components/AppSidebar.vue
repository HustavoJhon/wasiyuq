<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import {
    BookOpen,
    ClipboardList,
    FileText,
    FolderGit2,
    LayoutGrid,
    PawPrint,
    CalendarDays,
    Plus,
    Search,
    Shield,
    Users,
    Settings,
} from 'lucide-vue-next';
import { ref, computed } from 'vue';
import AppLogo from '@/components/AppLogo.vue';
import CommandPalette from '@/components/CommandPalette.vue';
import NavFooter from '@/components/NavFooter.vue';
import NavMain from '@/components/NavMain.vue';
import NavUser from '@/components/NavUser.vue';
import TeamSwitcher from '@/components/TeamSwitcher.vue';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const page = usePage();

const dashboardUrl = computed(() =>
    page.props.currentTeam ? dashboard(page.props.currentTeam.slug).url : '/',
);

const allowedModules = computed<string[]>(
    () => (page.props.allowedModules as string[]) ?? [],
);

const teamSlug = computed(
    () => (page.props.currentTeam as { slug: string } | null)?.slug ?? '',
);

const commandOpen = ref(false);

const moduleNavItems: Record<string, { title: string; icon: any }> = {
    mascotas: { title: 'Mascotas', icon: PawPrint },
    adopciones: { title: 'Adopciones', icon: ClipboardList },
    blog: { title: 'Blog', icon: FileText },
    eventos: { title: 'Eventos', icon: CalendarDays },
    seguimientos: { title: 'Seguimientos', icon: ClipboardList },
};

const mainNavItems = computed<NavItem[]>(() => {
    const items: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboardUrl.value,
            icon: LayoutGrid,
        },
    ];

    for (const mod of allowedModules.value) {
        const cfg = moduleNavItems[mod];

        if (cfg) {
            items.push({
                title: cfg.title,
                href: `/${teamSlug.value}/${mod}`,
                icon: cfg.icon,
            });
        }
    }

    items.push({
        title: 'Administración',
        icon: Settings,
        children: [
            {
                title: 'Usuarios',
                href: '/admin/usuarios',
                icon: Users,
            },
            {
                title: 'Roles',
                href: '/admin/roles',
                icon: Shield,
            },
        ],
    });

    return items;
});

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/vue-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#vue',
        icon: BookOpen,
    },
];
</script>

<template>
    <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" as-child>
                        <Link :href="dashboardUrl">
                            <AppLogo />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenu>
                <SidebarMenuItem>
                    <TeamSwitcher />
                </SidebarMenuItem>
            </SidebarMenu>

            <SidebarMenu class="px-3 py-2">
                <SidebarMenuItem>
                    <SidebarMenuButton
                        tooltip="Buscar (⌘K)"
                        @click="commandOpen = true"
                    >
                        <Search class="size-4" />
                        <span>Buscar</span>
                        <kbd
                            class="ml-auto hidden items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground/60 md:inline-flex"
                        >
                            ⌘K
                        </kbd>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Nuevo">
                        <Plus class="size-4" />
                        <span>Nuevo</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
            <NavMain :items="mainNavItems" />
        </SidebarContent>

        <SidebarFooter>
            <NavFooter :items="footerNavItems" />
            <NavUser />
        </SidebarFooter>
    </Sidebar>

    <CommandPalette v-model:open="commandOpen" />
    <slot />
</template>
