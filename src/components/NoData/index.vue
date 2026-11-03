<script setup lang="ts">
import {computed, getCurrentInstance, useSlots} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import Icon from '~/components/Icon'
import {NO_DATA_DEFAULT, NO_DATA_PRESET, NO_DATA_STATE_CLASS} from '~/components/NoData/NoData.constant'
import type {NoDataProps} from '~/components/NoData/NoData.type'
import styles from '~/components/NoData/NoData.module.scss'

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<NoDataProps>(), {
  type: NO_DATA_DEFAULT.TYPE
})

const emit = defineEmits<{retry: []}>()
const slots = useSlots()

// `retry` 를 emit 으로 선언하면 onRetry 가 $attrs 에서 빠지므로 vnode.props 로 존재 판별
const vm = getCurrentInstance()
const preset = computed(() => NO_DATA_PRESET[props.type])
const resolvedTitle = computed(() => props.title ?? preset.value.title)
const resolvedDesc = computed(() => props.description ?? preset.value.description)
const hasRetry = computed(() => {
  const p = vm?.vnode.props
  return p != null && 'onRetry' in p
})
const hasAction = computed(() => Boolean(slots.action) || hasRetry.value)

// icon={null} → 아이콘 미표시, slot 지정 → slot, 문자열 → 해당 아이콘, 생략 → 프리셋
const showIcon = computed(() => props.icon !== null || Boolean(slots.icon))
</script>

<template>
  <div
    :class="
      cx(styles.bsNoData, hasAction && styles[NO_DATA_STATE_CLASS.HAS_ACTION], resolveClassNames(props.classNames))
    "
  >
    <span v-if="showIcon" :class="styles.bsNoDataIcon">
      <slot name="icon"><Icon :name="props.icon || preset.icon" :size="40" /></slot>
    </span>
    <span v-if="resolvedTitle != null || slots.title" :class="styles.bsNoDataTitle">
      <slot name="title">{{ resolvedTitle }}</slot>
    </span>
    <span v-if="(resolvedDesc != null && resolvedDesc !== '') || slots.description" :class="styles.bsNoDataDescription">
      <slot name="description">{{ resolvedDesc }}</slot>
    </span>
    <div v-if="hasAction" :class="styles.bsNoDataAction">
      <slot name="action">
        <button type="button" :class="styles.bsNoDataRetry" @click="emit('retry')">
          {{ NO_DATA_DEFAULT.RETRY_LABEL }}
        </button>
      </slot>
    </div>
  </div>
</template>
