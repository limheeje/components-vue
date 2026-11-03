<script setup lang="ts">
import {cx} from '~/lib/cx'

import Icon from '~/components/Icon'
import {CALENDAR_VIEW, DATE_PICKER_DEFAULT, DAY_CELL_STATE} from '~/components/DatePicker/DatePicker.constant'
import {MONTHS_KR, WEEKDAYS, getDaysInMonth, getFirstDayOfWeek, isSameDay} from '~/components/DatePicker/dateUtils'
import styles from '~/components/DatePicker/DatePicker.module.scss'
const cap = (s: string) => s.replace(/(?:^|-)([a-z])/g, (m: string) => m.slice(-1).toUpperCase())

type CalendarView = (typeof CALENDAR_VIEW)[keyof typeof CALENDAR_VIEW]

const props = defineProps<{
  year: number
  month: number
  view: CalendarView
  yearPage: number
  showNav: boolean
  showMonthPicker: boolean
  showYearPicker: boolean
  showTodayDot: boolean
  showWeekend: boolean
  isDisabled: (d: Date) => boolean
  isSelected: (d: Date) => boolean
  isRangeStart: (d: Date) => boolean
  isRangeEnd: (d: Date) => boolean
  isInRange: (d: Date) => boolean
  onNavigateMonth: (delta: number) => void
  onSelectDay: (d: Date) => void
  onHoverDay: (d: Date | null) => void
  onViewChange: (v: CalendarView) => void
  onSelectMonth: (m: number) => void
  onSelectYear: (y: number) => void
  onYearPageChange: (delta: number) => void
}>()

const TODAY = new Date()
const YEAR_PAGE_SIZE = DATE_PICKER_DEFAULT.YEAR_PAGE_SIZE

interface DayCell {
  key: string
  day: number
  date: Date | null
}

function buildDays(): DayCell[] {
  const total = getDaysInMonth(props.year, props.month)
  const offset = getFirstDayOfWeek(props.year, props.month)
  const cells: DayCell[] = []
  for (let i = 0; i < offset; i++) cells.push({key: `e${i}`, day: 0, date: null})
  for (let d = 1; d <= total; d++) cells.push({key: `d${d}`, day: d, date: new Date(props.year, props.month, d)})
  return cells
}

function dayClass(date: Date) {
  const dow = date.getDay()
  const dis = props.isDisabled(date)
  return cx(
    styles.bsDatePickerDay,
    props.isSelected(date) && styles[`bsDatePickerDay${cap(DAY_CELL_STATE.SELECTED)}`],
    props.isRangeStart(date) && styles[`bsDatePickerDay${cap(DAY_CELL_STATE.RANGE_START)}`],
    props.isRangeEnd(date) && styles[`bsDatePickerDay${cap(DAY_CELL_STATE.RANGE_END)}`],
    props.isInRange(date) && styles[`bsDatePickerDay${cap(DAY_CELL_STATE.IN_RANGE)}`],
    isSameDay(date, TODAY) && styles[`bsDatePickerDay${cap(DAY_CELL_STATE.TODAY)}`],
    dis && styles[`bsDatePickerDay${cap(DAY_CELL_STATE.DISABLED)}`],
    props.showWeekend && dow === 0 && styles[`bsDatePickerDay${cap(DAY_CELL_STATE.SUN)}`],
    props.showWeekend && dow === 6 && styles[`bsDatePickerDay${cap(DAY_CELL_STATE.SAT)}`]
  )
}

function weekNameClass(i: number) {
  return cx(
    styles.bsDatePickerWeekName,
    props.showWeekend && i === 0 && styles[`bsDatePickerDay${cap(DAY_CELL_STATE.SUN)}`],
    props.showWeekend && i === 6 && styles[`bsDatePickerDay${cap(DAY_CELL_STATE.SAT)}`]
  )
}

const yearList = () => Array.from({length: YEAR_PAGE_SIZE}, (_, i) => props.yearPage + i)
</script>

