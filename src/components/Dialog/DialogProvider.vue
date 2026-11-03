<script setup lang="ts">
import {onMounted, ref} from 'vue'
import type {FunctionalComponent, VNodeChild} from 'vue'

import DialogShell from '~/components/Dialog/DialogShell.vue'
import {DIALOG_KIND} from '~/components/Dialog/Dialog.constant'
import {closeDialog, dialogState, resolveDialog} from '~/components/Dialog/Dialog.store'
import type {DialogInstance} from '~/components/Dialog/Dialog.type'
import styles from '~/components/Dialog/Dialog.module.scss'

defineOptions({inheritAttrs: false})

const Cell = ((p: {node: VNodeChild}) => p.node) as FunctionalComponent<{node: VNodeChild}>

const mounted = ref(false)
onMounted(() => (mounted.value = true))

function isChoice(d: DialogInstance) {
  return d.kind === DIALOG_KIND.CONFIRM || d.kind === DIALOG_KIND.ALERT
}
function toneClass(d: DialogInstance) {
  return d.tone === 'danger' ? styles.bsDialogConfirmDanger : styles.bsDialogConfirm
}
</script>

<template>
  <slot />
  <Teleport v-if="mounted && dialogState.dialogs.length > 0" to="body">
    <DialogShell
      v-for="d in dialogState.dialogs"
      :key="d.id"
      :on-close="() => closeDialog(d.id)"
      :title="d.title"
      :description="d.description"
      :size="d.size"
      :variant="d.variant"
      :direction="d.direction"
      :lock-scroll="d.lockScroll"
      :handle="d.handle"
      :swipe-to-close="d.swipeToClose"
      :close-threshold="d.closeThreshold"
      :close-on-backdrop="d.closeOnBackdrop"
      :close-on-esc="d.closeOnEsc"
      :hide-close="d.hideClose"
      :aria-label="d.ariaLabel"
      :has-body="isChoice(d) || d.content != null"
      :has-footer="isChoice(d) || d.footer != null"
    >
      <p v-if="isChoice(d)" :class="styles.bsDialogMessage">{{ d.message }}</p>
      <Cell v-else :node="d.content" />

      <template #footer>
        <template v-if="isChoice(d)">
          <button
            v-if="d.kind === DIALOG_KIND.CONFIRM"
            type="button"
            :class="styles.bsDialogBtnGhost"
            @click="resolveDialog(d.id, false)"
          >
            {{ d.cancelText }}
          </button>
          <button type="button" :class="toneClass(d)" @click="resolveDialog(d.id, true)">{{ d.confirmText }}</button>
        </template>
        <Cell v-else :node="d.footer" />
      </template>
    </DialogShell>
  </Teleport>
</template>
