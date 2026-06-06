<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const props = withDefaults(
    defineProps<{
        data: { label: string; value: number }[];
        height?: number;
        color?: string;
        showGrid?: boolean;
        formatValue?: (v: number) => string;
    }>(),
    {
        height: 220,
        color: '#2D6A4F',
        showGrid: true,
    },
);

const animated = ref(false);
const hovered = ref<number | null>(null);

onMounted(() => {
    requestAnimationFrame(() => {
        animated.value = true;
    });
});

const padding = { top: 20, right: 20, bottom: 30, left: 45 };
const width = 600;
const innerWidth = computed(() => width - padding.left - padding.right);
const innerHeight = computed(() => props.height - padding.top - padding.bottom);
const maxVal = computed(() => Math.max(...props.data.map((d) => d.value), 1));

function xPos(i: number): number {
    return padding.left + (i / Math.max(props.data.length - 1, 1)) * innerWidth.value;
}

function yPos(val: number): number {
    return padding.top + innerHeight.value - (val / maxVal.value) * innerHeight.value;
}

const linePoints = computed(() => {
    return props.data.map((d, i) => `${xPos(i)},${yPos(d.value)}`).join(' ');
});

const areaPath = computed(() => {
    if (props.data.length === 0) return '';
    const first = props.data[0];
    const last = props.data[props.data.length - 1];
    let d = `M${xPos(0)},${yPos(first.value)}`;
    for (let i = 1; i < props.data.length; i++) {
        d += ` L${xPos(i)},${yPos(props.data[i].value)}`;
    }
    d += ` L${xPos(props.data.length - 1)},${padding.top + innerHeight.value}`;
    d += ` L${xPos(0)},${padding.top + innerHeight.value} Z`;
    return d;
});

const lineLength = ref(0);

function setLineLength(el: SVGPathElement | null) {
    if (el) lineLength.value = el.getTotalLength();
}

const gridLines = computed(() => {
    const lines: { y: number; label: string }[] = [];
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
        const y = padding.top + (i / steps) * innerHeight.value;
        const val = maxVal.value - (i / steps) * maxVal.value;
        lines.push({
            y,
            label: props.formatValue ? props.formatValue(Math.round(val)) : Math.round(val).toString(),
        });
    }
    return lines;
});
</script>

<template>
    <div class="relative">
        <svg
            :viewBox="`0 0 ${width} ${height}`"
            class="w-full select-none"
            :style="{ height: `${height}px` }"
            preserveAspectRatio="none"
        >
            <defs>
                <linearGradient :id="`area-grad`" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" :stop-color="color" stop-opacity="0.18" />
                    <stop offset="100%" :stop-color="color" stop-opacity="0.02" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <line
                v-for="g in gridLines"
                :key="g.y"
                :x1="padding.left"
                :x2="width - padding.right"
                :y1="g.y"
                :y2="g.y"
                class="stroke-border/30 dark:stroke-border/20"
                stroke-width="1"
                stroke-dasharray="4 4"
            />
            <text
                v-for="g in gridLines"
                :key="'l' + g.y"
                :x="padding.left - 10"
                :y="g.y + 4"
                class="fill-muted-foreground/50 text-[11px] font-medium"
                text-anchor="end"
            >{{ g.label }}</text>

            <path
                :d="areaPath"
                :fill="`url(#area-grad)`"
                class="transition-opacity duration-700"
                :class="animated ? 'opacity-100' : 'opacity-0'"
            />

            <path
                :ref="setLineLength"
                :d="`M${linePoints}`"
                fill="none"
                :stroke="color"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="transition-all duration-1000 ease-out"
                :class="animated ? 'opacity-100' : 'opacity-0'"
                :style="animated ? {} : { strokeDasharray: '0', strokeDashoffset: '0' }"
            />

            <g
                v-for="(d, i) in data"
                :key="i"
                class="transition-all duration-300"
                :class="animated ? 'opacity-100' : 'opacity-0'"
                :style="{ transitionDelay: `${i * 40}ms` }"
                @mouseenter="hovered = i"
                @mouseleave="hovered = null"
            >
                <circle
                    :cx="xPos(i)"
                    :cy="yPos(d.value)"
                    :r="hovered === i ? 6 : 4"
                    :fill="color"
                    class="cursor-pointer transition-all duration-200"
                    :class="hovered === i ? 'drop-shadow-md' : ''"
                    filter="url(#glow)"
                />
                <circle
                    :cx="xPos(i)"
                    :cy="yPos(d.value)"
                    :r="hovered === i ? 10 : 0"
                    :fill="color"
                    class="cursor-pointer transition-all duration-200"
                    fill-opacity="0.15"
                />
            </g>

            <text
                v-for="(d, i) in data"
                :key="'x' + i"
                :x="xPos(i)"
                :y="padding.top + innerHeight + 20"
                class="fill-muted-foreground/50 text-[10px]"
                text-anchor="middle"
            >{{ d.label }}</text>
        </svg>

        <div
            v-if="hovered !== null && data[hovered]"
            class="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-[#2D6A4F]/20 bg-white px-3 py-1.5 text-center shadow-lg dark:border-[#2D6A4F]/40 dark:bg-[#1a2e24]"
            :style="{
                left: `${(xPos(hovered) / width) * 100}%`,
                top: `${(yPos(data[hovered].value) / height) * 100 - 10}%`,
            }"
        >
            <p class="text-xs font-bold text-[#2D6A4F] dark:text-emerald-400">{{ data[hovered].label }}</p>
            <p class="text-xs text-muted-foreground">{{ data[hovered].value }} adopciones</p>
        </div>
    </div>
</template>
