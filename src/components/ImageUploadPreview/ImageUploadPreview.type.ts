/** 내부에서 관리하는 이미지 항목 */
export interface ImageUploadPreviewItem {
  id: number
  file: File
  /** 유효 이미지의 dataURL (에러면 '') */
  dataUrl: string
  /** 에러 사유 (크기 초과 등) */
  errorMessage?: string
}

export interface ImageUploadPreviewProps {
  /** 최대 개수. 기본값 8 */
  maxCount?: number
  /** 파일당 최대 크기(byte). 기본값 5MB */
  maxSize?: number
  /** 그리드 열 수. 기본값 4 */
  cols?: number
  /** 썸네일 한 변 px. 기본값 88 */
  thumbSize?: number
  /** 드래그 & 드롭 영역 모드 */
  drag?: boolean
  /** 리스트형 미리보기 (기본은 그리드) */
  listView?: boolean
  /** 비활성화 — 추가 UI 숨김 */
  disabled?: boolean
  /**
   * 선택한 이미지 목록(내장 썸네일) 표시. 기본값 true.
   * `false` 면 이미지 선택 UI 만 렌더 — 서버에 올린 뒤의 썸네일은 `UploadedFileList` 로 따로 그린다.
   */
  showList?: boolean
  /** 추가 클래스 (string | string[]) */
  classNames?: string | string[]
}
