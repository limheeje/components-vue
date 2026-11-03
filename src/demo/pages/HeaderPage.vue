<script setup lang="ts">
import Header, {HEADER_TYPE} from '~/components/Header'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['type', 'title', 'back', 'actions', 'logo', 'sticky', 'classNames']
const wrap = 'max-width:480px;width:100%'
const ACTIONS = [
  {icon: 'search', label: '검색'},
  {icon: 'bell', label: '알림', badge: 3},
  {icon: 'user', label: '프로필'}
]
const logoStyle =
  'width:28px;height:28px;border-radius:6px;background:var(--m2m-pg-brand);color:#fff;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center'
</script>

<template>
  <div>
    <PageHeader title="Header" component="Header" desc="— 페이지 상단 헤더 컴포넌트." />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <template v-if="tab === 'type'">
          <ComponentSection
            title='type="default" (기본) — 흰 배경'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Header, {HEADER_TYPE} from \x27m2m-uiux-vue/Header\x27`,
              '</script>',
              '',
              '<template>',
              '  <Header :type=&quot;HEADER_TYPE[\x27DEFAULT\x27]&quot; title=&quot;페이지 제목&quot; />',
              '</template>'
            ]"
          >
            <div :style="wrap"><Header :type="HEADER_TYPE['DEFAULT']" title="페이지 제목" :actions="ACTIONS" /></div>
          </ComponentSection>
          <ComponentSection
            title='type="primary" — 브랜드 컬러'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Header, {HEADER_TYPE} from \x27m2m-uiux-vue/Header\x27`,
              '</script>',
              '',
              '<template>',
              '  <Header :type=&quot;HEADER_TYPE[\x27PRIMARY\x27]&quot; title=&quot;페이지 제목&quot; />',
              '</template>'
            ]"
          >
            <div :style="wrap"><Header :type="HEADER_TYPE['PRIMARY']" title="페이지 제목" :actions="ACTIONS" /></div>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'title'">
          <ComponentSection
            title="title — 페이지 제목"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Header from \x27m2m-uiux-vue/Header\x27',
              '</script>',
              '',
              '<template>',
              '  <Header title=&quot;회원 목록&quot; />',
              '</template>'
            ]"
          >
            <div :style="wrap"><Header title="회원 목록" :actions="ACTIONS" /></div>
          </ComponentSection>
          <ComponentSection
            title="title — 긴 텍스트 처리 (말줄임)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Header from \x27m2m-uiux-vue/Header\x27',
              '</script>',
              '',
              '<template>',
              '  <Header title=&quot;매우 긴 페이지 제목이 들어올 경우 처리&quot; />',
              '</template>'
            ]"
            :notes="['overflow ellipsis 자동 처리']"
          >
            <div :style="wrap">
              <Header title="매우 긴 페이지 제목이 들어올 경우 말줄임 처리됩니다" :actions="ACTIONS" />
            </div>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'back'">
          <ComponentSection
            title="back={true} — 뒤로 가기 버튼"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Header from \x27m2m-uiux-vue/Header\x27',
              '',
              'function goBack() {',
              '  history.back()',
              '}',
              '</script>',
              '',
              '<template>',
              '  <Header title=&quot;상세 페이지&quot; :back=&quot;true&quot; @back=&quot;goBack&quot; />',
              '</template>'
            ]"
          >
            <div :style="wrap"><Header title="상세 페이지" back @back="alert('back')" /></div>
          </ComponentSection>
          <ComponentSection
            title="back={false} (기본)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Header from \x27m2m-uiux-vue/Header\x27',
              '</script>',
              '',
              '<template>',
              '  <Header title=&quot;페이지 제목&quot; :back=&quot;false&quot; />',
              '</template>'
            ]"
          >
            <div :style="wrap"><Header title="페이지 제목" :actions="ACTIONS" /></div>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'actions'">
          <ComponentSection
            title="actions — 우측 액션 영역 (아이콘 + badge)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Header from \x27m2m-uiux-vue/Header\x27',
              '',
              'const actions = [',
              '  { icon: \x27search\x27, label: \x27검색\x27, onClick: handleSearch },',
              '  { icon: \x27bell\x27, label: \x27알림\x27, badge: 3, onClick: handleAlerts },',
              '  { icon: \x27user\x27, label: \x27프로필\x27, onClick: handleProfile }',
              ']',
              '</script>',
              '',
              '<template>',
              '  <Header title=&quot;페이지 제목&quot; :actions=&quot;actions&quot; />',
              '</template>'
            ]"
          >
            <div :style="wrap"><Header title="페이지 제목" :actions="ACTIONS" /></div>
          </ComponentSection>
          <ComponentSection
            title="actions 없음"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Header from \x27m2m-uiux-vue/Header\x27',
              '</script>',
              '',
              '<template>',
              '  <Header title=&quot;페이지 제목&quot; />',
              '</template>'
            ]"
          >
            <div :style="wrap"><Header title="페이지 제목" /></div>
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'logo'"
          title="logo — 좌측 로고 표시"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Header from \x27m2m-uiux-vue/Header\x27',
            '</script>',
            '',
            '<template>',
            '  <Header :actions=&quot;actions&quot;>',
            '    <template #logo><Logo /></template>',
            '  </Header>',
            '</template>'
          ]"
        >
          <div :style="wrap">
            <Header :actions="ACTIONS.slice(1)">
              <template #logo>
                <span style="display: inline-flex; align-items: center; gap: 8px">
                  <span :style="logoStyle">M2</span>
                  <span style="font-size: 15px; font-weight: 700">M2M UIUX</span>
                </span>
              </template>
            </Header>
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'sticky'"
          title="sticky={true} — 스크롤 시 상단 고정 + 그림자"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Header from \x27m2m-uiux-vue/Header\x27',
            '</script>',
            '',
            '<template>',
            '  &lt;!-- position: sticky; top: 0; z-index: 100; 이 자동 적용 --&gt;',
            '  <Header title=&quot;페이지 제목&quot; :sticky=&quot;true&quot; />',
            '</template>'
          ]"
          :notes="['sticky 시 그림자 자동 적용']"
        >
          <div
            :style="`${wrap};height:160px;overflow-y:auto;border:1px solid var(--m2m-pg-comp-border);border-radius:8px`"
          >
            <Header title="고정 헤더" sticky :actions="ACTIONS" />
            <div style="padding: 16px; font-size: 12px; line-height: 2">
              <p v-for="i in 12" :key="i" style="margin: 0">스크롤 콘텐츠 {{ i }}</p>
            </div>
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'classNames'"
          title="classNames — 추가 스타일"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Header from \x27m2m-uiux-vue/Header\x27',
            '</script>',
            '',
            '<template>',
            '  <Header title=&quot;페이지&quot; class-names=&quot;shadow-md px-6&quot; />',
            '</template>'
          ]"
        >
          <div :style="wrap"><Header title="커스텀" classNames="demo-hint" :actions="ACTIONS" /></div>
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
