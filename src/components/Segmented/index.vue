<script setup lang="ts">
import {computed, ref, useId} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import {SEGMENTED_DEFAULT, SEGMENTED_STATE_CLASS} from '~/components/Segmented/Segmented.constant'
import type {SegmentedOption, SegmentedProps} from '~/components/Segmented/Segmented.type'
import styles from '~/components/Segmented/Segmented.module.scss'

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const normalize = (o: SegmentedOption | string): SegmentedOption => (typeof o === 'string' ? {label: o, value: o} : o)

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<SegmentedProps>(), {
  size: SEGMENTED_DEFAULT.SIZE,
  disabled: false,
  block: false
})

const emit = defineEmits<{'update:modelValue': [string]; change: [string, SegmentedOption]}>()

const items = computed(() => props.options.map(normalize))

const isControlled = computed(() => props.modelValue !== undefined)
const firstValue = props.options[0] === undefined ? '' : normalize(props.options[0]).value
const uncontrolled = ref(props.defaultValue ?? firstValue)
const current = computed(() => (isControlled.value ? props.modelValue : uncontrolled.value))

const reactId = useId()
const groupName = computed(() => props.name ?? reactId)

function select(opt: SegmentedOption) {
  if (props.disabled || opt.disabled) return
  if (!isControlled.value) uncontrolled.value = opt.value
  emit('update:modelValue', opt.value)
  emit('change', opt.value, opt)
}

function move(dir: number) {
  const enabled = items.value.filter((o) => !o.disabled)
  if (enabled.length === 0) return
  const idx = enabled.findIndex((o) => o.value === current.value)
  const next = enabled[(idx + dir + enabled.length) % enabled.length]
  if (next) select(next)
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault()
    move(1)
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault()
    move(-1)
  }
}

const rootClass = computed(() =>
  cx(
    styles.bsSegmented,
    styles[`bsSegmentedSize${cap(props.size)}`],
    props.block && styles.isBlock,
    props.disabled && styles[SEGMENTED_STATE_CLASS.IS_DISABLED],
    resolveClassNames(props.classNames)
  )
)

const itemClass = (opt: SegmentedOption) =>
  cx(styles.bsSegmentedItem, current.value === opt.value && styles.bsSegmentedItemSelected)
</script>

<template>
  <div v-bind="$attrs" role="radiogroup" :class="rootClass">
    <button
      v-for="opt in items"
      :key="opt.value"
      type="button"
      role="radio"
      :name="groupName"
      :aria-checked="current === opt.value"
      :tabindex="current === opt.value ? 0 : -1"
      :disabled="disabled || opt.disabled"
      :class="itemClass(opt)"
      @click="() => select(opt)"
      @keydown="onKey"
    >
      <span :class="styles.bsSegmentedItemLabel">{{ opt.label }}</span>
    </button>
  </div>
</template>
