/** 항목 상태 */
export const UPLOADED_FILE_STATUS = Object.freeze({
  UPLOADING: 'uploading',
  DONE: 'done',
  ERROR: 'error'
} as const)

/** 상태 modifier 클래스명 (CSS Module 키) */
export const UPLOADED_FILE_LIST_STATE_CLASS = Object.freeze({
  IS_ERROR: 'is-error',
  IS_PREVIEWABLE: 'is-previewable'
} as const)

export const UPLOADED_FILE_LIST_DEFAULT = Object.freeze({
  REMOVABLE: true,
  PREVIEW: true,
  UPLOADING_TEXT: '업로드 중...',
  FAILED_TEXT: '업로드 실패'
} as const)
