<script setup lang="ts">
import {computed, useSlots} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import {PROGRESS_BAR_DEFAULT, PROGRESS_BAR_STATE_CLASS} from '~/components/ProgressBar/ProgressBar.constant'
import type {ProgressBarProps} from '~/components/ProgressBar/ProgressBar.type'
import styles from '~/components/ProgressBar/ProgressBar.module.scss'
const cap = (s: string) => s.replace(/(?:^|-)([a-z])/g, (m: string) => m.slice(-1).toUpperCase())

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<ProgressBarProps>(), {
  modelValue: PROGRESS_BAR_DEFAULT.VALUE,
  showValue: false,
  color: PROGRESS_BAR_DEFAULT.COLOR,
  thickness: PROGRESS_BAR_DEFAULT.THICKNESS,
  animated: false
})

const slots = useSlots()
const clamped = computed(() => Math.max(0, Math.min(100, props.modelValue)))
const hasLabel = computed(() => props.label != null || Boolean(slots.default))
const showHead = computed(() => hasLabel.value || props.showValue)

const rootClass = computed(() =>
  cx(
    styles.bsProgressBar,
    styles[`bsProgressBarColor${cap(props.color)}`],
    styles[`bsProgressBarThickness${cap(props.thickness)}`],
    resolveClassNames(props.classNames)
  )
)
</script>

<template>
  <div v-bind="$attrs" :class="rootClass">
    <div v-if="showHead" :class="styles.bsProgressBarHead">
      <span v-if="hasLabel" :class="styles.bsProgressBarLabel"
        ><slot>{{ props.label }}</slot></span
      >
      <span v-if="props.showValue" :class="styles.bsProgressBarValue">{{ Math.round(clamped) }}%</span>
    </div>
    <div
      :class="styles.bsProgressBarTrack"
      role="progressbar"
      :aria-valuenow="Math.round(clamped)"
      :aria-valuemin="0"
      :aria-valuemax="100"
    >
      <div
        :class="cx(styles.bsProgressBarFill, props.animated && styles[PROGRESS_BAR_STATE_CLASS.IS_ANIMATED])"
        :style="{width: `${clamped}%`}"
      />
    </div>
  </div>
</template>
