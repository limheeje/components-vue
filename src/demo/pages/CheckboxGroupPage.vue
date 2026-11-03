<script setup lang="ts">
import {defineComponent, h, ref} from 'vue'

import CheckboxGroup, {CHECKBOX_GROUP_DIRECTION, CHECKBOX_GROUP_SIZE} from '~/components/CheckboxGroup'
import type {CheckboxGroupOption} from '~/components/CheckboxGroup'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['options', 'value', 'direction', 'size', 'disabled', 'min', 'max']

const TECH: CheckboxGroupOption[] = [
  {value: 'react', label: 'React'},
  {value: 'vue', label: 'Vue.js'},
  {value: 'angular', label: 'Angular'},
  {value: 'svelte', label: 'Svelte'},
  {value: 'nextjs', label: 'Next.js'}
]
const FOOD: CheckboxGroupOption[] = [
  {value: 'pizza', label: '피자'},
  {value: 'burger', label: '버거'},
  {value: 'sushi', label: '스시', disabled: true},
  {value: 'pasta', label: '파스타'}
]
const DAY: CheckboxGroupOption[] = [
  {value: 'mon', label: '월'},
  {value: 'tue', label: '화'},
  {value: 'wed', label: '수'},
  {value: 'thu', label: '목'},
  {value: 'fri', label: '금'},
  {value: 'sat', label: '토'},
  {value: 'sun', label: '일'}
]
// 하드코딩 문자열 대신 export 상수(CHECKBOX_GROUP_SIZE) 키로 관리
const SIZES: (keyof typeof CHECKBOX_GROUP_SIZE)[] = ['SM', 'MD', 'LG']

const Live = defineComponent({
  name: 'CheckboxGroupLive',
  props: {
    options: {type: Array as () => CheckboxGroupOption[], required: true},
    initial: {type: Array as () => string[], default: () => []},
    label: {type: String, default: '선택값'},
    direction: {type: String, default: undefined},
    size: {type: String, default: undefined},
    disabled: {type: Boolean, default: false},
    min: {type: Number, default: undefined},
    max: {type: Number, default: undefined}
  },
  setup(p) {
    const value = ref<string[]>([...p.initial])
    return () =>
      h('div', {class: 'demo-col'}, [
        h(CheckboxGroup, {
          options: p.options,
          modelValue: value.value,
          direction: p.direction,
          size: p.size,
          disabled: p.disabled,
          min: p.min,
          max: p.max,
          'onUpdate:modelValue': (v: string[]) => (value.value = v)
        }),
        h('span', {class: 'demo-hint'}, `${p.label}: ${value.value.length ? `[${value.value.join(', ')}]` : '없음'}`)
      ])
  }
})
</script>