<template>
  <div :class="styles.bsDatePickerCalendar">
    <div :class="styles.bsDatePickerCalHeader">
      <button
        v-if="showNav"
        type="button"
        :class="styles.bsDatePickerNavBtn"
        aria-label="이전 달"
        @click="onNavigateMonth(-1)"
      >
        <Icon name="chevron-left" :size="14" />
      </button>
      <span v-else :class="styles.bsDatePickerNavBtn" aria-hidden="true" />

      <div :class="styles.bsDatePickerCalTitle">
        <button
          type="button"
          :class="styles.bsDatePickerCalTitleBtn"
          :disabled="!showYearPicker"
          @click="onViewChange(view === CALENDAR_VIEW.YEARS ? CALENDAR_VIEW.DAYS : CALENDAR_VIEW.YEARS)"
        >
          {{ year }}년
        </button>
        <button
          type="button"
          :class="styles.bsDatePickerCalTitleBtn"
          :disabled="!showMonthPicker"
          @click="onViewChange(view === CALENDAR_VIEW.MONTHS ? CALENDAR_VIEW.DAYS : CALENDAR_VIEW.MONTHS)"
        >
          {{ month + 1 }}월
        </button>
      </div>

      <button
        v-if="showNav"
        type="button"
        :class="styles.bsDatePickerNavBtn"
        aria-label="다음 달"
        @click="onNavigateMonth(1)"
      >
        <Icon name="chevron-right" :size="14" />
      </button>
      <span v-else :class="styles.bsDatePickerNavBtn" aria-hidden="true" />
    </div>

    <template v-if="view === CALENDAR_VIEW.DAYS">
      <div :class="styles.bsDatePickerWeekRow">
        <span v-for="(w, i) in WEEKDAYS" :key="w" :class="weekNameClass(i)">{{ w }}</span>
      </div>
      <div :class="styles.bsDatePickerDayGrid" @mouseleave="onHoverDay(null)">
        <template v-for="cell in buildDays()" :key="cell.key">
          <span v-if="!cell.date" />
          <button
            v-else
            type="button"
            :disabled="isDisabled(cell.date)"
            :class="dayClass(cell.date)"
            @click="onSelectDay(cell.date)"
            @mouseenter="onHoverDay(cell.date)"
          >
            {{ cell.day }}
            <span
              v-if="showTodayDot && isSameDay(cell.date, TODAY) && !isSelected(cell.date)"
              :class="styles.bsDatePickerTodayDot"
            />
          </button>
        </template>
      </div>
    </template>

    <div v-if="view === CALENDAR_VIEW.MONTHS && showMonthPicker" :class="styles.bsDatePickerPickGrid" data-cols="3">
      <button
        v-for="(mn, mi) in MONTHS_KR"
        :key="mn"
        type="button"
        :class="cx(styles.bsDatePickerPickCell, mi === month && styles.bsDatePickerPickCurrent)"
        @click="onSelectMonth(mi)"
      >
        {{ mn }}
      </button>
    </div>

    <template v-if="view === CALENDAR_VIEW.YEARS && showYearPicker">
      <div :class="styles.bsDatePickerYearNav">
        <button
          type="button"
          :class="styles.bsDatePickerNavBtn"
          aria-label="이전 연도 범위"
          @click="onYearPageChange(-1)"
        >
          <Icon name="chevron-left" :size="14" />
        </button>
        <span :class="styles.bsDatePickerYearRange">{{ yearPage }} – {{ yearPage + YEAR_PAGE_SIZE - 1 }}</span>
        <button
          type="button"
          :class="styles.bsDatePickerNavBtn"
          aria-label="다음 연도 범위"
          @click="onYearPageChange(1)"
        >
          <Icon name="chevron-right" :size="14" />
        </button>
      </div>
      <div :class="styles.bsDatePickerPickGrid" data-cols="4">
        <button
          v-for="y in yearList()"
          :key="y"
          type="button"
          :class="cx(styles.bsDatePickerPickCell, y === year && styles.bsDatePickerPickCurrent)"
          @click="onSelectYear(y)"
        >
          {{ y }}
        </button>
      </div>
    </template>
  </div>
</template>
