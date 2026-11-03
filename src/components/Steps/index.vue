<script setup lang="ts">
import {computed} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import Icon from '~/components/Icon'
import {
  STEPS_DEFAULT,
  STEPS_DIRECTION,
  STEPS_NODE_STATE,
  STEPS_STATE_CLASS,
  STEPS_STATUS
} from '~/components/Steps/Steps.constant'
import type {StepsProps} from '~/components/Steps/Steps.type'
import styles from '~/components/Steps/Steps.module.scss'
const cap = (s: string) => s.replace(/(?:^|-)([a-z])/g, (m: string) => m.slice(-1).toUpperCase())

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<StepsProps>(), {
  modelValue: STEPS_DEFAULT.CURRENT,
  direction: STEPS_DEFAULT.DIRECTION,
  status: STEPS_DEFAULT.STATUS
})

const isVertical = computed(() => props.direction === STEPS_DIRECTION.VERTICAL)

function nodeState(index: number) {
  return index < props.modelValue
    ? STEPS_NODE_STATE.DONE
    : index === props.modelValue
      ? STEPS_NODE_STATE.CURRENT
      : STEPS_NODE_STATE.UPCOMING
}
function showCheck(index: number) {
  const s = nodeState(index)
  return s === STEPS_NODE_STATE.DONE || (s === STEPS_NODE_STATE.CURRENT && props.status === STEPS_STATUS.FINISH)
}
function showError(index: number) {
  return nodeState(index) === STEPS_NODE_STATE.CURRENT && props.status === STEPS_STATUS.DANGER
}

const rootClass = computed(() =>
  cx(
    styles.bsSteps,
    isVertical.value && styles[STEPS_STATE_CLASS.IS_VERTICAL],
    props.status === STEPS_STATUS.DANGER && styles[STEPS_STATE_CLASS.STATUS_ERROR],
    props.status === STEPS_STATUS.FINISH && styles[STEPS_STATE_CLASS.STATUS_FINISH],
    resolveClassNames(props.classNames)
  )
)
</script>

<template>
  <div v-bind="$attrs" :class="rootClass">
    <div
      v-for="(step, index) in props.steps"
      :key="index"
      :class="cx(styles.bsStepsStep, styles[`bsStepsNode${cap(nodeState(index))}`])"
      :aria-current="nodeState(index) === STEPS_NODE_STATE.CURRENT ? 'step' : undefined"
    >
      <div :class="styles.bsStepsRail">
        <span :class="styles.bsStepsLine" data-lead />
        <span :class="styles.bsStepsNode">
          <Icon v-if="showCheck(index)" name="check" :size="12" />
          <Icon v-else-if="showError(index)" name="alert-circle" :size="12" />
          <template v-else>{{ index + 1 }}</template>
        </span>
        <span v-if="index !== props.steps.length - 1" :class="styles.bsStepsLine" data-trail />
      </div>
      <div :class="styles.bsStepsLabel">
        <span :class="styles.bsStepsTitle">{{ step.title }}</span>
        <span v-if="step.description != null" :class="styles.bsStepsDescription">{{ step.description }}</span>
      </div>
    </div>
  </div>
</template>
