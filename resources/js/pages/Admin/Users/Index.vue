<script setup lang="ts">
import { Link, router } from '@inertiajs/vue3';
import {
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Search,
    ShieldCheck,
    ShieldX,
    MailCheck,
    MailX,
    User as UserIcon,
    Calendar,
} from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import admin from '@/routes/admin';

interface Membership {
    team: { id: number; name: string; slug: string };
    role: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    is_super_admin: boolean;
    email_verified_at: string | null;
    created_at: string;
    memberships: Membership[];
    team_memberships_count: number;
}

interface Meta {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

const props = defineProps<{
    users: User[];
    meta: Meta;
    teams: Record<string, string>;
    roles: string[];
    filters?: { search?: string; team_id?: string; role?: string };
}>();

function destroyUser(userId: number, userName: string) {
    if (confirm(`¿Eliminar a "${userName}"? Esta acción no se puede deshacer.`)) {
        router.delete(admin.users.destroy(userId).url);
    }
}

const globalFilter = ref(props.filters?.search ?? '');
const teamFilter = ref(props.filters?.team_id ?? 'all');
const roleFilter = ref(props.filters?.role ?? 'all');

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

function applyFilters() {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        router.get(admin.users.index().url, {
            search: globalFilter.value || undefined,
            team_id: teamFilter.value !== 'all' ? teamFilter.value : undefined,
            role: roleFilter.value !== 'all' ? roleFilter.value : undefined,
        }, { preserveState: true, replace: true, preserveScroll: true });
    }, 300);
}

function onTeamChange(value: string) {
    teamFilter.value = value;
    router.get(admin.users.index().url, {
        search: globalFilter.value || undefined,
        team_id: value !== 'all' ? value : undefined,
        role: roleFilter.value !== 'all' ? roleFilter.value : undefined,
    }, { preserveState: true, replace: true, preserveScroll: true });
}

function onRoleChange(value: string) {
    roleFilter.value = value;
    router.get(admin.users.index().url, {
        search: globalFilter.value || undefined,
        team_id: teamFilter.value !== 'all' ? teamFilter.value : undefined,
        role: value !== 'all' ? value : undefined,
    }, { preserveState: true, replace: true, preserveScroll: true });
}

function initials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

function formatDate(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(
        new Date(d),
    );
}

function goToPage(page: number) {
    router.get(
        admin.users.index().url,
        {
            page,
            search: globalFilter.value || undefined,
            team_id: teamFilter.value !== 'all' ? teamFilter.value : undefined,
            role: roleFilter.value !== 'all' ? roleFilter.value : undefined,
        },
        { preserveState: true, preserveScroll: true },
    );
}
</script>

