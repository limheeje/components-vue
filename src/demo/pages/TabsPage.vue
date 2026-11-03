<script setup lang="ts">
import {ref} from 'vue'

import Tabs, {TABS_SIZE, TABS_TYPE} from '~/components/Tabs'
import type {TabItem} from '~/components/Tabs'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['items', 'type', 'size', 'centered', 'fullWidth', 'icon', 'badge', 'disabled']

const activeTab = ref('profile')

const boxStyle = (color = '#FF5A00') =>
  `padding:12px 16px;border-radius:8px;font-size:13px;color:var(--m2m-pg-comp-text-sub);background:${color}0d;border:1px dashed ${color}44`

const BASIC: (TabItem & {tone?: string})[] = [
  {key: 'home', label: '홈', content: '홈 화면 콘텐츠', tone: '#FF5A00'},
  {key: 'profile', label: '프로필', content: '프로필 정보', tone: '#3B82F6'},
  {key: 'settings', label: '설정', content: '설정 화면', tone: '#8B5CF6'}
]
const ICON_ITEMS: (TabItem & {tone?: string})[] = [
  {key: 'home', label: '홈', icon: 'home', content: '홈 콘텐츠', tone: '#FF5A00'},
  {key: 'user', label: '사용자', icon: 'user', content: '사용자 콘텐츠', tone: '#3B82F6'},
  {key: 'noti', label: '알림', icon: 'bell', badge: 5, content: '알림 목록', tone: '#F59E0B'},
  {key: 'cfg', label: '설정', icon: 'settings', content: '설정 화면', tone: '#8B5CF6'}
]
const DOC_ITEMS: (TabItem & {tone?: string})[] = [
  {key: 'desc', label: '개요', icon: 'file-text', content: '컴포넌트 개요', tone: '#FF5A00'},
  {key: 'props', label: 'Props', icon: 'star', content: 'Props 명세', tone: '#F59E0B'},
  {key: 'code', label: '예제', icon: 'file-text', content: '코드 예제', tone: '#22C55E'}
]
const DISABLED: (TabItem & {tone?: string})[] = [
  {key: 'a', label: '활성 탭 1', content: '첫 번째 탭 내용', tone: '#FF5A00'},
  {key: 'b', label: '활성 탭 2', content: '두 번째 탭 내용', tone: '#22C55E'},
  {key: 'c', label: '비활성 탭', disabled: true},
  {key: 'd', label: '활성 탭 3', content: '네 번째 탭 내용', tone: '#3B82F6'}
]
// 하드코딩 문자열 대신 export 상수(TABS_SIZE) 키로 관리
const SIZES: (keyof typeof TABS_SIZE)[] = ['SM', 'MD', 'LG']
</script>

