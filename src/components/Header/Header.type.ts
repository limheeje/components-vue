import type {HEADER_TYPE} from '~/components/Header/Header.constant'

export type HeaderType = (typeof HEADER_TYPE)[keyof typeof HEADER_TYPE]

export interface HeaderAction {
  /** 아이콘 이름 (`Icon` name) */
  icon: string
  /** 클릭 핸들러 */
  onClick?: () => void
  /** 우상단 뱃지 숫자/문자 */
  badge?: number | string
  /** 접근성 라벨 */
  label?: string
}

export interface HeaderProps {
  /** 시각 스타일. 기본값 default */
  type?: HeaderType
  /** 가운데 제목 (slot `title` 도 가능) */
  title?: string
  /** 좌측 뒤로가기 버튼 (`back` 이벤트 emit) */
  back?: boolean
  /** 우측 액션 버튼 배열 */
  actions?: HeaderAction[]
  /** 스크롤 시 상단 고정 + 그림자 */
  sticky?: boolean
  /** 추가 클래스 (string | string[]) */
  classNames?: string | string[]
}
