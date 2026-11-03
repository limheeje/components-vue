# m2m-uiux-vue — 작업 규칙

Vue 3 컴포넌트 npm 패키지. `m2m-uiux-react` (`C:\@project\components-react`, `main` 브랜치 워킹트리
= 최종본) 의 **1:1 Vue 포트**. 배포는 서브패스 export (`m2m-uiux-vue/Button` 등).

> **핵심 원칙**: props · 상수 명칭(`BUTTON_VARIANT` 등) · size · 디자인 토큰(`--m2m-pg-*`) · 데모 탭
> 구성은 React 와 **100% 동일**. React·Vue 둘 다 사용자에게 제공되므로 변수명이 갈리면 안 됨.
> 파일 확장자만 Vue (`.tsx` → `.vue`). 시각 디자인·기능도 React 산출물과 픽셀 단위 동일해야 함.

저장소 = `src/components/*` + `src/demo/*` + `src/lib/cx.ts` + `src/assets/styles/*`.

---

## 1. 폴더 구조 (컴포넌트당) — 파일명 = `<Name>.{확장자}` (React 와 동일, `.vue` 만 예외)

```
src/components/<Name>/
  index.vue            # 본문. <script setup lang="ts">  (React <Name>.tsx 대응)
  <Name>.type.ts       # 모든 타입/인터페이스. import 는 ~/ 절대경로
  <Name>.constant.ts   # 상태·사이즈·기본값 상수 (Object.freeze) — React 에서 그대로 cp
  <Name>.module.scss   # 스타일 — React 에서 바이트 단위 그대로 cp (Tailwind 절대 금지)
  index.ts             # 진입점. 첫 줄 `import '~/assets/styles/tokens.css'` + default/named/type export
  README.md            # React 원문 기반
  <Name>.test.ts       # (아직 미포팅 — 별도 패스)
```

- `.vue` SFC 는 **무조건 `index.vue`**. 서브 SFC 는 `<Name><Sub>.vue` PascalCase
  (예: `AccordionItem.vue`, `GridItem.vue`, `Calendar.vue`, `TimeColumn.vue`, `DialogShell.vue`,
  `FormField.vue`, `DialogProvider.vue`).
- 컴파운드/스토어: `<Name>.context.ts` (`InjectionKey`) / `<Name>.store.ts` (Vue `reactive`) 추가.
- 순수 함수 유틸은 `<Name>.util.ts` (예: `FileUpload.util.ts` 의 `formatFileSize`).

### `index.ts` 템플릿

```ts
import '~/assets/styles/tokens.css'
import Xxx from '~/components/Xxx/index.vue'
export {Xxx}
export default Xxx
export {XXX_VARIANT, XXX_SIZE, XXX_DEFAULT} from '~/components/Xxx/Xxx.constant'
export type {XxxProps} from '~/components/Xxx/Xxx.type'
```

---

## 2. import — 무조건 절대경로 `~/`

`~` = `src/` (vite alias + tsconfig paths). **폴더 내 형제 파일도 `~/components/<Name>/<Name>.type` 로.
`./` `../` 금지.** SCSS 도 `@use '~/assets/styles/theme' as *;`.

빌드된 `.d.ts` 는 `scripts/flatten-dts.mjs` 가 `~/components/<X>/` → `./`(self) 또는 `../<X>/`(other),
`~/lib/` → `../lib/` 로 재작성하고 `import '~/assets/...'` 줄을 제거한다. 소스는 100% 절대, 산출물만 상대.

---

## 3. 디자인 토큰 — `src/assets/styles/tokens.css` 가 단일 소스 (React 에서 그대로 복사)

- 모든 `--m2m-*` 기본값은 손으로 쓴 순수 CSS `src/assets/styles/tokens.css` 소유.
  `:root` + `[data-theme='dark']` + `@media (prefers-color-scheme: dark) { :root:not([data-theme='light']) }`.
  각 컴포넌트 `index.ts` 첫 줄 `import '~/assets/styles/tokens.css'` side-effect → `dist/style.css`.
