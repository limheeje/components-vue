<script lang="ts">
import type {DialogDirection} from '~/components/Dialog/Dialog.type'

const cap = (s: string) => s.replace(/(^|-)([a-z])/g, (_m, _p, c: string) => c.toUpperCase())

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'

// ── body 스크롤 잠금 (lockScroll 을 켠 다이얼로그 수만 카운트) ──────────
let lockCount = 0
let prevOverflow = ''

function acquireScrollLock() {
  if (lockCount === 0) {
    prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  lockCount += 1
}
function releaseScrollLock() {
  lockCount = Math.max(0, lockCount - 1)
  if (lockCount === 0) {
    document.body.style.overflow = prevOverflow
  }
}

/** 드로어가 나오는 방향 → 닫히는 축과 부호 */
function axisFor(direction: DialogDirection): {axis: 'x' | 'y'; sign: 1 | -1} {
  switch (direction) {
    case 'top':
      return {axis: 'y', sign: -1}
    case 'left':
      return {axis: 'x', sign: -1}
    case 'right':
      return {axis: 'x', sign: 1}
    default:
      return {axis: 'y', sign: 1}
  }
}
</script>

<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import Icon from '~/components/Icon'
import {DIALOG_VARIANT} from '~/components/Dialog/Dialog.constant'
import type {DialogSize, DialogVariant} from '~/components/Dialog/Dialog.type'
import styles from '~/components/Dialog/Dialog.module.scss'

defineOptions({inheritAttrs: false})

const props = defineProps<{
  onClose: () => void
  title?: string
  description?: string
  size: DialogSize
  variant: DialogVariant
  direction: DialogDirection
  lockScroll: boolean
  handle: boolean
  swipeToClose: boolean
  closeThreshold: number
  closeOnBackdrop: boolean
  closeOnEsc: boolean
  hideClose: boolean
  ariaLabel?: string
  classNames?: string | string[]
  hasFooter: boolean
  hasBody: boolean
}>()

const isDrawer = computed(() => props.variant === DIALOG_VARIANT.DRAWER)
const motion = computed(() => axisFor(props.direction))

// 스와이프 속도(px/ms) 가 이 값을 넘고 최소 이동량을 채우면, 임계값(closeThreshold) 거리에
// 못 미쳐도 "빠르게 내림/치기" 로 간주해 닫는다. iOS 시트류가 쓰는 flick 감지와 동일한 개념.
const FLICK_VELOCITY = 0.5 // px/ms (=500px/s)
const FLICK_MIN_OFFSET = 24 // px — 미세한 흔들림이 flick 으로 오인되지 않도록 하는 최소 이동량

const panelRef = ref<HTMLDivElement>()
let dragStart: {x: number; y: number} | null = null
let lastMove: {time: number; offset: number} | null = null
let velocity = 0
let exitTimer: ReturnType<typeof setTimeout> | undefined
let restore: HTMLElement | null = null
let raf1 = 0
let raf2 = 0

const entered = ref(false)
const exiting = ref(false)
const drag = ref<{offset: number; active: boolean}>({offset: 0, active: false})

// 1) body 스크롤 잠금 (해제는 언마운트 = 애니메이션 종료 후)
onMounted(() => {
  if (props.lockScroll) acquireScrollLock()
})
onBeforeUnmount(() => {
  if (props.lockScroll) releaseScrollLock()
})

// 2) 스크롤 잠금 레이아웃이 반영된 뒤에야 진입 애니메이션 시작 (더블 rAF).
//    그 전까지 오버레이 opacity 0 · 패널은 화면 밖/투명이라 아무것도 안 보임.
onMounted(() => {
  raf1 = requestAnimationFrame(() => {
    raf2 = requestAnimationFrame(() => (entered.value = true))
  })
})
onBeforeUnmount(() => {
  cancelAnimationFrame(raf1)
  cancelAnimationFrame(raf2)
})

// 닫기 요청 — 드로어는 퇴장 애니메이션이 끝난 뒤 onClose (그 후 언마운트 → 스크롤 복원)
function requestClose() {
  if (exiting.value) return
  if (!isDrawer.value) {
    props.onClose()
    return
  }
  exiting.value = true
  exitTimer = setTimeout(props.onClose, 340)
}
onBeforeUnmount(() => clearTimeout(exitTimer))

// ESC
function onKey(e: KeyboardEvent) {
  if (props.closeOnEsc && e.key === 'Escape') requestClose()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

// 포커스 트랩 + 열기 전 포커스 복원
function onPanelKeydown(e: KeyboardEvent) {
  if (e.key !== 'Tab') return
  const panel = panelRef.value
  if (!panel) return
  const nodes = panel.querySelectorAll<HTMLElement>(FOCUSABLE)
  if (nodes.length === 0) {
    e.preventDefault()
    return
  }
  const first = nodes[0]!
  const last = nodes[nodes.length - 1]!
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}
onMounted(() => {
  const panel = panelRef.value
  if (!panel) return
  restore = document.activeElement as HTMLElement | null
  panel.focus()
  panel.addEventListener('keydown', onPanelKeydown)
})
onBeforeUnmount(() => {
  panelRef.value?.removeEventListener('keydown', onPanelKeydown)
  restore?.focus?.()
})

// ── 스와이프 제스처 (드로어) ──────────────────────────────
function panelExtent() {
  const el = panelRef.value
  if (!el) return 1
  return motion.value.axis === 'y' ? el.offsetHeight : el.offsetWidth
}

function onPointerDown(e: PointerEvent) {
  if (!isDrawer.value || !props.swipeToClose) return
  if ((e.target as HTMLElement).closest('button,a,input,textarea,select')) return
  dragStart = {x: e.clientX, y: e.clientY}
  lastMove = {time: e.timeStamp, offset: 0}
  velocity = 0
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  drag.value = {offset: 0, active: true}
}
function onPointerMove(e: PointerEvent) {
  if (!dragStart) return
  const raw = motion.value.axis === 'y' ? e.clientY - dragStart.y : e.clientX - dragStart.x
  const offset = Math.max(0, raw * motion.value.sign)
  drag.value = {offset, active: true}
  if (lastMove) {
    const dt = e.timeStamp - lastMove.time
    // 너무 촘촘한 샘플(dt≈0)은 속도가 튀므로 스킵하고 다음 샘플에서 계산
    if (dt > 4) {
      velocity = (offset - lastMove.offset) / dt
      lastMove = {time: e.timeStamp, offset}
    }
  }
}
function onPointerUp() {
  if (!dragStart) return
  dragStart = null
  const {offset} = drag.value
  const progress = offset / panelExtent()
  const isFlick = velocity >= FLICK_VELOCITY && offset >= FLICK_MIN_OFFSET
  drag.value = {offset: 0, active: false}
  if (progress >= props.closeThreshold || isFlick) requestClose()
}

// ── 스타일 계산 ──────────────────────────────────────────
const translate = (v: string) => (motion.value.axis === 'y' ? `translateY(${v})` : `translateX(${v})`)

const panelStyle = computed(() => {
  if (!isDrawer.value) return undefined
  const {sign} = motion.value
  let transform: string
  if (!entered.value || exiting.value) transform = translate(`${sign * 100}%`)
  else if (drag.value.active) transform = translate(`${sign * drag.value.offset}px`)
  else transform = translate('0')
  return drag.value.active ? {transform, transition: 'none'} : {transform}
})

const overlayOpacity = computed(() => {
  if (!entered.value || exiting.value) return 0
  if (drag.value.active) return Math.max(0, 1 - drag.value.offset / panelExtent())
  return 1
})

const backdropClass = computed(() =>
  cx(
    styles.bsDialogBackdrop,
    isDrawer.value && styles.bsDialogVariantDrawer,
    isDrawer.value && styles[`bsDialogDirection${cap(props.direction)}`],
    drag.value.active && styles['is-dragging']
  )
)

function onBackdrop(e: MouseEvent) {
  if (props.closeOnBackdrop && e.target === e.currentTarget) requestClose()
}
</script>

<template>
  <div :class="backdropClass" @mousedown="onBackdrop">
    <div :class="styles.bsDialogOverlay" :style="{opacity: overlayOpacity}" aria-hidden="true" />
    <div
      ref="panelRef"
      v-bind="$attrs"
      role="dialog"
      aria-modal="true"
      :aria-label="title == null ? ariaLabel : undefined"
      :tabindex="-1"
      :style="panelStyle"
      :class="
        cx(
          styles.bsDialogPanel,
          styles[`bsDialogSize${cap(size)}`],
          entered && !exiting && styles['is-open'],
          resolveClassNames(classNames)
        )
      "
    >
      <!-- 드래그(스와이프투클로즈) 히트영역은 핸들존 + 헤더 100%. 핸들러가 자체 가드 -->
      <div
        v-if="isDrawer && handle"
        :class="styles.bsDialogHandleZone"
        aria-hidden="true"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
      >
        <span :class="styles.bsDialogHandle" />
      </div>

      <div
        v-if="title != null || $slots.title || !hideClose"
        :class="styles.bsDialogHeader"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
      >
        <div :class="styles.bsDialogHeading">
          <h2 v-if="title != null || $slots.title" :class="styles.bsDialogTitle">
            <slot name="title">{{ title }}</slot>
          </h2>
          <p v-if="description != null || $slots.description" :class="styles.bsDialogDescription">
            <slot name="description">{{ description }}</slot>
          </p>
        </div>
        <button v-if="!hideClose" type="button" :class="styles.bsDialogClose" aria-label="닫기" @click="requestClose">
          <Icon name="close" :size="18" />
        </button>
      </div>

      <div v-if="hasBody" :class="styles.bsDialogBody"><slot /></div>

      <div v-if="hasFooter" :class="styles.bsDialogFooter"><slot name="footer" /></div>
    </div>
  </div>
</template>
