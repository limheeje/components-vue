<script setup lang="ts">
import {computed, defineComponent, h, ref} from 'vue'
import type {CSSProperties} from 'vue'

import Icon, {ICON_NAME} from '~/components/Icon'
import Select from '~/components/Select'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['gallery', 'playground', 'named', 'color', 'size', 'rotate', 'register', 'props']

/** 친숙한 별칭 → icon-map 키 */
const ENTRIES = Object.entries(ICON_NAME) as [string, string][]
const NAMES = ENTRIES.map(([alias]) => alias)
const NAME_OPTIONS = NAMES.map((n) => ({label: n, value: n}))

/** 아이템마다 임의 색을 순환 배정 — color prop 효과를 눈으로 보게 */
const PALETTE = [
  'var(--m2m-pg-brand)',
  '#6366f1',
  'var(--m2m-pg-success)',
  'var(--m2m-pg-warning)',
  'var(--m2m-pg-error)',
  '#06b6d4',
  '#8b5cf6',
  'var(--m2m-pg-comp-text-muted)'
]
const colorAt = (i: number) => PALETTE[i % PALETTE.length]

/** 아이콘을 감싸는 네모 박스 배경 */
const BOX_BG = 'var(--m2m-pg-comp-bg-subtle)'

const CODE_PRE: CSSProperties = {
  margin: '0',
  padding: '12px 14px',
  background: '#14213d',
  borderRadius: '8px',
  fontSize: '11px',
  lineHeight: '1.7',
  color: '#e6ebf8',
  fontFamily: "'Fira Mono', 'Consolas', monospace",
  whiteSpace: 'pre',
  overflowX: 'auto'
}
const CODE_PRE_LG: CSSProperties = {
  ...CODE_PRE,
  flex: '1',
  minWidth: '200px',
  fontSize: '12px',
  borderRadius: '10px',
  padding: '14px 16px'
}

/* ── 인라인 코드 칩 ── */
const Code = defineComponent({
  name: 'IcCode',
  setup:
    (_, {slots}) =>
    () =>
      h(
        'code',
        {
          style: {
            fontFamily: "'Fira Mono', 'Consolas', monospace",
            fontSize: '12px',
            padding: '1px 6px',
            borderRadius: '4px',
            background: BOX_BG,
            border: '1px solid var(--m2m-pg-comp-border)',
            color: 'var(--m2m-pg-brand)'
          }
        },
        slots.default?.()
      )
})

/* ═══════════════════════ gallery ═══════════════════════ */
const copied = ref<string | null>(null)
const hover = ref<string | null>(null)
function copyName(name: string) {
  navigator.clipboard?.writeText(`<Icon name="${name}" />`).catch(() => {})
  copied.value = name
  setTimeout(() => (copied.value = null), 1200)
}
function galleryCard(on: boolean): CSSProperties {
  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '7px',
    padding: '14px 8px 10px',
    border: `1px solid ${on ? 'var(--m2m-pg-brand)' : 'var(--m2m-pg-comp-border)'}`,
    borderRadius: '10px',
    background: on ? 'var(--m2m-pg-brand-light)' : 'var(--m2m-pg-comp-bg)',
    cursor: 'pointer',
    transition: 'border-color 0.15s, background 0.15s'
  }
}

/* ═══════════════════════ playground ═══════════════════════ */
const pgName = ref('search')
const pgColor = ref('#023894')
const pgSize = ref(32)
const pgRotate = ref(0)