- SCSS 유틸 `src/assets/styles/`: `_function.scss`(`rem`, `str-replace`) · `_typography.scss`
  (`$font-family`, `$typo-map`) · `_icons.scss`(`icon-map()`) · `_mixin.scss`(`get-background-svg`,
  `typo`, `hidden`, `text-ellipsis`) · `theme.scss`(전부 `@forward`) · `fonts.css`.
- 컴포넌트 스타일은 **`var(--m2m-pg-*)` 직접 참조**. 브랜드 = 오렌지 `--m2m-pg-brand`
  (+`-hover -active -light -sub -border`). 표면 `--m2m-pg-comp-bg{,-subtle,-hover,-disabled}` /
  테두리 `-comp-border{,-sub}` / 텍스트 `-comp-text{,-sub,-muted,-disabled}` /
  상태 `--m2m-pg-success -warning -error -info` (+`-bg -border -dark`).
- `color()` SCSS 함수 / `$palette` / `$semantic` 없음. `rem()` `typo()` `get-background-svg()` +
  `hidden` `text-ellipsis` 믹스인만. **모든 px 는 `rem()`, 폰트는 `@include typo('Scale/Weight')`.**

### 클래스명 — `.bs<컴포넌트><요소>` 리터럴 (난수 해시 없음) — React 와 1:1

- `<Name>.module.scss` 는 **처음부터 최종 이름으로** 작성 (React 에서 바이트 단위 복사):
  루트 = `.bs<Name>`, 하위 요소 = `.bs<Name><Element>` (PascalCase). 가변(modifier/size/variant)
  클래스는 파일 상단 SCSS 변수로 단일 소스화(`$SIZE_MD: 'bsButtonSizeMd'` …), 선택자는 `.#{$SIZE_MD}`.
  `is-` / `has-` / `use-` 접두(kebab·camel 모두)는 `bs` 접두·해시 없이 전역 유지. 아이콘 마스크는 `.i-<key>`.
- `index.vue` (+ 서브 SFC) 는 React `.tsx` 와 동일하게 `styles.bsButton`,
  `styles[\`bsButtonVariant${cap(v)}\`]`, 상태는 `styles[BUTTON_STATE_CLASS.IS_LOADING]`(값`'is-loading'`).
`cap`= 첫글자·하이픈뒤 대문자:`const cap = (s: string) => s.replace(/(^|-)([a-z])/g, (_m, _p, c: string) => c.toUpperCase())`.
- `vite.config.ts` `css.modules.generateScopedName: bsScopedName` — `is-`/`has-`/`use-`·`bs*`·`i-` 통과,
  나머지(fallback)만 `bs<Comp><Pascal>` + 해시 제거. 브라우저 DOM = React 와 동일한 리터럴 클래스명.
- `.constant.ts` (React 원본 그대로): `X_SIZE`, `X_STATE_CLASS`(`is-`/`has-`/`use-` 는 그대로,
  그 외 modifier 값은 `bs<Name><Pascal>`), `X_DEFAULT`. vitest 클래스 단언은 `.toMatch(/bsButtonSizeLg/)` 부분매칭.

---

## 4. 아이콘 — `<Icon>` 컴포넌트 or 빈 `<i>` + 마스크

- 동적: `<Icon name="search" :size="16" color="..." :rotate="90" spin />`. `name` = `ICON_NAME` 별칭
  또는 `icon-map()` 원시 키. `Icon` 이 `@each ... in icon-map()` 로 `.i-<key>` 마스크 클래스 생성.
- 정적(다른 컴포넌트 scss 내부): `@include get-background-svg('icon_x', currentColor)` + `<i>` 에 크기 명시.
- SVG 컴포넌트 안 만든다. 새 아이콘 = `_icons.scss` `icon-map()` 에 한 줄 + (선택) `Icon.constant.ts`
  `ICON_NAME` 에 별칭.

---

## 5. React → Vue 변환 규칙

