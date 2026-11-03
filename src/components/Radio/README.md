# Radio

네이티브 `<input type="radio">` 기반 공통 라디오. 같은 `name` 을 공유하는 여러 개로 그룹을 구성합니다.
내부 스타일은 Tailwind 없이 `Radio.module.scss` + `--m2m-*` 토큰으로만 구성됩니다.

```tsx
import Radio from 'm2m-uiux-react/Radio'

{
  options.map((o) => (
    <Radio
      key={o.value}
      name="pay"
      value={o.value}
      label={o.label}
      checked={value === o.value}
      onChange={(e) => setValue(e.target.value)}
    />
  ))
}
```

## Props

| Prop    | Type                   | Default | 설명                   |
| ------- | ---------------------- | ------- | ---------------------- |
| `label` | `ReactNode`            | —       | 라벨 텍스트/노드       |
| `size`  | `'sm' \| 'md' \| 'lg'` | `'md'`  | 크기                   |
| `error` | `boolean`              | `false` | 에러(유효성 실패) 상태 |

그 외 `<input>` 의 표준 속성(`checked`, `defaultChecked`, `disabled`, `name`, `value`, `onChange` …)을 전달할 수 있습니다.
`ref` 는 `<input>` 엘리먼트로 전달됩니다.

## 상수

`Radio.constant.ts` 에서 export: `RADIO_SIZE`, `RADIO_STATE_CLASS`(`{ IS_CHECKED, IS_DISABLED, IS_ERROR }`), `RADIO_DEFAULT`.

## Vue 포트 차이

- **`v-model`** = 그룹 선택값(string). 각 `<Radio>` 의 `value` prop 과 일치하면 선택됨. 클릭 시 `update:modelValue` 로 자기 `value` 를 emit.
- `v-model:checked` (boolean) 도 병행 지원.
- `onChange` → `@change`, `onInput` → `@input` — **네이티브 이벤트(`e`) 를 그대로 전달**.

```vue
<script setup>
import Radio from 'm2m-uiux-vue/Radio'
const value = ref('a')
</script>

<template>
  <Radio name="opt" v-model="value" value="a" label="선택됨" />
  <Radio name="opt" v-model="value" value="b" label="미선택" />
</template>
```
