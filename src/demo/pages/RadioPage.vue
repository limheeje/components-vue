<script setup lang="ts">
import {defineComponent, h, ref} from 'vue'

import Radio from '~/components/Radio'
import RadioGroup, {RADIO_GROUP_DIRECTION, RADIO_GROUP_SIZE} from '~/components/RadioGroup'
import type {RadioGroupOption} from '~/components/RadioGroup'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['checked', 'disabled', 'size', 'value', 'name', 'group', 'onChange', 'classNames']

const radioModel = ref('a')

const CITY: RadioGroupOption[] = [
  {label: '서울', value: 'seoul'},
  {label: '부산', value: 'busan'},
  {label: '인천', value: 'incheon'}
]
// 하드코딩 문자열 대신 export 상수(RADIO_GROUP_SIZE) 키로 관리
const SIZES: (keyof typeof RADIO_GROUP_SIZE)[] = ['SM', 'MD', 'LG']

const GENDER_NAMED: RadioGroupOption[] = [
  {label: "남성 (name='gender')", value: 'male'},
  {label: "여성 (name='gender')", value: 'female'}
]

/** 제어 RadioGroup + 선택값 표시 */
const GroupLive = defineComponent({
  name: 'RadioGroupLive',
  props: {
    options: {type: Array as () => RadioGroupOption[], required: true},
    defaultValue: {type: String, default: undefined},
    direction: {type: String as () => 'horizontal' | 'vertical', default: undefined},
    size: {type: String as () => 'sm' | 'md' | 'lg', default: undefined},
    name: {type: String, required: true}
  },
  setup(p) {
    const value = ref(p.defaultValue ?? p.options[0]?.value ?? '')
    return () =>
      h('div', {class: 'demo-col'}, [
        h(RadioGroup, {
          options: p.options,
          name: p.name,
          direction: p.direction,
          size: p.size,
          modelValue: value.value,
          'onUpdate:modelValue': (v: string) => (value.value = v)
        }),
        h('span', {class: 'demo-hint'}, `선택: ${value.value}`)
      ])
  }
})
</script>

