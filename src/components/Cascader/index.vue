<script setup lang="ts">
import {computed, nextTick, onBeforeUnmount, ref, useId, watch} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import {CASCADER_DEFAULT, CASCADER_STATE_CLASS} from '~/components/Cascader/Cascader.constant'
import type {CascaderModelValue, CascaderNode, CascaderProps, CascaderValue} from '~/components/Cascader/Cascader.type'
import {computeCheckStates, useCascaderTree} from '~/components/Cascader/Cascader.util'
import CascaderPanel from '~/components/Cascader/CascaderPanel.vue'
import styles from '~/components/Cascader/Cascader.module.scss'
const cap = (s: string) => s.replace(/(?:^|-)([a-z])/g, (m: string) => m.slice(-1).toUpperCase())

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<CascaderProps>(), {
  placeholder: CASCADER_DEFAULT.PLACEHOLDER,
  size: CASCADER_DEFAULT.SIZE,
  disabled: false,
  clearable: false,
  showAllLevels: true,
  collapseTags: false,
  separator: CASCADER_DEFAULT.SEPARATOR,
  filterable: false,
  debounce: CASCADER_DEFAULT.DEBOUNCE,
  error: false
})

const emit = defineEmits<{
  'update:modelValue': [CascaderModelValue]
  change: [CascaderModelValue]
  expandChange: [CascaderValue[]]
  blur: [FocusEvent]
  focus: [FocusEvent]
  visibleChange: [boolean]
  removeTag: [CascaderValue | CascaderValue[]]
}>()

const tree = useCascaderTree(
  () => props.options,
  () => props.config
)
const cfg = tree.cfg

const rootRef = ref<HTMLElement>()
const searchRef = ref<HTMLInputElement>()
const panelRef = ref<InstanceType<typeof CascaderPanel>>()

// ── 값 ────────────────────────────────────────────────
const isControlled = computed(() => props.modelValue !== undefined)
const uncontrolled = ref<CascaderModelValue | undefined>(props.defaultValue)
const model = computed(() => (isControlled.value ? props.modelValue : uncontrolled.value))
const selected = computed(() => tree.resolveModel(model.value))
const hasSelection = computed(() => selected.value.length > 0)
const panelModel = computed(() => model.value ?? tree.emptyModel())

watch(model, (v) => void tree.ensureModel(v), {immediate: true})

function setModel(payload: CascaderModelValue) {
  if (!isControlled.value) uncontrolled.value = payload
  emit('update:modelValue', payload)
}

function commit(nodes: CascaderNode[]) {
  const payload = tree.encode(nodes)
  setModel(payload)
  emit('change', payload)
}

const labelOf = (n: CascaderNode) => (props.showAllLevels ? n.pathLabels.join(props.separator) : n.label)
const singleLabel = computed(() => (selected.value[0] ? labelOf(selected.value[0]) : ''))

const shownTags = computed(() => (props.collapseTags ? selected.value.slice(0, 1) : selected.value))
const hiddenCount = computed(() => (props.collapseTags ? Math.max(0, selected.value.length - 1) : 0))

function clear(e: MouseEvent) {
  e.stopPropagation()
  if (props.disabled) return
  commit([])
}

function removeTag(node: CascaderNode, e: MouseEvent) {
  e.stopPropagation()
  if (props.disabled) return
  emit('removeTag', cfg.value.emitPath ? node.pathValues : node.value)
  commit(selected.value.filter((n) => n.uid !== node.uid))
}

function onPanelUpdate(payload: CascaderModelValue) {
  setModel(payload)
}
function onPanelChange(payload: CascaderModelValue) {
  emit('change', payload)
  if (!cfg.value.multiple) closeDropdown()
}

// ── 열기/닫기 ──────────────────────────────────────────
const open = ref(false)
const query = ref('')
const keyword = ref('')
const activeIndex = ref(-1)

const reactId = useId()
const triggerId = computed(() => props.id ?? reactId)
const listId = `${reactId}-list`

const errorMessage = computed(() => (typeof props.error === 'string' ? props.error : ''))
const hasError = computed(() => props.error === true || errorMessage.value.length > 0)

function resetSearch() {
  query.value = ''
  keyword.value = ''
  activeIndex.value = -1
}

function closeDropdown() {
  open.value = false
  resetSearch()
}

function toggleOpen() {
  if (props.disabled) return
  if (open.value) closeDropdown()
  else open.value = true
}

function onDocDown(e: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) closeDropdown()
}
watch(open, (o) => {
  emit('visibleChange', o)
  if (o) {
    document.addEventListener('mousedown', onDocDown)
    if (props.filterable) nextTick(() => searchRef.value?.focus())
  } else {
    document.removeEventListener('mousedown', onDocDown)
  }
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocDown)
  clearTimeout(timer)
})

// ── 검색 ──────────────────────────────────────────────
let timer: ReturnType<typeof setTimeout> | undefined