const pgCode = computed(
  () => `<Icon
  name="${pgName.value}"
  color="${pgColor.value}"
  size={${pgSize.value}}
  rotate={${pgRotate.value}}
/>`
)
const pickerColor = computed(() => (/^#[0-9a-f]{6}$/i.test(pgColor.value) ? pgColor.value : '#023894'))

const ctrlLabel: CSSProperties = {fontSize: '11px', fontWeight: '600', color: 'var(--m2m-pg-comp-text-sub)'}
const rangeInput: CSSProperties = {accentColor: 'var(--m2m-pg-brand)', cursor: 'pointer'}

/* ═══════════════════════ color ═══════════════════════ */
const COLOR_SWATCHES: [string, string][] = [
  ['Brand', '#023894'],
  ['Indigo', '#6366f1'],
  ['Green', '#16a34a'],
  ['Amber', '#f59e0b'],
  ['Red', '#ef4444'],
  ['Cyan', '#06b6d4'],
  ['Gray', '#667089'],
  ['Ink', '#14213d']
]

/* ═══════════════════════ size ═══════════════════════ */
const SIZES = [12, 16, 20, 24, 32, 40, 48]

/* ═══════════════════════ rotate ═══════════════════════ */
const ROTATES = [0, 45, 90, 135, 180, 225, 270, 315]

/* ═══════════════════════ props ═══════════════════════ */
const PROPS: [string, string, string, string][] = [
  ['name', 'string', '—', 'ICON_NAME 별칭 또는 icon-map 원시 키'],
  ['color', 'string', "'currentColor'", 'CSS color 값 (마스크 background-color 로 적용)'],
  ['size', 'number | string', '24', 'width = height'],
  ['rotate', 'number', '0', '회전 각도(deg). spin 이 true 면 무시'],
  ['spin', 'boolean', 'false', '무한 회전 애니메이션'],
  ['@click', '(e: MouseEvent) => void', '—', '있으면 role="button" + cursor:pointer'],
  ['aria-label', 'string', '—', '있으면 role="img", 없으면 aria-hidden'],
  ['classNames', 'string | string[]', '—', '추가 클래스']
]

const thStyle: CSSProperties = {
  padding: '10px 14px',
  textAlign: 'left',
  whiteSpace: 'nowrap',
  fontWeight: '700',
  color: 'var(--m2m-pg-comp-text-sub)'
}
const tdStyle: CSSProperties = {padding: '9px 14px'}

/* ── register: Step 원형 배지 ── */
const Step = defineComponent({
  name: 'IcStep',
  props: {
    n: {type: String, required: true},
    tone: {type: String as () => 'brand' | 'ok', default: 'brand'}
  },
  setup:
    (p, {slots}) =>
    () =>
      h('div', {style: {display: 'flex', gap: '16px'}}, [
        h(
          'div',
          {
            style: {
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              flexShrink: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: '800',
              color: '#fff',
              background: p.tone === 'ok' ? 'var(--m2m-pg-success)' : 'var(--m2m-pg-brand)'
            }
          },
          p.n
        ),
        h('div', {style: {flex: '1', minWidth: '0'}}, [
          h(
            'div',
            {style: {fontSize: '13px', fontWeight: '700', color: 'var(--m2m-pg-comp-text)', marginBottom: '6px'}},
            slots.title?.()
          ),
          slots.default?.()
        ])
      ])
})

const stepP: CSSProperties = {
  fontSize: '12px',
  color: 'var(--m2m-pg-comp-text-sub)',
  margin: '0 0 8px',
  lineHeight: '1.7'
}
const hr: CSSProperties = {height: '1px', background: 'var(--m2m-pg-comp-border)'}

const REG_1 = `// icon-map() 맵에 항목 추가
'icon_star_line':
  '<svg viewBox="0 0 24 24" ...><path d="..."/></svg>',`
const REG_2 = `@each $key, $svg in icon-map() {
  .i-#{$key} {
    @include get-background-svg('#{$key}', currentColor);
  }
}`
const REG_3 = `export const ICON_NAME = Object.freeze({
  // …
  star: 'icon_star_line',
} as const)`
const REG_4 = `<Icon name="icon_star_line" />   // 원시 키
<Icon name="star" />             // 별칭 등록 시`
</script>

<template>
  <div>
    <PageHeader
      title="SvgIcon"
      component="Icon"
      desc="— 빈 <i> + CSS 마스크로 렌더하는 단일 아이콘 컴포넌트. name / color / size / rotate / spin 지원."
    />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <!-- ─────────── gallery ─────────── -->
        <ComponentSection
          v-if="tab === 'gallery'"
          :title="`아이콘 갤러리 — ${NAMES.length}개 별칭`"
          description='카드 클릭 시 <Icon name="..." /> 코드 복사'
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Icon from \x27m2m-uiux-vue/Icon\x27',
            '</script>',
            '',
            '<template>',
            '  <Icon name=&quot;search&quot; />',
            '  <Icon name=&quot;check-circle&quot; />',
            '  <Icon name=&quot;chevron-down&quot; />',
            '</template>'
          ]"
          :notes="[
            '친숙한 별칭(ICON_NAME) 또는 icon-map 원시 키를 name 으로 전달',
            '호버 시 브랜드 테두리 + 색상 변경으로 선택 상태 표시'
          ]"
        >
          <div
            style="display: grid; grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 8px; width: 100%"
          >
            <button
              v-for="name in NAMES"
              :key="name"
              type="button"
              :title="`name=&quot;${name}&quot; — 클릭하여 복사`"
              :style="galleryCard(hover === name)"
              @click="copyName(name)"
              @mouseenter="hover = name"
              @mouseleave="hover = null"
            >
              <Icon
                :name="copied === name ? 'check' : name"
                :size="20"
                :color="
                  copied === name
                    ? 'var(--m2m-pg-success)'
                    : hover === name
                      ? 'var(--m2m-pg-brand)'
                      : 'var(--m2m-pg-comp-text-sub)'
                "
              />
              <code
                :style="{
                  fontSize: '10px',
                  wordBreak: 'break-all',
                  textAlign: 'center',
                  lineHeight: 1.4,
                  color: hover === name ? 'var(--m2m-pg-brand)' : 'var(--m2m-pg-comp-text-muted)'
                }"
              >
                {{ copied === name ? '복사됨!' : name }}
              </code>
            </button>
          </div>
        </ComponentSection>

        <!-- ─────────── playground ─────────── -->
        <ComponentSection
          v-else-if="tab === 'playground'"
          title="인터랙티브 플레이그라운드"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Icon from \x27m2m-uiux-vue/Icon\x27',
            '</script>',
            '',
            '<template>',
            '  &lt;!-- name, color, size, rotate 를 조합해 실시간 미리보기 --&gt;',
            '  <Icon name=&quot;search&quot; color=&quot;var(--m2m-pg-brand)&quot; :size=&quot;32&quot; :rotate=&quot;0&quot; />',
            '</template>'
          ]"
          :notes="[
            'color — CSS color 값이면 무엇이든 사용 가능 (hex, rgb, var(--m2m-pg-*) …)',
            'rotate — 음수 허용. -45 = 왼쪽 위 대각선'
          ]"
        >
          <div style="display: flex; gap: 24px; flex-wrap: wrap; align-items: flex-start">
            <div
              style="
                width: 120px;
                height: 120px;
                border: 1px solid var(--m2m-pg-comp-border);
                border-radius: 12px;
                background: var(--m2m-pg-comp-bg-subtle);
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
              "
            >
              <Icon :name="pgName" :color="pgColor" :size="pgSize" :rotate="pgRotate" />
            </div>

            <div style="display: flex; flex-direction: column; gap: 12px; min-width: 220px">
              <label style="display: flex; flex-direction: column; gap: 4px">
                <span :style="ctrlLabel">name</span>
                <Select
                  :options="NAME_OPTIONS"
                  :model-value="pgName"
                  searchable
                  size="sm"
                  @update:model-value="(v: string) => (pgName = v)"
                />
              </label>

              <label style="display: flex; flex-direction: column; gap: 4px">
                <span :style="ctrlLabel">color</span>
                <div style="display: flex; align-items: center; gap: 8px">
                  <input
                    :value="pickerColor"
                    type="color"
                    style="
                      width: 32px;
                      height: 32px;
                      padding: 0;
                      border: 1px solid var(--m2m-pg-comp-border);
                      border-radius: 6px;
                      background: none;
                      cursor: pointer;
                    "
                    @input="(e) => (pgColor = (e.target as HTMLInputElement).value)"
                  />
                  <input
                    v-model="pgColor"
                    type="text"
                    style="
                      flex: 1;
                      min-width: 0;
                      padding: 6px 10px;
                      border: 1px solid var(--m2m-pg-comp-border);
                      border-radius: 7px;
                      background: var(--m2m-pg-comp-bg);
                      color: var(--m2m-pg-comp-text);
                      font-family: monospace;
                      font-size: 12px;
                    "
                  />
                </div>
              </label>

              <label style="display: flex; flex-direction: column; gap: 4px">
                <span :style="ctrlLabel">size — {{ pgSize }}px</span>
                <input v-model.number="pgSize" type="range" min="12" max="64" step="2" :style="rangeInput" />
              </label>

              <label style="display: flex; flex-direction: column; gap: 4px">
                <span :style="ctrlLabel">rotate — {{ pgRotate }}°</span>
                <input v-model.number="pgRotate" type="range" min="-180" max="180" step="15" :style="rangeInput" />
              </label>
            </div>

            <pre :style="CODE_PRE_LG">{{ pgCode }}</pre>
          </div>
        </ComponentSection>

        <!-- ─────────── named ─────────── -->
        <ComponentSection
          v-else-if="tab === 'named'"
          title="별칭 → icon-map 키 매핑 (ICON_NAME)"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Icon from \x27m2m-uiux-vue/Icon\x27',
            '</script>',
            '',
            '<template>',
            '  &lt;!-- \x27close\x27 → \x27icon_close\x27, \x27chevron-left\x27 → \x27icon_arrow_s_before_line\x27 … --&gt;',
            '  <Icon name=&quot;close&quot; />',
            '  &lt;!-- 원시 키도 동일하게 동작 --&gt;',
            '  <Icon name=&quot;icon_close&quot; />',
            '</template>'
          ]"
          :notes="['별칭이 없으면 name 을 그대로 icon-map 키로 사용']"
        >
          <div
            style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px; width: 100%"
          >
            <div
              v-for="([alias, key], i) in ENTRIES"
              :key="alias"
              style="
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 9px 12px;
                border: 1px solid var(--m2m-pg-comp-border);
                border-radius: 8px;
                background: var(--m2m-pg-comp-bg);
              "
            >
              <Icon :name="alias" :size="20" :color="colorAt(i)" />
              <span style="min-width: 0">
                <span
                  style="
                    display: block;
                    font-size: 12px;
                    font-weight: 600;
                    color: var(--m2m-pg-comp-text);
                    font-family: monospace;
                  "
                  >{{ alias }}</span
                >
                <span
                  style="
                    display: block;
                    font-size: 10px;
                    color: var(--m2m-pg-comp-text-muted);
                    font-family: monospace;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  "
                  >→ {{ key }}</span
                >
              </span>
            </div>
          </div>
        </ComponentSection>

        <!-- ─────────── color ─────────── -->
        <ComponentSection
          v-else-if="tab === 'color'"
          title="color — currentColor 를 통한 색상 제어"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Icon from \x27m2m-uiux-vue/Icon\x27',
            '</script>',
            '',
            '<template>',
            '  <Icon name=&quot;arrow-right&quot; color=&quot;var(--m2m-pg-brand)&quot; />',
            '  <Icon name=&quot;arrow-right&quot; color=&quot;var(--m2m-pg-success)&quot; />',
            '  <Icon name=&quot;arrow-right&quot; color=&quot;var(--m2m-pg-error)&quot; />',
            '  <Icon name=&quot;arrow-right&quot; color=&quot;#06b6d4&quot; />',
            '  <Icon name=&quot;arrow-right&quot; color=&quot;inherit&quot; />',
            '</template>'
          ]"
          :notes="[
            '마스크 background-color 를 color prop 으로 지정 — SVG 자체 색은 무시',
            'CSS 변수 · inherit · currentColor 모두 사용 가능'
          ]"
        >
          <div style="display: flex; flex-wrap: wrap; gap: 20px">
            <div
              v-for="[label, hex] in COLOR_SWATCHES"
              :key="label"
              style="display: flex; flex-direction: column; align-items: center; gap: 6px"
            >
              <div
                :style="{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  background: BOX_BG,
                  border: '1px solid var(--m2m-pg-comp-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }"
              >
                <Icon name="arrow-right" :size="22" :color="hex" />
              </div>
              <span style="font-size: 10px; color: var(--m2m-pg-comp-text-sub)">{{ label }}</span>
              <code style="font-size: 9px; font-family: monospace; color: var(--m2m-pg-comp-text-muted)">{{
                hex
              }}</code>
            </div>
          </div>
        </ComponentSection>

        <!-- ─────────── size ─────────── -->
        <ComponentSection
          v-else-if="tab === 'size'"
          title="size — 너비 = 높이 (px)"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Icon from \x27m2m-uiux-vue/Icon\x27',
            '</script>',
            '',
            '<template>',
            '  <Icon name=&quot;arrow-right&quot; :size=&quot;16&quot; />',
            '  <Icon name=&quot;arrow-right&quot; :size=&quot;24&quot; />',
            '  <Icon name=&quot;arrow-right&quot; :size=&quot;48&quot; />',
            '</template>'
          ]"
          :notes="['size 는 숫자(px) 또는 문자열. width = height 정사각 유지']"
        >
          <div style="display: flex; align-items: flex-end; gap: 20px; flex-wrap: wrap">
            <div
              v-for="s in SIZES"
              :key="s"
              style="display: flex; flex-direction: column; align-items: center; gap: 6px"
            >
              <Icon name="arrow-right" :size="s" color="var(--m2m-pg-brand)" />
              <span style="font-size: 10px; color: var(--m2m-pg-comp-text-sub)">{{ s }}px</span>
            </div>
          </div>
        </ComponentSection>

        <!-- ─────────── rotate ─────────── -->
        <ComponentSection
          v-else-if="tab === 'rotate'"
          title="rotate — 회전 (deg)"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Icon from \x27m2m-uiux-vue/Icon\x27',
            '</script>',
            '',
            '<template>',
            '  &lt;!-- arrow 아이콘 하나로 모든 방향 표현 --&gt;',
            '  <Icon name=&quot;arrow-right&quot; :rotate=&quot;0&quot; />',
            '  <Icon name=&quot;arrow-right&quot; :rotate=&quot;90&quot; />',
            '  <Icon name=&quot;arrow-right&quot; :rotate=&quot;180&quot; />',
            '  <Icon name=&quot;arrow-right&quot; :rotate=&quot;-45&quot; />',
            '</template>'
          ]"
          :notes="[
            'CSS transform: rotate() — 상태 변화 시 자연스럽게 트랜지션',
            '무한 회전이 필요하면 컴포넌트의 spin prop 사용 (<Icon spin />)'
          ]"
        >
          <div>
            <div style="display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 16px">
              <div
                v-for="deg in ROTATES"
                :key="deg"
                style="display: flex; flex-direction: column; align-items: center; gap: 6px"
              >
                <div
                  :style="{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: BOX_BG,
                    border: '1px solid var(--m2m-pg-comp-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }"
                >
                  <Icon name="arrow-right" :size="20" :rotate="deg" color="var(--m2m-pg-brand)" />
                </div>
                <span style="font-size: 10px; color: var(--m2m-pg-comp-text-sub)">{{ deg }}°</span>
              </div>
            </div>
            <p style="font-size: 12px; color: var(--m2m-pg-comp-text-sub); margin: 0 0 8px">
              아이콘 하나(<component :is="Code">chevron-right</component>)로 4방향 화살표 구현:
            </p>
            <div style="display: flex; gap: 4px">
              <div
                v-for="d in [0, 90, 180, 270]"
                :key="d"
                style="
                  width: 32px;
                  height: 32px;
                  border-radius: 8px;
                  background: var(--m2m-pg-brand-light);
                  border: 1px solid var(--m2m-pg-brand);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >
                <Icon name="chevron-right" :size="16" :rotate="d" color="var(--m2m-pg-brand)" />
              </div>
            </div>
          </div>
        </ComponentSection>

        <!-- ─────────── register ─────────── -->
        <ComponentSection
          v-else-if="tab === 'register'"
          title="새 아이콘 등록 방법"
          :code="[
            '// 파일 1개(+선택 1개)만 수정',
            '',
            '// 1. src/assets/styles/_icons.scss  →  icon-map()',
            '//    \x27icon_star_line\x27: \x27<svg …></svg>\x27,',
            '',
            '// 2. (선택) src/components/Icon/Icon.constant.ts  →  ICON_NAME',
            '//    star: \x27icon_star_line\x27,'
          ]"
          :notes="['Vue SVG 컴포넌트를 만들지 않는다 — 전부 icon-map + CSS 마스크', 'Icon 컴포넌트 본체는 수정 불필요']"
        >
          <div style="display: flex; flex-direction: column; gap: 24px">
            <Step n="1">
              <template #title>
                <component :is="Code">src/assets/styles/_icons.scss</component> 의
                <component :is="Code">icon-map()</component> 에 SVG 한 줄 추가
              </template>
              <p :style="stepP">
                SVG 는 CSS 마스크로만 쓰이므로 <component :is="Code">fill</component>/<component :is="Code"
                  >stroke</component
                >
                색은 무의미합니다 (alpha 만 사용).
              </p>
              <pre :style="CODE_PRE">{{ REG_1 }}</pre>
            </Step>

            <div :style="hr" />

            <Step n="2">
              <template #title>
                SCSS 가 <component :is="Code">.i-icon_star_line</component> 마스크 클래스를 자동 생성
              </template>
              <p :style="stepP">
                <component :is="Code">Icon.module.scss</component> 의
                <component :is="Code">@each $key, $svg in icon-map()</component> 루프가 모든 키에 대해
                <component :is="Code">.i-&lt;key&gt;</component> 를 생성하므로 별도 작업이 없습니다.
              </p>
              <pre :style="CODE_PRE">{{ REG_2 }}</pre>
            </Step>

            <div :style="hr" />

            <Step n="3">
              <template #title>
                (선택) <component :is="Code">Icon.constant.ts</component> 의
                <component :is="Code">ICON_NAME</component> 에 친숙한 별칭 추가
              </template>
              <pre :style="CODE_PRE">{{ REG_3 }}</pre>
            </Step>

            <div :style="hr" />

            <Step n="✓" tone="ok">
              <template #title>바로 사용</template>
              <pre :style="CODE_PRE">{{ REG_4 }}</pre>
            </Step>
          </div>
        </ComponentSection>

        <!-- ─────────── props ─────────── -->
        <ComponentSection
          v-else-if="tab === 'props'"
          title="Icon Props"
          :code="[
            'interface IconProps {',
            '  name: string',
            '  color?: string   // \x27currentColor\x27',
            '  size?: number | string   // 24',
            '  rotate?: number  // 0',
            '  spin?: boolean',
            '  classNames?: string | string[]',
            '}'
          ]"
        >
          <div style="overflow-x: auto; width: 100%">
            <table style="width: 100%; border-collapse: collapse; font-size: 12px">
              <thead>
                <tr
                  style="background: var(--m2m-pg-comp-bg-subtle); border-bottom: 2px solid var(--m2m-pg-comp-border)"
                >
                  <th v-for="hh in ['Prop', 'Type', 'Default', '설명']" :key="hh" :style="thStyle">{{ hh }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="([n, t, d, desc], i) in PROPS"
                  :key="n"
                  :style="{
                    borderBottom: '1px solid var(--m2m-pg-comp-border)',
                    background: i % 2 === 1 ? 'var(--m2m-pg-comp-bg-subtle)' : 'transparent'
                  }"
                >
                  <td :style="tdStyle">
                    <component :is="Code">{{ n }}</component>
                  </td>
                  <td :style="{...tdStyle, fontFamily: 'monospace', fontSize: '11px', color: 'var(--m2m-pg-info)'}">
                    {{ t }}
                  </td>
                  <td :style="{...tdStyle, fontFamily: 'monospace', fontSize: '11px', color: 'var(--m2m-pg-brand)'}">
                    {{ d }}
                  </td>
                  <td :style="{...tdStyle, color: 'var(--m2m-pg-comp-text-sub)', lineHeight: 1.6}">{{ desc }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
