import type {SELECT_SIZE} from '~/components/Select/Select.constant'

export type SelectSize = (typeof SELECT_SIZE)[keyof typeof SELECT_SIZE]

export interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

interface SelectBaseProps {
  /** 선택지 목록 */
  options: SelectOption[]
  /** 미선택 상태 안내 문구. 기본값 "선택해주세요" */
  placeholder?: string
  /** 크기. 기본값 md */
  size?: SelectSize
  /** 드롭다운 상단 검색 입력 노출 */
  searchable?: boolean
  /** 비활성 */
  disabled?: boolean
  /** 에러 상태. 문자열이면 컨트롤 하단에 메시지로 표시 */
  error?: boolean | string
  /** 보조 안내 문구 (error 가 없을 때만 표시). slot 으로도 지정 가능 */
  helperText?: string
  /** form 연동용 name (hidden input) */
  name?: string
  /** 트리거 id */
  id?: string
  /** 추가 클래스 (string | string[]) */
  classNames?: string | string[]
}

export interface SelectSingleProps extends SelectBaseProps {
  /** 다중 선택 비활성 (기본) */
  multiple?: false
  /** 제어 값. `v-model` 로 양방향 바인딩 */
  modelValue?: string
  /** 비제어 초기값 */
  defaultValue?: string
}

export interface SelectMultipleProps extends SelectBaseProps {
  /** 다중 선택 모드 */
  multiple: true
  /** 제어 값 (선택된 value 배열). `v-model` 로 양방향 바인딩 */
  modelValue?: string[]
  /** 비제어 초기값 */
  defaultValue?: string[]
}

/** 소비자용 공개 타입 (React 와 동일한 discriminated union) */
export type SelectProps = SelectSingleProps | SelectMultipleProps

/** 컴포넌트 defineProps 용 (매크로가 union 을 못 다뤄서 flat). @change 는 emit 이라 onChange 없음 */
export interface SelectComponentProps extends SelectBaseProps {
  multiple?: boolean
  modelValue?: string | string[]
  defaultValue?: string | string[]
}
