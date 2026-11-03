<script setup lang="ts">
import {computed, ref} from 'vue'

import Button from '~/components/Button'
import ProgressBar from '~/components/ProgressBar'

import PageHeader from '~/demo/components/PageHeader.vue'

const BASE_FONT_SIZE = 16
const MIN_FONT_SIZE = 12
const MAX_FONT_SIZE = 22
const remPx = (fs: number, px: number) => (fs / 16) * px

const copiedValue = ref<string | null>(null)
function copy(value: string) {
  navigator.clipboard?.writeText(value).catch(() => {})
  copiedValue.value = value
  setTimeout(() => (copiedValue.value = null), 1200)
}
function copyStyle(value: string) {
  const done = copiedValue.value === value
  return `font-family:'Fira Mono','Consolas',monospace;font-size:11px;padding:2px 7px;border-radius:5px;cursor:pointer;white-space:nowrap;border:1px solid ${done ? 'var(--m2m-pg-success-border)' : 'var(--m2m-pg-brand-border)'};background:${done ? 'var(--m2m-pg-success-bg)' : 'var(--m2m-pg-brand-light)'};color:${done ? 'var(--m2m-pg-success)' : 'var(--m2m-pg-brand)'}`
}

const COLOR_GROUPS: {group: string; vars: string[]}[] = [
  {
    group: 'Brand',
    vars: [
      '--m2m-pg-brand',
      '--m2m-pg-brand-hover',
      '--m2m-pg-brand-active',
      '--m2m-pg-brand-light',
      '--m2m-pg-brand-border'
    ]
  },
  {
    group: 'Surface',
    vars: ['--m2m-pg-comp-bg', '--m2m-pg-comp-bg-subtle', '--m2m-pg-comp-bg-hover', '--m2m-pg-comp-bg-disabled']
  },
  {group: 'Border', vars: ['--m2m-pg-comp-border', '--m2m-pg-comp-border-sub']},
  {
    group: 'Text',
    vars: ['--m2m-pg-comp-text', '--m2m-pg-comp-text-sub', '--m2m-pg-comp-text-muted', '--m2m-pg-comp-text-disabled']
  },
  {group: 'Status', vars: ['--m2m-pg-success', '--m2m-pg-warning', '--m2m-pg-error', '--m2m-pg-info']}
]

const TYPO: [string, string][] = [
  ['Title1/Bold', '22 / 30 · 700'],
  ['Title2/Bold', '18 / 26 · 700'],
  ['Title3/Semibold', '16 / 24 · 600'],
  ['Head/Semibold', '14 / 20 · 600'],
  ['Body/Regular', '13 / 19 · 400'],
  ['Sub/Regular', '12 / 17 · 400'],
  ['Caption/Regular', '11 / 15 · 400'],
  ['Micro/Bold', '10 / 14 · 700']
]

const SCALE = [1, 2, 4, 6, 8, 12, 16, 24, 32, 48]

const fontSize = ref(BASE_FONT_SIZE)
const trackRef = ref<HTMLElement>()

const scalePct = computed(() => ((fontSize.value - MIN_FONT_SIZE) / (MAX_FONT_SIZE - MIN_FONT_SIZE)) * 100)
const delta = computed(() => Math.round((fontSize.value / 16) * 100))

function setFromClientX(clientX: number) {
  const el = trackRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
  fontSize.value = Math.round(MIN_FONT_SIZE + ratio * (MAX_FONT_SIZE - MIN_FONT_SIZE))
}
function onTrackDown(e: PointerEvent) {
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  setFromClientX(e.clientX)
}
function onTrackMove(e: PointerEvent) {
  if (e.buttons === 1) setFromClientX(e.clientX)
}
function onTrackKey(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') fontSize.value = Math.max(MIN_FONT_SIZE, fontSize.value - 1)
  if (e.key === 'ArrowRight' || e.key === 'ArrowUp') fontSize.value = Math.min(MAX_FONT_SIZE, fontSize.value + 1)
}

const sectionHead = 'border-bottom:1px solid var(--m2m-pg-border);padding-bottom:10px;margin-bottom:20px'

function isLightColor(hex: string) {
  const h = hex.trim().replace('#', '')
  let r = 0
  let g = 0
  let b = 0
  if (/^[\da-f]{3}$/i.test(h)) [r, g, b] = [...h].map((c) => parseInt(c + c, 16))
  else if (/^[\da-f]{6}$/i.test(h))
    [r, g, b] = [h.slice(0, 2), h.slice(2, 4), h.slice(4, 6)].map((c) => parseInt(c, 16))
  return (r * 299 + g * 587 + b * 114) / 1000 > 160
}

