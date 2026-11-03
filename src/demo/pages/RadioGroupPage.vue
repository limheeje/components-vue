<script setup lang="ts">
import {defineComponent, h, ref} from 'vue'

import RadioGroup, {RADIO_GROUP_DIRECTION, RADIO_GROUP_SIZE} from '~/components/RadioGroup'
import type {RadioGroupOption} from '~/components/RadioGroup'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['options', 'value', 'direction', 'size', 'disabled', 'name']

const CITY: RadioGroupOption[] = [
  {label: '서울', value: 'seoul'},
  {label: '부산', value: 'busan'},
  {label: '인천', value: 'incheon'}
]

const GENDER: RadioGroupOption[] = [
  {label: '남성', value: 'male'},
  {label: '여성', value: 'female'},
  {label: '기타', value: 'other'}
]

const CITY_PARTIAL: RadioGroupOption[] = [
  {label: '서울', value: 'seoul'},
  {label: '부산 (비활성)', value: 'busan', disabled: true},
  {label: '인천', value: 'incheon'}
]

// 하드코딩 문자열 대신 export 상수(RADIO_GROUP_SIZE) 키로 관리
const SIZES: (keyof typeof RADIO_GROUP_SIZE)[] = ['SM', 'MD', 'LG']

const Live = defineComponent({
  name: 'RadioGroupLive',
  props: {
    options: {type: Array as () => RadioGroupOption[], required: true},
    initial: {type: String, default: undefined},
    direction: {type: String, default: undefined},
    size: {type: String, default: undefined},
    disabled: {type: Boolean, default: false},
    name: {type: String, default: undefined}
  },
  setup(p) {
    const value = ref(p.initial ?? p.options[0]?.value ?? '')
    return () =>
      h('div', {class: 'demo-col'}, [
        h(RadioGroup, {
          options: p.options,
          modelValue: value.value,
          direction: p.direction,
          size: p.size,
          disabled: p.disabled,
          name: p.name,
          'onUpdate:modelValue': (v: string) => (value.value = v)
        }),
        h('span', {class: 'demo-hint'}, `value: ${value.value || '없음'}`)
      ])
  }
})
</script>

