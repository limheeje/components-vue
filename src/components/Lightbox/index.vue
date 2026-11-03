<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref, watch} from 'vue'

import {cx} from '~/lib/cx'

import Icon from '~/components/Icon'
import {LIGHTBOX_DEFAULT} from '~/components/Lightbox/Lightbox.constant'
import type {LightboxProps} from '~/components/Lightbox/Lightbox.type'
import styles from '~/components/Lightbox/Lightbox.module.scss'

const {ZOOM_MIN, ZOOM_MAX, ZOOM_STEP, ROTATE_STEP} = LIGHTBOX_DEFAULT

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<LightboxProps>(), {
  downloadable: true
})

const emit = defineEmits<{close: []; change: [number]}>()

const zoom = ref(1)
const rotate = ref(0)

// 확대 시 스크롤로 이미지 전체를 볼 수 있도록 transform 대신 실제 레이아웃 크기를 계산한다.
const natural = ref<{w: number; h: number} | null>(null)
const viewport = ref({w: window.innerWidth, h: window.innerHeight})

function onResize() {
  viewport.value = {w: window.innerWidth, h: window.innerHeight}
}

function onImageLoad(e: Event) {
  const img = e.target as HTMLImageElement
  natural.value = {w: img.naturalWidth, h: img.naturalHeight}
}

/** zoom=1 기준 표시 크기 (뷰포트 80% 안에 contain, 원본보다 키우지 않음) */
const baseSize = computed(() => {
  if (!natural.value || !natural.value.w || !natural.value.h) return null
  const {w, h} = natural.value
  const fit = Math.min(1, (viewport.value.w * 0.8) / w, (viewport.value.h * 0.8) / h)
  return {w: w * fit, h: h * fit}
})

const sideways = computed(() => Math.abs(rotate.value / 90) % 2 === 1)

/** 회전·확대가 반영된 스크롤 영역 크기 */
const canvasStyle = computed(() => {
  if (!baseSize.value) return undefined
  const {w, h} = baseSize.value
  const z = zoom.value
  return {width: `${(sideways.value ? h : w) * z}px`, height: `${(sideways.value ? w : h) * z}px`}
})

const imageStyle = computed(() => {
  if (!baseSize.value) return undefined
  return {
    width: `${baseSize.value.w * zoom.value}px`,
    height: `${baseSize.value.h * zoom.value}px`,
    transform: `translate(-50%, -50%) rotate(${rotate.value}deg)`
  }
})

function go(next: number) {
  emit('change', Math.max(0, Math.min(props.images.length - 1, next)))
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
  if (e.key === 'ArrowLeft') go(props.index - 1)
  if (e.key === 'ArrowRight') go(props.index + 1)
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('resize', onResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', onResize)
})

watch(
  () => props.index,
  () => {
    zoom.value = 1
    rotate.value = 0
    natural.value = null
  }
)

const src = computed(() => props.images[props.index] ?? '')

function download() {
  const a = document.createElement('a')
  a.href = src.value
  a.download = 'image'
  a.click()
}

function onOverlayClick(e: MouseEvent) {
  if (e.target === e.currentTarget) emit('close')
}
</script>

<template>
  <div
    v-bind="$attrs"
    :class="styles.bsLightboxOverlay"
    role="dialog"
    aria-modal="true"
    aria-label="이미지 미리보기"
    @click="onOverlayClick"
  >
    <div :class="styles.bsLightboxToolbar">
      <button
        type="button"
        :class="styles.bsLightboxToolButton"
        aria-label="확대"
        @click="zoom = Math.min(ZOOM_MAX, zoom + ZOOM_STEP)"
      >
        <Icon name="zoom-in" :size="18" />
      </button>
      <button
        type="button"
        :class="styles.bsLightboxToolButton"
        aria-label="축소"
        @click="zoom = Math.max(ZOOM_MIN, zoom - ZOOM_STEP)"
      >
        <Icon name="zoom-out" :size="18" />
      </button>
      <button
        type="button"
        :class="styles.bsLightboxToolButton"
        aria-label="회전"
        @click="rotate = rotate + ROTATE_STEP"
      >
        <Icon name="rotate-cw" :size="18" />
      </button>
      <button
        v-if="downloadable"
        type="button"
        :class="styles.bsLightboxToolButton"
        aria-label="다운로드"
        @click="download"
      >
        <Icon name="download" :size="18" />
      </button>
      <button type="button" :class="styles.bsLightboxToolButton" aria-label="닫기" @click="emit('close')">
        <Icon name="close" :size="18" />
      </button>
    </div>

    <div v-if="images.length > 1" :class="styles.bsLightboxCounter">{{ index + 1 }} / {{ images.length }}</div>

    <button
      v-if="images.length > 1 && index > 0"
      type="button"
      :class="cx(styles.bsLightboxNav, styles.bsLightboxNavPrev)"
      aria-label="이전"
      @click="go(index - 1)"
    >
      <Icon name="chevron-left" :size="22" />
    </button>
    <button
      v-if="images.length > 1 && index < images.length - 1"
      type="button"
      :class="cx(styles.bsLightboxNav, styles.bsLightboxNavNext)"
      aria-label="다음"
      @click="go(index + 1)"
    >
      <Icon name="chevron-right" :size="22" />
    </button>

    <div :class="styles.bsLightboxStage" @click="onOverlayClick">
      <div :class="styles.bsLightboxCanvas" :style="canvasStyle">
        <img
          :src="src"
          alt=""
          :class="cx(styles.bsLightboxImage, baseSize && styles.bsLightboxImageSized)"
          :style="imageStyle"
          @load="onImageLoad"
          @click.stop
        />
      </div>
    </div>

    <div v-if="images.length > 1" :class="styles.bsLightboxThumbs">
      <img
        v-for="(img, i) in images"
        :key="img + i"
        :src="img"
        alt=""
        :class="cx(styles.bsLightboxThumb, i === index && styles.bsLightboxThumbActive)"
        @click="go(i)"
      />
    </div>
  </div>
</template>
