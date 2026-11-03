<script setup lang="ts">
import {computed, defineComponent, h, ref} from 'vue'

import Input, {INPUT_SIZE, INPUT_TYPE} from '~/components/Input'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'
import {useDemoTab} from '~/demo/components/navContext'

type Sub = 'text' | 'password' | 'number' | 'email' | 'tel' | 'search'

const META: Record<Sub, {label: string; placeholder: string; desc: string; notes: string[]; el: unknown}> = {
  text: {
    label: 'Input.Text',
    placeholder: '텍스트 입력',
    desc: '— 가장 기본적인 텍스트 입력 컴포넌트입니다.',
    notes: ['가장 기본적인 입력 유형', 'v-model 로 양방향 바인딩 (제어 컴포넌트)'],
    el: Input.Text
  },
  password: {
    label: 'Input.Password',
    placeholder: '비밀번호 입력',
    desc: '— 비밀번호 입력 전용 컴포넌트. 우측 눈 아이콘으로 표시/숨기기를 지원합니다.',
    notes: ['showToggle 시 눈 아이콘 버튼 내장', 'autoComplete="current-password" 권장'],
    el: Input.Password
  },
  number: {
    label: 'Input.Number',
    placeholder: '숫자 입력',
    desc: '— 숫자 전용 입력 컴포넌트. 모바일에서 숫자 키패드가 자동으로 호출됩니다.',
    notes: ['inputMode="numeric" 로 모바일 숫자 키패드 유도', 'min · max · step prop 지원'],
    el: Input.Number
  },
  email: {
    label: 'Input.Email',
    placeholder: '이메일 입력 (예: user@domain.com)',
    desc: '— 이메일 입력 전용 컴포넌트. type="email" 브라우저 유효성 검사를 지원합니다.',
    notes: ['이메일 형식 자동 유효성 검사', '모바일에서 @ 포함 키패드 자동 호출'],
    el: Input.Email
  },
  tel: {
    label: 'Input.Tel',
    placeholder: '전화번호 입력 (예: 010-0000-0000)',
    desc: '— 전화번호 입력 전용 컴포넌트. 모바일에서 전화 키패드가 자동으로 호출됩니다.',
    notes: ['type="tel" — 모바일 전화 키패드', 'onChange 에서 하이픈(-) 포맷 처리 권장'],
    el: Input.Tel
  },
  search: {
    label: 'Input.Search',
    placeholder: '검색어 입력',
    desc: '— 검색 전용 입력 컴포넌트. 우측 돋보기 아이콘 + 지우기(X) 버튼이 기본 내장됩니다.',
    notes: ['Enter 키 또는 돋보기 아이콘 클릭 시 onSearch 호출', '우측 X 버튼 기본 내장'],
    el: Input.Search
  }
}

const BASE_TABS = [
  'variant',
  'size',
  'clearable',
  'value',
  'onChange',
  'placeholder',
  'disabled',
  'readOnly',
  'error',
  'maxLength',
  'showCount',
  'classNames'
]
const PASSWORD_TABS = [
  'variant',
  'size',
  'showToggle',
  'type',
  'onToggle',
  'clearable',
  'value',
  'onChange',
  'placeholder',
  'disabled',
  'readOnly',
  'error',
  'maxLength',
  'showCount',
  'classNames'
]
// 하드코딩 문자열 대신 export 상수(INPUT_SIZE) 키로 관리
const SIZE_ROWS: {k: keyof typeof INPUT_SIZE; suffix: string}[] = [
  {k: 'SM', suffix: ''},
  {k: 'MD', suffix: ' (기본)'},
  {k: 'LG', suffix: ''}
]
const wrap = 'max-width:320px'

const demoTab = useDemoTab()
const sub = computed<Sub>(() => {
  const raw = (demoTab.value.tab ?? 'Text').toLowerCase()
  return (raw in META ? raw : 'text') as Sub
})
const meta = computed(() => META[sub.value])
const El = computed(() => meta.value.el as never)
const L = computed(() => meta.value.label)
const tabs = computed(() => (sub.value === 'password' ? PASSWORD_TABS : BASE_TABS))

