<script setup lang="ts">
import {computed, ref, useAttrs, useId, useSlots} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import {TEXTAREA_DEFAULT, TEXTAREA_STATE_CLASS} from '~/components/Textarea/Textarea.constant'
import type {TextareaProps} from '~/components/Textarea/Textarea.type'
import styles from '~/components/Textarea/Textarea.module.scss'

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<TextareaProps>(), {
  error: false,
  resize: TEXTAREA_DEFAULT.RESIZE,
  showCount: false,
  rows: TEXTAREA_DEFAULT.ROWS
})

const emit = defineEmits<{'update:modelValue': [string]; change: [Event]; input: [Event]}>()

const attrs = useAttrs()
const slots = useSlots()
const passAttrs = computed(() => {
  const {onChange: _oc, onInput: _oi, class: _c, style: _s, ...rest} = attrs as Record<string, unknown>
  return rest
})

const reactId = useId()
const areaId = computed(() => props.id ?? reactId)
const uncontrolled = ref(props.defaultValue != null ? String(props.defaultValue) : '')
const isControlled = computed(() => props.modelValue !== undefined)
const currentValue = computed(() => (isControlled.value ? String(props.modelValue ?? '') : uncontrolled.value))
const focused = ref(false)

const errorMessage = computed(() => (typeof props.error === 'string' ? props.error : ''))
const hasError = computed(() => props.error === true || errorMessage.value.length > 0)
const overLimit = computed(() => props.maxLength != null && currentValue.value.length >= props.maxLength)
const hasHelper = computed(() => props.helperText != null || Boolean(slots.default))
const showMeta = computed(() => hasError.value || hasHelper.value)

function onInput(e: Event) {
  const next = (e.target as HTMLTextAreaElement).value
  if (!isControlled.value) uncontrolled.value = next
  emit('update:modelValue', next)
  emit('input', e)
  emit('change', e)
}

const fieldClass = computed(() =>
  cx(
    styles.bsTextareaField,
    !props.resize && styles[TEXTAREA_STATE_CLASS.IS_NO_RESIZE],
    focused.value && styles[TEXTAREA_STATE_CLASS.IS_FOCUSED],
    hasError.value && styles[TEXTAREA_STATE_CLASS.IS_ERROR],
    props.disabled && styles[TEXTAREA_STATE_CLASS.IS_DISABLED],
    props.readonly && styles[TEXTAREA_STATE_CLASS.IS_READONLY],
    props.showCount && props.maxLength != null && styles.hasCount
  )
)
</script>

<template>
  <div :class="cx(styles.bsTextarea, resolveClassNames(props.classNames))">
    <div :class="fieldClass">
      <textarea
        v-bind="passAttrs"
        :id="areaId"
        :class="styles.bsTextareaInf"
        :disabled="props.disabled"
        :readonly="props.readonly"
        :rows="props.rows"
        :maxlength="props.maxLength"
        :placeholder="props.placeholder"
        :aria-invalid="hasError || undefined"
        :value="currentValue"
        @input="onInput"
        @focus="focused = true"
        @blur="focused = false"
      />
      <span
        v-if="props.showCount && props.maxLength != null"
        :class="cx(styles.bsTextareaCount, overLimit && styles.bsTextareaCountMax)"
        aria-hidden="true"
      >
        {{ currentValue.length }} / {{ props.maxLength }}
      </span>
    </div>

    <div v-if="showMeta && (hasError || hasHelper)" :class="styles.bsTextareaMeta">
      <span v-if="hasError && errorMessage" :id="`${areaId}-error`" :class="styles.bsTextareaError">{{
        errorMessage
      }}</span>
      <span v-else-if="hasHelper" :id="`${areaId}-helper`" :class="styles.bsTextareaHelper"
        ><slot>{{ props.helperText }}</slot></span
      >
    </div>
  </div>
</template>
