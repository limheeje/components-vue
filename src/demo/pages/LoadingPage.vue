<script setup lang="ts">
import {defineComponent, h, ref} from 'vue'

import Button, {BUTTON_SIZE} from '~/components/Button'
import Loading, {LOADING_COLOR, LOADING_SIZE, LOADING_TYPE} from '~/components/Loading'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['type', 'size', 'color', 'text', 'overlay']

const SIZES: (keyof typeof LOADING_SIZE)[] = ['SM', 'MD', 'LG']
const dark = 'background:#374151;padding:20px 24px;border-radius:10px'

const OverlayDemo = defineComponent({
  name: 'LoadingOverlayDemo',
  setup() {
    const loading = ref(false)
    const start = () => {
      loading.value = true
      setTimeout(() => (loading.value = false), 2500)
    }
    return () =>
      h('div', {class: 'demo-col'}, [
        h(
          'div',
          {
            style:
              'position:relative;width:300px;min-height:140px;padding:20px;border:1px solid var(--m2m-pg-comp-border);border-radius:12px;background:var(--m2m-pg-comp-bg-subtle);color:var(--m2m-pg-comp-text-sub);font-size:13px;line-height:1.8'
          },
          [
            '콘텐츠 영역입니다. 버튼을 누르면 2.5초간 로딩 오버레이가 덮습니다.',
            loading.value ? h(Loading, {overlay: true, text: '데이터를 불러오는 중…'}) : null
          ]
        ),
        h(Button, {size: BUTTON_SIZE['SM'], disabled: loading.value, onClick: start}, () =>
          loading.value ? '로딩 중…' : '▶ 로딩 시작 (2.5s)'
        )
      ])
  }
})
</script>

