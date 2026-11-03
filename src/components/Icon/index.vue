<script setup lang="ts">
import {computed, useAttrs} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import {ICON_DEFAULT, ICON_NAME} from '~/components/Icon/Icon.constant'
import type {IconProps} from '~/components/Icon/Icon.type'
import styles from '~/components/Icon/Icon.module.scss'

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<IconProps>(), {
  color: ICON_DEFAULT.COLOR,
  size: ICON_DEFAULT.SIZE,
  rotate: ICON_DEFAULT.ROTATE,
  spin: false
})

const attrs = useAttrs()
const ALIAS = ICON_NAME as Record<string, string>

// interface 키는 'aria-label' 이지만 Vue 가 camelize → props.ariaLabel 로 접근
const ariaLabel = computed(() => ((props as Record<string, unknown>).ariaLabel as string | undefined) || undefined)

const key = computed(() => ALIAS[props.name] ?? props.name)
const dimension = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))
const clickable = computed(() => attrs.onClick != null)

const rootClass = computed(() =>
  cx(
    styles.bsIcon,
    styles[`i-${key.value}`],
    props.spin && styles.bsIconSpin,
    clickable.value && styles.bsIconClickable,
    resolveClassNames(props.classNames)
  )
)
const rootStyle = computed(() => ({
  width: dimension.value,
  height: dimension.value,
  color: props.color,
  transform: !props.spin && props.rotate ? `rotate(${props.rotate}deg)` : undefined,
  ...props.style
}))
</script>

<template>
  <i
    v-bind="attrs"
    :role="ariaLabel ? 'img' : undefined"
    :aria-label="ariaLabel"
    :aria-hidden="ariaLabel ? undefined : true"
    :class="rootClass"
    :style="rootStyle"
  />
</template>
