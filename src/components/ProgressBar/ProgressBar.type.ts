import type {PROGRESS_BAR_COLOR, PROGRESS_BAR_THICKNESS} from '~/components/ProgressBar/ProgressBar.constant'

export type ProgressBarColor = (typeof PROGRESS_BAR_COLOR)[keyof typeof PROGRESS_BAR_COLOR]
export type ProgressBarThickness = (typeof PROGRESS_BAR_THICKNESS)[keyof typeof PROGRESS_BAR_THICKNESS]

export interface ProgressBarProps {
  /** 진행률 0~100. 기본값 0. `v-model` 로 바인딩 가능 */
  modelValue?: number
  /** 우측에 퍼센트 표시 */
  showValue?: boolean
  /** 색상. 기본값 primary */
  color?: ProgressBarColor
  /** 막대 두께. 기본값 md */
  thickness?: ProgressBarThickness
  /** 진행 중 흐르는 그라데이션 애니메이션 */
  animated?: boolean
  /** 막대 위 라벨 (slot 으로도 지정 가능) */
  label?: string
  /** 추가 클래스 (string | string[]) */
  classNames?: string | string[]
}
