<script setup lang="ts">
import {computed, onBeforeUnmount, ref, useId, watch} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import Icon from '~/components/Icon'
import Calendar from '~/components/DatePicker/Calendar.vue'
import {
  CALENDAR_VIEW,
  DATE_PICKER_DEFAULT,
  DATE_PICKER_MODE,
  DATE_PICKER_STATE_CLASS
} from '~/components/DatePicker/DatePicker.constant'
import type {DatePickerProps, DateRange, DatePickerValue} from '~/components/DatePicker/DatePicker.type'
import {formatDate, isAfterDay, isBeforeDay, isBetweenDay, isSameDay} from '~/components/DatePicker/dateUtils'
import styles from '~/components/DatePicker/DatePicker.module.scss'

type CalendarView = (typeof CALENDAR_VIEW)[keyof typeof CALENDAR_VIEW]

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<DatePickerProps>(), {
  mode: DATE_PICKER_DEFAULT.MODE,
  defaultValue: null,
  defaultRange: () => [null, null],
  format: DATE_PICKER_DEFAULT.FORMAT,
  showTime: false,
  clearable: false,
  disabled: false,
  error: false,
  showMonthPicker: true,
  showYearPicker: true,
  showTodayDot: false,
  showWeekend: false
})

const emit = defineEmits<{'update:modelValue': [DatePickerValue]; change: [DatePickerValue]}>()

const YEAR_PAGE_SIZE = DATE_PICKER_DEFAULT.YEAR_PAGE_SIZE

const isRange = computed(() => props.mode === DATE_PICKER_MODE.RANGE)
const isControlled = computed(() => props.modelValue !== undefined)

const uncSingle = ref<Date | null>(props.defaultValue)
const uncRange = ref<DateRange>(props.defaultRange)

const single = computed<Date | null>(() =>
  isControlled.value ? ((props.modelValue as Date | null) ?? null) : uncSingle.value
)
const range = computed<DateRange>(() =>
  isControlled.value ? ((props.modelValue as DateRange) ?? [null, null]) : uncRange.value
)

const open = ref(false)
const hover = ref<Date | null>(null)
const step = ref<0 | 1>(0)
const view = ref<CalendarView>(CALENDAR_VIEW.DAYS)

const seed = single.value ?? range.value[0] ?? new Date()
const vy = ref(seed.getFullYear())
const vm = ref(seed.getMonth())
const yearPage = ref(Math.floor(seed.getFullYear() / YEAR_PAGE_SIZE) * YEAR_PAGE_SIZE)
const timeH = ref(single.value?.getHours() ?? 0)
const timeM = ref(single.value?.getMinutes() ?? 0)

const rootRef = ref<HTMLElement>()
const reactId = useId()
const triggerId = computed(() => props.id ?? reactId)
const errorMessage = computed(() => (typeof props.error === 'string' ? props.error : ''))
const hasError = computed(() => props.error === true || errorMessage.value.length > 0)

function onDocDown(e: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) {
    open.value = false
    view.value = CALENDAR_VIEW.DAYS
  }
}
watch(open, (o) => {
  if (o) document.addEventListener('mousedown', onDocDown)
  else document.removeEventListener('mousedown', onDocDown)
})
onBeforeUnmount(() => document.removeEventListener('mousedown', onDocDown))

function isDisabled(d: Date) {
  if (props.minDate && isBeforeDay(d, props.minDate)) return true
  if (props.maxDate && isAfterDay(d, props.maxDate)) return true
  return false
}

const effectiveFormat = computed(() => (props.showTime ? `${props.format} HH:mm` : props.format))

const display = computed(() => {
  if (isRange.value) {
    const [s, e] = range.value
    if (s && e) return `${formatDate(s, props.format)} ~ ${formatDate(e, props.format)}`
    if (s) return `${formatDate(s, props.format)} ~ ...`
    return ''
  }
  return single.value ? formatDate(single.value, effectiveFormat.value, timeH.value, timeM.value) : ''
})

