<script setup lang="ts">
import {computed, nextTick, onBeforeUnmount, ref, useId, watch} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import {SELECT_DEFAULT, SELECT_STATE_CLASS} from '~/components/Select/Select.constant'
import type {SelectComponentProps, SelectOption} from '~/components/Select/Select.type'
import styles from '~/components/Select/Select.module.scss'
const cap = (s: string) => s.replace(/(?:^|-)([a-z])/g, (m: string) => m.slice(-1).toUpperCase())

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<SelectComponentProps>(), {
  placeholder: '선택해주세요',
  size: SELECT_DEFAULT.SIZE,
  multiple: false,
  searchable: false,
  disabled: false,
  error: false
})

const emit = defineEmits<{'update:modelValue': [string | string[]]; change: [string | string[]]}>()

const rootRef = ref<HTMLElement>()
const searchRef = ref<HTMLInputElement>()

const isControlled = computed(() => props.modelValue !== undefined)

function toArray(v: string | string[] | undefined): string[] {
  if (Array.isArray(v)) return v
  if (typeof v === 'string' && v !== '') return [v]
  return []
}

const uncontrolled = ref<string[]>(toArray(props.defaultValue))
const current = computed<string[]>(() => (isControlled.value ? toArray(props.modelValue) : uncontrolled.value))

const open = ref(false)
const query = ref('')
const activeIndex = ref(-1)

const reactId = useId()
const triggerId = computed(() => props.id ?? reactId)
const listId = `${reactId}-list`

const errorMessage = computed(() => (typeof props.error === 'string' ? props.error : ''))
const hasError = computed(() => props.error === true || errorMessage.value.length > 0)

const selectedOptions = computed(() =>
  current.value.map((v) => props.options.find((o) => o.value === v)).filter((o): o is SelectOption => o != null)
)
const hasSelection = computed(() => selectedOptions.value.length > 0)

const filtered = computed(() =>
  props.searchable && query.value ? props.options.filter((o) => o.label.includes(query.value)) : props.options
)

function onDocDown(e: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) {
    open.value = false
    query.value = ''
  }
}
watch(open, (o) => {
  if (o) {
    document.addEventListener('mousedown', onDocDown)
    if (props.searchable) nextTick(() => searchRef.value?.focus())
  } else {
    document.removeEventListener('mousedown', onDocDown)
  }
})
onBeforeUnmount(() => document.removeEventListener('mousedown', onDocDown))

function emitChange(next: string[]) {
  if (!isControlled.value) uncontrolled.value = next
  const payload = props.multiple ? next : (next[0] ?? '')
  emit('update:modelValue', payload)
  emit('change', payload)
}

function commit(option: SelectOption) {
  if (option.disabled) return
  if (props.multiple) {
    const next = current.value.includes(option.value)
      ? current.value.filter((v) => v !== option.value)
      : [...current.value, option.value]
    emitChange(next)
    return
  }
  emitChange([option.value])
  open.value = false
  query.value = ''
}

function removeValue(value: string, e: MouseEvent) {
  e.stopPropagation()
  if (props.disabled) return
  emitChange(current.value.filter((v) => v !== value))
}

function toggleOpen() {
  if (props.disabled) return
  open.value = !open.value
  activeIndex.value = -1
}

function onSearchInput(e: Event) {
  query.value = (e.target as HTMLInputElement).value
  activeIndex.value = -1
}

function onKeydown(e: KeyboardEvent) {
  if (props.disabled) return
  if (e.key === 'Escape') {
    open.value = false
    query.value = ''
    return
  }
  if (!open.value && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) {
    e.preventDefault()
    open.value = true
    return
  }
  if (!open.value) return
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    const dir = e.key === 'ArrowDown' ? 1 : -1
    const enabled = filtered.value.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0)
    if (enabled.length === 0) return
    const pos = enabled.indexOf(activeIndex.value)
    activeIndex.value = enabled[(pos + dir + enabled.length) % enabled.length] ?? enabled[0] ?? -1
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const opt = filtered.value[activeIndex.value]
    if (opt) commit(opt)
  }
}

