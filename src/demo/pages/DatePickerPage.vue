<script setup lang="ts">
import {ref} from 'vue'

import DatePicker, {DATE_PICKER_MODE} from '~/components/DatePicker'
import type {DatePickerValue} from '~/components/DatePicker'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = [
  'mode',
  'value',
  'onChange',
  'format',
  'placeholder',
  'minDate',
  'maxDate',
  'showTime',
  'clearable',
  'disabled',
  'error',
  'month',
  'day',
  'year'
]

const today = new Date()
const minD = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3)
const maxD = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14)
const rangeSeed: [Date, Date] = [
  new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
  new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5)
]
const clearRange: [Date, Date] = [today, new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)]

function toText(v: DatePickerValue): string {
  if (v == null) return '(없음)'
  if (Array.isArray(v)) return v.map((d) => d?.toLocaleDateString() ?? '…').join(' ~ ')
  return v.toLocaleString()
}

const log = ref('(없음)')
</script>

<template>
  <div>
    <PageHeader
      title="DatePicker"
      component="DatePicker"
      desc="— 달력 팝업으로 날짜 또는 기간을 선택하는 인풋 컴포넌트. single / range 두 가지 모드를 지원합니다."
    />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <template v-if="tab === 'mode'">
          <ComponentSection
            title='mode="single" (기본)'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              `import DatePicker, {DATE_PICKER_MODE} from \x27m2m-uiux-vue/DatePicker\x27`,
              '',
              '// single 모드: v-model 값은 Date | null',
              'const date = ref<Date | null>(null)',
              '</script>',
              '',
              '<template>',
              '  <DatePicker :mode=&quot;DATE_PICKER_MODE[\x27SINGLE\x27]&quot; v-model=&quot;date&quot; />',
              '</template>'
            ]"
            :notes="['하루를 선택하면 즉시 닫힙니다', '선택 시 date = Date, 초기화(clearable) 시 date = null']"
          >
            <DatePicker />
          </ComponentSection>
          <ComponentSection
            title='mode="range" — 기간 선택'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              `import DatePicker, {DATE_PICKER_MODE} from \x27m2m-uiux-vue/DatePicker\x27`,
              '',
              '// range 모드: v-model 값은 [시작 Date|null, 종료 Date|null] 튜플',
              'const range = ref<[Date | null, Date | null]>([null, null])',
              '</script>',
              '',
              '<template>',
              '  <DatePicker :mode=&quot;DATE_PICKER_MODE[\x27RANGE\x27]&quot; v-model=&quot;range&quot; />',
              '</template>'
            ]"
            :notes="[
              '첫 클릭 → range[0], 두 번째 클릭 → range[1] (자동 정렬)',
              '선택 진행 중에는 [start, null], 완료 시 [start, end]',
              'range 모드에서 두 달이 나란히 표시, hover 시 범위 미리보기'
            ]"
          >
            <DatePicker :mode="DATE_PICKER_MODE['RANGE']" />
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'value'">
          <ComponentSection
            title="v-model — 제어 (single, Date)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import DatePicker from \x27m2m-uiux-vue/DatePicker\x27',
              '',
              'const date = ref<Date | null>(new Date())',
              '</script>',
              '',
              '<template>',
              '  <DatePicker v-model=&quot;date&quot; />',
              '</template>'
            ]"
          >
            <DatePicker :default-value="today" />
          </ComponentSection>
          <ComponentSection
            title="v-model — range ([start, end])"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              `import DatePicker, {DATE_PICKER_MODE} from \x27m2m-uiux-vue/DatePicker\x27`,
              '',
              'const range = ref<[Date | null, Date | null]>([null, null])',
              '</script>',
              '',
              '<template>',
              '  <DatePicker :mode=&quot;DATE_PICKER_MODE[\x27RANGE\x27]&quot; v-model=&quot;range&quot; />',
              '</template>'
            ]"
          >
            <DatePicker :mode="DATE_PICKER_MODE['RANGE']" :default-range="rangeSeed" />
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'onChange'"
          title="onChange — 선택 로그"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import DatePicker from \x27m2m-uiux-vue/DatePicker\x27',
            '',
            'const value = ref<Date | null>(null)',
            '</script>',
            '',
            '<template>',
            '  <DatePicker @change=&quot;(date) => (value = date)&quot; />',
            '</template>'
          ]"
        >
          <div class="demo-col">
            <DatePicker @change="log = toText($event)" />
            <span class="demo-hint">onChange: {{ log }}</span>
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'format'"
          title="format"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import DatePicker from \x27m2m-uiux-vue/DatePicker\x27',
            '',
            'const date = ref<Date | null>(new Date())',
            '</script>',
            '',
            '<template>',
            '  <DatePicker v-model=&quot;date&quot; format=&quot;YYYY.MM.DD&quot; />',
            '</template>'
          ]"
          :notes="['YYYY=년, MM=월(2자리), DD=일(2자리), (show-time 시 HH mm)']"
        >
          <div class="demo-col">
            <DatePicker :default-value="today" format="YYYY-MM-DD" />
            <DatePicker :default-value="today" format="MM/DD/YYYY" />
            <DatePicker :default-value="today" format="YYYY년 MM월 DD일" />
          </div>
        </ComponentSection>

        <template v-else-if="tab === 'placeholder'">
          <ComponentSection
            title="placeholder — string"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import DatePicker from \x27m2m-uiux-vue/DatePicker\x27',
              '',
              'const date = ref<Date | null>(null)',
              '</script>',
              '',
              '<template>',
              '  <DatePicker v-model=&quot;date&quot; placeholder=&quot;검진 날짜를 선택하세요&quot; />',
              '</template>'
            ]"
          >
            <DatePicker placeholder="검진 날짜를 선택하세요" />
          </ComponentSection>
          <ComponentSection
            title="placeholder — [string, string] (range)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              `import DatePicker, {DATE_PICKER_MODE} from \x27m2m-uiux-vue/DatePicker\x27`,
              '',
              'const range = ref<[Date | null, Date | null]>([null, null])',
              '</script>',
              '',
              '<template>',
              `  <DatePicker :mode=&quot;DATE_PICKER_MODE[\x27RANGE\x27]&quot; v-model=&quot;range&quot; :placeholder=&quot;[\x27체크인\x27, \x27체크아웃\x27]&quot; />`,
              '</template>'
            ]"
          >
            <DatePicker :mode="DATE_PICKER_MODE['RANGE']" :placeholder="['체크인', '체크아웃']" />
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'minDate'"
          title="minDate — 오늘 -3일 이전 비활성"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import DatePicker from \x27m2m-uiux-vue/DatePicker\x27',
            '',
            'const date = ref<Date | null>(null)',
            'const minDate = new Date() // 이 날짜 이전은 비활성',
            '</script>',
            '',
            '<template>',
            '  <DatePicker v-model=&quot;date&quot; :min-date=&quot;minDate&quot; />',
            '</template>'
          ]"
        >
          <DatePicker :min-date="minD" />
        </ComponentSection>

        <template v-else-if="tab === 'maxDate'">
          <ComponentSection
            title="maxDate — 오늘 +14일 이후 비활성"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import DatePicker from \x27m2m-uiux-vue/DatePicker\x27',
              '',
              'const date = ref<Date | null>(null)',
              'const maxDate = new Date() // 이 날짜 이후는 비활성',
              '</script>',
              '',
              '<template>',
              '  <DatePicker v-model=&quot;date&quot; :max-date=&quot;maxDate&quot; />',
              '</template>'
            ]"
          >
            <DatePicker :max-date="maxD" />
          </ComponentSection>
          <ComponentSection
            title="minDate + maxDate"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import DatePicker from \x27m2m-uiux-vue/DatePicker\x27',
              '',
              'const date = ref<Date | null>(null)',
              'const minDate = new Date()',
              'const maxDate = new Date(Date.now() + 14 * 864e5)',
              '</script>',
              '',
              '<template>',
              '  <DatePicker v-model=&quot;date&quot; :min-date=&quot;minDate&quot; :max-date=&quot;maxDate&quot; />',
              '</template>'
            ]"
          >
            <DatePicker :min-date="minD" :max-date="maxD" />
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'showTime'"
          title="showTime — 날짜 + 시간"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import DatePicker from \x27m2m-uiux-vue/DatePicker\x27',
            '',
            'const date = ref<Date | null>(new Date())',
            '</script>',
            '',
            '<template>',
            '  <DatePicker v-model=&quot;date&quot; show-time format=&quot;YYYY-MM-DD&quot; />',
            '</template>'
          ]"
          :notes="['달력 하단에 시간 패널 추가, ▲▼ 로 시(HH)/분(5분 단위) 조정', '\x27확인\x27 버튼 클릭 시 최종 선택']"
        >
          <DatePicker show-time :default-value="today" />
        </ComponentSection>

        <template v-else-if="tab === 'clearable'">
          <ComponentSection
            title="clearable"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import DatePicker from \x27m2m-uiux-vue/DatePicker\x27',
              '',
              'const date = ref<Date | null>(new Date())',
              '</script>',
              '',
              '<template>',
              '  <DatePicker v-model=&quot;date&quot; clearable />',
              '</template>'
            ]"
          >
            <DatePicker clearable :default-value="today" />
          </ComponentSection>
          <ComponentSection
            title="clearable + range"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              `import DatePicker, {DATE_PICKER_MODE} from \x27m2m-uiux-vue/DatePicker\x27`,
              '',
              'const range = ref<[Date | null, Date | null]>([null, null])',
              '</script>',
              '',
              '<template>',
              '  <DatePicker :mode=&quot;DATE_PICKER_MODE[\x27RANGE\x27]&quot; v-model=&quot;range&quot; clearable />',
              '</template>'
            ]"
          >
            <DatePicker :mode="DATE_PICKER_MODE['RANGE']" clearable :default-range="clearRange" />
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'disabled'"
          title="disabled"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import DatePicker from \x27m2m-uiux-vue/DatePicker\x27',
            '',
            'const date = ref<Date | null>(new Date())',
            '</script>',
            '',
            '<template>',
            '  <DatePicker v-model=&quot;date&quot; disabled />',
            '</template>'
          ]"
        >
          <DatePicker disabled :default-value="today" />
        </ComponentSection>

        <template v-else-if="tab === 'error'">
          <ComponentSection
            title="error"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import DatePicker from \x27m2m-uiux-vue/DatePicker\x27',
              '',
              'const date = ref<Date | null>(null)',
              '</script>',
              '',
              '<template>',
              '  <DatePicker v-model=&quot;date&quot; error />',
              '</template>'
            ]"
          >
            <DatePicker error />
          </ComponentSection>
          <ComponentSection
            title='error="string"'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import DatePicker from \x27m2m-uiux-vue/DatePicker\x27',
              '',
              'const date = ref<Date | null>(null)',
              '</script>',
              '',
              '<template>',
              '  <DatePicker v-model=&quot;date&quot; error=&quot;예약 가능한 날짜를 선택해주세요.&quot; />',
              '</template>'
            ]"
          >
            <DatePicker error="예약 가능한 날짜를 선택해주세요." />
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'month'"
          title="월 선택기 — 헤더 'N월' 클릭"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import DatePicker from \x27m2m-uiux-vue/DatePicker\x27',
            '',
            'const date = ref<Date | null>(null)',
            '</script>',
            '',
            '<template>',
            '  <DatePicker v-model=&quot;date&quot; show-month-picker />',
            '</template>'
          ]"
          :notes="['헤더의 \x27N월\x27 클릭 → 월 선택 패널 → 해당 월 날짜 뷰로 전환']"
        >
          <DatePicker show-month-picker :show-year-picker="false" />
        </ComponentSection>

        <template v-else-if="tab === 'day'">
          <ComponentSection
            title="showTodayDot — 오늘 날짜 점 강조"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import DatePicker from \x27m2m-uiux-vue/DatePicker\x27',
              '',
              'const date = ref<Date | null>(null)',
              '</script>',
              '',
              '<template>',
              '  <DatePicker v-model=&quot;date&quot; show-today-dot />',
              '</template>'
            ]"
          >
            <DatePicker show-today-dot />
          </ComponentSection>
          <ComponentSection
            title="showWeekend — 일(빨강)/토(파랑)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import DatePicker from \x27m2m-uiux-vue/DatePicker\x27',
              '',
              'const date = ref<Date | null>(null)',
              '</script>',
              '',
              '<template>',
              '  <DatePicker v-model=&quot;date&quot; show-weekend />',
              '</template>'
            ]"
          >
            <DatePicker show-weekend />
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'year'"
          title="연도 선택기 — 헤더 'YYYY년' 클릭"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import DatePicker from \x27m2m-uiux-vue/DatePicker\x27',
            '',
            'const date = ref<Date | null>(null)',
            '</script>',
            '',
            '<template>',
            '  <DatePicker v-model=&quot;date&quot; show-year-picker />',
            '</template>'
          ]"
          :notes="['\x27YYYY년\x27 클릭 → 연도 패널, ‹ › 로 12년 단위 이동']"
        >
          <DatePicker show-year-picker :show-month-picker="false" />
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
