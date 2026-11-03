<script setup lang="ts">
import {defineComponent, h, ref} from 'vue'

import Button, {BUTTON_SIZE, BUTTON_VARIANT} from '~/components/Button'
import Icon from '~/components/Icon'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['variant', 'size', 'round', 'disabled', 'loading', 'fullWidth', 'icon', 'onClick', 'classNames']

// 데모/코드예시 모두 하드코딩 문자열 대신 export 상수(BUTTON_VARIANT · BUTTON_SIZE)를 사용
const VARIANTS: {k: keyof typeof BUTTON_VARIANT; v: string; label?: string; note?: string}[] = [
  {k: 'PRIMARY', v: BUTTON_VARIANT.PRIMARY, note: 'variant 없으면 자동으로 primary'},
  {k: 'SECONDARY', v: BUTTON_VARIANT.SECONDARY},
  {k: 'GHOST', v: BUTTON_VARIANT.GHOST},
  {k: 'EMPHASIS', v: BUTTON_VARIANT.EMPHASIS},
  {k: 'INACTIVE', v: BUTTON_VARIANT.INACTIVE, note: '클릭 이벤트가 동작하지 않는 시각적 비활성 상태'},
  {k: 'NONE', v: BUTTON_VARIANT.NONE, label: '텍스트 버튼'},
  {k: 'SUCCESS', v: BUTTON_VARIANT.SUCCESS},
  {k: 'WARNING', v: BUTTON_VARIANT.WARNING},
  {k: 'DANGER', v: BUTTON_VARIANT.DANGER},
  {k: 'INFO', v: BUTTON_VARIANT.INFO},
  {k: 'PRIMARY_LIGHT', v: BUTTON_VARIANT.PRIMARY_LIGHT},
  {k: 'SUCCESS_LIGHT', v: BUTTON_VARIANT.SUCCESS_LIGHT},
  {k: 'WARNING_LIGHT', v: BUTTON_VARIANT.WARNING_LIGHT},
  {k: 'DANGER_LIGHT', v: BUTTON_VARIANT.DANGER_LIGHT},
  {k: 'INFO_LIGHT', v: BUTTON_VARIANT.INFO_LIGHT}
]
const SIZE_ROWS: {k: keyof typeof BUTTON_SIZE; v: string; suffix: string}[] = [
  {k: 'LG', v: BUTTON_SIZE.LG, suffix: ''},
  {k: 'MD', v: BUTTON_SIZE.MD, suffix: ' (기본)'},
  {k: 'SM', v: BUTTON_SIZE.SM, suffix: ''}
]
const row = 'display:flex;gap:10px;flex-wrap:wrap'

const ClickCounter = defineComponent({
  name: 'ButtonClickCounter',
  setup() {
    const count = ref(0)
    return () =>
      h('div', {style: 'display:flex;align-items:center;gap:12px'}, [
        h(Button, {onClick: () => count.value++}, () => '클릭해보세요'),
        count.value > 0
          ? h('span', {style: 'font-size:13px;font-weight:600;color:var(--m2m-pg-brand)'}, `${count.value}번 클릭됨`)
          : null
      ])
  }
})
</script>

