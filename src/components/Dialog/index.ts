import '~/assets/styles/tokens.css'

import Dialog from '~/components/Dialog/index.vue'
import DialogProvider from '~/components/Dialog/DialogProvider.vue'

export {Dialog, DialogProvider}
export default Dialog
export {openDialog, confirmDialog, alertDialog, closeDialog, closeAllDialogs} from '~/components/Dialog/Dialog.store'
export {
  DIALOG_SIZE,
  DIALOG_TONE,
  DIALOG_KIND,
  DIALOG_VARIANT,
  DIALOG_DIRECTION,
  DIALOG_DEFAULT
} from '~/components/Dialog/Dialog.constant'
export type {
  DialogProps,
  DialogModalOptions,
  DialogConfirmOptions,
  DialogAlertOptions,
  DialogInstance,
  DialogSize,
  DialogTone,
  DialogKind,
  DialogVariant,
  DialogDirection
} from '~/components/Dialog/Dialog.type'
