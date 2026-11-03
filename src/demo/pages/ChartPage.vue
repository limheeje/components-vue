<script setup lang="ts">
import Chart, {CHART_PALETTE, CHART_SERIES_TYPE, CHART_TYPE} from '~/components/Chart'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['line', 'bar', 'area', 'pie', 'composed', 'radar', 'scatter', 'color', 'responsive']

/** 각 preview 코드 블록 상단에 함께 노출할 data 형태 스니펫 */
const D_MONTHLY = [
  'const data = [',
  '  { month: \x271월\x27, 방문자: 4200, 전환: 320, 매출: 1800 },',
  '  { month: \x272월\x27, 방문자: 3800, 전환: 290, 매출: 1540 },',
  '  // …',
  ']',
  ''
]
const D_CATEGORY = [
  'const data = [',
  '  { category: \x27의류\x27, 금액: 3800 },',
  '  { category: \x27전자\x27, 금액: 5200 },',
  '  // …',
  ']',
  ''
]
const D_WEEKLY = [
  'const data = [',
  '  { day: \x27Mon\x27, A팀: 82, B팀: 74 },',
  '  { day: \x27Tue\x27, A팀: 91, B팀: 68 },',
  '  // …',
  ']',
  ''
]
const D_SOURCE = [
  'const data = [',
  '  { name: \x27검색\x27, value: 38 },',
  '  { name: \x27SNS\x27, value: 27 },',
  '  // …',
  ']',
  ''
]
const D_RADAR = [
  'const data = [',
  '  { subject: \x27기획\x27, A팀: 88, B팀: 72 },',
  '  { subject: \x27디자인\x27, A팀: 92, B팀: 85 },',
  '  // …',
  ']',
  ''
]
const D_SCATTER = ['const data = [{ x: 42, y: 71 }, { x: 18, y: 25 }, /* … */]', '']

const monthly = [
  {month: '1월', 방문자: 4200, 전환: 320, 매출: 1800},
  {month: '2월', 방문자: 3800, 전환: 290, 매출: 1540},
  {month: '3월', 방문자: 5100, 전환: 410, 매출: 2210},
  {month: '4월', 방문자: 4700, 전환: 375, 매출: 1980},
  {month: '5월', 방문자: 6300, 전환: 520, 매출: 2750},
  {month: '6월', 방문자: 5800, 전환: 470, 매출: 2490}
]
const category = [
  {category: '의류', 금액: 3800},
  {category: '전자', 금액: 5200},
  {category: '식품', 금액: 2900},
  {category: '가구', 금액: 1800},
  {category: '도서', 금액: 960},
  {category: '스포츠', 금액: 2400}
]
const weekly = [
  {day: 'Mon', A팀: 82, B팀: 74},
  {day: 'Tue', A팀: 91, B팀: 68},
  {day: 'Wed', A팀: 78, B팀: 85},
  {day: 'Thu', A팀: 95, B팀: 79},
  {day: 'Fri', A팀: 88, B팀: 92}
]
const source = [
  {name: '검색', value: 38},
  {name: 'SNS', value: 27},
  {name: '직접', value: 18},
  {name: '이메일', value: 11},
  {name: '기타', value: 6}
]
const radar = [
  {subject: '기획', A팀: 88, B팀: 72},
  {subject: '디자인', A팀: 92, B팀: 85},
  {subject: '개발', A팀: 76, B팀: 94},
  {subject: 'QA', A팀: 84, B팀: 78},
  {subject: '배포', A팀: 70, B팀: 88},
  {subject: '문서화', A팀: 95, B팀: 65}
]
const scatter = Array.from({length: 24}, () => ({
  x: Math.round(20 + Math.random() * 80),
  y: Math.round(10 + Math.random() * 90)
}))
</script>

