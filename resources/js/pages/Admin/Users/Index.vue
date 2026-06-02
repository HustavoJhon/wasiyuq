<script setup lang="ts">
import { Link, router } from '@inertiajs/vue3';
import {
    createColumnHelper,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useVueTable,
} from '@tanstack/vue-table';
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
}>();

const globalFilter = ref('');
const teamFilter = ref('all');
const roleFilter = ref('all');

const columnHelper = createColumnHelper<User>();

const columns = [
    columnHelper.accessor('name', {
        header: 'Usuario',
        cell: ({ row }) => {
            const user = row.original;
            const initials = user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);

            return {
                component: 'div',
                props: {},
                children: [
                    { component: 'span', children: initials },
                    { component: 'span', children: user.name },
                    { component: 'span', children: user.email },
                ],
            };
        },
        enableSorting: true,
    }),
    columnHelper.accessor('email_verified_at', {
        header: 'Verificado',
        cell: ({ getValue }) => getValue() !== null,
        enableSorting: true,
    }),
    columnHelper.accessor('is_super_admin', {
        header: 'Admin',
        cell: ({ getValue }) => getValue(),
        enableSorting: true,
    }),
    columnHelper.accessor('team_memberships_count', {
        header: 'Equipos',
        enableSorting: true,
    }),
    columnHelper.accessor('created_at', {
        header: 'Registro',
        enableSorting: true,
    }),
];

const data = computed(() => props.users);

const table = useVueTable({
    get data() {
        return data.value;
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
        get globalFilter() {
            return globalFilter.value;
        },
    },
    onGlobalFilterChange: (value) => {
        globalFilter.value = value;
    },
    globalFilterFn: 'includesString',
    initialState: {
        pagination: { pageSize: 15 },
    },
});

const filteredUsers = computed(() => {
    return props.users.filter((u) => {
        if (
            teamFilter.value !== 'all' &&
            !u.memberships.some(
                (m) => m.team.id.toString() === teamFilter.value,
            )
        ) {
            return false;
        }

        if (
            roleFilter.value !== 'all' &&
            !u.memberships.some((m) => m.role === roleFilter.value)
        ) {
            return false;
        }

        return true;
    });
});

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
        { page },
        { preserveState: true, preserveScroll: true },
    );
}
</script>

