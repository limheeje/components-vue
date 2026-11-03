<script setup lang="ts">
import {computed, getCurrentInstance, onMounted, ref, watch} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import {SWITCH_DEFAULT, SWITCH_STATE_CLASS} from '~/components/Switch/Switch.constant'
import type {SwitchProps} from '~/components/Switch/Switch.type'
import styles from '~/components/Switch/Switch.module.scss'
const cap = (s: string) => s.replace(/(?:^|-)([a-z])/g, (m: string) => m.slice(-1).toUpperCase())

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<SwitchProps>(), {
  size: SWITCH_DEFAULT.SIZE,
  error: false
})

const emit = defineEmits<{
  'update:modelValue': [boolean]
  'update:checked': [boolean]
  change: [Event]
  input: [Event]
}>()

const innerRef = ref<HTMLInputElement>()
const vm = getCurrentInstance()
// Vue 는 Boolean prop 미전달 시 false 로 채우므로, 원본 vnode props 로 제어여부를 판별한다.
const modelControlled = computed(() => {
  const p = vm?.vnode.props
  return p != null && ('modelValue' in p || 'onUpdate:modelValue' in p)
})
const checkedControlled = computed(() => {
  const p = vm?.vnode.props
  return p != null && ('checked' in p || 'onUpdate:checked' in p)
})
const controlled = computed(() => modelControlled.value || checkedControlled.value)
const resolvedChecked = computed(() => Boolean(modelControlled.value ? props.modelValue : props.checked))

function sync() {
  if (controlled.value && innerRef.value) innerRef.value.checked = resolvedChecked.value
}

onMounted(() => {
  const el = innerRef.value
  if (!el) return
  if (controlled.value) el.checked = resolvedChecked.value
  else if (props.defaultChecked) el.checked = true
})
watch([() => props.modelValue, () => props.checked], sync)

function onChange(e: Event) {
  const el = e.target as HTMLInputElement
  emit('update:checked', el.checked)
  if (modelControlled.value) emit('update:modelValue', el.checked)
  emit('change', e)
}
function onInput(e: Event) {
  emit('input', e)
}

const rootClass = computed(() =>
  cx(
    styles.bsSwitch,
    styles[`bsSwitchSize${cap(props.size)}`],
    props.disabled && styles[SWITCH_STATE_CLASS.IS_DISABLED],
    props.error && styles[SWITCH_STATE_CLASS.IS_ERROR],
    resolveClassNames(props.classNames)
  )
)
</script>

<template>
  <label :class="rootClass">
    <input
      ref="innerRef"
      v-bind="$attrs"
      type="checkbox"
      role="switch"
      :class="styles.bsSwitchInput"
      :disabled="props.disabled"
      :aria-invalid="props.error || undefined"
      @change="onChange"
      @input="onInput"
    />
    <span :class="styles.bsSwitchTrack" aria-hidden="true"><span :class="styles.bsSwitchThumb" /></span>
    <span v-if="props.label != null || $slots.default" :class="styles.bsSwitchLabel"
      ><slot>{{ props.label }}</slot></span
    >
  </label>
</template>
