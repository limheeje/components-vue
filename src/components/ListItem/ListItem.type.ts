export interface ListItemProps {
  /** 주 텍스트 (slot `default` 도 가능) */
  title?: string
  /** 보조 설명 (slot `description` 도 가능) */
  description?: string
  /**
   * 클릭 가능 행 (hover 배경 + 우측 chevron 자동).
   * 미지정 시 상위 `<List clickable>` 값을 따른다.
   */
  clickable?: boolean
  /** 추가 클래스 (string | string[]) */
  classNames?: string | string[]
}
