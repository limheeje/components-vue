<script setup lang="ts">
import {computed, ref, useId} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import Radio from '~/components/Radio/index.vue'
import {RADIO_GROUP_DEFAULT, RADIO_GROUP_STATE_CLASS} from '~/components/RadioGroup/RadioGroup.constant'
import type {RadioGroupProps} from '~/components/RadioGroup/RadioGroup.type'
import styles from '~/components/RadioGroup/RadioGroup.module.scss'
const cap = (s: string) => s.replace(/(?:^|-)([a-z])/g, (m: string) => m.slice(-1).toUpperCase())

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<RadioGroupProps>(), {
  direction: RADIO_GROUP_DEFAULT.DIRECTION,
  disabled: false,
  size: RADIO_GROUP_DEFAULT.SIZE
})

const emit = defineEmits<{'update:modelValue': [string]; change: [string]}>()

const isControlled = computed(() => props.modelValue !== undefined)
const uncontrolled = ref(props.defaultValue ?? '')
const current = computed(() => (isControlled.value ? props.modelValue : uncontrolled.value))

const reactId = useId()
const groupName = computed(() => props.name ?? reactId)

function select(val: string) {
  if (!isControlled.value) uncontrolled.value = val
  emit('update:modelValue', val)
  emit('change', val)
}

const rootClass = computed(() =>
  cx(
    styles.bsRadioGroup,
    styles[`bsRadioGroupDirection${cap(props.direction)}`],
    props.disabled && styles[RADIO_GROUP_STATE_CLASS.IS_DISABLED],
    resolveClassNames(props.classNames)
  )
)
</script>

<template>
  <div v-bind="$attrs" role="radiogroup" :class="rootClass">
    <Radio
      v-for="opt in options"
      :key="opt.value"
      :name="groupName"
      :value="opt.value"
      :label="opt.label"
      :size="size"
      :checked="current === opt.value"
      :disabled="disabled || opt.disabled"
      @change="() => select(opt.value)"
    />
  </div>
</template>
