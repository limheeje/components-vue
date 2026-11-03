<script setup lang="ts">
import {computed} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import Icon from '~/components/Icon'
import {TIMELINE_ALIGN, TIMELINE_DEFAULT, TIMELINE_DIRECTION} from '~/components/Timeline/Timeline.constant'
import type {TimelineProps} from '~/components/Timeline/Timeline.type'
import styles from '~/components/Timeline/Timeline.module.scss'
const cap = (s: string) => s.replace(/(?:^|-)([a-z])/g, (m: string) => m.slice(-1).toUpperCase())

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<TimelineProps>(), {
  direction: TIMELINE_DEFAULT.DIRECTION,
  align: TIMELINE_DEFAULT.ALIGN,
  pending: false,
  color: TIMELINE_DEFAULT.COLOR
})

const isHorizontal = computed(() => props.direction === TIMELINE_DIRECTION.HORIZONTAL)
const hasPending = computed(() => props.pending !== false && props.pending != null && props.pending !== '')
const pendingContent = computed(() => (props.pending === true ? '처리 중...' : (props.pending as string)))

function nodeClass(item: TimelineProps['items'][number]) {
  return cx(
    styles.bsTimelineNode,
    item.status && styles[`bsTimelineStatus${cap(item.status)}`],
    item.icon != null && styles.bsTimelineNodeFilled
  )
}

function itemClass(i: number) {
  return cx(
    styles.bsTimelineItem,
    !isHorizontal.value &&
      props.align === TIMELINE_ALIGN.ALTERNATE &&
      (i % 2 === 0 ? styles.bsTimelineSideA : styles.bsTimelineSideB)
  )
}

const rootClass = computed(() =>
  cx(
    styles.bsTimeline,
    styles[`bsTimelineDirection${cap(props.direction)}`],
    !isHorizontal.value && styles[`bsTimelineAlign${cap(props.align)}`],
    styles[`bsTimelineColor${cap(props.color)}`],
    resolveClassNames(props.classNames)
  )
)
</script>

<template>
  <div v-bind="$attrs" :class="rootClass">
    <div v-for="(item, i) in items" :key="i" :class="itemClass(i)">
      <div :class="styles.bsTimelineRail">
        <span :class="nodeClass(item)">
          <Icon v-if="item.icon != null" :name="item.icon" :size="9" />
        </span>
        <span v-if="!(i === items.length - 1 && !hasPending)" :class="styles.bsTimelineLine" />
      </div>
      <div :class="styles.bsTimelineContent">
        <div :class="styles.bsTimelineTitle">{{ item.title }}</div>
        <div v-if="item.description != null" :class="styles.bsTimelineDesc">{{ item.description }}</div>
        <div v-if="item.date != null" :class="styles.bsTimelineDate">{{ item.date }}</div>
      </div>
    </div>

    <div v-if="hasPending" :class="cx(styles.bsTimelineItem, styles.bsTimelineItemPending)">
      <div :class="styles.bsTimelineRail">
        <span :class="styles.bsTimelinePendingDot" />
      </div>
      <div :class="styles.bsTimelineContent">
        <div :class="styles.bsTimelinePendingText">{{ pendingContent }}</div>
      </div>
    </div>
  </div>
</template>
