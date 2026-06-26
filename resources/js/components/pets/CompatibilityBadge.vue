<script setup lang="ts">
interface Props {
    score: number | null;
    size?: 'sm' | 'md';
}

const props = withDefaults(defineProps<Props>(), { size: 'md' });

function colorClass(): string {
    if (props.score === null) return 'bg-gray-100 text-gray-500 border-gray-200';
    if (props.score >= 80) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (props.score >= 50) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-red-100 text-red-700 border-red-200';
}

function label(): string {
    if (props.score === null) return 'Nuevo';
    return `${props.score}%`;
}
</script>

<template>
    <span
        class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold"
        :class="[colorClass(), size === 'sm' ? 'text-[10px] px-1.5 py-px' : '']"
    >
        <svg v-if="score !== null" class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        {{ label() }}
    </span>
</template>
