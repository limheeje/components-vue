<script setup lang="ts">
import {defineComponent, h, reactive, ref} from 'vue'
import type {CSSProperties} from 'vue'

import Grid, {GRID_ALIGN} from '~/components/Grid'
import type {GridAlign} from '~/components/Grid'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['columns', 'gap', 'justifyItems', 'alignItems', 'cellAlign']

type JA = GridAlign
// 하드코딩 문자열 대신 export 상수(GRID_ALIGN) 사용
const JA_OPTS: JA[] = [GRID_ALIGN.START, GRID_ALIGN.CENTER, GRID_ALIGN.END, GRID_ALIGN.STRETCH]
const COLORS = ['#FF5A00', '#6366F1', '#059669', '#F59E0B', '#EC4899', '#3B82F6']
const ALPHA = 'ABCDEF'

/* ── 공통 UI 헬퍼 ── */
function alignBtnStyle(active: boolean): CSSProperties {
  return {
    padding: '4px 10px',
    fontSize: '11px',
    borderRadius: '5px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontWeight: active ? '700' : '400',
    border: `1px solid ${active ? 'var(--m2m-pg-brand)' : 'var(--m2m-pg-comp-border)'}`,
    background: active ? 'var(--m2m-pg-brand)' : 'var(--m2m-pg-comp-bg)',
    color: active ? '#fff' : 'var(--m2m-pg-comp-text-sub)',
    transition: 'all 0.12s'
  }
}

/** 시각화 셀 — 점선이 셀 경계, 색상 박스가 아이템 */
const VisCell = defineComponent({
  name: 'GridVisCell',
  props: {
    idx: {type: Number, required: true},
    hpos: {type: String as () => JA, required: true},
    vpos: {type: String as () => JA, required: true},
    label: {type: String, default: undefined}
  },
  setup: (p) => () => {
    const c = COLORS[p.idx % COLORS.length]
    const jc = p.hpos === 'end' ? 'flex-end' : p.hpos === 'center' ? 'center' : 'flex-start'
    const ai = p.vpos === 'end' ? 'flex-end' : p.vpos === 'center' ? 'center' : 'flex-start'
    return h(
      'div',
      {
        style: {
          background: 'var(--m2m-pg-comp-bg)',
          border: '1px dashed var(--m2m-pg-comp-border)',
          borderRadius: '6px',
          height: '90px',
          display: 'flex',
          justifyContent: jc,
          alignItems: ai,
          padding: '4px',
          overflow: 'hidden'
        }
      },
      [
        h(
          'div',
          {
            style: {
              background: `${c}1E`,
              border: `1.5px solid ${c}66`,
              borderRadius: '5px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: '700',
              color: c,
              boxSizing: 'border-box',
              width: p.hpos === 'stretch' ? 'calc(100% - 8px)' : undefined,
              height: p.vpos === 'stretch' ? 'calc(100% - 8px)' : undefined,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.25s ease'
            }
          },
          p.label ?? ALPHA[p.idx]
        )
      ]
    )
  }
})

const SHORT: Record<JA, string> = {start: 'S', center: 'C', end: 'E', stretch: 'St'}
const MiniAlignPicker = defineComponent({
  name: 'GridMiniAlignPicker',
  props: {
    axis: {type: String as () => 'H' | 'V', required: true},
    value: {type: String as () => JA, required: true},
    onPick: {type: Function as unknown as () => (v: JA) => void, required: true}
  },
  setup: (p) => () =>
    h('div', {style: {display: 'flex', alignItems: 'center', gap: '4px'}}, [
      h('span', {style: {fontSize: '9px', fontWeight: '700', color: 'var(--m2m-pg-comp-text-disabled)'}}, p.axis),
      ...JA_OPTS.map((o) =>
        h(
          'button',
          {
            key: o,
            type: 'button',
            title: o,
            onClick: () => p.onPick(o),
            style: {
              padding: '2px 5px',
              fontSize: '9px',
              borderRadius: '3px',
              cursor: 'pointer',
              lineHeight: '1.4',
              fontWeight: p.value === o ? '700' : '400',
              border: `1px solid ${p.value === o ? 'var(--m2m-pg-brand)' : 'var(--m2m-pg-comp-border)'}`,
              background: p.value === o ? 'var(--m2m-pg-brand)' : 'var(--m2m-pg-comp-bg)',
              color: p.value === o ? '#fff' : 'var(--m2m-pg-comp-text-muted)'
            }
          },
          SHORT[o]
        )
      )
    ])
})

