# Cascader

계층형 데이터(시/도 → 시/군/구 …)를 단계별 메뉴로 선택하는 드롭다운. [Element Cascader](https://element.eleme.io/#/en-US/component/cascader)
의 기능(클릭/hover 펼침 · 비활성 · 지우기 · 다중 선택 · 태그 접기 · 아무 레벨 선택 · 동적 로딩 · 검색 · 노드 slot · 단독 패널)을 모두 지원합니다.
스타일은 `Cascader.module.scss` + `--m2m-*` 토큰으로만 구성됩니다.

```vue
<script setup lang="ts">
import {ref} from 'vue'
import Cascader from 'm2m-uiux-vue/Cascader'

const options = [
  {
    value: 'seoul',
    label: '서울',
    children: [
      {value: 'gangnam', label: '강남구'},
      {value: 'seocho', label: '서초구', disabled: true}
    ]
  },
  {value: 'jeju', label: '제주'}
]
const value = ref<string[]>([])
</script>

<template>
  <Cascader v-model="value" :options="options" clearable />
</template>
```

## Props

| Prop            | Type                              | Default          | 설명                                                   |
| --------------- | --------------------------------- | ---------------- | ------------------------------------------------------ |
| `options`       | `CascaderOption[]`                | —                | 옵션 트리 (`lazy` 면 생략 가능)                        |
| `config`        | `CascaderConfig`                  | `{}`             | 동작 설정 (아래 표)                                    |
| `modelValue`    | `CascaderModelValue`              | —                | 제어 값. `v-model`                                     |
| `defaultValue`  | `CascaderModelValue`              | —                | 비제어 초기값                                          |
| `placeholder`   | `string`                          | `'선택해주세요'` | 미선택 안내 문구                                       |
| `size`          | `'sm' \| 'md' \| 'lg'`            | `'md'`           | 크기 (`CASCADER_SIZE`)                                 |
| `disabled`      | `boolean`                         | `false`          | 비활성                                                 |
| `clearable`     | `boolean`                         | `false`          | 값이 있을 때 hover 시 지우기 아이콘                    |
| `showAllLevels` | `boolean`                         | `true`           | `false` 면 마지막 레벨 라벨만 표시 (태그 포함)         |
| `collapseTags`  | `boolean`                         | `false`          | 다중 선택 태그를 첫 개 + `+ N` 으로 접기               |
| `separator`     | `string`                          | `' / '`          | 레벨 구분자                                            |
| `filterable`    | `boolean`                         | `false`          | 옵션 검색                                              |
| `filterMethod`  | `(node, keyword) => boolean`      | —                | 커스텀 검색 (true 면 매치)                             |
| `debounce`      | `number`                          | `300`            | 입력 후 검색까지 지연(ms)                              |
| `beforeFilter`  | `(keyword) => boolean \| Promise` | —                | 검색 직전 훅. `false`/reject 면 검색 취소              |
| `error`         | `boolean \| string`               | `false`          | 에러 상태. 문자열이면 하단 메시지                      |
| `helperText`    | `string`                          | —                | 보조 안내 (`error` 없을 때). slot `helperText` 도 가능 |
| `name`          | `string`                          | —                | form 연동용 hidden input (선택된 노드의 `value`)       |
| `classNames`    | `string \| string[]`              | —                | 추가 클래스                                            |

### `config`

| 키              | Type                      | Default      | 설명                                                             |
| --------------- | ------------------------- | ------------ | ---------------------------------------------------------------- |
| `expandTrigger` | `'click' \| 'hover'`      | `'click'`    | 하위 메뉴 펼침 방식 (`CASCADER_EXPAND_TRIGGER`)                  |
| `multiple`      | `boolean`                 | `false`      | 다중 선택                                                        |
| `checkStrictly` | `boolean`                 | `false`      | 부모/자식 독립 — 아무 레벨이나 선택 (단일은 라디오, 다중은 체크) |
| `emitPath`      | `boolean`                 | `true`       | `false` 면 경로 대신 마지막 `value` 만 사용                      |
| `lazy`          | `boolean`                 | `false`      | 동적 로딩 (`lazyLoad` 필요)                                      |
| `lazyLoad`      | `(node, resolve) => void` | —            | `resolve(children)` 로 하위 전달. 빈 값이면 leaf 처리            |
| `value`         | `string`                  | `'value'`    | 값 키 이름                                                       |
| `label`         | `string`                  | `'label'`    | 라벨 키 이름                                                     |
| `children`      | `string`                  | `'children'` | 하위 키 이름                                                     |
| `disabled`      | `string`                  | `'disabled'` | 비활성 키 이름                                                   |
| `leaf`          | `string`                  | `'leaf'`     | leaf 여부 키 이름                                                |

> `config` 를 템플릿에서 인라인 객체로 넘겨도 트리는 다시 만들어지지 않습니다 (구조에 영향을 주는 키만 감시).
> `options` 는 한 번 정의한 상수/ref 를 넘기세요.

### 값(`v-model`) 형태

| `multiple` | `emitPath` | 값                                   |
| ---------- | ---------- | ------------------------------------ |
| `false`    | `true`     | `['gyeonggi', 'suwon', 'yeongtong']` |
| `true`     | `true`     | `[['seoul', 'gangnam'], ['jeju']]`   |
| `false`    | `false`    | `'yeongtong'`                        |
| `true`     | `false`    | `['gangnam', 'haeundae']`            |

비어 있을 때는 `[]` (emitPath) / `''` (단일 · emitPath=false). 다중 + 일반(`checkStrictly=false`) 모드는 **leaf 경로만** emit 합니다.
부모를 체크하면 비활성이 아닌 하위 leaf 전체가 선택·해제되고, 일부만 선택되면 반선택(−)으로 표시됩니다.

## Events

| 이벤트              | 인자                               | 설명                                         |
| ------------------- | ---------------------------------- | -------------------------------------------- |
| `update:modelValue` | `CascaderModelValue`               | `v-model`                                    |
| `change`            | `CascaderModelValue`               | 값이 바뀔 때                                 |
| `expand-change`     | `CascaderValue[]`                  | 펼쳐진 노드가 바뀔 때 (루트→노드 value 경로) |
| `visible-change`    | `boolean`                          | 드롭다운 열림/닫힘                           |
| `remove-tag`        | `CascaderValue \| CascaderValue[]` | 다중 선택에서 태그가 제거될 때 (제거된 값)   |
| `focus` / `blur`    | `FocusEvent`                       | 컴포넌트 포커스 진입/이탈                    |

## Slots

| slot         | 파라미터       | 설명                                 |
| ------------ | -------------- | ------------------------------------ |
| `default`    | `{node, data}` | 각 노드(메뉴 항목) 내용 커스터마이징 |
| `empty`      | —              | 옵션/검색 결과가 없을 때 내용        |
| `helperText` | —              | 보조 안내 문구                       |

## Expose

| 메서드                      | 설명                                                                            |
| --------------------------- | ------------------------------------------------------------------------------- |
| `getCheckedNodes(leafOnly)` | 선택된 노드 배열. 다중 일반 모드는 모두 선택된 부모도 포함 (`leafOnly` 로 제외) |
| `focus()` / `blur()`        | 포커스 제어                                                                     |

`CascaderNode` — `{uid, data, value, label, level, parent, children, disabled, leaf, loaded, loading, pathValues, pathLabels}`

## 키보드

`Enter` / `Space` / `↓` 열기, `Esc` / `Tab` 닫기, `↑` `↓` 같은 메뉴 항목 이동, `→` 하위 메뉴로 진입,
`←` 상위로 이동, `Enter` 선택(다중은 토글, 부모는 펼치기), `Space` 체크박스 토글, `Backspace` 마지막 태그 제거(검색 입력이 비었을 때).

## CascaderPanel

드롭다운 없이 패널만 단독으로 쓰는 컴포넌트. `options` · `config` · `v-model` · `default-value` · `class-names` ·
`default` / `empty` slot · `expand-change` 이벤트 · `getCheckedNodes()` 를 `Cascader` 와 동일하게 지원합니다.

```vue
<script setup lang="ts">
import {CascaderPanel} from 'm2m-uiux-vue/Cascader'
</script>

<template>
  <CascaderPanel v-model="value" :options="options" :config="{multiple: true}" />
</template>
```

## 상수

`CASCADER_SIZE` · `CASCADER_EXPAND_TRIGGER` · `CASCADER_STATE_CLASS` · `CASCADER_CONFIG_DEFAULT` · `CASCADER_DEFAULT`
