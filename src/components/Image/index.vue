<script setup lang="ts">
import {computed, ref, watch} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import Icon from '~/components/Icon'
import {IMAGE_DEFAULT, IMAGE_STATE_CLASS, IMAGE_STATUS} from '~/components/Image/Image.constant'
import type {ImageProps} from '~/components/Image/Image.type'
import styles from '~/components/Image/Image.module.scss'

const toSize = (v: number | string) => (typeof v === 'number' ? `${v}px` : v)

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<ImageProps>(), {
  width: IMAGE_DEFAULT.WIDTH,
  height: IMAGE_DEFAULT.HEIGHT,
  objectFit: IMAGE_DEFAULT.OBJECT_FIT,
  rounded: IMAGE_DEFAULT.ROUNDED,
  skeleton: IMAGE_DEFAULT.SKELETON,
  fadeIn: IMAGE_DEFAULT.FADE_IN,
  loading: IMAGE_DEFAULT.LOADING
})

const emit = defineEmits<{load: []; error: []}>()

const status = ref<string>(IMAGE_STATUS.LOADING)
const currentSrc = ref(props.src)
const triedFallback = ref(false)

watch(
  () => props.src,
  (v) => {
    status.value = IMAGE_STATUS.LOADING
    currentSrc.value = v
    triedFallback.value = false
  }
)

function onLoad() {
  status.value = IMAGE_STATUS.LOADED
  emit('load')
}
function onError() {
  if (props.fallbackSrc && !triedFallback.value) {
    triedFallback.value = true
    currentSrc.value = props.fallbackSrc
    return
  }
  status.value = IMAGE_STATUS.ERROR
  emit('error')
}

const isLoading = computed(() => status.value === IMAGE_STATUS.LOADING)
const isLoaded = computed(() => status.value === IMAGE_STATUS.LOADED)
const isError = computed(() => status.value === IMAGE_STATUS.ERROR)

const rootClass = computed(() =>
  cx(
    styles.bsImage,
    isLoading.value && styles[IMAGE_STATE_CLASS.IS_LOADING],
    isLoaded.value && styles[IMAGE_STATE_CLASS.IS_LOADED],
    isError.value && styles[IMAGE_STATE_CLASS.IS_ERROR],
    props.fadeIn && styles[IMAGE_STATE_CLASS.IS_FADE],
    resolveClassNames(props.classNames)
  )
)
const rootStyle = computed(() => ({
  width: toSize(props.width),
  height: toSize(props.height),
  borderRadius: toSize(props.rounded),
  ...props.style
}))
</script>

<template>
  <div v-bind="$attrs" :class="rootClass" :style="rootStyle">
    <span v-if="isLoading && props.skeleton" :class="styles.bsImageSkeleton" aria-hidden="true" />

    <span v-if="isError" :class="styles.bsImageError" role="img" :aria-label="props.alt || '이미지 오류'">
      <Icon name="image" :size="28" />
      <span :class="styles.bsImageErrorText">이미지를 불러올 수 없습니다</span>
    </span>
    <img
      v-else
      :class="styles.bsImageImg"
      :src="currentSrc"
      :alt="props.alt"
      :loading="props.loading"
      decoding="async"
      :style="{objectFit: props.objectFit, ...props.imgStyle}"
      @load="onLoad"
      @error="onError"
    />
  </div>
</template>