/* ── columns ── */
const COLUMN_EXAMPLES: {cols: number | string; label: string; desc: string}[] = [
  {cols: 3, label: 'repeat(3, 1fr)', desc: '균등 3열'},
  {cols: '1fr 2fr 1fr', label: '1fr 2fr 1fr', desc: '1:2:1 비율 3열'},
  {cols: '200px 1fr', label: '200px 1fr', desc: '고정 + 유동'},
  {
    cols: 'repeat(auto-fill, minmax(120px, 1fr))',
    label: 'repeat(auto-fill, minmax(120px, 1fr))',
    desc: '반응형 자동 열'
  }
]
const gridLineStyle: CSSProperties = {
  background: 'var(--m2m-pg-comp-border)',
  border: '1px solid var(--m2m-pg-comp-border)',
  borderRadius: '8px',
  overflow: 'hidden'
}

/* ── gap ── */
const gap = ref(12)

/* ── justifyItems / alignItems ── */
const jItems = ref<JA>(GRID_ALIGN.STRETCH)
const aItems = ref<JA>(GRID_ALIGN.STRETCH)

/* ── cellAlign ── */
const cells = reactive<{h: JA; v: JA}[]>([
  {h: GRID_ALIGN.START, v: GRID_ALIGN.START},
  {h: GRID_ALIGN.CENTER, v: GRID_ALIGN.CENTER},
  {h: GRID_ALIGN.END, v: GRID_ALIGN.END},
  {h: GRID_ALIGN.STRETCH, v: GRID_ALIGN.START},
  {h: GRID_ALIGN.CENTER, v: GRID_ALIGN.END},
  {h: GRID_ALIGN.END, v: GRID_ALIGN.STRETCH}
])
</script>

