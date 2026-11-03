import type {VNodeChild} from 'vue'

import type {
  DIALOG_KIND,
  DIALOG_DIRECTION,
  DIALOG_SIZE,
  DIALOG_TONE,
  DIALOG_VARIANT
} from '~/components/Dialog/Dialog.constant'

export type DialogSize = (typeof DIALOG_SIZE)[keyof typeof DIALOG_SIZE]
export type DialogTone = (typeof DIALOG_TONE)[keyof typeof DIALOG_TONE]
export type DialogKind = (typeof DIALOG_KIND)[keyof typeof DIALOG_KIND]
export type DialogVariant = (typeof DIALOG_VARIANT)[keyof typeof DIALOG_VARIANT]
export type DialogDirection = (typeof DIALOG_DIRECTION)[keyof typeof DIALOG_DIRECTION]

/** 선언형 <Dialog> */
export interface DialogProps {
  /** 열림 상태 (제어) */
  open: boolean
  /** 헤더 제목 (slot `title` 로도 지정 가능) */
  title?: string
  /** 제목 아래 설명 (slot `description` 로도 지정 가능) */
  description?: string
  /** 크기 (variant='modal', 또는 drawer 의 left/right 폭). 기본값 md */
  size?: DialogSize
  /** 표현 형태. 'modal'(중앙) | 'drawer'(가장자리). 기본값 'modal' */
  variant?: DialogVariant
  /** 드로어가 나오는 방향 (variant='drawer'). 기본값 'bottom' */
  direction?: DialogDirection
  /** 배경(body) 스크롤 잠금. 기본값 true */
  lockScroll?: boolean
  /** 드로어 상단 grab 핸들. 기본값 true (variant='drawer') */
  handle?: boolean
  /** 헤더/핸들을 등장 방향의 반대로 스와이프하면 닫힘. 기본값 true (variant='drawer') */
  swipeToClose?: boolean
  /** 스와이프 닫힘 임계값 (패널 길이 대비 0~1). 기본값 0.45 */
  closeThreshold?: number
  /** 배경 클릭으로 닫기. 기본값 true */
  closeOnBackdrop?: boolean
  /** ESC 로 닫기. 기본값 true */
  closeOnEsc?: boolean
  /** 우상단 X 버튼 숨김 */
  hideClose?: boolean
  /** 접근성 라벨 (title 이 없을 때) */
  ariaLabel?: string
  /** 추가 클래스 (string | string[]) */
  classNames?: string | string[]
}

/** openDialog() 옵션 */
export interface DialogModalOptions {
  title?: string
  description?: string
  content?: VNodeChild
  footer?: VNodeChild
  size?: DialogSize
  variant?: DialogVariant
  direction?: DialogDirection
  lockScroll?: boolean
  handle?: boolean
  swipeToClose?: boolean
  closeThreshold?: number
  closeOnBackdrop?: boolean
  closeOnEsc?: boolean
  hideClose?: boolean
  ariaLabel?: string
  /** 닫힐 때 콜백 */
  onClose?: () => void
}

/** confirmDialog() 옵션 */
export interface DialogConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  /** 확인 버튼 톤. danger → 빨강 */
  tone?: DialogTone
  size?: DialogSize
}

/** alertDialog() 옵션 */
export interface DialogAlertOptions {
  title?: string
  message: string
  confirmText?: string
  size?: DialogSize
}

/** 스토어가 관리하는 다이얼로그 인스턴스 */
export interface DialogInstance {
  id: number
  kind: DialogKind
  title?: string
  description?: string
  content?: VNodeChild
  message?: string
  footer?: VNodeChild
  size: DialogSize
  variant: DialogVariant
  direction: DialogDirection
  lockScroll: boolean
  handle: boolean
  swipeToClose: boolean
  closeThreshold: number
  tone: DialogTone
  confirmText: string
  cancelText: string
  closeOnBackdrop: boolean
  closeOnEsc: boolean
  hideClose: boolean
  ariaLabel?: string
  /** confirm/alert 결과 전달 + modal onClose */
  resolve?: (value: boolean) => void
  onClose?: () => void
}