<template>
  <div>
    <PageHeader
      title="Radio"
      component="Radio"
      desc="— 라디오 버튼 컴포넌트. value 와 name prop 으로 그룹을 지정합니다."
    />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <ComponentSection
          v-if="tab === 'checked'"
          title="checked — 선택 상태 (클릭해보세요)"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import Radio from \x27m2m-uiux-vue/Radio\x27',
            '',
            'const value = ref(\x27a\x27)',
            '// boolean 방식이 필요하면 v-model:checked 도 지원',
            '</script>',
            '',
            '<template>',
            '  &lt;!-- v-model 값과 각 Radio 의 value 가 일치하는 항목이 선택됨 --&gt;',
            '  <Radio name=&quot;opt&quot; v-model=&quot;value&quot; value=&quot;a&quot; label=&quot;선택됨&quot; />',
            '  <Radio name=&quot;opt&quot; v-model=&quot;value&quot; value=&quot;b&quot; label=&quot;미선택&quot; />',
            '</template>'
          ]"
        >
          <div class="demo-col">
            <Radio name="opt" v-model="radioModel" value="a" label="선택됨" />
            <Radio name="opt" v-model="radioModel" value="b" label="미선택" />
            <span class="demo-hint">value: {{ radioModel }}</span>
          </div>
        </ComponentSection>

        <template v-else-if="tab === 'disabled'">
          <ComponentSection
            title="disabled={true} — 선택 상태"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Radio from \x27m2m-uiux-vue/Radio\x27',
              '</script>',
              '',
              '<template>',
              '  <Radio checked disabled label=&quot;비활성 선택&quot; />',
              '</template>'
            ]"
          >
            <Radio name="d1" value="a" checked disabled label="비활성 선택" />
          </ComponentSection>
          <ComponentSection
            title="disabled={true} — 미선택 상태"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Radio from \x27m2m-uiux-vue/Radio\x27',
              '</script>',
              '',
              '<template>',
              '  <Radio disabled label=&quot;비활성 미선택&quot; />',
              '</template>'
            ]"
          >
            <Radio name="d2" value="a" disabled label="비활성 미선택" />
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
              '  <RadioGroup name=&quot;city&quot; v-model=&quot;value&quot; :options=&quot;options&quot; />',
              '</template>'
            ]"
          >
            <GroupLive
              name="d3"
              :options="[
                {label: '서울', value: 'seoul'},
                {label: '부산 (비활성)', value: 'busan', disabled: true},
                {label: '인천', value: 'incheon'}
              ]"
              default-value="seoul"
            />
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
            <GroupLive
              :name="`sz-${s}`"
              :options="CITY"
              default-value="seoul"
              :size="RADIO_GROUP_SIZE[s]"
              :direction="RADIO_GROUP_DIRECTION['HORIZONTAL']"
            />
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'value'"
          title="value — 라디오 고유 값 (클릭해보세요)"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import Radio from \x27m2m-uiux-vue/Radio\x27',
            '',
            'const city = ref(\x27seoul\x27)',
            '</script>',
            '',
            '<template>',
            '  <Radio name=&quot;city&quot; value=&quot;seoul&quot; :checked=&quot;city === \x27seoul\x27&quot; @change=&quot;city = $event.target.value&quot; label=&quot;서울&quot; />',
            '</template>'
          ]"
          :notes="['value 는 해당 라디오가 나타내는 고유 식별 값', 'checked 와 value 를 비교해 활성 상태를 제어']"
        >
          <GroupLive name="val" :options="CITY" default-value="seoul" />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'name'"
          title="name — 그룹 네임스페이스"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import Radio from \x27m2m-uiux-vue/Radio\x27',
            'import RadioGroup from \x27m2m-uiux-vue/RadioGroup\x27',
            '',
            'const value = ref(\x27male\x27)',
            'const options = [{label: \x27남성\x27, value: \x27male\x27}, {label: \x27여성\x27, value: \x27female\x27}]',
            '</script>',
            '',
            '<template>',
            '  &lt;!-- name 이 같은 라디오들은 하나의 그룹으로 묶임 --&gt;',
            '  <Radio name=&quot;gender&quot; v-model=&quot;value&quot; value=&quot;male&quot; label=&quot;남성&quot; />',
            '  <Radio name=&quot;gender&quot; v-model=&quot;value&quot; value=&quot;female&quot; label=&quot;여성&quot; />',
            '  &lt;!-- RadioGroup 사용 시 name 을 그룹에서 한 번만 선언 --&gt;',
            '  <RadioGroup name=&quot;gender&quot; v-model=&quot;value&quot; :options=&quot;options&quot; />',
            '</template>'
          ]"
          :notes="['HTML name 속성으로 라디오 그룹을 구분', 'RadioGroup 은 name 생략 시 useId 로 자동 생성']"
        >
          <GroupLive name="gender" :options="GENDER_NAMED" default-value="male" />
        </ComponentSection>

        <template v-else-if="tab === 'group'">
          <ComponentSection
            title="RadioGroup — 세로 배치 (기본)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import RadioGroup from \x27m2m-uiux-vue/RadioGroup\x27',
              '',
              'const options = [',
              '  { label: \x27옵션 A\x27, value: \x27a\x27 },',
              '  { label: \x27옵션 B\x27, value: \x27b\x27 },',
              '  { label: \x27옵션 C\x27, value: \x27c\x27 },',
              ']',
              'const value = ref(\x27a\x27)',
              '</script>',
              '',
              '<template>',
              '  <RadioGroup name=&quot;option&quot; :options=&quot;options&quot; v-model=&quot;value&quot; />',
              '</template>'
            ]"
            :notes="['v-model 매칭되는 value 의 라디오가 선택됨', '@change 로 선택된 value 문자열도 함께 수신 가능']"
          >
            <GroupLive
              name="grp-v"
              :options="[
                {label: '옵션 A', value: 'a'},
                {label: '옵션 B', value: 'b'},
                {label: '옵션 C', value: 'c'}
              ]"
              default-value="a"
            />
          </ComponentSection>
          <ComponentSection
            title='RadioGroup — direction="horizontal" 가로 배치'
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
            :notes="[
              'direction: RADIO_GROUP_DIRECTION[\x27HORIZONTAL\x27] | RADIO_GROUP_DIRECTION[\x27VERTICAL\x27] (기본값 vertical)'
            ]"
          >
            <GroupLive
              name="grp-h"
              :options="[
                {label: '남성', value: 'male'},
                {label: '여성', value: 'female'},
                {label: '기타', value: 'other'}
              ]"
              default-value="male"
              :direction="RADIO_GROUP_DIRECTION['HORIZONTAL']"
            />
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'onChange'"
          title="onChange 이벤트 핸들러 (클릭해보세요)"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import RadioGroup from \x27m2m-uiux-vue/RadioGroup\x27',
            '',
            'const selected = ref(\x27seoul\x27)',
            'const options = [{label: \x27서울\x27, value: \x27seoul\x27}, {label: \x27부산\x27, value: \x27busan\x27}]',
            '</script>',
            '',
            '<template>',
            '  &lt;!-- RadioGroup 의 @change 는 선택된 value 문자열을 반환 --&gt;',
            '  <RadioGroup :options=&quot;options&quot; v-model=&quot;selected&quot; @change=&quot;(value) => (selected = value)&quot; />',
            '</template>'
          ]"
          :notes="['RadioGroup 의 @change 는 선택된 value 문자열을 반환']"
        >
          <GroupLive name="oc" :options="CITY" default-value="seoul" />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'classNames'"
          title="classNames — 추가 스타일"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Radio from \x27m2m-uiux-vue/Radio\x27',
            '</script>',
            '',
            '<template>',
            '  <Radio checked class-names=&quot;mb-2&quot; label=&quot;커스텀 스타일&quot; />',
            '</template>'
          ]"
        >
          <Radio name="cn" value="a" checked classNames="demo-hint" label="커스텀 스타일" />
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