<template>
  <div>
    <PageHeader
      title="Tabs"
      component="Tabs"
      desc="— 콘텐츠 영역을 그룹으로 분리하고 탭으로 전환하는 내비게이션 컴포넌트."
    />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <ComponentSection
          v-if="tab === 'items'"
          title="items / v-model — 탭 배열 + 활성 탭 제어"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import Tabs from \x27m2m-uiux-vue/Tabs\x27',
            '',
            'const items = [',
            '  { key: \x27home\x27,     label: \x27홈\x27,     content: \x27...\x27 },',
            '  { key: \x27profile\x27,  label: \x27프로필\x27,  content: \x27...\x27 },',
            '  { key: \x27settings\x27, label: \x27설정\x27,    content: \x27...\x27 },',
            ']',
            'const activeTab = ref(\x27profile\x27) // 없으면 defaultKey / 첫 탭',
            '</script>',
            '',
            '<template>',
            '  &lt;!-- 탭 클릭 시 activeTab 이 해당 key 로 갱신됨 --&gt;',
            '  <Tabs :items=&quot;items&quot; v-model=&quot;activeTab&quot; />',
            '</template>'
          ]"
          :notes="[
            'key 는 고유 식별자, content 는 선택 시 표시될 문자열 (또는 scoped slot #panel)',
            'v-model 을 생략하면 비제어 — defaultKey 로 초기 탭 지정'
          ]"
        >
          <div class="demo-col">
            <Tabs :items="BASIC" v-model="activeTab">
              <template #panel="{item}"
                ><div :style="boxStyle(item?.tone)">{{ item?.content }}</div></template
              >
            </Tabs>
            <span class="demo-hint">activeTab: {{ activeTab }}</span>
          </div>
        </ComponentSection>

        <template v-else-if="tab === 'type'">
          <ComponentSection
            v-for="[t, label] in [
              ['LINE', 'type=&quot;line&quot; (기본) — 하단 언더라인'],
              ['CARD', 'type=&quot;card&quot; — 카드 스타일'],
              ['PILL', 'type=&quot;pill&quot; — 캡슐 스타일']
            ] as [keyof typeof TABS_TYPE, string][]"
            :key="t"
            :title="label"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Tabs, {TABS_TYPE} from \x27m2m-uiux-vue/Tabs\x27`,
              '</script>',
              '',
              '<template>',
              `  <Tabs :type=&quot;TABS_TYPE[\x27${t}\x27]&quot; :items=&quot;items&quot; />`,
              '</template>'
            ]"
          >
            <Tabs :items="BASIC" :type="TABS_TYPE[t]">
              <template #panel="{item}"
                ><div :style="boxStyle(item.tone)">{{ item.content }}</div></template
              >
            </Tabs>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'size'">
          <ComponentSection
            v-for="s in SIZES"
            :key="s"
            :title="`size=&quot;${TABS_SIZE[s]}&quot;${s === 'MD' ? ' (기본)' : ''}`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Tabs, {TABS_SIZE} from \x27m2m-uiux-vue/Tabs\x27`,
              '</script>',
              '',
              '<template>',
              `  <Tabs :size=&quot;TABS_SIZE[\x27${s}\x27]&quot; :items=&quot;items&quot; />`,
              '</template>'
            ]"
          >
            <Tabs :items="BASIC" :size="TABS_SIZE[s]">
              <template #panel="{item}"
                ><div :style="boxStyle(item.tone)">{{ item.content }}</div></template
              >
            </Tabs>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'centered'">
          <ComponentSection
            title="centered={true} — 탭 중앙 정렬"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Tabs from \x27m2m-uiux-vue/Tabs\x27',
              '</script>',
              '',
              '<template>',
              '  <Tabs centered :items=&quot;items&quot; />',
              '</template>'
            ]"
          >
            <Tabs :items="BASIC" centered>
              <template #panel="{item}"
                ><div :style="boxStyle(item.tone)">{{ item.content }}</div></template
              >
            </Tabs>
          </ComponentSection>
          <ComponentSection
            title="centered={false} (기본)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Tabs from \x27m2m-uiux-vue/Tabs\x27',
              '</script>',
              '',
              '<template>',
              '  <Tabs :items=&quot;items&quot; />',
              '</template>'
            ]"
          >
            <Tabs :items="BASIC" :centered="false">
              <template #panel="{item}"
                ><div :style="boxStyle(item.tone)">{{ item.content }}</div></template
              >
            </Tabs>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'fullWidth'">
          <ComponentSection
            title="fullWidth={true} — 탭이 전체 너비를 균등 분할"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Tabs from \x27m2m-uiux-vue/Tabs\x27',
              '</script>',
              '',
              '<template>',
              '  <Tabs full-width :items=&quot;items&quot; />',
              '</template>'
            ]"
            :notes="['각 탭이 동일한 너비로 균등 분할됩니다']"
          >
            <Tabs :items="BASIC" full-width>
              <template #panel="{item}"
                ><div :style="boxStyle(item.tone)">{{ item.content }}</div></template
              >
            </Tabs>
          </ComponentSection>
          <ComponentSection
            title='type="pill" + fullWidth'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Tabs, {TABS_TYPE} from \x27m2m-uiux-vue/Tabs\x27`,
              '</script>',
              '',
              '<template>',
              '  <Tabs :type=&quot;TABS_TYPE[\x27PILL\x27]&quot; full-width :items=&quot;items&quot; />',
              '</template>'
            ]"
          >
            <Tabs :items="BASIC" :type="TABS_TYPE['PILL']" full-width>
              <template #panel="{item}"
                ><div :style="boxStyle(item.tone)">{{ item.content }}</div></template
              >
            </Tabs>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'icon'">
          <ComponentSection
            title="icon — 탭 라벨 앞 아이콘"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Tabs from \x27m2m-uiux-vue/Tabs\x27',
              '',
              'const items = [',
              '  { key: \x27home\x27, label: \x27홈\x27, icon: \x27home\x27, content: \x27...\x27 },',
              '  { key: \x27user\x27, label: \x27사용자\x27, icon: \x27user\x27, content: \x27...\x27 },',
              ']',
              '</script>',
              '',
              '<template>',
              '  <Tabs :items=&quot;items&quot; />',
              '</template>'
            ]"
          >
            <Tabs :items="ICON_ITEMS">
              <template #panel="{item}"
                ><div :style="boxStyle(item.tone)">{{ item.content }}</div></template
              >
            </Tabs>
          </ComponentSection>
          <ComponentSection
            title='type="card" + icon'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Tabs, {TABS_TYPE} from \x27m2m-uiux-vue/Tabs\x27`,
              '</script>',
              '',
              '<template>',
              '  <Tabs :type=&quot;TABS_TYPE[\x27CARD\x27]&quot; :items=&quot;itemsWithIcon&quot; />',
              '</template>'
            ]"
          >
            <Tabs :items="DOC_ITEMS" :type="TABS_TYPE['CARD']">
              <template #panel="{item}"
                ><div :style="boxStyle(item.tone)">{{ item.content }}</div></template
              >
            </Tabs>
          </ComponentSection>
          <ComponentSection
            title='type="pill" + icon'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Tabs, {TABS_TYPE} from \x27m2m-uiux-vue/Tabs\x27`,
              '</script>',
              '',
              '<template>',
              '  <Tabs :type=&quot;TABS_TYPE[\x27PILL\x27]&quot; :items=&quot;itemsWithIcon&quot; />',
              '</template>'
            ]"
          >
            <Tabs :items="ICON_ITEMS" :type="TABS_TYPE['PILL']">
              <template #panel="{item}"
                ><div :style="boxStyle(item.tone)">{{ item.content }}</div></template
              >
            </Tabs>
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'badge'"
          title="badge — 탭 알림 배지"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Tabs from \x27m2m-uiux-vue/Tabs\x27',
            '',
            'const items = [',
            '  { key: \x27noti\x27, label: \x27알림\x27, icon: \x27bell\x27, badge: 5, content: \x27...\x27 },',
            ']',
            '</script>',
            '',
            '<template>',
            '  <Tabs :items=&quot;items&quot; />',
            '</template>'
          ]"
          :notes="['숫자 또는 문자열 모두 허용', 'badge: \x27N\x27 처럼 문자열도 가능']"
        >
          <Tabs :items="ICON_ITEMS">
            <template #panel="{item}"
              ><div :style="boxStyle(item.tone)">{{ item.content }}</div></template
            >
          </Tabs>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'disabled'"
          title="disabled — 개별 탭 비활성"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Tabs from \x27m2m-uiux-vue/Tabs\x27',
            '',
            'const items = [',
            '  { key: \x27a\x27, label: \x27활성 탭\x27, content: \x27...\x27 },',
            '  { key: \x27c\x27, label: \x27비활성 탭\x27, disabled: true },',
            ']',
            '</script>',
            '',
            '<template>',
            '  <Tabs :items=&quot;items&quot; />',
            '</template>'
          ]"
          :notes="['disabled 탭은 클릭해도 전환되지 않습니다']"
        >
          <Tabs :items="DISABLED">
            <template #panel="{item}"
              ><div :style="boxStyle(item.tone)">{{ item.content }}</div></template
            >
          </Tabs>
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
