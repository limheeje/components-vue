import type {RADIO_SIZE} from '~/components/Radio/Radio.constant'

export type RadioSize = (typeof RADIO_SIZE)[keyof typeof RADIO_SIZE]

export interface RadioProps {
  /** 라벨 텍스트 (slot 으로도 지정 가능) */
  label?: string
  /** 크기. 기본값 md */
  size?: RadioSize
  /** 에러(유효성 실패) 상태 */
  error?: boolean
  /** 이 라디오가 나타내는 고유 값 (`v-model` 과 매칭) */
  value?: string
  /** 그룹 선택 값 (제어). `v-model` 로 바인딩, `modelValue === value` 이면 선택됨 */
  modelValue?: string
  /** 선택 상태 (제어). `v-model:checked` (boolean) 로도 바인딩 가능 */
  checked?: boolean
  /** 초기 선택 상태 (비제어) */
  defaultChecked?: boolean
  /** 비활성화 */
  disabled?: boolean
  /** 추가 클래스 (string | string[]) */
  classNames?: string | string[]
}
