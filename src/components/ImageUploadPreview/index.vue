<script setup lang="ts">
import {computed, ref} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import Icon from '~/components/Icon'
import Lightbox from '~/components/Lightbox/index.vue'
import {
  IMAGE_UPLOAD_PREVIEW_DEFAULT,
  IMAGE_UPLOAD_PREVIEW_STATE_CLASS
} from '~/components/ImageUploadPreview/ImageUploadPreview.constant'
import type {
  ImageUploadPreviewItem,
  ImageUploadPreviewProps
} from '~/components/ImageUploadPreview/ImageUploadPreview.type'
import styles from '~/components/ImageUploadPreview/ImageUploadPreview.module.scss'

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<ImageUploadPreviewProps>(), {
  maxCount: IMAGE_UPLOAD_PREVIEW_DEFAULT.MAX_COUNT,
  maxSize: IMAGE_UPLOAD_PREVIEW_DEFAULT.MAX_SIZE,
  cols: IMAGE_UPLOAD_PREVIEW_DEFAULT.COLS,
  thumbSize: IMAGE_UPLOAD_PREVIEW_DEFAULT.THUMB_SIZE,
  drag: false,
  listView: false,
  disabled: false,
  showList: true
})

const emit = defineEmits<{
  change: [File[]]
  /** showList=false 일 때 검증(크기·개수)에 걸려 제외된 파일 */
  reject: [{file: File; message: string}[]]
}>()

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const inputRef = ref<HTMLInputElement>()
let counter = 0
const items = ref<ImageUploadPreviewItem[]>([])
const over = ref(false)
const lightboxIndex = ref<number | null>(null)

// showList=false 는 상태를 갖지 않는 순수 선택 UI → 개수 제한은 한 번에 고르는 수에만 적용
const canAdd = computed(() => !props.disabled && (!props.showList || items.value.length < props.maxCount))
const validUrls = computed(() => items.value.filter((it) => !it.errorMessage).map((it) => it.dataUrl))

function emitChange() {
  emit(
    'change',
    items.value.filter((it) => !it.errorMessage).map((it) => it.file)
  )
}

function addFiles(fileList: FileList) {
  if (!props.showList) {
    // 선택 UI 만 쓰는 모드: 이번에 고른 유효 이미지만 change 로 전달 (목록·서버 업로드는 사용처가 처리)
    const images = Array.from(fileList).filter((f) => f.type.startsWith('image/'))
    const picked = images.slice(0, props.maxCount)
    const rejected = [
      ...picked
        .filter((f) => f.size > props.maxSize)
        .map((file) => ({file, message: `크기 초과 (최대 ${formatFileSize(props.maxSize)})`})),
      ...images
        .slice(props.maxCount)
        .map((file) => ({file, message: `최대 ${props.maxCount}개까지 선택할 수 있습니다`}))
    ]
    const valid = picked.filter((f) => f.size <= props.maxSize)
    if (rejected.length > 0) emit('reject', rejected)
    if (valid.length > 0) emit('change', valid)
    return
  }
  const picked = Array.from(fileList)
    .filter((f) => f.type.startsWith('image/'))
    .slice(0, Math.max(0, props.maxCount - items.value.length))

  picked.forEach((file) => {
    const id = ++counter
    if (file.size > props.maxSize) {
      items.value.push({id, file, dataUrl: '', errorMessage: `크기 초과 (최대 ${formatFileSize(props.maxSize)})`})
      emitChange()
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      items.value.push({id, file, dataUrl: (e.target?.result as string) ?? ''})
      emitChange()
    }
    reader.readAsDataURL(file)
  })
}

function remove(id: number) {
  items.value = items.value.filter((it) => it.id !== id)
  emitChange()
}

function handleInput(e: Event) {
  const el = e.target as HTMLInputElement
  if (el.files) addFiles(el.files)
  el.value = ''
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  over.value = false
  if (!props.disabled && e.dataTransfer && e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files)
}

function openLightbox(item: ImageUploadPreviewItem) {
  const idx = validUrls.value.indexOf(item.dataUrl)
  if (idx !== -1) lightboxIndex.value = idx
}

function pick() {
  inputRef.value?.click()
}

function onDropzoneKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    pick()
  }
}

const rootClass = computed(() =>
  cx(
    styles.bsImageUploadPreview,
    props.disabled && styles[IMAGE_UPLOAD_PREVIEW_STATE_CLASS.IS_DISABLED],
    resolveClassNames(props.classNames)
  )
)
</script>

