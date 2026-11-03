export interface ListProps<T = unknown> {
  /** 데이터 배열 (scoped slot `item` 과 함께 사용) */
  items?: T[]
  /** items 항목 클릭 콜백 */
  onItemClick?: (item: T, index: number) => void
  /** 항목 간 구분선. 기본값 true */
  divided?: boolean
  /** 모든 항목 클릭 가능 (자식 ListItem 에 전파) */
  clickable?: boolean
  /** 로딩 스켈레톤 표시 */
  loading?: boolean
  /** 추가 클래스 (string | string[]) */
  classNames?: string | string[]
}
