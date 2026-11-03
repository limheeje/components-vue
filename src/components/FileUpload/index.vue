<script setup lang="ts">
import {computed, ref} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import Icon from '~/components/Icon'
import {
  FILE_UPLOAD_DEFAULT,
  FILE_UPLOAD_FILE_STATUS,
  FILE_UPLOAD_LIST_TYPE,
  FILE_UPLOAD_STATE_CLASS
} from '~/components/FileUpload/FileUpload.constant'
import {formatFileSize} from '~/components/FileUpload/FileUpload.util'
import type {FileUploadItem, FileUploadProps} from '~/components/FileUpload/FileUpload.type'
import styles from '~/components/FileUpload/FileUpload.module.scss'

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<FileUploadProps>(), {
  accept: FILE_UPLOAD_DEFAULT.ACCEPT,
  multiple: false,
  maxSize: FILE_UPLOAD_DEFAULT.MAX_SIZE,
  maxCount: FILE_UPLOAD_DEFAULT.MAX_COUNT,
  disabled: false,
  drag: false,
  listType: FILE_UPLOAD_DEFAULT.LIST_TYPE,
  showList: true
})

const emit = defineEmits<{
  change: [File[]]
  upload: [File[]]
  /** showList=false 일 때 검증(크기·개수)에 걸려 제외된 파일 */
  reject: [{file: File; message: string}[]]
}>()

const inputRef = ref<HTMLInputElement>()
let counter = 0
const items = ref<FileUploadItem[]>([])
const over = ref(false)

const isPicture = computed(() => props.listType === FILE_UPLOAD_LIST_TYPE.PICTURE)
// showList=false 는 상태를 갖지 않는 순수 선택 UI → 개수 제한은 한 번에 고르는 수에만 적용
const canAdd = computed(() => !props.disabled && (!props.showList || items.value.length < props.maxCount))

function emitChange() {
  emit(
    'change',
    items.value.filter((it) => it.status === FILE_UPLOAD_FILE_STATUS.DONE).map((it) => it.file)
  )
}

function addFiles(fileList: FileList) {
  const incoming = Array.from(fileList)
  emit('upload', incoming)

  if (!props.showList) {
    // 선택 UI 만 쓰는 모드: 이번에 고른 유효 파일만 change 로 전달 (목록·서버 업로드는 사용처가 처리)
    const room = props.multiple ? props.maxCount : 1
    const picked = incoming.slice(0, room)
    const rejected = [
      ...picked
        .filter((f) => f.size > props.maxSize)
        .map((file) => ({file, message: `파일 크기 초과 (최대 ${formatFileSize(props.maxSize)})`})),
      ...incoming.slice(room).map((file) => ({file, message: `최대 ${room}개까지 선택할 수 있습니다`}))
    ]
    const valid = picked.filter((f) => f.size <= props.maxSize)
    if (rejected.length > 0) emit('reject', rejected)
    if (valid.length > 0) emit('change', valid)
    return
  }

  const room = props.multiple ? props.maxCount - items.value.length : 1
  const picked = incoming.slice(0, Math.max(0, room))

  picked.forEach((file) => {
    const id = ++counter
    const tooLarge = file.size > props.maxSize
    const isImage = file.type.startsWith('image/')

    if (isPicture.value && isImage && !tooLarge) {
      const reader = new FileReader()
      reader.onload = (e) => {
        items.value.push({
          id,
          file,
          status: FILE_UPLOAD_FILE_STATUS.DONE,
          preview: e.target?.result as string
        })
        emitChange()
      }
      reader.readAsDataURL(file)
      return
    }

    items.value.push({
      id,
      file,
      status: tooLarge ? FILE_UPLOAD_FILE_STATUS.ERROR : FILE_UPLOAD_FILE_STATUS.DONE,
      errorMessage: tooLarge ? `파일 크기 초과 (최대 ${formatFileSize(props.maxSize)})` : undefined
    })
    emitChange()
  })
}

function remove(id: number) {
  items.value = items.value.filter((it) => it.id !== id)
  emitChange()
}

