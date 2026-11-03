<script setup lang="ts">
import {computed, defineComponent, h, ref} from 'vue'
import type {CSSProperties} from 'vue'

import Image, {IMAGE_LOADING} from '~/components/Image'
import Select from '~/components/Select'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['playground', 'basic', 'fallback', 'skeleton', 'lazy', 'objectFit', '비교', 'props']

const IMGS = {
  mountain: 'https://picsum.photos/id/1015/800/600',
  city: 'https://picsum.photos/id/1016/800/600',
  coffee: 'https://picsum.photos/id/225/800/600',
  cat: 'https://picsum.photos/id/1025/600/600',
  ocean: 'https://picsum.photos/id/1043/800/600',
  food: 'https://picsum.photos/id/292/800/600',
  broken: 'https://this-domain-does-not-exist.invalid/broken.jpg',
  fallback: 'https://picsum.photos/id/1003/400/300'
}

const PG_IMAGES = [
  {label: '산', src: IMGS.mountain},
  {label: '도시', src: IMGS.city},
  {label: '카페', src: IMGS.coffee},
  {label: '고양이', src: IMGS.cat},
  {label: '바다', src: IMGS.ocean},
  {label: '음식', src: IMGS.food}
]

const FITS = ['cover', 'contain', 'fill', 'none', 'scale-down'] as const
type Fit = CSSProperties['objectFit']

const BOX_BG = 'var(--m2m-pg-comp-bg-subtle)'

const CODE_PRE: CSSProperties = {
  flex: '1',
  minWidth: '200px',
  margin: '0',
  padding: '14px 16px',
  background: '#14213d',
  borderRadius: '10px',
  fontSize: '11px',
  lineHeight: '1.7',
  color: '#e6ebf8',
  fontFamily: "'Fira Mono', 'Consolas', monospace",
  whiteSpace: 'pre',
  overflowX: 'auto'
}

