<script setup lang="ts">
import {computed, ref, useSlots} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import Icon from '~/components/Icon'
import {BREADCRUMB_DEFAULT, BREADCRUMB_STATE_CLASS} from '~/components/Breadcrumb/Breadcrumb.constant'
import type {BreadcrumbItem, BreadcrumbProps} from '~/components/Breadcrumb/Breadcrumb.type'
import styles from '~/components/Breadcrumb/Breadcrumb.module.scss'
const cap = (s: string) => s.replace(/(?:^|-)([a-z])/g, (m: string) => m.slice(-1).toUpperCase())

const ELLIPSIS = 'ellipsis'
type Displayed = BreadcrumbItem | typeof ELLIPSIS

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<BreadcrumbProps>(), {
  size: BREADCRUMB_DEFAULT.SIZE
})

const slots = useSlots()
const expanded = ref(false)

const displayed = computed<Displayed[]>(() => {
  if (
    props.maxItems != null &&
    props.items.length > props.maxItems &&
    !expanded.value &&
    props.items.length > BREADCRUMB_DEFAULT.HEAD_COUNT + BREADCRUMB_DEFAULT.TAIL_COUNT
  ) {
    return [
      ...props.items.slice(0, BREADCRUMB_DEFAULT.HEAD_COUNT),
      ELLIPSIS,
      ...props.items.slice(-BREADCRUMB_DEFAULT.TAIL_COUNT)
    ]
  }
  return props.items
})

const hasSeparatorSlot = computed(() => Boolean(slots.separator))
</script>

<template>
  <nav
    v-bind="$attrs"
    aria-label="breadcrumb"
    :class="cx(styles.bsBreadcrumb, styles[`bsBreadcrumbSize${cap(props.size)}`], resolveClassNames(props.classNames))"
  >
    <ol :class="styles.bsBreadcrumbList">
      <template v-for="(item, index) in displayed" :key="item === ELLIPSIS ? 'ellipsis' : index">
        <li :class="styles.bsBreadcrumbItem">
          <button
            v-if="item === ELLIPSIS"
            type="button"
            :class="styles.bsBreadcrumbExpand"
            aria-label="생략된 경로 펼치기"
            @click="expanded = true"
          >
            …
          </button>
          <span
            v-else-if="index === displayed.length - 1"
            :class="cx(styles.bsBreadcrumbLabel, styles[BREADCRUMB_STATE_CLASS.IS_CURRENT])"
            aria-current="page"
          >
            <Icon v-if="item.icon" :name="item.icon" :size="13" />
            {{ item.label }}
          </span>
          <a v-else :href="item.href ?? '#'" :class="styles.bsBreadcrumbLink" @click="item.onClick?.($event)">
            <Icon v-if="item.icon" :name="item.icon" :size="13" />
            {{ item.label }}
          </a>
        </li>
        <li v-if="index !== displayed.length - 1" :class="styles.bsBreadcrumbSeparator" aria-hidden="true">
          <slot v-if="hasSeparatorSlot" name="separator" />
          <template v-else-if="props.separator != null">{{ props.separator }}</template>
          <Icon v-else name="chevron-right" :size="13" />
        </li>
      </template>
    </ol>
  </nav>
</template>
