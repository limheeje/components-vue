<script setup lang="ts">
import {computed} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import Icon from '~/components/Icon'
import {HEADER_DEFAULT, HEADER_STATE_CLASS} from '~/components/Header/Header.constant'
import type {HeaderProps} from '~/components/Header/Header.type'
import styles from '~/components/Header/Header.module.scss'
const cap = (s: string) => s.replace(/(?:^|-)([a-z])/g, (m: string) => m.slice(-1).toUpperCase())

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<HeaderProps>(), {
  type: HEADER_DEFAULT.TYPE,
  back: false,
  sticky: false
})

const emit = defineEmits<{back: []}>()

const rootClass = computed(() =>
  cx(
    styles.bsHeader,
    styles[`bsHeaderType${cap(props.type)}`],
    props.sticky && styles[HEADER_STATE_CLASS.IS_STICKY],
    resolveClassNames(props.classNames)
  )
)
</script>

<template>
  <header v-bind="$attrs" :class="rootClass">
    <slot v-if="$slots.default" />
    <template v-else>
      <div :class="styles.bsHeaderLeft">
        <button
          v-if="props.back"
          type="button"
          :class="styles.bsHeaderBack"
          aria-label="뒤로 가기"
          @click="emit('back')"
        >
          <Icon name="chevron-left" :size="20" />
        </button>
        <span v-if="$slots.logo" :class="styles.bsHeaderLogo"><slot name="logo" /></span>
        <span v-if="props.title != null || $slots.title" :class="styles.bsHeaderTitle"
          ><slot name="title">{{ props.title }}</slot></span
        >
      </div>

      <div v-if="props.actions != null && props.actions.length > 0" :class="styles.bsHeaderActions">
        <button
          v-for="(action, i) in props.actions"
          :key="i"
          type="button"
          :class="styles.bsHeaderAction"
          :aria-label="action.label"
          @click="action.onClick?.()"
        >
          <Icon :name="action.icon" :size="18" />
          <span v-if="action.badge != null" :class="styles.bsHeaderBadge">{{ action.badge }}</span>
        </button>
      </div>
    </template>
  </header>
</template>