| React                                                            | Vue                                                                                       |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `forwardRef` + `useImperativeHandle`                             | `defineExpose({el, focus, …})`                                                            |
| `onXxx` 콜백 prop                                                | `emit('xxx', ...)` — 이름 = `on` 뗀 camel (예: `onChange`→`@change`). payload 1:1         |
| `children`                                                       | 기본 slot                                                                                 |
| ReactNode prop (`title`, `icon`, `label`, `footer`, `message` …) | **`string` 으로 좁힘** + 동명 named slot. `icon` 은 아이콘 이름(string)                   |
| `render`/`renderRow`/`cellStyle` 함수 prop (Table 등)            | 함수 prop 유지 (`VNodeChild` 반환), `const Cell = (p) => p.node` 함수형 컴포넌트로 렌더   |
| `value` + `onChange` (controlled)                                | `:value` prop + `@change` emit (또는 `defineModel`). 데모는 React 처럼 수동 제어          |
| `createContext` + `Object.assign(Root, {Item})`                  | `<Name>.context.ts` `InjectionKey` + `index.ts` `Object.assign(RootVue, {Item: ItemVue})` |
| `useSyncExternalStore` 외부 스토어                               | `Dialog.store.ts` / `Toast.store.ts` — Vue `reactive`/`shallowReactive` + Provider SFC    |
| `createPortal(x, document.body)`                                 | `<Teleport to="body">`                                                                    |
| `useId()`                                                        | Vue 3.5 `useId()` from 'vue'                                                              |
| `useEffect(() => { addEventListener; return () => remove }, [])` | `onMounted` + `onBeforeUnmount`, 또는 `watch(open, o => o ? add : remove)`                |

- `defineOptions({inheritAttrs: false})` + 루트 요소에 `v-bind="$attrs"`.
- 컴파운드는 데모에서 `<Form.Field>`, `<Input.Text>` 처럼 멤버 접근 (템플릿에서 동작).

### ⚠️ Vue 포팅 하드런 학습

- **Boolean prop 은 미전달 시 `false`** (React 처럼 `undefined` 아님). `checked?: boolean` 이면
  controlled 판별 불가 → `getCurrentInstance().vnode.props` 에 `'checked' in p` / `'onUpdate:checked' in p`.
  (Switch/Checkbox/Radio). `value?: string` 처럼 non-Boolean 은 `props.value !== undefined` 로 OK.
- 네이티브 input(checkbox/radio/switch): `:checked` 반응형 바인딩 금지 (브라우저와 싸움).
  `onMounted` 에서 `el.checked` 초기화, `watch(() => props.checked)` 로 controlled 동기화.
  `@change` → `emit('update:checked')`. `v-bind="$attrs"` 로 name/value/consumer @change 통과.
- 스크롤 컨테이너 중앙 정렬(TimeColumn) 은 `onMounted(() => nextTick(() => requestAnimationFrame(fn)))`
  — 팝업 `v-if` 마운트 직후엔 `clientHeight` 0.
- Dialog 스토어는 `shallowReactive` — content/footer 가 VNode 라 깊게 반응형화하면 안 됨(+ `markRaw` 는
  `DialogInstance` 타입에서 TS2589 유발). 배열은 항상 재할당.
- **`git checkout <file>` 절대 금지** — staged stub 으로 되돌아가 작업 유실. 되돌릴 땐 수동 편집.

---

## 6. 데모 앱 (`src/demo/`) — React `src/demo/` 와 1:1

`index.html` → `/src/demo/main.ts`. 의존성 없음(state 기반 라우팅). 색은 `--m2m-pg-*`.

- 공용: `src/demo/components/{PageHeader,PropTabs,ComponentSection,CodeBlock,Sidebar}.vue` +
  `navContext.ts` (`DEMO_TAB_KEY: InjectionKey`, `provideDemoTab`, `useDemoTab`).
