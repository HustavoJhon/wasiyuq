<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const props = withDefaults(
    defineProps<{
        data: { label: string; value: number; color?: string }[];
        size?: number;
        innerRadius?: number;
        formatValue?: (v: number) => string;
    }>(),
    { size: 200, innerRadius: 60 },
);

const animated = ref(false);
const hovered = ref<number | null>(null);

onMounted(() => {
    requestAnimationFrame(() => {
        animated.value = true;
    });
});

const total = computed(() => props.data.reduce((s, d) => s + Number(d.value), 0) || 1);
const cx = computed(() => props.size / 2);
const cy = computed(() => props.size / 2);
const outerR = computed(() => props.size / 2 - 10);

const fallbackColors = [
    '#2D6A4F', '#0EA5E9', '#F59E0B', '#EF4444',
    '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
];

function sliceColor(i: number): string {
    return props.data[i]?.color || fallbackColors[i % fallbackColors.length];
}

function polarToCartesian(
    cx: number,
    cy: number,
    r: number,
    angleDeg: number,
): { x: number; y: number } {
    const rad = ((angleDeg - 90) * Math.PI) / 180;

    return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad),
    };
}

function describeArc(startAngle: number, endAngle: number): string {
    const outerStart = polarToCartesian(cx.value, cy.value, outerR.value, startAngle);
    const outerEnd = polarToCartesian(cx.value, cy.value, outerR.value, endAngle);
    const innerStart = polarToCartesian(cx.value, cy.value, props.innerRadius, startAngle);
    const innerEnd = polarToCartesian(cx.value, cy.value, props.innerRadius, endAngle);
    const isLarge = endAngle - startAngle > 180 ? '1' : '0';

    return [
        `M ${outerStart.x} ${outerStart.y}`,
        `A ${outerR.value} ${outerR.value} 0 ${isLarge} 1 ${outerEnd.x} ${outerEnd.y}`,
        `L ${innerEnd.x} ${innerEnd.y}`,
        `A ${props.innerRadius} ${props.innerRadius} 0 ${isLarge} 0 ${innerStart.x} ${innerStart.y}`,
        'Z',
    ].join(' ');
}

const slices = computed(() => {
    let currentAngle = 0;

    return props.data.map((d, i) => {
        const angle = (Number(d.value) / total.value) * 360;
        const slice = {
            label: d.label,
            value: d.value,
            color: sliceColor(i),
            path: describeArc(currentAngle, currentAngle + angle),
            percent: ((Number(d.value) / total.value) * 100).toFixed(1),
        };
        currentAngle += angle;

        return slice;
    });
});
</script>

<template>
    <div class="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
        <div class="relative shrink-0" :style="{ width: `${size}px`, height: `${size}px` }">
            <svg
                :viewBox="`0 0 ${size} ${size}`"
                class="h-full w-full select-none"
            >
                <g
                    v-for="(slice, i) in slices"
                    :key="i"
                    @mouseenter="hovered = i"
                    @mouseleave="hovered = null"
                >
                    <path
                        :d="slice.path"
                        :fill="slice.color"
                        class="cursor-pointer transition-all duration-700 ease-out"
                        :class="[
                            animated ? 'opacity-100' : 'opacity-0',
                            hovered === i ? 'drop-shadow-lg brightness-110' : '',
                        ]"
                        :style="{
                            transformOrigin: `${cx}px ${cy}px`,
                            transitionDelay: `${i * 60}ms`,
                        }"
                    />
                </g>

                <circle
                    :cx="cx" :cy="cy"
                    :r="innerRadius - 2"
                    class="fill-card"
                />
                <text
                    :x="cx" :y="cy - 6"
                    class="fill-foreground text-lg font-bold"
                    text-anchor="middle"
                    dominant-baseline="central"
                >{{ total }}</text>
                <text
                    :x="cx" :y="cy + 12"
                    class="fill-muted-foreground/60 text-[10px]"
                    text-anchor="middle"
                    dominant-baseline="central"
                >Total</text>
            </svg>
        </div>

        <div class="space-y-2.5">
            <div
                v-for="(slice, i) in slices"
                :key="i"
                class="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-1.5 transition-colors"
                :class="hovered === i ? 'bg-accent' : ''"
                @mouseenter="hovered = i"
                @mouseleave="hovered = null"
            >
                <span
                    class="h-3.5 w-3.5 rounded shrink-0"
                    :style="{ backgroundColor: slice.color }"
                />
                <span class="text-sm text-muted-foreground">{{ slice.label }}</span>
                <span class="ml-auto text-sm font-semibold text-foreground">{{ slice.value }}</span>
                <span class="text-xs text-muted-foreground/50">({{ slice.percent }}%)</span>
            </div>
        </div>
    </div>
</template>
