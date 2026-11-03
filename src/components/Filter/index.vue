<script setup lang="ts">
import {computed, ref, watch} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import CheckboxGroup from '~/components/CheckboxGroup'
import Dialog from '~/components/Dialog/index.vue'
import {DIALOG_DIRECTION, DIALOG_SIZE, DIALOG_VARIANT} from '~/components/Dialog/Dialog.constant'
import {FILTER_DEFAULT} from '~/components/Filter/Filter.constant'
import type {FilterProps, FilterRangeValue, FilterSection, FilterValue} from '~/components/Filter/Filter.type'
import styles from '~/components/Filter/Filter.module.scss'
import Icon from '~/components/Icon'
import Pagination from '~/components/Pagination'
import RadioGroup from '~/components/RadioGroup'

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<FilterProps>(), {
  modelValue: () => ({}),
  title: FILTER_DEFAULT.TITLE,
  resetText: FILTER_DEFAULT.RESET_TEXT,
  confirmText: FILTER_DEFAULT.CONFIRM_TEXT,
  closeOnBackdrop: true
})

const emit = defineEmits<{
  close: []
  'update:modelValue': [value: FilterValue]
  confirm: [value: FilterValue]
}>()

const local = ref<FilterValue>({})
const brandSearch = ref('')
const brandLetter = ref<string>(FILTER_DEFAULT.ALPHABET_ALL)
const brandPage = ref(1)

// open 될 때마다 modelValue 로 로컬 선택 상태를 초기화 (닫힌 동안의 조작은 버려짐)
watch(
  () => props.open,
  (open) => {
    if (!open) return
    local.value = {...props.modelValue}
    brandSearch.value = ''
    brandLetter.value = FILTER_DEFAULT.ALPHABET_ALL
    brandPage.value = 1
  },
  {immediate: true}
)

function checkboxValue(key: string): string[] {
  const v = local.value[key]
  return Array.isArray(v) ? v : []
}
function setCheckboxValue(key: string, value: string[]) {
  local.value = {...local.value, [key]: value}
}
function radioValue(key: string): string | undefined {
  const v = local.value[key]
  return typeof v === 'string' ? v : undefined
}
function setRadioValue(key: string, value: string) {
  local.value = {...local.value, [key]: value}
}
function rangeValue(key: string): FilterRangeValue {
  const v = local.value[key]
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as FilterRangeValue) : {}
}
function setRangeValue(key: string, patch: Partial<FilterRangeValue>) {
  local.value = {...local.value, [key]: {...rangeValue(key), ...patch}}
}

function sectionActiveCount(section: FilterSection): number {
  const v = local.value[section.key]
  if (section.type === 'range') {
    const r = v as FilterRangeValue | undefined
    return r?.min || r?.max ? 1 : 0
  }
  if (Array.isArray(v)) return v.length
  return v ? 1 : 0
}

const totalActiveCount = computed(() => props.sections.reduce((sum, section) => sum + sectionActiveCount(section), 0))

// ── 브랜드 섹션: 검색어 + 초성/알파벳 탐색 + 페이지네이션 ──────
const brandSection = computed(() => props.sections.find((section) => section.type === 'brand'))

const brandLetters = computed(() => {
  const options = brandSection.value?.options ?? []
  const letters = new Set(options.map((option) => option.label.charAt(0).toUpperCase()))
  return [FILTER_DEFAULT.ALPHABET_ALL, ...Array.from(letters).sort()]
})

const filteredBrandOptions = computed(() => {
  const options = brandSection.value?.options ?? []
  const keyword = brandSearch.value.trim().toLowerCase()
  return options.filter((option) => {
    const matchesKeyword = !keyword || option.label.toLowerCase().includes(keyword)
    const matchesLetter =
      brandLetter.value === FILTER_DEFAULT.ALPHABET_ALL || option.label.charAt(0).toUpperCase() === brandLetter.value
    return matchesKeyword && matchesLetter
  })
})

const pagedBrandOptions = computed(() => {
  const size = FILTER_DEFAULT.BRAND_PAGE_SIZE
  const start = (brandPage.value - 1) * size
  return filteredBrandOptions.value.slice(start, start + size)
})

watch(filteredBrandOptions, () => {
  brandPage.value = 1
})

function selectBrandLetter(letter: string) {
  brandLetter.value = letter
}

