import {computed, shallowReactive, shallowRef, watch} from 'vue'

import {CASCADER_CONFIG_DEFAULT} from '~/components/Cascader/Cascader.constant'
import type {
  CascaderConfig,
  CascaderLazyLoad,
  CascaderModelValue,
  CascaderNode,
  CascaderOption,
  CascaderValue
} from '~/components/Cascader/Cascader.type'

export interface ResolvedCascaderConfig {
  expandTrigger: NonNullable<CascaderConfig['expandTrigger']>
  multiple: boolean
  checkStrictly: boolean
  emitPath: boolean
  lazy: boolean
  lazyLoad?: CascaderLazyLoad
  value: string
  label: string
  children: string
  disabled: string
  leaf: string
}

export function resolveConfig(config?: CascaderConfig): ResolvedCascaderConfig {
  const d = CASCADER_CONFIG_DEFAULT
  return {
    expandTrigger: config?.expandTrigger ?? d.EXPAND_TRIGGER,
    multiple: config?.multiple ?? d.MULTIPLE,
    checkStrictly: config?.checkStrictly ?? d.CHECK_STRICTLY,
    emitPath: config?.emitPath ?? d.EMIT_PATH,
    lazy: config?.lazy ?? d.LAZY,
    lazyLoad: config?.lazyLoad,
    value: config?.value ?? d.VALUE,
    label: config?.label ?? d.LABEL,
    children: config?.children ?? d.CHILDREN,
    disabled: config?.disabled ?? d.DISABLED,
    leaf: config?.leaf ?? d.LEAF
  }
}

/** 루트 레벨 동적 로딩 때 lazyLoad 에 넘기는 pseudo 노드 (level 0) */
function createRootNode(): CascaderNode {
  return {
    uid: 0,
    data: {},
    value: '',
    label: '',
    level: 0,
    parent: null,
    children: [],
    disabled: false,
    leaf: false,
    loaded: false,
    loading: false,
    pathValues: [],
    pathLabels: []
  }
}

/** 루트→노드 조상 체인 (노드 포함) */
export function chainOf(node: CascaderNode): CascaderNode[] {
  const chain: CascaderNode[] = []
  for (let n: CascaderNode | null = node; n; n = n.parent) chain.unshift(n)
  return chain
}

export interface CascaderCheckState {
  checked: boolean
  indeterminate: boolean
}

/**
 * 모든 노드의 체크 상태를 한 번에 계산 (post-order).
 * - strict: 노드마다 독립 (set 포함 여부)
 * - 일반: 활성 leaf 가 전부 체크면 checked, 일부면 indeterminate
 */
export function computeCheckStates(
  roots: CascaderNode[],
  checked: Set<number>,
  strict: boolean
): Map<number, CascaderCheckState> {
  const map = new Map<number, CascaderCheckState>()
  const walk = (node: CascaderNode): [number, number] => {
    let total = 0
    let done = 0
    if (node.children.length > 0) {
      for (const child of node.children) {
        const [t, d] = walk(child)
        total += t
        done += d
      }
    } else if (node.leaf && !node.disabled) {
      total = 1
      done = checked.has(node.uid) ? 1 : 0
    }
    if (strict || node.children.length === 0) {
      map.set(node.uid, {checked: checked.has(node.uid), indeterminate: false})
    } else {
      const all = total > 0 && done === total
      map.set(node.uid, {checked: all, indeterminate: !all && done > 0})
    }
    return [total, done]
  }
  roots.forEach(walk)
  return map
}

/** 노드 아래(자신 포함)의 선택 가능한 leaf */
export function enabledLeaves(node: CascaderNode): CascaderNode[] {
  if (node.children.length > 0) return node.children.flatMap(enabledLeaves)
  return node.leaf && !node.disabled ? [node] : []
}

