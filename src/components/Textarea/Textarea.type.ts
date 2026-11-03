export interface TextareaProps {
  /** 에러 상태. 문자열이면 컨트롤 하단에 메시지로 표시 */
  error?: boolean | string
  /** 세로 리사이즈 핸들 노출. 기본값 true */
  resize?: boolean
  /** 우측 하단 글자 수 카운터 표시 (maxLength 와 함께 사용) */
  showCount?: boolean
  /** 기본 표시 줄 수. 기본값 3 */
  rows?: number
  /** 보조 안내 문구 (error 가 없을 때만 표시). slot 으로도 지정 가능 */
  helperText?: string
  /** 최대 글자 수 */
  maxLength?: number
  /** 입력값 (제어). `v-model` 로 양방향 바인딩 */
  modelValue?: string
  /** 초기 입력값 (비제어) */
  defaultValue?: string
  /** placeholder */
  placeholder?: string
  /** 비활성화 */
  disabled?: boolean
  /** 읽기 전용 */
  readonly?: boolean
  /** textarea id (미지정 시 자동 생성) */
  id?: string
  /** 추가 클래스 (string | string[]) */
  classNames?: string | string[]
}
