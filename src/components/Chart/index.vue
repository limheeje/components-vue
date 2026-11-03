<script setup lang="ts">
import {computed} from 'vue'
import {
  VisArea,
  VisAxis,
  VisBulletLegend,
  VisCrosshair,
  VisDonut,
  VisDonutSelectors,
  VisGroupedBar,
  VisLine,
  VisScatter,
  VisSingleContainer,
  VisStackedBar,
  VisTooltip,
  VisXYContainer
} from '@unovis/vue'

import {cx, resolveClassNames} from '~/lib/cx'

import {CHART_DEFAULT, CHART_PALETTE, CHART_TYPE} from '~/components/Chart/Chart.constant'
import type {ChartDatum, ChartProps} from '~/components/Chart/Chart.type'
import styles from '~/components/Chart/Chart.module.scss'

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<ChartProps>(), {
  type: CHART_DEFAULT.TYPE,
  height: CHART_DEFAULT.HEIGHT,
  showGrid: true,
  showAxis: true,
  showLegend: true,
  showTooltip: true,
  stacked: false,
  layout: 'horizontal'
})

/** bar 수평 방향 여부 */
const isVerticalBars = computed(() => props.layout === 'vertical')

const num = (v: unknown) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

const palette = computed(() => props.colors ?? (CHART_PALETTE as string[]))

const norm = computed(() =>
  props.series.map((s, i) => {
    const base = typeof s === 'string' ? {key: s} : s
    return {
      key: base.key,
      label: base.label ?? base.key,
      color: base.color ?? palette.value[i % palette.value.length],
      type: typeof s === 'string' ? undefined : s.type,
      dashed: typeof s === 'string' ? undefined : s.dashed
    }
  })
)

const isPie = computed(() => props.type === CHART_TYPE.PIE || props.type === CHART_TYPE.DONUT)
const isRadar = computed(() => props.type === CHART_TYPE.RADAR)
const isScatter = computed(() => props.type === CHART_TYPE.SCATTER)
const isXY = computed(() => !isPie.value && !isRadar.value && !isScatter.value)

const labels = computed(() => props.data.map((d) => String(d[props.xKey] ?? '')))
const xIdx = (_d: ChartDatum, i: number) => i
const xTickFormat = (t: number) => labels.value[Math.round(t)] ?? ''
const yDomain = computed<[number, number] | undefined>(() => (props.maxValue != null ? [0, props.maxValue] : undefined))

const margin = computed(() =>
  props.showAxis ? {top: 12, right: 20, bottom: 28, left: 48} : {top: 8, right: 8, bottom: 8, left: 8}
)

// ── composed 계열 분해 ──
const lineSeries = computed(() =>
  norm.value.filter((s) => (s.type ?? (props.type === 'line' ? 'line' : undefined)) === 'line')
)
const areaSeries = computed(() =>
  norm.value.filter((s) => (s.type ?? (props.type === 'area' ? 'area' : undefined)) === 'area')
)
const barSeries = computed(() =>
  norm.value.filter((s) => (s.type ?? (props.type === 'bar' ? 'bar' : undefined)) === 'bar')
)

const barY = computed(() => barSeries.value.map((s) => (d: ChartDatum) => num(d[s.key])))
const barColor = (_d: ChartDatum, i: number) => barSeries.value[i]?.color ?? palette.value[i]

// ── 범례 ──
const legendItems = computed(() => {
  if (isPie.value) {
    return props.data.map((d, i) => ({
      name: String(d[props.xKey] ?? ''),
      color: palette.value[i % palette.value.length]
    }))
  }
  return norm.value.map((s) => ({name: s.label, color: s.color}))
})

// ── 툴팁 ──
const fmt = (v: number) => (props.valueFormatter ? props.valueFormatter(v) : String(v))
const crosshairTemplate = (d: ChartDatum) => {
  const rows = norm.value
    .map(
      (s) =>
        `<div style="display:flex;gap:8px;justify-content:space-between"><span style="color:${s.color}">${s.label}</span><b>${fmt(num(d[s.key]))}</b></div>`
    )
    .join('')
  return `<div style="font-size:12px"><div style="color:var(--m2m-pg-comp-text-muted);margin-bottom:4px">${d[props.xKey] ?? ''}</div>${rows}</div>`
}
const donutTriggers = computed(() => ({
  [VisDonutSelectors.segment]: (d: {data: ChartDatum}) =>
    `<div style="font-size:12px"><b>${d.data[props.xKey] ?? ''}</b>: ${fmt(num(d.data[donutKey.value]))}</div>`
}))

// ── pie/donut ──
const donutKey = computed(() => norm.value[0]?.key ?? 'value')
const donutValue = (d: ChartDatum) => num(d[donutKey.value])
const donutColor = (_d: ChartDatum, i: number) => palette.value[i % palette.value.length]

// ── radar (unovis 미지원 → 자체 SVG) ──
const radar = computed(() => {
  const n = props.data.length
  if (n === 0) return null
  const size = props.height
  const cx0 = size / 2
  const cy0 = size / 2
  const R = size * 0.36
  const maxV = props.maxValue ?? Math.max(1, ...props.data.flatMap((d) => norm.value.map((s) => num(d[s.key]))))
  const angle = (i: number) => -Math.PI / 2 + (i / n) * Math.PI * 2
  const pt = (i: number, r: number) => [cx0 + Math.cos(angle(i)) * r, cy0 + Math.sin(angle(i)) * r] as const

  const rings = [0.25, 0.5, 0.75, 1].map((f) => props.data.map((_, i) => pt(i, R * f).join(',')).join(' '))
  const spokes = props.data.map((_, i) => pt(i, R))
  const axisLabels = props.data.map((d, i) => {
    const [x, y] = pt(i, R + 16)
    return {x, y, text: String(d[props.xKey] ?? '')}
  })
  const polys = norm.value.map((s) => ({
    color: s.color,
    label: s.label,
    points: props.data.map((d, i) => pt(i, (num(d[s.key]) / maxV) * R).join(',')).join(' ')
  }))
  return {size, cx0, cy0, R, rings, spokes, axisLabels, polys}
})

