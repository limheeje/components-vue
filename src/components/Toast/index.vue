<script setup lang="ts">
import {computed, onMounted, ref, watchEffect} from 'vue'

import {cx} from '~/lib/cx'

import Icon from '~/components/Icon'
import {TOAST_ICON, TOAST_POSITION} from '~/components/Toast/Toast.constant'
import {configureToast, dismissToast, toastState} from '~/components/Toast/Toast.store'
import type {ToastProviderProps} from '~/components/Toast/Toast.type'
import styles from '~/components/Toast/Toast.module.scss'
const cap = (s: string) => s.replace(/(?:^|-)([a-z])/g, (m: string) => m.slice(-1).toUpperCase())

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<ToastProviderProps>(), {
  position: TOAST_POSITION.TOP_RIGHT,
  maxCount: 5
})

const mounted = ref(false)
onMounted(() => (mounted.value = true))
watchEffect(() => configureToast({position: props.position, maxCount: props.maxCount}))

const grouped = computed(() => {
  const map = new Map<string, typeof toastState.toasts>()
  for (const t of toastState.toasts) {
    map.set(t.position, [...(map.get(t.position) ?? []), t])
  }
  return [...map.entries()]
})

function onAction(toast: (typeof toastState.toasts)[number]) {
  toast.action?.onClick()
  dismissToast(toast.id)
}
</script>

<template>
  <slot />
  <Teleport v-if="mounted" to="body">
    <div v-for="[pos, list] in grouped" :key="pos" :class="cx(styles.bsToastViewport, styles[`bsToastPos${cap(pos)}`])">
      <div
        v-for="toast in list"
        :key="toast.id"
        :class="
          cx(styles.bsToast, styles[`bsToastType${cap(toast.type)}`], styles[`bsToastVariant${cap(toast.variant)}`])
        "
        role="status"
        aria-live="polite"
      >
        <Icon :name="TOAST_ICON[toast.type]" :size="16" :class-names="styles.bsToastIcon" />
        <span :class="styles.bsToastMessage">{{ toast.message }}</span>
        <button v-if="toast.action != null" type="button" :class="styles.bsToastAction" @click="onAction(toast)">
          {{ toast.action.label }}
        </button>
        <button
          v-if="toast.dismissible"
          type="button"
          :class="styles.bsToastClose"
          aria-label="닫기"
          @click="dismissToast(toast.id)"
        >
          <Icon name="close" :size="14" />
        </button>
      </div>
    </div>
  </Teleport>
</template>
