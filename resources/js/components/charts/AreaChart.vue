<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        data: { label: string; value: number }[];
        height?: number;
        color?: string;
        showGrid?: boolean;
        formatValue?: (v: number) => string;
    }>(),
    {
        height: 200,
        color: '#2D6A4F',
        showGrid: true,
    },
);

const padding = { top: 20, right: 20, bottom: 30, left: 40 };
const innerWidth = computed(() => 600 - padding.left - padding.right);
const innerHeight = computed(() => props.height - padding.top - padding.bottom);

const maxVal = computed(() => Math.max(...props.data.map((d) => d.value), 1));

function xPos(i: number): number {
    return (
        padding.left +
        (i / Math.max(props.data.length - 1, 1)) * innerWidth.value
    );
}

function yPos(val: number): number {
    return (
        padding.top +
        innerHeight.value -
        (val / maxVal.value) * innerHeight.value
    );
}

const pointsAttr = computed(() => {
    return props.data.map((d, i) => `${xPos(i)},${yPos(d.value)}`).join(' ');
});

const areaPath = computed(() => {
    if (props.data.length === 0) {
        return '';
    }

    const start = `M${xPos(0)},${yPos(0)}`;
    const line = props.data
        .map((d, i) => `L${xPos(i)},${yPos(d.value)}`)
        .join(' ');
    const end = `L${xPos(props.data.length - 1)},${padding.top + innerHeight.value} L${xPos(0)},${padding.top + innerHeight.value} Z`;

    return `${start} ${line} ${end}`;
});

const gridLines = computed(() => {
    if (!props.showGrid) {
        return [];
    }

    const lines: { y: number; label: string }[] = [];
    const steps = 4;

    for (let i = 0; i <= steps; i++) {
        const y = padding.top + (i / steps) * innerHeight.value;
        const val = maxVal.value - (i / steps) * maxVal.value;
        lines.push({
            y,
            label: props.formatValue
                ? props.formatValue(Math.round(val))
                : Math.round(val).toString(),
        });
    }

    return lines;
});
</script>

<template>
    <svg
        viewBox="0 0 600 200"
        class="w-full"
        :style="{ height: `${height}px` }"
        preserveAspectRatio="none"
    >
        <defs>
            <linearGradient :id="`area-gradient`" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" :stop-color="color" stop-opacity="0.15" />
                <stop offset="100%" :stop-color="color" stop-opacity="0.01" />
            </linearGradient>
        </defs>

        <line
            v-for="g in gridLines"
            :key="g.y"
            :x1="padding.left"
            :x2="600 - padding.right"
            :y1="g.y"
            :y2="g.y"
            class="stroke-border/50"
            stroke-width="1"
        />
        <text
            v-for="g in gridLines"
            :key="'l' + g.y"
            :x="padding.left - 8"
            :y="g.y + 4"
            class="fill-muted-foreground/60 text-[11px]"
            text-anchor="end"
        >
            {{ g.label }}
        </text>

        <path :d="areaPath" :fill="`url(#area-gradient)`" />

        <polyline
            :points="pointsAttr"
            fill="none"
            :stroke="color"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        />

        <circle
            v-for="(d, i) in data"
            :key="i"
            :cx="xPos(i)"
            :cy="yPos(d.value)"
            r="3"
            :fill="color"
            class="drop-shadow-sm"
        />

        <text
            v-for="(d, i) in data"
            :key="'x' + i"
            :x="xPos(i)"
            :y="padding.top + innerHeight + 18"
            class="fill-muted-foreground/60 text-[11px]"
            text-anchor="middle"
        >
            {{ d.label }}
        </text>
    </svg>
</template>
