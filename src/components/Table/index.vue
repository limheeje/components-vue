<script setup lang="ts" generic="T extends Record<string, unknown> = TableRow">
import {computed, ref} from 'vue'
import type {CSSProperties, FunctionalComponent, VNodeChild} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import Icon from '~/components/Icon'
import {TABLE_DEFAULT, TABLE_SORT_DIRECTION, TABLE_STATE_CLASS} from '~/components/Table/Table.constant'
import type {TableProps, TableRow, TableSort} from '~/components/Table/Table.type'
import styles from '~/components/Table/Table.module.scss'
const cap = (s: string) => s.replace(/(?:^|-)([a-z])/g, (m: string) => m.slice(-1).toUpperCase())

defineOptions({inheritAttrs: false})

const toSize = (v?: number | string) => (typeof v === 'number' ? `${v}px` : v)

const props = withDefaults(defineProps<TableProps<T>>(), {
  columns: () => [],
  rowKey: TABLE_DEFAULT.ROW_KEY,
  striped: false,
  hover: false,
  size: TABLE_DEFAULT.SIZE,
  loading: false,
  emptyText: TABLE_DEFAULT.EMPTY_TEXT,
  selectable: false
})

const emit = defineEmits<{
  sortChange: [TableSort | null]
  selectionChange: [(string | number)[], T[]]
}>()

/** VNodeChild 를 그대로 렌더하는 헬퍼 (render / renderRow 함수 prop 용) */
const Cell = ((p: {node: VNodeChild}) => p.node) as FunctionalComponent<{node: VNodeChild}>

function compare(a: unknown, b: unknown): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a ?? '').localeCompare(String(b ?? ''), 'ko')
}

/** 연속 동일 값 → 첫 행에 span, 이후 행에 0 */
function buildRowSpanMap(rows: TableRow[], field: string): Map<number, number> {
  const map = new Map<number, number>()
  if (rows.length === 0) return map
  let start = 0
  for (let i = 1; i <= rows.length; i++) {
    if (i === rows.length || rows[i]?.[field] !== rows[start]?.[field]) {
      map.set(start, i - start)
      for (let j = start + 1; j < i; j++) map.set(j, 0)
      start = i
    }
  }
  return map
}

function keyOf(row: T, index: number): string | number {
  if (typeof props.rowKey === 'function') return props.rowKey(row, index)
  return ((row as TableRow)[props.rowKey] as string | number) ?? index
}

function stringify(v: unknown): string {
  return v == null ? '' : String(v)
}

function alignStyle(a?: string): CSSProperties {
  return a ? {textAlign: a as CSSProperties['textAlign']} : {}
}

// ── 정렬 (제어 or 내부) ──
const innerSort = ref<TableSort | null>(null)
const activeSort = computed(() => (props.sort !== undefined ? props.sort : innerSort.value))

const sortedData = computed(() => {
  const s = activeSort.value
  if (!s) return props.data
  const arr = [...props.data]
  arr.sort((a, b) => {
    const r = compare((a as TableRow)[s.key], (b as TableRow)[s.key])
    return s.direction === TABLE_SORT_DIRECTION.ASC ? r : -r
  })
  return arr
})

function cycleSort(key: string) {
  const s = activeSort.value
  let next: TableSort | null
  if (!s || s.key !== key) next = {key, direction: TABLE_SORT_DIRECTION.ASC}
  else if (s.direction === TABLE_SORT_DIRECTION.ASC) next = {key, direction: TABLE_SORT_DIRECTION.DESC}
  else next = null
  if (props.sort === undefined) innerSort.value = next
  emit('sortChange', next)
}

// ── 페이지네이션 슬라이스 ──
const total = computed(() => props.pagination?.total ?? sortedData.value.length)
const totalPages = computed(() =>
  props.pagination ? Math.max(1, Math.ceil(total.value / props.pagination.pageSize)) : 1
)
const viewData = computed(() => {
  const p = props.pagination
  if (!p) return sortedData.value
  return sortedData.value.slice((p.page - 1) * p.pageSize, p.page * p.pageSize)
})

// ── 선택 (제어 or 내부) ──
const innerSelected = ref<(string | number)[]>([])
const selected = computed(() => props.selectedRowKeys ?? innerSelected.value)
const selectedSet = computed(() => new Set(selected.value))

function emitSelection(keys: (string | number)[]) {
  if (props.selectedRowKeys === undefined) innerSelected.value = keys
  const rows = viewData.value.filter((r, i) => keys.includes(keyOf(r, i)))
  emit('selectionChange', keys, rows)
}

const viewKeys = computed(() => viewData.value.map((r, i) => keyOf(r, i)))
const allSelected = computed(() => viewKeys.value.length > 0 && viewKeys.value.every((k) => selectedSet.value.has(k)))

function toggleAll() {
  emitSelection(allSelected.value ? [] : viewKeys.value)
}
function toggleRow(key: string | number) {
  emitSelection(selectedSet.value.has(key) ? selected.value.filter((k) => k !== key) : [...selected.value, key])
}

// ── rowspan 맵 ──
const rowSpanMaps = computed(() => {
  const maps: Record<string, Map<number, number>> = {}
  for (const col of props.columns) {
    if (col.rowSpanKey) maps[col.key] = buildRowSpanMap(viewData.value as TableRow[], col.rowSpanKey)
  }
  return maps
})

function hasSpanMap(colKey: string): boolean {
  return !!rowSpanMaps.value[colKey]
}
function cellHidden(colKey: string, rowIdx: number): boolean {
  const m = rowSpanMaps.value[colKey]
  return !!m && m.get(rowIdx) === 0
}
function cellSpan(colKey: string, rowIdx: number): number | undefined {
  const m = rowSpanMaps.value[colKey]
  if (!m) return undefined
  const s = m.get(rowIdx)
  return s != null && s > 1 ? s : undefined
}

