<script setup lang="ts">
import {
    Shield,
    ShieldCheck,
    ShieldHalf,
    Eye,
    Pencil,
    Settings,
    Star,
    Users,
    ArrowRight,
} from 'lucide-vue-next';

interface Role {
    value: string;
    label: string;
    description: string;
    level: number;
    modules: Record<string, any>;
    total_permissions: number;
}

const props = defineProps<{ roles: Role[] }>();

function levelIcon(level: number) {
    if (level >= 9) return ShieldCheck;
    if (level >= 7) return Shield;
    if (level >= 5) return ShieldHalf;
    if (level >= 3) return Settings;
    return Eye;
}

function levelColor(level: number): string {
    const map: Record<string, string> = {
        '10': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
        '9': 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
        '8': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
        '6': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400',
        '5': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
        '4': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
        '2': 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
        '1': 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
    };
    return map[String(level)] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800';
}

function roleIcon(level: number) {
    const Icon = levelIcon(level);
    return Icon;
}

const moduleIcons: Record<string, string> = {
    team: '🏢',
    member: '👥',
    invitation: '📧',
    pets: '🐾',
    adoptions: '🤝',
    'follow-ups': '📋',
    blog: '📝',
    events: '📅',
    announcements: '📢',
    reports: '📊',
    data: '💾',
};
</script>

<template>
    <div class="mx-auto max-w-6xl">
        <div class="mb-8 flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2D6A4F]/10">
                <ShieldCheck class="h-6 w-6 text-[#2D6A4F]" />
            </div>
            <div>
                <h1 class="text-2xl font-bold text-foreground">Gestión de Roles</h1>
                <p class="mt-0.5 text-sm text-muted-foreground">Explora los diferentes roles disponibles y sus permisos.</p>
            </div>
        </div>

        <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <a v-for="role in roles" :key="role.value"
                :href="'/admin/roles/' + role.value"
                class="group relative rounded-2xl border border-[#2D6A4F]/15 bg-gradient-to-b from-white to-[#2D6A4F]/4 p-6 transition hover:border-[#2D6A4F]/30 hover:shadow-sm dark:border-[#2D6A4F]/30 dark:from-[#2D6A4F]/15 dark:to-black/40">
                <div class="flex items-start justify-between gap-4">
                    <div class="flex items-center gap-3">
                        <div class="flex h-11 w-11 items-center justify-center rounded-xl border border-[#2D6A4F]/15 bg-white dark:border-[#2D6A4F]/30 dark:bg-black/40">
                            <component :is="roleIcon(role.level)" class="h-5 w-5" :class="role.level >= 9 ? 'text-purple-600' : role.level >= 7 ? 'text-blue-600' : role.level >= 5 ? 'text-emerald-600' : 'text-muted-foreground/70'" />
                        </div>
                        <div>
                            <h3 class="text-base font-semibold text-foreground">{{ role.label }}</h3>
                            <p class="text-xs text-muted-foreground/70 mt-0.5">{{ role.description }}</p>
                        </div>
                    </div>
                    <span class="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium" :class="levelColor(role.level)">Nivel {{ role.level }}</span>
                </div>

                <div class="mt-5 space-y-3">
                    <p class="text-xs font-medium text-muted-foreground/70">Módulos disponibles</p>
                    <div class="flex flex-wrap gap-1.5">
                        <span v-for="mod in Object.keys(role.modules)" :key="mod"
                            class="inline-flex items-center gap-1 rounded-full border border-[#2D6A4F]/10 bg-[#2D6A4F]/4 px-2.5 py-1 text-xs text-muted-foreground dark:border-[#2D6A4F]/20 dark:bg-[#2D6A4F]/10">
                            <span>{{ moduleIcons[mod] ?? '🔘' }}</span>
                            {{ mod }}
                        </span>
                    </div>
                </div>

                <div class="mt-4 flex items-center justify-between border-t border-[#2D6A4F]/10 pt-3 dark:border-[#2D6A4F]/20">
                    <span class="text-xs text-muted-foreground/60">{{ role.total_permissions }} permisos · {{ Object.keys(role.modules).length }} módulos</span>
                    <ArrowRight class="h-4 w-4 text-[#2D6A4F]/50 transition group-hover:translate-x-1" />
                </div>
            </a>
        </div>
    </div>
</template>
