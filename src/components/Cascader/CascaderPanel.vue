<script setup lang="ts">
import {computed, nextTick, onMounted, ref, shallowRef, watch} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import Checkbox from '~/components/Checkbox'
import Radio from '~/components/Radio'

import {CASCADER_DEFAULT, CASCADER_EXPAND_TRIGGER} from '~/components/Cascader/Cascader.constant'
import type {
  CascaderModelValue,
  CascaderNode,
  CascaderPanelProps,
  CascaderValue
} from '~/components/Cascader/Cascader.type'
import {chainOf, computeCheckStates, enabledLeaves, useCascaderTree} from '~/components/Cascader/Cascader.util'
import type {CascaderTree} from '~/components/Cascader/Cascader.util'
import styles from '~/components/Cascader/Cascader.module.scss'

defineOptions({inheritAttrs: false})

/** store/embedded 는 Cascader 가 내부적으로 쓰는 값 (공개 API 아님) */
const props = defineProps<CascaderPanelProps & {store?: object; embedded?: boolean}>()

const emit = defineEmits<{
  'update:modelValue': [CascaderModelValue]
  change: [CascaderModelValue]
  expandChange: [CascaderValue[]]
}>()

const tree: CascaderTree =
  (props.store as CascaderTree | undefined) ??
  useCascaderTree(
    () => props.options,
    () => props.config
  )
const cfg = tree.cfg

const rootRef = ref<HTMLElement>()

const isControlled = computed(() => props.modelValue !== undefined)
const uncontrolled = ref<CascaderModelValue | undefined>(props.defaultValue)
const current = computed(() => (isControlled.value ? props.modelValue : uncontrolled.value))
const selected = computed(() => tree.resolveModel(current.value))
const selectedSet = computed(() => new Set(selected.value.map((n) => n.uid)))
const states = computed(() => computeCheckStates(tree.roots.value, selectedSet.value, cfg.value.checkStrictly))

if (!props.store) watch(current, (v) => void tree.ensureModel(v), {immediate: true})

const activePath = shallowRef<CascaderNode[]>([])
const focusNode = shallowRef<CascaderNode | null>(null)

const menus = computed<CascaderNode[][]>(() => {
  const list: CascaderNode[][] = [tree.roots.value]
  for (const n of activePath.value) {
    if (n.children.length === 0) break
    list.push(n.children)
  }
  return list
})

function syncActive() {
  const n = selected.value[0]
  activePath.value = n ? chainOf(n) : []
  focusNode.value = n ?? null
}
onMounted(syncActive)
// lazy 로 선택 경로가 뒤늦게 로드된 경우 펼침 위치를 맞춘다
watch(
  () => selected.value[0]?.uid,
  () => {
    if (activePath.value.length === 0) syncActive()
  }
)

function commit(nodes: CascaderNode[]) {
  const payload = tree.encode(nodes)
  if (!isControlled.value) uncontrolled.value = payload
  emit('update:modelValue', payload)
  emit('change', payload)
}

function expand(node: CascaderNode) {
  const chain = chainOf(node)
  const changed = chain.map((n) => n.uid).join() !== activePath.value.map((n) => n.uid).join()
  activePath.value = chain
  if (!node.leaf) void tree.load(node)
  if (changed)
    emit(
      'expandChange',
      chain.map((n) => n.value)
    )
}

async function toggleMulti(node: CascaderNode) {
  if (node.disabled) return
  if (cfg.value.checkStrictly) {
    const cur = selected.value
    commit(selectedSet.value.has(node.uid) ? cur.filter((n) => n.uid !== node.uid) : [...cur, node])
    return
  }
  await tree.load(node)
  const leaves = enabledLeaves(node)
  if (leaves.length === 0) return
  const cur = selected.value
  const set = selectedSet.value
  if (leaves.every((l) => set.has(l.uid))) {
    const remove = new Set(leaves.map((l) => l.uid))
    commit(cur.filter((n) => !remove.has(n.uid)))
  } else {
    commit([...cur, ...leaves.filter((l) => !set.has(l.uid))])
  }
}

function pick(node: CascaderNode) {
  if (node.disabled) return
  if (cfg.value.multiple) void toggleMulti(node)
  else commit([node])
}

function onNodeClick(node: CascaderNode) {
  if (node.disabled) return
  focusNode.value = node
  const wasLeaf = node.leaf // 동기 lazyLoad 가 클릭 도중 leaf 로 바꿔도 즉시 선택하지 않는다
  expand(node)
  if (wasLeaf) pick(node)
}

function onControlChange(node: CascaderNode) {
  focusNode.value = node
  pick(node)
}

function onNodeEnter(node: CascaderNode) {
  if (cfg.value.expandTrigger === CASCADER_EXPAND_TRIGGER.HOVER && !node.disabled) expand(node)
}

const showControl = computed(() => cfg.value.multiple || cfg.value.checkStrictly)

function stateOf(node: CascaderNode) {
  return states.value.get(node.uid) ?? {checked: false, indeterminate: false}
}
function isSelected(node: CascaderNode) {
  return selectedSet.value.has(node.uid)
}
function isInPath(node: CascaderNode) {
  return activePath.value.some((n) => n.uid === node.uid)
}

function nodeClass(node: CascaderNode) {
  const selectedLeaf = !cfg.value.multiple && isSelected(node)
  return cx(
    styles.bsCascaderNode,
    isInPath(node) && styles.bsCascaderNodeInPath,
    selectedLeaf && styles.bsCascaderNodeSelected,
    node.disabled && styles.bsCascaderNodeDisabled,
    focusNode.value?.uid === node.uid && styles.bsCascaderNodeFocus
  )
}

