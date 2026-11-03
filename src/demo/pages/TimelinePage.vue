<script setup lang="ts">
import Timeline, {TIMELINE_ALIGN, TIMELINE_COLOR, TIMELINE_DIRECTION, TIMELINE_STATUS} from '~/components/Timeline'
import type {TimelineItem} from '~/components/Timeline'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['items', 'direction', 'align', 'pending', 'color']

const ORDER: TimelineItem[] = [
  {
    title: '주문 완료',
    description: '주문이 정상 접수되었습니다.',
    date: '2026.04.01 10:00',
    status: TIMELINE_STATUS['SUCCESS'],
    icon: 'check'
  },
  {
    title: '결제 완료',
    description: '결제가 확인되었습니다.',
    date: '2026.04.01 10:05',
    status: TIMELINE_STATUS['SUCCESS'],
    icon: 'check'
  },
  {
    title: '배송 준비',
    description: '상품을 포장 중입니다.',
    date: '2026.04.02 09:00',
    status: TIMELINE_STATUS['PROCESSING']
  },
  {title: '배송 중', description: '택배사에 인계되었습니다.', date: '2026.04.03 14:00'},
  {title: '배송 완료', description: '상품이 배달되었습니다.', date: '2026.04.04 11:30', status: TIMELINE_STATUS['GRAY']}
]

const STEPS: TimelineItem[] = [
  {title: '기획', description: '요구사항 수집', date: '2026 Q1', status: TIMELINE_STATUS['SUCCESS']},
  {title: '디자인', description: 'UI/UX 설계', date: '2026 Q2', status: TIMELINE_STATUS['SUCCESS']},
  {title: '개발', description: '구현', date: '2026 Q3', status: TIMELINE_STATUS['PROCESSING']},
  {title: 'QA', description: '테스트', date: '2026 Q4', status: TIMELINE_STATUS['GRAY']},
  {title: '출시', description: '배포', date: '2027 Q1', status: TIMELINE_STATUS['GRAY']}
]

// 하드코딩 문자열 대신 export 상수(TIMELINE_COLOR) 키로 관리
const COLORS: (keyof typeof TIMELINE_COLOR)[] = ['PRIMARY', 'SUCCESS', 'GRAY']
</script>

