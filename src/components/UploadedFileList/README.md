# UploadedFileList

파일 서버에 올라간 파일의 **목록 / 썸네일** 컴포넌트. 파일 서버가 돌려준 정적 경로(url)를 `v-model` 로 넘기면
그 경로로 썸네일을 그립니다. 파일을 고르는 UI 는 [`FileUpload`](../FileUpload/README.md) 가 따로 담당합니다.

```
FileUpload (파일 선택)  →  @change(File[])  →  서버 업로드  →  응답 url  →  UploadedFileList v-model
```

```vue
<script setup lang="ts">
import {ref} from 'vue'
import FileUpload from 'm2m-uiux-vue/FileUpload'
import UploadedFileList from 'm2m-uiux-vue/UploadedFileList'
import type {UploadedFile} from 'm2m-uiux-vue/UploadedFileList'

const files = ref<UploadedFile[]>([])

async function onPicked(picked: File[]) {
  for (const file of picked) {
    const id = crypto.randomUUID()
    files.value.push({id, name: file.name, size: file.size, status: 'uploading'}) // 업로드 중 표시
    try {
      const body = new FormData()
      body.append('file', file)
      const {url} = await (await fetch('/api/upload', {method: 'POST', body})).json()
      Object.assign(
        files.value.find((f) => f.id === id)!,
        {url, status: 'done'}
      ) // url → 썸네일
    } catch {
      Object.assign(
        files.value.find((f) => f.id === id)!,
        {status: 'error', errorMessage: '업로드 실패'}
      )
    }
  }
}
</script>

<template>
  <FileUpload multiple accept="image/*" :show-list="false" @change="onPicked" />
  <UploadedFileList v-model="files" />
</template>
```

## Props

| Prop         | Type                 | Default | 설명                                                                       |
| ------------ | -------------------- | ------- | -------------------------------------------------------------------------- |
| `modelValue` | `UploadedFile[]`     | `[]`    | 파일 목록. `v-model` — 삭제 시 해당 항목이 빠진 배열이 emit 됩니다         |
| `removable`  | `boolean`            | `true`  | 삭제 버튼 노출 (`false` 면 읽기 전용)                                      |
| `preview`    | `boolean`            | `true`  | 이미지 썸네일 클릭 시 큰 미리보기(`Lightbox`) — 업로드 완료(done) 이미지만 |
| `classNames` | `string \| string[]` | —       | 추가 클래스                                                                |

### `UploadedFile`

| 필드           | Type                               | 설명                                                       |
| -------------- | ---------------------------------- | ---------------------------------------------------------- |
| `id`           | `string \| number`                 | 목록 key (생략하면 `url` → 이름+순번)                      |
| `name`         | `string`                           | 파일명 (필수)                                              |
| `url`          | `string`                           | 서버 정적 경로. 업로드 중이면 생략                         |
| `thumbnailUrl` | `string`                           | 썸네일 전용 경로 (없으면 이미지일 때 `url` 사용)           |
| `size`         | `number`                           | byte — `1.2 MB` 형태로 표시                                |
| `type`         | `string`                           | MIME type. 없으면 url 로 이미지 여부를 추정                |
| `status`       | `'done' \| 'uploading' \| 'error'` | 기본 `done`. `uploading` 은 스피너, `error` 는 빨간 테두리 |
| `errorMessage` | `string`                           | `status='error'` 사유 (없으면 "업로드 실패")               |

이미지 판단: `type` 이 있으면 그것을 따르고, 없으면 이미지 확장자 · `data:image` · `thumbnailUrl` 이면 이미지,
그 외 확장자(`.pdf` 등)는 파일 아이콘, **확장자 없는 url(서명 URL 등)** 은 이미지로 시도하고 로딩에 실패하면 아이콘으로 대체합니다.

## Events

| 이벤트              | 인자                          | 설명                                          |
| ------------------- | ----------------------------- | --------------------------------------------- |
| `update:modelValue` | `UploadedFile[]`              | 삭제로 목록이 바뀔 때 (`v-model`)             |
| `remove`            | `(file: UploadedFile, index)` | 삭제 버튼 클릭 — 서버 삭제 API 는 여기서 호출 |

## 상수 · 유틸

`UPLOADED_FILE_STATUS` · `UPLOADED_FILE_LIST_STATE_CLASS` · `UPLOADED_FILE_LIST_DEFAULT` · `isImageFile(file)` · `thumbnailOf(file)`