<template>
  <div>
    <PageHeader
      title="Grid"
      component="Grid"
      desc="— CSS Grid 레이아웃 래퍼. 열 구성·간격·정렬을 조합해 복잡한 격자 구조를 구현합니다. Grid.Item 으로 셀 병합/개별 정렬."
    />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <!-- ─────────── columns ─────────── -->
        <ComponentSection
          v-if="tab === 'columns'"
          title="columns — 열 구성"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Grid from \x27m2m-uiux-vue/Grid\x27',
            '</script>',
            '',
            '<template>',
            '  &lt;!-- 균등 3열 --&gt;',
            '  <Grid :columns=&quot;3&quot;><div>A</div><div>B</div><div>C</div></Grid>',
            '  &lt;!-- 1:2:1 비율 --&gt;',
            '  <Grid columns=&quot;1fr 2fr 1fr&quot;><div>A</div><div>B</div><div>C</div></Grid>',
            '  &lt;!-- 고정 + 유동 --&gt;',
            '  <Grid columns=&quot;200px 1fr&quot;><div>A</div><div>B</div></Grid>',
            '  &lt;!-- 반응형 자동 열 --&gt;',
            '  <Grid columns=&quot;repeat(auto-fill, minmax(120px, 1fr))&quot;><div>A</div><div>B</div></Grid>',
            '</template>'
          ]"
          :notes="[
            '숫자 → repeat(n, minmax(0, 1fr)) · 문자열 → grid-template-columns 그대로',
            'auto-fill + minmax — 컨테이너 너비에 따라 열 수가 자동 조절'
          ]"
        >
          <div style="display: flex; flex-direction: column; gap: 20px">
            <div v-for="ex in COLUMN_EXAMPLES" :key="ex.label" style="display: flex; flex-direction: column; gap: 8px">
              <div style="display: flex; gap: 8px; align-items: center">
                <code
                  style="
                    font-size: 11px;
                    color: var(--m2m-pg-brand);
                    background: var(--m2m-pg-comp-bg-hover);
                    padding: 2px 8px;
                    border-radius: 4px;
                  "
                  >{{ ex.label }}</code
                >
                <span style="font-size: 12px; color: var(--m2m-pg-comp-text-muted)">{{ ex.desc }}</span>
              </div>
              <Grid :columns="ex.cols" gap="1px" :style="gridLineStyle">
                <div
                  v-for="i in 4"
                  :key="i"
                  :style="{
                    background: `${COLORS[i - 1]}18`,
                    padding: '12px 10px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: COLORS[i - 1],
                    textAlign: 'center'
                  }"
                >
                  {{ ALPHA[i - 1] }}
                </div>
              </Grid>
            </div>
          </div>
        </ComponentSection>

        <!-- ─────────── gap ─────────── -->
        <ComponentSection
          v-else-if="tab === 'gap'"
          title="gap — 셀 간격 (슬라이더로 조절)"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Grid from \x27m2m-uiux-vue/Grid\x27',
            '</script>',
            '',
            '<template>',
            '  &lt;!-- 행·열 동일 --&gt;',
            '  <Grid :columns=&quot;3&quot; :gap=&quot;12&quot;><div>A</div><div>B</div><div>C</div></Grid>',
            '  &lt;!-- 행·열 개별 --&gt;',
            '  <Grid :columns=&quot;3&quot; :row-gap=&quot;16&quot; :column-gap=&quot;8&quot;><div>A</div><div>B</div><div>C</div></Grid>',
            '</template>'
          ]"
          :notes="['gap 은 rowGap + columnGap 단축 속성', 'gap=&quot;16px 8px&quot; — 행 16px, 열 8px']"
        >
          <div style="display: flex; flex-direction: column; gap: 16px">
            <div style="display: flex; align-items: center; gap: 12px">
              <span style="font-size: 12px; color: var(--m2m-pg-comp-text-muted); min-width: 40px">gap</span>
              <input
                v-model.number="gap"
                type="range"
                min="0"
                max="32"
                style="flex: 1; accent-color: var(--m2m-pg-brand)"
              />
              <code style="font-size: 12px; color: var(--m2m-pg-brand); min-width: 36px">{{ gap }}px</code>
            </div>
            <Grid
              :columns="3"
              :gap="gap"
              :style="{
                border: '1px solid var(--m2m-pg-comp-border)',
                borderRadius: '8px',
                background: 'var(--m2m-pg-comp-bg-subtle)',
                padding: '6px'
              }"
            >
              <div
                v-for="i in 6"
                :key="i"
                :style="{
                  background: `${COLORS[i - 1]}22`,
                  border: `1.5px solid ${COLORS[i - 1]}55`,
                  borderRadius: '6px',
                  padding: '14px 8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: COLORS[i - 1],
                  textAlign: 'center',
                  transition: 'all 0.15s'
                }"
              >
                {{ ALPHA[i - 1] }}
              </div>
            </Grid>
          </div>
        </ComponentSection>

        <!-- ─────────── justifyItems ─────────── -->
        <ComponentSection
          v-else-if="tab === 'justifyItems'"
          title="justifyItems — 전체 셀 가로 정렬"
          description="그리드 컨테이너에 적용. 모든 셀의 콘텐츠를 수평 방향으로 일괄 정렬합니다."
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            `import Grid, {GRID_ALIGN} from \x27m2m-uiux-vue/Grid\x27`,
            '</script>',
            '',
            '<template>',
            '  <Grid :columns=&quot;3&quot; :justify-items=&quot;GRID_ALIGN[\x27CENTER\x27]&quot;>',
            '    <div>A</div>',
            '    <div>B</div>',
            '    <div>C</div>',
            '  </Grid>',
            '</template>'
          ]"
          :notes="[
            'stretch (기본값) — 아이템이 셀 전체 너비를 채웁니다',
            'start / center / end — 아이템이 자연 너비로 축소되어 정렬됩니다',
            '개별 셀 오버라이드: Grid.Item 의 justifySelf 사용 (cellAlign 탭 참고)'
          ]"
        >
          <div style="display: flex; flex-direction: column; gap: 16px">
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap">
              <code style="font-size: 12px; color: var(--m2m-pg-comp-text-muted); min-width: 112px">justifyItems</code>
              <div style="display: flex; gap: 4px; flex-wrap: wrap">
                <button
                  v-for="o in JA_OPTS"
                  :key="o"
                  type="button"
                  :style="alignBtnStyle(jItems === o)"
                  @click="jItems = o"
                >
                  {{ o }}
                </button>
              </div>
            </div>
            <Grid :columns="3" gap="1px" :style="gridLineStyle">
              <VisCell v-for="i in 6" :key="i" :idx="i - 1" :hpos="jItems" :vpos="GRID_ALIGN['STRETCH']" />
            </Grid>
            <p style="font-size: 12px; color: var(--m2m-pg-comp-text-muted); margin: 0">
              현재 모든 셀: <code>justifySelf: "{{ jItems }}"</code> — 점선 테두리가 셀 경계, 색상 박스가 아이템입니다.
            </p>
          </div>
        </ComponentSection>

        <!-- ─────────── alignItems ─────────── -->
        <ComponentSection
          v-else-if="tab === 'alignItems'"
          title="alignItems — 전체 셀 세로 정렬"
          description="그리드 컨테이너에 적용. 모든 셀의 콘텐츠를 수직 방향으로 일괄 정렬합니다."
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            `import Grid, {GRID_ALIGN} from \x27m2m-uiux-vue/Grid\x27`,
            '</script>',
            '',
            '<template>',
            '  <Grid :columns=&quot;3&quot; :auto-rows=&quot;90&quot; :align-items=&quot;GRID_ALIGN[\x27CENTER\x27]&quot;>',
            '    <div>A</div>',
            '    <div>B</div>',
            '  </Grid>',
            '</template>'
          ]"
          :notes="[
            '수직 정렬이 보이려면 셀 높이(autoRows)가 콘텐츠보다 커야 합니다',
            'stretch (기본값) — 아이템이 셀 전체 높이를 채웁니다'
          ]"
        >
          <div style="display: flex; flex-direction: column; gap: 16px">
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap">
              <code style="font-size: 12px; color: var(--m2m-pg-comp-text-muted); min-width: 112px">alignItems</code>
              <div style="display: flex; gap: 4px; flex-wrap: wrap">
                <button
                  v-for="o in JA_OPTS"
                  :key="o"
                  type="button"
                  :style="alignBtnStyle(aItems === o)"
                  @click="aItems = o"
                >
                  {{ o }}
                </button>
              </div>
            </div>
            <Grid :columns="3" gap="1px" :style="gridLineStyle">
              <VisCell v-for="i in 6" :key="i" :idx="i - 1" :hpos="GRID_ALIGN['STRETCH']" :vpos="aItems" />
            </Grid>
            <p style="font-size: 12px; color: var(--m2m-pg-comp-text-muted); margin: 0">
              현재 모든 셀: <code>alignSelf: "{{ aItems }}"</code> — 점선 테두리가 셀 경계, 색상 박스가 아이템입니다.
            </p>
          </div>
        </ComponentSection>

        <!-- ─────────── cellAlign ─────────── -->
        <ComponentSection
          v-else-if="tab === 'cellAlign'"
          title="Grid.Item — justifySelf + alignSelf 셀 개별 정렬"
          description="각 Grid.Item 에 직접 적용. 컨테이너의 justifyItems/alignItems 를 셀 단위로 오버라이드합니다."
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            `import Grid, {GRID_ALIGN} from \x27m2m-uiux-vue/Grid\x27`,
            '</script>',
            '',
            '<template>',
            '  <Grid :columns=&quot;3&quot;>',
            '    &lt;!-- 가로: 시작, 세로: 끝 --&gt;',
            '    <Grid.Item :justify-self=&quot;GRID_ALIGN[\x27START\x27]&quot; :align-self=&quot;GRID_ALIGN[\x27END\x27]&quot;>A</Grid.Item>',
            '    &lt;!-- 가로·세로 모두 중앙 --&gt;',
            '    <Grid.Item :justify-self=&quot;GRID_ALIGN[\x27CENTER\x27]&quot; :align-self=&quot;GRID_ALIGN[\x27CENTER\x27]&quot;>B</Grid.Item>',
            '    &lt;!-- 기본값 유지 (stretch) --&gt;',
            '    <Grid.Item>C</Grid.Item>',
            '  </Grid>',
            '</template>'
          ]"
          :notes="[
            'justifySelf — 해당 셀만 가로 정렬을 오버라이드',
            'alignSelf — 해당 셀만 세로 정렬을 오버라이드',
            '컨테이너의 justifyItems/alignItems 보다 우선 적용됩니다',
            'H=가로(justify), V=세로(align) / S=start C=center E=end St=stretch'
          ]"
        >
          <div style="display: flex; flex-direction: column; gap: 12px">
            <p style="font-size: 12px; color: var(--m2m-pg-comp-text-muted); margin: 0">
              각 셀마다 H(가로) · V(세로) 정렬을 독립적으로 설정합니다. S=start, C=center, E=end, St=stretch
            </p>
            <Grid :columns="3" :gap="8">
              <div v-for="(cell, i) in cells" :key="i" style="display: flex; flex-direction: column; gap: 6px">
                <VisCell :idx="i" :hpos="cell.h" :vpos="cell.v" />
                <div
                  style="
                    background: var(--m2m-pg-comp-bg-subtle);
                    border: 1px solid var(--m2m-pg-comp-border);
                    border-radius: 6px;
                    padding: 6px 8px;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                  "
                >
                  <MiniAlignPicker axis="H" :value="cell.h" :on-pick="(x: JA) => (cell.h = x)" />
                  <MiniAlignPicker axis="V" :value="cell.v" :on-pick="(x: JA) => (cell.v = x)" />
                </div>
                <code style="font-size: 10px; color: var(--m2m-pg-comp-text-disabled); text-align: center"
                  >{{ cell.h }} / {{ cell.v }}</code
                >
              </div>
            </Grid>
          </div>
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