<template>
    <div>
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-foreground">Usuarios</h1>
                <p class="mt-1 text-sm text-muted-foreground">
                    Todos los usuarios registrados en la plataforma.
                </p>
            </div>
        </div>

        <Card class="mt-6">
            <CardHeader class="pb-3">
                <div
                    class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <CardTitle class="text-base">Lista de Usuarios</CardTitle>
                    <CardDescription
                        >{{ meta.total }} usuarios en total</CardDescription
                    >
                </div>
                <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div class="relative w-full sm:max-w-sm">
                        <Search
                            class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                        />
                        <Input
                            v-model="globalFilter"
                            placeholder="Buscar usuarios..."
                            class="pl-9"
                        />
                    </div>
                    <Select v-model="teamFilter">
                        <SelectTrigger class="w-full sm:w-44">
                            <SelectValue placeholder="Todos los equipos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all"
                                >Todos los equipos</SelectItem
                            >
                            <SelectItem
                                v-for="(name, id) in teams"
                                :key="id"
                                :value="id"
                                >{{ name }}</SelectItem
                            >
                        </SelectContent>
                    </Select>
                    <Select v-model="roleFilter">
                        <SelectTrigger class="w-full sm:w-36">
                            <SelectValue placeholder="Todos los roles" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los roles</SelectItem>
                            <SelectItem
                                v-for="r in roles"
                                :key="r"
                                :value="r"
                                >{{ r }}</SelectItem
                            >
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent class="p-0">
                <Table>
                    <TableHeader>
                        <TableRow
                            v-for="headerGroup in table.getHeaderGroups()"
                            :key="headerGroup.id"
                        >
                            <TableHead
                                v-for="header in headerGroup.headers"
                                :key="header.id"
                                :class="{
                                    'cursor-pointer select-none':
                                        header.column.getCanSort(),
                                }"
                                @click="
                                    header.column.getToggleSortingHandler()?.(
                                        $event,
                                    )
                                "
                            >
                                <div class="flex items-center gap-1">
                                    <template v-if="header.column.id === 'name'"
                                        >Usuario</template
                                    >
                                    <template
                                        v-else-if="
                                            header.column.id ===
                                            'email_verified_at'
                                        "
                                        >Verificado</template
                                    >
                                    <template
                                        v-else-if="
                                            header.column.id ===
                                            'is_super_admin'
                                        "
                                        >Admin</template
                                    >
                                    <template
                                        v-else-if="
                                            header.column.id ===
                                            'team_memberships_count'
                                        "
                                        >Equipos</template
                                    >
                                    <template
                                        v-else-if="
                                            header.column.id === 'created_at'
                                        "
                                        >Registro</template
                                    >
                                    <template v-else>{{
                                        header.column.id
                                    }}</template>
                                    <ArrowUpDown
                                        class="size-3 text-muted-foreground/60"
                                    />
                                </div>
                            </TableHead>
                            <TableHead class="w-24" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="row in filteredUsers" :key="row.id">
                            <TableCell>
                                <div class="flex items-center gap-3">
                                    <Avatar class="size-8">
                                        <AvatarFallback class="text-xs">{{
                                            initials(row.name)
                                        }}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p
                                            class="font-medium text-card-foreground"
                                        >
                                            {{ row.name }}
                                        </p>
                                        <p
                                            class="text-xs text-muted-foreground"
                                        >
                                            {{ row.email }}
                                        </p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant="outline"
                                    :class="
                                        row.email_verified_at
                                            ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400'
                                            : 'border-muted-foreground/20 text-muted-foreground'
                                    "
                                >
                                    <MailCheck
                                        v-if="row.email_verified_at"
                                        class="size-3"
                                    />
                                    <MailX v-else class="size-3" />
                                    {{ row.email_verified_at ? 'Sí' : 'No' }}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    v-if="row.is_super_admin"
                                    variant="default"
                                    class="bg-amber-600 hover:bg-amber-700"
                                >
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
                                    <span
                                        v-for="(m, i) in row.memberships"
                                        :key="i"
                                    >
                                        {{ m.team.name
                                        }}<span
                                            v-if="
                                                i < row.memberships.length - 1
                                            "
                                            >,
                                        </span>
                                    </span>
                                </template>
                                <span v-else class="text-muted-foreground/50"
                                    >—</span
                                >
                            </TableCell>
                            <TableCell class="text-muted-foreground">{{
                                formatDate(row.created_at)
                            }}</TableCell>
                            <TableCell>
                                <Button variant="outline" size="sm" as-child>
                                    <Link :href="admin.users.show(row.id).url"
                                        >Ver</Link
                                    >
                                </Button>
                            </TableCell>
                        </TableRow>
                        <TableRow v-if="filteredUsers.length === 0">
                            <TableCell
                                colspan="6"
                                class="py-12 text-center text-muted-foreground"
                            >
                                No se encontraron usuarios.
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        <div
            v-if="meta.last_page > 1"
            class="mt-4 flex items-center justify-between px-2"
        >
            <p class="text-sm text-muted-foreground">
                Página {{ meta.current_page }} de {{ meta.last_page }}
            </p>
            <div class="flex items-center gap-1.5">
                <Button
                    variant="outline"
                    size="icon"
                    :disabled="meta.current_page <= 1"
                    @click="goToPage(1)"
                >
                    <ChevronsLeft class="size-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    :disabled="meta.current_page <= 1"
                    @click="goToPage(meta.current_page - 1)"
                >
                    <ChevronLeft class="size-4" />
                </Button>

                <template v-for="p in meta.last_page" :key="p">
                    <Button
                        v-if="
                            p === meta.current_page ||
                            Math.abs(p - meta.current_page) <= 1 ||
                            p === 1 ||
                            p === meta.last_page
                        "
                        variant="outline"
                        size="icon"
                        :class="
                            p === meta.current_page
                                ? 'bg-[#2D6A4F] text-white hover:bg-[#2D6A4F]/90 hover:text-white'
                                : ''
                        "
                        @click="goToPage(p)"
                    >
                        {{ p }}
                    </Button>
                    <span
                        v-else-if="
                            p === meta.current_page - 2 ||
                            p === meta.current_page + 2
                        "
                        class="px-1 text-muted-foreground/50"
                        >...</span
                    >
                </template>

                <Button
                    variant="outline"
                    size="icon"
                    :disabled="meta.current_page >= meta.last_page"
                    @click="goToPage(meta.current_page + 1)"
                >
                    <ChevronRight class="size-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    :disabled="meta.current_page >= meta.last_page"
                    @click="goToPage(meta.last_page)"
                >
                    <ChevronsRight class="size-4" />
                </Button>
            </div>
        </div>
    </div>
</template>
