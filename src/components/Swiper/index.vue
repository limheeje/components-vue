<script setup lang="ts">
import {computed, Fragment, ref, useSlots, watch, watchEffect} from 'vue'
import type {FunctionalComponent, VNode, VNodeChild} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import Icon from '~/components/Icon'
import {SWIPER_DEFAULT, SWIPER_PAGINATION} from '~/components/Swiper/Swiper.constant'
import type {SwiperProps} from '~/components/Swiper/Swiper.type'
import styles from '~/components/Swiper/Swiper.module.scss'

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<SwiperProps>(), {
  autoplay: false,
  loop: false,
  navigation: true,
  pagination: SWIPER_DEFAULT.PAGINATION,
  slidesPerView: SWIPER_DEFAULT.SLIDES_PER_VIEW,
  spaceBetween: SWIPER_DEFAULT.SPACE_BETWEEN
})

const emit = defineEmits<{'update:modelValue': [number]; change: [number]}>()

const Cell = ((p: {node: VNodeChild}) => p.node) as FunctionalComponent<{node: VNodeChild}>

const slots = useSlots()
const slideNodes = computed<VNodeChild[]>(() => {
  if (props.items) return props.items
  const raw = slots.default?.() ?? []
  return raw.flatMap((v: VNode) =>
    v.type === Fragment && Array.isArray(v.children) ? (v.children as VNodeChild[]) : [v]
  )
})

const total = computed(() => slideNodes.value.length)
const spv = computed(() => Math.max(0.5, props.slidesPerView))
const floorSpv = computed(() => Math.floor(spv.value))
const maxIdx = computed(() => Math.max(0, total.value - floorSpv.value))
const gap = computed(() => props.spaceBetween)

const current = ref(props.modelValue ?? 0)

watch(
  () => props.modelValue,
  (v) => {
    if (v !== undefined) current.value = Math.max(0, Math.min(maxIdx.value, v))
  }
)

function move(next: number) {
  current.value = next
  emit('update:modelValue', next)
  emit('change', next)
}

watchEffect((onCleanup) => {
  if (!props.autoplay) return
  const delay = typeof props.autoplay === 'number' ? props.autoplay : SWIPER_DEFAULT.AUTOPLAY_DELAY
  const id = setInterval(() => {
    const c = current.value
    const next = c + 1
    const resolved = next > maxIdx.value ? (props.loop ? 0 : c) : next
    if (resolved !== c) {
      move(resolved)
    }
  }, delay)
  onCleanup(() => clearInterval(id))
})

function goPrev() {
  move(current.value === 0 ? (props.loop ? maxIdx.value : 0) : current.value - 1)
}
function goNext() {
  move(current.value >= maxIdx.value ? (props.loop ? 0 : current.value) : current.value + 1)
}

const canPrev = computed(() => current.value > 0 || props.loop)
const canNext = computed(() => current.value < maxIdx.value || props.loop)

const slideWidth = computed(() =>
  gap.value > 0
    ? `calc((100% - ${gap.value * Math.max(0, floorSpv.value - 1)}px) / ${spv.value})`
    : `calc(100% / ${spv.value})`
)
const translate = computed(() => `calc(-${current.value} * (100% + ${gap.value}px) / ${spv.value})`)
const progress = computed(() => (maxIdx.value === 0 ? 1 : current.value / maxIdx.value))

const rootClass = computed(() => cx(styles.bsSwiper, resolveClassNames(props.classNames)))
</script>

<template>
  <div v-bind="$attrs" :class="rootClass">
    <div :class="styles.bsSwiperViewport">
      <div :class="styles.bsSwiperTrackClip">
        <div :class="styles.bsSwiperTrack" :style="{gap: gap || undefined, transform: `translateX(${translate})`}">
          <div v-for="(slide, i) in slideNodes" :key="i" :class="styles.bsSwiperSlide" :style="{width: slideWidth}">
            <Cell :node="slide" />
          </div>
        </div>
      </div>

      <template v-if="navigation && total > 0">
        <button
          type="button"
          :class="cx(styles.bsSwiperArrow, styles.bsSwiperArrowPrev)"
          :disabled="!canPrev"
          aria-label="이전 슬라이드"
          @click="goPrev"
        >
          <Icon name="chevron-left" :size="17" />
        </button>
        <button
          type="button"
          :class="cx(styles.bsSwiperArrow, styles.bsSwiperArrowNext)"
          :disabled="!canNext"
          aria-label="다음 슬라이드"
          @click="goNext"
        >
          <Icon name="chevron-right" :size="17" />
        </button>
      </template>
    </div>

    <div v-if="pagination === SWIPER_PAGINATION.BULLETS" :class="styles.bsSwiperBullets">
      <button
        v-for="i in maxIdx + 1"
        :key="i - 1"
        type="button"
        :class="cx(styles.bsSwiperBullet, i - 1 === current && styles.bsSwiperBulletActive)"
        :aria-label="`${i}번 슬라이드로 이동`"
        :aria-current="i - 1 === current"
        @click="move(i - 1)"
      />
    </div>

    <div v-else-if="pagination === SWIPER_PAGINATION.FRACTION" :class="styles.bsSwiperFraction">
      <span :class="styles.bsSwiperFractionCurrent">{{ current + 1 }}</span>
      <span> / </span>
      <span>{{ maxIdx + 1 }}</span>
    </div>

    <div v-else-if="pagination === SWIPER_PAGINATION.PROGRESSBAR" :class="styles.bsSwiperProgress">
      <div :class="styles.bsSwiperProgressBar" :style="{width: `${progress * 100}%`}" />
    </div>
  </div>
</template>