/** 원시 색상 파레트 — 시맨틱 토큰(--m2m-pg-*)의 근간이 되는 스케일 (문서용). */
const PALETTE: {group: string; desc: string; colors: {name: string; hex: string; usage: string}[]}[] = [
  {
    group: 'Blue (브랜드)',
    desc: '딥 네이비 #023894 를 500 으로 하는 브랜드 스케일',
    colors: [
      {name: 'blue-50', hex: '#eef3fb', usage: '연한 배경 · hover 영역 (brand-light)'},
      {name: 'blue-100', hex: '#d9e4f5', usage: '선택 영역 배경 (brand-sub)'},
      {name: 'blue-200', hex: '#a8c0e6', usage: '테두리 · 비활성 (brand-border)'},
      {name: 'blue-300', hex: '#6f9bd6', usage: '보조 강조'},
      {name: 'blue-400', hex: '#2f66b8', usage: 'hover 근처'},
      {name: 'blue-500', hex: '#023894', usage: 'Primary 기본 (brand)'},
      {name: 'blue-600', hex: '#012f7a', usage: 'hover (brand-hover 계열)'},
      {name: 'blue-700', hex: '#01285f', usage: 'active / pressed (brand-active)'},
      {name: 'blue-800', hex: '#001d47', usage: '강한 강조'},
      {name: 'blue-900', hex: '#00132f', usage: '텍스트용 극강조'}
    ]
  },
  {
    group: 'Gray (중립)',
    desc: '텍스트 · 배경 · 경계선용 중립 스케일',
    colors: [
      {name: 'gray-0', hex: '#ffffff', usage: '카드 · 흰 배경'},
      {name: 'gray-50', hex: '#f6f8fb', usage: '페이지 배경 (bg-page)'},
      {name: 'gray-100', hex: '#eef1f6', usage: '비활성 영역 · 헤더 (bg-subtle)'},
      {name: 'gray-200', hex: '#dde2ec', usage: '경계선 기본 (border)'},
      {name: 'gray-300', hex: '#c3cbdb', usage: '경계선 진한 (border-sub)'},
      {name: 'gray-400', hex: '#99a2ba', usage: 'placeholder (text-placeholder)'},
      {name: 'gray-500', hex: '#667089', usage: '보조 텍스트 · 아이콘 (text-muted)'},
      {name: 'gray-600', hex: '#414a63', usage: '일반 텍스트 (text-sub)'},
      {name: 'gray-700', hex: '#2c3550', usage: '강조 텍스트'},
      {name: 'gray-800', hex: '#14213d', usage: '헤딩 (text-primary)'},
      {name: 'gray-900', hex: '#0b1226', usage: '최강조'}
    ]
  },
  {
    group: 'Status',
    desc: '성공 · 경고 · 오류 · 정보',
    colors: [
      {name: 'success-500', hex: '#16a34a', usage: '성공 기본'},
      {name: 'success-700', hex: '#15803d', usage: '성공 진한 (-dark)'},
      {name: 'warning-500', hex: '#f59e0b', usage: '경고 기본'},
      {name: 'warning-700', hex: '#d97706', usage: '경고 진한 (-dark)'},
      {name: 'error-500', hex: '#ef4444', usage: '오류 기본'},
      {name: 'error-700', hex: '#dc2626', usage: '오류 진한 (-dark)'},
      {name: 'info-500', hex: '#008cd6', usage: '정보 기본'},
      {name: 'info-700', hex: '#0272ab', usage: '정보 진한 (-dark)'}
    ]
  }
]
</script>

