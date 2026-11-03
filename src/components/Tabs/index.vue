<script setup lang="ts">
import {computed, ref, useSlots} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import Icon from '~/components/Icon'
import {TABS_DEFAULT, TABS_STATE_CLASS} from '~/components/Tabs/Tabs.constant'
import type {TabsProps} from '~/components/Tabs/Tabs.type'
import styles from '~/components/Tabs/Tabs.module.scss'
const cap = (s: string) => s.replace(/(?:^|-)([a-z])/g, (m: string) => m.slice(-1).toUpperCase())

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<TabsProps>(), {
  type: TABS_DEFAULT.TYPE,
  size: TABS_DEFAULT.SIZE,
  centered: false,
  fullWidth: false
})

const emit = defineEmits<{'update:modelValue': [string]; change: [string]}>()

const slots = useSlots()
const isControlled = computed(() => props.modelValue !== undefined)
const uncontrolled = ref(props.defaultKey ?? props.items[0]?.key ?? '')
const active = computed(() => (isControlled.value ? props.modelValue : uncontrolled.value))
const activeItem = computed(() => props.items.find((i) => i.key === active.value))
const hasPanel = computed(() => activeItem.value?.content != null || Boolean(slots.panel))

function select(key: string) {
  if (!isControlled.value) uncontrolled.value = key
  emit('update:modelValue', key)
  emit('change', key)
}

const rootClass = computed(() =>
  cx(
    styles.bsTabs,
    styles[`bsTabsType${cap(props.type)}`],
    styles[`bsTabsSize${cap(props.size)}`],
    props.centered && styles[TABS_STATE_CLASS.IS_CENTERED],
    props.fullWidth && styles[TABS_STATE_CLASS.IS_FULL_WIDTH],
    resolveClassNames(props.classNames)
  )
)
</script>

<template>
  <div v-bind="$attrs" :class="rootClass">
    <div :class="styles.bsTabsBar" role="tablist">
      <button
        v-for="item in props.items"
        :key="item.key"
        type="button"
        role="tab"
        :aria-selected="item.key === active"
        :aria-disabled="item.disabled || undefined"
        :tabindex="item.key === active ? 0 : -1"
        :class="
          cx(
            styles.bsTabsTab,
            item.key === active && styles[TABS_STATE_CLASS.IS_ACTIVE],
            item.disabled && styles[TABS_STATE_CLASS.IS_DISABLED]
          )
        "
        @click="!item.disabled && select(item.key)"
      >
        <span v-if="item.icon != null" :class="styles.bsTabsTabIcon"><Icon :name="item.icon" :size="13" /></span>
        {{ item.label }}
        <span v-if="item.badge !== undefined" :class="styles.bsTabsBadge">{{ item.badge }}</span>
      </button>
    </div>

    <div v-if="hasPanel" :class="styles.bsTabsPanel" role="tabpanel">
      <slot name="panel" :item="activeItem">{{ activeItem?.content }}</slot>
    </div>
  </div>
</template>
