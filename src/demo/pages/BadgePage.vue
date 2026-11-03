<script setup lang="ts">
import Badge, {BADGE_SIZE, BADGE_TYPE} from '~/components/Badge'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['type', 'size', 'round', 'dot', 'classNames']

// 데모/코드예시 모두 하드코딩 문자열 대신 export 상수(BADGE_TYPE · BADGE_SIZE) 키로 관리
const SOLID: (keyof typeof BADGE_TYPE)[] = ['PRIMARY', 'SECONDARY', 'SUCCESS', 'WARNING', 'DANGER', 'INFO', 'GHOST']
const LIGHT: (keyof typeof BADGE_TYPE)[] = [
  'PRIMARY_LIGHT',
  'SUCCESS_LIGHT',
  'WARNING_LIGHT',
  'DANGER_LIGHT',
  'INFO_LIGHT'
]
const SIZES: (keyof typeof BADGE_SIZE)[] = ['SM', 'MD', 'LG']

const sizeLabel = (s: string) => (s === 'sm' ? 'Small' : s === 'md' ? 'Medium' : 'Large')
const lightLabel = (t: string) => t.replace('-light', '').toUpperCase()

const dividerStyle =
  'margin-top:16px;padding-top:16px;border-top:1px dashed var(--m2m-pg-comp-border);font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:var(--m2m-pg-comp-text-disabled)'
</script>

<template>
  <div>
    <PageHeader title="Badge" component="Badge" desc="— 상태 표시 배지 컴포넌트." />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <template v-if="tab === 'type'">
          <ComponentSection
            v-for="t in SOLID"
            :key="t"
            :title="`type=&quot;${BADGE_TYPE[t]}&quot;`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Badge, {BADGE_TYPE} from \x27m2m-uiux-vue/Badge\x27',
              '</script>',
              '',
              '<template>',
              `  <Badge :type=&quot;BADGE_TYPE[\x27${t}\x27]&quot;>${BADGE_TYPE[t].toUpperCase()}</Badge>`,
              '</template>'
            ]"
          >
            <Badge :type="BADGE_TYPE[t]">{{ BADGE_TYPE[t].toUpperCase() }}</Badge>
          </ComponentSection>

          <div :style="dividerStyle">Light Variants</div>

          <ComponentSection
            v-for="t in LIGHT"
            :key="t"
            :title="`type=&quot;${BADGE_TYPE[t]}&quot;`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Badge, {BADGE_TYPE} from \x27m2m-uiux-vue/Badge\x27',
              '</script>',
              '',
              '<template>',
              `  <Badge :type=&quot;BADGE_TYPE[\x27${t}\x27]&quot;>${lightLabel(BADGE_TYPE[t])}</Badge>`,
              '</template>'
            ]"
          >
            <Badge :type="BADGE_TYPE[t]">{{ lightLabel(BADGE_TYPE[t]) }}</Badge>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'size'">
          <ComponentSection
            v-for="s in SIZES"
            :key="s"
            :title="`size=&quot;${BADGE_SIZE[s]}&quot;${s === 'MD' ? ' (기본)' : ''}`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Badge, {BADGE_SIZE} from \x27m2m-uiux-vue/Badge\x27',
              '</script>',
              '',
              '<template>',
              `  <Badge :size=&quot;BADGE_SIZE[\x27${s}\x27]&quot;>${sizeLabel(BADGE_SIZE[s])}</Badge>`,
              '</template>'
            ]"
          >
            <Badge :size="BADGE_SIZE[s]">{{ sizeLabel(BADGE_SIZE[s]) }}</Badge>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'round'">
          <ComponentSection
            title="round={true} — 캡슐형"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Badge from \x27m2m-uiux-vue/Badge\x27',
              '</script>',
              '',
              '<template>',
              '  <Badge :round=&quot;true&quot;>캡슐 배지</Badge>',
              '</template>'
            ]"
          >
            <Badge round>캡슐 배지</Badge>
          </ComponentSection>
          <ComponentSection
            title="round={false} (기본) — 사각형"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Badge from \x27m2m-uiux-vue/Badge\x27',
              '</script>',
              '',
              '<template>',
              '  <Badge :round=&quot;false&quot;>사각 배지</Badge>',
              '</template>'
            ]"
          >
            <Badge :round="false">사각 배지</Badge>
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'dot'"
          title="dot={true} — 색상 점 + 평문"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Badge, {BADGE_TYPE} from \x27m2m-uiux-vue/Badge\x27',
            '</script>',
            '',
            '<template>',
            '  <Badge dot :type=&quot;BADGE_TYPE[\x27SUCCESS\x27]&quot;>온라인</Badge>',
            '  <Badge dot :type=&quot;BADGE_TYPE[\x27DANGER\x27]&quot;>오프라인</Badge>',
            '  <Badge dot :type=&quot;BADGE_TYPE[\x27WARNING\x27]&quot;>자리 비움</Badge>',
            '</template>'
          ]"
          :notes="['dot 이면 채운 배지가 아니라 작은 점 + 텍스트로 표시']"
        >
          <div class="demo-col">
            <Badge dot :type="BADGE_TYPE['SUCCESS']">온라인</Badge>
            <Badge dot :type="BADGE_TYPE['DANGER']">오프라인</Badge>
            <Badge dot :type="BADGE_TYPE['WARNING']">자리 비움</Badge>
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'classNames'"
          title="classNames — 추가 스타일"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Badge from \x27m2m-uiux-vue/Badge\x27',
            '</script>',
            '',
            '<template>',
            '  <Badge class-names=&quot;uppercase tracking-wider&quot;>커스텀</Badge>',
            '</template>'
          ]"
        >
          <Badge classNames="demo-hint">커스텀</Badge>
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
