# ImageUploadPreview

이미지를 업로드하고 그리드·리스트·라이트박스로 미리보기까지 한 컴포넌트에서 처리. 드래그 & 드롭,
크기/개수 제한, 라이트박스(줌·회전·다운로드·키보드 이동)를 지원합니다. 내부 스타일은 Tailwind 없이
`ImageUploadPreview.module.scss` + `Lightbox.module.scss` + `--m2m-*` 토큰, 아이콘은 `Icon`.

```tsx
import ImageUploadPreview from 'm2m-uiux-react/ImageUploadPreview'

;<ImageUploadPreview drag maxCount={6} cols={3} onChange={(files) => setImages(files)} />
```

## Props

| Prop         | Type                                 | Default | 설명                                                                                                                                  |
| ------------ | ------------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `maxCount`   | `number`                             | `8`     | 최대 개수 — 도달 시 추가 UI 숨김                                                                                                      |
| `maxSize`    | `number` (byte)                      | `5MB`   | 파일당 최대 크기 — 초과 시 에러 카드/행                                                                                               |
| `cols`       | `number`                             | `4`     | 그리드 열 수                                                                                                                          |
| `thumbSize`  | `number` (px)                        | `88`    | 썸네일 한 변                                                                                                                          |
| `drag`       | `boolean`                            | `false` | 드래그 & 드롭 영역 모드                                                                                                               |
| `listView`   | `boolean`                            | `false` | 리스트형 미리보기 (기본은 그리드)                                                                                                     |
| `disabled`   | `boolean`                            | `false` | 추가 UI 숨김                                                                                                                          |
| `showList`   | `boolean`                            | `true`  | `false` 면 이미지 선택 UI 만 렌더 (내장 썸네일 없음) — 서버 업로드 후 썸네일은 [`UploadedFileList`](../UploadedFileList/README.md) 로 |
| `onReject`   | `(items: {file, message}[]) => void` | —       | `showList=false` 일 때 크기·개수 검증에 걸려 제외된 파일                                                                              |
| `onChange`   | `(files: File[]) => void`            | —       | 유효한 이미지 목록이 바뀔 때                                                                                                          |
| `classNames` | `string \| string[]`                 | —       | 추가 클래스                                                                                                                           |

`ref` 는 루트 `<div>` 로 전달됩니다. `Lightbox` 도 단독 export 합니다.

## 상수

`ImageUploadPreview.constant.ts`: `IMAGE_UPLOAD_PREVIEW_STATE_CLASS`,
`IMAGE_UPLOAD_PREVIEW_DEFAULT`.

## 서버 업로드 후 썸네일 (`showList=false`)

`showList=false` 인 ImageUploadPreview 는 상태(썸네일)를 갖지 않는 순수 이미지 선택 UI 입니다.

```vue
<ImageUploadPreview :show-list="false" @change="onPicked" @reject="onReject" />
<UploadedFileList v-model="files" />
```

- `change(File[])` — 누적 목록이 아니라 **이번에 고른 유효 이미지**만 전달합니다 (그대로 서버에 업로드).
- 서버가 돌려준 url 은 [`UploadedFileList`](../UploadedFileList/README.md) 의 `v-model` 에 넣으면 그 경로로 썸네일이 표시됩니다.
- 크기·개수 검증에 걸린 파일은 `reject` 로 전달합니다. `0/max` 표시는 숨겨지므로 전체 개수 제한은 사용처에서 처리하세요.