<template>
  <PageHeader
    title="Token"
    component="--m2m-*"
    desc="— 프로젝트 전체가 공유하는 디자인 토큰. 컴포넌트는 --m2m-pg-* CSS 변수만 참조하고, 크기는 rem()·typo() 로 --m2m-font-size 에 비례 스케일됩니다."
  />
  <div class="demo-token">
    <section style="margin-top: 36px">
      <div :style="sectionHead">
        <h3 style="margin: 0; font-size: 14px; font-weight: 700; color: var(--m2m-pg-text-primary)">
          --m2m-font-size — 스케일 기준
        </h3>
        <p style="margin: 4px 0 0; font-size: 12px; line-height: 1.6; color: var(--m2m-pg-text-muted)">
          이 값을 바꾸면 rem() 으로 감싼 모든 치수(폰트·패딩·테두리·반경)가 같은 비율로 커지고 줄어듭니다.
        </p>
      </div>

      <!-- ProgressBar 를 슬라이더로 — 클릭/드래그로 --m2m-font-size 조절 -->
      <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 8px">
        <div
          ref="trackRef"
          role="slider"
          tabindex="0"
          aria-label="--m2m-font-size"
          :aria-valuemin="MIN_FONT_SIZE"
          :aria-valuemax="MAX_FONT_SIZE"
          :aria-valuenow="fontSize"
          :aria-valuetext="`${fontSize}px`"
          style="width: 280px; max-width: 100%; cursor: pointer; touch-action: none"
          @pointerdown="onTrackDown"
          @pointermove="onTrackMove"
          @keydown="onTrackKey"
        >
          <ProgressBar :model-value="scalePct" color="primary" thickness="md" />
        </div>
        <button
          type="button"
          title="클릭하여 복사"
          :style="copyStyle(`--m2m-font-size: ${fontSize}px`)"
          @click="copy(`--m2m-font-size: ${fontSize}px`)"
        >
          {{ copiedValue === `--m2m-font-size: ${fontSize}px` ? '✓ 복사됨' : `--m2m-font-size: ${fontSize}px` }}
        </button>
        <button
          v-if="fontSize !== BASE_FONT_SIZE"
          type="button"
          style="
            font-size: 12px;
            padding: 4px 10px;
            border-radius: 6px;
            cursor: pointer;
            border: 1px solid var(--m2m-pg-comp-border);
            background: transparent;
            color: var(--m2m-pg-comp-text-muted);
          "
          @click="fontSize = BASE_FONT_SIZE"
        >
          16px 리셋
        </button>
      </div>
      <div
        style="
          display: flex;
          justify-content: space-between;
          width: 280px;
          max-width: 100%;
          font-size: 10px;
          font-family: monospace;
          color: var(--m2m-pg-comp-text-muted);
          margin-bottom: 20px;
        "
      >
        <span>{{ MIN_FONT_SIZE }}px</span>
        <span>16px (기준) · {{ delta }}%</span>
        <span>{{ MAX_FONT_SIZE }}px</span>
      </div>

      <!-- bsButton 하나 — --m2m-font-size 를 바꾸면 이 버튼이 비례해서 커진다 -->
      <div :style="{'--m2m-font-size': `${fontSize}px`}">
        <Button variant="primary">rem() 로 스케일되는 버튼 · 현재 {{ fontSize }}px</Button>
      </div>
      <p style="margin: 10px 0 0; font-size: 11px; color: var(--m2m-pg-comp-text-muted)">
        이 버튼은 스타일을 하드코딩하지 않고 <code>rem()</code> · <code>typo()</code> 만 쓰기 때문에, 위 슬라이더로
        <code>--m2m-font-size</code> 를 조절하면 폰트·패딩·높이·반경이 그대로 {{ delta }}% 로 스케일됩니다 (<code
          >rem(16px) = {{ remPx(fontSize, 16).toFixed(1) }}px</code
        >).
      </p>
    </section>

    <section style="margin-top: 40px">
      <div :style="sectionHead">
        <h3 style="margin: 0; font-size: 14px; font-weight: 700; color: var(--m2m-pg-text-primary)">
          Palette — 원시 색상
        </h3>
        <p style="margin: 4px 0 0; font-size: 12px; line-height: 1.6; color: var(--m2m-pg-text-muted)">
          시맨틱 토큰의 근간이 되는 색상 스케일. 컴포넌트는 직접 쓰지 않고 아래 --m2m-pg-* 를 통해 참조합니다.
        </p>
      </div>
      <div v-for="g in PALETTE" :key="g.group" style="margin-bottom: 20px">
        <div style="font-size: 11px; font-weight: 700; color: var(--m2m-pg-comp-text-sub); margin-bottom: 4px">
          {{ g.group }}
        </div>
        <div style="font-size: 11px; color: var(--m2m-pg-comp-text-muted); margin-bottom: 8px">{{ g.desc }}</div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px">
          <div
            v-for="c in g.colors"
            :key="c.name"
            style="
              border: 1px solid var(--m2m-pg-comp-border);
              border-radius: 8px;
              overflow: hidden;
              background: var(--m2m-pg-comp-bg);
            "
          >
            <div
              :style="{height: '52px', background: c.hex, display: 'flex', alignItems: 'flex-end', padding: '4px 8px'}"
            >
              <span
                :style="{
                  fontFamily: 'monospace',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: isLightColor(c.hex) ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.6)'
                }"
              >
                {{ c.hex }}
              </span>
            </div>
            <div style="padding: 7px 8px">
              <div style="font-size: 11px; font-weight: 700; color: var(--m2m-pg-comp-text); margin-bottom: 2px">
                {{ c.name }}
              </div>
              <div style="font-size: 10px; line-height: 1.4; color: var(--m2m-pg-comp-text-muted)">{{ c.usage }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section style="margin-top: 40px">
      <div :style="sectionHead">
        <h3 style="margin: 0; font-size: 14px; font-weight: 700">Color Tokens</h3>
        <p style="margin: 3px 0 0; font-size: 12px; color: var(--m2m-pg-comp-text-muted)">
          컴포넌트는 이 --m2m-pg-* 변수만 사용합니다.
        </p>
      </div>
      <div v-for="g in COLOR_GROUPS" :key="g.group" style="margin-bottom: 20px">
        <div
          style="
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: var(--m2m-pg-comp-text-sub);
            margin-bottom: 8px;
          "
        >
          {{ g.group }}
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px">
          <div
            v-for="v in g.vars"
            :key="v"
            style="border: 1px solid var(--m2m-pg-comp-border); border-radius: 8px; overflow: hidden"
          >
            <div :style="{height: '44px', background: `var(${v})`}" />
            <div style="padding: 7px 8px">
              <button type="button" title="클릭하여 복사" :style="copyStyle(v)" @click="copy(v)">
                {{ copiedValue === v ? '✓ 복사됨' : v }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <p style="font-size: 11px; color: var(--m2m-pg-comp-text-muted)">
        status 계열은 <code>-bg</code> / <code>-border</code> / <code>-dark</code> 변형도 있습니다 (예:
        <code>--m2m-pg-error-bg</code>).
      </p>
    </section>

    <section style="margin-top: 36px">
      <div :style="sectionHead">
        <h3 style="margin: 0; font-size: 14px; font-weight: 700">Typography — @include typo('Scale/Weight')</h3>
        <p style="margin: 3px 0 0; font-size: 12px; color: var(--m2m-pg-comp-text-muted)">
          _typography.scss $typo-map. 폰트는 하드코딩하지 않고 이 믹스인으로.
        </p>
      </div>
      <div style="border: 1px solid var(--m2m-pg-comp-border); border-radius: 10px; overflow: hidden">
        <div
          v-for="([name, meta], i) in TYPO"
          :key="name"
          :style="{
            display: 'grid',
            gridTemplateColumns: '160px 120px 1fr',
            alignItems: 'center',
            padding: '10px 14px',
            borderTop: i === 0 ? 'none' : '1px solid var(--m2m-pg-comp-border)'
          }"
        >
          <button type="button" title="클릭하여 복사" :style="copyStyle(name)" @click="copy(name)">
            {{ copiedValue === name ? '✓ 복사됨' : name }}
          </button>
          <span style="font-family: monospace; font-size: 11px; color: var(--m2m-pg-comp-text-muted)">{{ meta }}</span>
          <span
            :style="{
              fontSize: `${Number(meta.split(' / ')[0])}px`,
              fontWeight: Number(meta.split('·')[1]),
              color: 'var(--m2m-pg-comp-text)'
            }"
          >
            다람쥐 헌 쳇바퀴에 타고파 Aa Bb 123
          </span>
        </div>
      </div>
    </section>

    <section style="margin-top: 36px">
      <div :style="sectionHead">
        <h3 style="margin: 0; font-size: 14px; font-weight: 700">Spacing / Radius — rem($px)</h3>
        <p style="margin: 3px 0 0; font-size: 12px; color: var(--m2m-pg-comp-text-muted)">
          모든 px 는 rem() 으로 감쌉니다. calc(var(--m2m-font-size, 16px) / 16 * N)
        </p>
      </div>
      <div style="display: flex; flex-direction: column; gap: 6px">
        <div v-for="n in SCALE" :key="n" style="display: flex; align-items: center; gap: 12px">
          <button type="button" title="클릭하여 복사" :style="copyStyle(`rem(${n}px)`)" @click="copy(`rem(${n}px)`)">
            {{ copiedValue === `rem(${n}px)` ? '✓ 복사됨' : `rem(${n}px)` }}
          </button>
          <div
            :style="{
              height: '10px',
              width: `${n * 4}px`,
              background: 'var(--m2m-pg-brand)',
              opacity: 0.7,
              borderRadius: '3px'
            }"
          />
          <span style="font-size: 11px; color: var(--m2m-pg-comp-text-muted); font-family: monospace"
            >{{ n }}px @16</span
          >
        </div>
      </div>
    </section>
  </div>
</template>
