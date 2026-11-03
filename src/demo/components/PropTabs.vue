<script setup lang="ts">
import {ref, watch} from 'vue'

import {useDemoTab} from '~/demo/components/navContext'

const props = defineProps<{
  tabs: string[]
  defaultTab?: string
}>()

const forced = useDemoTab()
const active = ref(
  forced.value.tab && props.tabs.includes(forced.value.tab) ? forced.value.tab : (props.defaultTab ?? props.tabs[0])
)

// 사이드바 클릭(seq 증가)마다 forcedTab 을 재적용 — 같은 탭을 다시 눌러도 반영
watch(
  () => forced.value.seq,
  () => {
    const t = forced.value.tab
    if (t && props.tabs.includes(t)) active.value = t
  }
)
</script>

<template>
  <div>
    <div class="demo-tabs__bar" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab"
        type="button"
        role="tab"
        :aria-current="tab === active"
        class="demo-tab"
        @click="active = tab"
      >
        {{ tab }}
      </button>
    </div>
    <div class="demo-tabs__body"><slot :tab="active" /></div>
  </div>
</template>
