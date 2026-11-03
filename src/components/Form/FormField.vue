<script setup lang="ts">
import {computed, inject} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import {FORM_STATE_CLASS} from '~/components/Form/Form.constant'
import {FORM_CONTEXT_DEFAULT, FORM_CONTEXT_KEY} from '~/components/Form/Form.context'
import type {FormFieldProps} from '~/components/Form/Form.type'
import styles from '~/components/Form/Form.module.scss'
const cap = (s: string) => s.replace(/(?:^|-)([a-z])/g, (m: string) => m.slice(-1).toUpperCase())

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<FormFieldProps>(), {
  required: false
})

const ctx = inject(FORM_CONTEXT_KEY, FORM_CONTEXT_DEFAULT)

const px = (v: number | string) => (typeof v === 'number' ? `${v}px` : v)

const effectiveLayout = computed(() => props.layout ?? ctx.layout)
const hasError = computed(() => typeof props.error === 'string' && props.error.length > 0)

const rootClass = computed(() =>
  cx(
    styles.bsFormField,
    styles[`bsFormField${cap(effectiveLayout.value)}`],
    props.required && styles[FORM_STATE_CLASS.IS_REQUIRED],
    hasError.value && styles[FORM_STATE_CLASS.IS_ERROR],
    resolveClassNames(props.classNames)
  )
)

const labelStyle = computed(() => (effectiveLayout.value === 'horizontal' ? {width: px(ctx.labelWidth)} : undefined))
</script>

<template>
  <div v-bind="$attrs" :class="rootClass" :data-field="name">
    <label v-if="label != null || $slots.label" :class="styles.bsFormLabel" :for="htmlFor" :style="labelStyle">
      <slot name="label">{{ label }}</slot>
      <span v-if="required" :class="styles.bsFormRequired">*</span>
    </label>
    <div :class="styles.bsFormControl">
      <slot />
      <span v-if="hasError" :class="styles.bsFormError" role="alert">{{ error }}</span>
      <span v-else-if="help != null" :class="styles.bsFormHelp">{{ help }}</span>
    </div>
  </div>
</template>
