<script setup lang="ts">
import {computed, onBeforeUnmount, ref, useId, watch} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import Icon from '~/components/Icon'
import TimeColumn from '~/components/TimePicker/TimeColumn.vue'
import {
  TIME_PICKER_DEFAULT,
  TIME_PICKER_FORMAT,
  TIME_PICKER_STATE_CLASS
} from '~/components/TimePicker/TimePicker.constant'
import type {TimePickerProps} from '~/components/TimePicker/TimePicker.type'
import styles from '~/components/TimePicker/TimePicker.module.scss'
const cap = (s: string) => s.replace(/(?:^|-)([a-z])/g, (m: string) => m.slice(-1).toUpperCase())

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<TimePickerProps>(), {
  format: TIME_PICKER_DEFAULT.FORMAT,
  size: TIME_PICKER_DEFAULT.SIZE,
  placeholder: TIME_PICKER_DEFAULT.PLACEHOLDER,
  step: TIME_PICKER_DEFAULT.STEP,
  clearable: false,
  disabled: false,
  error: false
})

const emit = defineEmits<{'update:modelValue': [string]; change: [string]}>()

const pad = (n: number) => String(n).padStart(2, '0')
const HOURS = Array.from({length: 24}, (_, i) => pad(i))
const SECONDS = Array.from({length: 60}, (_, i) => pad(i))

function splitParts(v: string) {
  const [h, m, s] = v.split(':')
  return {
    h: h || TIME_PICKER_DEFAULT.FALLBACK_HOUR,
    m: m || TIME_PICKER_DEFAULT.FALLBACK_MIN,
    s: s || TIME_PICKER_DEFAULT.FALLBACK_SEC
  }
}

const rootRef = ref<HTMLElement>()
const showSec = computed(() => props.format === TIME_PICKER_FORMAT.HMS)

const isControlled = computed(() => props.modelValue !== undefined)
const uncontrolled = ref(props.defaultValue ?? '')
const committed = computed(() => (isControlled.value ? (props.modelValue ?? '') : uncontrolled.value))

const open = ref(false)
const draft = ref(splitParts(committed.value))

const reactId = useId()
const triggerId = computed(() => props.id ?? reactId)
const errorMessage = computed(() => (typeof props.error === 'string' ? props.error : ''))
const hasError = computed(() => props.error === true || errorMessage.value.length > 0)

const minutes = computed(() =>
  Array.from({length: Math.ceil(60 / Math.max(1, props.step))}, (_, i) => pad(i * props.step))
)

// 팝업 열릴 때 draft 를 현재 확정값으로 시드
watch([open, committed], () => {
  if (open.value) draft.value = splitParts(committed.value)
})

function onDocDown(e: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) open.value = false
}
watch(open, (o) => {
  if (o) document.addEventListener('mousedown', onDocDown)
  else document.removeEventListener('mousedown', onDocDown)
})
onBeforeUnmount(() => document.removeEventListener('mousedown', onDocDown))

const display = computed(() => {
  if (!committed.value) return ''
  return showSec.value
    ? committed.value.split(':').slice(0, 3).join(':')
    : committed.value.split(':').slice(0, 2).join(':')
})

function commit() {
  const d = draft.value
  const next = showSec.value ? `${d.h}:${d.m}:${d.s}` : `${d.h}:${d.m}`
  if (!isControlled.value) uncontrolled.value = next
  emit('update:modelValue', next)
  emit('change', next)
  open.value = false
}

function clear(e: MouseEvent) {
  e.stopPropagation()
  if (!isControlled.value) uncontrolled.value = ''
  draft.value = splitParts('')
  emit('update:modelValue', '')
  emit('change', '')
}

function selectH(h: string) {
  draft.value = {...draft.value, h}
}
function selectM(m: string) {
  draft.value = {...draft.value, m}
}
function selectS(s: string) {
  draft.value = {...draft.value, s}
}

function onTriggerClick() {
  if (!props.disabled) open.value = !open.value
}
function onTriggerKeydown(e: KeyboardEvent) {
  if (props.disabled) return
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    open.value = !open.value
  } else if (e.key === 'Escape') {
    open.value = false
  }
}

const rootClass = computed(() =>
  cx(styles.bsTimePicker, styles[`bsTimePickerSize${cap(props.size)}`], resolveClassNames(props.classNames))
)
const triggerClass = computed(() =>
  cx(
    styles.bsTimePickerTrigger,
    open.value && styles[TIME_PICKER_STATE_CLASS.IS_OPEN],
    hasError.value && styles[TIME_PICKER_STATE_CLASS.IS_ERROR],
    props.disabled && styles[TIME_PICKER_STATE_CLASS.IS_DISABLED],
    !display.value && styles[TIME_PICKER_STATE_CLASS.IS_PLACEHOLDER]
  )
)
</script>

<template>
  <div ref="rootRef" v-bind="$attrs" :class="rootClass">
    <div
      :id="triggerId"
      role="combobox"
      aria-haspopup="dialog"
      :aria-expanded="open"
      :aria-disabled="disabled || undefined"
      :aria-invalid="hasError || undefined"
      :tabindex="disabled ? -1 : 0"
      :class="triggerClass"
      @click="onTriggerClick"
      @keydown="onTriggerKeydown"
    >
      <Icon name="clock" size="1em" :class-names="styles.bsTimePickerClockIcon" />
      <span :class="styles.bsTimePickerValue">{{ display || placeholder }}</span>
      <button
        v-if="clearable && display && !disabled"
        type="button"
        :tabindex="-1"
        :class="styles.bsTimePickerClearButton"
        aria-label="시간 초기화"
        @click="clear"
      >
        <Icon name="close" size="1em" />
      </button>
    </div>

    <input v-if="name != null" type="hidden" :name="name" :value="committed" />

    <div v-if="open && !disabled" :class="styles.bsTimePickerPopup" role="dialog" aria-label="시간 선택">
      <div :class="styles.bsTimePickerColumns">
        <TimeColumn label="시" :values="HOURS" :selected="draft.h" :on-select="selectH" />
        <span :class="styles.bsTimePickerColon">:</span>
        <TimeColumn label="분" :values="minutes" :selected="draft.m" :on-select="selectM" />
        <template v-if="showSec">
          <span :class="styles.bsTimePickerColon">:</span>
          <TimeColumn label="초" :values="SECONDS" :selected="draft.s" :on-select="selectS" />
        </template>
      </div>
      <div :class="styles.bsTimePickerFooter">
        <button type="button" :class="styles.bsTimePickerCancelButton" @click="open = false">취소</button>
        <button type="button" :class="styles.bsTimePickerConfirmButton" @click="commit">확인</button>
      </div>
    </div>

    <div v-if="hasError || helperText != null" :class="styles.bsTimePickerMeta">
      <span v-if="hasError" :id="`${triggerId}-error`" :class="styles.bsTimePickerError">
        {{ errorMessage || TIME_PICKER_DEFAULT.ERROR_TEXT }}
      </span>
      <span v-else :id="`${triggerId}-helper`" :class="styles.bsTimePickerHelper">{{ helperText }}</span>
    </div>
  </div>
</template>
