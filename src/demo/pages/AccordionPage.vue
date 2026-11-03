<script setup lang="ts">
import {ref} from 'vue'

import Accordion, {ACCORDION_TYPE} from '~/components/Accordion'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['single', 'multiple', 'disabled', 'classNames']
const CONTENT = '아코디언 내부 콘텐츠가 여기에 표시됩니다. 자세한 설명이나 추가 정보를 담을 수 있습니다.'
const open = ref('item-1')
const openItems = ref(['item-1', 'item-2'])
const disabledOpen = ref('item-1')
</script>

<template>
  <div>
    <PageHeader
      title="Accordion"
      component="Accordion"
      desc="— 접기/펼치기 컴포넌트. single/multiple 모드를 지원하며 v-model 로만 제어합니다."
    />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <ComponentSection
          v-if="tab === 'single'"
          title='type="single" (기본) — v-model 로 하나만 열림'
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import Accordion, {ACCORDION_TYPE} from \x27m2m-uiux-vue/Accordion\x27',
            '',
            'const open = ref(\x27item-1\x27) // 열린 항목 없으면 \x27\x27',
            '</script>',
            '',
            '<template>',
            '  &lt;!-- open 과 일치하는 Item 이 열림. 클릭 시 open 이 갱신됨 --&gt;',
            '  <Accordion :type=&quot;ACCORDION_TYPE[\x27SINGLE\x27]&quot; v-model=&quot;open&quot;>',
            '    <Accordion.Item value=&quot;item-1&quot; title=&quot;항목 1&quot;>내부 콘텐츠</Accordion.Item>',
            '    <Accordion.Item value=&quot;item-2&quot; title=&quot;항목 2&quot;>내부 콘텐츠</Accordion.Item>',
            '  </Accordion>',
            '</template>'
          ]"
          :notes="[
            'type=single 이면 하나만 열리고 나머지는 자동으로 닫힘',
            '같은 항목을 다시 클릭하면 open 이 빈 문자열이 됨'
          ]"
        >
          <div class="demo-col" style="width: 340px">
            <Accordion :type="ACCORDION_TYPE['SINGLE']" v-model="open">
              <Accordion.Item value="item-1" title="항목 1">{{ CONTENT }}</Accordion.Item>
              <Accordion.Item value="item-2" title="항목 2">{{ CONTENT }}</Accordion.Item>
              <Accordion.Item value="item-3" title="항목 3">{{ CONTENT }}</Accordion.Item>
            </Accordion>
            <span class="demo-hint">open: {{ open || '(없음)' }}</span>
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'multiple'"
          title='type="multiple" — v-model 배열'
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import Accordion, {ACCORDION_TYPE} from \x27m2m-uiux-vue/Accordion\x27',
            '',
            'const openItems = ref([\x27item-1\x27, \x27item-2\x27])',
            '</script>',
            '',
            '<template>',
            '  &lt;!-- 클릭으로 열고 닫으면 openItems 배열이 양방향 갱신됨 --&gt;',
            '  <Accordion :type=&quot;ACCORDION_TYPE[\x27MULTIPLE\x27]&quot; v-model=&quot;openItems&quot;>',
            '    <Accordion.Item value=&quot;item-1&quot; title=&quot;항목 1&quot;>…</Accordion.Item>',
            '    <Accordion.Item value=&quot;item-2&quot; title=&quot;항목 2&quot;>…</Accordion.Item>',
            '  </Accordion>',
            '</template>'
          ]"
          :notes="['여러 패널을 동시에 열 수 있음', 'v-model 배열이 열린 항목과 양방향 동기화']"
        >
          <div class="demo-col" style="width: 340px">
            <Accordion :type="ACCORDION_TYPE['MULTIPLE']" v-model="openItems">
              <Accordion.Item value="item-1" title="항목 1">{{ CONTENT }}</Accordion.Item>
              <Accordion.Item value="item-2" title="항목 2">{{ CONTENT }}</Accordion.Item>
              <Accordion.Item value="item-3" title="항목 3">{{ CONTENT }}</Accordion.Item>
            </Accordion>
            <span class="demo-hint">openItems: [{{ openItems.join(', ') }}]</span>
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'disabled'"
          title="disabled 항목"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import Accordion from \x27m2m-uiux-vue/Accordion\x27',
            '',
            'const open = ref(\x27item-1\x27)',
            '</script>',
            '',
            '<template>',
            '  <Accordion v-model=&quot;open&quot;>',
            '    <Accordion.Item value=&quot;item-1&quot; title=&quot;활성 항목&quot;>…</Accordion.Item>',
            '    <Accordion.Item value=&quot;item-2&quot; title=&quot;비활성 항목&quot; disabled>…</Accordion.Item>',
            '  </Accordion>',
            '</template>'
          ]"
        >
          <div style="width: 340px">
            <Accordion :type="ACCORDION_TYPE['SINGLE']" v-model="disabledOpen">
              <Accordion.Item value="item-1" title="활성 항목">{{ CONTENT }}</Accordion.Item>
              <Accordion.Item value="item-2" title="비활성 항목" disabled>{{ CONTENT }}</Accordion.Item>
            </Accordion>
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'classNames'"
          title="classNames"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Accordion, {ACCORDION_TYPE} from \x27m2m-uiux-vue/Accordion\x27',
            '</script>',
            '',
            '<template>',
            '  <Accordion class-names=&quot;w-full&quot; :type=&quot;ACCORDION_TYPE[\x27SINGLE\x27]&quot;>',
            '    <Accordion.Item value=&quot;item-1&quot; title=&quot;항목 1&quot;>…</Accordion.Item>',
            '  </Accordion>',
            '</template>'
          ]"
        >
          <div style="width: 340px">
            <Accordion :type="ACCORDION_TYPE['SINGLE']" classNames="demo-hint">
              <Accordion.Item value="item-1" title="항목 1">{{ CONTENT }}</Accordion.Item>
            </Accordion>
          </div>
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
