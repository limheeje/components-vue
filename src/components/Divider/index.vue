<script setup lang="ts">
import {computed, getCurrentInstance, useSlots} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import {
  DIVIDER_DEFAULT,
  DIVIDER_DIRECTION,
  DIVIDER_LABEL_ALIGN,
  DIVIDER_STATE_CLASS
} from '~/components/Divider/Divider.constant'
import type {DividerProps} from '~/components/Divider/Divider.type'
import styles from '~/components/Divider/Divider.module.scss'

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<DividerProps>(), {
  direction: DIVIDER_DEFAULT.DIRECTION,
  thickness: DIVIDER_DEFAULT.THICKNESS,
  labelAlign: DIVIDER_DEFAULT.LABEL_ALIGN,
  dashed: false
})

const slots = useSlots()

// Vue Boolean prop 은 미전달 시 false → 실제 전달 여부는 vnode.props 로 판별
const vm = getCurrentInstance()
const decorativeSet = computed(() => {
  const p = vm?.vnode.props
  return p != null && ('decorative' in p || 'is-decorative' in p)
})

const isVertical = computed(() => props.direction === DIVIDER_DIRECTION.VERTICAL)
const hasLabel = computed(() => !isVertical.value && (props.label != null || Boolean(slots.default)))
const isDecorative = computed(() => (decorativeSet.value ? props.decorative : !hasLabel.value))

const cssVars = computed(() => ({
  '--divider-color': props.color ?? 'var(--m2m-pg-comp-border)',
  '--divider-thickness': `${props.thickness}px`
}))

const rootClass = computed(() =>
  cx(
    styles.bsDivider,
    isVertical.value && styles[DIVIDER_STATE_CLASS.IS_VERTICAL],
    props.dashed && styles[DIVIDER_STATE_CLASS.IS_DASHED],
    hasLabel.value && styles[DIVIDER_STATE_CLASS.HAS_LABEL],
    hasLabel.value && props.labelAlign === DIVIDER_LABEL_ALIGN.LEFT && styles[DIVIDER_STATE_CLASS.LABEL_LEFT],
    resolveClassNames(props.classNames)
  )
)
</script>

<template>
  <div
    v-bind="$attrs"
    :role="isDecorative ? 'none' : 'separator'"
    :aria-orientation="isDecorative ? undefined : props.direction"
    :style="cssVars"
    :class="rootClass"
  >
    <span v-if="hasLabel" :class="styles.bsDividerLabel"
      ><slot>{{ props.label }}</slot></span
    >
  </div>
</template>