const pwVisible = ref(false)

const ControlledDemo = defineComponent({
  name: 'InputControlledDemo',
  props: {comp: {type: null, required: true}},
  setup(p) {
    const value = ref('입력된 값')
    return () =>
      h('div', {class: 'demo-col', style: wrap}, [
        h(p.comp as never, {
          modelValue: value.value,
          'onUpdate:modelValue': (v: string) => (value.value = v)
        }),
        h('span', {class: 'demo-hint'}, `입력값: ${value.value || '(빈 값)'}`)
      ])
  }
})
</script>

<template>
  <div>
    <PageHeader :title="L" :component="L" :desc="meta.desc" />
    <PropTabs :key="sub" :tabs="tabs">
      <template #default="{tab}">
        <template v-if="tab === 'variant'">
          <ComponentSection
            :title="`${L} — 기본`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import Input, {INPUT_TYPE} from \x27m2m-uiux-vue/Input\x27',
              '',
              'const value = ref(\x27\x27)',
              '</script>',
              '',
              '<template>',
              `  <${L} v-model=&quot;value&quot; placeholder=&quot;${meta.placeholder}&quot; />`,
              `  &lt;!-- 동등: <Input :type=&quot;INPUT_TYPE[\x27${sub.toUpperCase()}\x27]&quot; v-model=&quot;value&quot; /&gt; --&gt;`,
              '</template>'
            ]"
            :notes="meta.notes"
          >
            <div class="demo-col" :style="wrap">
              <component :is="El" :placeholder="meta.placeholder" />
            </div>
          </ComponentSection>

          <ComponentSection
            v-if="sub === 'number'"
            :title="`${L} — min / max / step`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import Input from \x27m2m-uiux-vue/Input\x27',
              '',
              'const value = ref(\x2750\x27)',
              '</script>',
              '',
              '<template>',
              '  <Input.Number v-model=&quot;value&quot; :min=&quot;0&quot; :max=&quot;100&quot; :step=&quot;1&quot; />',
              '</template>'
            ]"
            :notes="['min · max · step prop 으로 입력 범위 제어']"
          >
            <div class="demo-col" :style="wrap">
              <Input.Number placeholder="0 ~ 100" default-value="50" :min="0" :max="100" :step="1" />
            </div>
          </ComponentSection>
          <ComponentSection
            v-if="sub === 'email'"
            :title="`${L} — 유효성 실패 예시`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import Input from \x27m2m-uiux-vue/Input\x27',
              '',
              'const value = ref(\x27invalid-email\x27)',
              '</script>',
              '',
              '<template>',
              '  <Input.Email v-model=&quot;value&quot; error=&quot;이메일 형식이 올바르지 않습니다.&quot; />',
              '</template>'
            ]"
          >
            <div class="demo-col" :style="wrap">
              <Input.Email error="이메일 형식이 올바르지 않습니다." default-value="invalid-email" />
            </div>
          </ComponentSection>
          <ComponentSection
            v-if="sub === 'tel'"
            :title="`${L} — 전화번호 포맷`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import Input from \x27m2m-uiux-vue/Input\x27',
              '',
              'const value = ref(\x27\x27)',
              'const formatTel = (v) => v.replace(/[^0-9]/g, \x27\x27).replace(/(\\d{3})(\\d{4})(\\d{4})/, \x27$1-$2-$3\x27)',
              '</script>',
              '',
              '<template>',
              '  <Input.Tel :model-value=&quot;value&quot; @update:model-value=&quot;(v) => (value = formatTel(v))&quot; />',
              '</template>'
            ]"
            :notes="['onChange 에서 하이픈(-) 자동 삽입 포맷 처리 권장']"
          >
            <div class="demo-col" :style="wrap">
              <Input.Tel placeholder="010-0000-0000" default-value="010-1234-5678" />
            </div>
          </ComponentSection>
          <ComponentSection
            v-if="sub === 'search'"
            :title="`${L} — onSearch 이벤트`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import Input from \x27m2m-uiux-vue/Input\x27',
              '',
              'const value = ref(\x27\x27)',
              'function handleSearch(val) {',
              '  console.log(\x27검색:\x27, val)',
              '}',
              '</script>',
              '',
              '<template>',
              '  <Input.Search v-model=&quot;value&quot; @search=&quot;(val) => handleSearch(val)&quot; />',
              '</template>'
            ]"
            :notes="['Enter 키 또는 돋보기 아이콘 클릭 시 onSearch 호출']"
          >
            <div class="demo-col" :style="wrap">
              <Input.Search placeholder="검색어를 입력하세요" @search="(v: string) => alert(`검색: ${v}`)" />
            </div>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'size'">
          <ComponentSection
            v-for="{k, suffix} in SIZE_ROWS"
            :key="k"
            :title="`size=&quot;${INPUT_SIZE[k]}&quot;${suffix}`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              `import Input, {INPUT_SIZE} from \x27m2m-uiux-vue/Input\x27`,
              '',
              'const value = ref(\x27\x27)',
              '</script>',
              '',
              '<template>',
              `  <${L} v-model=&quot;value&quot; :size=&quot;INPUT_SIZE[\x27${k}\x27]&quot; />`,
              '</template>'
            ]"
            :notes="k === 'MD' ? ['size 기본값은 md'] : undefined"
          >
            <div class="demo-col" :style="wrap">
              <component
                :is="El"
                :size="INPUT_SIZE[k]"
                :placeholder="meta.placeholder"
                default-value="입력 예시"
                :show-toggle="sub === 'password'"
              />
            </div>
          </ComponentSection>
          <ComponentSection
            title="size — 한눈에 비교"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              `import Input, {INPUT_SIZE} from \x27m2m-uiux-vue/Input\x27`,
              '',
              'const value = ref(\x27\x27)',
              '</script>',
              '',
              '<template>',
              `  <${L} v-model=&quot;value&quot; :size=&quot;INPUT_SIZE[\x27SM\x27]&quot; />`,
              `  <${L} v-model=&quot;value&quot; :size=&quot;INPUT_SIZE[\x27MD\x27]&quot; />`,
              `  <${L} v-model=&quot;value&quot; :size=&quot;INPUT_SIZE[\x27LG\x27]&quot; />`,
              '</template>'
            ]"
          >
            <div class="demo-col" :style="wrap">
              <component
                :is="El"
                v-for="k in ['SM', 'MD', 'LG'] as (keyof typeof INPUT_SIZE)[]"
                :key="k"
                :size="INPUT_SIZE[k]"
                :placeholder="`${INPUT_SIZE[k]} — ${meta.placeholder}`"
              />
            </div>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'showToggle' && sub === 'password'">
          <ComponentSection
            title="showToggle={true} — 눈 아이콘 활성화"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import Input from \x27m2m-uiux-vue/Input\x27',
              '',
              'const value = ref(\x27\x27)',
              '</script>',
              '',
              '<template>',
              '  <Input.Password v-model=&quot;value&quot; show-toggle />',
              '</template>'
            ]"
            :notes="['우측 눈 아이콘 버튼 자동 삽입', '클릭 시 password ↔ text 전환']"
          >
            <div class="demo-col" :style="wrap">
              <Input.Password show-toggle default-value="mySecretPw123" placeholder="비밀번호 입력" />
            </div>
          </ComponentSection>
          <ComponentSection
            title="showToggle 생략 (기본) — 아이콘 없음"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import Input from \x27m2m-uiux-vue/Input\x27',
              '',
              'const value = ref(\x27\x27)',
              '</script>',
              '',
              '<template>',
              '  <Input.Password v-model=&quot;value&quot; />',
              '</template>'
            ]"
            :notes="['showToggle 을 생략하면 아이콘 없이 순수 마스킹만 적용']"
          >
            <div class="demo-col" :style="wrap">
              <Input.Password placeholder="비밀번호 입력" default-value="mySecretPw123" />
            </div>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'type' && sub === 'password'">
          <ComponentSection
            title='type="password" (기본) — 마스킹'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              `import Input, {INPUT_TYPE} from \x27m2m-uiux-vue/Input\x27`,
              '',
              'const value = ref(\x27\x27)',
              '</script>',
              '',
              '<template>',
              '  &lt;!-- 동등: <Input.Password ... /&gt; --&gt;',
              '  <Input v-model=&quot;value&quot; :type=&quot;INPUT_TYPE[\x27PASSWORD\x27]&quot; />',
              '</template>'
            ]"
            :notes="['type 기본값은 INPUT_TYPE[\x27PASSWORD\x27] (마스킹 상태)']"
          >
            <div class="demo-col" :style="wrap">
              <Input :type="INPUT_TYPE['PASSWORD']" default-value="mySecretPw123" placeholder="비밀번호 입력" />
            </div>
          </ComponentSection>
          <ComponentSection
            title="type — showToggle + onToggle 로 제어"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              `import Input, {INPUT_TYPE} from \x27m2m-uiux-vue/Input\x27`,
              '',
              'const value = ref(\x27\x27)',
              'const show = ref(false)',
              '</script>',
              '',
              '<template>',
              '  <Input',
              '    v-model=&quot;value&quot;',
              '    :type=&quot;show ? INPUT_TYPE[\x27TEXT\x27] : INPUT_TYPE[\x27PASSWORD\x27]&quot;',
              '    show-toggle',
              '    @toggle=&quot;(v) => (show = v)&quot;',
              '  />',
              '</template>'
            ]"
            :notes="['showToggle 만 쓰면 내부 상태로 자동 처리', 'type + onToggle 조합은 외부 상태 연동 시']"
          >
            <div class="demo-col" :style="wrap">
              <Input
                :type="pwVisible ? INPUT_TYPE['TEXT'] : INPUT_TYPE['PASSWORD']"
                show-toggle
                default-value="mySecretPw123"
                @toggle="(v: boolean) => (pwVisible = v)"
              />
              <span class="demo-hint">현재: {{ pwVisible ? 'text (평문)' : 'password (마스킹)' }}</span>
            </div>
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'onToggle' && sub === 'password'"
          title="onToggle — 토글 콜백"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import Input from \x27m2m-uiux-vue/Input\x27',
            '',
            'const value = ref(\x27\x27)',
            '</script>',
            '',
            '<template>',
            '  <Input.Password',
            '    v-model=&quot;value&quot;',
            '    show-toggle',
            '    @toggle=&quot;(visible) => console.log(\x27visible:\x27, visible)&quot;',
            '  />',
            '</template>'
          ]"
          :notes="[
            'onToggle 은 눈 아이콘 클릭 시 호출되는 콜백 (visible: boolean)',
            '로깅 · GA 이벤트 등 부수 효과 처리 가능'
          ]"
        >
          <div class="demo-col" :style="wrap">
            <Input.Password
              show-toggle
              default-value="mySecretPw123"
              @toggle="(v: boolean) => console.log('visible:', v)"
            />
          </div>
        </ComponentSection>

        <template v-else-if="tab === 'clearable'">
          <ComponentSection
            title="clearable={true} (기본) — 입력 시 X 버튼 표시"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import Input from \x27m2m-uiux-vue/Input\x27',
              '',
              'const value = ref(\x27입력 예시\x27)',
              '</script>',
              '',
              '<template>',
              `  <${L} v-model=&quot;value&quot; clearable />`,
              '</template>'
            ]"
            :notes="['입력값이 1자 이상이면 우측에 ✕ 버튼 자동 노출', 'clearable 기본값은 true']"
          >
            <div class="demo-col" :style="wrap">
              <component :is="El" default-value="입력 예시" :placeholder="meta.placeholder" />
            </div>
          </ComponentSection>
          <ComponentSection
            title="clearable={false} — X 버튼 숨김"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import Input from \x27m2m-uiux-vue/Input\x27',
              '',
              'const value = ref(\x27입력 예시\x27)',
              '</script>',
              '',
              '<template>',
              `  <${L} v-model=&quot;value&quot; :clearable=&quot;false&quot; />`,
              '</template>'
            ]"
            :notes="['readOnly · disabled 상태에서는 clearable 여부와 무관하게 X 버튼 숨김']"
          >
            <div class="demo-col" :style="wrap">
              <component :is="El" default-value="입력 예시" :clearable="false" :placeholder="meta.placeholder" />
            </div>
          </ComponentSection>
          <ComponentSection
            title="onClear — 삭제 콜백"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import Input from \x27m2m-uiux-vue/Input\x27',
              '',
              'const value = ref(\x27입력 예시\x27)',
              '</script>',
              '',
              '<template>',
              `  <${L}`,
              '    v-model=&quot;value&quot;',
              '    clearable',
              '    @clear=&quot;() => (value = \x27\x27)&quot;',
              '  />',
              '</template>'
            ]"
            :notes="['onClear 는 X 버튼 클릭 시 실행되는 콜백', '값 초기화 + 포커스 복귀 패턴에 유용']"
          >
            <div class="demo-col" :style="wrap">
              <component :is="El" default-value="입력 예시" :placeholder="meta.placeholder" />
            </div>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'value'">
          <ComponentSection
            title="v-model — 양방향 바인딩"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import Input from \x27m2m-uiux-vue/Input\x27',
              '',
              'const value = ref(\x27입력된 값\x27)',
              '</script>',
              '',
              '<template>',
              `  <${L} v-model=&quot;value&quot; />`,
              '</template>'
            ]"
            :notes="[
              'v-model 이 modelValue prop + update:modelValue 이벤트를 자동 연결',
              '원본 이벤트가 필요하면 @change (native InputEvent) 를 함께 사용'
            ]"
          >
            <ControlledDemo :comp="El" />
          </ComponentSection>
          <ComponentSection
            title="v-model — 초기 빈 값"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import Input from \x27m2m-uiux-vue/Input\x27',
              '',
              'const value = ref(\x27\x27)',
              '</script>',
              '',
              '<template>',
              `  <${L} v-model=&quot;value&quot; />`,
              '</template>'
            ]"
          >
            <div class="demo-col" :style="wrap">
              <component :is="El" value="" placeholder="아직 입력 없음" />
            </div>
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'onChange'"
          title="onChange — 이벤트 핸들러"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import Input from \x27m2m-uiux-vue/Input\x27',
            '',
            'const value = ref(\x27\x27)',
            'const onChange = (e) => console.log(e.target.value)',
            '</script>',
            '',
            '<template>',
            `  <${L} v-model=&quot;value&quot; @change=&quot;onChange&quot; />`,
            '</template>'
          ]"
          :notes="['@change 파라미터는 native InputEvent', 'v-model 과 @change 는 함께 사용 가능']"
        >
          <div class="demo-col" :style="wrap">
            <component :is="El" placeholder="타이핑해보세요" />
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'placeholder'"
          title="placeholder — 입력 전 안내 텍스트"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import Input from \x27m2m-uiux-vue/Input\x27',
            '',
            'const value = ref(\x27\x27)',
            '</script>',
            '',
            '<template>',
            `  <${L} v-model=&quot;value&quot; placeholder=&quot;${meta.placeholder}&quot; />`,
            '</template>'
          ]"
          :notes="['placeholder 는 value 가 비었을 때만 표시']"
        >
          <div class="demo-col" :style="wrap">
            <component :is="El" :placeholder="meta.placeholder" />
          </div>
        </ComponentSection>

        <template v-else-if="tab === 'disabled'">
          <ComponentSection
            title="disabled={true} — 완전 비활성"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Input from \x27m2m-uiux-vue/Input\x27',
              '</script>',
              '',
              '<template>',
              `  <${L} disabled />`,
              '</template>'
            ]"
            :notes="['포커스 및 클릭 완전 불가, 배경이 회색으로 변함']"
          >
            <div class="demo-col" :style="wrap">
              <component :is="El" disabled placeholder="비활성 입력" />
            </div>
          </ComponentSection>
          <ComponentSection
            title="disabled — 값이 있는 경우"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Input from \x27m2m-uiux-vue/Input\x27',
              '</script>',
              '',
              '<template>',
              `  <${L} disabled default-value=&quot;수정 불가 값&quot; />`,
              '</template>'
            ]"
          >
            <div class="demo-col" :style="wrap">
              <component :is="El" disabled default-value="수정 불가 값" />
            </div>
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'readOnly'"
          title="readOnly={true} — 읽기 전용"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Input from \x27m2m-uiux-vue/Input\x27',
            '</script>',
            '',
            '<template>',
            `  <${L} readonly default-value=&quot;복사는 가능, 수정 불가&quot; />`,
            '</template>'
          ]"
          :notes="['복사는 가능하지만 수정은 불가', 'disabled 와 달리 포커스 가능']"
        >
          <div class="demo-col" :style="wrap">
            <component :is="El" readonly default-value="복사는 가능, 수정 불가" />
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'error'"
          title="error / helperText"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Input from \x27m2m-uiux-vue/Input\x27',
            '</script>',
            '',
            '<template>',
            '  &lt;!-- error 에 문자열 전달 시 하단 메시지 자동 표시 --&gt;',
            `  <${L} error=&quot;필수 입력 항목입니다.&quot; />`,
            `  <${L} helper-text=&quot;영문/숫자 4자 이상&quot; placeholder=&quot;아이디&quot; />`,
            '</template>'
          ]"
          :notes="['error 에 boolean 또는 string 전달 가능', 'error 가 없을 때만 helperText 가 표시됨']"
        >
          <div class="demo-col" :style="wrap">
            <component :is="El" error="필수 입력 항목입니다." default-value="잘못된 값" />
            <component :is="El" helper-text="영문/숫자 4자 이상" placeholder="아이디" />
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'maxLength'"
          title="maxLength — 최대 글자 수 제한"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import Input from \x27m2m-uiux-vue/Input\x27',
            '',
            'const value = ref(\x27\x27)',
            '</script>',
            '',
            '<template>',
            `  <${L} v-model=&quot;value&quot; :max-length=&quot;20&quot; show-count />`,
            '</template>'
          ]"
          :notes="['maxLength 초과 입력 자동 차단', 'showCount 와 함께 사용 권장']"
        >
          <div class="demo-col" :style="wrap">
            <component :is="El" placeholder="최대 20자 입력" :max-length="20" show-count />
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'showCount'"
          title="showCount={true} — 글자 수 카운터"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import Input from \x27m2m-uiux-vue/Input\x27',
            '',
            'const value = ref(\x27\x27)',
            '</script>',
            '',
            '<template>',
            `  <${L} v-model=&quot;value&quot; show-count :max-length=&quot;20&quot; />`,
            '</template>'
          ]"
          :notes="[
            '우측 하단에 \x27현재 입력 수 / maxLength\x27 형식으로 표시',
            'maxLength 와 함께 사용해야 정확한 카운터 표시'
          ]"
        >
          <div class="demo-col" :style="wrap">
            <component :is="El" placeholder="입력해주세요" :max-length="20" show-count default-value="테스트 입력" />
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'classNames'"
          title="classNames — 추가 스타일"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import Input from \x27m2m-uiux-vue/Input\x27',
            '',
            'const value = ref(\x27\x27)',
            '</script>',
            '',
            '<template>',
            `  <${L} v-model=&quot;value&quot; class-names=&quot;w-full mt-2&quot; />`,
            '</template>'
          ]"
          :notes="['classNames prop 은 문자열 또는 배열 허용']"
        >
          <div class="demo-col" :style="wrap">
            <component :is="El" class-names="demo-hint" placeholder="커스텀 스타일 적용" />
          </div>
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