<template>
  <div>
    <PageHeader
      title="Loading"
      component="Loading"
      desc="— 데이터 처리 중 시각적 피드백을 제공합니다. Spinner·Dots·Skeleton 세 가지 타입과 Overlay 모드를 지원합니다."
    />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <template v-if="tab === 'type'">
          <ComponentSection
            title='type="spinner" — 회전 스피너'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Loading, {LOADING_TYPE} from \x27m2m-uiux-vue/Loading\x27',
              '</script>',
              '',
              '<template>',
              '  <Loading :type=&quot;LOADING_TYPE[\x27SPINNER\x27]&quot; />',
              '</template>'
            ]"
            :notes="['가장 범용적인 로딩 표시']"
          >
            <Loading :type="LOADING_TYPE['SPINNER']" />
          </ComponentSection>
          <ComponentSection
            title='type="dots" — 점 세 개 바운스'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Loading, {LOADING_TYPE} from \x27m2m-uiux-vue/Loading\x27',
              '</script>',
              '',
              '<template>',
              '  <Loading :type=&quot;LOADING_TYPE[\x27DOTS\x27]&quot; />',
              '</template>'
            ]"
            :notes="['버튼 내부나 인라인 로딩에 적합']"
          >
            <Loading :type="LOADING_TYPE['DOTS']" />
          </ComponentSection>
          <ComponentSection
            title='type="skeleton" — 스켈레톤 UI'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Loading, {LOADING_TYPE} from \x27m2m-uiux-vue/Loading\x27',
              '</script>',
              '',
              '<template>',
              '  <Loading :type=&quot;LOADING_TYPE[\x27SKELETON\x27]&quot; />',
              '</template>'
            ]"
            :notes="['콘텐츠 레이아웃을 미리 보여주는 형태', 'shimmer 애니메이션 포함 (color prop 무시)']"
          >
            <Loading :type="LOADING_TYPE['SKELETON']" />
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'size'">
          <ComponentSection
            v-for="s in SIZES"
            :key="s"
            :title="`size=&quot;${LOADING_SIZE[s]}&quot;${s === 'MD' ? ' (기본)' : ''}`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Loading, {LOADING_TYPE, LOADING_SIZE} from \x27m2m-uiux-vue/Loading\x27`,
              '</script>',
              '',
              '<template>',
              `  <Loading :type=&quot;LOADING_TYPE[\x27SPINNER\x27]&quot; :size=&quot;LOADING_SIZE[\x27${s}\x27]&quot; />`,
              '</template>'
            ]"
          >
            <div class="demo-row" style="gap: 32px; align-items: flex-start; flex-wrap: wrap">
              <Loading :type="LOADING_TYPE['SPINNER']" :size="LOADING_SIZE[s]" />
              <Loading :type="LOADING_TYPE['DOTS']" :size="LOADING_SIZE[s]" />
              <Loading :type="LOADING_TYPE['SKELETON']" :size="LOADING_SIZE[s]" />
            </div>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'color'">
          <ComponentSection
            title='color="primary" (기본)'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Loading, {LOADING_COLOR} from \x27m2m-uiux-vue/Loading\x27',
              '</script>',
              '',
              '<template>',
              '  <Loading :color=&quot;LOADING_COLOR[\x27PRIMARY\x27]&quot; />',
              '</template>'
            ]"
          >
            <div class="demo-row" style="gap: 32px; align-items: center">
              <Loading :color="LOADING_COLOR['PRIMARY']" />
              <Loading :type="LOADING_TYPE['DOTS']" :color="LOADING_COLOR['PRIMARY']" />
            </div>
          </ComponentSection>
          <ComponentSection
            title='color="neutral" — 회색'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Loading, {LOADING_COLOR} from \x27m2m-uiux-vue/Loading\x27',
              '</script>',
              '',
              '<template>',
              '  <Loading :color=&quot;LOADING_COLOR[\x27NEUTRAL\x27]&quot; />',
              '</template>'
            ]"
          >
            <div class="demo-row" style="gap: 32px; align-items: center">
              <Loading :color="LOADING_COLOR['NEUTRAL']" />
              <Loading :type="LOADING_TYPE['DOTS']" :color="LOADING_COLOR['NEUTRAL']" />
            </div>
          </ComponentSection>
          <ComponentSection
            title='color="white" — 흰색 (어두운 배경용)'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Loading, {LOADING_COLOR} from \x27m2m-uiux-vue/Loading\x27',
              '</script>',
              '',
              '<template>',
              '  <Loading :color=&quot;LOADING_COLOR[\x27WHITE\x27]&quot; />',
              '</template>'
            ]"
            :notes="['어두운 배경 위에서 overlay 와 함께 사용합니다']"
          >
            <div class="demo-row" :style="`gap:32px;align-items:center;${dark}`">
              <Loading :color="LOADING_COLOR['WHITE']" />
              <Loading :type="LOADING_TYPE['DOTS']" :color="LOADING_COLOR['WHITE']" />
            </div>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'text'">
          <ComponentSection
            title="text — 안내 문구"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Loading, {LOADING_TYPE} from \x27m2m-uiux-vue/Loading\x27',
              '</script>',
              '',
              '<template>',
              '  <Loading :type=&quot;LOADING_TYPE[\x27SPINNER\x27]&quot; text=&quot;데이터를 불러오는 중입니다...&quot; />',
              '</template>'
            ]"
            :notes="['스피너 하단에 안내 문구가 표시됩니다']"
          >
            <Loading text="데이터를 불러오는 중입니다…" />
          </ComponentSection>
          <ComponentSection
            title="Dots + text"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Loading, {LOADING_TYPE} from \x27m2m-uiux-vue/Loading\x27',
              '</script>',
              '',
              '<template>',
              '  <Loading :type=&quot;LOADING_TYPE[\x27DOTS\x27]&quot; text=&quot;잠시만 기다려주세요&quot; />',
              '</template>'
            ]"
          >
            <Loading :type="LOADING_TYPE['DOTS']" text="잠시만 기다려주세요" />
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'overlay'"
          title="overlay={true} — 컨테이너 딤 처리 (버튼 클릭)"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import Loading from \x27m2m-uiux-vue/Loading\x27',
            '',
            'const isLoading = ref(false)',
            '</script>',
            '',
            '<template>',
            '  <div style=&quot;position: relative&quot;>',
            '    <ContentArea />',
            '    <Loading v-if=&quot;isLoading&quot; overlay text=&quot;데이터를 불러오는 중...&quot; />',
            '  </div>',
            '</template>'
          ]"
          :notes="['부모 요소에 position: relative 필수', '전체 페이지 딤 처리 시 body 에 직접 적용']"
        >
          <OverlayDemo />
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
