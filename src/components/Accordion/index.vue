<script setup lang="ts">
import {computed, provide, ref} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import {ACCORDION_DEFAULT, ACCORDION_TYPE} from '~/components/Accordion/Accordion.constant'
import {ACCORDION_CTX_KEY} from '~/components/Accordion/Accordion.type'
import type {AccordionProps} from '~/components/Accordion/Accordion.type'
import styles from '~/components/Accordion/Accordion.module.scss'

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<AccordionProps>(), {
  type: ACCORDION_DEFAULT.TYPE
})

const emit = defineEmits<{'update:modelValue': [string | string[]]; valueChange: [string | string[]]}>()

function toArray(v: string | string[] | undefined): string[] {
  if (v == null) return []
  return Array.isArray(v) ? v : [v]
}

const isControlled = computed(() => props.modelValue !== undefined)
const isMultiple = computed(() => props.type === ACCORDION_TYPE.MULTIPLE)
const uncontrolled = ref<string[]>([])
const open = computed(() => (isControlled.value ? toArray(props.modelValue) : uncontrolled.value))

provide(ACCORDION_CTX_KEY, {
  isOpen: (v: string) => open.value.includes(v),
  toggle: (v: string) => {
    const next = open.value.includes(v)
      ? open.value.filter((x) => x !== v)
      : isMultiple.value
        ? [...open.value, v]
        : [v]
    if (!isControlled.value) uncontrolled.value = next
    const payload = isMultiple.value ? next : (next[0] ?? '')
    emit('update:modelValue', payload)
    emit('valueChange', payload)
  }
})
</script>

<template>
  <div v-bind="$attrs" :class="cx(styles.bsAccordion, resolveClassNames(props.classNames))"><slot /></div>
</template>
