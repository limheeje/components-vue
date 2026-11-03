<script setup lang="ts">
import {defineComponent, h, ref} from 'vue'

import Button from '~/components/Button'
import ShareSheet, {SHARE_CHANNEL} from '~/components/ShareSheet'
import type {ShareChannel} from '~/components/ShareSheet'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['default', 'channels', 'events']

const DefaultDemo = defineComponent({
  name: 'ShareSheetDefaultDemo',
  setup() {
    const open = ref(false)
    return () => [
      h(Button, {onClick: () => (open.value = true)}, () => '공유하기'),
      h(ShareSheet, {
        open: open.value,
        title: 'Share Listing',
        url: 'https://m2m-uiux.example.com/listing/1024',
        onClose: () => (open.value = false)
      })
    ]
  }
})

const ChannelsDemo = defineComponent({
  name: 'ShareSheetChannelsDemo',
  setup() {
    const open = ref(false)
    const channels: ShareChannel[] = [SHARE_CHANNEL['FACEBOOK'], SHARE_CHANNEL['TWITTER']]
    return () => [
      h(Button, {onClick: () => (open.value = true)}, () => '공유하기 (2개 채널만)'),
      h(ShareSheet, {
        open: open.value,
        url: 'https://m2m-uiux.example.com/listing/1024',
        channels,
        onClose: () => (open.value = false)
      })
    ]
  }
})

const EventsDemo = defineComponent({
  name: 'ShareSheetEventsDemo',
  setup() {
    const open = ref(false)
    const log = ref('(없음)')
    return () => [
      h(Button, {onClick: () => (open.value = true)}, () => '공유하기'),
      h('span', {class: 'demo-hint', style: {marginLeft: '8px'}}, `이벤트: ${log.value}`),
      h(ShareSheet, {
        open: open.value,
        url: 'https://m2m-uiux.example.com/listing/1024',
        onClose: () => (open.value = false),
        onCopy: (url: string) => (log.value = `copy → ${url}`),
        onShare: (payload: {channel: ShareChannel; url: string}) => (log.value = `share → ${payload.channel}`)
      })
    ]
  }
})
</script>

<template>
  <div>
    <PageHeader
      title="ShareSheet"
      component="ShareSheet"
      desc="— URL 공유 모달. 링크 복사 + 카카오톡/페이스북/트위터/whatsApp 공유."
    />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <ComponentSection
          v-if="tab === 'default'"
          title="기본 사용"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            `import ShareSheet from \x27m2m-uiux-vue/ShareSheet\x27`,
            '',
            'const open = ref(false)',
            '</script>',
            '',
            '<template>',
            '  <Button @click=&quot;open = true&quot;>공유하기</Button>',
            '  <ShareSheet',
            '    :open=&quot;open&quot;',
            '    title=&quot;Share Listing&quot;',
            '    url=&quot;https://m2m-uiux.example.com/listing/1024&quot;',
            '    @close=&quot;open = false&quot;',
            '  />',
            '</template>'
          ]"
          :notes="['링크 복사 버튼 클릭 시 1.5초간 체크 아이콘으로 전환', '배경 클릭 · ESC · X 버튼으로 close']"
        >
          <DefaultDemo />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'channels'"
          title="channels — 노출할 채널 + 순서 제한"
          :code="[
            `import ShareSheet, {SHARE_CHANNEL} from \x27m2m-uiux-vue/ShareSheet\x27`,
            '',
            '<ShareSheet',
            '  :open=&quot;open&quot;',
            '  url=&quot;https://m2m-uiux.example.com/listing/1024&quot;',
            `  :channels=&quot;[SHARE_CHANNEL['FACEBOOK'], SHARE_CHANNEL['TWITTER']]&quot;`,
            '  @close=&quot;open = false&quot;',
            '/>'
          ]"
        >
          <ChannelsDemo />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'events'"
          title="copy / share 이벤트"
          :code="[
            '<ShareSheet',
            '  :open=&quot;open&quot;',
            '  url=&quot;...&quot;',
            '  @copy=&quot;(url) => console.log(\x27copy\x27, url)&quot;',
            '  @share=&quot;({ channel, url }) => console.log(\x27share\x27, channel, url)&quot;',
            '  @close=&quot;open = false&quot;',
            '/>'
          ]"
          :notes="[
            'kakao 는 웹 공유 URL 이 없어 share 이벤트로만 전달 — Kakao SDK 연동은 소비 앱이 처리',
            'facebook/twitter/whatsapp 은 각 서비스 공유 URL 을 새 창으로 함께 오픈'
          ]"
        >
          <EventsDemo />
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