watch(query, (q) => {
  clearTimeout(timer)
  activeIndex.value = -1
  if (!q) {
    keyword.value = ''
    return
  }
  timer = setTimeout(async () => {
    if (props.beforeFilter) {
      try {
        if ((await props.beforeFilter(q)) === false) return
      } catch {
        return
      }
    }
    keyword.value = q
  }, props.debounce)
})

const suggestions = computed<CascaderNode[]>(() => {
  const k = keyword.value
  if (!props.filterable || !k) return []
  const lower = k.toLowerCase()
  const all = tree.flatten()
  const candidates = cfg.value.checkStrictly ? all : all.filter((n) => n.leaf)
  const match = props.filterMethod
  return candidates.filter((n) =>
    match ? match(n, k) : n.pathLabels.join(props.separator).toLowerCase().includes(lower)
  )
})
const searching = computed(() => props.filterable && keyword.value !== '')

function isPicked(node: CascaderNode) {
  return selected.value.some((n) => n.uid === node.uid)
}

function pickSuggestion(node: CascaderNode) {
  if (node.disabled) return
  if (cfg.value.multiple) {
    commit(isPicked(node) ? selected.value.filter((n) => n.uid !== node.uid) : [...selected.value, node])
    return
  }
  commit([node])
  closeDropdown()
}

function onSearchInput(e: Event) {
  query.value = (e.target as HTMLInputElement).value
  open.value = true
}

// ── 포커스 ────────────────────────────────────────────
const focused = ref(false)
function onFocusIn(e: FocusEvent) {
  if (focused.value) return
  focused.value = true
  emit('focus', e)
}
function onFocusOut(e: FocusEvent) {
  if (rootRef.value?.contains(e.relatedTarget as Node | null)) return
  focused.value = false
  emit('blur', e)
  closeDropdown()
}

