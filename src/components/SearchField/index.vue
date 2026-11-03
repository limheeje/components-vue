<script setup lang="ts">
import {computed, ref, useAttrs} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import Icon from '~/components/Icon'
import {SEARCH_FIELD_DEFAULT, SEARCH_FIELD_STATE_CLASS} from '~/components/SearchField/SearchField.constant'
import type {SearchFieldProps} from '~/components/SearchField/SearchField.type'
import styles from '~/components/SearchField/SearchField.module.scss'
const cap = (s: string) => s.replace(/(?:^|-)([a-z])/g, (m: string) => m.slice(-1).toUpperCase())

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<SearchFieldProps>(), {
  size: SEARCH_FIELD_DEFAULT.SIZE,
  clearable: SEARCH_FIELD_DEFAULT.CLEARABLE,
  loading: false,
  placeholder: SEARCH_FIELD_DEFAULT.PLACEHOLDER
})

const emit = defineEmits<{
  'update:modelValue': [string]
  change: [Event]
  input: [Event]
  search: [string]
  clear: []
}>()

const attrs = useAttrs()
const passAttrs = computed(() => {
  const {onChange: _oc, onInput: _oi, class: _c, style: _s, ...rest} = attrs as Record<string, unknown>
  return rest
})

const innerRef = ref<HTMLInputElement>()
const uncontrolled = ref(props.defaultValue != null ? String(props.defaultValue) : '')
const isControlled = computed(() => props.modelValue !== undefined)
const current = computed(() => (isControlled.value ? String(props.modelValue ?? '') : uncontrolled.value))
const focused = ref(false)

function onInput(e: Event) {
  const next = (e.target as HTMLInputElement).value
  if (!isControlled.value) uncontrolled.value = next
  emit('update:modelValue', next)
  emit('input', e)
  emit('change', e)
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') emit('search', (e.target as HTMLInputElement).value)
}
function onClear() {
  if (!isControlled.value) uncontrolled.value = ''
  const el = innerRef.value
  if (el) {
    el.value = ''
    el.dispatchEvent(new Event('input', {bubbles: true}))
    el.focus()
  }
  emit('clear')
}

defineExpose({el: innerRef, focus: () => innerRef.value?.focus()})

const showClear = computed(() => props.clearable && current.value.length > 0 && !props.disabled)
const rootClass = computed(() =>
  cx(
    styles.bsSearchField,
    styles[`bsSearchFieldSize${cap(props.size)}`],
    focused.value && styles[SEARCH_FIELD_STATE_CLASS.IS_FOCUSED],
    props.disabled && styles[SEARCH_FIELD_STATE_CLASS.IS_DISABLED],
    props.loading && styles[SEARCH_FIELD_STATE_CLASS.IS_LOADING],
    resolveClassNames(props.classNames)
  )
)
</script>

<template>
  <div :class="rootClass">
    <button
      type="button"
      :class="styles.bsSearchFieldSearchButton"
      aria-label="검색"
      :disabled="props.disabled || props.loading"
      @click="emit('search', current)"
    >
      <Icon v-if="props.loading" name="upload" size="1em" spin :class-names="styles.bsSearchFieldIcon" />
      <Icon v-else name="search" size="1em" :class-names="styles.bsSearchFieldIcon" />
    </button>

    <input
      ref="innerRef"
      v-bind="passAttrs"
      type="search"
      :class="styles.bsSearchFieldInput"
      :disabled="props.disabled"
      :placeholder="props.placeholder"
      :value="current"
      @input="onInput"
      @keydown="onKeydown"
      @focus="focused = true"
      @blur="focused = false"
    />

    <button
      v-if="showClear"
      type="button"
      tabindex="-1"
      :class="styles.bsSearchFieldClearButton"
      aria-label="입력 내용 지우기"
      @click="onClear"
    >
      <Icon name="cancel" size="1em" :class-names="styles.bsSearchFieldIcon" />
    </button>
  </div>
</template>
