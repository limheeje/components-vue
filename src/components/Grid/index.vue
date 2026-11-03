<script setup lang="ts">
import {computed} from 'vue'
import type {CSSProperties} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import {GRID_DEFAULT} from '~/components/Grid/Grid.constant'
import type {GridProps} from '~/components/Grid/Grid.type'
import styles from '~/components/Grid/Grid.module.scss'

const px = (v: number | string) => (typeof v === 'number' ? `${v}px` : v)
const track = (v: number | string) => (typeof v === 'number' ? `repeat(${v}, minmax(0, 1fr))` : v)

/**
 * React DOM 은 `undefined` style 값을 무시하지만, Vue `patchStyle` 는 `undefined` 를
 * `''` 로 세팅한다 → `gap` 을 먼저 넣고 `rowGap: undefined`/`columnGap: undefined` 가
 * 뒤따르면 shorthand(`gap`)가 빈 longhand 에 의해 리셋된다. nullish 키를 제거해 방지.
 */
const compact = (o: Record<string, unknown>): CSSProperties =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v != null)) as CSSProperties

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<GridProps>(), {
  columns: GRID_DEFAULT.COLUMNS,
  gap: GRID_DEFAULT.GAP,
  inline: false
})

const gridStyle = computed(() =>
  compact({
    display: props.inline ? 'inline-grid' : 'grid',
    gridTemplateColumns: track(props.columns),
    gridTemplateRows: props.rows != null ? track(props.rows) : undefined,
    gap: props.rowGap == null && props.columnGap == null ? px(props.gap) : undefined,
    rowGap: props.rowGap != null ? px(props.rowGap) : undefined,
    columnGap: props.columnGap != null ? px(props.columnGap) : undefined,
    justifyItems: props.justifyItems,
    alignItems: props.alignItems,
    gridAutoRows: props.autoRows != null ? px(props.autoRows) : undefined,
    ...props.style
  })
)
</script>

<template>
  <div v-bind="$attrs" :class="cx(styles.bsGrid, resolveClassNames(props.classNames))" :style="gridStyle"><slot /></div>
</template>