<template>
  <div>
    <PageHeader title="Button" component="Button" desc="— 공통 버튼 컴포넌트. variant prop 으로 스타일을 지정합니다." />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <template v-if="tab === 'variant'">
          <ComponentSection
            v-for="{k, v, label, note} in VARIANTS"
            :key="v"
            :title="`variant=&quot;${v}&quot;`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Button, {BUTTON_VARIANT} from \x27m2m-uiux-vue/Button\x27',
              '</script>',
              '',
              '<template>',
              `  <Button :variant=&quot;BUTTON_VARIANT[\x27${k}\x27]&quot;>${label ?? 'Button'}</Button>`,
              '</template>'
            ]"
            :notes="note ? [note] : undefined"
          >
            <Button :variant="BUTTON_VARIANT[k]">{{ label ?? 'Button' }}</Button>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'size'">
          <ComponentSection
            v-for="{k, v, suffix} in SIZE_ROWS"
            :key="v"
            :title="`size=&quot;${v}&quot;${suffix}`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Button, {BUTTON_SIZE} from \x27m2m-uiux-vue/Button\x27',
              '</script>',
              '',
              '<template>',
              `  <Button :size=&quot;BUTTON_SIZE[\x27${k}\x27]&quot;>Button</Button>`,
              '</template>'
            ]"
            :notes="v === 'md' ? ['size 없으면 자동으로 md'] : undefined"
          >
            <Button :size="BUTTON_SIZE[k]">Button</Button>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'round'">
          <ComponentSection
            title="round={true} — 캡슐형"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Button, {BUTTON_VARIANT} from \x27m2m-uiux-vue/Button\x27',
              '</script>',
              '',
              '<template>',
              '  <Button :round=&quot;true&quot;>Button</Button>',
              '  <Button :round=&quot;true&quot; :variant=&quot;BUTTON_VARIANT[\x27GHOST\x27]&quot;>ghost</Button>',
              '</template>'
            ]"
          >
            <div :style="row">
              <Button round>Button</Button>
              <Button round :variant="BUTTON_VARIANT['GHOST']">ghost</Button>
            </div>
          </ComponentSection>
          <ComponentSection
            title="round={false} (기본)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Button from \x27m2m-uiux-vue/Button\x27',
              '</script>',
              '',
              '<template>',
              '  <Button :round=&quot;false&quot;>Button</Button>',
              '</template>'
            ]"
            :notes="['기본값은 false (8px border-radius)']"
          >
            <Button :round="false">Button</Button>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'disabled'">
          <ComponentSection
            title="disabled={true}"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Button, {BUTTON_VARIANT} from \x27m2m-uiux-vue/Button\x27',
              '</script>',
              '',
              '<template>',
              '  <Button :disabled=&quot;true&quot;>Button</Button>',
              '  <Button :disabled=&quot;true&quot; :variant=&quot;BUTTON_VARIANT[\x27GHOST\x27]&quot;>ghost</Button>',
              '</template>'
            ]"
            :notes="['HTML disabled 속성 적용, 클릭 이벤트 차단']"
          >
            <div :style="row">
              <Button disabled>Button</Button>
              <Button disabled :variant="BUTTON_VARIANT['GHOST']">ghost</Button>
            </div>
          </ComponentSection>
          <ComponentSection
            title="disabled={false} (기본)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Button from \x27m2m-uiux-vue/Button\x27',
              '</script>',
              '',
              '<template>',
              '  <Button :disabled=&quot;false&quot;>Button</Button>',
              '</template>'
            ]"
          >
            <Button :disabled="false">Button</Button>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'loading'">
          <ComponentSection
            title="loading={true} — 로딩 스피너"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import Button from \x27m2m-uiux-vue/Button\x27',
              '',
              'const isLoading = ref(false)',
              'async function save() {',
              '  isLoading.value = true',
              '  await saveData()',
              '  isLoading.value = false',
              '}',
              '</script>',
              '',
              '<template>',
              '  <Button :loading=&quot;isLoading&quot; @click=&quot;save&quot;>저장 중...</Button>',
              '</template>'
            ]"
            :notes="['loading 상태에서는 @click 이 차단됨', 'API 호출·파일 업로드 등 비동기 작업 중 사용']"
          >
            <Button loading>저장 중…</Button>
          </ComponentSection>
          <ComponentSection
            title="loading={true} — 각 variant"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Button, {BUTTON_VARIANT} from \x27m2m-uiux-vue/Button\x27',
              '</script>',
              '',
              '<template>',
              '  <Button :variant=&quot;BUTTON_VARIANT[\x27PRIMARY\x27]&quot; loading>처리 중</Button>',
              '  <Button :variant=&quot;BUTTON_VARIANT[\x27SECONDARY\x27]&quot; loading>처리 중</Button>',
              '  <Button :variant=&quot;BUTTON_VARIANT[\x27GHOST\x27]&quot; loading>처리 중</Button>',
              '</template>'
            ]"
          >
            <div :style="row">
              <Button :variant="BUTTON_VARIANT['PRIMARY']" loading>처리 중</Button>
              <Button :variant="BUTTON_VARIANT['SECONDARY']" loading>처리 중</Button>
              <Button :variant="BUTTON_VARIANT['GHOST']" loading>처리 중</Button>
            </div>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'fullWidth'">
          <ComponentSection
            title="fullWidth={true}"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Button from \x27m2m-uiux-vue/Button\x27',
              '</script>',
              '',
              '<template>',
              '  <Button :full-width=&quot;true&quot;>Button</Button>',
              '</template>'
            ]"
            :notes="['부모 너비에 맞게 100% 확장']"
          >
            <div style="width: 300px"><Button full-width>Button</Button></div>
          </ComponentSection>
          <ComponentSection
            title="fullWidth={false} (기본)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Button from \x27m2m-uiux-vue/Button\x27',
              '</script>',
              '',
              '<template>',
              '  <Button :full-width=&quot;false&quot;>Button</Button>',
              '</template>'
            ]"
          >
            <Button :full-width="false">Button</Button>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'icon'">
          <ComponentSection
            title="아이콘 왼쪽 — Icon 을 slot 앞에"
            description="iconPosition prop 없이, Icon 을 원하는 위치에 직접 slot 으로 넣습니다."
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Button from \x27m2m-uiux-vue/Button\x27',
              'import Icon from \x27m2m-uiux-vue/Icon\x27',
              '</script>',
              '',
              '<template>',
              '  <Button>',
              '    <Icon name=&quot;search&quot; :size=&quot;14&quot; />',
              '    검색',
              '  </Button>',
              '</template>'
            ]"
          >
            <div :style="row">
              <Button><Icon name="search" :size="14" />검색</Button>
              <Button :variant="BUTTON_VARIANT['GHOST']"><Icon name="filter" :size="14" />필터</Button>
              <Button :variant="BUTTON_VARIANT['SECONDARY']"><Icon name="download" :size="14" />다운로드</Button>
            </div>
          </ComponentSection>
          <ComponentSection
            title="아이콘 오른쪽 — Icon 을 slot 뒤에"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Button from \x27m2m-uiux-vue/Button\x27',
              'import Icon from \x27m2m-uiux-vue/Icon\x27',
              '</script>',
              '',
              '<template>',
              '  <Button>',
              '    다음',
              '    <Icon name=&quot;arrow-right&quot; :size=&quot;14&quot; />',
              '  </Button>',
              '</template>'
            ]"
          >
            <div :style="row">
              <Button>이전<Icon name="arrow-left" :size="14" /></Button>
              <Button>다음<Icon name="arrow-right" :size="14" /></Button>
              <Button :variant="BUTTON_VARIANT['GHOST']">더보기<Icon name="chevron-down" :size="14" /></Button>
            </div>
          </ComponentSection>
          <ComponentSection
            title="아이콘만 (icon only)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Button from \x27m2m-uiux-vue/Button\x27',
              'import Icon from \x27m2m-uiux-vue/Icon\x27',
              '</script>',
              '',
              '<template>',
              '  <Button><Icon name=&quot;plus&quot; :size=&quot;16&quot; /></Button>',
              '  <Button round><Icon name=&quot;edit&quot; :size=&quot;16&quot; /></Button>',
              '</template>'
            ]"
            :notes="[
              '별도 iconPosition prop 없이 slot 순서로 위치를 제어',
              'Icon size 는 버튼 size 에 맞게 조절 권장 (sm:12, md:14~16, lg:18~20)'
            ]"
          >
            <div :style="row">
              <Button><Icon name="plus" :size="16" /></Button>
              <Button :variant="BUTTON_VARIANT['GHOST']"><Icon name="search" :size="16" /></Button>
              <Button :variant="BUTTON_VARIANT['SECONDARY']"><Icon name="settings" :size="16" /></Button>
              <Button round><Icon name="edit" :size="16" /></Button>
            </div>
          </ComponentSection>
          <ComponentSection
            title="아이콘 + 텍스트 — 다양한 조합"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Button, {BUTTON_SIZE} from \x27m2m-uiux-vue/Button\x27',
              'import Icon from \x27m2m-uiux-vue/Icon\x27',
              '</script>',
              '',
              '<template>',
              '  <Button :size=&quot;BUTTON_SIZE[\x27SM\x27]&quot;>',
              '    <Icon name=&quot;upload&quot; :size=&quot;12&quot; />',
              '    업로드',
              '  </Button>',
              '</template>'
            ]"
          >
            <div :style="row">
              <Button :size="BUTTON_SIZE['SM']"><Icon name="upload" :size="12" />업로드</Button>
              <Button :size="BUTTON_SIZE['MD']"><Icon name="plus" :size="14" />추가하기</Button>
              <Button :size="BUTTON_SIZE['LG']"><Icon name="check" :size="18" />확인</Button>
              <Button :variant="BUTTON_VARIANT['GHOST']"><Icon name="trash" :size="14" />삭제</Button>
              <Button :variant="BUTTON_VARIANT['EMPHASIS']" round><Icon name="bell" :size="14" />알림</Button>
            </div>
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'onClick'"
          title="onClick 이벤트 핸들러"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Button from \x27m2m-uiux-vue/Button\x27',
            '',
            'function handleClick() {',
            '  console.log(\x27button clicked\x27)',
            '}',
            '</script>',
            '',
            '<template>',
            '  <Button @click=&quot;handleClick&quot;>클릭해보세요</Button>',
            '</template>'
          ]"
          :notes="['disabled / loading / inactive 상태에서는 onClick 이 실행되지 않음']"
        >
          <ClickCounter />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'classNames'"
          title="classNames — 추가 스타일"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Button from \x27m2m-uiux-vue/Button\x27',
            '</script>',
            '',
            '<template>',
            '  <Button class-names=&quot;mt-2 shadow-orange&quot;>커스텀 버튼</Button>',
            '</template>'
          ]"
          :notes="['classNames prop 은 문자열 또는 배열 허용', '기존 스타일을 덮어쓸 때 사용']"
        >
          <Button classNames="demo-hint">커스텀 버튼</Button>
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
