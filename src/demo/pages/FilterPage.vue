<script setup lang="ts">
import {defineComponent, h, ref} from 'vue'

import Button from '~/components/Button'
import Filter from '~/components/Filter'
import {DEFAULT_FILTER_SECTIONS} from '~/components/Filter'
import type {FilterValue} from '~/components/Filter'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['default', 'events']

function countActive(value: FilterValue): number {
  return Object.values(value).reduce((sum: number, v) => {
    if (Array.isArray(v)) return sum + v.length
    if (v && typeof v === 'object') return sum + (v.min || v.max ? 1 : 0)
    return sum + (v ? 1 : 0)
  }, 0)
}

const DefaultDemo = defineComponent({
  name: 'FilterDefaultDemo',
  setup() {
    const open = ref(false)
    const value = ref<FilterValue>({})
    return () => {
      const active = countActive(value.value)
      return [
        h(Button, {onClick: () => (open.value = true)}, () => (active > 0 ? `필터 (${active})` : '필터')),
        h(Filter, {
          open: open.value,
          sections: DEFAULT_FILTER_SECTIONS,
          modelValue: value.value,
          'onUpdate:modelValue': (v: FilterValue) => (value.value = v),
          onClose: () => (open.value = false)
        })
      ]
    }
  }
})

const EventsDemo = defineComponent({
  name: 'FilterEventsDemo',
  setup() {
    const open = ref(false)
    const log = ref('(없음)')
    return () => [
      h(Button, {onClick: () => (open.value = true)}, () => '필터'),
      h('span', {class: 'demo-hint', style: {marginLeft: '8px'}}, `이벤트: ${log.value}`),
      h(Filter, {
        open: open.value,
        sections: DEFAULT_FILTER_SECTIONS,
        onClose: () => (open.value = false),
        onConfirm: (v: FilterValue) => (log.value = `confirm → 활성 필터 ${countActive(v)}개`)
      })
    ]
  }
})
</script>

<template>
  <div>
    <PageHeader
      title="Filter"
      component="Filter"
      desc="— e-커머스 목록 필터 풀팝업. RegionPicker 와 동일하게 Dialog(variant='drawer')를 사용하는 상단 여백 있는 바텀시트."
    />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <ComponentSection
          v-if="tab === 'default'"
          title="기본 사용 — sections 는 부모(소비 앱)가 필수로 전달"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            `import Filter, {DEFAULT_FILTER_SECTIONS, type FilterValue} from \x27m2m-uiux-vue/Filter\x27`,
            '',
            'const open = ref(false)',
            'const value = ref<FilterValue>({})',
            '// sections 는 필수 prop — 컴포넌트가 항목을 정하지 않음. 예시로 내장 데모 구성을 그대로 사용',
            'const sections = DEFAULT_FILTER_SECTIONS',
            '</script>',
            '',
            '<template>',
            '  <Button @click=&quot;open = true&quot;>필터</Button>',
            '  <Filter v-model=&quot;value&quot; :open=&quot;open&quot; :sections=&quot;sections&quot; @close=&quot;open = false&quot; />',
            '</template>'
          ]"
          :notes="[
            'Filter 컴포넌트 자체는 필터 항목(브랜드~가격대)을 전혀 정의하지 않고, sections prop 을 필수로 받아 렌더만 담당',
            '이 데모는 참고용으로 내장 DEFAULT_FILTER_SECTIONS(판매 방식·브랜드·상품 상태·배송 방법·반품 가능·보증 기간·테스트 여부·가격대)를 그대로 전달',
            '브랜드처럼 옵션이 많은 섹션은 type: \x27brand\x27 로 선언하면 검색창 + 첫 글자 탐색 탭 + 페이지네이션이 자동으로 붙음',
            '적용하기 클릭 시 update:modelValue / confirm 으로 FilterValue 전달, 초기화 버튼으로 전체 선택 해제'
          ]"
        >
          <DefaultDemo />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'events'"
          title="close / confirm 이벤트"
          :code="[
            '<Filter',
            '  :open=&quot;open&quot;',
            '  :sections=&quot;sections&quot;',
            '  @close=&quot;open = false&quot;',
            '  @confirm=&quot;(v) => console.log(v)&quot;',
            '/>'
          ]"
          :notes="['close 는 확정 없이 닫힐 때도 emit (X 버튼 · 헤더 스와이프 · 배경 클릭 · ESC)']"
        >
          <EventsDemo />
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
