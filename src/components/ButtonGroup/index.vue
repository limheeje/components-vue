<script setup lang="ts">
import {computed, provide, reactive, watchEffect} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import {BUTTON_GROUP_CONTEXT_KEY} from '~/components/ButtonGroup/ButtonGroup.context'
import {BUTTON_GROUP_DEFAULT, BUTTON_GROUP_STATE_CLASS} from '~/components/ButtonGroup/ButtonGroup.constant'
import type {ButtonGroupProps} from '~/components/ButtonGroup/ButtonGroup.type'
import styles from '~/components/ButtonGroup/ButtonGroup.module.scss'
const cap = (s: string) => s.replace(/(?:^|-)([a-z])/g, (m: string) => m.slice(-1).toUpperCase())

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<ButtonGroupProps>(), {
  direction: BUTTON_GROUP_DEFAULT.DIRECTION,
  attached: false,
  size: BUTTON_GROUP_DEFAULT.SIZE,
  disabled: false
})

// React 는 Children.map + cloneElement 로 size/disabled 를 주입한다. Vue 는 provide/inject.
const ctx = reactive({size: props.size, disabled: props.disabled})
watchEffect(() => {
  ctx.size = props.size
  ctx.disabled = props.disabled
})
provide(BUTTON_GROUP_CONTEXT_KEY, ctx)

const rootClass = computed(() =>
  cx(
    styles.bsButtonGroup,
    styles[`bsButtonGroupDirection${cap(props.direction)}`],
    props.attached && styles[BUTTON_GROUP_STATE_CLASS.IS_ATTACHED],
    props.disabled && styles[BUTTON_GROUP_STATE_CLASS.IS_DISABLED],
    resolveClassNames(props.classNames)
  )
)
</script>

<template>
  <div v-bind="$attrs" role="group" :class="rootClass">
    <slot />
  </div>
</template>
