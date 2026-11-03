import type {SWITCH_SIZE} from '~/components/Switch/Switch.constant'

export type SwitchSize = (typeof SWITCH_SIZE)[keyof typeof SWITCH_SIZE]

export interface SwitchProps {
  /** 라벨 텍스트 (slot 으로도 지정 가능) */
  label?: string
  /** 크기. 기본값 md */
  size?: SwitchSize
  /** 에러(유효성 실패) 상태 */
  error?: boolean
  /** 켜짐 상태 (제어). `v-model` (boolean) 로 양방향 바인딩 */
  modelValue?: boolean
  /** 켜짐 상태 (제어). `v-model:checked` (boolean) 로도 바인딩 가능 */
  checked?: boolean
  /** 초기 체크 상태 (비제어) */
  defaultChecked?: boolean
  /** 비활성화 */
  disabled?: boolean
  /** 추가 클래스 (string | string[]) */
  classNames?: string | string[]
}
