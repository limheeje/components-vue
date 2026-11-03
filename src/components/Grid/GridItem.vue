<script setup lang="ts">
import {computed} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import type {GridItemProps} from '~/components/Grid/Grid.type'
import styles from '~/components/Grid/Grid.module.scss'

defineOptions({inheritAttrs: false})

const props = defineProps<GridItemProps>()

const itemStyle = computed(() => ({
  gridColumn: props.colSpan != null ? `span ${props.colSpan}` : undefined,
  gridRow: props.rowSpan != null ? `span ${props.rowSpan}` : undefined,
  justifySelf: props.justifySelf,
  alignSelf: props.alignSelf,
  ...props.style
}))
</script>

<template>
  <div v-bind="$attrs" :class="cx(styles.bsGridItem, resolveClassNames(props.classNames))" :style="itemStyle">
    <slot />
  </div>
</template>