<template>
  <div>
    <PageHeader
      title="Timeline"
      component="Timeline"
      desc="— 주문 배송 조회·승인 절차·연혁 등 시간 흐름을 시각화합니다. 수직/수평, 정렬 방향, 상태 색상을 지원합니다."
    />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <ComponentSection
          v-if="tab === 'items'"
          title="items — 데이터 배열"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Timeline, {TIMELINE_STATUS} from \x27m2m-uiux-vue/Timeline\x27',
            '',
            'const items = [',
            '  { title: \x27주문 완료\x27, description: \x27접수됨\x27, date: \x2704.01\x27, status: TIMELINE_STATUS[\x27SUCCESS\x27], icon: \x27check\x27 },',
            '  { title: \x27배송 중\x27, status: TIMELINE_STATUS[\x27PROCESSING\x27] },',
            ']',
            '<\/script>',
            '',
            '<template>',
            '  <Timeline :items=&quot;items&quot; />',
            '</template>'
          ]"
          :notes="[
            'status: \x27default\x27|\x27success\x27|\x27warning\x27|\x27error\x27|\x27processing\x27|\x27gray\x27',
            'icon 은 노드 내부에 렌더 (아이콘 이름)'
          ]"
        >
          <Timeline :items="ORDER" />
        </ComponentSection>

        <template v-else-if="tab === 'direction'">
          <ComponentSection
            title='direction="vertical" (기본)'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Timeline, {TIMELINE_DIRECTION} from \x27m2m-uiux-vue/Timeline\x27`,
              '</' + 'script>',
              '',
              '<template>',
              '  <Timeline :direction=&quot;TIMELINE_DIRECTION[\x27VERTICAL\x27]&quot; :items=&quot;items&quot; />',
              '</template>'
            ]"
          >
            <Timeline :items="STEPS.slice(0, 4)" />
          </ComponentSection>
          <ComponentSection
            title='direction="horizontal" — 가로 스크롤'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Timeline, {TIMELINE_DIRECTION} from \x27m2m-uiux-vue/Timeline\x27`,
              '</' + 'script>',
              '',
              '<template>',
              '  <Timeline :direction=&quot;TIMELINE_DIRECTION[\x27HORIZONTAL\x27]&quot; :items=&quot;items&quot; />',
              '</template>'
            ]"
          >
            <Timeline :items="STEPS" :direction="TIMELINE_DIRECTION['HORIZONTAL']" />
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'align'">
          <ComponentSection
            title='align="left" (기본)'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Timeline, {TIMELINE_ALIGN} from \x27m2m-uiux-vue/Timeline\x27`,
              '</' + 'script>',
              '',
              '<template>',
              '  <Timeline :align=&quot;TIMELINE_ALIGN[\x27LEFT\x27]&quot; :items=&quot;items&quot; />',
              '</template>'
            ]"
          >
            <Timeline :items="ORDER.slice(0, 3)" :align="TIMELINE_ALIGN['LEFT']" />
          </ComponentSection>
          <ComponentSection
            title='align="right"'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Timeline, {TIMELINE_ALIGN} from \x27m2m-uiux-vue/Timeline\x27`,
              '</' + 'script>',
              '',
              '<template>',
              '  <Timeline :align=&quot;TIMELINE_ALIGN[\x27RIGHT\x27]&quot; :items=&quot;items&quot; />',
              '</template>'
            ]"
          >
            <Timeline :items="ORDER.slice(0, 3)" :align="TIMELINE_ALIGN['RIGHT']" />
          </ComponentSection>
          <ComponentSection
            title='align="alternate" — 지그재그'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Timeline, {TIMELINE_ALIGN} from \x27m2m-uiux-vue/Timeline\x27`,
              '</' + 'script>',
              '',
              '<template>',
              '  <Timeline :align=&quot;TIMELINE_ALIGN[\x27ALTERNATE\x27]&quot; :items=&quot;items&quot; />',
              '</template>'
            ]"
            :notes="['짝수 인덱스 → 오른쪽, 홀수 인덱스 → 왼쪽']"
          >
            <Timeline :items="STEPS" :align="TIMELINE_ALIGN['ALTERNATE']" />
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'pending'">
          <ComponentSection
            title="pending — 진행 중 노드 추가"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Timeline from \x27m2m-uiux-vue/Timeline\x27',
              '<\/script>',
              '',
              '<template>',
              '  <Timeline :items=&quot;items&quot; pending />',
              '</template>'
            ]"
            :notes="['마지막에 점선 + 펄스 노드가 추가됩니다']"
          >
            <Timeline :items="ORDER.slice(0, 3)" pending />
          </ComponentSection>
          <ComponentSection
            title="pending — 커스텀 문구"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Timeline from \x27m2m-uiux-vue/Timeline\x27',
              '<\/script>',
              '',
              '<template>',
              '  <Timeline :items=&quot;items&quot; pending=&quot;조회 중입니다...&quot; />',
              '</template>'
            ]"
          >
            <Timeline
              :items="ORDER.slice(0, 3)"
              :align="TIMELINE_ALIGN['ALTERNATE']"
              pending="배송 정보를 조회 중입니다..."
            />
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'color'">
          <ComponentSection
            v-for="c in COLORS"
            :key="c"
            :title="`color=&quot;${TIMELINE_COLOR[c]}&quot;${c === 'PRIMARY' ? ' (기본)' : ''}`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Timeline, {TIMELINE_COLOR} from \x27m2m-uiux-vue/Timeline\x27`,
              '</' + 'script>',
              '',
              '<template>',
              `  <Timeline :color=&quot;TIMELINE_COLOR[\x27${c}\x27]&quot; :items=&quot;items&quot; />`,
              '</template>'
            ]"
            :notes="c === 'SUCCESS' ? ['개별 항목 status 가 있으면 그 색이 우선'] : undefined"
          >
            <Timeline :items="STEPS.slice(0, 3)" :color="TIMELINE_COLOR[c]" />
          </ComponentSection>
        </template>
      </template>
    </PropTabs>
  </div>
</template>
