<script setup lang="ts">
import {defineComponent, h, ref} from 'vue'

import Button from '~/components/Button'
import RegionPicker from '~/components/RegionPicker'
import type {RegionValue} from '~/components/RegionPicker'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['default', 'single', 'modelValue', 'events']

// multiple 기본값이 true 라, prop 없이 써도 다중 선택 UI(체크박스/칩/적용하기)가 노출된다.
const DefaultDemo = defineComponent({
  name: 'RegionPickerDefaultDemo',
  setup() {
    const open = ref(false)
    const regions = ref<RegionValue[]>([])
    return () => [
      h(Button, {onClick: () => (open.value = true)}, () =>
        regions.value.length > 0 ? `${regions.value.length}개 지역 선택됨` : '지역 선택'
      ),
      h(RegionPicker, {
        open: open.value,
        modelValue: regions.value,
        'onUpdate:modelValue': (v: RegionValue[]) => (regions.value = v),
        onClose: () => (open.value = false)
      })
    ]
  }
})

const SingleDemo = defineComponent({
  name: 'RegionPickerSingleDemo',
  setup() {
    const open = ref(false)
    const region = ref<RegionValue | null>(null)
    return () => [
      h(Button, {onClick: () => (open.value = true)}, () =>
        region.value ? `${region.value.province} ${region.value.city}` : '지역 선택'
      ),
      h(RegionPicker, {
        open: open.value,
        multiple: false,
        modelValue: region.value,
        'onUpdate:modelValue': (v: RegionValue) => (region.value = v),
        onClose: () => (open.value = false)
      })
    ]
  }
})

const PrefilledDemo = defineComponent({
  name: 'RegionPickerPrefilledDemo',
  setup() {
    const open = ref(false)
    const region = ref<RegionValue | null>({province: '전남', city: '보성군'})
    return () => [
      h(Button, {onClick: () => (open.value = true)}, () => `${region.value!.province} ${region.value!.city}`),
      h(RegionPicker, {
        open: open.value,
        multiple: false,
        modelValue: region.value,
        'onUpdate:modelValue': (v: RegionValue) => (region.value = v),
        onClose: () => (open.value = false)
      })
    ]
  }
})

const EventsDemo = defineComponent({
  name: 'RegionPickerEventsDemo',
  setup() {
    const open = ref(false)
    const log = ref('(없음)')
    return () => [
      h(Button, {onClick: () => (open.value = true)}, () => '지역 선택'),
      h('span', {class: 'demo-hint', style: {marginLeft: '8px'}}, `이벤트: ${log.value}`),
      h(RegionPicker, {
        open: open.value,
        multiple: false,
        onClose: () => (open.value = false),
        onConfirm: (v: RegionValue) => (log.value = `confirm → ${v.province} ${v.city}`)
      })
    ]
  }
})
</script>

<template>
  <div>
    <PageHeader
      title="RegionPicker"
      component="RegionPicker"
      desc="— 시/도 → 시군구 2단 선택 바텀시트(상단 15px 여백). 내부적으로 Dialog(variant='drawer') 사용."
    />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <ComponentSection
          v-if="tab === 'default'"
          title="기본 사용 — multiple 기본값 true (다중 선택)"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            `import RegionPicker, {type RegionValue} from \x27m2m-uiux-vue/RegionPicker\x27`,
            '',
            'const open = ref(false)',
            'const regions = ref<RegionValue[]>([])',
            '</script>',
            '',
            '<template>',
            '  <Button @click=&quot;open = true&quot;>',
            '    {{ regions.length > 0 ? `${regions.length}개 지역 선택됨` : \x27지역 선택\x27 }}',
            '  </Button>',
            '  <RegionPicker v-model=&quot;regions&quot; :open=&quot;open&quot; @close=&quot;open = false&quot; />',
            '</template>'
          ]"
          :notes="[
            'multiple prop 을 생략하면 기본값 true — 별도 설정 없이 다중 선택 UI(체크박스/칩/적용하기)가 노출됨',
            '시군구 항목을 클릭할 때마다 체크박스가 토글 — 다른 시/도로 이동해도 이전 선택은 유지 (좌측 목록에 개수 뱃지 표시)',
            '하단에 선택된 항목이 시/도 > 시군구 칩으로 나열되고, 칩의 X 로 개별 해제 · 초기화 버튼으로 전체 해제',
            '적용하기 클릭 시 update:modelValue / confirm 으로 RegionValue[] 전달'
          ]"
        >
          <DefaultDemo />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'single'"
          title=':multiple="false" — 단일 선택'
          :code="[
            'const region = ref<RegionValue | null>(null)',
            '',
            '<RegionPicker v-model=&quot;region&quot; :multiple=&quot;false&quot; :open=&quot;open&quot; @close=&quot;open = false&quot; />'
          ]"
          :notes="[
            '시군구를 1개만 고를 수 있고, 다시 선택하면 이전 선택을 대체함 (체크박스/칩 UI 없이 하이라이트만)',
            '확정 시 update:modelValue + confirm 이 emit 되고 이어서 close'
          ]"
        >
          <SingleDemo />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'modelValue'"
          title="modelValue — 초기 선택 상태 복원 (단일 선택)"
          :code="[
            'const region = ref<RegionValue | null>({ province: \x27전남\x27, city: \x27보성군\x27 })',
            '',
            '<RegionPicker v-model=&quot;region&quot; :multiple=&quot;false&quot; :open=&quot;open&quot; @close=&quot;open = false&quot; />'
          ]"
          :notes="['다시 열면 헤더 설명(전남 > 보성군)과 함께 기존 선택이 그대로 하이라이트됨']"
        >
          <PrefilledDemo />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'events'"
          title="close / confirm 이벤트 (단일 선택)"
          :code="[
            '<RegionPicker',
            '  :open=&quot;open&quot;',
            '  :multiple=&quot;false&quot;',
            '  @close=&quot;open = false&quot;',
            '  @confirm=&quot;(v) => console.log(v.province, v.city)&quot;',
            '/>'
          ]"
          :notes="['close 는 확정 없이 닫힐 때도 emit (뒤로가기 · X 버튼 · 헤더 스와이프 · 배경 클릭 · ESC)']"
        >
          <EventsDemo />
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
