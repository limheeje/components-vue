<script setup lang="ts">
import {defineComponent, h, ref} from 'vue'

import Button from '~/components/Button'
import Steps, {STEPS_DIRECTION, STEPS_STATUS} from '~/components/Steps'
import type {StepItem} from '~/components/Steps'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['steps', 'current', 'direction', 'status']

const SIGNUP: StepItem[] = [
  {title: '약관 동의', description: '이용약관 확인'},
  {title: '정보 입력', description: '기본 정보 입력'},
  {title: '인증', description: '이메일 인증'},
  {title: '완료', description: '가입 완료'}
]
const ORDER: StepItem[] = [{title: '장바구니'}, {title: '주문 정보'}, {title: '결제'}, {title: '완료'}]

const Interactive = defineComponent({
  name: 'StepsInteractive',
  props: {
    steps: {type: Array as () => StepItem[], default: () => SIGNUP},
    start: {type: Number, default: 1}
  },
  setup(p) {
    const cur = ref(p.start)
    return () =>
      h('div', {class: 'demo-col', style: 'width:100%'}, [
        h(Steps, {steps: p.steps, modelValue: cur.value}),
        h('div', {class: 'demo-row'}, [
          h(
            Button,
            {
              size: 'sm',
              variant: 'ghost',
              disabled: cur.value === 0,
              onClick: () => (cur.value = Math.max(0, cur.value - 1))
            },
            () => '이전'
          ),
          h(
            Button,
            {
              size: 'sm',
              disabled: cur.value === p.steps.length - 1,
              onClick: () => (cur.value = Math.min(p.steps.length - 1, cur.value + 1))
            },
            () => '다음'
          ),
          h('span', {class: 'demo-hint'}, `${cur.value + 1} / ${p.steps.length} 단계`)
        ])
      ])
  }
})
</script>

<template>
  <div>
    <PageHeader
      title="Progress.Steps"
      component="Steps"
      desc="— 단계형 상태 표시기. 회원가입·주문·승인 절차 등 불연속적인 단계를 안내합니다."
    />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <ComponentSection
          v-if="tab === 'steps'"
          title="steps — 단계 배열"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import Steps from \x27m2m-uiux-vue/Steps\x27',
            '',
            'const steps = [',
            '  { title: \x27장바구니\x27 },',
            '  { title: \x27주문 정보\x27 },',
            '  { title: \x27결제\x27 },',
            '  { title: \x27완료\x27 },',
            ']',
            'const current = ref(1)',
            '</script>',
            '',
            '<template>',
            '  <Steps :steps=&quot;steps&quot; v-model=&quot;current&quot; />',
            '</template>'
          ]"
          :notes="['이전/다음 버튼으로 current 를 바꾸면 단계 표시가 갱신됩니다']"
        >
          <Interactive :steps="ORDER" :start="1" />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'current'"
          title="v-model — 현재 단계 (0-base)"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import Steps from \x27m2m-uiux-vue/Steps\x27',
            '',
            'const steps = [{ title: \x27약관 동의\x27 }, { title: \x27정보 입력\x27 }, { title: \x27완료\x27 }]',
            'const current = ref(1)',
            '</script>',
            '',
            '<template>',
            '  <Steps :steps=&quot;steps&quot; v-model=&quot;current&quot; />',
            '</template>'
          ]"
          :notes="['완료된 단계는 초록 체크, 현재 단계는 브랜드색, 미완료는 회색']"
        >
          <Interactive />
        </ComponentSection>

        <template v-else-if="tab === 'direction'">
          <ComponentSection
            title='direction="horizontal" (기본)'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Steps, {STEPS_DIRECTION} from \x27m2m-uiux-vue/Steps\x27`,
              '<\/script>',
              '',
              '<template>',
              '  <Steps :direction=&quot;STEPS_DIRECTION[\x27HORIZONTAL\x27]&quot; :steps=&quot;steps&quot; :model-value=&quot;2&quot; />',
              '</template>'
            ]"
          >
            <Steps :steps="SIGNUP" :model-value="2" />
          </ComponentSection>
          <ComponentSection
            title='direction="vertical"'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Steps, {STEPS_DIRECTION} from \x27m2m-uiux-vue/Steps\x27`,
              '<\/script>',
              '',
              '<template>',
              '  <Steps :direction=&quot;STEPS_DIRECTION[\x27VERTICAL\x27]&quot; :steps=&quot;steps&quot; :model-value=&quot;2&quot; />',
              '</template>'
            ]"
            :notes="['좁은 화면이나 사이드바 내 진행 상태에 적합']"
          >
            <Steps :steps="SIGNUP" :model-value="2" :direction="STEPS_DIRECTION['VERTICAL']" />
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'status'">
          <ComponentSection
            title='status="process" (기본) — 진행 중'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Steps, {STEPS_STATUS} from \x27m2m-uiux-vue/Steps\x27`,
              '<\/script>',
              '',
              '<template>',
              '  <Steps :steps=&quot;steps&quot; :model-value=&quot;1&quot; :status=&quot;STEPS_STATUS[\x27PROCESS\x27]&quot; />',
              '</template>'
            ]"
          >
            <Steps :steps="SIGNUP" :model-value="1" :status="STEPS_STATUS['PROCESS']" />
          </ComponentSection>
          <ComponentSection
            title='status="finish" — 현재 단계 완료 처리'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Steps, {STEPS_STATUS} from \x27m2m-uiux-vue/Steps\x27`,
              '<\/script>',
              '',
              '<template>',
              '  <Steps :steps=&quot;steps&quot; :model-value=&quot;1&quot; :status=&quot;STEPS_STATUS[\x27FINISH\x27]&quot; />',
              '</template>'
            ]"
            :notes="['현재 단계를 강제로 완료 상태로 표시']"
          >
            <Steps :steps="SIGNUP" :model-value="1" :status="STEPS_STATUS['FINISH']" />
          </ComponentSection>
          <ComponentSection
            title='status="error" — 현재 단계 오류 상태'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Steps, {STEPS_STATUS} from \x27m2m-uiux-vue/Steps\x27`,
              '<\/script>',
              '',
              '<template>',
              '  <Steps :steps=&quot;steps&quot; :model-value=&quot;2&quot; :status=&quot;STEPS_STATUS[\x27DANGER\x27]&quot; />',
              '</template>'
            ]"
            :notes="['현재 단계에 빨간 오류 아이콘이 표시됩니다']"
          >
            <Steps :steps="SIGNUP" :model-value="2" :status="STEPS_STATUS['DANGER']" />
          </ComponentSection>
          <ComponentSection
            title='status="wait" — 대기 상태'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Steps, {STEPS_STATUS} from \x27m2m-uiux-vue/Steps\x27`,
              '<\/script>',
              '',
              '<template>',
              '  <Steps :steps=&quot;steps&quot; :model-value=&quot;0&quot; :status=&quot;STEPS_STATUS[\x27WAIT\x27]&quot; />',
              '</template>'
            ]"
          >
            <Steps :steps="SIGNUP" :model-value="0" :status="STEPS_STATUS['WAIT']" />
          </ComponentSection>
        </template>
      </template>
    </PropTabs>
  </div>
</template>