- `App.vue` — `nav = ref<{key, tab, seq}>`, `provideDemoTab`, Sidebar + topbar + `<component :is="meta.Page">`.
- `src/demo/pages/<Name>Page.vue` (40개) + `pages/index.ts` (`PAGES` 레지스트리 + `NAV_GROUPS` 트리 +
  `groupOf`). 라벨 정합: `Tabs`→"Tab", `Icon`→"SvgIcon", `ProgressBar`+`Steps`→"Progress".
- **데모 탭 구성은 React `src/demo/pages/<Name>Page.tsx` 의 `TABS` 배열과 동일하게.**
- React `PropTabs` render-prop → Vue scoped slot `#default="{tab}"` + `v-if`/`v-else-if`.
- React `ComponentSection` `preview` prop → Vue 기본 slot.
- 데모 코드예시 문자열: `"` → `&quot;`, `'` → `\x27`.
- React `<Live>` 같은 상태 래퍼 → 인라인 `defineComponent` + `h()`, 또는 페이지 최상위 `ref`.

---

## 7. 등록 체크리스트 (새/수정 컴포넌트) — 이미 41개 전부 배선됨

1. `src/components/<Name>/` 파일들 (§1)
2. `vite.config.ts` → `NAMES` 배열 (41개 확정, `EXTERNAL_DEPS` 는 `@unovis/*`·`d3*`)
3. `package.json` → `exports` 에 `./<Name>` (types/import/require) — 43개(41 + style.css + package.json)
4. `tsconfig.build.json` → `include` 는 glob (`src/components/**/*`), 개별 등재 불필요
5. `src/demo/pages/<Name>Page.vue` + `pages/index.ts` `PAGES` + `NAV_GROUPS`
6. 외부 라이브러리: `vite.config.ts` `EXTERNAL_DEPS` + `package.json` `dependencies` 둘 다

---

## 8. 검증

```bash
npm run dev          # 데모 localhost (React 데모와 나란히 비교)
npm run build        # vite build(lib) + vue-tsc -p tsconfig.build.json + flatten-dts.mjs → dist/
npm run build:demo   # 데모 SPA 를 build/ 로 (vite.demo.config.ts) — Vercel 배포용
npm run type-check   # vue-tsc -p tsconfig.build.json --noEmit
npx vitest run       # 166 통과
npx prettier --write "src/**/*.{ts,vue,scss}"   # semi 없음, singleQuote, bracketSpacing 없음, printWidth 120
```

- **데모 배포(Vercel)**: `vite.config.ts`(lib→`dist/`) 와 `vite.demo.config.ts`(데모 SPA→`build/`) 는 별개.
  `bsScopedName`(CSS Module 클래스명 고정)만 `vite.shared.ts` 로 공유. GitLab CI 의 `vercel-release`
  스테이지가 `main` 에서 `npm run build:demo` → `npx vercel deploy build --prod` 로 업로드
  (`VERCEL_TOKEN` CI 변수 필요). `build/` · `.vercel` 는 `.gitignore`. m2m-uiux-react 와 동일 구조.

- 픽셀 비교: 헤드리스 Chrome 스샷. React dev 와 Vue dev 를 같은 컴포넌트/탭으로 놓고 비교.
  App.vue 의 `key: 'Button'` 를 임시로 바꿔 스샷 후 `/tmp` 백업본으로 복원 (git checkout 금지).
- `dist/**/*.d.ts` 에 안 풀린 `~/` 또는 `components/<X>` 크로스레퍼런스 없는지 확인.

---

## 9. 커밋

사용자가 직접 커밋함. 나는 **관련 파일만 `git add`** 하고 상태를 보여준다.
semantic-release(GitLab CI, `main`). `feat:` → minor, `fix:` → patch.
CI test 스테이지가 `npx vitest run` 전체를 돌리므로 커밋 트리에 깨지는 테스트가 없어야 함.

---

## 10. 진행 현황 (2026-09-02)

### 컴포넌트 41/41 완료 🎉

