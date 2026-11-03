# Dialog

모달 다이얼로그. **선언형**(`<Dialog open @close>`) + **명령형**(`openDialog` / `confirmDialog` /
`alertDialog`) 두 방식을 모두 제공합니다. Teleport + backdrop + ESC/스크롤 잠금 + 포커스 트랩 내장.
내부 스타일은 Tailwind 없이 `Dialog.module.scss` + `--m2m-*` 토큰.

`variant="drawer"` 로 두면 화면 가장자리(`direction`: top/right/bottom/left)에서 미끄러져 나오는
**드로어**가 됩니다 (nuxt/ui Drawer 참고). 헤더(전체 폭) 또는 grab 핸들을 등장 방향의 반대로
스와이프하면 `cubic-bezier(.22,1,.36,1)` 감속으로 자연스럽게 닫히고, 드래그 진행도에 따라
오버레이가 투명해집니다. `closeThreshold`(패널 길이 대비 이동 거리) 를 못 채운 짧은 드래그라도,
빠르게 내리치듯 스와이프(flick, ≥0.5px/ms)하면 닫힙니다 — 의도적으로 빠르게 내렸는데 임계값
미달로 다시 열리는 답답함을 방지하기 위함입니다.

### 접근성 · 스크롤

- 열리면 포커스가 패널로 이동하고 `Tab` / `Shift+Tab` 이 패널 안에서 순환(포커스 트랩), 닫히면
  열기 직전 요소로 포커스가 복원됩니다.
- 열려 있는 동안 `body` 스크롤이 잠깁니다. 열리기 전에 스크롤바를 먼저 없애고(스크롤바 폭만큼
  `padding-right` 보정) 진입 애니메이션을 시작하므로 패널 폭/높이가 튀지 않습니다. 닫힐 때는
  애니메이션이 끝난 뒤 복원. `:lock-scroll="false"` 로 끌 수 있고, 여러 개가 열려도 잠금이 유지됩니다.

## 선언형

```vue
<script setup lang="ts">
import {ref} from 'vue'
import Dialog from 'm2m-uiux-vue/Dialog'
import Button from 'm2m-uiux-vue/Button'

const open = ref(false)
</script>

<template>
  <Dialog :open="open" title="회원 삭제" description="이 작업은 되돌릴 수 없습니다." size="sm" @close="open = false">
    정말 삭제하시겠어요?
    <template #footer>
      <Button variant="ghost" @click="open = false">취소</Button>
      <Button @click="handleDelete">삭제</Button>
    </template>
  </Dialog>
</template>
```

| Prop              | Type                                     | Default    | 설명                                      |
| ----------------- | ---------------------------------------- | ---------- | ----------------------------------------- |
| `open`            | `boolean`                                | —          | 열림 상태 (제어)                          |
| `title`           | `string`                                 | —          | 헤더 제목 (slot `title` 로도 지정)        |
| `description`     | `string`                                 | —          | 제목 아래 설명 (slot `description`)       |
| `size`            | `'sm' \| 'md' \| 'lg' \| 'full'`         | `'md'`     | 크기 (modal, 또는 drawer left/right 폭)   |
| `variant`         | `'modal' \| 'drawer'`                    | `'modal'`  | 중앙 모달 / 가장자리 드로어               |
| `direction`       | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | 드로어 등장 방향 (drawer)                 |
| `lockScroll`      | `boolean`                                | `true`     | 배경 body 스크롤 잠금                     |
| `handle`          | `boolean`                                | `true`     | 드로어 상단/측면 grab 핸들 (drawer)       |
| `swipeToClose`    | `boolean`                                | `true`     | 헤더/핸들 스와이프로 닫기 (drawer)        |
| `closeThreshold`  | `number`                                 | `0.45`     | 스와이프 닫힘 임계값 (패널 길이 대비 0~1) |
| `closeOnBackdrop` | `boolean`                                | `true`     | 배경 클릭으로 닫기                        |
| `closeOnEsc`      | `boolean`                                | `true`     | ESC 로 닫기                               |
| `hideClose`       | `boolean`                                | `false`    | 우상단 X 숨김                             |
| `ariaLabel`       | `string`                                 | —          | title 이 없을 때 접근성 이름              |
| `classNames`      | `string \| string[]`                     | —          | 추가 클래스                               |

| Emit    | Payload | 설명                           |
| ------- | ------- | ------------------------------ |
| `close` | —       | 닫기 요청 (backdrop · ESC · X) |

| Slot          | 설명                    |
| ------------- | ----------------------- |
| default       | 본문                    |
| `title`       | 헤더 제목 (문자열 대체) |
| `description` | 설명 (문자열 대체)      |
| `footer`      | 하단 버튼 영역          |

```vue
<!-- 아래에서 올라오는 드로어 -->
<Dialog :open="open" variant="drawer" direction="bottom" title="필터" @close="close">…</Dialog>

<!-- 오른쪽에서 나오는 패널, 스와이프 닫기 비활성 -->
<Dialog :open="open" variant="drawer" direction="right" :swipe-to-close="false" @close="close">…</Dialog>
```

## 명령형

앱 최상단에 `<DialogProvider />` 를 1회 배치하면 어디서든 호출할 수 있습니다.

```vue
<template>
  <DialogProvider>
    <App />
  </DialogProvider>
</template>
```

```ts
import {h} from 'vue'
import {openDialog, confirmDialog, alertDialog, closeDialog} from 'm2m-uiux-vue/Dialog'

// 임의 콘텐츠 모달 — id 반환
const id = openDialog({title: '상세', content: h(ProfileCard), size: 'lg'})
closeDialog(id)

// 확인/취소 — Promise<boolean>
if (await confirmDialog({title: '삭제', message: '삭제할까요?', tone: 'danger'})) {
  await remove()
}

// 알림 — Promise<void>
await alertDialog({message: '저장되었습니다.'})
```

| 함수                     | 반환               | 옵션                                                                                                                                              |
| ------------------------ | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `openDialog(options)`    | `number` (id)      | `title` `description` `content` `footer` `size` `variant` `direction` `lockScroll` `handle` `swipeToClose` `closeThreshold` `hideClose` `onClose` |
| `confirmDialog(options)` | `Promise<boolean>` | `title` `message` `confirmText` `cancelText` `tone` `size`                                                                                        |
| `alertDialog(options)`   | `Promise<void>`    | `title` `message` `confirmText` `size`                                                                                                            |
| `closeDialog(id?)`       | `void`             | id 생략 시 가장 위 다이얼로그                                                                                                                     |
| `closeAllDialogs()`      | `void`             | —                                                                                                                                                 |

## 상수

`Dialog.constant.ts`: `DIALOG_SIZE`, `DIALOG_TONE`, `DIALOG_KIND`, `DIALOG_VARIANT`, `DIALOG_DIRECTION`, `DIALOG_DEFAULT`.
