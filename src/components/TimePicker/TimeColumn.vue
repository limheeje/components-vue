<script setup lang="ts">
import {nextTick, onMounted, ref, watch} from 'vue'

import {cx} from '~/lib/cx'

import styles from '~/components/TimePicker/TimePicker.module.scss'

const props = defineProps<{
  label: string
  values: string[]
  selected: string
  onSelect: (value: string) => void
}>()

const listRef = ref<HTMLElement>()

function scrollToSelected() {
  const list = listRef.value
  if (!list) return
  const idx = props.values.indexOf(props.selected)
  const el = list.children[idx] as HTMLElement | undefined
  if (el) {
    list.scrollTop = el.offsetTop - list.clientHeight / 2 + el.clientHeight / 2
  }
}

onMounted(() => {
  // 팝업 마운트 직후 레이아웃 확정 후 중앙 정렬
  nextTick(() => requestAnimationFrame(scrollToSelected))
})
watch(
  () => [props.selected, props.values],
  () => nextTick(scrollToSelected)
)
</script>

<template>
  <div :class="styles.bsTimePickerColumn">
    <div :class="styles.bsTimePickerColumnLabel">{{ label }}</div>
    <div :class="styles.bsTimePickerColumnBox">
      <div ref="listRef" :class="styles.bsTimePickerColumnList" role="listbox" :aria-label="label">
        <div
          v-for="v in values"
          :key="v"
          role="option"
          :aria-selected="v === selected"
          :class="cx(styles.bsTimePickerCell, v === selected && styles.bsTimePickerCellSelected)"
          @click="onSelect(v)"
        >
          {{ v }}
        </div>
      </div>
      <span :class="styles.bsTimePickerFadeTop" aria-hidden="true" />
      <span :class="styles.bsTimePickerFadeBottom" aria-hidden="true" />
    </div>
  </div>
</template>
