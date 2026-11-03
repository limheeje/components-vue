<script setup lang="ts">
import {computed, inject} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import {BUTTON_GROUP_CONTEXT_KEY} from '~/components/ButtonGroup/ButtonGroup.context'
import {BUTTON_DEFAULT, BUTTON_STATE_CLASS} from '~/components/Button/Button.constant'
import type {ButtonProps} from '~/components/Button/Button.type'
import styles from '~/components/Button/Button.module.scss'
const cap = (s: string) => s.replace(/(?:^|-)([a-z])/g, (m: string) => m.slice(-1).toUpperCase())

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: BUTTON_DEFAULT.VARIANT,
  size: BUTTON_DEFAULT.SIZE,
  round: false,
  loading: false,
  fullWidth: false,
  htmlType: 'button'
})

const emit = defineEmits<{click: [MouseEvent]}>()

// ButtonGroup 이 주입하는 size/disabled (React 는 cloneElement 로 주입). 그룹 size 가 우선.
const group = inject(BUTTON_GROUP_CONTEXT_KEY, null)
const effectiveSize = computed(() => group?.size ?? props.size)
const effectiveDisabled = computed(() => props.disabled || (group?.disabled ?? false))

const isInactive = computed(() => props.variant === 'inactive')
const isDisabled = computed(() => effectiveDisabled.value || props.loading || isInactive.value)

function onClick(event: MouseEvent) {
  if (props.loading || isInactive.value) return
  emit('click', event)
}

const rootClass = computed(() =>
  cx(
    styles.bsButton,
    styles[`bsButtonVariant${cap(props.variant)}`],
    styles[`bsButtonSize${cap(effectiveSize.value)}`],
    props.round && styles[BUTTON_STATE_CLASS.IS_ROUND],
    props.loading && styles[BUTTON_STATE_CLASS.IS_LOADING],
    props.fullWidth && styles[BUTTON_STATE_CLASS.IS_FULL_WIDTH],
    resolveClassNames(props.classNames)
  )
)
</script>

<template>
  <button
    v-bind="$attrs"
    :type="props.htmlType"
    :disabled="isDisabled"
    :aria-busy="props.loading || undefined"
    :class="rootClass"
    @click="onClick"
  >
    <span v-if="props.loading" :class="styles.bsButtonSpinner" aria-hidden="true" />
    <span :class="styles.bsButtonLabel"><slot /></span>
  </button>
</template>
