<script setup lang="ts">
import {computed, ref} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import {formatFileSize} from '~/components/FileUpload/FileUpload.util'
import Icon from '~/components/Icon'
import Lightbox from '~/components/Lightbox/index.vue'
import {
  UPLOADED_FILE_LIST_DEFAULT,
  UPLOADED_FILE_LIST_STATE_CLASS,
  UPLOADED_FILE_STATUS
} from '~/components/UploadedFileList/UploadedFileList.constant'
import type {UploadedFile, UploadedFileListProps} from '~/components/UploadedFileList/UploadedFileList.type'
import {isImageFile, thumbnailOf} from '~/components/UploadedFileList/UploadedFileList.util'
import styles from '~/components/UploadedFileList/UploadedFileList.module.scss'

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<UploadedFileListProps>(), {
  removable: UPLOADED_FILE_LIST_DEFAULT.REMOVABLE,
  preview: UPLOADED_FILE_LIST_DEFAULT.PREVIEW
})

const emit = defineEmits<{'update:modelValue': [UploadedFile[]]; remove: [UploadedFile, number]}>()

const list = computed(() => props.modelValue ?? [])

const keyOf = (f: UploadedFile, i: number) => String(f.id ?? f.url ?? `${f.name}#${i}`)

// 서버 썸네일 로딩 실패한 항목 (key+url 기준) → 파일 아이콘으로 대체
const broken = ref<Set<string>>(new Set())
const brokenKey = (f: UploadedFile, i: number) => `${keyOf(f, i)}|${thumbnailOf(f) ?? ''}`
const markBroken = (f: UploadedFile, i: number) => (broken.value = new Set(broken.value).add(brokenKey(f, i)))
const thumbOf = (f: UploadedFile, i: number) => (broken.value.has(brokenKey(f, i)) ? undefined : thumbnailOf(f))

const statusOf = (f: UploadedFile) => f.status ?? UPLOADED_FILE_STATUS.DONE

function metaText(f: UploadedFile) {
  const status = statusOf(f)
  if (status === UPLOADED_FILE_STATUS.ERROR) return f.errorMessage ?? UPLOADED_FILE_LIST_DEFAULT.FAILED_TEXT
  if (status === UPLOADED_FILE_STATUS.UPLOADING) return UPLOADED_FILE_LIST_DEFAULT.UPLOADING_TEXT
  return f.size != null ? formatFileSize(f.size) : ''
}

function remove(f: UploadedFile, index: number) {
  emit(
    'update:modelValue',
    list.value.filter((_, i) => i !== index)
  )
  emit('remove', f, index)
}

// ── 큰 미리보기 ───────────────────────────────────────
const lightboxIndex = ref<number | null>(null)
const previewable = (f: UploadedFile, i: number) =>
  props.preview &&
  statusOf(f) === UPLOADED_FILE_STATUS.DONE &&
  Boolean(thumbOf(f, i)) &&
  Boolean(f.url ?? f.thumbnailUrl)
const previewSources = computed(() =>
  list.value.flatMap((f, i) =>
    previewable(f, i) ? [{key: keyOf(f, i), src: (f.url ?? f.thumbnailUrl) as string}] : []
  )
)

function openPreview(f: UploadedFile, i: number) {
  if (!previewable(f, i)) return
  const idx = previewSources.value.findIndex((s) => s.key === keyOf(f, i))
  if (idx !== -1) lightboxIndex.value = idx
}

const rootClass = computed(() => cx(styles.bsUploadedFileList, resolveClassNames(props.classNames)))
</script>

<template>
  <ul v-if="list.length > 0" v-bind="$attrs" :class="rootClass">
    <li
      v-for="(f, i) in list"
      :key="keyOf(f, i)"
      :class="
        cx(
          styles.bsUploadedFileItem,
          statusOf(f) === UPLOADED_FILE_STATUS.ERROR && styles[UPLOADED_FILE_LIST_STATE_CLASS.IS_ERROR]
        )
      "
    >
      <img
        v-if="thumbOf(f, i)"
        :src="thumbOf(f, i)"
        :alt="f.name"
        :class="
          cx(styles.bsUploadedFileThumb, previewable(f, i) && styles[UPLOADED_FILE_LIST_STATE_CLASS.IS_PREVIEWABLE])
        "
        @click="openPreview(f, i)"
        @error="markBroken(f, i)"
      />
      <Icon v-else :name="isImageFile(f) ? 'image' : 'file'" :size="18" :class-names="styles.bsUploadedFileIcon" />

      <span :class="styles.bsUploadedFileInfo">
        <span :class="styles.bsUploadedFileName">{{ f.name }}</span>
        <span :class="styles.bsUploadedFileMeta">{{ metaText(f) }}</span>
      </span>

      <Icon
        v-if="statusOf(f) === UPLOADED_FILE_STATUS.UPLOADING"
        name="refresh"
        spin
        :size="15"
        :class-names="styles.bsUploadedFileStatusUploading"
      />
      <Icon
        v-else-if="statusOf(f) === UPLOADED_FILE_STATUS.ERROR"
        name="alert-circle"
        :size="15"
        :class-names="styles.bsUploadedFileStatusError"
      />
      <Icon v-else name="check-circle" :size="15" :class-names="styles.bsUploadedFileStatusDone" />

      <button
        v-if="removable"
        type="button"
        :class="styles.bsUploadedFileRemove"
        :aria-label="`${f.name} 삭제`"
        @click="remove(f, i)"
      >
        <Icon name="close" :size="14" />
      </button>
    </li>
  </ul>

  <Lightbox
    v-if="lightboxIndex !== null"
    :images="previewSources.map((s) => s.src)"
    :index="lightboxIndex"
    @close="lightboxIndex = null"
    @change="lightboxIndex = $event"
  />
</template>
