<script setup lang="ts">
import {computed, provide, reactive, watchEffect} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import {FORM_DEFAULT, FORM_STATE_CLASS} from '~/components/Form/Form.constant'
import {FORM_CONTEXT_KEY} from '~/components/Form/Form.context'
import type {FormProps} from '~/components/Form/Form.type'
import styles from '~/components/Form/Form.module.scss'
const cap = (s: string) => s.replace(/(?:^|-)([a-z])/g, (m: string) => m.slice(-1).toUpperCase())

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<FormProps>(), {
  layout: FORM_DEFAULT.LAYOUT,
  labelWidth: FORM_DEFAULT.LABEL_WIDTH,
  disabled: false
})

const ctx = reactive({
  layout: props.layout,
  labelWidth: props.labelWidth,
  disabled: props.disabled
})
watchEffect(() => {
  ctx.layout = props.layout
  ctx.labelWidth = props.labelWidth
  ctx.disabled = props.disabled
})
provide(FORM_CONTEXT_KEY, ctx)

const rootClass = computed(() =>
  cx(
    styles.bsForm,
    styles[`bsFormLayout${cap(props.layout)}`],
    props.disabled && styles[FORM_STATE_CLASS.IS_DISABLED],
    resolveClassNames(props.classNames)
  )
)
</script>

<template>
  <form v-bind="$attrs" :class="rootClass">
    <fieldset :class="styles.bsFormFieldset" :disabled="disabled">
      <slot />
    </fieldset>
  </form>
</template>