function resetAll() {
  local.value = {}
  brandSearch.value = ''
  brandLetter.value = FILTER_DEFAULT.ALPHABET_ALL
  brandPage.value = 1
}

function handleConfirm() {
  emit('update:modelValue', local.value)
  emit('confirm', local.value)
  emit('close')
}

const rootClass = computed(() => cx(styles.bsFilterPanel, resolveClassNames(props.classNames)))
</script>

<template>
  <Dialog
    v-bind="$attrs"
    :open="open"
    :variant="DIALOG_VARIANT['DRAWER']"
    :direction="DIALOG_DIRECTION['BOTTOM']"
    :size="DIALOG_SIZE['FULL']"
    :close-on-backdrop="closeOnBackdrop"
    :class-names="rootClass"
    :title="title"
    :aria-label="title"
    @close="emit('close')"
  >
    <div :class="styles.bsFilterBody">
      <section v-for="section in sections" :key="section.key" :class="styles.bsFilterSection">
        <h3 :class="styles.bsFilterSectionTitle">{{ section.title }}</h3>

        <template v-if="section.type === 'brand'">
          <div :class="styles.bsFilterBrandSearch">
            <Icon name="search" :size="16" />
            <input
              v-model="brandSearch"
              type="text"
              :placeholder="FILTER_DEFAULT.BRAND_SEARCH_PLACEHOLDER"
              :class="styles.bsFilterBrandSearchInput"
            />
          </div>
          <div :class="styles.bsFilterAlphabet" role="tablist">
            <button
              v-for="letter in brandLetters"
              :key="letter"
              type="button"
              role="tab"
              :aria-selected="letter === brandLetter"
              :class="cx(styles.bsFilterAlphabetItem, letter === brandLetter && styles['is-active'])"
              @click="selectBrandLetter(letter)"
            >
              {{ letter }}
            </button>
          </div>
          <CheckboxGroup
            v-if="pagedBrandOptions.length > 0"
            :options="pagedBrandOptions"
            :model-value="checkboxValue(section.key)"
            @update:model-value="setCheckboxValue(section.key, $event)"
          />
          <p v-else :class="styles.bsFilterEmpty">{{ FILTER_DEFAULT.BRAND_EMPTY_TEXT }}</p>
          <Pagination
            v-if="filteredBrandOptions.length > FILTER_DEFAULT.BRAND_PAGE_SIZE"
            v-model="brandPage"
            :total="filteredBrandOptions.length"
            :page-size="FILTER_DEFAULT.BRAND_PAGE_SIZE"
            size="sm"
            :class-names="styles.bsFilterBrandPagination"
          />
        </template>

        <CheckboxGroup
          v-else-if="section.type === 'checkbox'"
          :options="section.options ?? []"
          :model-value="checkboxValue(section.key)"
          @update:model-value="setCheckboxValue(section.key, $event)"
        />

        <RadioGroup
          v-else-if="section.type === 'radio'"
          :options="section.options ?? []"
          :model-value="radioValue(section.key)"
          :name="section.key"
          @update:model-value="setRadioValue(section.key, $event)"
        />

        <div v-else-if="section.type === 'range'" :class="styles.bsFilterRange">
          <input
            type="text"
            inputmode="numeric"
            :placeholder="section.minPlaceholder"
            :value="rangeValue(section.key).min ?? ''"
            :class="styles.bsFilterRangeInput"
            @input="setRangeValue(section.key, {min: ($event.target as HTMLInputElement).value})"
          />
          <span :class="styles.bsFilterRangeSeparator">~</span>
          <input
            type="text"
            inputmode="numeric"
            :placeholder="section.maxPlaceholder"
            :value="rangeValue(section.key).max ?? ''"
            :class="styles.bsFilterRangeInput"
            @input="setRangeValue(section.key, {max: ($event.target as HTMLInputElement).value})"
          />
        </div>
      </section>
    </div>

    <template #footer>
      <div :class="styles.bsFilterActions">
        <button type="button" :class="styles.bsFilterReset" @click="resetAll">
          <Icon name="refresh" :size="14" />
          {{ resetText }}
        </button>
        <button type="button" :class="styles.bsFilterConfirm" @click="handleConfirm">
          {{ confirmText }}<span v-if="totalActiveCount > 0">&nbsp;({{ totalActiveCount }})</span>
        </button>
      </div>
    </template>
  </Dialog>
</template>
