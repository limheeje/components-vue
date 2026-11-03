import {reactive} from 'vue'

import {TOAST_DEFAULT} from '~/components/Toast/Toast.constant'
import type {ToastData, ToastOptions, ToastPosition} from '~/components/Toast/Toast.type'

/** 전역 reactive 스토어 — showToast 로 어디서든 조작, ToastProvider 가 렌더 */
export const toastState = reactive<{toasts: ToastData[]}>({toasts: []})

let counter = 0
const config = {
  position: TOAST_DEFAULT.POSITION as ToastPosition,
  maxCount: TOAST_DEFAULT.MAX_COUNT as number
}

export function configureToast(next: Partial<typeof config>): void {
  Object.assign(config, next)
}

/** 토스트 표시. 생성된 id 를 반환한다. */
export function showToast(options: ToastOptions): number {
  const id = ++counter
  const toast: ToastData = {
    id,
    type: options.type ?? TOAST_DEFAULT.TYPE,
    message: options.message,
    duration: options.duration ?? TOAST_DEFAULT.DURATION,
    position: options.position ?? config.position,
    variant: options.variant ?? TOAST_DEFAULT.VARIANT,
    dismissible: options.dismissible ?? TOAST_DEFAULT.DISMISSIBLE,
    action: options.action
  }

  toastState.toasts.push(toast)

  // 같은 위치 기준 최대 개수 제한
  const samePos = toastState.toasts.filter((t) => t.position === toast.position)
  if (samePos.length > config.maxCount) {
    const drop = samePos.slice(0, samePos.length - config.maxCount)
    const dropIds = new Set(drop.map((t) => t.id))
    toastState.toasts = toastState.toasts.filter((t) => !dropIds.has(t.id))
  }

  if (Number.isFinite(toast.duration)) {
    setTimeout(() => dismissToast(id), toast.duration)
  }
  return id
}

/** 특정 토스트 즉시 닫기 */
export function dismissToast(id: number): void {
  toastState.toasts = toastState.toasts.filter((t) => t.id !== id)
}

/** 전체 닫기 */
export function clearToasts(): void {
  toastState.toasts = []
}
