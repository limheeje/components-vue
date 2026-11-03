<script setup lang="ts">
import {defineComponent, h, ref} from 'vue'

import Segmented, {SEGMENTED_SIZE} from '~/components/Segmented'
import type {SegmentedOption} from '~/components/Segmented'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['options', 'size', 'disabled', 'block']

const CHANNEL: SegmentedOption[] = [
  {label: '공통', value: 'common'},
  {label: 'B2C', value: 'b2c'},
  {label: 'C2C', value: 'c2c'},
  {label: 'B2B', value: 'b2b'}
]

const CHANNEL_PARTIAL: SegmentedOption[] = [
  {label: '공통', value: 'common'},
  {label: 'B2C', value: 'b2c'},
  {label: 'B2B (비활성)', value: 'b2b', disabled: true}
]

// 하드코딩 문자열 대신 export 상수(SEGMENTED_SIZE) 키로 관리
const SIZES: (keyof typeof SEGMENTED_SIZE)[] = ['SM', 'MD', 'LG']

const Live = defineComponent({
  name: 'SegmentedLive',
  props: {
    options: {type: Array as () => SegmentedOption[], required: true},
    initial: {type: String, default: undefined},
    size: {type: String, default: undefined},
    disabled: {type: Boolean, default: false},
    block: {type: Boolean, default: false}
  },
  setup(p) {
    const value = ref(p.initial ?? p.options[0]?.value ?? '')
    const last = ref('')
    return () =>
      h('div', {class: 'demo-col'}, [
        h(Segmented, {
          options: p.options,
          modelValue: value.value,
          size: p.size,
          disabled: p.disabled,
          block: p.block,
          'onUpdate:modelValue': (v: string) => (value.value = v),
          onChange: (_v: string, opt: SegmentedOption) => {
            last.value = String(opt.value)
          }
        }),
        h(
          'span',
          {class: 'demo-hint'},
          `value: ${value.value || '없음'}${last.value ? ` · 마지막 클릭: ${last.value}` : ''}`
        )
      ])
  }
})
</script>

<template>
  <div>
    <PageHeader
      title="Segmented"
      component="Segmented"
      desc="— 붙은 세그먼트(회색 트랙 + 흰 알약) 단일 선택 컨트롤. Ant Design Segmented 착안. 크기는 Input 필드와 동일."
    />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <ComponentSection
          v-if="tab === 'options'"
          title="options / v-model — 항목 배열 + 양방향 바인딩"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import Segmented from \x27m2m-uiux-vue/Segmented\x27',
            '',
            'const options = [\x27공통\x27, \x27B2C\x27, \x27C2C\x27, \x27B2B\x27] // 문자열 또는 { label, value } 객체',
            'const channel = ref(\x27b2c\x27)',
            '</script>',
            '',
            '<template>',
            '  &lt;!-- 선택된 버튼의 value 가 v-model 로 전달되어 활성화 --&gt;',
            '  <Segmented :options=&quot;options&quot; v-model=&quot;channel&quot; />',
            '</template>'
          ]"
          :notes="[
            'options 항목이 문자열이면 label·value 동일로 취급',
            'v-model 없이 @change (선택된 value, 옵션 객체) 로도 수신 가능'
          ]"
        >
          <Live :options="CHANNEL" initial="b2c" />
        </ComponentSection>

        <template v-else-if="tab === 'size'">
          <ComponentSection
            v-for="s in SIZES"
            :key="s"
            :title="`size=&quot;${SEGMENTED_SIZE[s]}&quot;${s === 'MD' ? ' (기본)' : ''} — Input 필드와 동일 높이`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              `import Segmented, {SEGMENTED_SIZE} from \x27m2m-uiux-vue/Segmented\x27`,
              '',
              'const value = ref(\x27common\x27)',
              'const options = [\x27공통\x27, \x27B2C\x27, \x27C2C\x27]',
              '</script>',
              '',
              '<template>',
              `  <Segmented v-model=&quot;value&quot; :options=&quot;options&quot; :size=&quot;SEGMENTED_SIZE[\x27${s}\x27]&quot; />`,
              '</template>'
            ]"
          >
            <Live :options="CHANNEL" :size="SEGMENTED_SIZE[s]" />
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'disabled'">
          <ComponentSection
            title="disabled — 그룹 전체 비활성"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import Segmented from \x27m2m-uiux-vue/Segmented\x27',
              '',
              'const value = ref(\x27common\x27)',
              'const options = [\x27공통\x27, \x27B2C\x27, \x27C2C\x27]',
              '</script>',
              '',
              '<template>',
              '  <Segmented v-model=&quot;value&quot; :options=&quot;options&quot; disabled />',
              '</template>'
            ]"
          >
            <Live :options="CHANNEL" disabled />
          </ComponentSection>
          <ComponentSection
            title="그룹 내 일부 disabled"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import Segmented from \x27m2m-uiux-vue/Segmented\x27',
              '',
              'const value = ref(\x27common\x27)',
              'const options = [',
              '  { label: \x27공통\x27, value: \x27common\x27 },',
              '  { label: \x27B2C\x27, value: \x27b2c\x27 },',
              '  { label: \x27B2B\x27, value: \x27b2b\x27, disabled: true },',
              ']',
              '</script>',
              '',
              '<template>',
              '  <Segmented v-model=&quot;value&quot; :options=&quot;options&quot; />',
              '</template>'
            ]"
          >
            <Live :options="CHANNEL_PARTIAL" />
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'block'"
          title="block — 부모 너비를 꽉 채우고 균등 분배"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import Segmented from \x27m2m-uiux-vue/Segmented\x27',
            '',
            'const value = ref(\x27common\x27)',
            'const options = [\x27공통\x27, \x27B2C\x27, \x27C2C\x27, \x27B2B\x27]',
            '</script>',
            '',
            '<template>',
            '  <Segmented block v-model=&quot;value&quot; :options=&quot;options&quot; />',
            '</template>'
          ]"
          :notes="['기본값은 내용 너비만큼만 차지합니다']"
        >
          <div style="width: 420px; max-width: 100%">
            <Live :options="CHANNEL" block />
          </div>
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
