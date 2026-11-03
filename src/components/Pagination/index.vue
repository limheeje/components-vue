<script setup lang="ts">
import {computed} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import Icon from '~/components/Icon'
import {
  PAGINATION_DEFAULT,
  PAGINATION_ELLIPSIS,
  PAGINATION_STATE_CLASS
} from '~/components/Pagination/Pagination.constant'
import type {PaginationProps} from '~/components/Pagination/Pagination.type'
import styles from '~/components/Pagination/Pagination.module.scss'
const cap = (s: string) => s.replace(/(?:^|-)([a-z])/g, (m: string) => m.slice(-1).toUpperCase())

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<PaginationProps>(), {
  pageSize: PAGINATION_DEFAULT.PAGE_SIZE,
  siblingCount: PAGINATION_DEFAULT.SIBLING_COUNT,
  showTotal: false,
  size: PAGINATION_DEFAULT.SIZE,
  disabled: false
})

const emit = defineEmits<{'update:modelValue': [number]; change: [number]}>()

const totalPages = computed(() =>
  Math.max(1, props.totalPages ?? (props.total != null ? Math.ceil(props.total / props.pageSize) : 1))
)
const current = computed(() => Math.min(Math.max(1, props.modelValue), totalPages.value))

function getPageList(cur: number, tp: number, sib: number): (number | string)[] {
  const totalNumbers = sib * 2 + 5
  if (tp <= totalNumbers) return Array.from({length: tp}, (_, i) => i + 1)
  const left = Math.max(cur - sib, 1)
  const right = Math.min(cur + sib, tp)
  const showLeftDots = left > 2
  const showRightDots = right < tp - 1
  const list: (number | string)[] = [1]
  if (showLeftDots) list.push(PAGINATION_ELLIPSIS)
  for (let p = showLeftDots ? left : 2; p <= (showRightDots ? right : tp - 1); p++) list.push(p)
  if (showRightDots) list.push(PAGINATION_ELLIPSIS)
  list.push(tp)
  return list
}

const pages = computed(() => getPageList(current.value, totalPages.value, props.siblingCount))
const ELLIPSIS = PAGINATION_ELLIPSIS

const totalNode = computed<string | null>(() => {
  if (props.showTotal === false) return null
  const t = props.total ?? totalPages.value
  if (typeof props.showTotal === 'function') return props.showTotal(t)
  return `총 ${t}개`
})

function go(p: number) {
  if (props.disabled || p === current.value || p < 1 || p > totalPages.value) return
  emit('update:modelValue', p)
  emit('change', p)
}

const rootClass = computed(() =>
  cx(
    styles.bsPagination,
    styles[`bsPaginationSize${cap(props.size)}`],
    props.disabled && styles[PAGINATION_STATE_CLASS.IS_DISABLED],
    resolveClassNames(props.classNames)
  )
)
</script>

<template>
  <nav v-bind="$attrs" aria-label="pagination" :class="rootClass">
    <span v-if="totalNode != null || $slots.total" :class="styles.bsPaginationTotal"
      ><slot name="total">{{ totalNode }}</slot></span
    >

    <ul :class="styles.bsPaginationList">
      <li>
        <button
          type="button"
          :class="styles.bsPaginationArrow"
          aria-label="이전 페이지"
          :disabled="props.disabled || current === 1"
          @click="go(current - 1)"
        >
          <Icon name="chevron-left" size="1em" />
        </button>
      </li>

      <template v-for="(p, i) in pages" :key="p === ELLIPSIS ? `e-${i}` : p">
        <li v-if="p === ELLIPSIS" :class="styles.bsPaginationEllipsis" aria-hidden="true">{{ ELLIPSIS }}</li>
        <li v-else>
          <button
            type="button"
            :class="cx(styles.bsPaginationPage, p === current && styles[PAGINATION_STATE_CLASS.IS_ACTIVE])"
            :aria-current="p === current ? 'page' : undefined"
            :disabled="props.disabled"
            @click="go(Number(p))"
          >
            {{ p }}
          </button>
        </li>
      </template>

      <li>
        <button
          type="button"
          :class="styles.bsPaginationArrow"
          aria-label="다음 페이지"
          :disabled="props.disabled || current === totalPages"
          @click="go(current + 1)"
        >
          <Icon name="chevron-right" size="1em" />
        </button>
      </li>
    </ul>
  </nav>
</template>
