<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import AuthSplitLayout from '@/layouts/auth/AuthSplitLayout.vue';

const page = usePage();

const pageTitle = computed(() => {
    const pg = page.props as Record<string, unknown>;

    return (pg.pageTitle as string) || '';
});

const pageDescription = computed(() => {
    const pg = page.props as Record<string, unknown>;

    return (pg.pageDescription as string) || '';
});
</script>

<template>
    <AuthSplitLayout :title="pageTitle" :description="pageDescription">
        <slot />
    </AuthSplitLayout>
</template>