/* ── 공용 표시용 헬퍼 컴포넌트 (React 의 Code · Label · ArrowGlyph 대응) ── */
const Code = defineComponent({
  name: 'DemoCode',
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

const Label = defineComponent({
  name: 'DemoLabel',
  setup:
    (_, {slots}) =>
    () =>
      h(
        'p',
        {
          style: {
            margin: '0 0 6px',
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'var(--m2m-pg-comp-text-muted)'
          }
        },
        slots.default?.()
      )
})

const ArrowGlyph = () =>
  h('svg', {width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true'}, [
    h('path', {
      d: 'M5 12h14M12 5l7 7-7 7',
      stroke: 'var(--m2m-pg-comp-text-muted)',
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    })
  ])

const rangeStyle: CSSProperties = {flex: '1', accentColor: 'var(--m2m-pg-brand)'}

const rowLabelStyle: CSSProperties = {
  width: '76px',
  flexShrink: '0',
  fontSize: '11px',
  fontWeight: '600',
  color: 'var(--m2m-pg-comp-text-sub)'
}
/** playground 컨트롤 한 줄 (React 의 row() 헬퍼) */
const Row = defineComponent({
  name: 'PgRow',
  props: {label: {type: String, required: true}},
  setup:
    (p, {slots}) =>
    () =>
      h('label', {style: {display: 'flex', alignItems: 'center', gap: '10px'}}, [
        h('span', {style: rowLabelStyle}, p.label),
        slots.default?.()
      ])
})

/* ═══════════════════════ playground ═══════════════════════ */
const imgIdx = ref('0')
const w = ref(260)
const h_ = ref(180)
const rounded = ref(12)
const fit = ref<Fit>('cover')
const loading = ref<'lazy' | 'eager'>(IMAGE_LOADING.LAZY)
const skeleton = ref(true)
const fadeIn = ref(true)
const nonce = ref(0)

const curImg = computed(() => PG_IMAGES[Number(imgIdx.value)] ?? PG_IMAGES[0])

const pgCode = computed(
  () => `<Image
  src="..."
  alt="${curImg.value.label}"
  width={${w.value}}
  height={${h_.value}}
  objectFit="${fit.value}"
  rounded={${rounded.value}}
  skeleton={${skeleton.value}}
  fadeIn={${fadeIn.value}}
  loading={IMAGE_LOADING['${loading.value.toUpperCase()}']}
/>`
)

function refreshPg() {
  nonce.value++
}
function onSrcChange(v: string) {
  imgIdx.value = v
  nonce.value++
}

/* ═══════════════════════ fallback ═══════════════════════ */
const broken = ref(false)
const fbKey = ref(0)
function breakSrc() {
  broken.value = true
  fbKey.value++
}
function resetFb() {
  broken.value = false
  fbKey.value++
}

/* ═══════════════════════ skeleton ═══════════════════════ */
const skNonce = ref(0)
const SK_LIST = [IMGS.mountain, IMGS.city, IMGS.coffee, IMGS.cat, IMGS.ocean, IMGS.food]

/* ═══════════════════════ lazy ═══════════════════════ */
const LAZY_IMGS = [
  {src: IMGS.mountain, alt: '산 풍경'},
  {src: IMGS.city, alt: '도시'},
  {src: IMGS.coffee, alt: '카페'},
  {src: IMGS.cat, alt: '고양이'},
  {src: IMGS.ocean, alt: '바다'},
  {src: IMGS.food, alt: '음식'},
  {src: IMGS.mountain, alt: '산 풍경 2'},
  {src: IMGS.city, alt: '도시 2'}
]

/* ═══════════════════════ objectFit ═══════════════════════ */
const ofFit = ref<Fit>('cover')
function ofBtnStyle(active: boolean): CSSProperties {
  return {
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    cursor: 'pointer',
    border: `1px solid ${active ? 'var(--m2m-pg-brand)' : 'var(--m2m-pg-comp-border)'}`,
    background: active ? 'var(--m2m-pg-brand)' : 'var(--m2m-pg-comp-bg)',
    color: active ? '#fff' : 'var(--m2m-pg-comp-text)'
  }
}

/* ═══════════════════════ 비교 ═══════════════════════ */
const COMPARE_ROWS: [string, string, string][] = [
  ['에러 처리', '❌ 엑스박스 그대로 표시', '✅ fallbackSrc 또는 플레이스홀더 자동 표시'],
  ['로딩 UX', '❌ 빈 화면 → 이미지 갑작스레 등장', '✅ Shimmer 스켈레톤 → 페이드인'],
  ['지연 로딩', "⚠️ loading='lazy' 직접 추가 필요", '✅ 기본값으로 적용됨'],
  ['alt 강제', '❌ 빠뜨려도 에러 없음', '✅ TypeScript props 로 필수 지정'],
  ['일관된 스타일', '❌ 프로젝트마다 CSS 반복', '✅ rounded · objectFit 등 props 로 통일'],
  ['상태 관리', '❌ 컴포넌트마다 상태 작성', '✅ 로딩 / 에러 상태 내부 관리']
]

/* ═══════════════════════ props ═══════════════════════ */
const PROPS: {name: string; type: string; req: boolean; def: string; desc: string}[] = [
  {name: 'src', type: 'string', req: true, def: '—', desc: '이미지 URL'},
  {name: 'alt', type: 'string', req: true, def: '—', desc: '대체 텍스트 (TS 필수 · 장식용은 빈 문자열)'},
  {name: 'fallbackSrc', type: 'string', req: false, def: '—', desc: 'src 실패 시 대체 URL. 없으면 오류 플레이스홀더'},
  {name: 'width', type: 'number | string', req: false, def: "'100%'", desc: '컨테이너 너비'},
  {name: 'height', type: 'number | string', req: false, def: "'auto'", desc: '컨테이너 높이'},
  {name: 'objectFit', type: "CSSProperties['objectFit']", req: false, def: "'cover'", desc: '이미지 크기 조정 방식'},
  {name: 'rounded', type: 'number | string', req: false, def: '0', desc: 'border-radius (숫자 → px)'},
  {name: 'skeleton', type: 'boolean', req: false, def: 'true', desc: '로딩 중 shimmer 스켈레톤'},
  {name: 'fadeIn', type: 'boolean', req: false, def: 'true', desc: '로드 완료 페이드인'},
  {name: 'loading', type: "'lazy' | 'eager'", req: false, def: "'lazy'", desc: '브라우저 로딩 전략'},
  {name: 'imgStyle', type: 'CSSProperties', req: false, def: '—', desc: '내부 <img> 에 직접 스타일'},
  {name: 'style', type: 'CSSProperties', req: false, def: '—', desc: '컨테이너 <div> 스타일'},
  {name: 'classNames', type: 'string | string[]', req: false, def: '—', desc: '추가 클래스'}
]

const thStyle: CSSProperties = {
  padding: '10px 14px',
  textAlign: 'left',
  fontWeight: '700',
  whiteSpace: 'nowrap',
  color: 'var(--m2m-pg-comp-text-sub)'
}
const tdStyle: CSSProperties = {padding: '9px 14px'}

const btnGhost: CSSProperties = {
  padding: '6px 14px',
  borderRadius: '7px',
  fontSize: '11px',
  cursor: 'pointer',
  border: '1px solid var(--m2m-pg-comp-border)',
  background: 'var(--m2m-pg-comp-bg)',
  color: 'var(--m2m-pg-comp-text)'
}
</script>

<template>
  <div>
    <PageHeader
      title="Image"
      component="Image"
      desc="— 단순 <img> 를 넘어, Fallback · Skeleton · Fade-in · Lazy loading · alt 강제를 내장한 이미지 컴포넌트."
    />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <!-- ─────────── playground ─────────── -->
        <ComponentSection
          v-if="tab === 'playground'"
          title="인터랙티브 플레이그라운드"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Image, {IMAGE_LOADING} from \x27m2m-uiux-vue/Image\x27',
            '</script>',
            '',
            '<template>',
            '  <Image',
            '    src=&quot;/path/to/image.jpg&quot;',
            '    alt=&quot;설명 텍스트&quot;',
            '    :width=&quot;260&quot; :height=&quot;180&quot;',
            '    object-fit=&quot;cover&quot; :rounded=&quot;12&quot;',
            '    skeleton fade-in :loading=&quot;IMAGE_LOADING[\x27LAZY\x27]&quot;',
            '  />',
            '</template>'
          ]"
        >
          <div style="display: flex; gap: 24px; flex-wrap: wrap; align-items: flex-start">
            <div style="display: flex; flex-direction: column; gap: 10px; align-items: flex-start">
              <Image
                :key="nonce"
                :src="`${curImg.src}?_=${nonce}`"
                :alt="curImg.label"
                :width="w"
                :height="h_"
                :object-fit="fit"
                :rounded="rounded"
                :skeleton="skeleton"
                :fade-in="fadeIn"
                :loading="loading"
              />
              <button type="button" :style="btnGhost" @click="refreshPg">↺ 새로고침 (스켈레톤 재현)</button>
            </div>

            <div style="display: flex; flex-direction: column; gap: 12px; min-width: 240px">
              <Row label="src">
                <div style="flex: 1">
                  <Select
                    size="sm"
                    :model-value="imgIdx"
                    :options="PG_IMAGES.map((p, i) => ({label: p.label, value: String(i)}))"
                    @update:model-value="onSrcChange"
                  />
                </div>
              </Row>
              <Row :label="`width ${w}px`">
                <input v-model.number="w" type="range" min="100" max="400" step="10" :style="rangeStyle" />
              </Row>
              <Row :label="`height ${h_}px`">
                <input v-model.number="h_" type="range" min="80" max="300" step="10" :style="rangeStyle" />
              </Row>
              <Row :label="`rounded ${rounded}`">
                <input v-model.number="rounded" type="range" min="0" max="100" step="2" :style="rangeStyle" />
              </Row>
              <Row label="objectFit">
                <div style="flex: 1">
                  <Select
                    size="sm"
                    :model-value="fit"
                    :options="FITS.map((f) => ({label: f, value: f}))"
                    @update:model-value="(v: string) => (fit = v as Fit)"
                  />
                </div>
              </Row>
              <Row label="loading">
                <div style="flex: 1">
                  <Select
                    size="sm"
                    :model-value="loading"
                    :options="[
                      {label: 'lazy', value: IMAGE_LOADING['LAZY']},
                      {label: 'eager', value: IMAGE_LOADING['EAGER']}
                    ]"
                    @update:model-value="(v: string) => (loading = v as 'lazy' | 'eager')"
                  />
                </div>
              </Row>
              <div style="display: flex; gap: 14px">
                <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; cursor: pointer">
                  <input v-model="skeleton" type="checkbox" style="accent-color: var(--m2m-pg-brand)" />
                  skeleton
                </label>
                <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; cursor: pointer">
                  <input v-model="fadeIn" type="checkbox" style="accent-color: var(--m2m-pg-brand)" />
                  fadeIn
                </label>
              </div>
            </div>

            <pre :style="CODE_PRE">{{ pgCode }}</pre>
          </div>
        </ComponentSection>

        <!-- ─────────── basic ─────────── -->
        <ComponentSection
          v-else-if="tab === 'basic'"
          title="기본 사용법"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Image from \x27m2m-uiux-vue/Image\x27',
            '</script>',
            '',
            '<template>',
            '  <Image :src=&quot;url&quot; alt=&quot;산 풍경&quot; :width=&quot;220&quot; :height=&quot;160&quot; :rounded=&quot;12&quot; />',
            '  <Image :src=&quot;url&quot; alt=&quot;프로필&quot; :width=&quot;160&quot; :height=&quot;160&quot; rounded=&quot;50%&quot; />',
            '  <Image :src=&quot;url&quot; alt=&quot;상품&quot; :width=&quot;200&quot; :height=&quot;160&quot; object-fit=&quot;contain&quot; />',
            '</template>'
          ]"
          :notes="[
            'rounded 는 숫자(px) 또는 문자열(&quot;50%&quot;, &quot;8px 16px&quot;) 모두 허용',
            'width/height 미지정 시 부모 요소 크기에 맞춤'
          ]"
        >
          <div style="display: flex; gap: 20px; flex-wrap: wrap; align-items: flex-start">
            <div>
              <Label>기본 (cover, rounded=12)</Label>
              <Image :src="IMGS.mountain" alt="산 풍경" :width="220" :height="160" :rounded="12" />
            </div>
            <div>
              <Label>rounded="50%" (원형)</Label>
              <Image :src="IMGS.cat" alt="고양이" :width="160" :height="160" rounded="50%" />
            </div>
            <div>
              <Label>objectFit="contain"</Label>
              <div
                :style="{
                  width: '200px',
                  height: '160px',
                  background: BOX_BG,
                  borderRadius: '12px',
                  border: '1px solid var(--m2m-pg-comp-border)',
                  overflow: 'hidden'
                }"
              >
                <Image :src="IMGS.food" alt="음식" :width="200" :height="160" object-fit="contain" :skeleton="false" />
              </div>
            </div>
          </div>
        </ComponentSection>

        <!-- ─────────── fallback ─────────── -->
        <ComponentSection
          v-else-if="tab === 'fallback'"
          title="Fallback — 에러 처리"
          description="src 로드 실패 시 fallbackSrc 로 자동 교체. fallbackSrc 도 없으면 아이콘 플레이스홀더 표시."
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Image from \x27m2m-uiux-vue/Image\x27',
            '</script>',
            '',
            '<template>',
            '  <Image :src=&quot;url&quot; alt=&quot;이미지&quot; fallback-src=&quot;/images/default.png&quot; />',
            '  &lt;!-- fallback-src 없으면 내장 플레이스홀더 --&gt;',
            '  <Image :src=&quot;brokenUrl&quot; alt=&quot;이미지&quot; />',
            '</template>'
          ]"
          :notes="[
            'src 실패 → fallbackSrc 시도 → 그것도 실패 → 오류 플레이스홀더',
            'fallbackSrc 는 로컬 경로 · 외부 URL 모두 허용'
          ]"
        >
          <div style="display: flex; gap: 32px; flex-wrap: wrap; align-items: flex-start">
            <div>
              <Label>fallbackSrc 있음 — 대체 이미지로 교체</Label>
              <div style="display: flex; gap: 12px; align-items: flex-start">
                <div>
                  <p style="margin: 0 0 6px; font-size: 11px; color: var(--m2m-pg-comp-text-muted)">정상 src</p>
                  <Image
                    :key="`ok-${fbKey}`"
                    :src="broken ? IMGS.broken : IMGS.city"
                    alt="도시 건물"
                    :fallback-src="IMGS.fallback"
                    :width="160"
                    :height="120"
                    :rounded="10"
                  />
                </div>
                <div style="display: flex; align-items: center; padding-top: 44px">
                  <component :is="ArrowGlyph" />
                </div>
                <div>
                  <p style="margin: 0 0 6px; font-size: 11px; color: var(--m2m-pg-comp-text-muted)">
                    src 깨짐 → fallbackSrc 자동 표시
                  </p>
                  <Image
                    :key="`err-${fbKey}`"
                    :src="IMGS.broken"
                    alt="깨진 이미지"
                    :fallback-src="IMGS.fallback"
                    :width="160"
                    :height="120"
                    :rounded="10"
                  />
                </div>
              </div>
              <div style="display: flex; gap: 8px; margin-top: 12px">
                <button
                  type="button"
                  style="
                    padding: 7px 14px;
                    border-radius: 7px;
                    font-size: 12px;
                    cursor: pointer;
                    border: none;
                    background: var(--m2m-pg-error);
                    color: #fff;
                  "
                  @click="breakSrc"
                >
                  🔴 src 깨트리기
                </button>
                <button type="button" :style="{...btnGhost, fontSize: '12px', padding: '7px 14px'}" @click="resetFb">
                  ↺ 초기화
                </button>
              </div>
            </div>

            <div>
              <Label>fallbackSrc 없음 — 오류 플레이스홀더 표시</Label>
              <Image :src="IMGS.broken" alt="깨진 이미지" :width="200" :height="160" :rounded="10" />
              <p style="margin: 8px 0 0; font-size: 11px; color: var(--m2m-pg-comp-text-muted)">
                아이콘 + 안내 메시지로 UX 보호
              </p>
            </div>
          </div>
        </ComponentSection>

        <!-- ─────────── skeleton ─────────── -->
        <ComponentSection
          v-else-if="tab === 'skeleton'"
          title="Skeleton — 로딩 상태 UX"
          description="이미지 로드 중 Shimmer 스켈레톤을 표시하고, 완료 시 페이드인 전환합니다."
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Image from \x27m2m-uiux-vue/Image\x27',
            '</script>',
            '',
            '<template>',
            '  &lt;!-- skeleton · fade-in 둘 다 기본값 true --&gt;',
            '  <Image :src=&quot;url&quot; alt=&quot;이미지&quot; skeleton fade-in />',
            '  <Image :src=&quot;url&quot; alt=&quot;이미지&quot; :skeleton=&quot;false&quot; :fade-in=&quot;false&quot; />',
            '</template>'
          ]"
          :notes="['Shimmer 키프레임은 스타일시트에 1회만 주입 (성능 영향 없음)', 'fadeIn 은 opacity 0 → 1 전환']"
        >
          <div>
            <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 16px">
              <button
                type="button"
                style="
                  padding: 8px 16px;
                  border-radius: 8px;
                  font-size: 12px;
                  font-weight: 600;
                  cursor: pointer;
                  border: none;
                  background: var(--m2m-pg-brand);
                  color: #fff;
                "
                @click="skNonce++"
              >
                ↺ 새로고침 — 스켈레톤 다시 보기
              </button>
              <span style="font-size: 11px; color: var(--m2m-pg-comp-text-muted)">
                캐시 우회로 로딩 상태를 재현합니다
              </span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; max-width: 600px">
              <Image
                v-for="(src, i) in SK_LIST"
                :key="`${skNonce}-${i}`"
                :src="`${src}?_=${skNonce}-${i}`"
                :alt="`이미지 ${i + 1}`"
                width="100%"
                :height="120"
                :rounded="10"
                skeleton
                fade-in
              />
            </div>

            <div style="margin-top: 20px; display: flex; gap: 20px">
              <div>
                <Label>skeleton=true (기본)</Label>
                <Image
                  :key="`sk-${skNonce}`"
                  :src="`${IMGS.mountain}?_=${skNonce}-a`"
                  alt="스켈레톤 O"
                  :width="180"
                  :height="120"
                  :rounded="10"
                  skeleton
                />
              </div>
              <div>
                <Label>skeleton=false</Label>
                <Image
                  :key="`nosk-${skNonce}`"
                  :src="`${IMGS.mountain}?_=${skNonce}-b`"
                  alt="스켈레톤 X"
                  :width="180"
                  :height="120"
                  :rounded="10"
                  :skeleton="false"
                />
              </div>
            </div>
          </div>
        </ComponentSection>

        <!-- ─────────── lazy ─────────── -->
        <ComponentSection
          v-else-if="tab === 'lazy'"
          title="Lazy Loading — 지연 로딩"
          description="loading='lazy' 가 기본값. 뷰포트에 진입할 때 이미지를 로드해 초기 성능을 개선합니다."
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            `import Image, {IMAGE_LOADING} from \x27m2m-uiux-vue/Image\x27`,
            '</script>',
            '',
            '<template>',
            '  &lt;!-- LAZY 가 기본값 --&gt;',
            '  <Image :src=&quot;url&quot; alt=&quot;이미지&quot; :loading=&quot;IMAGE_LOADING[\x27LAZY\x27]&quot; />',
            '  <Image :src=&quot;url&quot; alt=&quot;히어로&quot; :loading=&quot;IMAGE_LOADING[\x27EAGER\x27]&quot; />',
            '</template>'
          ]"
          :notes="['native lazy loading 활용', 'Above the fold 이미지는 IMAGE_LOADING[\x27EAGER\x27] 권장']"
        >
          <div>
            <p style="margin: 0 0 12px; font-size: 12px; color: var(--m2m-pg-comp-text-sub); line-height: 1.7">
              <component :is="Code">loading="lazy"</component>
              기본 적용. 스크롤해서 뷰포트에 진입할 때 이미지를 로드합니다. DevTools → Network 탭에서 확인할 수
              있습니다.
            </p>
            <div
              style="
                height: 320px;
                overflow-y: auto;
                border: 1px solid var(--m2m-pg-comp-border);
                border-radius: 12px;
                padding: 16px;
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 12px;
              "
            >
              <div v-for="(img, i) in LAZY_IMGS" :key="i">
                <p
                  style="margin: 0 0 4px; font-size: 10px; font-family: monospace; color: var(--m2m-pg-comp-text-muted)"
                >
                  loading="lazy" — #{{ i + 1 }}
                </p>
                <Image
                  :src="img.src"
                  :alt="img.alt"
                  width="100%"
                  :height="140"
                  :rounded="10"
                  :loading="IMAGE_LOADING['LAZY']"
                />
              </div>
            </div>
            <p style="margin: 10px 0 0; font-size: 11px; color: var(--m2m-pg-comp-text-muted)">
              ↑ 스크롤하여 하단 이미지 로딩 확인
            </p>
          </div>
        </ComponentSection>

        <!-- ─────────── objectFit ─────────── -->
        <ComponentSection
          v-else-if="tab === 'objectFit'"
          title="objectFit — 이미지 크기 조정"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Image from \x27m2m-uiux-vue/Image\x27',
            '</script>',
            '',
            '<template>',
            '  &lt;!-- cover: 잘라서 채움 (기본) --&gt;',
            '  <Image :src=&quot;url&quot; alt=&quot;예시&quot; object-fit=&quot;cover&quot; />',
            '  &lt;!-- contain: 비율 유지, 여백 생김 --&gt;',
            '  <Image :src=&quot;url&quot; alt=&quot;예시&quot; object-fit=&quot;contain&quot; />',
            '  &lt;!-- fill: 비율 무시, 꽉 채움 --&gt;',
            '  <Image :src=&quot;url&quot; alt=&quot;예시&quot; object-fit=&quot;fill&quot; />',
            '  &lt;!-- none: 원본 크기 그대로 --&gt;',
            '  <Image :src=&quot;url&quot; alt=&quot;예시&quot; object-fit=&quot;none&quot; />',
            '  &lt;!-- scale-down: contain vs none 중 작은 것 --&gt;',
            '  <Image :src=&quot;url&quot; alt=&quot;예시&quot; object-fit=&quot;scale-down&quot; />',
            '</template>'
          ]"
          :notes="['cover — 썸네일 · 카드 · 아바타에 주로 사용']"
        >
          <div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px">
              <button v-for="f in FITS" :key="f" type="button" :style="ofBtnStyle(ofFit === f)" @click="ofFit = f">
                {{ f }}
              </button>
            </div>

            <div style="display: flex; gap: 16px; flex-wrap: wrap">
              <div
                v-for="(it, i) in [
                  {src: IMGS.cat, label: '세로 비율 (고양이)'},
                  {src: IMGS.mountain, label: '가로 비율 (산)'}
                ]"
                :key="i"
              >
                <p style="margin: 0 0 6px; font-size: 11px; color: var(--m2m-pg-comp-text-muted)">{{ it.label }}</p>
                <div
                  style="
                    width: 200px;
                    height: 160px;
                    border: 2px dashed var(--m2m-pg-comp-border);
                    border-radius: 10px;
                    overflow: hidden;
                    background: var(--m2m-pg-comp-bg-subtle);
                  "
                >
                  <Image
                    :src="it.src"
                    alt="objectFit 예시"
                    :width="200"
                    :height="160"
                    :object-fit="ofFit"
                    :skeleton="false"
                  />
                </div>
              </div>
            </div>

            <p style="margin: 12px 0 0; font-size: 12px; color: var(--m2m-pg-comp-text-sub)">
              현재 적용 중: <component :is="Code">objectFit="{{ ofFit }}"</component>
            </p>
          </div>
        </ComponentSection>

        <!-- ─────────── 비교 ─────────── -->
        <ComponentSection
          v-else-if="tab === '비교'"
          title="<img> vs Image 비교"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Image from \x27m2m-uiux-vue/Image\x27',
            '</script>',
            '',
            '<template>',
            '  &lt;!-- 단순 img --&gt;',
            '  <img :src=&quot;url&quot; />',
            '  &lt;!-- Image 컴포넌트 — alt 필수, fallback · skeleton · fade-in 내장 --&gt;',
            '  <Image :src=&quot;url&quot; alt=&quot;필수&quot; fallback-src=&quot;/fallback.png&quot; skeleton fade-in />',
            '</template>'
          ]"
          :notes="['규모가 있는 프로젝트일수록 Image 사용 권장', 'alt 누락 시 TypeScript 컴파일 에러 (접근성 강제)']"
        >
          <div style="overflow-x: auto; width: 100%">
            <table style="width: 100%; border-collapse: collapse; font-size: 12px">
              <thead>
                <tr
                  style="background: var(--m2m-pg-comp-bg-subtle); border-bottom: 2px solid var(--m2m-pg-comp-border)"
                >
                  <th
                    v-for="(hh, i) in ['기능', '단순 <img>', 'Image 컴포넌트']"
                    :key="hh"
                    :style="{...thStyle, color: i === 2 ? 'var(--m2m-pg-brand)' : 'var(--m2m-pg-comp-text-sub)'}"
                  >
                    {{ hh }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="([feat, img, app], i) in COMPARE_ROWS"
                  :key="feat"
                  :style="{
                    borderBottom: '1px solid var(--m2m-pg-comp-border)',
                    background: i % 2 === 1 ? 'var(--m2m-pg-comp-bg-subtle)' : 'transparent'
                  }"
                >
                  <td :style="{...tdStyle, fontWeight: 600, color: 'var(--m2m-pg-comp-text)'}">{{ feat }}</td>
                  <td :style="{...tdStyle, color: 'var(--m2m-pg-comp-text-muted)'}">{{ img }}</td>
                  <td :style="{...tdStyle, color: 'var(--m2m-pg-comp-text)'}">{{ app }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ComponentSection>

        <!-- ─────────── props ─────────── -->
        <ComponentSection
          v-else-if="tab === 'props'"
          title="Image Props"
          :code="[
            'interface ImageProps {',
            '  src: string   // 필수',
            '  alt: string   // 필수 (접근성)',
            '  fallbackSrc?: string',
            '  width?: number | string',
            '  height?: number | string',
            '  objectFit?: CSSProperties[&quot;objectFit&quot;]',
            '  rounded?: number | string',
            '  skeleton?: boolean   // 기본 true',
            '  fadeIn?: boolean     // 기본 true',
            '  loading?: &quot;lazy&quot; | &quot;eager&quot;   // 기본 &quot;lazy&quot;',
            '}'
          ]"
        >
          <div style="overflow-x: auto; width: 100%">
            <table style="width: 100%; border-collapse: collapse; font-size: 12px">
              <thead>
                <tr
                  style="background: var(--m2m-pg-comp-bg-subtle); border-bottom: 2px solid var(--m2m-pg-comp-border)"
                >
                  <th v-for="hh in ['Prop', 'Type', 'Req', 'Default', '설명']" :key="hh" :style="thStyle">{{ hh }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(p, i) in PROPS"
                  :key="p.name"
                  :style="{
                    borderBottom: '1px solid var(--m2m-pg-comp-border)',
                    background: i % 2 === 1 ? 'var(--m2m-pg-comp-bg-subtle)' : 'transparent'
                  }"
                >
                  <td :style="tdStyle">
                    <component :is="Code">{{ p.name }}</component>
                  </td>
                  <td :style="{...tdStyle, fontFamily: 'monospace', fontSize: '11px', color: 'var(--m2m-pg-info)'}">
                    {{ p.type }}
                  </td>
                  <td :style="{...tdStyle, textAlign: 'center'}">
                    <span v-if="p.req" style="color: var(--m2m-pg-brand); font-weight: 700">✓</span>
                    <span v-else style="color: var(--m2m-pg-comp-text-disabled)">—</span>
                  </td>
                  <td :style="{...tdStyle, fontFamily: 'monospace', fontSize: '11px', color: 'var(--m2m-pg-brand)'}">
                    {{ p.def }}
                  </td>
                  <td :style="{...tdStyle, color: 'var(--m2m-pg-comp-text-sub)', lineHeight: 1.6}">{{ p.desc }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
