import '~/assets/styles/tokens.css'

import ToastProvider from '~/components/Toast/index.vue'

/** ToastProvider 별칭 (원본 호환) */
const ToastContainer = ToastProvider

export {ToastProvider, ToastContainer}
export default ToastProvider
export {showToast, dismissToast, clearToasts} from '~/components/Toast/Toast.store'
export {TOAST_TYPE, TOAST_POSITION, TOAST_VARIANT, TOAST_ICON, TOAST_DEFAULT} from '~/components/Toast/Toast.constant'
export type {
  ToastOptions,
  ToastData,
  ToastAction,
  ToastProviderProps,
  ToastType,
  ToastPosition,
  ToastVariant
} from '~/components/Toast/Toast.type'
