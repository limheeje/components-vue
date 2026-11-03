<script setup lang="ts">
import {computed, provide, toRef} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import {LIST_CLICKABLE_KEY, LIST_DEFAULT, LIST_STATE_CLASS} from '~/components/List/List.constant'
import type {ListProps} from '~/components/List/List.type'
import styles from '~/components/List/List.module.scss'

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<ListProps>(), {
  divided: LIST_DEFAULT.DIVIDED,
  clickable: false,
  loading: false
})

const emit = defineEmits<{itemClick: [unknown, number]}>()

provide(LIST_CLICKABLE_KEY, toRef(props, 'clickable'))

const skeletonRows = Array.from({length: LIST_DEFAULT.SKELETON_COUNT}, (_, i) => i)
const rootClass = computed(() =>
  cx(styles.bsList, props.divided && styles[LIST_STATE_CLASS.IS_DIVIDED], resolveClassNames(props.classNames))
)

function onRowClick(item: unknown, index: number) {
  emit('itemClick', item, index)
}
</script>

<template>
  <div v-if="props.loading" v-bind="$attrs" :class="rootClass" aria-busy="true">
    <div v-for="i in skeletonRows" :key="i" :class="styles.bsListSkeletonRow">
      <span :class="styles.bsListSkeletonAvatar" />
      <div :class="styles.bsListSkeletonBody">
        <span :class="styles.bsListSkeletonLine" style="width: 60%" />
        <span :class="styles.bsListSkeletonLine" style="width: 40%" />
      </div>
    </div>
  </div>

  <div v-else v-bind="$attrs" role="list" :class="rootClass">
    <template v-if="props.items != null">
      <div v-for="(item, index) in props.items" :key="index" style="display: contents" @click="onRowClick(item, index)">
        <slot name="item" :item="item" :index="index" />
      </div>
    </template>
    <slot v-else />
  </div>
</template>
