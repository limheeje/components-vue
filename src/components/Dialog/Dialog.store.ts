import {shallowReactive} from 'vue'

import {DIALOG_DEFAULT, DIALOG_KIND, DIALOG_DIRECTION, DIALOG_VARIANT} from '~/components/Dialog/Dialog.constant'
import type {
  DialogAlertOptions,
  DialogConfirmOptions,
  DialogInstance,
  DialogModalOptions
} from '~/components/Dialog/Dialog.type'

/**
 * 명령형 다이얼로그 전역 스토어 — DialogProvider 가 렌더.
 * `content`/`footer` 가 VNode 일 수 있어 shallow 로 두고 배열은 항상 재할당한다.
 */
export const dialogState = shallowReactive<{dialogs: DialogInstance[]}>({dialogs: []})

let counter = 0

function push(instance: DialogInstance) {
  dialogState.dialogs = [...dialogState.dialogs, instance]
}

/** confirm/alert 등 중앙 모달 고정 인스턴스의 표현 관련 기본값 */
const MODAL_PRESENTATION = {
  variant: DIALOG_VARIANT.MODAL,
  direction: DIALOG_DIRECTION.BOTTOM,
  lockScroll: DIALOG_DEFAULT.LOCK_SCROLL,
  handle: DIALOG_DEFAULT.HANDLE,
  swipeToClose: DIALOG_DEFAULT.SWIPE_TO_CLOSE,
  closeThreshold: DIALOG_DEFAULT.CLOSE_THRESHOLD
} as const

/** 특정(또는 마지막) 다이얼로그 닫기 */
export function closeDialog(id?: number): void {
  const list = dialogState.dialogs
  const target = id != null ? list.find((d) => d.id === id) : list[list.length - 1]
  if (!target) return
  dialogState.dialogs = list.filter((d) => d.id !== target.id)
  target.onClose?.()
  target.resolve?.(false)
}

/** 전부 닫기 */
export function closeAllDialogs(): void {
  if (dialogState.dialogs.length === 0) return
  const all = dialogState.dialogs
  dialogState.dialogs = []
  for (const d of all) {
    d.onClose?.()
    d.resolve?.(false)
  }
}

/** confirm/alert 버튼 클릭 결과 처리 */
export function resolveDialog(id: number, value: boolean): void {
  const target = dialogState.dialogs.find((d) => d.id === id)
  if (!target) return
  dialogState.dialogs = dialogState.dialogs.filter((d) => d.id !== id)
  target.onClose?.()
  target.resolve?.(value)
}

/** 임의 콘텐츠 모달. id 반환 */
export function openDialog(options: DialogModalOptions): number {
  const id = ++counter
  push({
    id,
    kind: DIALOG_KIND.MODAL,
    title: options.title,
    description: options.description,
    content: options.content,
    footer: options.footer,
    size: options.size ?? DIALOG_DEFAULT.SIZE,
    variant: options.variant ?? DIALOG_DEFAULT.VARIANT,
    direction: options.direction ?? DIALOG_DEFAULT.DIRECTION,
    lockScroll: options.lockScroll ?? DIALOG_DEFAULT.LOCK_SCROLL,
    handle: options.handle ?? DIALOG_DEFAULT.HANDLE,
    swipeToClose: options.swipeToClose ?? DIALOG_DEFAULT.SWIPE_TO_CLOSE,
    closeThreshold: options.closeThreshold ?? DIALOG_DEFAULT.CLOSE_THRESHOLD,
    tone: DIALOG_DEFAULT.TONE,
    confirmText: DIALOG_DEFAULT.CONFIRM_TEXT,
    cancelText: DIALOG_DEFAULT.CANCEL_TEXT,
    closeOnBackdrop: options.closeOnBackdrop ?? DIALOG_DEFAULT.CLOSE_ON_BACKDROP,
    closeOnEsc: options.closeOnEsc ?? DIALOG_DEFAULT.CLOSE_ON_ESC,
    hideClose: options.hideClose ?? false,
    ariaLabel: options.ariaLabel,
    onClose: options.onClose
  })
  return id
}

/** 확인/취소. Promise<boolean> */
export function confirmDialog(options: DialogConfirmOptions): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    const id = ++counter
    push({
      id,
      kind: DIALOG_KIND.CONFIRM,
      title: options.title,
      message: options.message,
      size: options.size ?? DIALOG_DEFAULT.SIZE,
      ...MODAL_PRESENTATION,
      tone: options.tone ?? DIALOG_DEFAULT.TONE,
      confirmText: options.confirmText ?? DIALOG_DEFAULT.CONFIRM_TEXT,
      cancelText: options.cancelText ?? DIALOG_DEFAULT.CANCEL_TEXT,
      closeOnBackdrop: false,
      closeOnEsc: true,
      hideClose: false,
      resolve
    })
  })
}

/** 알림. Promise<void> (확인 시 resolve) */
export function alertDialog(options: DialogAlertOptions): Promise<void> {
  return new Promise<void>((resolve) => {
    const id = ++counter
    push({
      id,
      kind: DIALOG_KIND.ALERT,
      title: options.title,
      message: options.message,
      size: options.size ?? DIALOG_DEFAULT.SIZE,
      ...MODAL_PRESENTATION,
      tone: DIALOG_DEFAULT.TONE,
      confirmText: options.confirmText ?? DIALOG_DEFAULT.CONFIRM_TEXT,
      cancelText: DIALOG_DEFAULT.CANCEL_TEXT,
      closeOnBackdrop: false,
      closeOnEsc: true,
      hideClose: true,
      resolve: () => resolve()
    })
  })
}
