<script setup lang="ts">
import Tooltip, {TOOLTIP_PLACEMENT, TOOLTIP_TRIGGER} from '~/components/Tooltip'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['placement', 'trigger', 'content', 'arrow', 'delay', 'classNames']

// 하드코딩 문자열 대신 export 상수(TOOLTIP_PLACEMENT) 키로 관리
const PLACEMENTS: (keyof typeof TOOLTIP_PLACEMENT)[] = ['TOP', 'BOTTOM', 'LEFT', 'RIGHT']
const btnStyle =
  'padding:8px 16px;border:1px solid var(--m2m-pg-comp-border-sub);border-radius:8px;background:var(--m2m-pg-comp-bg);color:var(--m2m-pg-comp-text);cursor:pointer;font:inherit'
</script>

<template>
  <div>
    <PageHeader title="Tooltip" component="Tooltip" desc="— 마우스 오버 시 팝업되는 도움말 컴포넌트." />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <template v-if="tab === 'placement'">
          <ComponentSection
            v-for="p in PLACEMENTS"
            :key="p"
            :title="`placement=&quot;${TOOLTIP_PLACEMENT[p]}&quot;`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Tooltip, {TOOLTIP_PLACEMENT} from \x27m2m-uiux-vue/Tooltip\x27`,
              '<\/script>',
              '',
              '<template>',
              '  <Tooltip',
              `    :placement=&quot;TOOLTIP_PLACEMENT[\x27${p}\x27]&quot;`,
              '    content=&quot;툴팁 내용&quot;',
              '  >',
              '    <button>툴팁 대상</button>',
              '  </Tooltip>',
              '</template>'
            ]"
          >
            <div style="padding: 40px 80px">
              <Tooltip :placement="TOOLTIP_PLACEMENT[p]" :content="`${TOOLTIP_PLACEMENT[p]} 방향 툴팁`">
                <button type="button" :style="btnStyle">툴팁 대상</button>
              </Tooltip>
            </div>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'trigger'">
          <ComponentSection
            title='trigger="hover" (기본)'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Tooltip, {TOOLTIP_TRIGGER} from \x27m2m-uiux-vue/Tooltip\x27`,
              '<\/script>',
              '',
              '<template>',
              '  <Tooltip :trigger=&quot;TOOLTIP_TRIGGER[\x27HOVER\x27]&quot; content=&quot;마우스를 올려보세요&quot;>',
              '    <button>마우스 오버</button>',
              '  </Tooltip>',
              '</template>'
            ]"
            :notes="['hover 는 키보드 focus 도 트리거로 동작']"
          >
            <div style="padding: 40px">
              <Tooltip content="마우스를 올려보세요">
                <button type="button" :style="btnStyle">마우스 오버</button>
              </Tooltip>
            </div>
          </ComponentSection>
          <ComponentSection
            title='trigger="click"'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Tooltip, {TOOLTIP_TRIGGER} from \x27m2m-uiux-vue/Tooltip\x27`,
              '<\/script>',
              '',
              '<template>',
              '  <Tooltip :trigger=&quot;TOOLTIP_TRIGGER[\x27CLICK\x27]&quot; content=&quot;클릭해서 토글&quot;>',
              '    <button>클릭</button>',
              '  </Tooltip>',
              '</template>'
            ]"
          >
            <div style="padding: 40px">
              <Tooltip :trigger="TOOLTIP_TRIGGER['CLICK']" content="클릭해서 토글">
                <button type="button" :style="btnStyle">클릭</button>
              </Tooltip>
            </div>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'content'">
          <ComponentSection
            title="content — 텍스트"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Tooltip from \x27m2m-uiux-vue/Tooltip\x27',
              '<\/script>',
              '',
              '<template>',
              '  <Tooltip content=&quot;간단한 도움말 텍스트&quot;><button>?</button></Tooltip>',
              '</template>'
            ]"
          >
            <div style="padding: 40px">
              <Tooltip content="간단한 도움말 텍스트">
                <button type="button" :style="btnStyle">?</button>
              </Tooltip>
            </div>
          </ComponentSection>
          <ComponentSection
            title="content — 노드 (slot)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Tooltip from \x27m2m-uiux-vue/Tooltip\x27',
              '<\/script>',
              '',
              '<template>',
              '  <Tooltip>',
              '    <template #content><b>제목</b> · 설명 텍스트</template>',
              '    <button>?</button>',
              '  </Tooltip>',
              '</template>'
            ]"
          >
            <div style="padding: 40px">
              <Tooltip>
                <template #content
                  ><span><strong>제목</strong> · 설명 텍스트</span></template
                >
                <button type="button" :style="btnStyle">?</button>
              </Tooltip>
            </div>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'arrow'">
          <ComponentSection
            title="arrow={true} (기본)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Tooltip from \x27m2m-uiux-vue/Tooltip\x27',
              '<\/script>',
              '',
              '<template>',
              '  <Tooltip :arrow=&quot;true&quot; content=&quot;화살표 있음&quot;><button>대상</button></Tooltip>',
              '</template>'
            ]"
          >
            <div style="padding: 40px">
              <Tooltip content="화살표 있음">
                <button type="button" :style="btnStyle">툴팁 대상</button>
              </Tooltip>
            </div>
          </ComponentSection>
          <ComponentSection
            title="arrow={false}"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Tooltip from \x27m2m-uiux-vue/Tooltip\x27',
              '<\/script>',
              '',
              '<template>',
              '  <Tooltip :arrow=&quot;false&quot; content=&quot;화살표 없음&quot;><button>대상</button></Tooltip>',
              '</template>'
            ]"
          >
            <div style="padding: 40px">
              <Tooltip :arrow="false" content="화살표 없음">
                <button type="button" :style="btnStyle">툴팁 대상</button>
              </Tooltip>
            </div>
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'delay'"
          title="delay — 등장 지연 (ms)"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Tooltip from \x27m2m-uiux-vue/Tooltip\x27',
            '<\/script>',
            '',
            '<template>',
            '  <Tooltip :delay=&quot;500&quot; content=&quot;0.5초 후 등장&quot;><button>마우스 오버</button></Tooltip>',
            '</template>'
          ]"
          :notes="['delay 기본값은 0ms']"
        >
          <div style="padding: 40px">
            <Tooltip :delay="500" content="0.5초 후 등장">
              <button type="button" :style="btnStyle">마우스 오버</button>
            </Tooltip>
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'classNames'"
          title="classNames — 추가 스타일"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Tooltip from \x27m2m-uiux-vue/Tooltip\x27',
            '<\/script>',
            '',
            '<template>',
            '  <Tooltip class-names=&quot;max-w-xs&quot; content=&quot;커스텀&quot;><button>대상</button></Tooltip>',
            '</template>'
          ]"
        >
          <div style="padding: 40px">
            <Tooltip classNames="demo-hint" content="커스텀">
              <button type="button" :style="btnStyle">툴팁 대상</button>
            </Tooltip>
          </div>
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
