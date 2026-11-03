<script setup lang="ts">
import {computed} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import {FORM_DEFAULT} from '~/components/Form/Form.constant'
import type {FormActionsProps} from '~/components/Form/Form.type'
import styles from '~/components/Form/Form.module.scss'
const cap = (s: string) => s.replace(/(?:^|-)([a-z])/g, (m: string) => m.slice(-1).toUpperCase())

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<FormActionsProps>(), {
  align: FORM_DEFAULT.ACTIONS_ALIGN
})

const rootClass = computed(() =>
  cx(styles.bsFormActions, styles[`bsFormAlign${cap(props.align)}`], resolveClassNames(props.classNames))
)
</script>

<template>
  <div v-bind="$attrs" :class="rootClass">
    <slot />
  </div>
</template>
