<script setup lang="ts">
import Icon from '~/components/Icon'
import List from '~/components/List'
import ListItem from '~/components/ListItem'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['divided', 'clickable', 'avatar', 'extra', 'loading', 'classNames']
const ITEMS = [
  {id: 1, title: '첫 번째 항목', desc: '설명 텍스트입니다'},
  {id: 2, title: '두 번째 항목', desc: '설명 텍스트입니다'},
  {id: 3, title: '세 번째 항목', desc: '설명 텍스트입니다'}
]
const avatarStyle =
  'width:36px;height:36px;border-radius:50%;background:var(--m2m-pg-comp-bg-hover);display:inline-flex;align-items:center;justify-content:center'
</script>

<template>
  <div>
    <PageHeader title="List" component="List" desc="— 아이템 목록 컴포넌트." />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <template v-if="tab === 'divided'">
          <ComponentSection
            title="divided (기본) — 구분선 있음"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import List from \x27m2m-uiux-vue/List\x27',
              'import ListItem from \x27m2m-uiux-vue/ListItem\x27',
              '',
              'const items = [{title: \x27첫 번째 항목\x27, desc: \x27설명\x27}]',
              '</script>',
              '',
              '<template>',
              '  <List divided>',
              '    <ListItem v-for=&quot;it in items&quot; :key=&quot;it.title&quot; :title=&quot;it.title&quot; :description=&quot;it.desc&quot; />',
              '  </List>',
              '</template>'
            ]"
          >
            <div style="width: 360px">
              <List divided>
                <ListItem v-for="it in ITEMS" :key="it.id" :title="it.title" :description="it.desc" />
              </List>
            </div>
          </ComponentSection>
          <ComponentSection
            title="divided 없음 — 구분선 없음"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import List from \x27m2m-uiux-vue/List\x27',
              'import ListItem from \x27m2m-uiux-vue/ListItem\x27',
              '</script>',
              '',
              '<template>',
              '  <List :divided=&quot;false&quot;>',
              '    <ListItem title=&quot;항목&quot; />',
              '  </List>',
              '</template>'
            ]"
          >
            <div style="width: 360px">
              <List :divided="false">
                <ListItem v-for="it in ITEMS" :key="it.id" :title="it.title" :description="it.desc" />
              </List>
            </div>
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'clickable'"
          title="clickable — 클릭 가능 행 (hover + chevron 자동)"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import List from \x27m2m-uiux-vue/List\x27',
            'import ListItem from \x27m2m-uiux-vue/ListItem\x27',
            '',
            'const items = [{title: \x27항목\x27}]',
            'function open(item) {',
            '  console.log(item)',
            '}',
            '</script>',
            '',
            '<template>',
            '  <List clickable :items=&quot;items&quot; @item-click=&quot;(item) => open(item)&quot;>',
            '    <template #item=&quot;{ item }&quot;><ListItem :title=&quot;item.title&quot; /></template>',
            '  </List>',
            '</template>'
          ]"
          :notes="['hover 배경 + chevron 자동 추가']"
        >
          <div style="width: 360px">
            <List clickable :items="ITEMS" @item-click="(it: any) => alert(it.title)">
              <template #item="{item}"><ListItem :title="item.title" :description="item.desc" /></template>
            </List>
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'avatar'"
          title="avatar — 좌측 아바타"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import List from \x27m2m-uiux-vue/List\x27',
            'import ListItem from \x27m2m-uiux-vue/ListItem\x27',
            '</script>',
            '',
            '<template>',
            '  <List>',
            '    <ListItem :title=&quot;name&quot; :description=&quot;email&quot;>',
            '      <template #avatar><Avatar /></template>',
            '    </ListItem>',
            '  </List>',
            '</template>'
          ]"
        >
          <div style="width: 360px">
            <List clickable>
              <ListItem v-for="it in ITEMS" :key="it.id" :title="it.title" :description="it.desc">
                <template #avatar>
                  <span :style="avatarStyle">
                    <Icon name="inbox" :size="18" color="var(--m2m-pg-comp-text-disabled)" />
                  </span>
                </template>
              </ListItem>
            </List>
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'extra'"
          title="extra — 우측 추가 요소"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import List from \x27m2m-uiux-vue/List\x27',
            'import ListItem from \x27m2m-uiux-vue/ListItem\x27',
            'import Icon from \x27m2m-uiux-vue/Icon\x27',
            '</script>',
            '',
            '<template>',
            '  <List>',
            '    <ListItem :title=&quot;title&quot;>',
            '      <template #extra><Icon name=&quot;check-circle&quot; /></template>',
            '    </ListItem>',
            '  </List>',
            '</template>'
          ]"
        >
          <div style="width: 360px">
            <List>
              <ListItem v-for="it in ITEMS" :key="it.id" :title="it.title">
                <template #extra><Icon name="check-circle" :size="16" color="var(--m2m-pg-success)" /></template>
              </ListItem>
            </List>
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'loading'"
          title="loading — 스켈레톤"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import List from \x27m2m-uiux-vue/List\x27',
            '',
            'const isLoading = ref(true)',
            '</script>',
            '',
            '<template>',
            '  <List :loading=&quot;isLoading&quot; :items=&quot;items&quot; />',
            '</template>'
          ]"
        >
          <div style="width: 360px"><List loading /></div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'classNames'"
          title="classNames"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import List from \x27m2m-uiux-vue/List\x27',
            'import ListItem from \x27m2m-uiux-vue/ListItem\x27',
            '</script>',
            '',
            '<template>',
            '  <List class-names=&quot;shadow-sm&quot;>',
            '    <ListItem title=&quot;항목&quot; />',
            '  </List>',
            '</template>'
          ]"
        >
          <div style="width: 360px">
            <List class-names="demo-hint"><ListItem title="커스텀" /></List>
          </div>
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
