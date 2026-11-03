<script setup lang="ts">
import Breadcrumb, {BREADCRUMB_SIZE} from '~/components/Breadcrumb'
import Icon from '~/components/Icon'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['items', 'separator', 'maxItems', 'size', 'icon']

const SHOP = [
  {label: '홈', href: '/'},
  {label: '카테고리', href: '/category'},
  {label: '전자제품', href: '/category/electronics'},
  {label: '스마트폰', href: '/category/electronics/phone'},
  {label: 'iPhone 15 Pro'}
]

const ADMIN = [{label: '대시보드', href: '/'}, {label: '회원 관리', href: '/members'}, {label: '회원 상세'}]

const ICON_ITEMS = [
  {label: '홈', href: '/', icon: 'home'},
  {label: '프로젝트', href: '/projects', icon: 'folder'},
  {label: '컴포넌트', href: '/components', icon: 'folder'},
  {label: 'Button.vue', icon: 'file'}
]

// 하드코딩 문자열 대신 export 상수(BREADCRUMB_SIZE) 키로 관리
const SIZES: (keyof typeof BREADCRUMB_SIZE)[] = ['SM', 'MD', 'LG']
</script>

<template>
  <div>
    <PageHeader
      title="Breadcrumb"
      component="Breadcrumb"
      desc="— 현재 페이지의 경로를 계층적으로 보여주는 내비게이션 컴포넌트."
    />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <template v-if="tab === 'items'">
          <ComponentSection
            title="items — 경로 배열"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Breadcrumb from \x27m2m-uiux-vue/Breadcrumb\x27',
              '',
              'const items = [',
              '  { label: \x27홈\x27, href: \x27/\x27 },',
              '  { label: \x27카테고리\x27, href: \x27/category\x27 },',
              '  { label: \x27전자제품\x27, href: \x27/category/electronics\x27 },',
              '  { label: \x27iPhone 15 Pro\x27 }, // 마지막 항목: href 없음',
              ']',
              '</script>',
              '',
              '<template>',
              '  <Breadcrumb :items=&quot;items&quot; />',
              '</template>'
            ]"
            :notes="['마지막 항목은 현재 페이지, href 없이 굵게 표시됩니다']"
          >
            <Breadcrumb :items="SHOP" />
          </ComponentSection>
          <ComponentSection
            title="관리자 2단계 경로"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Breadcrumb from \x27m2m-uiux-vue/Breadcrumb\x27',
              '',
              'const items = [',
              '  { label: \x27대시보드\x27, href: \x27/\x27 },',
              '  { label: \x27회원 관리\x27, href: \x27/members\x27 },',
              '  { label: \x27회원 상세\x27 },',
              ']',
              '</script>',
              '',
              '<template>',
              '  <Breadcrumb :items=&quot;items&quot; />',
              '</template>'
            ]"
          >
            <Breadcrumb :items="ADMIN" />
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'separator'">
          <ComponentSection
            title="separator (기본) — chevron 아이콘"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Breadcrumb from \x27m2m-uiux-vue/Breadcrumb\x27',
              '',
              'const items = [{ label: \x27대시보드\x27, href: \x27/\x27 }, { label: \x27회원 상세\x27 }]',
              '</script>',
              '',
              '<template>',
              '  <Breadcrumb :items=&quot;items&quot; />',
              '</template>'
            ]"
          >
            <Breadcrumb :items="ADMIN" />
          </ComponentSection>
          <ComponentSection
            title='separator="/" — Slash 문자'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Breadcrumb from \x27m2m-uiux-vue/Breadcrumb\x27',
              '',
              'const items = [{ label: \x27대시보드\x27, href: \x27/\x27 }, { label: \x27회원 상세\x27 }]',
              '</script>',
              '',
              '<template>',
              '  <Breadcrumb :items=&quot;items&quot; separator=&quot;/&quot; />',
              '</template>'
            ]"
          >
            <Breadcrumb :items="ADMIN" separator="/" />
          </ComponentSection>
          <ComponentSection
            title="separator — Slash 아이콘"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Breadcrumb from \x27m2m-uiux-vue/Breadcrumb\x27',
              'import Icon from \x27m2m-uiux-vue/Icon\x27',
              '',
              'const items = [{ label: \x27대시보드\x27, href: \x27/\x27 }, { label: \x27회원 상세\x27 }]',
              '</script>',
              '',
              '<template>',
              '  <Breadcrumb :items=&quot;items&quot;>',
              '    <template #separator><Icon name=&quot;slash&quot; :size=&quot;12&quot; /></template>',
              '  </Breadcrumb>',
              '</template>'
            ]"
          >
            <Breadcrumb :items="ADMIN">
              <template #separator>
                <Icon name="slash" :size="12" color="var(--m2m-pg-comp-text-disabled)" />
              </template>
            </Breadcrumb>
          </ComponentSection>
          <ComponentSection
            title='separator="›" — 화살표 문자'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Breadcrumb from \x27m2m-uiux-vue/Breadcrumb\x27',
              '',
              'const items = [{ label: \x27대시보드\x27, href: \x27/\x27 }, { label: \x27회원 상세\x27 }]',
              '</script>',
              '',
              '<template>',
              '  <Breadcrumb :items=&quot;items&quot; separator=&quot;›&quot; />',
              '</template>'
            ]"
          >
            <Breadcrumb :items="ADMIN" separator="›" />
          </ComponentSection>
          <ComponentSection
            title='separator="·" — 점'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Breadcrumb from \x27m2m-uiux-vue/Breadcrumb\x27',
              '',
              'const items = [{ label: \x27대시보드\x27, href: \x27/\x27 }, { label: \x27회원 상세\x27 }]',
              '</script>',
              '',
              '<template>',
              '  <Breadcrumb :items=&quot;items&quot; separator=&quot;·&quot; />',
              '</template>'
            ]"
          >
            <Breadcrumb :items="ADMIN" separator="·" />
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'maxItems'">
          <ComponentSection
            title="maxItems={3} — 중간 항목 자동 축약 (··· 버튼 클릭 시 펼침)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Breadcrumb from \x27m2m-uiux-vue/Breadcrumb\x27',
              '',
              'const items = [',
              '  { label: \x27홈\x27, href: \x27/\x27 },',
              '  { label: \x27카테고리\x27, href: \x27/category\x27 },',
              '  { label: \x27전자제품\x27, href: \x27/category/electronics\x27 },',
              '  { label: \x27스마트폰\x27, href: \x27/category/electronics/phone\x27 },',
              '  { label: \x27iPhone 15 Pro\x27 },',
              ']',
              '</script>',
              '',
              '<template>',
              '  <Breadcrumb :items=&quot;items&quot; :max-items=&quot;3&quot; />',
              '</template>'
            ]"
            :notes="[
              '항목이 maxItems 를 초과하면 중간을 ··· 버튼으로 축약합니다',
              '··· 클릭 시 전체 경로가 펼쳐집니다',
              '첫 항목과 마지막 2개는 항상 노출'
            ]"
          >
            <Breadcrumb :items="SHOP" :max-items="3" />
          </ComponentSection>
          <ComponentSection
            title="maxItems 없음 (기본) — 전체 표시"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Breadcrumb from \x27m2m-uiux-vue/Breadcrumb\x27',
              '',
              'const items = [/* ... 5개 항목 ... */]',
              '</script>',
              '',
              '<template>',
              '  <Breadcrumb :items=&quot;items&quot; />',
              '</template>'
            ]"
          >
            <Breadcrumb :items="SHOP" />
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'size'">
          <ComponentSection
            v-for="s in SIZES"
            :key="s"
            :title="`size=&quot;${BREADCRUMB_SIZE[s]}&quot;${s === 'MD' ? ' (기본)' : ''}`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Breadcrumb, {BREADCRUMB_SIZE} from \x27m2m-uiux-vue/Breadcrumb\x27',
              '',
              'const items = [{ label: \x27대시보드\x27, href: \x27/\x27 }, { label: \x27회원 상세\x27 }]',
              '</script>',
              '',
              '<template>',
              `  <Breadcrumb :size=&quot;BREADCRUMB_SIZE[\x27${s}\x27]&quot; :items=&quot;items&quot; />`,
              '</template>'
            ]"
          >
            <Breadcrumb :items="ADMIN" :size="BREADCRUMB_SIZE[s]" />
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'icon'"
          title="icon — 항목별 아이콘"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Breadcrumb from \x27m2m-uiux-vue/Breadcrumb\x27',
            '',
            'const items = [',
            '  { label: \x27홈\x27, href: \x27/\x27, icon: \x27home\x27 },',
            '  { label: \x27프로젝트\x27, href: \x27/projects\x27, icon: \x27folder\x27 },',
            '  { label: \x27Button.vue\x27, icon: \x27file\x27 },',
            ']',
            '</script>',
            '',
            '<template>',
            '  <Breadcrumb :items=&quot;items&quot; />',
            '</template>'
          ]"
          :notes="['icon 에 Icon 이름(string)을 전달합니다']"
        >
          <Breadcrumb :items="ICON_ITEMS" />
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
