<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import {
    LogOut,
    Settings,
    Monitor,
    Sun,
    Moon,
    Github,
    Search,
} from 'lucide-vue-next';
import { ref } from 'vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import CommandPalette from '@/components/CommandPalette.vue';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAppearance } from '@/composables/useAppearance';
import { useInitials } from '@/composables/useInitials';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import type { BreadcrumbItem, User } from '@/types';

const page = usePage();
const user = page.props.auth.user as User;
const { appearance, updateAppearance } = useAppearance();
const { getInitials } = useInitials();

defineProps<{
    breadcrumbs?: BreadcrumbItem[];
}>();

const commandOpen = ref(false);

function cycleTheme() {
    const themes: Array<'light' | 'dark' | 'system'> = [
        'light',
        'dark',
        'system',
    ];
    const idx = themes.indexOf(appearance.value);
    updateAppearance(themes[(idx + 1) % themes.length]);
}

function handleLogout() {
    // let Inertia handle it naturally
}
</script>

<template>
    <header
        class="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 overflow-hidden rounded-t-[inherit] border-b bg-background/50 backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
    >
        <div class="flex w-full items-center justify-between px-4 lg:px-6">
            <div class="flex items-center gap-1 lg:gap-2">
                <SidebarTrigger class="-ml-1" />

                <Separator
                    orientation="vertical"
                    class="mx-2 h-4 self-center"
                />

                <Button
                    variant="link"
                    class="px-0 font-normal text-muted-foreground hover:no-underline"
                    @click="commandOpen = true"
                >
                    <Search class="size-4" />
                    Buscar
                    <kbd
                        class="inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium select-none"
                    >
                        <span class="text-xs">⌘</span>J
                    </kbd>
                </Button>

                <template v-if="breadcrumbs && breadcrumbs.length > 0">
                    <Separator
                        orientation="vertical"
                        class="mx-2 h-4 self-center"
                    />
                    <Breadcrumbs :breadcrumbs="breadcrumbs" />
                </template>
            </div>

            <div class="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                        <Button variant="default" size="icon">
                            <Settings class="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" class="w-48">
                        <DropdownMenuLabel>Configuración</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem as-child>
                                <Link :href="edit()">
                                    <Settings class="mr-2 size-4" />
                                    Perfil
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button
                    variant="default"
                    size="icon"
                    @click="cycleTheme"
                    :aria-label="`Tema: ${appearance}`"
                >
                    <Monitor
                        class="hidden size-4 [html[data-theme-mode=system]_&]:block"
                    />
                    <Sun
                        class="hidden size-4 dark:block [html[data-theme-mode=system]_&]:hidden"
                    />
                    <Moon
                        class="block size-4 dark:hidden [html[data-theme-mode=system]_&]:hidden"
                    />
                </Button>

                <a
                    href="https://github.com/anomalyco/opencode"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                >
                    <Button variant="default" size="icon">
                        <Github class="size-4" />
                    </Button>
                </a>

                <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                        <Avatar class="size-8 cursor-pointer rounded-lg">
                            <AvatarImage
                                v-if="user.avatar"
                                :src="user.avatar"
                                :alt="user.name"
                            />
                            <AvatarFallback class="rounded-lg text-xs">{{
                                getInitials(user.name)
                            }}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" class="w-56">
                        <DropdownMenuLabel class="font-normal">
                            <div class="flex flex-col gap-1">
                                <p class="text-sm leading-none font-medium">
                                    {{ user.name }}
                                </p>
                                <p
                                    class="text-xs leading-none text-muted-foreground"
                                >
                                    {{ user.email }}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem as-child>
                                <Link :href="edit()">
                                    <Settings class="mr-2 size-4" />
                                    Perfil
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem as-child>
                            <Link :href="logout()" @click="handleLogout">
                                <LogOut class="mr-2 size-4" />
                                Cerrar sesión
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>

        <CommandPalette v-model:open="commandOpen" />
    </header>
</template>