// ── 키보드 ────────────────────────────────────────────
function onKeydown(e: KeyboardEvent) {
  if (props.disabled) return
  const typing = e.target instanceof HTMLInputElement
  if (e.key === 'Escape') {
    closeDropdown()
    return
  }
  if (e.key === 'Tab') {
    closeDropdown()
    return
  }
  if (e.key === 'Backspace' && typing && query.value === '' && cfg.value.multiple) {
    const last = selected.value[selected.value.length - 1]
    if (last) {
      emit('removeTag', cfg.value.emitPath ? last.pathValues : last.value)
      commit(selected.value.slice(0, -1))
    }
    return
  }
  if (!open.value) {
    if (e.key === 'Enter' || e.key === 'ArrowDown' || (e.key === ' ' && !typing)) {
      e.preventDefault()
      open.value = true
    }
    return
  }
  if (searching.value) {
    const list = suggestions.value
    const enabled = list.map((n, i) => (n.disabled ? -1 : i)).filter((i) => i >= 0)
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (enabled.length === 0) return
      const dir = e.key === 'ArrowDown' ? 1 : -1
      const pos = enabled.indexOf(activeIndex.value)
      activeIndex.value = enabled[(pos + dir + enabled.length) % enabled.length] ?? enabled[0] ?? -1
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const node = list[activeIndex.value]
      if (node) pickSuggestion(node)
    }
    return
  }
  // 입력 중에는 좌우 방향키(커서 이동)·스페이스를 패널로 넘기지 않는다
  if (typing && (e.key === ' ' || (query.value !== '' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')))) return
  if (panelRef.value?.handleKeydown(e)) e.preventDefault()
}

// ── 공개 메서드 ───────────────────────────────────────
function getCheckedNodes(leafOnly = false): CascaderNode[] {
  const c = cfg.value
  if (c.multiple && !c.checkStrictly) {
    const states = computeCheckStates(tree.roots.value, new Set(selected.value.map((n) => n.uid)), false)
    return tree.flatten().filter((n) => states.get(n.uid)?.checked && (!leafOnly || n.leaf))
  }
  return leafOnly ? selected.value.filter((n) => n.leaf) : [...selected.value]
}

const triggerRef = ref<HTMLElement>()
defineExpose({
  el: rootRef,
  getCheckedNodes,
  focus: () => (props.filterable ? searchRef.value : triggerRef.value)?.focus(),
  blur: () => (document.activeElement as HTMLElement | null)?.blur()
})

// ── 클래스 ────────────────────────────────────────────
const rootClass = computed(() =>
  cx(styles.bsCascader, styles[`bsCascaderSize${cap(props.size)}`], resolveClassNames(props.classNames))
)
const triggerClass = computed(() =>
  cx(
    styles.bsCascaderTrigger,
    cfg.value.multiple && styles.bsCascaderTriggerMultiple,
    props.clearable && hasSelection.value && !props.disabled && styles.bsCascaderTriggerClearable,
    open.value && styles[CASCADER_STATE_CLASS.IS_OPEN],
    hasError.value && styles[CASCADER_STATE_CLASS.IS_ERROR],
    props.disabled && styles[CASCADER_STATE_CLASS.IS_DISABLED],
    !hasSelection.value && styles[CASCADER_STATE_CLASS.IS_PLACEHOLDER]
  )
)
</script>

<template>
  <div ref="rootRef" v-bind="$attrs" :class="rootClass" @focusin="onFocusIn" @focusout="onFocusOut">
    <div
      :id="triggerId"
      ref="triggerRef"
      role="combobox"
      :tabindex="disabled ? -1 : 0"
      aria-haspopup="true"
      :aria-expanded="open"
      :aria-controls="listId"
      :aria-disabled="disabled || undefined"
      :aria-invalid="hasError || undefined"
      :class="triggerClass"
      @click="toggleOpen"
      @keydown="onKeydown"
    >
      <!-- 다중: 태그 -->
      <span v-if="cfg.multiple" :class="styles.bsCascaderTags">
        <span v-for="node in shownTags" :key="node.uid" :class="styles.bsCascaderTag">
          <span :class="styles.bsCascaderTagLabel">{{ labelOf(node) }}</span>
          <button
            type="button"
            :class="styles.bsCascaderTagRemove"
            :aria-label="`${labelOf(node)} 제거`"
            tabindex="-1"
            @click="removeTag(node, $event)"
          >
            <i :class="styles.bsCascaderTagRemoveIcon" aria-hidden="true" />
          </button>
        </span>
        <span v-if="hiddenCount > 0" :class="styles.bsCascaderTag">
          <span :class="styles.bsCascaderTagLabel">+ {{ hiddenCount }}</span>
        </span>
        <input
          v-if="filterable"
          ref="searchRef"
          :class="styles.bsCascaderTagsInput"
          :value="query"
          :placeholder="hasSelection ? '' : placeholder"
          :disabled="disabled"
          autocomplete="off"
          @input="onSearchInput"
          @click.stop="open = !disabled"
        />
        <span v-else-if="!hasSelection" :class="styles.bsCascaderLabel">{{ placeholder }}</span>
      </span>

      <!-- 단일 -->
      <template v-else>
        <input
          v-if="filterable && open"
          ref="searchRef"
          :class="styles.bsCascaderSearchInput"
          :value="query"
          :placeholder="hasSelection ? singleLabel : CASCADER_DEFAULT.SEARCH_PLACEHOLDER"
          autocomplete="off"
          @input="onSearchInput"
          @click.stop
        />
        <span v-else :class="styles.bsCascaderLabel">{{ hasSelection ? singleLabel : placeholder }}</span>
      </template>

      <i :class="styles.bsCascaderClear" role="button" aria-label="지우기" @click="clear" />
      <i :class="styles.bsCascaderChevron" aria-hidden="true" />
    </div>

    <template v-if="name != null">
      <input
        v-for="n in cfg.multiple ? selected : [selected[0]]"
        :key="n?.uid ?? 'empty'"
        type="hidden"
        :name="name"
        :value="n?.value ?? ''"
      />
    </template>

    <div v-if="open" :id="listId" :class="styles.bsCascaderDropdown" @mousedown.prevent>
      <template v-if="searching">
        <div v-if="suggestions.length === 0" :class="styles.bsCascaderEmpty">
          <slot name="empty">{{ CASCADER_DEFAULT.NO_MATCH_TEXT }}</slot>
        </div>
        <ul v-else :class="styles.bsCascaderSuggestions" role="listbox">
          <li
            v-for="(node, index) in suggestions"
            :key="node.uid"
            role="option"
            :aria-selected="isPicked(node)"
            :aria-disabled="node.disabled || undefined"
            :class="
              cx(
                styles.bsCascaderSuggestion,
                isPicked(node) && styles.bsCascaderSuggestionSelected,
                node.disabled && styles.bsCascaderSuggestionDisabled,
                index === activeIndex && styles.bsCascaderSuggestionActive
              )
            "
            @mouseenter="activeIndex = index"
            @click="pickSuggestion(node)"
          >
            <span :class="styles.bsCascaderSuggestionLabel">{{ node.pathLabels.join(separator) }}</span>
            <i v-if="isPicked(node)" :class="styles.bsCascaderNodeCheck" aria-hidden="true" />
          </li>
        </ul>
      </template>
      <CascaderPanel
        v-else
        ref="panelRef"
        embedded
        :store="tree"
        :model-value="panelModel"
        @update:model-value="onPanelUpdate"
        @change="onPanelChange"
        @expand-change="emit('expandChange', $event)"
      >
        <template #default="{node, data}">
          <slot :node="node" :data="data">{{ node.label }}</slot>
        </template>
        <template v-if="$slots.empty" #empty>
          <slot name="empty" />
        </template>
      </CascaderPanel>
    </div>

    <div v-if="hasError || helperText != null || $slots.helperText" :class="styles.bsCascaderMeta">
      <span v-if="hasError && errorMessage" :id="`${triggerId}-error`" :class="styles.bsCascaderError">{{
        errorMessage
      }}</span>
      <span
        v-else-if="helperText != null || $slots.helperText"
        :id="`${triggerId}-helper`"
        :class="styles.bsCascaderHelper"
      >
        <slot name="helperText">{{ helperText }}</slot>
      </span>
    </div>
  </div>
</template>
