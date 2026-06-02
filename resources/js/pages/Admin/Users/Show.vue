<script setup lang="ts">
import { Link, useForm } from '@inertiajs/vue3';
import {
    ArrowLeft,
    ShieldCheck,
    ShieldX,
    MailCheck,
    MailX,
    Building2,
    Handshake,
} from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

interface UserDetail {
    id: number;
    name: string;
    email: string;
    is_super_admin: boolean;
    email_verified_at: string | null;
    created_at: string;
    memberships: {
        id: number;
        team: { id: number; name: string; slug: string };
        role: string;
    }[];
    adoptions_count: number;
}

const props = defineProps<{ user: UserDetail }>();

const form = useForm({ is_super_admin: props.user.is_super_admin });

function toggleSuperAdmin() {
    form.is_super_admin = !form.is_super_admin;
    form.put('/admin/usuarios/' + props.user.id + '/role');
}

function formatDate(d: string): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(
        new Date(d),
    );
}
</script>

<template>
    <div>
        <Button variant="ghost" size="sm" as-child class="mb-4">
            <Link href="/admin/usuarios">
                <ArrowLeft class="mr-1 size-4" />
                Volver a usuarios
            </Link>
        </Button>

        <Card>
            <CardHeader>
                <div class="flex items-start justify-between">
                    <div>
                        <CardTitle class="text-2xl">{{ user.name }}</CardTitle>
                        <CardDescription>{{ user.email }}</CardDescription>
                    </div>
                    <Badge
                        variant="outline"
                        :class="
                            user.email_verified_at
                                ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400'
                                : 'border-muted-foreground/20 text-muted-foreground'
                        "
                    >
                        <MailCheck
                            v-if="user.email_verified_at"
                            class="mr-1 size-3"
                        />
                        <MailX v-else class="mr-1 size-3" />
                        {{
                            user.email_verified_at
                                ? 'Verificado'
                                : 'No verificado'
                        }}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div
                    class="flex flex-wrap items-center gap-4 text-sm text-muted-foreground"
                >
                    <span>Registrado: {{ formatDate(user.created_at) }}</span>
                    <span>·</span>
                    <div class="flex items-center gap-2">
                        <Badge
                            v-if="user.is_super_admin"
                            variant="default"
                            class="bg-amber-600"
                        >
                            <ShieldCheck class="mr-1 size-3" />
                            Super Admin
                        </Badge>
                        <Badge v-else variant="secondary">
                            <ShieldX class="mr-1 size-3" />
                            Usuario
                        </Badge>
                        <Button
                            variant="outline"
                            size="sm"
                            @click="toggleSuperAdmin"
                        >
                            {{
                                form.is_super_admin
                                    ? 'Remover Admin'
                                    : 'Hacer Admin'
                            }}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>

        <div class="mt-8 grid gap-4 sm:grid-cols-3">
            <Card>
                <CardHeader class="pb-2 text-center">
                    <CardTitle class="text-3xl">{{
                        user.adoptions_count
                    }}</CardTitle>
                    <CardDescription>Adopciones</CardDescription>
                </CardHeader>
                <CardContent class="flex justify-center pb-4">
                    <Handshake class="size-5 text-muted-foreground/60" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader class="pb-2 text-center">
                    <CardTitle class="text-3xl">{{
                        user.memberships.length
                    }}</CardTitle>
                    <CardDescription>Equipos</CardDescription>
                </CardHeader>
                <CardContent class="flex justify-center pb-4">
                    <Building2 class="size-5 text-muted-foreground/60" />
                </CardContent>
            </Card>
        </div>

        <div class="mt-8">
            <h2 class="text-lg font-semibold text-foreground">Membresías</h2>
            <div
                v-if="user.memberships.length === 0"
                class="mt-3 text-sm text-muted-foreground/70"
            >
                Sin membresías.
            </div>
            <Card v-else class="mt-3">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Organización</TableHead>
                            <TableHead>Rol</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="m in user.memberships" :key="m.id">
                            <TableCell class="font-medium">{{
                                m.team.name
                            }}</TableCell>
                            <TableCell>
                                <Badge variant="secondary">{{ m.role }}</Badge>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Card>
        </div>
    </div>
</template>
