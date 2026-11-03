<script setup lang="ts">
import {computed} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import {BADGE_DEFAULT, BADGE_STATE_CLASS} from '~/components/Badge/Badge.constant'
import type {BadgeProps} from '~/components/Badge/Badge.type'
import styles from '~/components/Badge/Badge.module.scss'
const cap = (s: string) => s.replace(/(?:^|-)([a-z])/g, (m: string) => m.slice(-1).toUpperCase())

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<BadgeProps>(), {
  type: BADGE_DEFAULT.TYPE,
  size: BADGE_DEFAULT.SIZE,
  round: false,
  dot: false
})

const dotWrapClass = computed(() =>
  cx(styles.bsBadge, styles.isDot, styles[`bsBadgeSize${cap(props.size)}`], resolveClassNames(props.classNames))
)
const solidClass = computed(() =>
  cx(
    styles.bsBadge,
    styles[`bsBadgeType${cap(props.type)}`],
    styles[`bsBadgeSize${cap(props.size)}`],
    props.round && styles[BADGE_STATE_CLASS.IS_ROUND],
    resolveClassNames(props.classNames)
  )
)
</script>

<template>
  <span v-if="props.dot" v-bind="$attrs" :class="dotWrapClass">
    <span :class="cx(styles.bsBadgeDot, styles[`bsBadgeType${cap(props.type)}`])" aria-hidden="true" />
    <slot />
  </span>
  <span v-else v-bind="$attrs" :class="solidClass"><slot /></span>
</template>
