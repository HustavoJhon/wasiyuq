<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const props = withDefaults(
    defineProps<{
        data: { label: string; value: number; color?: string }[];
        height?: number;
        formatValue?: (v: number) => string;
    }>(),
    { height: 200 },
);

const animated = ref(false);
const hovered = ref<number | null>(null);

onMounted(() => {
    requestAnimationFrame(() => {
        animated.value = true;
    });
});

const maxVal = computed(() => Math.max(...props.data.map((d) => d.value), 1));
const barCount = computed(() => props.data.length);
const barWidth = computed(() => Math.min(50, (600 - 60) / barCount.value - 8));
const gap = computed(() => Math.max(4, (600 - 60) / barCount.value - barWidth.value));

const barColors = [
    '#2D6A4F', '#3D8B6F', '#52B788', '#74C69D', '#95D5B2',
    '#B7E4C7', '#40916C', '#1B4332', '#2D6A4F', '#52B788',
];

function barColor(i: number): string {
    return props.data[i]?.color || barColors[i % barColors.length];
}

function barHeight(val: number): number {
    return (val / maxVal.value) * (props.height - 40);
}

function barX(i: number): number {
    return 30 + (i * (barWidth.value + gap.value)) + gap.value / 2;
}

function barY(val: number): number {
    return props.height - 20 - barHeight(val);
}
</script>

<template>
    <div class="relative">
        <svg
            viewBox="0 0 600 200"
            class="w-full select-none"
            :style="{ height: `${height}px` }"
            preserveAspectRatio="none"
        >
            <line
                x1="28" x2="590" :y1="height - 20" :y2="height - 20"
                class="stroke-border/40"
                stroke-width="1"
            />

            <g
                v-for="(d, i) in data"
                :key="i"
                @mouseenter="hovered = i"
                @mouseleave="hovered = null"
            >
                <rect
                    :x="barX(i)"
                    :y="barY(d.value)"
                    :width="barWidth"
                    :height="barHeight(d.value)"
                    :rx="4"
                    :ry="4"
                    :fill="barColor(i)"
                    class="cursor-pointer transition-all duration-700 ease-out"
                    :class="[
                        animated ? 'opacity-100' : 'opacity-0',
                        hovered === i ? 'drop-shadow-md brightness-110' : 'brightness-100',
                    ]"
                    :style="animated ? {} : { height: '0', y: height - 20 }"
                />

                <rect
                    :x="barX(i) - 2"
                    :y="barY(d.value) - 2"
                    :width="barWidth + 4"
                    :height="barHeight(d.value) + 4"
                    :rx="6"
                    :ry="6"
                    :fill="barColor(i)"
                    class="cursor-pointer transition-all duration-200"
                    :class="hovered === i ? 'opacity-20' : 'opacity-0'"
                />

                <text
                    :x="barX(i) + barWidth / 2"
                    :y="height - 5"
                    class="fill-muted-foreground/50 text-[9px]"
                    text-anchor="middle"
                >{{ d.label }}</text>

                <text
                    v-if="hovered === i || barHeight(d.value) > 20"
                    :x="barX(i) + barWidth / 2"
                    :y="barY(d.value) - 6"
                    class="fill-muted-foreground/70 text-[10px] font-semibold"
                    text-anchor="middle"
                >{{ formatValue ? formatValue(d.value) : d.value }}</text>
            </g>
        </svg>

        <div
            v-if="hovered !== null && data[hovered]"
            class="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-white px-3 py-1.5 text-center shadow-lg dark:bg-[#1a2e24] dark:border-[#2D6A4F]/30"
            :style="{
                left: `${(barX(hovered) / 600) * 100 + (barWidth / 600) * 50}%`,
                top: `${(barY(data[hovered].value) / height) * 100 - 8}%`,
            }"
        >
            <p class="text-xs font-bold text-foreground">{{ data[hovered].label }}</p>
            <p class="text-xs text-muted-foreground">{{ formatValue ? formatValue(data[hovered].value) : data[hovered].value }}</p>
        </div>
    </div>
</template>