function handleInput(e: Event) {
  const el = e.target as HTMLInputElement
  if (el.files) {
    if (!props.multiple) items.value = []
    addFiles(el.files)
  }
  el.value = ''
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  over.value = false
  if (!props.disabled && e.dataTransfer && e.dataTransfer.files.length > 0) {
    addFiles(e.dataTransfer.files)
  }
}

function openPicker() {
  if (canAdd.value) inputRef.value?.click()
}
function onDropzoneKeydown(e: KeyboardEvent) {
  if ((e.key === 'Enter' || e.key === ' ') && canAdd.value) {
    e.preventDefault()
    inputRef.value?.click()
  }
}

const acceptAttr = computed(() => (props.accept === '*' ? undefined : props.accept))

function fileIconName(it: FileUploadItem) {
  if (props.drag) return 'paperclip'
  return it.file.type.startsWith('image/') ? 'image' : 'file'
}

const rootClass = computed(() =>
  cx(
    styles.bsFileUpload,
    props.disabled && styles[FILE_UPLOAD_STATE_CLASS.IS_DISABLED],
    resolveClassNames(props.classNames)
  )
)
</script>

<template>
  <div v-bind="$attrs" :class="rootClass">
    <input
      ref="inputRef"
      type="file"
      :accept="acceptAttr"
      :multiple="multiple"
      :class="styles.bsFileUploadInput"
      :disabled="disabled"
      @change="handleInput"
    />

    <div
      v-if="drag"
      :class="cx(styles.bsFileUploadDropzone, over && styles[FILE_UPLOAD_STATE_CLASS.IS_OVER])"
      role="button"
      :tabindex="disabled ? -1 : 0"
      @click="openPicker"
      @keydown="onDropzoneKeydown"
      @dragover.prevent="!disabled && (over = true)"
      @dragleave="over = false"
      @drop="handleDrop"
    >
      <Icon name="upload" :size="28" :class-names="styles.bsFileUploadDropIcon" />
      <span :class="styles.bsFileUploadDropTitle">파일을 드래그하거나 클릭하여 선택</span>
      <span :class="styles.bsFileUploadDropHint">
        최대 {{ formatFileSize(maxSize) }} · {{ accept === '*' ? '모든 파일' : accept }}
      </span>
    </div>

    <button v-else type="button" :class="styles.bsFileUploadTrigger" :disabled="!canAdd" @click="openPicker">
      <Icon name="upload" :size="15" />
      파일 선택
      <span v-if="showList && maxCount > 1" :class="styles.bsFileUploadCount">({{ items.length }}/{{ maxCount }})</span>
    </button>

    <ul
      v-if="showList && items.length > 0"
      :class="cx(styles.bsFileUploadList, isPicture && styles.bsFileUploadListPicture)"
    >
      <li
        v-for="it in items"
        :key="it.id"
        :class="
          cx(
            styles.bsFileUploadItem,
            it.status === FILE_UPLOAD_FILE_STATUS.ERROR && styles[FILE_UPLOAD_STATE_CLASS.IS_ERROR]
          )
        "
      >
        <img v-if="isPicture && it.preview" :src="it.preview" :alt="it.file.name" :class="styles.bsFileUploadThumb" />
        <Icon v-else :name="fileIconName(it)" :size="18" :class-names="styles.bsFileUploadFileIcon" />

        <span :class="styles.bsFileUploadInfo">
          <span :class="styles.bsFileUploadName">{{ it.file.name }}</span>
          <span :class="styles.bsFileUploadMeta">
            {{ it.status === FILE_UPLOAD_FILE_STATUS.ERROR ? it.errorMessage : formatFileSize(it.file.size) }}
          </span>
        </span>

        <Icon
          :name="it.status === FILE_UPLOAD_FILE_STATUS.ERROR ? 'alert-circle' : 'check-circle'"
          :size="15"
          :class-names="
            it.status === FILE_UPLOAD_FILE_STATUS.ERROR ? styles.bsFileUploadStatusError : styles.bsFileUploadStatusDone
          "
        />

        <button
          type="button"
          :class="styles.bsFileUploadRemoveButton"
          :aria-label="`${it.file.name} 삭제`"
          @click="remove(it.id)"
        >
          <Icon name="close" :size="14" />
        </button>
      </li>
    </ul>
  </div>
</template>
