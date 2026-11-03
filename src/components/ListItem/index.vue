<script setup lang="ts">
import {computed, inject} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import Icon from '~/components/Icon'
import {LIST_CLICKABLE_KEY} from '~/components/List/List.constant'
import {LIST_ITEM_STATE_CLASS} from '~/components/ListItem/ListItem.constant'
import type {ListItemProps} from '~/components/ListItem/ListItem.type'
import styles from '~/components/ListItem/ListItem.module.scss'

defineOptions({inheritAttrs: false})

const props = defineProps<ListItemProps>()

const injectedClickable = inject(LIST_CLICKABLE_KEY, null)
const clickable = computed(() => props.clickable ?? injectedClickable?.value ?? false)
</script>

<template>
  <div
    v-bind="$attrs"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    :class="
      cx(
        styles.bsListItemItem,
        clickable && styles[LIST_ITEM_STATE_CLASS.IS_CLICKABLE],
        resolveClassNames(props.classNames)
      )
    "
  >
    <span v-if="$slots.avatar" :class="styles.bsListItemAvatar"><slot name="avatar" /></span>
    <div :class="styles.bsListItemBody">
      <span :class="styles.bsListItemTitle"
        ><slot>{{ props.title }}</slot></span
      >
      <span v-if="props.description != null || $slots.description" :class="styles.bsListItemDescription">
        <slot name="description">{{ props.description }}</slot>
      </span>
    </div>
    <span v-if="$slots.extra" :class="styles.bsListItemExtra"><slot name="extra" /></span>
    <Icon v-if="clickable" name="chevron-right" :size="14" :class-names="styles.bsListItemChevron" />
  </div>
</template>
