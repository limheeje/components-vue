export interface LightboxProps {
  /** 이미지 URL 목록 */
  images: string[]
  /** 현재 표시 중인 인덱스 */
  index: number
  /** 다운로드 버튼 노출. 기본값 true */
  downloadable?: boolean
}
