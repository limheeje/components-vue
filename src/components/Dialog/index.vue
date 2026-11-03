<script setup lang="ts">
import {computed, onMounted, ref, useSlots} from 'vue'

import {DIALOG_DEFAULT} from '~/components/Dialog/Dialog.constant'
import DialogShell from '~/components/Dialog/DialogShell.vue'
import type {DialogProps} from '~/components/Dialog/Dialog.type'

defineOptions({inheritAttrs: false})

withDefaults(defineProps<DialogProps>(), {
  size: DIALOG_DEFAULT.SIZE,
  variant: DIALOG_DEFAULT.VARIANT,
  direction: DIALOG_DEFAULT.DIRECTION,
  lockScroll: DIALOG_DEFAULT.LOCK_SCROLL,
  handle: DIALOG_DEFAULT.HANDLE,
  swipeToClose: DIALOG_DEFAULT.SWIPE_TO_CLOSE,
  closeThreshold: DIALOG_DEFAULT.CLOSE_THRESHOLD,
  closeOnBackdrop: DIALOG_DEFAULT.CLOSE_ON_BACKDROP,
  closeOnEsc: DIALOG_DEFAULT.CLOSE_ON_ESC,
  hideClose: false
})

const emit = defineEmits<{close: []}>()

const slots = useSlots()
const mounted = ref(false)
onMounted(() => (mounted.value = true))

const close = () => emit('close')
const hasBody = computed(() => !!slots.default)
const hasFooter = computed(() => !!slots.footer)
</script>

<template>
  <Teleport v-if="open && mounted" to="body">
    <DialogShell
      v-bind="$attrs"
      :on-close="close"
      :title="title"
      :description="description"
      :size="size"
      :variant="variant"
      :direction="direction"
      :lock-scroll="lockScroll"
      :handle="handle"
      :swipe-to-close="swipeToClose"
      :close-threshold="closeThreshold"
      :close-on-backdrop="closeOnBackdrop"
      :close-on-esc="closeOnEsc"
      :hide-close="hideClose"
      :aria-label="ariaLabel"
      :class-names="classNames"
      :has-body="hasBody"
      :has-footer="hasFooter"
    >
      <slot />
      <template v-if="hasFooter" #footer><slot name="footer" /></template>
      <template v-if="$slots.title" #title><slot name="title" /></template>
      <template v-if="$slots.description" #description><slot name="description" /></template>
    </DialogShell>
  </Teleport>
</template>
