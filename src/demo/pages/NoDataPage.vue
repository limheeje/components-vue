<script setup lang="ts">
import Button from '~/components/Button'
import NoData, {NO_DATA_TYPE} from '~/components/NoData'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['icon', 'title', 'description', 'action', 'type', 'classNames']
</script>

<template>
  <div>
    <PageHeader title="NoData" component="NoData" desc="— 데이터가 없을 때 표시하는 빈 상태 컴포넌트." />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <template v-if="tab === 'icon'">
          <ComponentSection
            title="icon — 기본 (Inbox)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import NoData from \x27m2m-uiux-vue/NoData\x27',
              '</script>',
              '',
              '<template>',
              '  <NoData icon=&quot;inbox&quot; title=&quot;데이터가 없습니다&quot; />',
              '</template>'
            ]"
          >
            <NoData icon="inbox" title="데이터가 없습니다" />
          </ComponentSection>
          <ComponentSection
            title="icon — 검색 결과 없음"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import NoData from \x27m2m-uiux-vue/NoData\x27',
              '</script>',
              '',
              '<template>',
              '  <NoData icon=&quot;search&quot; title=&quot;검색 결과가 없습니다&quot; />',
              '</template>'
            ]"
          >
            <NoData icon="search" title="검색 결과가 없습니다" />
          </ComponentSection>
          <ComponentSection
            title="icon — 파일 없음"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import NoData from \x27m2m-uiux-vue/NoData\x27',
              '</script>',
              '',
              '<template>',
              '  <NoData icon=&quot;file-x&quot; title=&quot;파일이 없습니다&quot; />',
              '</template>'
            ]"
          >
            <NoData icon="file-x" title="파일이 없습니다" />
          </ComponentSection>
          <ComponentSection
            title="icon 없음"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import NoData from \x27m2m-uiux-vue/NoData\x27',
              '</script>',
              '',
              '<template>',
              '  <NoData :icon=&quot;null&quot; title=&quot;데이터가 없습니다&quot; />',
              '</template>'
            ]"
            :notes="['icon={null} 을 전달하면 프리셋 아이콘도 표시하지 않습니다']"
          >
            <NoData :icon="null" title="데이터가 없습니다" />
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'title'"
          title="title — 주요 텍스트"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import NoData from \x27m2m-uiux-vue/NoData\x27',
            '</script>',
            '',
            '<template>',
            '  <NoData title=&quot;등록된 항목이 없습니다&quot; />',
            '</template>'
          ]"
        >
          <NoData icon="inbox" title="등록된 항목이 없습니다" />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'description'"
          title="description — 부가 설명"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import NoData from \x27m2m-uiux-vue/NoData\x27',
            '</script>',
            '',
            '<template>',
            '  <NoData',
            '    title=&quot;등록된 항목이 없습니다&quot;',
            '    description=&quot;새로운 항목을 추가해 시작해보세요.&quot;',
            '  />',
            '</template>'
          ]"
        >
          <NoData icon="inbox" title="등록된 항목이 없습니다" description="새로운 항목을 추가해 시작해보세요." />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'action'"
          title="action — 버튼 추가"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import NoData from \x27m2m-uiux-vue/NoData\x27',
            'import Button from \x27m2m-uiux-vue/Button\x27',
            '',
            'function handleAdd() {',
            '  console.log(\x27add\x27)',
            '}',
            '</script>',
            '',
            '<template>',
            '  <NoData title=&quot;데이터가 없습니다&quot; description=&quot;새 항목을 추가하세요.&quot;>',
            '    <template #action><Button @click=&quot;handleAdd&quot;>+ 새 항목 추가</Button></template>',
            '  </NoData>',
            '</template>'
          ]"
        >
          <NoData icon="inbox" title="데이터가 없습니다" description="아래 버튼으로 새 항목을 추가하세요.">
            <template #action><Button size="sm">+ 새 항목 추가</Button></template>
          </NoData>
        </ComponentSection>

        <template v-else-if="tab === 'type'">
          <ComponentSection
            title='type="empty" (기본)'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import NoData, {NO_DATA_TYPE} from \x27m2m-uiux-vue/NoData\x27`,
              '</script>',
              '',
              '<template>',
              '  <NoData :type=&quot;NO_DATA_TYPE[\x27EMPTY\x27]&quot; />',
              '</template>'
            ]"
          >
            <NoData :type="NO_DATA_TYPE['EMPTY']" />
          </ComponentSection>
          <ComponentSection
            title='type="search"'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import NoData, {NO_DATA_TYPE} from \x27m2m-uiux-vue/NoData\x27`,
              '</script>',
              '',
              '<template>',
              '  <NoData :type=&quot;NO_DATA_TYPE[\x27SEARCH\x27]&quot; />',
              '</template>'
            ]"
          >
            <NoData :type="NO_DATA_TYPE['SEARCH']" />
          </ComponentSection>
          <ComponentSection
            title='type="danger"'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import NoData, {NO_DATA_TYPE} from \x27m2m-uiux-vue/NoData\x27`,
              '',
              'function handleRetry() {',
              '  location.reload()',
              '}',
              '</script>',
              '',
              '<template>',
              '  <NoData :type=&quot;NO_DATA_TYPE[\x27DANGER\x27]&quot; @retry=&quot;handleRetry&quot; />',
              '</template>'
            ]"
          >
            <NoData :type="NO_DATA_TYPE['DANGER']" @retry="() => {}" />
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'classNames'"
          title="classNames — 추가 스타일"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import NoData from \x27m2m-uiux-vue/NoData\x27',
            '</script>',
            '',
            '<template>',
            '  <NoData class-names=&quot;min-h-[200px]&quot; title=&quot;데이터 없음&quot; />',
            '</template>'
          ]"
        >
          <NoData classNames="demo-hint" icon="inbox" title="데이터 없음" />
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
