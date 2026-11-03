<script setup lang="ts">
import {defineComponent, h, ref} from 'vue'

import ProgressBar, {PROGRESS_BAR_COLOR, PROGRESS_BAR_THICKNESS} from '~/components/ProgressBar'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['value', 'showValue', 'color', 'thickness', 'animated', 'label']

const wrap = 'width:320px;max-width:100%'
// 하드코딩 문자열 대신 export 상수(PROGRESS_BAR_COLOR · PROGRESS_BAR_THICKNESS) 키로 관리
const COLORS: (keyof typeof PROGRESS_BAR_COLOR)[] = ['PRIMARY', 'SUCCESS', 'WARNING', 'DANGER']
const THICKNESS: {k: keyof typeof PROGRESS_BAR_THICKNESS; suffix: string}[] = [
  {k: 'SM', suffix: ' — 얇은 바'},
  {k: 'MD', suffix: ' (기본)'},
  {k: 'LG', suffix: ' — 두꺼운 바'}
]

const Slider = defineComponent({
  name: 'ProgressSlider',
  props: {showValue: {type: Boolean, default: true}},
  setup(p) {
    const v = ref(60)
    return () =>
      h('div', {class: 'demo-col', style: wrap}, [
        h(ProgressBar, {modelValue: v.value, showValue: p.showValue}),
        h('div', {style: 'display:flex;align-items:center;gap:12px'}, [
          h('input', {
            type: 'range',
            min: 0,
            max: 100,
            value: v.value,
            style: 'flex:1;accent-color:var(--m2m-pg-brand)',
            onInput: (e: Event) => (v.value = Number((e.target as HTMLInputElement).value))
          }),
          h('span', {style: 'font-size:13px;font-weight:700;color:var(--m2m-pg-brand);min-width:36px'}, `${v.value}%`)
        ])
      ])
  }
})
</script>

<template>
  <div>
    <PageHeader
      title="Progress.Bar"
      component="ProgressBar"
      desc="— 수치형 진행바. 파일 업로드, 설문 완료율 등 연속적인 진행 상태를 표시합니다."
    />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <ComponentSection
          v-if="tab === 'value'"
          title="value — 현재 진행률 (0~100, 슬라이더로 조절)"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import ProgressBar from \x27m2m-uiux-vue/ProgressBar\x27',
            '',
            'const progress = ref(60)',
            '</script>',
            '',
            '<template>',
            '  <ProgressBar v-model=&quot;progress&quot; show-value />',
            '</template>'
          ]"
          :notes="['value 는 0~100 사이의 숫자, 범위 초과 시 자동 클램핑']"
        >
          <Slider />
        </ComponentSection>

        <template v-else-if="tab === 'showValue'">
          <ComponentSection
            title="showValue={true} — 진행률 텍스트 표시"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import ProgressBar from \x27m2m-uiux-vue/ProgressBar\x27',
              '</script>',
              '',
              '<template>',
              '  <ProgressBar :model-value=&quot;75&quot; show-value />',
              '</template>'
            ]"
            :notes="['우측에 N% 형태로 표시됩니다']"
          >
            <Slider />
          </ComponentSection>
          <ComponentSection
            title="showValue={false} (기본)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import ProgressBar from \x27m2m-uiux-vue/ProgressBar\x27',
              '</script>',
              '',
              '<template>',
              '  <ProgressBar :model-value=&quot;75&quot; />',
              '</template>'
            ]"
          >
            <Slider :show-value="false" />
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'color'">
          <ComponentSection
            v-for="c in COLORS"
            :key="c"
            :title="`color=&quot;${PROGRESS_BAR_COLOR[c]}&quot;`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import ProgressBar, {PROGRESS_BAR_COLOR} from \x27m2m-uiux-vue/ProgressBar\x27`,
              '</script>',
              '',
              '<template>',
              `  <ProgressBar :model-value=&quot;65&quot; :color=&quot;PROGRESS_BAR_COLOR[\x27${c}\x27]&quot; />`,
              '</template>'
            ]"
          >
            <div :style="wrap"><ProgressBar :model-value="65" :color="PROGRESS_BAR_COLOR[c]" show-value /></div>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'thickness'">
          <ComponentSection
            v-for="{k, suffix} in THICKNESS"
            :key="k"
            :title="`thickness=&quot;${PROGRESS_BAR_THICKNESS[k]}&quot;${suffix}`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import ProgressBar, {PROGRESS_BAR_THICKNESS} from \x27m2m-uiux-vue/ProgressBar\x27`,
              '</script>',
              '',
              '<template>',
              `  <ProgressBar :model-value=&quot;70&quot; :thickness=&quot;PROGRESS_BAR_THICKNESS[\x27${k}\x27]&quot; />`,
              '</template>'
            ]"
          >
            <div :style="wrap"><ProgressBar :model-value="70" :thickness="PROGRESS_BAR_THICKNESS[k]" show-value /></div>
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'animated'"
          title="animated={true} — 흐르는 그라데이션"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            `import ProgressBar from \x27m2m-uiux-vue/ProgressBar\x27`,
            '</script>',
            '',
            '<template>',
            '  <ProgressBar :model-value=&quot;55&quot; animated label=&quot;파일 업로드 중...&quot; />',
            '</template>'
          ]"
          :notes="['진행 중일 때 사용, 완료 시 animated={false} 로 전환 권장']"
        >
          <div class="demo-col" :style="wrap">
            <ProgressBar :model-value="55" animated show-value label="파일 업로드 중…" />
            <ProgressBar
              :model-value="30"
              animated
              :color="PROGRESS_BAR_COLOR['SUCCESS']"
              show-value
              label="처리 중…"
            />
            <ProgressBar
              :model-value="78"
              animated
              :color="PROGRESS_BAR_COLOR['WARNING']"
              show-value
              label="변환 중…"
            />
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'label'"
          title="label — 막대 위 라벨"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import ProgressBar from \x27m2m-uiux-vue/ProgressBar\x27',
            '</script>',
            '',
            '<template>',
            '  <ProgressBar :model-value=&quot;80&quot; label=&quot;디스크 사용량&quot; show-value />',
            '</template>'
          ]"
          :notes="['label 과 showValue 를 함께 쓰면 좌: 라벨 / 우: N%']"
        >
          <div :style="wrap"><ProgressBar :model-value="80" label="디스크 사용량" show-value /></div>
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
