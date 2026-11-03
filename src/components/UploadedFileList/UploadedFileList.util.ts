import type {UploadedFile} from '~/components/UploadedFileList/UploadedFileList.type'

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg|bmp)(\?|#|$)/i
const ANY_EXT = /\.[a-z0-9]{1,5}(\?|#|$)/i

/**
 * 이미지 여부. type 이 있으면 그것을 따르고, 없으면 url 로 추정한다:
 * 이미지 확장자 · data:image · 썸네일 경로 → 이미지, 이미지 외 확장자 → 파일,
 * 확장자 없는 url(/files/123, 서명 URL 등)은 일단 이미지로 시도하고 로딩 실패 시 아이콘으로 대체.
 */
export function isImageFile(f: UploadedFile): boolean {
  if (f.type) return f.type.startsWith('image/')
  if (f.thumbnailUrl) return true
  if (!f.url) return false
  if (IMAGE_EXT.test(f.url) || f.url.startsWith('data:image/')) return true
  return !ANY_EXT.test(f.url)
}

/** 썸네일 src (이미지가 아니거나 경로가 없으면 undefined → 파일 아이콘) */
export function thumbnailOf(f: UploadedFile): string | undefined {
  if (f.thumbnailUrl) return f.thumbnailUrl
  return f.url && isImageFile(f) ? f.url : undefined
}
