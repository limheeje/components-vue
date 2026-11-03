<script setup lang="ts">
import {computed, getCurrentInstance, onMounted, ref, watch} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import {RADIO_DEFAULT, RADIO_STATE_CLASS} from '~/components/Radio/Radio.constant'
import type {RadioProps} from '~/components/Radio/Radio.type'
import styles from '~/components/Radio/Radio.module.scss'
const cap = (s: string) => s.replace(/(?:^|-)([a-z])/g, (m: string) => m.slice(-1).toUpperCase())

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<RadioProps>(), {
  size: RADIO_DEFAULT.SIZE,
  error: false
})

const emit = defineEmits<{
  'update:modelValue': [string]
  'update:checked': [boolean]
  change: [Event]
  input: [Event]
}>()

const innerRef = ref<HTMLInputElement>()
const vm = getCurrentInstance()
// Vue 는 Boolean/일반 prop 미전달 시 기본값으로 채우므로, 원본 vnode props 로 제어여부 판별
const modelControlled = computed(() => {
  const p = vm?.vnode.props
  return p != null && ('modelValue' in p || 'onUpdate:modelValue' in p)
})
const checkedControlled = computed(() => {
  const p = vm?.vnode.props
  return p != null && ('checked' in p || 'onUpdate:checked' in p)
})
const controlled = computed(() => modelControlled.value || checkedControlled.value)

// 제어 모드에서의 체크 상태: v-model 은 modelValue===value, v-model:checked 는 boolean
const resolvedChecked = computed(() =>
  modelControlled.value ? props.modelValue != null && props.modelValue === props.value : Boolean(props.checked)
)

function onChange(e: Event) {
  const el = e.target as HTMLInputElement
  emit('update:checked', el.checked)
  if (el.checked && props.value != null) emit('update:modelValue', props.value)
  emit('change', e)
}
function onInput(e: Event) {
  emit('input', e)
}

function sync() {
  if (controlled.value && innerRef.value) innerRef.value.checked = resolvedChecked.value
}

onMounted(() => {
  const el = innerRef.value
  if (!el) return
  if (controlled.value) el.checked = resolvedChecked.value
  else if (props.defaultChecked) el.checked = true
})
watch([() => props.modelValue, () => props.checked, () => props.value], sync)

defineExpose({el: innerRef, focus: () => innerRef.value?.focus()})

const rootClass = computed(() =>
  cx(
    styles.bsRadio,
    styles[`bsRadioSize${cap(props.size)}`],
    props.disabled && styles[RADIO_STATE_CLASS.IS_DISABLED],
    props.error && styles[RADIO_STATE_CLASS.IS_ERROR],
    resolveClassNames(props.classNames)
  )
)
</script>

<template>
  <label :class="rootClass">
    <input
      ref="innerRef"
      v-bind="$attrs"
      type="radio"
      :class="styles.bsRadioInput"
      :value="props.value"
      :disabled="props.disabled"
      :aria-invalid="props.error || undefined"
      @change="onChange"
      @input="onInput"
    />
    <span :class="styles.bsRadioCircle" aria-hidden="true"><span :class="styles.bsRadioDot" /></span>
    <span v-if="props.label != null || $slots.default" :class="styles.bsRadioLabel"
      ><slot>{{ props.label }}</slot></span
    >
  </label>
</template>