const rootClass = computed(() =>
  cx(styles.bsSelect, styles[`bsSelectSize${cap(props.size)}`], resolveClassNames(props.classNames))
)
const triggerClass = computed(() =>
  cx(
    styles.bsSelectTrigger,
    props.multiple && styles.isMultiple,
    open.value && styles[SELECT_STATE_CLASS.IS_OPEN],
    hasError.value && styles[SELECT_STATE_CLASS.IS_ERROR],
    props.disabled && styles[SELECT_STATE_CLASS.IS_DISABLED],
    !hasSelection.value && styles[SELECT_STATE_CLASS.IS_PLACEHOLDER]
  )
)
</script>

<template>
  <div ref="rootRef" v-bind="$attrs" :class="rootClass">
    <div
      :id="triggerId"
      role="combobox"
      :tabindex="disabled ? -1 : 0"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-controls="listId"
      :aria-disabled="disabled || undefined"
      :aria-invalid="hasError || undefined"
      :aria-multiselectable="multiple || undefined"
      :class="triggerClass"
      @click="toggleOpen"
      @keydown="onKeydown"
    >
      <span v-if="multiple && hasSelection" :class="styles.bsSelectTags">
        <span v-for="option in selectedOptions" :key="option.value" :class="styles.bsSelectTag">
          <span :class="styles.bsSelectTagLabel">{{ option.label }}</span>
          <button
            type="button"
            :class="styles.bsSelectTagRemove"
            :aria-label="`${option.label} 제거`"
            @click="removeValue(option.value, $event)"
          >
            <i :class="styles.bsSelectTagRemoveIcon" aria-hidden="true" />
          </button>
        </span>
      </span>
      <span v-else :class="styles.bsSelectTriggerLabel">
        {{ hasSelection ? selectedOptions.map((o) => o.label).join(', ') : placeholder }}
      </span>
      <i :class="styles.bsSelectChevron" aria-hidden="true" />
    </div>

    <template v-if="name != null">
      <input v-for="v in multiple ? current : [current[0] ?? '']" :key="v" type="hidden" :name="name" :value="v" />
    </template>

    <div v-if="open" :id="listId" :class="styles.bsSelectDropdown" role="listbox">
      <div v-if="searchable" :class="styles.bsSelectSearch">
        <i :class="styles.bsSelectSearchIcon" aria-hidden="true" />
        <input
          ref="searchRef"
          :class="styles.bsSelectSearchInput"
          :value="query"
          :placeholder="SELECT_DEFAULT.SEARCH_PLACEHOLDER"
          @input="onSearchInput"
        />
      </div>

      <div v-if="filtered.length === 0" :class="styles.bsSelectEmpty">{{ SELECT_DEFAULT.EMPTY_TEXT }}</div>
      <ul v-else :class="cx(styles.bsSelectList, multiple && styles.bsSelectListMultiple)">
        <li
          v-for="(option, index) in filtered"
          :key="option.value"
          role="option"
          :aria-selected="current.includes(option.value)"
          :aria-disabled="option.disabled || undefined"
          :class="
            cx(
              styles.bsSelectOption,
              current.includes(option.value) && styles.bsSelectOptionSelected,
              option.disabled && styles.bsSelectOptionDisabled,
              index === activeIndex && styles.bsSelectOptionActive
            )
          "
          @mouseenter="activeIndex = index"
          @click="commit(option)"
        >
          <span
            v-if="multiple"
            :class="
              cx(styles.bsSelectOptionCheckbox, current.includes(option.value) && styles.bsSelectOptionCheckboxChecked)
            "
            aria-hidden="true"
          >
            <svg :class="styles.bsSelectOptionCheckboxMark" viewBox="0 0 12 12" fill="none">
              <polyline
                points="2,6 5,9 10,3"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span :class="styles.bsSelectOptionLabel">{{ option.label }}</span>
          <i v-if="!multiple && current.includes(option.value)" :class="styles.bsSelectCheck" aria-hidden="true" />
          <span v-if="option.disabled" :class="styles.bsSelectDisabledTag">비활성</span>
        </li>
      </ul>
    </div>

    <div v-if="hasError || helperText != null || $slots.helperText" :class="styles.bsSelectMeta">
      <span v-if="hasError && errorMessage" :id="`${triggerId}-error`" :class="styles.bsSelectError">{{
        errorMessage
      }}</span>
      <span
        v-else-if="helperText != null || $slots.helperText"
        :id="`${triggerId}-helper`"
        :class="styles.bsSelectHelper"
      >
        <slot name="helperText">{{ helperText }}</slot>
      </span>
    </div>
  </div>
</template>
