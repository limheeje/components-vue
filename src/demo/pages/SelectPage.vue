<script setup lang="ts">
import {computed, defineComponent, h, ref} from 'vue'

import Select, {SELECT_SIZE} from '~/components/Select'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'
import {useDemoTab} from '~/demo/components/navContext'

const OPTIONS = [
  {label: '서울', value: 'seoul'},
  {label: '부산', value: 'busan'},
  {label: '인천', value: 'incheon'},
  {label: '대구', value: 'daegu'},
  {label: '광주', value: 'gwangju'}
]
const WITH_DISABLED = [
  {label: '서울', value: 'seoul'},
  {label: '부산', value: 'busan', disabled: true},
  {label: '인천', value: 'incheon'}
]
const TABS = [
  'variant',
  'options',
  'value',
  'searchable',
  'disabled',
  'error',
  'size',
  'placeholder',
  'onChange',
  'classNames'
]
// 하드코딩 문자열 대신 export 상수(SELECT_SIZE) 키로 관리
const SIZE_ROWS: {k: keyof typeof SELECT_SIZE; suffix: string}[] = [
  {k: 'SM', suffix: ''},
  {k: 'MD', suffix: ' (기본)'},
  {k: 'LG', suffix: ''}
]
const wrap = 'max-width:320px'

const demoTab = useDemoTab()
const isMulti = computed(() => (demoTab.value.tab ?? 'Default').toLowerCase() === 'multi')
const L = computed(() => (isMulti.value ? 'Select.Multi' : 'Select.Default'))
const desc = computed(() =>
  isMulti.value
    ? '— 다중 선택 드롭다운. value 가 배열 형태이며 선택 항목이 태그 칩으로 표시됩니다.'
    : '— 단일 선택 커스텀 드롭다운(네이티브 select 아님). options 배열로 항목을 정의합니다.'
)

/** 단일/다중 공통 프리뷰 렌더러 */
const S = defineComponent({
  name: 'SelectPreview',
  props: {
    defaultValue: {type: [String, Array], default: undefined},
    options: {type: Array as () => {label: string; value: string; disabled?: boolean}[], default: () => OPTIONS},
    searchable: Boolean,
    disabled: Boolean,
    error: {type: [Boolean, String], default: undefined},
    helperText: {type: String, default: undefined},
    size: {type: String, default: undefined},
    classNames: {type: String, default: undefined}
  },
  setup(p) {
    return () =>
      h(Select, {
        multiple: isMulti.value || undefined,
        options: p.options,
        defaultValue: p.defaultValue ?? (isMulti.value ? [] : ''),
        placeholder: '선택해주세요',
        searchable: p.searchable || undefined,
        disabled: p.disabled || undefined,
        error: p.error,
        helperText: p.helperText,
        size: p.size,
        classNames: p.classNames
      })
  }
})

const OnChangeDemo = defineComponent({
  name: 'SelectOnChangeDemo',
  setup() {
    const single = ref('seoul')
    const multi = ref<string[]>(['seoul'])
    return () =>
      h(
        ComponentSection,
        {
          title: 'onChange 이벤트 핸들러',
          code: isMulti.value
            ? [
                '<script setup lang=&quot;ts&quot;>',
                'import {ref} from \x27vue\x27',
                'import Select from \x27m2m-uiux-vue/Select\x27',
                '',
                'const values = ref<string[]>([])',
                '<\/script>',
                '',
                '<template>',
                '  <Select multiple v-model=&quot;values&quot; :options=&quot;options&quot; />',
                '</template>'
              ]
            : [
                '<script setup lang=&quot;ts&quot;>',
                'import {ref} from \x27vue\x27',
                'import Select from \x27m2m-uiux-vue/Select\x27',
                '',
                'const value = ref(\x27\x27)',
                '<\/script>',
                '',
                '<template>',
                '  <Select v-model=&quot;value&quot; :options=&quot;options&quot; />',
                '</template>'
              ],
          notes: [
            isMulti.value
              ? 'multiple 모드에서 onChange 파라미터는 string[]'
              : '단일 모드에서 onChange 파라미터는 string'
          ]
        },
        {
          default: () =>
            h('div', {class: 'demo-col', style: wrap}, [
              isMulti.value
                ? h(Select, {
                    multiple: true,
                    options: OPTIONS,
                    modelValue: multi.value,
                    placeholder: '선택',
                    'onUpdate:modelValue': (v: string[]) => (multi.value = v)
                  })
                : h(Select, {
                    options: OPTIONS,
                    modelValue: single.value,
                    placeholder: '선택',
                    'onUpdate:modelValue': (v: string) => (single.value = v)
                  }),
              h(
                'span',
                {class: 'demo-hint'},
                `선택값: ${isMulti.value ? multi.value.join(', ') || '(없음)' : single.value || '(없음)'}`
              )
            ])
        }
      )
  }
})
</script>