<template>
  <div>
    <PageHeader
      title="RadioGroup"
      component="RadioGroup"
      desc="— 단일 선택 라디오 그룹. options 배열로 Radio 를 렌더하고 name 을 자동으로 묶습니다."
    />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <ComponentSection
          v-if="tab === 'options'"
          title="options — 항목 배열"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import RadioGroup from \x27m2m-uiux-vue/RadioGroup\x27',
            '',
            'const options = [',
            '  { label: \x27서울\x27, value: \x27seoul\x27 },',
            '  { label: \x27부산\x27, value: \x27busan\x27 },',
            ']',
            'const city = ref(\x27seoul\x27)',
            '</script>',
            '',
            '<template>',
            '  <RadioGroup :options=&quot;options&quot; v-model=&quot;city&quot; />',
            '</template>'
          ]"
        >
          <Live :options="CITY" />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'value'"
          title="v-model — 제어 컴포넌트"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import RadioGroup from \x27m2m-uiux-vue/RadioGroup\x27',
            '',
            'const options = [{label: \x27서울\x27, value: \x27seoul\x27}, {label: \x27부산\x27, value: \x27busan\x27}]',
            'const city = ref(\x27busan\x27)',
            '</script>',
            '',
            '<template>',
            '  <RadioGroup :options=&quot;options&quot; v-model=&quot;city&quot; />',
            '</template>'
          ]"
          :notes="['v-model 값과 일치하는 옵션이 선택됨', '@change 로 선택된 value 문자열도 수신 가능']"
        >
          <Live :options="CITY" initial="busan" />
        </ComponentSection>

        <template v-else-if="tab === 'direction'">
          <ComponentSection
            title='direction="vertical" (기본)'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              `import RadioGroup, {RADIO_GROUP_DIRECTION} from \x27m2m-uiux-vue/RadioGroup\x27`,
              '',
              'const value = ref(\x27seoul\x27)',
              'const options = [{label: \x27서울\x27, value: \x27seoul\x27}, {label: \x27부산\x27, value: \x27busan\x27}]',
              '</script>',
              '',
              '<template>',
              '  <RadioGroup v-model=&quot;value&quot; :options=&quot;options&quot; :direction=&quot;RADIO_GROUP_DIRECTION[\x27VERTICAL\x27]&quot; />',
              '</template>'
            ]"
          >
            <Live :options="CITY" />
          </ComponentSection>
          <ComponentSection
            title='direction="horizontal" — 가로 배치'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              `import RadioGroup, {RADIO_GROUP_DIRECTION} from \x27m2m-uiux-vue/RadioGroup\x27`,
              '',
              'const value = ref(\x27male\x27)',
              'const options = [{label: \x27남성\x27, value: \x27male\x27}, {label: \x27여성\x27, value: \x27female\x27}]',
              '</script>',
              '',
              '<template>',
              '  <RadioGroup v-model=&quot;value&quot; :options=&quot;options&quot; :direction=&quot;RADIO_GROUP_DIRECTION[\x27HORIZONTAL\x27]&quot; />',
              '</template>'
            ]"
          >
            <Live :options="GENDER" :direction="RADIO_GROUP_DIRECTION['HORIZONTAL']" />
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'size'">
          <ComponentSection
            v-for="s in SIZES"
            :key="s"
            :title="`size=&quot;${RADIO_GROUP_SIZE[s]}&quot;${s === 'MD' ? ' (기본)' : ''}`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              `import RadioGroup, {RADIO_GROUP_SIZE} from \x27m2m-uiux-vue/RadioGroup\x27`,
              '',
              'const value = ref(\x27seoul\x27)',
              'const options = [{label: \x27서울\x27, value: \x27seoul\x27}, {label: \x27부산\x27, value: \x27busan\x27}]',
              '</script>',
              '',
              '<template>',
              `  <RadioGroup v-model=&quot;value&quot; :options=&quot;options&quot; :size=&quot;RADIO_GROUP_SIZE[\x27${s}\x27]&quot; />`,
              '</template>'
            ]"
          >
            <Live :options="CITY" :size="RADIO_GROUP_SIZE[s]" :direction="RADIO_GROUP_DIRECTION['HORIZONTAL']" />
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'disabled'">
          <ComponentSection
            title="disabled — 그룹 전체 비활성"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import RadioGroup from \x27m2m-uiux-vue/RadioGroup\x27',
              '',
              'const value = ref(\x27seoul\x27)',
              'const options = [{label: \x27서울\x27, value: \x27seoul\x27}, {label: \x27부산\x27, value: \x27busan\x27}]',
              '</script>',
              '',
              '<template>',
              '  <RadioGroup v-model=&quot;value&quot; :options=&quot;options&quot; disabled />',
              '</template>'
            ]"
          >
            <Live :options="CITY" disabled />
          </ComponentSection>
          <ComponentSection
            title="그룹 내 일부 disabled"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import RadioGroup from \x27m2m-uiux-vue/RadioGroup\x27',
              '',
              'const value = ref(\x27seoul\x27)',
              'const options = [',
              '  { label: \x27서울\x27, value: \x27seoul\x27 },',
              '  { label: \x27부산\x27, value: \x27busan\x27, disabled: true },',
              '  { label: \x27인천\x27, value: \x27incheon\x27 },',
              ']',
              '</script>',
              '',
              '<template>',
              '  <RadioGroup v-model=&quot;value&quot; :options=&quot;options&quot; />',
              '</template>'
            ]"
          >
            <Live :options="CITY_PARTIAL" />
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'name'"
          title="name — HTML name 속성"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import RadioGroup from \x27m2m-uiux-vue/RadioGroup\x27',
            '',
            'const value = ref(\x27seoul\x27)',
            'const options = [{label: \x27서울\x27, value: \x27seoul\x27}, {label: \x27부산\x27, value: \x27busan\x27}]',
            '</script>',
            '',
            '<template>',
            '  <RadioGroup name=&quot;city&quot; v-model=&quot;value&quot; :options=&quot;options&quot; />',
            '</template>'
          ]"
          :notes="['생략하면 useId 로 자동 생성됩니다']"
        >
          <Live :options="CITY" name="city" />
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