<template>
    <div>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl font-bold text-foreground">Usuarios</h1>
                <p class="mt-1 text-sm text-muted-foreground">
                    Todos los usuarios registrados en la plataforma.
                </p>
            </div>
            <Link :href="admin.users.create().url" class="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#2D6A4F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#246142]">
                <svg class="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Nuevo Usuario
            </Link>
        </div>

        <Card class="mt-6">
            <CardHeader class="pb-3">
                <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle class="text-base">Lista de Usuarios</CardTitle>
                    <CardDescription>{{ meta.total }} usuarios en total</CardDescription>
                </div>
                <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div class="relative w-full sm:max-w-sm">
                        <Search class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input v-model="globalFilter" placeholder="Buscar usuarios..." class="pl-9" @input="applyFilters" />
                    </div>
                    <Select v-model="teamFilter" @update:model-value="onTeamChange">
                        <SelectTrigger class="w-full sm:w-44">
                            <SelectValue placeholder="Todos los equipos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los equipos</SelectItem>
                            <SelectItem v-for="(name, id) in teams" :key="id" :value="id">{{ name }}</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select v-model="roleFilter" @update:model-value="onRoleChange">
                        <SelectTrigger class="w-full sm:w-36">
                            <SelectValue placeholder="Todos los roles" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los roles</SelectItem>
                            <SelectItem v-for="r in roles" :key="r" :value="r">{{ r }}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent class="hidden overflow-x-auto md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead class="cursor-pointer select-none">
                                <div class="flex items-center gap-1">
                                    Usuario
                                    <ArrowUpDown class="size-3 text-muted-foreground/60" />
                                </div>
                            </TableHead>
                            <TableHead class="cursor-pointer select-none">
                                <div class="flex items-center gap-1">
                                    Verificado
                                    <ArrowUpDown class="size-3 text-muted-foreground/60" />
                                </div>
                            </TableHead>
                            <TableHead class="cursor-pointer select-none">
                                <div class="flex items-center gap-1">
                                    Admin
                                    <ArrowUpDown class="size-3 text-muted-foreground/60" />
                                </div>
                            </TableHead>
                            <TableHead class="cursor-pointer select-none">
                                <div class="flex items-center gap-1">
                                    Equipos
                                    <ArrowUpDown class="size-3 text-muted-foreground/60" />
                                </div>
                            </TableHead>
                            <TableHead class="cursor-pointer select-none">
                                <div class="flex items-center gap-1">
                                    Registro
                                    <ArrowUpDown class="size-3 text-muted-foreground/60" />
                                </div>
                            </TableHead>
                            <TableHead class="w-36" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="row in users" :key="row.id">
                            <TableCell>
                                <div class="flex items-center gap-3">
                                    <Avatar class="size-8">
                                        <AvatarFallback class="text-xs">{{ initials(row.name) }}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p class="font-medium text-card-foreground">{{ row.name }}</p>
                                        <p class="text-xs text-muted-foreground">{{ row.email }}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" :class="row.email_verified_at ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400' : 'border-muted-foreground/20 text-muted-foreground'">
                                    <MailCheck v-if="row.email_verified_at" class="size-3" />
                                    <MailX v-else class="size-3" />
                                    {{ row.email_verified_at ? 'Sí' : 'No' }}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge v-if="row.is_super_admin" variant="default" class="bg-amber-600 hover:bg-amber-700">
                                    <ShieldCheck class="size-3" />
                                    Super Admin
                                </Badge>
                                <Badge v-else variant="secondary">
                                    <ShieldX class="size-3" />
                                    Usuario
                                </Badge>
                            </TableCell>
                            <TableCell class="text-muted-foreground">
                                <template v-if="row.memberships.length > 0">
                                    <span v-for="(m, i) in row.memberships" :key="i">{{ m.team.name }}<span v-if="i < row.memberships.length - 1">, </span></span>
                                </template>
                                <span v-else class="text-muted-foreground/50">—</span>
                            </TableCell>
                            <TableCell class="text-muted-foreground">{{ formatDate(row.created_at) }}</TableCell>
                            <TableCell>
                                <div class="flex items-center gap-1.5">
                                    <Button variant="outline" size="sm" as-child>
                                        <Link :href="admin.users.show(row.id).url">Ver</Link>
                                    </Button>
                                    <Button variant="outline" size="sm" as-child>
                                        <Link :href="admin.users.edit(row.id).url">Editar</Link>
                                    </Button>
                                    <Button variant="outline" size="sm" class="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:hover:bg-red-950/30" @click="destroyUser(row.id, row.name)">
                                        Eliminar
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow v-if="users.length === 0">
                            <TableCell colspan="6" class="py-12 text-center text-muted-foreground">
                                No se encontraron usuarios.
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        <div v-if="users.length > 0" class="mt-6 space-y-3 md:hidden">
            <div v-for="row in users" :key="row.id" class="rounded-xl border border-border bg-card p-4 transition hover:shadow-sm">
                <div class="flex items-start justify-between gap-3">
                    <div class="flex items-center gap-3">
                        <Avatar class="size-10">
                            <AvatarFallback class="text-xs">{{ initials(row.name) }}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p class="font-semibold text-card-foreground">{{ row.name }}</p>
                            <p class="text-xs text-muted-foreground">{{ row.email }}</p>
                        </div>
                    </div>
                    <div class="flex shrink-0 flex-col items-end gap-1.5">
                        <Badge variant="outline" :class="row.email_verified_at ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400' : 'border-muted-foreground/20 text-muted-foreground'" class="text-[10px]">
                            {{ row.email_verified_at ? 'Verificado' : 'No verificado' }}
                        </Badge>
                        <Badge v-if="row.is_super_admin" variant="default" class="bg-amber-600 text-[10px]">Super Admin</Badge>
                        <Badge v-else variant="secondary" class="text-[10px]">Usuario</Badge>
                    </div>
                </div>
                <div class="mt-3 flex items-center gap-3 text-xs text-muted-foreground/70">
                    <span class="flex items-center gap-1">
                        <UserIcon class="size-3" />
                        {{ row.memberships.length > 0 ? row.memberships.map(m => m.team.name).join(', ') : 'Sin equipos' }}
                    </span>
                </div>
                <div class="mt-2 flex items-center justify-between border-t border-border/50 pt-3">
                    <span class="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                        <Calendar class="size-3" />
                        {{ formatDate(row.created_at) }}
                    </span>
                    <div class="flex items-center gap-2">
                        <Link :href="admin.users.show(row.id).url" class="flex items-center gap-1 text-xs font-medium text-[#2D6A4F] dark:text-emerald-400">
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Ver
                        </Link>
                        <Link :href="admin.users.edit(row.id).url" class="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-[#2D6A4F]">
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Editar
                        </Link>
                        <button @click="destroyUser(row.id, row.name)" class="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700">
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
            <div v-if="users.length === 0" class="rounded-xl border border-border bg-card px-5 py-8 text-center text-sm text-muted-foreground/70">
                No se encontraron usuarios.
            </div>
        </div>

        <div
            v-if="meta.last_page > 1"
            class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-2"
        >
            <p class="text-sm text-muted-foreground">
                Página {{ meta.current_page }} de {{ meta.last_page }}
            </p>
            <div class="flex items-center gap-1.5">
                <Button variant="outline" size="icon" :disabled="meta.current_page <= 1" @click="goToPage(1)">
                    <ChevronsLeft class="size-4" />
                </Button>
                <Button variant="outline" size="icon" :disabled="meta.current_page <= 1" @click="goToPage(meta.current_page - 1)">
                    <ChevronLeft class="size-4" />
                </Button>

                <template v-for="p in meta.last_page" :key="p">
                    <Button
                        v-if="p === meta.current_page || Math.abs(p - meta.current_page) <= 1 || p === 1 || p === meta.last_page"
                        variant="outline"
                        size="icon"
                        :class="p === meta.current_page ? 'bg-[#2D6A4F] text-white hover:bg-[#2D6A4F]/90 hover:text-white dark:bg-emerald-500 dark:text-black dark:hover:bg-emerald-600' : ''"
                        @click="goToPage(p)"
                    >{{ p }}</Button>
                    <span v-else-if="p === meta.current_page - 2 || p === meta.current_page + 2" class="px-1 text-muted-foreground/50">...</span>
                </template>

                <Button variant="outline" size="icon" :disabled="meta.current_page >= meta.last_page" @click="goToPage(meta.current_page + 1)">
                    <ChevronRight class="size-4" />
                </Button>
                <Button variant="outline" size="icon" :disabled="meta.current_page >= meta.last_page" @click="goToPage(meta.last_page)">
                    <ChevronsRight class="size-4" />
                </Button>
            </div>
        </div>
    </div>
</template>
