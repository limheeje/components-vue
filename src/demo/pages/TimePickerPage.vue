<script setup lang="ts">
import {ref} from 'vue'

import TimePicker, {TIME_PICKER_FORMAT, TIME_PICKER_SIZE} from '~/components/TimePicker'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['value', 'format', 'size', 'placeholder', 'step', 'clearable', 'disabled', 'error', 'onChange', 'range']

const STEP_ROWS = [
  [1, ' — 1분 단위 (기본)', undefined],
  [5, ' — 5분 단위', undefined],
  [15, ' — 15분 단위', undefined],
  [30, ' — 30분 단위', 'step={30} 이면 00·30분만 선택 가능']
] as const

const time = ref('14:30')
const log = ref<string | null>(null)
const start = ref('09:00')
const end = ref('18:00')
</script>

<template>
  <div>
    <PageHeader
      title="TimePicker"
      component="TimePicker"
      desc="— 시(HH)·분(mm)·초(ss)를 스크롤 휠로 선택하는 팝업 컴포넌트. '확인' 시에만 onChange 를 호출합니다."
    />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <template v-if="tab === 'value'">
          <ComponentSection
            title="v-model — 제어 컴포넌트"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import TimePicker from \x27m2m-uiux-vue/TimePicker\x27',
              '',
              'const time = ref(\x2714:30\x27)',
              '</script>',
              '',
              '<template>',
              '  <TimePicker v-model=&quot;time&quot; />',
              '</template>'
            ]"
            :notes="['v-model 값은 \x27HH:mm\x27 또는 \x27HH:mm:ss\x27 문자열']"
          >
            <div class="demo-col">
              <TimePicker v-model="time" />
              <span class="demo-hint">value: {{ time || '(빈 값)' }}</span>
            </div>
          </ComponentSection>
          <ComponentSection
            title="비선택 상태"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import TimePicker from \x27m2m-uiux-vue/TimePicker\x27',
              '',
              'const time = ref(\x27\x27)',
              '</script>',
              '',
              '<template>',
              '  <TimePicker v-model=&quot;time&quot; />',
              '</template>'
            ]"
          >
            <TimePicker />
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'format'">
          <ComponentSection
            title='format="HH:mm" (기본)'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import TimePicker, {TIME_PICKER_FORMAT} from \x27m2m-uiux-vue/TimePicker\x27`,
              '<\/script>',
              '',
              '<template>',
              '  <TimePicker :format=&quot;TIME_PICKER_FORMAT[\x27HM\x27]&quot; />',
              '</template>'
            ]"
          >
            <TimePicker default-value="09:30" />
          </ComponentSection>
          <ComponentSection
            title='format="HH:mm:ss" — 초 포함'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import TimePicker, {TIME_PICKER_FORMAT} from \x27m2m-uiux-vue/TimePicker\x27`,
              '<\/script>',
              '',
              '<template>',
              '  <TimePicker :format=&quot;TIME_PICKER_FORMAT[\x27HMS\x27]&quot; />',
              '</template>'
            ]"
          >
            <TimePicker default-value="09:30:45" :format="TIME_PICKER_FORMAT['HMS']" />
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'size'"
          title="size"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            `import TimePicker, {TIME_PICKER_SIZE} from \x27m2m-uiux-vue/TimePicker\x27`,
            '<\/script>',
            '',
            '<template>',
            '  <TimePicker :size=&quot;TIME_PICKER_SIZE[\x27LG\x27]&quot; />',
            '</template>'
          ]"
        >
          <div class="demo-col">
            <TimePicker :size="TIME_PICKER_SIZE['SM']" default-value="09:00" />
            <TimePicker :size="TIME_PICKER_SIZE['MD']" default-value="09:00" />
            <TimePicker :size="TIME_PICKER_SIZE['LG']" default-value="09:00" />
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'placeholder'"
          title="placeholder 커스텀"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import TimePicker from \x27m2m-uiux-vue/TimePicker\x27',
            '<\/script>',
            '',
            '<template>',
            '  <TimePicker placeholder=&quot;회의 시작 시간&quot; />',
            '</template>'
          ]"
        >
          <TimePicker placeholder="회의 시작 시간" />
        </ComponentSection>

        <template v-else-if="tab === 'step'">
          <ComponentSection
            v-for="[n, label, note] in STEP_ROWS"
            :key="n"
            :title="`step={${n}}${label}`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import TimePicker from \x27m2m-uiux-vue/TimePicker\x27',
              '<\/script>',
              '',
              '<template>',
              `  <TimePicker :step=&quot;${n}&quot; />`,
              '</template>'
            ]"
            :notes="note ? [note] : undefined"
          >
            <TimePicker default-value="09:00" :step="n" />
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'clearable'"
          title="clearable — ✕ 초기화"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import TimePicker from \x27m2m-uiux-vue/TimePicker\x27',
            '',
            'const time = ref(\x2714:30\x27)',
            '</script>',
            '',
            '<template>',
            '  <TimePicker v-model=&quot;time&quot; clearable />',
            '</template>'
          ]"
        >
          <TimePicker clearable default-value="14:30" />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'disabled'"
          title="disabled"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import TimePicker from \x27m2m-uiux-vue/TimePicker\x27',
            '',
            'const time = ref(\x2714:30\x27)',
            '</script>',
            '',
            '<template>',
            '  <TimePicker v-model=&quot;time&quot; disabled />',
            '</template>'
          ]"
        >
          <TimePicker disabled default-value="14:30" />
        </ComponentSection>

        <template v-else-if="tab === 'error'">
          <ComponentSection
            title="error"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import TimePicker from \x27m2m-uiux-vue/TimePicker\x27',
              '<\/script>',
              '',
              '<template>',
              '  <TimePicker error />',
              '</template>'
            ]"
          >
            <TimePicker error />
          </ComponentSection>
          <ComponentSection
            title='error="string" — 메시지'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import TimePicker from \x27m2m-uiux-vue/TimePicker\x27',
              '<\/script>',
              '',
              '<template>',
              '  <TimePicker error=&quot;근무 시간 내에서 선택해주세요.&quot; />',
              '</template>'
            ]"
          >
            <TimePicker error="근무 시간(09:00~18:00) 내에서 선택해주세요." />
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'onChange'"
          title="onChange — '확인' 클릭 시 콜백"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import TimePicker from \x27m2m-uiux-vue/TimePicker\x27',
            '',
            'const time = ref(\x27\x27)',
            'const onChange = (t) => console.log(t)',
            '</script>',
            '',
            '<template>',
            '  <TimePicker v-model=&quot;time&quot; @change=&quot;onChange&quot; />',
            '</template>'
          ]"
          :notes="['\x27확인\x27 버튼을 눌렀을 때만 @change / update:modelValue 가 호출됩니다']"
        >
          <div class="demo-col">
            <TimePicker default-value="09:00" @change="log = $event" />
            <span class="demo-hint">onChange: {{ log ?? '—' }}</span>
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'range'"
          title="시간 범위 — 두 TimePicker 조합"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import TimePicker from \x27m2m-uiux-vue/TimePicker\x27',
            '',
            'const start = ref(\x2709:00\x27)',
            'const end = ref(\x2718:00\x27)',
            '</script>',
            '',
            '<template>',
            '  <TimePicker v-model=&quot;start&quot; placeholder=&quot;시작 시간&quot; />',
            '  <span>~</span>',
            '  <TimePicker v-model=&quot;end&quot; placeholder=&quot;종료 시간&quot; />',
            '</template>'
          ]"
          :notes="['range 모드는 두 개의 독립된 TimePicker 를 조합합니다']"
        >
          <div style="display: flex; align-items: center; gap: 10px">
            <TimePicker v-model="start" placeholder="시작 시간" />
            <span class="demo-hint">~</span>
            <TimePicker v-model="end" placeholder="종료 시간" />
          </div>
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
