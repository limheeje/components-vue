import type {INPUT_SIZE, INPUT_TYPE} from '~/components/Input/Input.constant'

export type InputType = (typeof INPUT_TYPE)[keyof typeof INPUT_TYPE]
export type InputSize = (typeof INPUT_SIZE)[keyof typeof INPUT_SIZE]

export interface InputProps {
  /** input type. 기본값 text */
  type?: InputType
  /** 크기. 기본값 md */
  size?: InputSize
  /** 에러 상태. 문자열이면 컨트롤 하단에 메시지로 표시 */
  error?: boolean | string
  /** 보조 안내 문구 (error 가 없을 때만 표시). slot 으로도 지정 가능 */
  helperText?: string
  /** 입력값이 있을 때 우측 X(지우기) 버튼 노출. 기본값 true */
  clearable?: boolean
  /** 글자 수 카운터 표시 (maxLength 와 함께 사용) */
  showCount?: boolean
  /** 좌측 고정 요소 (slot `prefix`). 문자열이면 prop 도 가능 */
  prefix?: string
  /** 우측 고정 요소 (slot `suffix`). 문자열이면 prop 도 가능 */
  suffix?: string
  /** type="password" 에서 표시/숨기기 토글 버튼 노출 */
  showToggle?: boolean
  /** 입력값 (제어). `v-model` 로 양방향 바인딩 */
  modelValue?: string
  /** 초기 입력값 (비제어) */
  defaultValue?: string
  /** placeholder */
  placeholder?: string
  /** 최대 글자 수 */
  maxLength?: number
  /** 비활성화 */
  disabled?: boolean
  /** 읽기 전용 */
  readonly?: boolean
  /** input id (미지정 시 자동 생성) */
  id?: string
  /** 추가 클래스 (string | string[]) */
  classNames?: string | string[]
}

/** `Input.Text` 등 서브 컴포넌트 props (type 은 고정) */
export type InputVariantProps = Omit<InputProps, 'type'>
