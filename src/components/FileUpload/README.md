# FileUpload

파일을 버튼 클릭 또는 드래그 & 드롭으로 선택하고, 확장자·크기·개수 제한과 함께 목록을 관리하는
컴포넌트. 내부 스타일은 Tailwind 없이 `FileUpload.module.scss` + `--m2m-*` 토큰, 아이콘은 `Icon`.

```tsx
import FileUpload from 'm2m-uiux-react/FileUpload'

;<FileUpload
  multiple
  maxCount={5}
  maxSize={10 * 1024 * 1024}
  accept="image/*"
  listType="picture"
  onChange={(files) => setFiles(files)}
/>
```

## Props

| Prop         | Type                                 | Default  | 설명                                                                                                                                   |
| ------------ | ------------------------------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `accept`     | `string`                             | `'*'`    | `<input accept>` 값                                                                                                                    |
| `multiple`   | `boolean`                            | `false`  | 다중 선택 (false 면 새 파일이 이전 파일 교체)                                                                                          |
| `maxSize`    | `number` (byte)                      | `5MB`    | 파일당 최대 크기 — 초과 시 목록에 에러 항목으로 표시                                                                                   |
| `maxCount`   | `number`                             | `10`     | 최대 개수 — 도달 시 버튼 비활성화                                                                                                      |
| `disabled`   | `boolean`                            | `false`  | 전체 비활성화                                                                                                                          |
| `drag`       | `boolean`                            | `false`  | 드래그 & 드롭 영역 모드 (기본은 버튼 모드)                                                                                             |
| `listType`   | `'text' \| 'picture'`                | `'text'` | `picture` 는 이미지 파일을 36×36 썸네일로 표시                                                                                         |
| `showList`   | `boolean`                            | `true`   | `false` 면 파일 선택 UI 만 렌더 (내장 목록 없음) — 서버 업로드 후 목록/썸네일은 [`UploadedFileList`](../UploadedFileList/README.md) 로 |
| `onChange`   | `(files: File[]) => void`            | —        | 유효한 파일 목록이 바뀔 때                                                                                                             |
| `onUpload`   | `(files: File[]) => void`            | —        | 파일이 새로 선택될 때 원본 목록                                                                                                        |
| `onReject`   | `(items: {file, message}[]) => void` | —        | `showList=false` 일 때 크기·개수 검증에 걸려 제외된 파일                                                                               |
| `classNames` | `string \| string[]`                 | —        | 추가 클래스                                                                                                                            |

`ref` 는 루트 `<div>` 로 전달됩니다. `formatFileSize(bytes)` 헬퍼도 export 합니다.

## 상수

`FileUpload.constant.ts`: `FILE_UPLOAD_LIST_TYPE`, `FILE_UPLOAD_FILE_STATUS`,
`FILE_UPLOAD_STATE_CLASS`, `FILE_UPLOAD_DEFAULT`.

## 선택 UI 만 쓰기 (`showList=false`) + 서버 업로드

서버에 올린 뒤의 정적 경로 썸네일은 [`UploadedFileList`](../UploadedFileList/README.md) 가 담당합니다.
`showList=false` 인 FileUpload 는 상태(목록)를 갖지 않는 순수 선택 UI 로 동작합니다.

```vue
<FileUpload multiple accept="image/*" :show-list="false" @change="onPicked" @reject="onReject" />
<UploadedFileList v-model="files" />
```

- `change(File[])` — 누적 목록이 아니라 **이번에 고른 유효 파일**만 전달합니다 (그대로 서버에 업로드).
- 크기(`maxSize`)·개수(`maxCount` = 한 번에 고르는 최대 수) 검증에 걸린 파일은 `reject` 로 전달합니다.
- 버튼의 `(n/max)` 표시는 숨겨집니다. 전체 개수 제한은 사용처에서 `disabled` 로 처리하세요.
