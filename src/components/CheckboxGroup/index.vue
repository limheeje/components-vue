<script setup lang="ts">
import {computed} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import Checkbox from '~/components/Checkbox/index.vue'
import {CHECKBOX_GROUP_DEFAULT, CHECKBOX_GROUP_STATE_CLASS} from '~/components/CheckboxGroup/CheckboxGroup.constant'
import type {CheckboxGroupProps} from '~/components/CheckboxGroup/CheckboxGroup.type'
import styles from '~/components/CheckboxGroup/CheckboxGroup.module.scss'
const cap = (s: string) => s.replace(/(?:^|-)([a-z])/g, (m: string) => m.slice(-1).toUpperCase())

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<CheckboxGroupProps>(), {
  direction: CHECKBOX_GROUP_DEFAULT.DIRECTION,
  disabled: false,
  size: CHECKBOX_GROUP_DEFAULT.SIZE
})

const emit = defineEmits<{'update:modelValue': [string[]]; change: [string[]]}>()

function commit(next: string[]) {
  emit('update:modelValue', next)
  emit('change', next)
}

function toggle(val: string) {
  if (props.modelValue.includes(val)) {
    if (props.min !== undefined && props.modelValue.length <= props.min) return
    commit(props.modelValue.filter((v) => v !== val))
  } else {
    if (props.max !== undefined && props.modelValue.length >= props.max) return
    commit([...props.modelValue, val])
  }
}

function atMax(checked: boolean) {
  return !checked && props.max !== undefined && props.modelValue.length >= props.max
}

const rootClass = computed(() =>
  cx(
    styles.bsCheckboxGroup,
    styles[`bsCheckboxGroupDirection${cap(props.direction)}`],
    props.disabled && styles[CHECKBOX_GROUP_STATE_CLASS.IS_DISABLED],
    resolveClassNames(props.classNames)
  )
)
</script>

<template>
  <div v-bind="$attrs" role="group" :class="rootClass">
    <Checkbox
      v-for="opt in options"
      :key="opt.value"
      :name="name"
      :value="opt.value"
      :label="opt.label"
      :size="size"
      :checked="modelValue.includes(opt.value)"
      :disabled="disabled || opt.disabled || atMax(modelValue.includes(opt.value))"
      @update:checked="() => toggle(opt.value)"
    />
  </div>
</template>
