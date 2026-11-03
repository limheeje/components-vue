<script setup lang="ts">
import {defineComponent, h, ref} from 'vue'

import Switch, {SWITCH_SIZE} from '~/components/Switch'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['checked', 'disabled', 'size', 'label', 'onChange', 'classNames']

const on = ref(true)

// 하드코딩 문자열 대신 export 상수(SWITCH_SIZE) 키로 관리
const SIZES: (keyof typeof SWITCH_SIZE)[] = ['SM', 'MD', 'LG']
const sizeLabel = (s: string) => (s === 'sm' ? 'Small' : s === 'md' ? 'Medium' : 'Large')

const SettingsDemo = defineComponent({
  name: 'SwitchSettingsDemo',
  setup() {
    const items = [
      {label: '알림 받기', on: true},
      {label: '마케팅 수신', on: false},
      {label: '다크 모드', on: false}
    ]
    const states = ref(items.map((i) => i.on))
    return () =>
      h(
        'div',
        {class: 'demo-col'},
        items.map((item, i) =>
          h(Switch, {
            key: item.label,
            label: item.label,
            modelValue: states.value[i],
            'onUpdate:modelValue': (v: boolean) => (states.value = states.value.map((s, idx) => (idx === i ? v : s)))
          })
        )
      )
  }
})
</script>

<template>
  <div>
    <PageHeader title="Switch" component="Switch" desc="— 토글 스위치 컴포넌트. boolean 값을 on/off 로 표현합니다." />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <template v-if="tab === 'checked'">
          <ComponentSection
            title="v-model — 켜짐/꺼짐 (클릭해보세요)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import Switch from \x27m2m-uiux-vue/Switch\x27',
              '',
              'const on = ref(true)',
              '</script>',
              '',
              '<template>',
              '  <Switch v-model=&quot;on&quot; label=&quot;켜짐&quot; />',
              '</template>'
            ]"
            :notes="['v-model 은 boolean — 단일 체크박스와 동일', 'v-model:checked 도 동일하게 동작']"
          >
            <div class="demo-col">
              <Switch v-model="on" label="켜짐" />
              <span class="demo-hint">on: {{ on }}</span>
            </div>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'disabled'">
          <ComponentSection
            title="disabled={true} — 켜진 상태"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Switch from \x27m2m-uiux-vue/Switch\x27',
              '</script>',
              '',
              '<template>',
              '  <Switch checked disabled label=&quot;비활성 켜짐&quot; />',
              '</template>'
            ]"
          >
            <Switch label="비활성 켜짐" disabled default-checked />
          </ComponentSection>
          <ComponentSection
            title="disabled={true} — 꺼진 상태"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Switch from \x27m2m-uiux-vue/Switch\x27',
              '</script>',
              '',
              '<template>',
              '  <Switch disabled label=&quot;비활성 꺼짐&quot; />',
              '</template>'
            ]"
          >
            <Switch label="비활성 꺼짐" disabled />
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'size'">
          <ComponentSection
            v-for="s in SIZES"
            :key="s"
            :title="`size=&quot;${SWITCH_SIZE[s]}&quot;${s === 'MD' ? ' (기본)' : ''}`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Switch, {SWITCH_SIZE} from \x27m2m-uiux-vue/Switch\x27`,
              '</script>',
              '',
              '<template>',
              `  <Switch :size=&quot;SWITCH_SIZE[\x27${s}\x27]&quot; checked>${sizeLabel(SWITCH_SIZE[s])}</Switch>`,
              '</template>'
            ]"
          >
            <Switch :size="SWITCH_SIZE[s]" default-checked :label="sizeLabel(SWITCH_SIZE[s])" />
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'label'"
          title="label — 설정 패널 예시 (모두 클릭 가능)"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import Switch from \x27m2m-uiux-vue/Switch\x27',
            '',
            'const notify = ref(true)',
            'const marketing = ref(false)',
            'const dark = ref(false)',
            '</script>',
            '',
            '<template>',
            '  <Switch v-model=&quot;notify&quot; label=&quot;알림 받기&quot; />',
            '  <Switch v-model=&quot;marketing&quot; label=&quot;마케팅 수신&quot; />',
            '  <Switch v-model=&quot;dark&quot; label=&quot;다크 모드&quot; />',
            '</template>'
          ]"
        >
          <SettingsDemo />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'onChange'"
          title="onChange 이벤트 — 클릭해보세요"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import Switch from \x27m2m-uiux-vue/Switch\x27',
            '',
            'const on = ref(false)',
            'const onChange = (e) => console.log(\x27switched:\x27, e.target.checked)',
            '</script>',
            '',
            '<template>',
            '  <Switch v-model=&quot;on&quot; @change=&quot;onChange&quot; label=&quot;토글해보세요&quot; />',
            '</template>'
          ]"
          :notes="['v-model 로 상태 바인딩 + @change 로 원본 이벤트 수신 가능']"
        >
          <Switch label="토글해보세요" />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'classNames'"
          title="classNames — 추가 스타일"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import Switch from \x27m2m-uiux-vue/Switch\x27',
            '',
            'const on = ref(true)',
            '</script>',
            '',
            '<template>',
            '  <Switch v-model=&quot;on&quot; class-names=&quot;mb-4&quot; label=&quot;커스텀&quot; />',
            '</template>'
          ]"
        >
          <Switch classNames="demo-hint" default-checked label="커스텀" />
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
