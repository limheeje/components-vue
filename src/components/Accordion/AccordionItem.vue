<script setup lang="ts">
import {computed, inject} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import Icon from '~/components/Icon'
import {ACCORDION_STATE_CLASS} from '~/components/Accordion/Accordion.constant'
import {ACCORDION_CTX_KEY} from '~/components/Accordion/Accordion.type'
import type {AccordionItemProps} from '~/components/Accordion/Accordion.type'
import styles from '~/components/Accordion/Accordion.module.scss'

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<AccordionItemProps>(), {
  disabled: false
})

const ctx = inject(ACCORDION_CTX_KEY, null)
if (ctx == null) {
  throw new Error('Accordion.Item 은 <Accordion> 안에서만 사용할 수 있습니다.')
}

const open = computed(() => ctx.isOpen(props.value))
</script>

<template>
  <div
    v-bind="$attrs"
    :class="
      cx(
        styles.bsAccordionItem,
        open && styles[ACCORDION_STATE_CLASS.IS_OPEN],
        props.disabled && styles[ACCORDION_STATE_CLASS.IS_DISABLED],
        resolveClassNames(props.classNames)
      )
    "
  >
    <button
      type="button"
      :class="styles.bsAccordionHeader"
      :aria-expanded="open"
      :disabled="props.disabled"
      @click="ctx!.toggle(props.value)"
    >
      <span :class="styles.bsAccordionTitle"
        ><slot name="title">{{ props.title }}</slot></span
      >
      <Icon name="chevron-down" :size="16" :class-names="styles.bsAccordionChevron" />
    </button>
    <div v-if="open" :class="styles.bsAccordionContent"><slot /></div>
  </div>
</template>
