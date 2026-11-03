<script setup lang="ts">
import {h} from 'vue'

import Swiper, {SWIPER_PAGINATION} from '~/components/Swiper'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['items', 'autoplay', 'loop', 'navigation', 'pagination', 'slidesPerView', 'spaceBetween']

const COLORS: [string, string][] = [
  ['#FFF5F0', '#FF5A00'],
  ['#EFF6FF', '#3B82F6'],
  ['#F0FDF4', '#22C55E'],
  ['#FEF9C3', '#F59E0B'],
  ['#FDF4FF', '#A855F7']
]

function slide(i: number, height = 180) {
  const [bg, accent] = COLORS[i % COLORS.length] as [string, string]
  return h(
    'div',
    {
      style: {
        height: `${height}px`,
        background: bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px'
      }
    },
    [
      h('div', {style: {fontSize: '24px', fontWeight: 800, color: accent}}, `Slide ${i + 1}`),
      h(
        'div',
        {style: {fontSize: '12px', color: `${accent}99`}},
        `${['첫', '두', '세', '네', '다섯'][i % 5]} 번째 슬라이드`
      )
    ]
  )
}

const S5 = Array.from({length: 5}, (_, i) => slide(i))
const S5sm = Array.from({length: 5}, (_, i) => slide(i, 130))

// 하드코딩 문자열 대신 export 상수(SWIPER_PAGINATION) 키로 관리
const PAGINATIONS: (keyof typeof SWIPER_PAGINATION)[] = ['BULLETS', 'FRACTION', 'PROGRESSBAR']
const GAPS = [0, 16, 24]
</script>

