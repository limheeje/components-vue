# Segmented

붙은 세그먼트(회색 트랙 + 흰색 선택 알약) 형태의 단일 선택 컨트롤. Ant Design `Segmented` 에서
착안했습니다. `role="radiogroup"` + 각 항목 `role="radio"`, ←→↑↓ 키보드 이동 지원.
크기(`sm`/`md`/`lg`)는 Input 필드와 동일한 높이·폰트(31 / 40 / 50)로 맞춰져 있습니다.
너비는 내용만큼만 차지하고, `block` 을 주면 부모 폭을 꽉 채우며 항목을 균등 분배합니다.

```vue
<script setup lang="ts">
import {ref} from 'vue'
import Segmented from 'm2m-uiux-vue/Segmented'

const channel = ref('common')
</script>

<template>
  <Segmented
    :options="['공통', 'B2C', 'C2C', 'B2B']"
    :value="channel"
    @change="(value, option) => (channel = value)"
    size="md"
  />
</template>
```

## Props

| Prop           | Type                            | Default   | 설명                                      |
| -------------- | ------------------------------- | --------- | ----------------------------------------- |
| `options`      | `(SegmentedOption \| string)[]` | —         | `{ label, value, disabled? }` 또는 문자열 |
| `value`        | `string`                        | —         | 선택된 값 (제어)                          |
| `defaultValue` | `string`                        | —         | 초기 선택 값 (비제어)                     |
| `name`         | `string`                        | 자동 생성 | HTML name 속성                            |
| `size`         | `'sm' \| 'md' \| 'lg'`          | `'md'`    | 컨트롤 크기 (Input 필드와 동일)           |
| `disabled`     | `boolean`                       | `false`   | 그룹 전체 비활성화                        |
| `block`        | `boolean`                       | `false`   | 부모 너비를 꽉 채우고 균등 분배           |
| `classNames`   | `string \| string[]`            | —         | 추가 클래스                               |

## Events

| Event    | Payload                                    | 설명                         |
| -------- | ------------------------------------------ | ---------------------------- |
| `change` | `(value: string, option: SegmentedOption)` | 선택 변경 — 누른 항목을 감지 |

## 상수

`Segmented.constant.ts` 에서 export: `SEGMENTED_SIZE`, `SEGMENTED_STATE_CLASS`, `SEGMENTED_DEFAULT`.

## Vue 포트 차이

- React `value` → **`v-model`** (`modelValue` + `update:modelValue`, string). 선택된 버튼의 value 가 바인딩됨. 비제어는 `defaultValue`.
- `onChange` → `@change(value, option)` emit 도 병행 (누른 항목 객체 함께 전달).

```vue
<script setup>
import Segmented from 'm2m-uiux-vue/Segmented'
const channel = ref('b2c')
</script>

<template>
  <Segmented :options="['공통', 'B2C', 'B2B']" v-model="channel" />
</template>
```
