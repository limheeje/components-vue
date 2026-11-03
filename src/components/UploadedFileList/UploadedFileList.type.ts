import type {UPLOADED_FILE_STATUS} from '~/components/UploadedFileList/UploadedFileList.constant'

export type UploadedFileStatus = (typeof UPLOADED_FILE_STATUS)[keyof typeof UPLOADED_FILE_STATUS]

/** 파일 서버에 올린 뒤 받은 정보 1건. 썸네일은 `url`(또는 `thumbnailUrl`)로 표시된다 */
export interface UploadedFile {
  /** 목록 key (생략하면 url / 순번) */
  id?: string | number
  name: string
  /** 파일 서버의 정적 경로. 업로드 중이면 생략 */
  url?: string
  /** 썸네일 전용 경로 (없으면 이미지일 때 `url` 사용) */
  thumbnailUrl?: string
  /** byte */
  size?: number
  /** MIME type. 없으면 url 로 이미지 여부를 추정 */
  type?: string
  /** 기본값 done. uploading 이면 스피너, error 면 errorMessage 표시 */
  status?: UploadedFileStatus
  /** status=error 일 때 사유 */
  errorMessage?: string
}

export interface UploadedFileListProps {
  /** 파일 목록. `v-model` — 삭제 시 해당 항목이 빠진 배열이 emit 된다 */
  modelValue?: UploadedFile[]
  /** 삭제 버튼 노출. 기본값 true */
  removable?: boolean
  /** 이미지 썸네일 클릭 시 큰 미리보기(Lightbox). 기본값 true */
  preview?: boolean
  /** 추가 클래스 (string | string[]) */
  classNames?: string | string[]
}