<template>
  <div>
    <PageHeader
      title="Chart / Graph"
      component="Chart"
      desc="— Line · Bar · Area · Pie · Donut · Composed · Radar · Scatter 차트. @unovis 기반, 컨테이너 폭에 맞춰 반응형 지원."
    />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <template v-if="tab === 'line'">
          <ComponentSection
            title="Line — 기본 단일 라인"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Chart, {CHART_TYPE} from \x27m2m-uiux-vue/Chart\x27`,
              '',
              ...D_MONTHLY,
              '</script>',
              '',
              '<template>',
              '  <Chart :type=&quot;CHART_TYPE[\x27LINE\x27]&quot; :data=&quot;data&quot; x-key=&quot;month&quot; :series=&quot;[\x27방문자\x27]&quot; />',
              '</template>'
            ]"
            :notes="[
              'data: 평평한 객체 배열 (Record<string, unknown>[]) — 객체 1개 = x축 위의 한 지점',
              'xKey: 가로축 라벨로 쓸 키 / series: y값으로 그릴 키 (나머지 키는 무시)'
            ]"
          >
            <Chart :type="CHART_TYPE['LINE']" :data="monthly" x-key="month" :series="['방문자']" />
          </ComponentSection>
          <ComponentSection
            title="Line — 멀티 라인 + 점선"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Chart, {CHART_TYPE} from \x27m2m-uiux-vue/Chart\x27`,
              '',
              ...D_MONTHLY,
              '</script>',
              '',
              '<template>',
              '  <Chart :type=&quot;CHART_TYPE[\x27LINE\x27]&quot; :data=&quot;data&quot; x-key=&quot;month&quot;',
              '    :series=&quot;[{ key: \x27방문자\x27 }, { key: \x27매출\x27, dashed: true }]&quot; />',
              '</template>'
            ]"
            :notes="[
              'series 원소는 문자열 또는 { key, label?, color?, type?, dashed? }',
              'series[].dashed: true → 점선'
            ]"
          >
            <Chart
              :type="CHART_TYPE['LINE']"
              :data="monthly"
              x-key="month"
              :series="[{key: '방문자'}, {key: '매출', dashed: true}]"
            />
          </ComponentSection>
          <ComponentSection
            title="Line — referenceLines 기준선"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Chart, {CHART_TYPE} from \x27m2m-uiux-vue/Chart\x27`,
              '',
              ...D_MONTHLY,
              '</script>',
              '',
              '<template>',
              '  <Chart :type=&quot;CHART_TYPE[\x27LINE\x27]&quot; :data=&quot;data&quot; x-key=&quot;month&quot; :series=&quot;[\x27방문자\x27]&quot;',
              '    :reference-lines=&quot;[{ value: 5000, label: \x27목표 5,000\x27 }]&quot; />',
              '</template>'
            ]"
            :notes="['y축 기준선 (목표선·임계값 등) — line/bar/area 지원']"
          >
            <Chart
              :type="CHART_TYPE['LINE']"
              :data="monthly"
              x-key="month"
              :series="['방문자']"
              :reference-lines="[{value: 5000, label: '목표 5,000', color: 'var(--m2m-pg-error)'}]"
            />
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'bar'">
          <ComponentSection
            title="Bar — 수직 (기본)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Chart, {CHART_TYPE} from \x27m2m-uiux-vue/Chart\x27`,
              '',
              ...D_CATEGORY,
              '</script>',
              '',
              '<template>',
              '  <Chart :type=&quot;CHART_TYPE[\x27BAR\x27]&quot; :data=&quot;data&quot; x-key=&quot;category&quot; :series=&quot;[\x27금액\x27]&quot; />',
              '</template>'
            ]"
            :notes="['line 과 동일한 data 형태 — 카테고리 키 + 값 키']"
          >
            <Chart :type="CHART_TYPE['BAR']" :data="category" x-key="category" :series="['금액']" />
          </ComponentSection>
          <ComponentSection
            title='Bar — 수평 (layout="vertical")'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Chart, {CHART_TYPE} from \x27m2m-uiux-vue/Chart\x27`,
              '',
              ...D_CATEGORY,
              '</script>',
              '',
              '<template>',
              '  <Chart :type=&quot;CHART_TYPE[\x27BAR\x27]&quot; :data=&quot;data&quot; x-key=&quot;category&quot; :series=&quot;[\x27금액\x27]&quot; layout=&quot;vertical&quot; />',
              '</template>'
            ]"
            :notes="['카테고리가 많거나 라벨이 길 때 가독성이 좋습니다']"
          >
            <Chart :type="CHART_TYPE['BAR']" :data="category" x-key="category" :series="['금액']" layout="vertical" />
          </ComponentSection>
          <ComponentSection
            title="Bar — 그룹형 (Grouped)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Chart, {CHART_TYPE} from \x27m2m-uiux-vue/Chart\x27`,
              '',
              ...D_WEEKLY,
              '</script>',
              '',
              '<template>',
              '  <Chart :type=&quot;CHART_TYPE[\x27BAR\x27]&quot; :data=&quot;data&quot; x-key=&quot;day&quot; :series=&quot;[\x27A팀\x27, \x27B팀\x27]&quot; />',
              '</template>'
            ]"
            :notes="['series 를 2개 이상 넣으면 그룹형 막대 (같은 x 에 나란히)']"
          >
            <Chart :type="CHART_TYPE['BAR']" :data="weekly" x-key="day" :series="['A팀', 'B팀']" />
          </ComponentSection>
          <ComponentSection
            title="Bar — 누적형 (Stacked)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Chart, {CHART_TYPE} from \x27m2m-uiux-vue/Chart\x27`,
              '',
              ...D_WEEKLY,
              '</script>',
              '',
              '<template>',
              '  <Chart :type=&quot;CHART_TYPE[\x27BAR\x27]&quot; :data=&quot;data&quot; x-key=&quot;day&quot; :series=&quot;[\x27A팀\x27, \x27B팀\x27]&quot; stacked />',
              '</template>'
            ]"
          >
            <Chart :type="CHART_TYPE['BAR']" :data="weekly" x-key="day" :series="['A팀', 'B팀']" stacked />
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'area'">
          <ComponentSection
            title="Area — 그라디언트 채우기"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Chart, {CHART_TYPE} from \x27m2m-uiux-vue/Chart\x27`,
              '',
              ...D_MONTHLY,
              '</script>',
              '',
              '<template>',
              '  <Chart :type=&quot;CHART_TYPE[\x27AREA\x27]&quot; :data=&quot;data&quot; x-key=&quot;month&quot; :series=&quot;[\x27방문자\x27]&quot; />',
              '</template>'
            ]"
          >
            <Chart :type="CHART_TYPE['AREA']" :data="monthly" x-key="month" :series="['방문자']" />
          </ComponentSection>
          <ComponentSection
            title="Area — 누적 스택 (stackId 공유)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Chart, {CHART_TYPE} from \x27m2m-uiux-vue/Chart\x27`,
              '',
              ...D_MONTHLY,
              '</script>',
              '',
              '<template>',
              '  <Chart :type=&quot;CHART_TYPE[\x27AREA\x27]&quot; :data=&quot;data&quot; x-key=&quot;month&quot; :series=&quot;[\x27방문자\x27, \x27매출\x27]&quot; stacked />',
              '</template>'
            ]"
          >
            <Chart :type="CHART_TYPE['AREA']" :data="monthly" x-key="month" :series="['방문자', '매출']" stacked />
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'pie'">
          <ComponentSection
            title="Pie — 원형 (레이블 내부 퍼센트)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Chart, {CHART_TYPE} from \x27m2m-uiux-vue/Chart\x27`,
              '',
              ...D_SOURCE,
              '</script>',
              '',
              '<template>',
              '  <Chart :type=&quot;CHART_TYPE[\x27PIE\x27]&quot; :data=&quot;data&quot; x-key=&quot;name&quot; :series=&quot;[\x27value\x27]&quot; />',
              '</template>'
            ]"
            :notes="['pie/donut: 객체 1개 = 조각 1개', 'xKey = 조각 이름, series 는 값 키 딱 1개']"
          >
            <Chart :type="CHART_TYPE['PIE']" :data="source" x-key="name" :series="['value']" :height="240" />
          </ComponentSection>
          <ComponentSection
            title="Pie — 도넛 (innerRadius + paddingAngle)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Chart, {CHART_TYPE} from \x27m2m-uiux-vue/Chart\x27`,
              '',
              ...D_SOURCE,
              '</script>',
              '',
              '<template>',
              '  <Chart :type=&quot;CHART_TYPE[\x27DONUT\x27]&quot; :data=&quot;data&quot; x-key=&quot;name&quot; :series=&quot;[\x27value\x27]&quot; />',
              '</template>'
            ]"
          >
            <Chart :type="CHART_TYPE['DONUT']" :data="source" x-key="name" :series="['value']" :height="240" />
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'composed'"
          title="Composed — Bar + Line + Area 혼합"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            `import Chart, {CHART_SERIES_TYPE} from \x27m2m-uiux-vue/Chart\x27`,
            '',
            ...D_MONTHLY,
            '</script>',
            '',
            '<template>',
            '  <Chart :data=&quot;data&quot; x-key=&quot;month&quot;',
            '    :series=&quot;[',
            '      { key: \x27방문자\x27, type: CHART_SERIES_TYPE[\x27BAR\x27] },',
            '      { key: \x27매출\x27, type: CHART_SERIES_TYPE[\x27AREA\x27] },',
            '      { key: \x27전환\x27, type: CHART_SERIES_TYPE[\x27LINE\x27] },',
            '    ]&quot; />',
            '</template>'
          ]"
          :notes="['series[i].type 으로 Bar/Line/Area 를 자유 조합']"
        >
          <Chart
            :data="monthly"
            x-key="month"
            :series="[
              {key: '방문자', type: CHART_SERIES_TYPE['BAR']},
              {key: '매출', type: CHART_SERIES_TYPE['AREA']},
              {key: '전환', type: CHART_SERIES_TYPE['LINE']}
            ]"
          />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'radar'"
          title="Radar — 방사형 (다중 지표 비교)"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            `import Chart, {CHART_TYPE} from \x27m2m-uiux-vue/Chart\x27`,
            '',
            ...D_RADAR,
            '</script>',
            '',
            '<template>',
            '  <Chart :type=&quot;CHART_TYPE[\x27RADAR\x27]&quot; :data=&quot;data&quot; x-key=&quot;subject&quot;',
            '    :series=&quot;[\x27A팀\x27, \x27B팀\x27]&quot; />',
            '</template>'
          ]"
          :notes="['각 data 행 = 축(꼭짓점) 하나, 각 series = 폴리곤 하나']"
        >
          <Chart :type="CHART_TYPE['RADAR']" :data="radar" x-key="subject" :series="['A팀', 'B팀']" :height="300" />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'scatter'"
          title="Scatter — 분포 (2축 상관관계)"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            `import Chart, {CHART_TYPE} from \x27m2m-uiux-vue/Chart\x27`,
            '',
            ...D_SCATTER,
            '</script>',
            '',
            '<template>',
            '  <Chart :type=&quot;CHART_TYPE[\x27SCATTER\x27]&quot; :data=&quot;data&quot; x-key=&quot;x&quot; :series=&quot;[\x27y\x27]&quot; />',
            '</template>'
          ]"
          :notes="['객체 1개 = 점 1개', 'xKey = x 좌표 키, series 는 y 좌표 키 1개']"
        >
          <Chart :type="CHART_TYPE['SCATTER']" :data="scatter" x-key="x" :series="['y']" :height="280" />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'color'"
          title="컬러 팔레트 & 개별 색상 적용"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            `import Chart, {CHART_TYPE, CHART_PALETTE} from \x27m2m-uiux-vue/Chart\x27`,
            '',
            ...D_CATEGORY,
            '&lt;!-- CHART_PALETTE: 기본 8색 팔레트. colors prop 으로 교체 --&gt;',
            '</script>',
            '',
            '<template>',
            '  &lt;!-- series[i].color 로 개별 지정도 가능 --&gt;',
            '  <Chart',
            '    :type=&quot;CHART_TYPE[\x27BAR\x27]&quot;',
            '    :data=&quot;data&quot;',
            '    x-key=&quot;category&quot;',
            '    :series=&quot;[\x27금액\x27]&quot;',
            '    :colors=&quot;[\x27#8B5CF6\x27, \x27#06B6D4\x27]&quot;',
            '  />',
            '</template>'
          ]"
        >
          <div class="demo-col">
            <div class="demo-row" style="gap: 8px; flex-wrap: wrap">
              <div v-for="c in CHART_PALETTE" :key="c" style="text-align: center">
                <div :style="{width: '40px', height: '40px', borderRadius: '8px', background: c}" />
                <code style="font-size: 9px">{{ c }}</code>
              </div>
            </div>
            <Chart
              :type="CHART_TYPE['BAR']"
              :data="category"
              x-key="category"
              :series="['금액']"
              :colors="['#8B5CF6']"
            />
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'responsive'"
          title="반응형 자동 리사이즈"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            `import Chart, {CHART_TYPE} from \x27m2m-uiux-vue/Chart\x27`,
            '',
            ...D_MONTHLY,
            '</script>',
            '',
            '<template>',
            '  &lt;!-- 컨테이너 폭에 맞춰 자동 스케일 --&gt;',
            '  <div style=&quot;max-width: 380px&quot;>',
            '    <Chart :type=&quot;CHART_TYPE[\x27AREA\x27]&quot; :data=&quot;data&quot; x-key=&quot;month&quot; :series=&quot;[\x27방문자\x27]&quot; :height=&quot;200&quot; />',
            '  </div>',
            '</template>'
          ]"
          :notes="['height 는 px 고정, 가로는 컨테이너에 맞춰 스케일']"
        >
          <div style="max-width: 380px">
            <Chart :type="CHART_TYPE['AREA']" :data="monthly" x-key="month" :series="['방문자']" :height="200" />
          </div>
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
