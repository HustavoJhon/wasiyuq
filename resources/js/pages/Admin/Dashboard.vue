<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import {
    PawPrint,
    Building2,
    Handshake,
    Users,
    CalendarDays,
    FileText,
    ClipboardList,
    Activity,
} from 'lucide-vue-next';
import AreaChart from '@/components/charts/AreaChart.vue';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import admin from '@/routes/admin';

interface Stats {
    total_pets: number;
    available_pets: number;
    adopted_pets: number;
    total_organizations: number;
    total_adoptions: number;
    pending_adoptions: number;
    total_events: number;
    total_blog_posts: number;
    pending_follow_ups: number;
    total_users: number;
}

interface TrendItem {
    label: string;
    value: number;
}

interface RecentAdoption {
    id: number;
    status: string;
    created_at: string;
    pet: { id: number; name: string; slug: string };
    adopter: { id: number; name: string };
}

interface RecentPet {
    id: number;
    name: string;
    slug: string;
    species: string;
    status: string;
    created_at: string;
    team: { id: number; name: string };
}

const props = defineProps<{
    stats: Stats;
    recent_adoptions: RecentAdoption[];
    recent_pets: RecentPet[];
    adoptions_trend: TrendItem[];
}>();

function statusLabel(status: string): string {
    const labels: Record<string, string> = {
        pending: 'Pendiente',
        approved: 'Aprobada',
        rejected: 'Rechazada',
        completed: 'Completada',
        cancelled: 'Cancelada',
        available: 'Disponible',
        adopted: 'Adoptado',
        in_process: 'En Proceso',
    };

    return labels[status] ?? status;
}

function statusVariant(
    status: string,
): 'outline' | 'secondary' | 'default' | 'destructive' {
    if (status === 'available' || status === 'completed') {
        return 'default';
    }

    if (status === 'pending' || status === 'in_process') {
        return 'secondary';
    }

    if (status === 'rejected' || status === 'cancelled') {
        return 'destructive';
    }

    return 'outline';
}

function formatDate(date: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(
        new Date(date),
    );
}

const metricCards = [
    {
        title: 'Total Mascotas',
        value: props.stats.total_pets,
        sub: `${props.stats.available_pets} disponibles · ${props.stats.adopted_pets} adoptados`,
        icon: PawPrint,
        href: admin.pets.index().url,
    },
    {
        title: 'Organizaciones',
        value: props.stats.total_organizations,
        icon: Building2,
        href: admin.organizations.index().url,
    },
    {
        title: 'Adopciones',
        value: props.stats.total_adoptions,
        sub: `${props.stats.pending_adoptions} pendientes`,
        icon: Handshake,
        href: admin.adoptions.index().url,
    },
    {
        title: 'Usuarios',
        value: props.stats.total_users,
        icon: Users,
        href: admin.users.index().url,
    },
    {
        title: 'Eventos',
        value: props.stats.total_events,
        icon: CalendarDays,
        href: admin.events.index().url,
    },
    {
        title: 'Blog',
        value: props.stats.total_blog_posts,
        icon: FileText,
        href: admin.blog.index().url,
    },
    {
        title: 'Seguimientos Pend.',
        value: props.stats.pending_follow_ups,
        icon: ClipboardList,
        href: admin.followUps.index().url,
        variant: props.stats.pending_follow_ups > 0 ? 'destructive' : undefined,
    },
    {
        title: 'Actividad',
        value:
            props.adoptions_trend.length > 0
                ? Math.max(...props.adoptions_trend.map((t) => t.value))
                : 0,
        sub: 'Pico mensual de adopciones',
        icon: Activity,
    },
];
</script>

<template>
    <div>
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-foreground">
                    Panel de Administración
                </h1>
                <p class="mt-1 text-sm text-muted-foreground">
                    Vista general de toda la plataforma Wasiyuq.
                </p>
            </div>
        </div>

        <div
            class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
        >
            <Link
                v-for="card in metricCards"
                :key="card.title"
                v-bind="card.href ? { href: card.href } : {}"
                :class="[
                    'block rounded-xl border bg-card p-5 transition hover:shadow-md',
                    card.variant === 'destructive'
                        ? 'border-red-200 hover:border-red-400 dark:border-red-900 dark:hover:border-red-700'
                        : 'border-border hover:border-[#2D6A4F]',
                ]"
            >
                <div class="flex items-start justify-between">
                    <p
                        class="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase"
                    >
                        {{ card.title }}
                    </p>
                    <component
                        :is="card.icon"
                        class="size-4 text-muted-foreground/60"
                    />
                </div>
                <p class="mt-2 text-3xl font-bold text-card-foreground">
                    {{ card.value }}
                </p>
                <p v-if="card.sub" class="mt-1.5 text-xs text-muted-foreground">
                    {{ card.sub }}
                </p>
            </Link>
        </div>

        <div class="mt-8">
            <Card>
                <CardHeader class="pb-3">
                    <CardTitle class="text-base"
                        >Actividad de Adopciones</CardTitle
                    >
                    <CardDescription
                        >Adopciones por mes (últimos 12 meses)</CardDescription
                    >
                </CardHeader>
                <CardContent>
                    <AreaChart
                        :data="adoptions_trend"
                        height="220"
                        color="#2D6A4F"
                    />
                </CardContent>
            </Card>
        </div>

        <div class="mt-8 grid gap-6 lg:grid-cols-2">
            <div>
                <h2 class="text-lg font-semibold text-foreground">
                    Últimas Adopciones
                </h2>
                <div
                    v-if="recent_adoptions.length === 0"
                    class="mt-4 text-sm text-muted-foreground/70"
                >
                    Sin adopciones recientes.
                </div>
                <Card v-else class="mt-3">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mascota</TableHead>
                                <TableHead>Adoptante</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead class="text-right">Fecha</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="a in recent_adoptions" :key="a.id">
                                <TableCell class="font-medium">{{
                                    a.pet.name
                                }}</TableCell>
                                <TableCell class="text-muted-foreground">{{
                                    a.adopter.name
                                }}</TableCell>
                                <TableCell>
                                    <Badge :variant="statusVariant(a.status)">{{
                                        statusLabel(a.status)
                                    }}</Badge>
                                </TableCell>
                                <TableCell
                                    class="text-right text-muted-foreground"
                                    >{{ formatDate(a.created_at) }}</TableCell
                                >
                            </TableRow>
                        </TableBody>
                    </Table>
                </Card>
            </div>

            <div>
                <h2 class="text-lg font-semibold text-foreground">
                    Últimas Mascotas
                </h2>
                <div
                    v-if="recent_pets.length === 0"
                    class="mt-4 text-sm text-muted-foreground/70"
                >
                    Sin mascotas registradas.
                </div>
                <Card v-else class="mt-3">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Organización</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead class="text-right"
                                    >Registro</TableHead
                                >
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="p in recent_pets" :key="p.id">
                                <TableCell class="font-medium">{{
                                    p.name
                                }}</TableCell>
                                <TableCell class="text-muted-foreground">{{
                                    p.team.name
                                }}</TableCell>
                                <TableCell>
                                    <Badge :variant="statusVariant(p.status)">{{
                                        statusLabel(p.status)
                                    }}</Badge>
                                </TableCell>
                                <TableCell
                                    class="text-right text-muted-foreground"
                                    >{{ formatDate(p.created_at) }}</TableCell
                                >
                            </TableRow>
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </div>
    </div>
</template>
