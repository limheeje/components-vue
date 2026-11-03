import {ref} from 'vue'

import {UPLOADED_FILE_STATUS} from '~/components/UploadedFileList'
import type {UploadedFile} from '~/components/UploadedFileList'

/**
 * serverUpload 데모 공용 — 파일 서버가 없으므로 1.2초 뒤 blob URL 을 "서버 정적 경로" 대신 돌려준다.
 * 실제로는 FormData 로 업로드하고 응답의 url 을 resolve 하면 된다. (파일명에 fail 이 들어가면 실패)
 */
export const fakeUpload = (file: File) =>
  new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      if (file.name.toLowerCase().includes('fail')) reject(new Error('서버 오류 (500)'))
      else resolve(URL.createObjectURL(file))
    }, 1200)
  })

/** 선택 UI 의 change(File[]) → 서버 업로드 → 응답 url 을 UploadedFileList v-model 항목에 반영 */
export function useServerUpload() {
  const files = ref<UploadedFile[]>([])
  const rejectLog = ref('')
  let seq = 0

  const patch = (id: string, next: Partial<UploadedFile>) =>
    (files.value = files.value.map((f) => (f.id === id ? {...f, ...next} : f)))

  async function onPicked(picked: File[]) {
    await Promise.all(
      picked.map(async (file) => {
        const id = `up-${++seq}`
        // 1) 선택 즉시 "업로드 중" 항목으로 추가
        files.value = [
          ...files.value,
          {id, name: file.name, size: file.size, type: file.type, status: UPLOADED_FILE_STATUS.UPLOADING}
        ]
        try {
          // 2) 서버에 올리고 응답 url 을 받아
          const url = await fakeUpload(file)
          // 3) 항목에 url 을 채우면 그 경로로 썸네일이 표시된다
          patch(id, {url, status: UPLOADED_FILE_STATUS.DONE})
        } catch (e) {
          patch(id, {status: UPLOADED_FILE_STATUS.ERROR, errorMessage: e instanceof Error ? e.message : '업로드 실패'})
        }
      })
    )
  }

  const onReject = (items: {file: File; message: string}[]) =>
    (rejectLog.value = items.map((x) => `${x.file.name}: ${x.message}`).join(' / '))

  return {files, rejectLog, onPicked, onReject}
}

/** 이미 서버에 있는 파일(정적 경로) 샘플 — SVG data URI 로 대체 */
const swatch = (color: string, text: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320"><rect width="320" height="320" fill="${color}"/><text x="160" y="180" font-size="72" text-anchor="middle" fill="#fff">${text}</text></svg>`
  )}`

export const savedSample = (): UploadedFile[] => [
  {name: 'banner.png', url: swatch('#f97316', 'A'), size: 183_000},
  {name: 'logo.png', url: swatch('#3b82f6', 'B'), size: 52_300}
]
