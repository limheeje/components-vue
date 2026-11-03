# Accordion

접기/펼치기 컴포넌트 (compound). `src/pages/AccordionPage.tsx` 원본 API 를 따릅니다.
`<Accordion>` + `<Accordion.Item>` 조합, `single` / `multiple` 모드.
내부 스타일은 Tailwind 없이 `Accordion.module.scss` + `--m2m-*` 토큰으로만 구성됩니다.

```tsx
import Accordion from 'm2m-uiux-react/Accordion';

<Accordion type="single" defaultValue="item-1">
  <Accordion.Item value="item-1" title="항목 1">내부 콘텐츠</Accordion.Item>
  <Accordion.Item value="item-2" title="항목 2" disabled>내부 콘텐츠</Accordion.Item>
</Accordion>

// 제어
<Accordion type="single" value={openItem} onValueChange={(v) => setOpenItem(v)}>
  …
</Accordion>
```

> **Vue 포트**: `value` · `defaultValue` 를 없애고 **`v-model` 로만 제어**합니다 (아래 참고).

## `Accordion` Props

| Prop            | Type                                  | Default    | 설명                                                     |
| --------------- | ------------------------------------- | ---------- | -------------------------------------------------------- |
| `type`          | `'single' \| 'multiple'`              | `'single'` | single 은 하나만 열림                                    |
| `defaultValue`  | `string \| string[]`                  | —          | 비제어 초기 열림값 (single: string / multiple: string[]) |
| `value`         | `string \| string[]`                  | —          | 제어 열림값                                              |
| `onValueChange` | `(value: string \| string[]) => void` | —          | 변경 콜백 (single: string / multiple: string[])          |
| `classNames`    | `string \| string[]`                  | —          | 추가 클래스                                              |

## `Accordion.Item` Props

| Prop         | Type                 | Default | 설명                  |
| ------------ | -------------------- | ------- | --------------------- |
| `value`      | `string`             | —       | 항목 식별자 (필수)    |
| `title`      | `ReactNode`          | —       | 헤더 제목 (필수)      |
| `disabled`   | `boolean`            | `false` | 비활성                |
| `classNames` | `string \| string[]` | —       | 항목 래퍼 추가 클래스 |

## 상수

`Accordion.constant.ts` 에서 export: `ACCORDION_TYPE`, `ACCORDION_STATE_CLASS`, `ACCORDION_DEFAULT`.

## Vue 포트 차이

- `value` · `defaultValue` prop **제거**. **`v-model` 로만 제어** (`modelValue` + `update:modelValue`).
  - `type="single"` → `v-model` 값 타입 **`string`** (`''` = 전부 닫힘)
  - `type="multiple"` → 값 타입 **`string[]`**
- 클릭으로 열고 닫으면 `v-model` 값이 양방향 갱신됨. `onValueChange` → `@value-change` emit 도 병행.
- v-model 을 안 걸면 내부 상태(빈 배열 시작)로 동작.

```vue
<script setup>
import Accordion from 'm2m-uiux-vue/Accordion'
const open = ref('') // single
const openItems = ref(['item-1']) // multiple
</script>

<template>
  <Accordion type="single" v-model="open">
    <Accordion.Item value="item-1" title="항목 1">내부 콘텐츠</Accordion.Item>
    <Accordion.Item value="item-2" title="항목 2">내부 콘텐츠</Accordion.Item>
  </Accordion>

  <Accordion type="multiple" v-model="openItems">
    <Accordion.Item value="item-1" title="A">…</Accordion.Item>
  </Accordion>
</template>
```