const placeholderText = computed(() => {
  if (Array.isArray(props.placeholder)) {
    return isRange.value ? `${props.placeholder[0]} ~ ${props.placeholder[1]}` : props.placeholder[0]
  }
  return (
    props.placeholder ??
    (isRange.value ? DATE_PICKER_DEFAULT.RANGE_PLACEHOLDER.join(' ~ ') : DATE_PICKER_DEFAULT.SINGLE_PLACEHOLDER)
  )
})

function emitChange(next: DatePickerValue) {
  emit('update:modelValue', next)
  emit('change', next)
}

function handleSelectDay(d: Date) {
  if (isDisabled(d)) return
  if (!isRange.value) {
    const withTime = props.showTime ? new Date(d.getFullYear(), d.getMonth(), d.getDate(), timeH.value, timeM.value) : d
    if (!isControlled.value) uncSingle.value = withTime
    emitChange(withTime)
    if (!props.showTime) open.value = false
    return
  }
  if (step.value === 0) {
    const nextRange: DateRange = [d, null]
    if (!isControlled.value) uncRange.value = nextRange
    step.value = 1
  } else {
    const start = range.value[0]!
    const sorted: DateRange = isBeforeDay(d, start) ? [d, start] : [start, d]
    if (!isControlled.value) uncRange.value = sorted
    step.value = 0
    emitChange(sorted)
    open.value = false
  }
}

function handleClear(e: MouseEvent) {
  e.stopPropagation()
  step.value = 0
  if (!isControlled.value) {
    uncSingle.value = null
    uncRange.value = [null, null]
  }
  emitChange(isRange.value ? [null, null] : null)
}

function confirmTime() {
  const base = single.value ?? new Date(vy.value, vm.value, new Date().getDate())
  const next = new Date(base.getFullYear(), base.getMonth(), base.getDate(), timeH.value, timeM.value)
  if (!isControlled.value) uncSingle.value = next
  emitChange(next)
  open.value = false
}

function navigateMonth(delta: number) {
  const d = new Date(vy.value, vm.value + delta, 1)
  vy.value = d.getFullYear()
  vm.value = d.getMonth()
}

function isSelected(d: Date) {
  return isRange.value
    ? Boolean((range.value[0] && isSameDay(d, range.value[0])) || (range.value[1] && isSameDay(d, range.value[1])))
    : Boolean(single.value && isSameDay(d, single.value))
}
function isRangeStart(d: Date) {
  return isRange.value && Boolean(range.value[0] && isSameDay(d, range.value[0]))
}
function isRangeEnd(d: Date) {
  return isRange.value && Boolean(range.value[1] && isSameDay(d, range.value[1]))
}
function isInRange(d: Date) {
  if (!isRange.value || !range.value[0]) return false
  if (range.value[1]) return isBetweenDay(d, range.value[0], range.value[1])
  if (step.value === 1 && hover.value) return isBetweenDay(d, range.value[0], hover.value)
  return false
}

function onViewChange(v: CalendarView) {
  view.value = v
}
function onSelectMonth(m: number) {
  vm.value = m
  view.value = CALENDAR_VIEW.DAYS
}
function onSelectYear(y: number) {
  vy.value = y
  view.value = CALENDAR_VIEW.DAYS
}
function onYearPageChange(delta: number) {
  yearPage.value += delta * YEAR_PAGE_SIZE
}
function onHoverDay(d: Date | null) {
  hover.value = d
}

const nextMonthDate = computed(() => new Date(vy.value, vm.value + 1, 1))

