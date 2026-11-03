<script setup lang="ts">
import {computed, ref, watch} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import Dialog from '~/components/Dialog/index.vue'
import {DIALOG_DIRECTION, DIALOG_SIZE, DIALOG_VARIANT} from '~/components/Dialog/Dialog.constant'
import Icon from '~/components/Icon'
import {DEFAULT_REGIONS, REGION_PICKER_DEFAULT} from '~/components/RegionPicker/RegionPicker.constant'
import type {RegionPickerProps, RegionValue} from '~/components/RegionPicker/RegionPicker.type'
import styles from '~/components/RegionPicker/RegionPicker.module.scss'

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<RegionPickerProps>(), {
  modelValue: null,
  multiple: true,
  title: REGION_PICKER_DEFAULT.TITLE,
  hint: REGION_PICKER_DEFAULT.HINT,
  regions: () => DEFAULT_REGIONS,
  resetText: REGION_PICKER_DEFAULT.RESET_TEXT,
  closeOnBackdrop: true
})

const emit = defineEmits<{
  close: []
  'update:modelValue': [value: RegionValue | RegionValue[]]
  confirm: [value: RegionValue | RegionValue[]]
}>()

const selectedProvince = ref<string | null>(null)
const selections = ref<RegionValue[]>([])
/** 헤더 설명에 표시할 "마지막으로 만진 항목" (province > city) */
const lastTouched = ref<RegionValue | null>(null)

// open 될 때마다 modelValue 로 로컬 선택 상태를 초기화 (닫힌 동안의 조작은 버려짐)
watch(
  () => props.open,
  (open) => {
    if (!open) return
    const initial = props.multiple
      ? Array.isArray(props.modelValue)
        ? props.modelValue
        : []
      : !Array.isArray(props.modelValue) && props.modelValue
        ? [props.modelValue]
        : []
    selections.value = [...initial]
    lastTouched.value = initial[initial.length - 1] ?? null
    selectedProvince.value = initial[initial.length - 1]?.province ?? initial[0]?.province ?? null
  },
  {immediate: true}
)

const activeCities = computed(() => props.regions.find((g) => g.province === selectedProvince.value)?.cities ?? [])
const canConfirm = computed(() => selections.value.length > 0)

const confirmLabel = computed(
  () => props.confirmText ?? (props.multiple ? REGION_PICKER_DEFAULT.APPLY_TEXT : REGION_PICKER_DEFAULT.CONFIRM_TEXT)
)

const summaryText = computed(() =>
  lastTouched.value ? `${lastTouched.value.province} > ${lastTouched.value.city}` : props.hint
)

function isCitySelected(city: string) {
  return selections.value.some((v) => v.province === selectedProvince.value && v.city === city)
}
function provinceSelectionCount(province: string) {
  return selections.value.filter((v) => v.province === province).length
}

function selectProvince(province: string) {
  selectedProvince.value = province
}

function toggleCity(city: string) {
  const province = selectedProvince.value
  if (!province) return
  lastTouched.value = {province, city}
  if (!props.multiple) {
    selections.value = [{province, city}]
    return
  }
  const idx = selections.value.findIndex((v) => v.province === province && v.city === city)
  if (idx >= 0) selections.value.splice(idx, 1)
  else selections.value.push({province, city})
}

function removeSelection(target: RegionValue) {
  selections.value = selections.value.filter((v) => !(v.province === target.province && v.city === target.city))
}

function resetSelections() {
  selections.value = []
  lastTouched.value = null
}

function handleConfirm() {
  if (!canConfirm.value) return
  const value = props.multiple ? [...selections.value] : selections.value[0]!
  emit('update:modelValue', value)
  emit('confirm', value)
  emit('close')
}

const rootClass = computed(() => cx(styles.bsRegionPickerPanel, resolveClassNames(props.classNames)))
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
    :aria-label="title"
    @close="emit('close')"
  >
    <template #title>
      <span :class="styles.bsRegionPickerTitleRow">
        <button type="button" :class="styles.bsRegionPickerBack" aria-label="뒤로가기" @click="emit('close')">
          <Icon name="arrow-left" :size="20" />
        </button>
        <span>{{ title }}</span>
      </span>
    </template>
    <template #description>{{ summaryText }}</template>

    <div :class="styles.bsRegionPickerColumns">
      <div :class="styles.bsRegionPickerColumn">
        <div :class="styles.bsRegionPickerColumnHead">행정구역</div>
        <ul :class="styles.bsRegionPickerList" role="listbox">
          <li v-for="group in regions" :key="group.province">
            <button
              type="button"
              role="option"
              :aria-selected="group.province === selectedProvince"
              :class="cx(styles.bsRegionPickerItem, group.province === selectedProvince && styles['is-selected'])"
              @click="selectProvince(group.province)"
            >
              <span>{{ group.province }}</span>
              <span v-if="multiple && provinceSelectionCount(group.province) > 0" :class="styles.bsRegionPickerCount">
                {{ provinceSelectionCount(group.province) }}
              </span>
            </button>
          </li>
        </ul>
      </div>

      <div :class="styles.bsRegionPickerColumn">
        <div :class="styles.bsRegionPickerColumnHead">시군구</div>
        <ul v-if="activeCities.length > 0" :class="styles.bsRegionPickerList" role="listbox">
          <li v-for="city in activeCities" :key="city">
            <button
              type="button"
              role="option"
              :aria-selected="isCitySelected(city)"
              :class="cx(styles.bsRegionPickerItem, isCitySelected(city) && styles['is-selected'])"
              @click="toggleCity(city)"
            >
              <span
                v-if="multiple"
                :class="cx(styles.bsRegionPickerCheckbox, isCitySelected(city) && styles['is-selected'])"
              >
                <Icon v-if="isCitySelected(city)" name="check" :size="12" color="#fff" />
              </span>
              <span>{{ city }}</span>
            </button>
          </li>
        </ul>
        <div v-else :class="styles.bsRegionPickerEmpty">
          <span>{{ hint }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <div v-if="multiple" :class="styles.bsRegionPickerMultiFooter">
        <div v-if="selections.length > 0" :class="styles.bsRegionPickerChips">
          <span v-for="sel in selections" :key="`${sel.province}-${sel.city}`" :class="styles.bsRegionPickerChip">
            {{ sel.province }} &gt; {{ sel.city }}
            <button
              type="button"
              :class="styles.bsRegionPickerChipRemove"
              aria-label="선택 해제"
              @click="removeSelection(sel)"
            >
              <Icon name="close" :size="12" />
            </button>
          </span>
        </div>
        <div :class="styles.bsRegionPickerActions">
          <button type="button" :class="styles.bsRegionPickerReset" @click="resetSelections">
            <Icon name="refresh" :size="14" />
            {{ resetText }}
          </button>
          <button type="button" :class="styles.bsRegionPickerConfirm" :disabled="!canConfirm" @click="handleConfirm">
            {{ confirmLabel }}
          </button>
        </div>
      </div>
      <button
        v-else
        type="button"
        :class="styles.bsRegionPickerConfirmFull"
        :disabled="!canConfirm"
        @click="handleConfirm"
      >
        {{ confirmLabel }}
      </button>
    </template>
  </Dialog>
</template>
