<script setup lang="ts">
import {computed, onBeforeUnmount, ref, useId, useSlots, watch} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import {TOOLTIP_DEFAULT, TOOLTIP_STATE_CLASS, TOOLTIP_TRIGGER} from '~/components/Tooltip/Tooltip.constant'
import type {TooltipProps} from '~/components/Tooltip/Tooltip.type'
import styles from '~/components/Tooltip/Tooltip.module.scss'
const cap = (s: string) => s.replace(/(?:^|-)([a-z])/g, (m: string) => m.slice(-1).toUpperCase())

const props = withDefaults(defineProps<TooltipProps>(), {
  placement: TOOLTIP_DEFAULT.PLACEMENT,
  trigger: TOOLTIP_DEFAULT.TRIGGER,
  arrow: TOOLTIP_DEFAULT.ARROW,
  delay: TOOLTIP_DEFAULT.DELAY,
  disabled: false
})

const slots = useSlots()
const open = ref(false)
const wrapRef = ref<HTMLSpanElement>()
let timer: ReturnType<typeof setTimeout> | undefined
const tooltipId = useId()

const isHover = computed(() => props.trigger === TOOLTIP_TRIGGER.HOVER)
const hasContent = computed(() => props.content != null || Boolean(slots.content))

function clearTimer() {
  if (timer) clearTimeout(timer)
}
function show() {
  if (props.disabled) return
  clearTimer()
  if (props.delay > 0) timer = setTimeout(() => (open.value = true), props.delay)
  else open.value = true
}
function hide() {
  clearTimer()
  open.value = false
}
function toggle() {
  if (open.value) hide()
  else show()
}

function onDocDown(e: MouseEvent) {
  if (wrapRef.value && !wrapRef.value.contains(e.target as Node)) open.value = false
}
watch([open, isHover], ([o, hover]) => {
  document.removeEventListener('mousedown', onDocDown)
  if (o && !hover) document.addEventListener('mousedown', onDocDown)
})
onBeforeUnmount(() => {
  clearTimer()
  document.removeEventListener('mousedown', onDocDown)
})

const tooltipClass = computed(() =>
  cx(
    styles.bsTooltip,
    styles[`bsTooltipPlacement${cap(props.placement)}`],
    props.arrow && styles[TOOLTIP_STATE_CLASS.HAS_ARROW],
    resolveClassNames(props.classNames)
  )
)
</script>

<template>
  <span
    ref="wrapRef"
    :class="styles.bsTooltipWrapper"
    :aria-describedby="open ? tooltipId : undefined"
    @mouseenter="isHover && show()"
    @mouseleave="isHover && hide()"
    @focusin="isHover && show()"
    @focusout="isHover && hide()"
    @click="!isHover && toggle()"
  >
    <slot />
    <span v-if="open && hasContent" :id="tooltipId" role="tooltip" :class="tooltipClass">
      <slot name="content">{{ props.content }}</slot>
    </span>
  </span>
</template>
