<script setup lang="ts">
import {computed, useSlots} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import {LOADING_DEFAULT, LOADING_STATE_CLASS, LOADING_TYPE} from '~/components/Loading/Loading.constant'
import type {LoadingProps} from '~/components/Loading/Loading.type'
import styles from '~/components/Loading/Loading.module.scss'
const cap = (s: string) => s.replace(/(?:^|-)([a-z])/g, (m: string) => m.slice(-1).toUpperCase())

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<LoadingProps>(), {
  type: LOADING_DEFAULT.TYPE,
  size: LOADING_DEFAULT.SIZE,
  color: LOADING_DEFAULT.COLOR,
  overlay: false
})

const slots = useSlots()
const hasText = computed(() => props.text != null || Boolean(slots.default))
const ariaLabel = computed(() => (typeof props.text === 'string' ? props.text : '로딩 중'))

const sizeClass = computed(() => styles[`bsLoadingSize${cap(props.size)}`])
const isSkeleton = computed(() => props.type === LOADING_TYPE.SKELETON)

const rootClass = computed(() =>
  cx(styles.bsLoading, props.overlay && styles[LOADING_STATE_CLASS.IS_OVERLAY], resolveClassNames(props.classNames))
)
const innerClass = computed(() =>
  cx(styles.bsLoadingInner, sizeClass.value, styles[`bsLoadingColor${cap(props.color)}`])
)
</script>

<template>
  <div v-bind="$attrs" role="status" aria-live="polite" :aria-label="ariaLabel" :class="rootClass">
    <div v-if="isSkeleton" :class="cx(styles.bsLoadingSkeleton, sizeClass)" aria-hidden="true">
      <div :class="styles.bsLoadingSkeletonHead">
        <span :class="cx(styles.bsLoadingSkeletonBox, styles.bsLoadingSkeletonAvatar)" />
        <span :class="styles.bsLoadingSkeletonLines">
          <span :class="styles.bsLoadingSkeletonBox" />
          <span :class="styles.bsLoadingSkeletonBox" />
        </span>
      </div>
      <div :class="styles.bsLoadingSkeletonBody">
        <span :class="styles.bsLoadingSkeletonBox" />
        <span :class="styles.bsLoadingSkeletonBox" />
        <span :class="styles.bsLoadingSkeletonBox" />
      </div>
    </div>
    <div v-else :class="innerClass">
      <span v-if="props.type === LOADING_TYPE.DOTS" :class="styles.bsLoadingDots" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span v-else :class="styles.bsLoadingSpinner" aria-hidden="true" />
      <span v-if="hasText" :class="styles.bsLoadingText"
        ><slot>{{ props.text }}</slot></span
      >
    </div>
  </div>
</template>
