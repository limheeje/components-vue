import type {CHECKBOX_SIZE} from '~/components/Checkbox/Checkbox.constant'

export type CheckboxSize = (typeof CHECKBOX_SIZE)[keyof typeof CHECKBOX_SIZE]

export interface CheckboxProps {
  /** 라벨 텍스트 (slot 으로도 지정 가능) */
  label?: string
  /** 크기. 기본값 md */
  size?: CheckboxSize
  /** 부분 선택 상태 (checked 보다 우선하는 시각 표현) */
  indeterminate?: boolean
  /** 에러(유효성 실패) 상태 */
  error?: boolean
  /** 이 체크박스가 나타내는 값 (`v-model` 이 배열일 때 포함 여부 판별) */
  value?: string
  /** 체크 상태 (제어). `v-model` — boolean 이면 체크 상태, string[] 이면 value 포함 여부 */
  modelValue?: boolean | string[]
  /** 체크 상태 (제어). `v-model:checked` (boolean) 로도 바인딩 가능 */
  checked?: boolean
  /** 초기 체크 상태 (비제어) */
  defaultChecked?: boolean
  /** 비활성화 */
  disabled?: boolean
  /** 추가 클래스 (string | string[]) */
  classNames?: string | string[]
}