Icon · Grid · Header · Divider · Tabs · Breadcrumb · Button · ButtonGroup · Input(compound) ·
Select · Checkbox · CheckboxGroup · Radio · RadioGroup · Switch · Textarea · SearchField ·
DatePicker · TimePicker · FileUpload · ImageUploadPreview · Form(+Field/Actions) · Badge · Table ·
List · ListItem · Accordion(+Item) · NoData · Timeline · Swiper · Image · ImagePreview · Lightbox ·
Pagination · Chart · Dialog · Toast · Tooltip · Loading · ProgressBar · Steps

- **Chart** = `@unovis/vue` (D3, `dependencies` + `@unovis/ts`). radar 만 자체 SVG (unovis 미지원).
  vite `EXTERNAL_DEPS` 에 `@unovis/*`·`d3*`. line/area/bar/composed/scatter → `VisXYContainer`,
  pie/donut → `VisSingleContainer`+`VisDonut`. recharts 대비 색감·툴팁 디테일은 라이브러리 차이.
- **Toast/Dialog** = `<Name>.store.ts` (Vue reactive) + `<Name>Provider` SFC (`<Teleport>`).
  `showToast`/`addToast`·`openDialog`/`confirmDialog`/`alertDialog` 명령형 export.
- 데모 40 페이지 + Token/SvgIcon 페이지 전부 포팅. `npm run build`(231 modules)·vue-tsc·vitest 통과.
- **테스트 41/41 포팅 완료** (@vue/test-utils, 166 케이스). `vitest.config.ts`: `pool:'forks'` +
  `singleFork:true` (병렬 워커에서 Vue 인스턴스 중복 → `@vue/test-utils` "reading 'config'" 오류 회피),
  `server.deps.inline:['@vue/test-utils']`. Chart 테스트는 `vi.mock('@unovis/vue')` 스텁.
- **테스트로 발견·수정한 버그**: (1) Divider `decorative` Boolean-prop 미전달=false 함정 →
  `vnode.props` 판별 (2) NoData `onRetry` — emit 선언 시 $attrs 에서 빠짐 → `vnode.props`
  (3) Icon `aria-label` — defineProps 매크로가 camelize (`props.ariaLabel`) (4) List `itemClick`
  가드 제거 (5) Input `onSearch` 존재판별 `vnode.props` (6) **Select `multiple` 모드 누락** —
  단일→다중(태그 칩) 전체 재구현, `Select.module.scss` 재복사, SelectPage Multi 탭 복원.

### 클래스명 `.bs<Comp><Element>` 리터럴 전환 완료 (2026-09-03)

- React uncommitted refactor (`.module.scss` 리터럴 `.bsX` + 상단 SCSS 변수, `.tsx` `styles.bsX`,
  `bsScopedName` generateScopedName) 를 Vue 41 컴포넌트 전부에 반영. scss/constant 는 React 워킹트리에서
  복사, `index.vue`(+서브 SFC) 는 `styles.*` 키를 React `.tsx` 와 동일하게 rename + `cap` 헬퍼.
  `vite.config.ts` 에 `bsScopedName` 추가. 브라우저 DOM 클래스명 = React 와 1:1 (`class="bsButton bsButtonVariantPrimary bsButtonSizeMd"`).
- Loading: `type-` 클래스 제거(React 동일). Chart: `.bsChart` 만 React 와 공유(radar/legend 는 unovis 전용 `.bsChartRadar/.bsChartLegend`).
- 테스트 7개 파일 클래스 단언을 `bs*` 리터럴로 갱신. `npm run build`·`vitest`(166)·데모 스샷 전부 통과.

### 남은 마무리

- [ ] 각 컴포넌트 `README.md` 에 Vue `<script setup>` 사용 예시 추가 (현재 React 원문 기반)

### 환경

- 이 머신에 `python` 없음(Windows Store stub). 스크립트는 `node` 로.
- React dev 서버는 사용자가 띄움. 세션에 따라 포트/데모 버전이 다를 수 있으니 소스 파일을 직접 읽어 포팅.
