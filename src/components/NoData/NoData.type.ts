import type {NO_DATA_TYPE} from '~/components/NoData/NoData.constant'

export type NoDataType = (typeof NO_DATA_TYPE)[keyof typeof NO_DATA_TYPE]

export interface NoDataProps {
  /** 프리셋. 기본값 empty (기본 아이콘/문구 제공) */
  type?: NoDataType
  /** 제목 (지정 시 프리셋 제목 대체). slot `title` 도 가능 */
  title?: string
  /** 설명 (지정 시 프리셋 설명 대체). slot `description` 도 가능 */
  description?: string
  /** 아이콘 이름. `null` 지정 시 아이콘 미표시, 생략 시 프리셋 아이콘. slot `icon` 도 가능 */
  icon?: string | null
  /** 추가 클래스 (string | string[]) */
  classNames?: string | string[]
}
