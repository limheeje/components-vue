<script setup lang="ts">
import Divider, {DIVIDER_DIRECTION, DIVIDER_LABEL_ALIGN} from '~/components/Divider'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['direction', 'color', 'thickness', 'label', 'dashed', 'classNames']

const W = 'width:300px'
const hint = 'font-size:14px;color:var(--m2m-pg-comp-text-sub)'

const COLORS = [
  {name: 'default', value: 'var(--m2m-pg-comp-border)'},
  {name: 'primary', value: 'var(--m2m-pg-brand)'},
  {name: 'muted', value: 'var(--m2m-pg-comp-bg-hover)'}
]
const THICKNESS = [
  [1, '1px (기본)'],
  [2, '2px'],
  [4, '4px']
] as const
</script>

<template>
  <div>
    <PageHeader
      title="Divider"
      component="Divider"
      desc="— 구분선 컴포넌트. 수평/수직 분리선과 가운데/좌측 라벨을 지원합니다."
    />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <template v-if="tab === 'direction'">
          <ComponentSection
            title="horizontal (기본)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Divider, {DIVIDER_DIRECTION} from \x27m2m-uiux-vue/Divider\x27`,
              '</script>',
              '',
              '<template>',
              '  <Divider />',
              '  &lt;!-- 또는 --&gt;',
              '  <Divider :direction=&quot;DIVIDER_DIRECTION[\x27HORIZONTAL\x27]&quot; />',
              '</template>'
            ]"
          >
            <div :style="W">
              <div :style="`margin-bottom:12px;${hint}`">위 섹션</div>
              <Divider />
              <div :style="`margin-top:12px;${hint}`">아래 섹션</div>
            </div>
          </ComponentSection>
          <ComponentSection
            title="vertical"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Divider, {DIVIDER_DIRECTION} from \x27m2m-uiux-vue/Divider\x27`,
              '</script>',
              '',
              '<template>',
              '  <div style=&quot;display: flex; align-items: center&quot;>',
              '    <span>텍스트 A</span>',
              '    <Divider :direction=&quot;DIVIDER_DIRECTION[\x27VERTICAL\x27]&quot; />',
              '    <span>텍스트 B</span>',
              '  </div>',
              '</template>'
            ]"
          >
            <div style="display: flex; align-items: center; gap: 12px; height: 32px">
              <span :style="hint">텍스트 A</span>
              <Divider :direction="DIVIDER_DIRECTION['VERTICAL']" />
              <span :style="hint">텍스트 B</span>
              <Divider :direction="DIVIDER_DIRECTION['VERTICAL']" />
              <span :style="hint">텍스트 C</span>
            </div>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'color'">
          <ComponentSection
            v-for="c in COLORS"
            :key="c.name"
            :title="`color=&quot;${c.name}&quot;`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Divider from \x27m2m-uiux-vue/Divider\x27',
              '</script>',
              '',
              '<template>',
              `  <Divider color=&quot;${c.value}&quot; />`,
              '</template>'
            ]"
          >
            <div :style="W"><Divider :color="c.value" /></div>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'thickness'">
          <ComponentSection
            v-for="[size, label] in THICKNESS"
            :key="size"
            :title="`thickness={${size}} — ${label}`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Divider from \x27m2m-uiux-vue/Divider\x27',
              '</script>',
              '',
              '<template>',
              `  <Divider :thickness=&quot;${size}&quot; />`,
              '</template>'
            ]"
          >
            <div :style="W"><Divider :thickness="size" /></div>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'label'">
          <ComponentSection
            title="label — 중앙 텍스트"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Divider from \x27m2m-uiux-vue/Divider\x27',
              '</script>',
              '',
              '<template>',
              '  <Divider label=&quot;또는&quot; />',
              '</template>'
            ]"
          >
            <div :style="W"><Divider label="또는" /></div>
          </ComponentSection>
          <ComponentSection
            title="label — 좌측 정렬"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Divider, {DIVIDER_LABEL_ALIGN} from \x27m2m-uiux-vue/Divider\x27`,
              '</script>',
              '',
              '<template>',
              '  <Divider label=&quot;섹션 제목&quot; :label-align=&quot;DIVIDER_LABEL_ALIGN[\x27LEFT\x27]&quot; />',
              '</template>'
            ]"
          >
            <div :style="W"><Divider label="섹션 제목" :label-align="DIVIDER_LABEL_ALIGN['LEFT']" /></div>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'dashed'">
          <ComponentSection
            title="dashed={true}"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Divider from \x27m2m-uiux-vue/Divider\x27',
              '</script>',
              '',
              '<template>',
              '  <Divider :dashed=&quot;true&quot; />',
              '</template>'
            ]"
          >
            <div :style="W"><Divider dashed /></div>
          </ComponentSection>
          <ComponentSection
            title="dashed={false} (기본)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Divider from \x27m2m-uiux-vue/Divider\x27',
              '</script>',
              '',
              '<template>',
              '  <Divider :dashed=&quot;false&quot; />',
              '</template>'
            ]"
          >
            <div :style="W"><Divider :dashed="false" /></div>
          </ComponentSection>
          <ComponentSection
            title="dashed + label"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Divider from \x27m2m-uiux-vue/Divider\x27',
              '</script>',
              '',
              '<template>',
              '  <Divider dashed label=&quot;구분&quot; />',
              '</template>'
            ]"
          >
            <div :style="W"><Divider dashed label="구분" /></div>
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'classNames'"
          title="classNames — 추가 스타일"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Divider from \x27m2m-uiux-vue/Divider\x27',
            '</script>',
            '',
            '<template>',
            '  <Divider class-names=&quot;my-4 border-primary&quot; />',
            '</template>'
          ]"
        >
          <div :style="W"><Divider classNames="demo-hint" color="var(--m2m-pg-brand)" :thickness="2" /></div>
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