const calBindings = computed(() => ({
  view: view.value,
  yearPage: yearPage.value,
  showMonthPicker: props.showMonthPicker,
  showYearPicker: props.showYearPicker,
  showTodayDot: props.showTodayDot,
  showWeekend: props.showWeekend,
  isDisabled,
  isSelected,
  isRangeStart,
  isRangeEnd,
  isInRange,
  onNavigateMonth: navigateMonth,
  onSelectDay: handleSelectDay,
  onHoverDay,
  onViewChange,
  onSelectMonth,
  onSelectYear,
  onYearPageChange
}))

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
  cx(styles.bsDatePicker, isRange.value && styles.isRangeMode, resolveClassNames(props.classNames))
)
const triggerClass = computed(() =>
  cx(
    styles.bsDatePickerTrigger,
    open.value && styles[DATE_PICKER_STATE_CLASS.IS_OPEN],
    hasError.value && styles[DATE_PICKER_STATE_CLASS.IS_ERROR],
    props.disabled && styles[DATE_PICKER_STATE_CLASS.IS_DISABLED],
    !display.value && styles[DATE_PICKER_STATE_CLASS.IS_PLACEHOLDER]
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
      <Icon name="calendar" size="1em" :class-names="styles.bsDatePickerCalIcon" />
      <span :class="styles.bsDatePickerValue">{{ display || placeholderText }}</span>
      <button
        v-if="clearable && display && !disabled"
        type="button"
        :tabindex="-1"
        :class="styles.bsDatePickerClearButton"
        aria-label="선택 초기화"
        @click="handleClear"
      >
        <Icon name="close" size="1em" />
      </button>
    </div>

    <input v-if="name != null" type="hidden" :name="name" :value="display" />

    <div v-if="open && !disabled" :class="styles.bsDatePickerPopup" role="dialog" aria-label="날짜 선택">
      <div v-if="isRange" :class="styles.bsDatePickerRangePanels">
        <div>
          <div :class="cx(styles.bsDatePickerRangeLabel, styles.bsDatePickerRangeLabelStart)">시작일</div>
          <Calendar v-bind="calBindings" :year="vy" :month="vm" :show-nav="true" />
        </div>
        <span :class="styles.bsDatePickerRangeDivider" />
        <div>
          <div :class="cx(styles.bsDatePickerRangeLabel, styles.bsDatePickerRangeLabelEnd)">종료일</div>
          <Calendar
            v-bind="calBindings"
            :year="nextMonthDate.getFullYear()"
            :month="nextMonthDate.getMonth()"
            :show-nav="false"
          />
        </div>
      </div>
      <div v-else>
        <Calendar v-bind="calBindings" :year="vy" :month="vm" :show-nav="true" />
        <div v-if="showTime" :class="styles.bsDatePickerTimeBar">
          <Icon name="clock" :size="13" color="var(--m2m-pg-brand)" />
          <span :class="styles.bsDatePickerTimeLabel">시간</span>
          <div :class="styles.bsDatePickerTimeSteppers">
            <span :class="styles.bsDatePickerStepper">
              <button
                type="button"
                :class="styles.bsDatePickerStepBtn"
                aria-label="증가"
                @click="timeH = (timeH + 1) % 24"
              >
                <Icon name="chevron-up" :size="11" />
              </button>
              <span :class="styles.bsDatePickerStepValue">{{ String(timeH).padStart(2, '0') }}</span>
              <button
                type="button"
                :class="styles.bsDatePickerStepBtn"
                aria-label="감소"
                @click="timeH = (timeH + 23) % 24"
              >
                <Icon name="chevron-down" :size="11" />
              </button>
            </span>
            <span :class="styles.bsDatePickerTimeColon">:</span>
            <span :class="styles.bsDatePickerStepper">
              <button
                type="button"
                :class="styles.bsDatePickerStepBtn"
                aria-label="증가"
                @click="timeM = (timeM + 5) % 60"
              >
                <Icon name="chevron-up" :size="11" />
              </button>
              <span :class="styles.bsDatePickerStepValue">{{ String(timeM).padStart(2, '0') }}</span>
              <button
                type="button"
                :class="styles.bsDatePickerStepBtn"
                aria-label="감소"
                @click="timeM = (timeM + 55) % 60"
              >
                <Icon name="chevron-down" :size="11" />
              </button>
            </span>
            <button type="button" :class="styles.bsDatePickerTimeConfirm" @click="confirmTime">확인</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="hasError || helperText != null" :class="styles.bsDatePickerMeta">
      <span v-if="hasError" :id="`${triggerId}-error`" :class="styles.bsDatePickerError">
        {{ errorMessage || DATE_PICKER_DEFAULT.ERROR_TEXT }}
      </span>
      <span v-else :id="`${triggerId}-helper`" :class="styles.bsDatePickerHelper">{{ helperText }}</span>
    </div>
  </div>
</template>