function siblingsOf(node: CascaderNode) {
  return node.parent ? node.parent.children : tree.roots.value
}

function scrollToFocus() {
  nextTick(() => {
    const uid = focusNode.value?.uid
    if (uid == null) return
    rootRef.value?.querySelector<HTMLElement>(`[data-uid="${uid}"]`)?.scrollIntoView?.({block: 'nearest'})
  })
}

/** 키보드 조작. 처리했으면 true (호출측에서 preventDefault) */
function handleKeydown(e: KeyboardEvent): boolean {
  const cur = focusNode.value
  const move = (dir: 1 | -1) => {
    const list = cur ? siblingsOf(cur) : tree.roots.value
    const enabled = list.filter((n) => !n.disabled)
    if (enabled.length === 0) return
    const pos = cur ? enabled.findIndex((n) => n.uid === cur.uid) : -1
    const next = enabled[(pos + dir + enabled.length) % enabled.length] ?? enabled[0]
    if (!next) return
    focusNode.value = next
    // 키보드로 옮길 때 하위 메뉴가 따라오도록 경로만 맞춘다 (열린 하위 메뉴는 닫힘)
    activePath.value = chainOf(next)
    scrollToFocus()
  }
  const enter = async (node: CascaderNode) => {
    expand(node)
    await tree.load(node)
    const child = node.children.find((n) => !n.disabled)
    if (child) {
      focusNode.value = child
      scrollToFocus()
    }
  }
  switch (e.key) {
    case 'ArrowDown':
      move(1)
      return true
    case 'ArrowUp':
      move(-1)
      return true
    case 'ArrowRight':
      if (!cur) {
        move(1)
      } else if (!cur.leaf && !cur.disabled) {
        void enter(cur)
      }
      return true
    case 'ArrowLeft':
      if (cur?.parent) {
        focusNode.value = cur.parent
        activePath.value = chainOf(cur.parent)
        scrollToFocus()
      }
      return true
    case 'Enter':
      if (!cur || cur.disabled) return true
      if (cur.leaf || cfg.value.checkStrictly) {
        if (!cur.leaf) expand(cur)
        pick(cur)
      } else {
        void enter(cur)
      }
      return true
    case ' ':
      if (cur && !cur.disabled && (cfg.value.multiple || cfg.value.checkStrictly)) pick(cur)
      return true
    default:
      return false
  }
}

function onRootKeydown(e: KeyboardEvent) {
  if (props.embedded) return
  if (handleKeydown(e)) e.preventDefault()
}

const rootClass = computed(() =>
  cx(styles.bsCascaderPanel, props.embedded && styles.bsCascaderPanelEmbedded, resolveClassNames(props.classNames))
)

defineExpose({el: rootRef, handleKeydown, getCheckedNodes: () => selected.value})
</script>

<template>
  <div
    ref="rootRef"
    v-bind="$attrs"
    :class="rootClass"
    :tabindex="embedded ? undefined : 0"
    role="group"
    @keydown="onRootKeydown"
  >
    <div v-if="tree.roots.value.length === 0" :class="styles.bsCascaderEmpty">
      <slot name="empty">
        <template v-if="tree.rootLoading.value">
          <i :class="styles.bsCascaderSpinner" aria-hidden="true" />
          {{ CASCADER_DEFAULT.LOADING_TEXT }}
        </template>
        <template v-else>{{ CASCADER_DEFAULT.EMPTY_TEXT }}</template>
      </slot>
    </div>

    <template v-else>
      <ul
        v-for="(menu, mi) in menus"
        :key="mi === 0 ? 'root' : (menu[0]?.parent?.uid ?? mi)"
        :class="styles.bsCascaderMenu"
        role="menu"
      >
        <li
          v-for="node in menu"
          :key="node.uid"
          :data-uid="node.uid"
          :role="cfg.multiple ? 'menuitemcheckbox' : cfg.checkStrictly ? 'menuitemradio' : 'menuitem'"
          :aria-checked="showControl ? (cfg.multiple ? stateOf(node).checked : isSelected(node)) : undefined"
          :aria-disabled="node.disabled || undefined"
          :aria-haspopup="!node.leaf || undefined"
          :aria-expanded="!node.leaf ? isInPath(node) : undefined"
          :class="nodeClass(node)"
          @click="onNodeClick(node)"
          @mouseenter="onNodeEnter(node)"
        >
          <!-- 선택 컨트롤은 기존 Checkbox / Radio 컴포넌트 재사용 (라벨 클릭의 펼치기와 분리하려고 click.stop) -->
          <span v-if="showControl" :class="styles.bsCascaderControl" @click.stop>
            <Checkbox
              v-if="cfg.multiple"
              size="sm"
              :checked="stateOf(node).checked"
              :indeterminate="stateOf(node).indeterminate"
              :disabled="node.disabled"
              tabindex="-1"
              @change="onControlChange(node)"
            />
            <Radio
              v-else
              size="sm"
              :checked="isSelected(node)"
              :disabled="node.disabled"
              tabindex="-1"
              @change="onControlChange(node)"
            />
          </span>

          <span :class="styles.bsCascaderNodeLabel">
            <slot :node="node" :data="node.data">{{ node.label }}</slot>
          </span>

          <i v-if="node.loading" :class="styles.bsCascaderSpinner" aria-hidden="true" />
          <i v-else-if="!node.leaf" :class="styles.bsCascaderNodeArrow" aria-hidden="true" />
          <i
            v-else-if="!cfg.multiple && !showControl && isSelected(node)"
            :class="styles.bsCascaderNodeCheck"
            aria-hidden="true"
          />
        </li>
      </ul>
    </template>
  </div>
</template>
