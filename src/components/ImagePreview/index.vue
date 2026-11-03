<script setup lang="ts">
import {computed, ref} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import Icon from '~/components/Icon'
import Lightbox from '~/components/Lightbox/index.vue'
import {IMAGE_PREVIEW_DEFAULT, IMAGE_PREVIEW_STATE_CLASS} from '~/components/ImagePreview/ImagePreview.constant'
import type {ImagePreviewProps} from '~/components/ImagePreview/ImagePreview.type'
import styles from '~/components/ImagePreview/ImagePreview.module.scss'

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<ImagePreviewProps>(), {
  alt: '',
  width: IMAGE_PREVIEW_DEFAULT.WIDTH,
  height: IMAGE_PREVIEW_DEFAULT.HEIGHT,
  preview: IMAGE_PREVIEW_DEFAULT.PREVIEW,
  radius: IMAGE_PREVIEW_DEFAULT.RADIUS,
  fit: IMAGE_PREVIEW_DEFAULT.FIT
})

const toSize = (v: number | string) => (typeof v === 'number' ? `${v}px` : v)

const errored = ref(false)
const lightboxIndex = ref<number | null>(null)

const images = computed(() => props.group ?? [props.src])
const ownIndex = computed(() => Math.max(0, props.group ? props.group.indexOf(props.src) : 0))

function open() {
  if (props.preview) lightboxIndex.value = ownIndex.value
}

function onKeydown(e: KeyboardEvent) {
  if (props.preview && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault()
    open()
  }
}

const rootClass = computed(() =>
  cx(
    styles.bsImagePreview,
    props.preview && styles[IMAGE_PREVIEW_STATE_CLASS.IS_PREVIEWABLE],
    resolveClassNames(props.classNames)
  )
)
</script>

<template>
  <div
    v-bind="$attrs"
    :class="rootClass"
    :style="{width: toSize(width), height: toSize(height), borderRadius: toSize(radius)}"
    :role="preview ? 'button' : undefined"
    :tabindex="preview ? 0 : undefined"
    @click="open"
    @keydown="onKeydown"
  >
    <img
      :class="styles.bsImagePreviewImg"
      :src="errored && fallback ? fallback : src"
      :alt="alt"
      :style="{objectFit: fit}"
      @error="errored = true"
    />
    <span v-if="preview" :class="styles.bsImagePreviewOverlay" aria-hidden="true">
      <Icon name="zoom-in" :size="22" />
    </span>
  </div>

  <Lightbox
    v-if="lightboxIndex !== null"
    :images="images"
    :index="lightboxIndex"
    @close="lightboxIndex = null"
    @change="lightboxIndex = $event"
  />
</template>
