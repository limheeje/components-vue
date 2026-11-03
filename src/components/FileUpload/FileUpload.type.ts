import type {FILE_UPLOAD_FILE_STATUS, FILE_UPLOAD_LIST_TYPE} from '~/components/FileUpload/FileUpload.constant'

export type FileUploadListType = (typeof FILE_UPLOAD_LIST_TYPE)[keyof typeof FILE_UPLOAD_LIST_TYPE]
export type FileUploadFileStatus = (typeof FILE_UPLOAD_FILE_STATUS)[keyof typeof FILE_UPLOAD_FILE_STATUS]

/** 내부에서 관리하는 파일 항목 */
export interface FileUploadItem {
  id: number
  file: File
  status: FileUploadFileStatus
  /** listType="picture" 이고 이미지일 때 dataURL */
  preview?: string
  /** 에러 사유 (크기 초과 등) */
  errorMessage?: string
}

export interface FileUploadProps {
  /** input accept 속성. 기본값 `*` */
  accept?: string
  /** 다중 선택 허용 */
  multiple?: boolean
  /** 파일당 최대 크기(byte). 기본값 5MB */
  maxSize?: number
  /** 최대 개수. 기본값 10 */
  maxCount?: number
  /** 비활성화 */
  disabled?: boolean
  /** 드래그 & 드롭 영역 모드 (기본은 버튼 모드) */
  drag?: boolean
  /** 목록 표현. `text`(파일명) | `picture`(썸네일). 기본값 text */
  listType?: FileUploadListType
  /**
   * 선택한 파일 목록(내장 목록) 표시. 기본값 true.
   * `false` 면 파일 선택 UI 만 렌더 — 서버에 올린 뒤의 목록/썸네일은 `UploadedFileList` 로 따로 그린다.
   */
  showList?: boolean
  /** 추가 클래스 (string | string[]) */
  classNames?: string | string[]
}