<template>
  <div>
    <PageHeader :title="L" :component="L" :desc="desc" />
    <PropTabs :key="L" :tabs="TABS">
      <template #default="{tab}">
        <template v-if="tab === 'variant'">
          <ComponentSection
            :title="`${L} — 기본 (클릭해서 열어보세요)`"
            :code="
              isMulti
                ? [
                    '<script setup lang=&quot;ts&quot;>',
                    'import {ref} from \x27vue\x27',
                    'import Select from \x27m2m-uiux-vue/Select\x27',
                    '',
                    'const options = [{ label: \x27서울\x27, value: \x27seoul\x27 }, { label: \x27부산\x27, value: \x27busan\x27 }]',
                    'const selected = ref<string[]>([\x27seoul\x27, \x27busan\x27])',
                    '<\/script>',
                    '',
                    '<template>',
                    '  <Select multiple v-model=&quot;selected&quot; :options=&quot;options&quot; />',
                    '</template>'
                  ]
                : [
                    '<script setup lang=&quot;ts&quot;>',
                    'import {ref} from \x27vue\x27',
                    'import Select from \x27m2m-uiux-vue/Select\x27',
                    '',
                    'const options = [{ label: \x27서울\x27, value: \x27seoul\x27 }, { label: \x27부산\x27, value: \x27busan\x27 }]',
                    'const value = ref(\x27\x27)',
                    '<\/script>',
                    '',
                    '<template>',
                    '  <Select v-model=&quot;value&quot; :options=&quot;options&quot; />',
                    '</template>'
                  ]
            "
            :notes="
              isMulti
                ? ['multiple → value 는 string[]', '태그 칩의 × 클릭으로 개별 제거', '드롭다운은 선택해도 닫히지 않음']
                : ['네이티브 <select> 가 아닌 커스텀 드롭다운 레이어', '선택 항목은 brand-light 배경 + 체크 아이콘']
            "
          >
            <div class="demo-col" :style="wrap">
              <S :default-value="isMulti ? ['seoul', 'busan'] : 'seoul'" />
            </div>
          </ComponentSection>
          <ComponentSection
            :title="isMulti ? '빈 상태' : '미선택 상태'"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import Select from \x27m2m-uiux-vue/Select\x27',
              '',
              `const value = ref(${isMulti ? '<string[]>([])' : '(\x27\x27)'})`,
              '<\/script>',
              '',
              '<template>',
              `  <Select${isMulti ? ' multiple v-model=&quot;value&quot;' : ' v-model=&quot;value&quot;'} :options=&quot;options&quot; />`,
              '</template>'
            ]"
          >
            <div class="demo-col" :style="wrap">
              <S :default-value="isMulti ? [] : ''" />
            </div>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'options'">
          <ComponentSection
            title="options — 기본 배열"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import Select from \x27m2m-uiux-vue/Select\x27',
              '',
              'const options = [',
              '  { label: \x27서울\x27, value: \x27seoul\x27 },',
              '  { label: \x27부산\x27, value: \x27busan\x27 },',
              '  { label: \x27인천\x27, value: \x27incheon\x27 },',
              ']',
              `const value = ref(${isMulti ? '<string[]>([\x27seoul\x27])' : '(\x27seoul\x27)'})`,
              '<\/script>',
              '',
              '<template>',
              `  <Select${isMulti ? ' multiple' : ''} v-model=&quot;value&quot; :options=&quot;options&quot; />`,
              '</template>'
            ]"
          >
            <div class="demo-col" :style="wrap">
              <S :default-value="isMulti ? ['seoul'] : 'seoul'" />
            </div>
          </ComponentSection>
          <ComponentSection
            title="options — 비활성 항목 포함"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import Select from \x27m2m-uiux-vue/Select\x27',
              '',
              'const options = [',
              '  { label: \x27서울\x27, value: \x27seoul\x27 },',
              '  { label: \x27부산\x27, value: \x27busan\x27, disabled: true },',
              '  { label: \x27인천\x27, value: \x27incheon\x27 },',
              ']',
              `const value = ref(${isMulti ? '<string[]>([\x27seoul\x27])' : '(\x27seoul\x27)'})`,
              '<\/script>',
              '',
              '<template>',
              `  <Select${isMulti ? ' multiple' : ''} v-model=&quot;value&quot; :options=&quot;options&quot; />`,
              '</template>'
            ]"
            :notes="['disabled: true 인 항목은 클릭 불가']"
          >
            <div class="demo-col" :style="wrap">
              <S :options="WITH_DISABLED" :default-value="isMulti ? ['seoul'] : 'seoul'" />
            </div>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'value'">
          <ComponentSection
            :title="isMulti ? 'value — 배열 (다중 선택)' : 'value — 선택된 값'"
            :code="
              isMulti
                ? [
                    '<script setup lang=&quot;ts&quot;>',
                    'import {ref} from \x27vue\x27',
                    'import Select from \x27m2m-uiux-vue/Select\x27',
                    '',
                    'const values = ref<string[]>([\x27seoul\x27, \x27busan\x27])',
                    '<\/script>',
                    '',
                    '<template>',
                    '  <Select multiple v-model=&quot;values&quot; :options=&quot;options&quot; />',
                    '</template>'
                  ]
                : [
                    '<script setup lang=&quot;ts&quot;>',
                    'import {ref} from \x27vue\x27',
                    'import Select from \x27m2m-uiux-vue/Select\x27',
                    '',
                    'const value = ref(\x27seoul\x27)',
                    '<\/script>',
                    '',
                    '<template>',
                    '  <Select v-model=&quot;value&quot; :options=&quot;options&quot; />',
                    '</template>'
                  ]
            "
            :notes="[
              isMulti ? 'multiple 모드에서 value 는 반드시 string[] 타입' : 'onChange 인자는 선택된 value 문자열'
            ]"
          >
            <div class="demo-col" :style="wrap">
              <S :default-value="isMulti ? ['seoul', 'busan'] : 'seoul'" />
            </div>
          </ComponentSection>
          <ComponentSection
            :title="isMulti ? 'value — 빈 배열 (미선택)' : 'value — 미선택 상태'"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import Select from \x27m2m-uiux-vue/Select\x27',
              '',
              `const value = ref(${isMulti ? '<string[]>([])' : '(\x27\x27)'})`,
              '<\/script>',
              '',
              '<template>',
              `  <Select${isMulti ? ' multiple' : ''} v-model=&quot;value&quot; :options=&quot;options&quot; />`,
              '</template>'
            ]"
          >
            <div class="demo-col" :style="wrap">
              <S :default-value="isMulti ? [] : ''" />
            </div>
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'searchable'"
          title="searchable={true} — 검색 가능 (클릭 후 입력)"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import Select from \x27m2m-uiux-vue/Select\x27',
            '',
            `const value = ref(${isMulti ? '<string[]>([\x27seoul\x27])' : '(\x27seoul\x27)'})`,
            '<\/script>',
            '',
            '<template>',
            `  <Select${isMulti ? ' multiple' : ''} searchable v-model=&quot;value&quot; :options=&quot;options&quot; />`,
            '</template>'
          ]"
          :notes="['드롭다운 상단에 검색 입력창 자동 삽입', 'label 포함 검색, &quot;결과 없음&quot; 표시']"
        >
          <div class="demo-col" :style="wrap">
            <S searchable :default-value="isMulti ? ['seoul'] : 'seoul'" />
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'disabled'"
          title="disabled={true}"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Select from \x27m2m-uiux-vue/Select\x27',
            '<\/script>',
            '',
            '<template>',
            `  <Select${isMulti ? ' multiple' : ''} disabled :options=&quot;options&quot; />`,
            '</template>'
          ]"
          :notes="['클릭 및 키보드 조작 불가', '배경 회색 처리']"
        >
          <div class="demo-col" :style="wrap">
            <S disabled :default-value="isMulti ? ['seoul'] : 'seoul'" />
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'error'"
          title="error / helperText"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Select from \x27m2m-uiux-vue/Select\x27',
            '<\/script>',
            '',
            '<template>',
            `  <Select${isMulti ? ' multiple' : ''} error=&quot;지역을 선택하세요.&quot; :options=&quot;options&quot; />`,
            '</template>'
          ]"
          :notes="['error 에 boolean 또는 string 전달 가능', 'string 전달 시 하단 메시지 자동 표시']"
        >
          <div class="demo-col" :style="wrap">
            <S error="지역을 선택하세요." :default-value="isMulti ? [] : ''" />
            <S helper-text="배송 가능 지역만 표시됩니다." :default-value="isMulti ? [] : ''" />
          </div>
        </ComponentSection>

        <template v-else-if="tab === 'size'">
          <ComponentSection
            v-for="{k, suffix} in SIZE_ROWS"
            :key="k"
            :title="`size=&quot;${SELECT_SIZE[k]}&quot;${suffix}`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Select, {SELECT_SIZE} from \x27m2m-uiux-vue/Select\x27`,
              '<\/script>',
              '',
              '<template>',
              `  <Select${isMulti ? ' multiple' : ''} :size=&quot;SELECT_SIZE[\x27${k}\x27]&quot; :options=&quot;options&quot; />`,
              '</template>'
            ]"
            :notes="k === 'MD' ? ['size 기본값은 md'] : undefined"
          >
            <div class="demo-col" :style="wrap">
              <S :size="SELECT_SIZE[k]" :default-value="isMulti ? ['seoul'] : 'seoul'" />
            </div>
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'placeholder'"
          title="placeholder — 안내 텍스트"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Select from \x27m2m-uiux-vue/Select\x27',
            '<\/script>',
            '',
            '<template>',
            `  <Select${isMulti ? ' multiple' : ''} placeholder=&quot;도시를 선택해주세요&quot; :options=&quot;options&quot; />`,
            '</template>'
          ]"
          :notes="['value 가 비어있을 때 placeholder 표시']"
        >
          <div class="demo-col" :style="wrap">
            <S :default-value="isMulti ? [] : ''" />
          </div>
        </ComponentSection>

        <OnChangeDemo v-else-if="tab === 'onChange'" />

        <ComponentSection
          v-else-if="tab === 'classNames'"
          title="classNames — 추가 스타일"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Select from \x27m2m-uiux-vue/Select\x27',
            '<\/script>',
            '',
            '<template>',
            `  <Select${isMulti ? ' multiple' : ''} class-names=&quot;w-full&quot; :options=&quot;options&quot; />`,
            '</template>'
          ]"
          :notes="['classNames prop 은 문자열 또는 배열 허용']"
        >
          <div class="demo-col" :style="wrap">
            <S class-names="demo-hint" :default-value="isMulti ? [] : ''" />
          </div>
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