const colCount = computed(() => (props.headGroups?.[0]?.length ?? props.columns.length) + (props.selectable ? 1 : 0))

const rootClass = computed(() =>
  cx(
    styles.bsTable,
    styles[`bsTableSize${cap(props.size)}`],
    props.striped && styles[TABLE_STATE_CLASS.IS_STRIPED],
    props.hover && styles[TABLE_STATE_CLASS.IS_HOVER],
    props.loading && styles[TABLE_STATE_CLASS.IS_LOADING],
    resolveClassNames(props.classNames)
  )
)
</script>

<template>
  <div v-bind="$attrs" :class="rootClass">
    <div :class="styles.bsTableScroll">
      <table :class="styles.bsTableMain">
        <thead>
          <template v-if="headGroups && headGroups.length > 0">
            <tr v-for="(group, gi) in headGroups" :key="gi">
              <th v-if="gi === 0 && selectable" :class="styles.bsTableTh" :rowspan="headGroups.length">
                <input type="checkbox" :checked="allSelected" aria-label="전체 선택" @change="toggleAll" />
              </th>
              <th
                v-for="(cell, ci) in group"
                :key="ci"
                :class="styles.bsTableTh"
                :colspan="cell.colSpan"
                :rowspan="cell.rowSpan"
                :style="[{width: toSize(cell.width)}, alignStyle(cell.align ?? 'center'), cell.style]"
              >
                {{ cell.label }}
              </th>
            </tr>
          </template>

          <tr v-else>
            <th v-if="selectable" :class="styles.bsTableTh">
              <input type="checkbox" :checked="allSelected" aria-label="전체 선택" @change="toggleAll" />
            </th>
            <th
              v-for="col in columns"
              :key="col.key"
              :class="cx(styles.bsTableTh, col.sortable && styles.bsTableSortable)"
              :style="[{width: toSize(col.width)}, alignStyle(col.align)]"
              :aria-sort="
                activeSort?.key === col.key ? (activeSort?.direction === 'asc' ? 'ascending' : 'descending') : undefined
              "
              @click="col.sortable ? cycleSort(col.key) : undefined"
            >
              <span :class="styles.bsTableThInner">
                {{ col.label }}
                <Icon
                  v-if="col.sortable"
                  :class-names="styles.bsTableSortIcon"
                  :size="13"
                  :name="
                    activeSort?.key !== col.key
                      ? 'chevrons-left'
                      : activeSort?.direction === 'asc'
                        ? 'chevron-up'
                        : 'chevron-down'
                  "
                  :rotate="activeSort?.key !== col.key ? 90 : 0"
                />
              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="loading">
            <td :class="styles.bsTableMessageCell" :colspan="colCount || 1">로딩 중...</td>
          </tr>
          <tr v-else-if="viewData.length === 0">
            <td :class="styles.bsTableMessageCell" :colspan="colCount || 1">
              <slot name="empty">{{ emptyText }}</slot>
            </td>
          </tr>
          <template v-for="(row, rowIdx) in viewData" v-else :key="keyOf(row, rowIdx)">
            <Cell v-if="renderRow && renderRow(row, rowIdx) != null" :node="renderRow(row, rowIdx)" />
            <tr
              v-else
              :class="cx(styles.bsTableTr, selectedSet.has(keyOf(row, rowIdx)) && styles.bsTableSelected)"
              @click="selectable ? toggleRow(keyOf(row, rowIdx)) : undefined"
            >
              <td v-if="selectable" :class="styles.bsTableTd">
                <input
                  type="checkbox"
                  :checked="selectedSet.has(keyOf(row, rowIdx))"
                  aria-label="행 선택"
                  @change="toggleRow(keyOf(row, rowIdx))"
                  @click.stop
                />
              </td>
              <template v-for="col in columns" :key="col.key">
                <td
                  v-if="!cellHidden(col.key, rowIdx)"
                  :class="cx(styles.bsTableTd, hasSpanMap(col.key) && styles.bsTableSpanCell)"
                  :rowspan="cellSpan(col.key, rowIdx)"
                  :style="[alignStyle(col.align), col.cellStyle ? col.cellStyle(row[col.key], row, rowIdx) : {}]"
                >
                  <Cell v-if="col.render" :node="col.render(row[col.key], row, rowIdx)" />
                  <template v-else>{{ stringify(row[col.key]) }}</template>
                </td>
              </template>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div v-if="pagination" :class="styles.bsTablePagination">
      <span :class="styles.bsTableTotal">총 {{ total }}개</span>
      <div
        :class="
          cx(
            styles.bsTablePager,
            styles[`bsTablePagerAlign${(pagination.align ?? 'right').replace(/^./, (c) => c.toUpperCase())}`]
          )
        "
      >
        <button
          type="button"
          :class="styles.bsTablePageButton"
          :disabled="pagination.page <= 1"
          aria-label="이전 페이지"
          @click="pagination.onChange(pagination.page - 1)"
        >
          <Icon name="chevron-left" :size="13" />
        </button>
        <button
          v-for="p in totalPages"
          :key="p"
          type="button"
          :class="cx(styles.bsTablePageButton, p === pagination.page && styles.bsTablePageActive)"
          :aria-current="p === pagination.page"
          @click="pagination.onChange(p)"
        >
          {{ p }}
        </button>
        <button
          type="button"
          :class="styles.bsTablePageButton"
          :disabled="pagination.page >= totalPages"
          aria-label="다음 페이지"
          @click="pagination.onChange(pagination.page + 1)"
        >
          <Icon name="chevron-right" :size="13" />
        </button>
      </div>
    </div>
  </div>
</template>
