<script setup lang="ts">
import { Form, Head, usePage } from '@inertiajs/vue3';
import { Link } from '@inertiajs/vue3';
import { computed } from 'vue';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/DeleteUser.vue';
import InputError from '@/components/InputError.vue';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Profile settings',
                href: edit(),
            },
        ],
    },
});

const page = usePage();
const user = computed(() => page.props.auth.user);

const initials = computed(() => {
    if (!user.value?.name) {
return '?';
}

    return user.value.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
});
</script>

<template>
    <Head title="Profile settings" />

    <h1 class="sr-only">Profile settings</h1>

    <div class="space-y-6">
        <Card>
            <CardHeader>
                <div class="flex items-center gap-4">
                    <Avatar class="size-14">
                        <AvatarFallback class="text-lg font-semibold">{{ initials }}</AvatarFallback>
                    </Avatar>
                    <div class="space-y-0.5">
                        <CardTitle class="text-xl">{{ user.name }}</CardTitle>
                        <CardDescription>{{ user.email }}</CardDescription>
                    </div>
                </div>
            </CardHeader>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Update your name and email address</CardDescription>
            </CardHeader>
            <CardContent>
                <Form
                    v-bind="ProfileController.update.form()"
                    class="space-y-6"
                    v-slot="{ errors, processing }"
                >
                    <div class="grid gap-2">
                        <Label for="name">Name</Label>
                        <Input
                            id="name"
                            class="mt-1 block w-full"
                            name="name"
                            :default-value="user.name"
                            required
                            autocomplete="name"
                            placeholder="Full name"
                        />
                        <InputError class="mt-2" :message="errors.name" />
                    </div>

                    <div class="grid gap-2">
                        <Label for="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            class="mt-1 block w-full"
                            name="email"
                            :default-value="user.email"
                            required
                            autocomplete="username"
                            placeholder="Email address"
                        />
                        <InputError class="mt-2" :message="errors.email" />
                    </div>

                    <div class="grid gap-2">
                        <Label for="whatsapp">WhatsApp</Label>
                        <Input
                            id="whatsapp"
                            type="tel"
                            class="mt-1 block w-full"
                            name="whatsapp"
                            :default-value="user.whatsapp"
                            autocomplete="tel"
                            placeholder="+51 900 000 000"
                        />
                        <p class="text-[11px] text-muted-foreground">Para que las organizaciones te contacten mas facil.</p>
                        <InputError class="mt-2" :message="errors.whatsapp" />
                    </div>

                    <div v-if="page.props.mustVerifyEmail && !user.email_verified_at">
                        <div
                            class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800/30 dark:bg-amber-900/20 dark:text-amber-200"
                        >
                            <p class="font-medium">Email not verified</p>
                            <p class="mt-1">
                                Your email address is unverified.
                                <Link
                                    :href="send()"
                                    as="button"
                                    class="font-medium underline underline-offset-4 transition-colors hover:text-amber-600 dark:hover:text-amber-300"
                                >
                                    Click here to re-send the verification email.
                                </Link>
                            </p>
                        </div>

                        <div
                            v-if="page.props.status === 'verification-link-sent'"
                            class="mt-3 text-sm font-medium text-green-600 dark:text-green-400"
                        >
                            A new verification link has been sent to your email address.
                        </div>
                    </div>

                    <div class="flex items-center gap-4">
                        <Button :disabled="processing" data-test="update-profile-button">
                            Save
                        </Button>
                    </div>
                </Form>
            </CardContent>
        </Card>

        <Separator />

        <DeleteUser />
    </div>
</template>
