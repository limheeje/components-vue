import type {SEARCH_FIELD_SIZE} from '~/components/SearchField/SearchField.constant'

export type SearchFieldSize = (typeof SEARCH_FIELD_SIZE)[keyof typeof SEARCH_FIELD_SIZE]

export interface SearchFieldProps {
  /** 크기. 기본값 md */
  size?: SearchFieldSize
  /** 입력값 (제어). `v-model` 로 양방향 바인딩 */
  modelValue?: string
  /** 초기 입력값 (비제어) */
  defaultValue?: string
  /** placeholder. 기본값 '검색' */
  placeholder?: string
  /** 입력값이 있을 때 우측 X 버튼. 기본값 true */
  clearable?: boolean
  /** 로딩 스피너 표시 (돋보기 대체) */
  loading?: boolean
  /** 비활성화 */
  disabled?: boolean
  /** 추가 클래스 (string | string[]) */
  classNames?: string | string[]
}
