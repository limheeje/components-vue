import type {BREADCRUMB_SIZE} from '~/components/Breadcrumb/Breadcrumb.constant'

export type BreadcrumbSize = (typeof BREADCRUMB_SIZE)[keyof typeof BREADCRUMB_SIZE]

export interface BreadcrumbItem {
  label: string
  href?: string
  /** 항목 앞 아이콘 이름 (`Icon` name) */
  icon?: string
  onClick?: (event: MouseEvent) => void
}

export interface BreadcrumbProps {
  /** 경로 항목 (마지막 항목이 현재 위치) */
  items: BreadcrumbItem[]
  /** 구분자. 기본값 chevron-right 아이콘. slot `separator` 도 가능 */
  separator?: string
  /** 이 개수를 넘으면 가운데를 "…" 로 축약 (클릭 시 펼침) */
  maxItems?: number
  /** 크기. 기본값 md */
  size?: BreadcrumbSize
  /** 추가 클래스 (string | string[]) */
  classNames?: string | string[]
}
