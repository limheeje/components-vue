import type {SHARE_CHANNEL} from '~/components/ShareSheet/ShareSheet.constant'

export type ShareChannel = (typeof SHARE_CHANNEL)[keyof typeof SHARE_CHANNEL]

export interface ShareSheetProps {
  /** 열림 상태 (제어) */
  open: boolean
  /** 공유할 URL */
  url: string
  /** 헤더 제목. 기본값 '공유하기' */
  title?: string
  /** 노출할 채널 + 순서. 기본값 전체(kakao/facebook/twitter/whatsapp) */
  channels?: ShareChannel[]
  /** 배경 클릭으로 닫기. 기본값 true */
  closeOnBackdrop?: boolean
  /** 추가 클래스 (string | string[]) */
  classNames?: string | string[]
}