const rootClass = computed(() => cx(styles.bsChart, resolveClassNames(props.classNames)))
</script>

<template>
  <div v-bind="$attrs" :class="rootClass">
    <!-- ── XY: line / area / bar / composed ── -->
    <VisXYContainer
      v-if="isXY"
      :data="data"
      :height="height"
      :margin="margin"
      :y-domain="yDomain"
      :x-domain="[0, Math.max(0, data.length - 1)]"
    >
      <VisStackedBar
        v-if="stacked && barSeries.length"
        :x="xIdx"
        :y="barY"
        :color="barColor"
        :orientation="isVerticalBars ? 'horizontal' : 'vertical'"
        :rounded-corners="6"
        :bar-max-width="isVerticalBars ? 28 : 44"
        :bar-padding="0.25"
      />
      <VisGroupedBar
        v-else-if="barSeries.length"
        :x="xIdx"
        :y="barY"
        :color="barColor"
        :orientation="isVerticalBars ? 'horizontal' : 'vertical'"
        :rounded-corners="6"
        :bar-max-width="isVerticalBars ? 28 : barSeries.length > 1 ? 24 : 44"
        :bar-padding="0.1"
        :group-padding="0.25"
      />

      <VisArea
        v-for="s in areaSeries"
        :key="`a-${s.key}`"
        :x="xIdx"
        :y="(d: ChartDatum) => num(d[s.key])"
        :color="s.color"
        :opacity="0.22"
      />

      <template v-for="s in lineSeries" :key="`l-${s.key}`">
        <VisLine
          :x="xIdx"
          :y="(d: ChartDatum) => num(d[s.key])"
          :color="s.color"
          :line-width="2"
          :line-dash-array="s.dashed ? [5, 3] : undefined"
        />
        <VisScatter :x="xIdx" :y="(d: ChartDatum) => num(d[s.key])" :color="s.color" :size="7" />
      </template>

      <VisLine
        v-for="(r, i) in referenceLines ?? []"
        :key="`ref-${i}`"
        :x="xIdx"
        :y="() => r.value"
        :color="r.color ?? 'var(--m2m-pg-comp-text-muted)'"
        :line-width="1"
        :line-dash-array="[4, 4]"
      />

      <VisAxis v-if="showAxis" type="x" :tick-format="xTickFormat" :num-ticks="data.length" :grid-line="false" />
      <VisAxis v-if="showAxis" type="y" :tick-format="valueFormatter" :grid-line="showGrid" />
      <VisCrosshair v-if="showTooltip" :template="crosshairTemplate" />
      <VisTooltip v-if="showTooltip" />
    </VisXYContainer>

    <!-- ── scatter ── -->
    <VisXYContainer v-else-if="isScatter" :data="data" :height="height" :margin="margin" :y-domain="yDomain">
      <VisScatter
        :x="(d: ChartDatum) => num(d[xKey])"
        :y="(d: ChartDatum) => num(d[norm[0]?.key ?? 'y'])"
        :color="norm[0]?.color"
        :size="10"
      />
      <template v-if="showAxis">
        <VisAxis type="x" :tick-format="valueFormatter" :grid-line="showGrid" />
        <VisAxis type="y" :tick-format="valueFormatter" :grid-line="showGrid" />
      </template>
      <VisTooltip v-if="showTooltip" />
    </VisXYContainer>

    <!-- ── pie / donut ── -->
    <VisSingleContainer v-else-if="isPie" :data="data" :height="height">
      <VisDonut
        :value="donutValue"
        :color="donutColor"
        :arc-width="type === CHART_TYPE.DONUT ? 46 : 0"
        :pad-angle="type === CHART_TYPE.DONUT ? 0.02 : 0"
        :corner-radius="0"
      />
      <VisTooltip v-if="showTooltip" :triggers="donutTriggers" />
    </VisSingleContainer>

    <!-- ── radar (자체 SVG) ── -->
    <svg
      v-else-if="isRadar && radar"
      :class="styles.bsChartRadar"
      :viewBox="`0 0 ${radar.size} ${radar.size}`"
      :width="radar.size"
      :height="radar.size"
    >
      <polygon
        v-for="(ring, i) in radar.rings"
        :key="`ring-${i}`"
        :points="ring"
        fill="none"
        stroke="var(--m2m-pg-comp-border)"
      />
      <line
        v-for="(sp, i) in radar.spokes"
        :key="`sp-${i}`"
        :x1="radar.cx0"
        :y1="radar.cy0"
        :x2="sp[0]"
        :y2="sp[1]"
        stroke="var(--m2m-pg-comp-border)"
      />
      <polygon
        v-for="p in radar.polys"
        :key="`poly-${p.label}`"
        :points="p.points"
        :fill="p.color"
        fill-opacity="0.18"
        :stroke="p.color"
        stroke-width="2"
      />
      <text
        v-for="(al, i) in radar.axisLabels"
        :key="`al-${i}`"
        :x="al.x"
        :y="al.y"
        text-anchor="middle"
        dominant-baseline="middle"
        font-size="11"
        fill="var(--m2m-pg-comp-text-muted)"
      >
        {{ al.text }}
      </text>
    </svg>

    <VisBulletLegend v-if="showLegend" :items="legendItems" :class="styles.bsChartLegend" />
  </div>
</template>