<template>
  <div>
    <PageHeader
      title="CheckboxGroup"
      component="CheckboxGroup"
      desc="— 여러 항목을 동시에 선택할 수 있는 체크박스 그룹 컴포넌트. min/max 로 선택 개수를 제어합니다."
    />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <template v-if="tab === 'options'">
          <ComponentSection
            title="options — 항목 배열"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import CheckboxGroup from \x27m2m-uiux-vue/CheckboxGroup\x27',
              '',
              'const options = [',
              '  {value: \x27react\x27, label: \x27React\x27},',
              '  {value: \x27vue\x27, label: \x27Vue.js\x27},',
              '  {value: \x27nextjs\x27, label: \x27Next.js\x27}',
              ']',
              'const selected = ref([\x27react\x27])',
              '</script>',
              '',
              '<template>',
              '  <CheckboxGroup :options=&quot;options&quot; v-model=&quot;selected&quot; />',
              '</template>'
            ]"
            :notes="['disabled 필드로 개별 항목 비활성화 가능']"
          >
            <Live :options="TECH" :initial="['react', 'nextjs']" label="선택된 기술" />
          </ComponentSection>
          <ComponentSection
            title="개별 disabled 항목 포함"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import CheckboxGroup from \x27m2m-uiux-vue/CheckboxGroup\x27',
              '',
              'const options = [',
              '  {value: \x27pizza\x27, label: \x27피자\x27},',
              '  {value: \x27sushi\x27, label: \x27스시\x27, disabled: true},',
              '  {value: \x27pasta\x27, label: \x27파스타\x27}',
              ']',
              'const selected = ref([\x27pizza\x27])',
              '</script>',
              '',
              '<template>',
              '  <CheckboxGroup :options=&quot;options&quot; v-model=&quot;selected&quot; />',
              '</template>'
            ]"
            :notes="['disabled 항목은 클릭해도 선택되지 않습니다']"
          >
            <Live :options="FOOD" :initial="['pizza']" />
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'value'">
          <ComponentSection
            title="v-model — 선택된 값 배열"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import CheckboxGroup from \x27m2m-uiux-vue/CheckboxGroup\x27',
              '',
              'const options = [',
              '  {value: \x27react\x27, label: \x27React\x27},',
              '  {value: \x27vue\x27, label: \x27Vue.js\x27}',
              ']',
              'const selected = ref([\x27react\x27, \x27vue\x27])',
              '</script>',
              '',
              '<template>',
              '  <CheckboxGroup :options=&quot;options&quot; v-model=&quot;selected&quot; />',
              '</template>'
            ]"
            :notes="['v-model 은 string[] 타입', '비어 있으면 [] 전달', '@change 로도 수신 가능']"
          >
            <Live :options="TECH" :initial="['react', 'vue', 'nextjs']" />
          </ComponentSection>
          <ComponentSection
            title="전체 해제 상태"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import CheckboxGroup from \x27m2m-uiux-vue/CheckboxGroup\x27',
              '',
              'const options = [{value: \x27react\x27, label: \x27React\x27}, {value: \x27vue\x27, label: \x27Vue.js\x27}]',
              'const selected = ref([])',
              '</script>',
              '',
              '<template>',
              '  <CheckboxGroup :options=&quot;options&quot; v-model=&quot;selected&quot; />',
              '</template>'
            ]"
          >
            <Live :options="TECH" :initial="[]" />
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'direction'">
          <ComponentSection
            title='direction="vertical" (기본)'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              `import CheckboxGroup, {CHECKBOX_GROUP_DIRECTION} from \x27m2m-uiux-vue/CheckboxGroup\x27`,
              '',
              'const options = [{value: \x27react\x27, label: \x27React\x27}, {value: \x27vue\x27, label: \x27Vue.js\x27}]',
              'const selected = ref([\x27react\x27])',
              '</script>',
              '',
              '<template>',
              '  <CheckboxGroup :options=&quot;options&quot; v-model=&quot;selected&quot; :direction=&quot;CHECKBOX_GROUP_DIRECTION[\x27VERTICAL\x27]&quot; />',
              '</template>'
            ]"
          >
            <Live :options="TECH.slice(0, 4)" :initial="['react']" />
          </ComponentSection>
          <ComponentSection
            title='direction="horizontal" — 가로 나열'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              `import CheckboxGroup, {CHECKBOX_GROUP_DIRECTION} from \x27m2m-uiux-vue/CheckboxGroup\x27`,
              '',
              'const options = [{value: \x27mon\x27, label: \x27월\x27}, {value: \x27tue\x27, label: \x27화\x27}, {value: \x27wed\x27, label: \x27수\x27}]',
              'const selected = ref([\x27mon\x27, \x27wed\x27])',
              '</script>',
              '',
              '<template>',
              '  <CheckboxGroup :options=&quot;options&quot; v-model=&quot;selected&quot; :direction=&quot;CHECKBOX_GROUP_DIRECTION[\x27HORIZONTAL\x27]&quot; />',
              '</template>'
            ]"
            :notes="['flex-wrap 이 적용되어 화면 너비에서 자동 줄바꿈']"
          >
            <Live :options="DAY" :initial="['mon', 'wed', 'fri']" :direction="CHECKBOX_GROUP_DIRECTION['HORIZONTAL']" />
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'size'">
          <ComponentSection
            v-for="s in SIZES"
            :key="s"
            :title="`size=&quot;${CHECKBOX_GROUP_SIZE[s]}&quot;${s === 'MD' ? ' (기본)' : ''}`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              `import CheckboxGroup, {CHECKBOX_GROUP_SIZE} from \x27m2m-uiux-vue/CheckboxGroup\x27`,
              '',
              'const options = [{value: \x27react\x27, label: \x27React\x27}, {value: \x27vue\x27, label: \x27Vue.js\x27}]',
              'const selected = ref([\x27react\x27])',
              '</script>',
              '',
              '<template>',
              `  <CheckboxGroup :options=&quot;options&quot; v-model=&quot;selected&quot; :size=&quot;CHECKBOX_GROUP_SIZE[\x27${s}\x27]&quot; />`,
              '</template>'
            ]"
          >
            <Live
              :options="TECH.slice(0, 3)"
              :initial="['react']"
              :size="CHECKBOX_GROUP_SIZE[s]"
              :direction="CHECKBOX_GROUP_DIRECTION['HORIZONTAL']"
            />
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'disabled'"
          title="disabled — 그룹 전체 비활성"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import CheckboxGroup from \x27m2m-uiux-vue/CheckboxGroup\x27',
            '',
            'const options = [{value: \x27react\x27, label: \x27React\x27}, {value: \x27vue\x27, label: \x27Vue.js\x27}]',
            'const selected = ref([\x27react\x27, \x27vue\x27])',
            '</script>',
            '',
            '<template>',
            '  <CheckboxGroup :options=&quot;options&quot; v-model=&quot;selected&quot; disabled />',
            '</template>'
          ]"
        >
          <Live :options="TECH.slice(0, 4)" :initial="['react', 'vue']" disabled />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'min'"
          title="min={1} — 최소 1개 이상 선택 강제"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import CheckboxGroup from \x27m2m-uiux-vue/CheckboxGroup\x27',
            '',
            'const options = [{value: \x27react\x27, label: \x27React\x27}, {value: \x27vue\x27, label: \x27Vue.js\x27}]',
            'const selected = ref([\x27react\x27])',
            '</script>',
            '',
            '<template>',
            '  <CheckboxGroup :options=&quot;options&quot; v-model=&quot;selected&quot; :min=&quot;1&quot; />',
            '</template>'
          ]"
          :notes="['선택 해제 시 min 미만이 되면 차단됩니다']"
        >
          <Live :options="TECH.slice(0, 4)" :initial="['react']" :min="1" />
        </ComponentSection>

        <template v-else-if="tab === 'max'">
          <ComponentSection
            title="max={2} — 최대 2개까지 선택"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import CheckboxGroup from \x27m2m-uiux-vue/CheckboxGroup\x27',
              '',
              'const options = [{value: \x27react\x27, label: \x27React\x27}, {value: \x27vue\x27, label: \x27Vue.js\x27}, {value: \x27nextjs\x27, label: \x27Next.js\x27}]',
              'const selected = ref([\x27react\x27, \x27nextjs\x27])',
              '</script>',
              '',
              '<template>',
              '  <CheckboxGroup :options=&quot;options&quot; v-model=&quot;selected&quot; :max=&quot;2&quot; />',
              '</template>'
            ]"
            :notes="['max 초과 시 나머지 항목이 비활성화됩니다']"
          >
            <Live :options="TECH" :initial="['react', 'nextjs']" :max="2" />
          </ComponentSection>
          <ComponentSection
            title="min={1} + max={3} 조합"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import CheckboxGroup from \x27m2m-uiux-vue/CheckboxGroup\x27',
              '',
              'const options = [{value: \x27react\x27, label: \x27React\x27}, {value: \x27vue\x27, label: \x27Vue.js\x27}, {value: \x27nextjs\x27, label: \x27Next.js\x27}]',
              'const selected = ref([\x27react\x27, \x27vue\x27])',
              '</script>',
              '',
              '<template>',
              '  <CheckboxGroup :options=&quot;options&quot; v-model=&quot;selected&quot; :min=&quot;1&quot; :max=&quot;3&quot; />',
              '</template>'
            ]"
          >
            <Live :options="TECH" :initial="['react', 'vue']" :min="1" :max="3" />
          </ComponentSection>
        </template>
      </template>
    </PropTabs>
  </div>
</template>
