<script setup lang="ts">
import {computed, getCurrentInstance, onMounted, ref, watch} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import {CHECKBOX_DEFAULT, CHECKBOX_STATE_CLASS} from '~/components/Checkbox/Checkbox.constant'
import type {CheckboxProps} from '~/components/Checkbox/Checkbox.type'
import styles from '~/components/Checkbox/Checkbox.module.scss'
const cap = (s: string) => s.replace(/(?:^|-)([a-z])/g, (m: string) => m.slice(-1).toUpperCase())

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<CheckboxProps>(), {
  size: CHECKBOX_DEFAULT.SIZE,
  indeterminate: false,
  error: false
})

const emit = defineEmits<{
  'update:modelValue': [boolean | string[]]
  'update:checked': [boolean]
  change: [Event]
  input: [Event]
}>()

const innerRef = ref<HTMLInputElement>()
// Vue 는 Boolean prop 미전달 시 false 로 채우므로, 원본 vnode props 로 제어여부를 판별한다.
const vm = getCurrentInstance()
const modelControlled = computed(() => {
  const p = vm?.vnode.props
  return p != null && ('modelValue' in p || 'onUpdate:modelValue' in p)
})
const checkedControlled = computed(() => {
  const p = vm?.vnode.props
  return p != null && ('checked' in p || 'onUpdate:checked' in p)
})
const controlled = computed(() => modelControlled.value || checkedControlled.value)
const isArrayModel = computed(() => Array.isArray(props.modelValue))

// 제어 모드 체크 상태: v-model 이 배열이면 value 포함 여부, 아니면 boolean / v-model:checked
const resolvedChecked = computed(() => {
  if (modelControlled.value) {
    if (isArrayModel.value) return props.value != null && (props.modelValue as string[]).includes(props.value)
    return Boolean(props.modelValue)
  }
  return Boolean(props.checked)
})

function sync() {
  const el = innerRef.value
  if (!el) return
  if (controlled.value) el.checked = resolvedChecked.value
  el.indeterminate = props.indeterminate
}

onMounted(() => {
  const el = innerRef.value
  if (!el) return
  if (controlled.value) el.checked = resolvedChecked.value
  else if (props.defaultChecked) el.checked = true
  el.indeterminate = props.indeterminate
})
watch(() => [props.modelValue, props.checked, props.value, props.indeterminate], sync, {deep: true})

function onChange(e: Event) {
  const el = e.target as HTMLInputElement
  emit('update:checked', el.checked)
  if (modelControlled.value) {
    if (isArrayModel.value) {
      const arr = props.modelValue as string[]
      const v = props.value ?? ''
      emit('update:modelValue', el.checked ? [...arr, v] : arr.filter((x) => x !== v))
    } else {
      emit('update:modelValue', el.checked)
    }
  }
  // React 는 네이티브 이벤트를 그대로 넘김 → 원본 이벤트 재발행
  emit('change', e)
}
function onInput(e: Event) {
  emit('input', e)
}

defineExpose({el: innerRef, focus: () => innerRef.value?.focus()})

const rootClass = computed(() =>
  cx(
    styles.bsCheckbox,
    styles[`bsCheckboxSize${cap(props.size)}`],
    props.disabled && styles[CHECKBOX_STATE_CLASS.IS_DISABLED],
    props.error && styles[CHECKBOX_STATE_CLASS.IS_ERROR],
    props.indeterminate && styles[CHECKBOX_STATE_CLASS.IS_INDETERMINATE],
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
      :class="styles.bsCheckboxInput"
      :value="props.value"
      :disabled="props.disabled"
      :aria-invalid="props.error || undefined"
      @change="onChange"
      @input="onInput"
    />
    <span :class="styles.bsCheckboxBox" aria-hidden="true">
      <svg :class="styles.bsCheckboxCheck" viewBox="0 0 12 12" fill="none">
        <polyline
          points="2,6 5,9 10,3"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span :class="styles.bsCheckboxDash" />
    </span>
    <span v-if="props.label != null || $slots.default" :class="styles.bsCheckboxLabel"
      ><slot>{{ props.label }}</slot></span
    >
  </label>
</template>
