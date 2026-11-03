import type {TOOLTIP_PLACEMENT, TOOLTIP_TRIGGER} from '~/components/Tooltip/Tooltip.constant'

export type TooltipPlacement = (typeof TOOLTIP_PLACEMENT)[keyof typeof TOOLTIP_PLACEMENT]
export type TooltipTrigger = (typeof TOOLTIP_TRIGGER)[keyof typeof TOOLTIP_TRIGGER]

export interface TooltipProps {
  /** 툴팁 내용 (텍스트). 노드가 필요하면 `content` slot 사용 */
  content?: string
  /** 표시 방향. 기본값 top */
  placement?: TooltipPlacement
  /** 트리거 방식. 기본값 hover */
  trigger?: TooltipTrigger
  /** 화살표 표시. 기본값 true */
  arrow?: boolean
  /** 표시 지연(ms). 기본값 0 */
  delay?: number
  /** 비활성화 (툴팁 안 뜸) */
  disabled?: boolean
  /** 추가 클래스 (string | string[]) — 툴팁 박스에 적용 */
  classNames?: string | string[]
}