/** 옵션 트리 + 동적 로딩 + 값 ↔ 노드 변환 */
export function useCascaderTree(
  getOptions: () => CascaderOption[] | undefined,
  getConfig: () => CascaderConfig | undefined
) {
  const cfg = computed(() => resolveConfig(getConfig()))
  const roots = shallowRef<CascaderNode[]>([])
  const rootLoading = shallowRef(false)
  let seq = 0
  let generation = 0

  function build(list: CascaderOption[], parent: CascaderNode | null): CascaderNode[] {
    const c = cfg.value
    return list.map((data) => {
      const kids = data[c.children] as CascaderOption[] | undefined
      const leafFlag = data[c.leaf]
      const hasKids = Array.isArray(kids) && kids.length > 0
      const label = String(data[c.label] ?? '')
      const value = data[c.value] as CascaderValue
      const node = shallowReactive<CascaderNode>({
        uid: ++seq,
        data,
        value,
        label,
        level: (parent?.level ?? 0) + 1,
        parent,
        children: [],
        disabled: Boolean(data[c.disabled]) || (!c.checkStrictly && Boolean(parent?.disabled)),
        leaf: typeof leafFlag === 'boolean' ? leafFlag : c.lazy ? Array.isArray(kids) && !hasKids : !hasKids,
        loaded: !c.lazy || Array.isArray(kids),
        loading: false,
        pathValues: [...(parent?.pathValues ?? []), value],
        pathLabels: [...(parent?.pathLabels ?? []), label]
      })
      if (hasKids) node.children = build(kids as CascaderOption[], node)
      return node
    })
  }

  function loadRoot() {
    const c = cfg.value
    if (!c.lazyLoad) return
    const gen = generation
    rootLoading.value = true
    c.lazyLoad(createRootNode(), (data) => {
      if (gen !== generation) return
      rootLoading.value = false
      roots.value = data && data.length > 0 ? build(data, null) : []
    })
  }

  function rebuild() {
    generation++
    rootLoading.value = false
    const opts = getOptions()
    if (opts && opts.length > 0) {
      roots.value = build(opts, null)
    } else {
      roots.value = []
      if (cfg.value.lazy) loadRoot()
    }
  }

  // config 객체 리터럴이 렌더마다 새로 만들어져도 트리를 다시 만들지 않도록 구조에 영향 주는 값만 감시
  watch(getOptions, rebuild)
  watch(() => {
    const c = cfg.value
    return [c.value, c.label, c.children, c.disabled, c.leaf, c.lazy, c.checkStrictly].join('|')
  }, rebuild)
  rebuild()

  /** 하위 노드 동적 로딩 */
  function load(node: CascaderNode): Promise<void> {
    const c = cfg.value
    if (!c.lazy || !c.lazyLoad || node.loaded || node.leaf || node.loading) return Promise.resolve()
    const gen = generation
    node.loading = true
    return new Promise<void>((resolve) => {
      c.lazyLoad?.(node, (data) => {
        if (gen === generation) {
          node.loading = false
          node.loaded = true
          if (data && data.length > 0) {
            node.children = build(data, node)
          } else {
            node.children = []
            node.leaf = true
          }
        }
        resolve()
      })
    })
  }

  function flatten(list: CascaderNode[] = roots.value, out: CascaderNode[] = []): CascaderNode[] {
    for (const n of list) {
      out.push(n)
      if (n.children.length > 0) flatten(n.children, out)
    }
    return out
  }

  function findByPath(values: CascaderValue[]): CascaderNode | undefined {
    let list = roots.value
    let found: CascaderNode | undefined
    for (const v of values) {
      found = list.find((n) => n.value === v)
      if (!found) return undefined
      list = found.children
    }
    return found
  }

  function findByValue(value: CascaderValue): CascaderNode | undefined {
    return flatten().find((n) => n.value === value)
  }

  function resolveItem(item: unknown): CascaderNode | undefined {
    if (cfg.value.emitPath) return Array.isArray(item) ? findByPath(item as CascaderValue[]) : undefined
    return item === undefined || item === null || item === '' ? undefined : findByValue(item as CascaderValue)
  }

  /** v-model 값 → 선택된 노드 목록 */
  function resolveModel(model: CascaderModelValue | undefined | null): CascaderNode[] {
    if (cfg.value.multiple) {
      const list = Array.isArray(model) ? (model as unknown[]) : []
      return list.map(resolveItem).filter((n): n is CascaderNode => n != null)
    }
    const node = resolveItem(model)
    return node ? [node] : []
  }

  /** 선택된 노드 목록 → v-model 값 */
  function encode(nodes: CascaderNode[]): CascaderModelValue {
    const c = cfg.value
    const one = (n: CascaderNode) => (c.emitPath ? n.pathValues : n.value)
    if (c.multiple) return nodes.map(one) as CascaderModelValue
    const first = nodes[0]
    if (first) return one(first)
    return c.emitPath ? [] : ''
  }

  function emptyModel(): CascaderModelValue {
    return encode([])
  }

  /** lazy + emitPath 에서 v-model 경로가 아직 로드되지 않았으면 순서대로 로딩 */
  async function ensureModel(model: CascaderModelValue | undefined | null): Promise<void> {
    const c = cfg.value
    if (!c.lazy || !c.emitPath || !Array.isArray(model) || model.length === 0) return
    const paths = (Array.isArray(model[0]) ? model : [model]) as CascaderValue[][]
    for (const path of paths) {
      let list = roots.value
      for (const v of path) {
        const node = list.find((n) => n.value === v)
        if (!node) break
        await load(node)
        list = node.children
      }
    }
  }

  return {
    cfg,
    roots,
    rootLoading,
    load,
    flatten,
    findByPath,
    findByValue,
    resolveModel,
    encode,
    emptyModel,
    ensureModel
  }
}

export type CascaderTree = ReturnType<typeof useCascaderTree>