<template>
  <div>
    <PageHeader
      title="Swiper / Carousel"
      component="Swiper"
      desc="— 이미지 배너·카드 등을 좌우 슬라이드로 넘기는 컴포넌트. 자동재생·무한루프·다중 슬라이드를 지원합니다."
    />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <ComponentSection
          v-if="tab === 'items'"
          title="items (또는 기본 slot) — 슬라이드 배열"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Swiper from \x27m2m-uiux-vue/Swiper\x27',
            '<\/script>',
            '',
            '<template>',
            '  &lt;!-- 기본 slot 으로 슬라이드 전달 --&gt;',
            '  <Swiper>',
            '    <img src=&quot;/a.jpg&quot; />',
            '    <img src=&quot;/b.jpg&quot; />',
            '  </Swiper>',
            '  &lt;!-- 또는 items prop 으로 VNode 배열 전달 --&gt;',
            '  <Swiper :items=&quot;slides&quot; />',
            '</template>'
          ]"
          :notes="['기본 slot 또는 items prop 모두 허용', '각 슬라이드는 임의의 VNode']"
        >
          <Swiper :items="S5" />
        </ComponentSection>

        <template v-else-if="tab === 'autoplay'">
          <ComponentSection
            title="autoplay={true} — 기본 2800ms 자동 재생"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Swiper from \x27m2m-uiux-vue/Swiper\x27',
              '<\/script>',
              '',
              '<template>',
              '  <Swiper :items=&quot;slides&quot; autoplay loop />',
              '</template>'
            ]"
            :notes="['loop 없이 쓰면 마지막 슬라이드에서 자동 정지']"
          >
            <Swiper :items="S5" autoplay loop />
          </ComponentSection>
          <ComponentSection
            title="autoplay={1500} — ms 단위로 속도 지정"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Swiper from \x27m2m-uiux-vue/Swiper\x27',
              '<\/script>',
              '',
              '<template>',
              '  <Swiper :items=&quot;slides&quot; :autoplay=&quot;1500&quot; loop />',
              '</template>'
            ]"
            :notes="['숫자를 전달하면 해당 ms 간격으로 넘어갑니다']"
          >
            <Swiper :items="S5" :autoplay="1500" loop />
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'loop'">
          <ComponentSection
            title="loop={true} — 무한 반복"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Swiper from \x27m2m-uiux-vue/Swiper\x27',
              '<\/script>',
              '',
              '<template>',
              '  <Swiper :items=&quot;slides&quot; loop autoplay />',
              '</template>'
            ]"
            :notes="['마지막 슬라이드 → 다음 → 첫 번째로 돌아갑니다']"
          >
            <Swiper :items="S5" loop :autoplay="2500" />
          </ComponentSection>
          <ComponentSection
            title="loop={false} (기본) — 끝에서 정지"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Swiper from \x27m2m-uiux-vue/Swiper\x27',
              '<\/script>',
              '',
              '<template>',
              '  <Swiper :items=&quot;slides&quot; />',
              '</template>'
            ]"
            :notes="['양 끝 화살표가 비활성화됩니다']"
          >
            <Swiper :items="S5" />
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'navigation'">
          <ComponentSection
            title="navigation={true} (기본) — 화살표 버튼"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Swiper from \x27m2m-uiux-vue/Swiper\x27',
              '<\/script>',
              '',
              '<template>',
              '  <Swiper :items=&quot;slides&quot; navigation />',
              '</template>'
            ]"
          >
            <Swiper :items="S5" navigation />
          </ComponentSection>
          <ComponentSection
            title="navigation={false} — 화살표 숨김"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Swiper from \x27m2m-uiux-vue/Swiper\x27',
              '<\/script>',
              '',
              '<template>',
              '  <Swiper :items=&quot;slides&quot; :navigation=&quot;false&quot; />',
              '</template>'
            ]"
            :notes="['터치·드래그 전용 환경에서 사용']"
          >
            <Swiper :items="S5" :navigation="false" :pagination="SWIPER_PAGINATION['BULLETS']" />
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'pagination'">
          <ComponentSection
            v-for="p in PAGINATIONS"
            :key="p"
            :title="`pagination=&quot;${SWIPER_PAGINATION[p]}&quot;${p === 'BULLETS' ? ' (기본)' : ''}`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Swiper, {SWIPER_PAGINATION} from \x27m2m-uiux-vue/Swiper\x27`,
              '<\/script>',
              '',
              '<template>',
              `  <Swiper :items=&quot;slides&quot; :pagination=&quot;SWIPER_PAGINATION[\x27${p}\x27]&quot; />`,
              '</template>'
            ]"
            :notes="p === 'BULLETS' ? ['현재 슬라이드 점이 브랜드색으로 늘어납니다'] : undefined"
          >
            <Swiper :items="S5" :pagination="SWIPER_PAGINATION[p]" :navigation="false" />
          </ComponentSection>
          <ComponentSection
            title="pagination={false} — 숨김"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Swiper from \x27m2m-uiux-vue/Swiper\x27',
              '<\/script>',
              '',
              '<template>',
              '  <Swiper :items=&quot;slides&quot; :pagination=&quot;false&quot; />',
              '</template>'
            ]"
          >
            <Swiper :items="S5" :pagination="false" />
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'slidesPerView'">
          <ComponentSection
            title="slidesPerView={1} (기본)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Swiper from \x27m2m-uiux-vue/Swiper\x27',
              '<\/script>',
              '',
              '<template>',
              '  <Swiper :items=&quot;slides&quot; :slides-per-view=&quot;1&quot; />',
              '</template>'
            ]"
          >
            <Swiper :items="S5" :slides-per-view="1" />
          </ComponentSection>
          <ComponentSection
            title="slidesPerView={2} — 2개씩 노출"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Swiper from \x27m2m-uiux-vue/Swiper\x27',
              '<\/script>',
              '',
              '<template>',
              '  <Swiper :items=&quot;slides&quot; :slides-per-view=&quot;2&quot; :space-between=&quot;12&quot; />',
              '</template>'
            ]"
          >
            <Swiper :items="S5sm" :slides-per-view="2" :space-between="12" />
          </ComponentSection>
          <ComponentSection
            title="slidesPerView={3} — 3개씩 노출"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Swiper from \x27m2m-uiux-vue/Swiper\x27',
              '<\/script>',
              '',
              '<template>',
              '  <Swiper :items=&quot;slides&quot; :slides-per-view=&quot;3&quot; :space-between=&quot;10&quot; />',
              '</template>'
            ]"
          >
            <Swiper
              :items="S5sm"
              :slides-per-view="3"
              :space-between="10"
              :pagination="SWIPER_PAGINATION['FRACTION']"
            />
          </ComponentSection>
          <ComponentSection
            title="slidesPerView={1.3} — 다음 슬라이드 살짝 노출"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Swiper from \x27m2m-uiux-vue/Swiper\x27',
              '<\/script>',
              '',
              '<template>',
              '  <Swiper :items=&quot;slides&quot; :slides-per-view=&quot;1.3&quot; :space-between=&quot;12&quot; />',
              '</template>'
            ]"
            :notes="['소수값을 넣으면 다음 슬라이드가 살짝 걸쳐 보입니다']"
          >
            <Swiper :items="S5sm" :slides-per-view="1.3" :space-between="12" />
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'spaceBetween'">
          <ComponentSection
            v-for="g in GAPS"
            :key="g"
            :title="`spaceBetween={${g}}`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Swiper from \x27m2m-uiux-vue/Swiper\x27',
              '<\/script>',
              '',
              '<template>',
              `  <Swiper :items=&quot;slides&quot; :slides-per-view=&quot;2&quot; :space-between=&quot;${g}&quot; />`,
              '</template>'
            ]"
            :notes="g === 24 ? ['슬라이드 사이의 간격(px)을 지정합니다'] : undefined"
          >
            <Swiper :items="S5sm" :slides-per-view="2" :space-between="g" />
          </ComponentSection>
        </template>
      </template>
    </PropTabs>
  </div>
</template>