<template>
  <div v-bind="$attrs" :class="rootClass">
    <input
      ref="inputRef"
      type="file"
      accept="image/*"
      multiple
      :class="styles.bsImageUploadPreviewInput"
      :disabled="disabled"
      @change="handleInput"
    />

    <div
      v-if="drag && canAdd"
      :class="cx(styles.bsImageUploadPreviewDropzone, over && styles[IMAGE_UPLOAD_PREVIEW_STATE_CLASS.IS_OVER])"
      role="button"
      tabindex="0"
      @click="pick"
      @keydown="onDropzoneKeydown"
      @dragover.prevent="!disabled && (over = true)"
      @dragleave="over = false"
      @drop="handleDrop"
    >
      <Icon name="upload" :size="26" :class-names="styles.bsImageUploadPreviewDropIcon" />
      <span :class="styles.bsImageUploadPreviewDropTitle">이미지를 드래그하거나 클릭하여 선택</span>
      <span :class="styles.bsImageUploadPreviewDropHint">
        PNG, JPG, WEBP · 최대 {{ formatFileSize(maxSize)
        }}<template v-if="showList"> · {{ items.length }}/{{ maxCount }}</template>
      </span>
    </div>

    <div v-if="listView" :class="styles.bsImageUploadPreviewList">
      <div
        v-for="item in items"
        :key="item.id"
        :class="cx(styles.bsImageUploadPreviewRow, item.errorMessage && styles.bsImageUploadPreviewRowError)"
      >
        <img
          v-if="item.dataUrl"
          :src="item.dataUrl"
          :alt="item.file.name"
          :class="styles.bsImageUploadPreviewRowThumb"
          @click="openLightbox(item)"
        />
        <span v-else :class="styles.bsImageUploadPreviewRowThumbError"><Icon name="alert-circle" :size="18" /></span>

        <span :class="styles.bsImageUploadPreviewRowInfo">
          <span :class="styles.bsImageUploadPreviewRowName">{{ item.file.name }}</span>
          <span :class="styles.bsImageUploadPreviewRowMeta">
            {{ item.errorMessage ? item.errorMessage : formatFileSize(item.file.size) }}
          </span>
        </span>

        <span :class="styles.bsImageUploadPreviewRowActions">
          <button
            v-if="!item.errorMessage"
            type="button"
            :class="styles.bsImageUploadPreviewRowButton"
            aria-label="미리보기"
            @click="openLightbox(item)"
          >
            <Icon name="zoom-in" :size="13" />
          </button>
          <button
            type="button"
            :class="cx(styles.bsImageUploadPreviewRowButton, styles.bsImageUploadPreviewRowButtonDanger)"
            aria-label="삭제"
            @click="remove(item.id)"
          >
            <Icon name="trash" :size="13" />
          </button>
        </span>
      </div>

      <button v-if="!drag && canAdd" type="button" :class="styles.bsImageUploadPreviewListAdd" @click="pick">
        <Icon name="plus" :size="14" />
        이미지 추가<template v-if="showList"> ({{ items.length }}/{{ maxCount }})</template>
      </button>
    </div>

    <div
      v-else
      :class="styles.bsImageUploadPreviewGrid"
      :style="{gridTemplateColumns: `repeat(${cols}, ${thumbSize}px)`}"
    >
      <template v-for="item in items" :key="item.id">
        <div
          v-if="item.errorMessage"
          :class="cx(styles.bsImageUploadPreviewCard, styles.bsImageUploadPreviewCardError)"
          :style="{width: `${thumbSize}px`, height: `${thumbSize}px`}"
        >
          <Icon name="alert-circle" :size="18" :class-names="styles.bsImageUploadPreviewCardErrorIcon" />
          <span :class="styles.bsImageUploadPreviewCardErrorText">{{ item.errorMessage }}</span>
          <button
            type="button"
            :class="styles.bsImageUploadPreviewCardRemove"
            aria-label="삭제"
            @click="remove(item.id)"
          >
            <Icon name="close" :size="10" />
          </button>
        </div>
        <div
          v-else
          :class="styles.bsImageUploadPreviewCard"
          :style="{width: `${thumbSize}px`, height: `${thumbSize}px`}"
        >
          <img
            :src="item.dataUrl"
            :alt="item.file.name"
            :class="styles.bsImageUploadPreviewCardImage"
            @click="openLightbox(item)"
          />
          <div :class="styles.bsImageUploadPreviewCardOverlay" @click="openLightbox(item)">
            <Icon name="zoom-in" :size="18" />
          </div>
          <button
            type="button"
            :class="styles.bsImageUploadPreviewCardRemove"
            :aria-label="`${item.file.name} 삭제`"
            @click.stop="remove(item.id)"
          >
            <Icon name="close" :size="11" />
          </button>
        </div>
      </template>

      <button
        v-if="!drag && canAdd"
        type="button"
        :class="styles.bsImageUploadPreviewAddCard"
        :style="{width: `${thumbSize}px`, height: `${thumbSize}px`}"
        @click="pick"
      >
        <Icon name="plus" :size="18" />
        <span v-if="showList">{{ items.length }}/{{ maxCount }}</span>
      </button>
    </div>

    <Lightbox
      v-if="lightboxIndex !== null"
      :images="validUrls"
      :index="lightboxIndex"
      @close="lightboxIndex = null"
      @change="lightboxIndex = $event"
    />
  </div>
</template>
