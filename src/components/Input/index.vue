<script setup lang="ts">
import {computed, getCurrentInstance, ref, useAttrs, useId, useSlots} from 'vue'

import {cx, resolveClassNames} from '~/lib/cx'

import {INPUT_DEFAULT, INPUT_STATE_CLASS, INPUT_TYPE} from '~/components/Input/Input.constant'
import type {InputProps} from '~/components/Input/Input.type'
import styles from '~/components/Input/Input.module.scss'
const cap = (s: string) => s.replace(/(?:^|-)([a-z])/g, (m: string) => m.slice(-1).toUpperCase())

defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<InputProps>(), {
  type: INPUT_DEFAULT.TYPE,
  size: INPUT_DEFAULT.SIZE,
  error: false,
  clearable: INPUT_DEFAULT.CLEARABLE,
  showCount: false,
  showToggle: false
})

const emit = defineEmits<{
  'update:modelValue': [string]
  change: [Event]
  input: [Event]
  clear: []
  search: [string]
  toggle: [boolean]
}>()

const attrs = useAttrs()
const slots = useSlots()
const passAttrs = computed(() => {
  const {onChange: _oc, onInput: _oi, class: _c, style: _s, ...rest} = attrs as Record<string, unknown>
  return rest
})

const innerRef = ref<HTMLInputElement>()
const reactId = useId()
const inputId = computed(() => props.id ?? reactId)

const uncontrolled = ref(props.defaultValue != null ? String(props.defaultValue) : '')
const isControlled = computed(() => props.modelValue !== undefined)
const currentValue = computed(() => (isControlled.value ? String(props.modelValue ?? '') : uncontrolled.value))

const focused = ref(false)
const visible = ref(false)

const errorMessage = computed(() => (typeof props.error === 'string' ? props.error : ''))
const hasError = computed(() => props.error === true || errorMessage.value.length > 0)

const isSearch = computed(() => props.type === INPUT_TYPE.SEARCH)
const isPassword = computed(() => props.type === INPUT_TYPE.PASSWORD)
const resolvedType = computed(() => (isSearch.value ? 'text' : isPassword.value && visible.value ? 'text' : props.type))

const hasPrefix = computed(() => props.prefix != null || Boolean(slots.prefix))
const hasSuffix = computed(() => props.suffix != null || Boolean(slots.suffix))
const hasHelper = computed(() => props.helperText != null || Boolean(slots.helperText))
const describedById = computed(() =>
  hasError.value ? `${inputId.value}-error` : hasHelper.value ? `${inputId.value}-helper` : undefined
)

// `search` 를 emit 으로 선언하면 onSearch 가 $attrs 에서 빠지므로 vnode.props 로 존재 판별
const vm = getCurrentInstance()
const hasSearchListener = computed(() => {
  const p = vm?.vnode.props
  return p != null && 'onSearch' in p
})
const searchAsButton = computed(() => isSearch.value && hasSearchListener.value)
const showClear = computed(() => props.clearable && currentValue.value.length > 0 && !props.disabled && !props.readonly)
const showMeta = computed(() => hasError.value || hasHelper.value || (props.showCount && props.maxLength != null))

function onInput(e: Event) {
  const next = (e.target as HTMLInputElement).value
  if (!isControlled.value) uncontrolled.value = next
  emit('update:modelValue', next)
  // React onChange = 키 입력마다 → 원본 이벤트를 change/input 둘 다로 재발행
  emit('input', e)
  emit('change', e)
}
function onKeydown(e: KeyboardEvent) {
  if (isSearch.value && hasSearchListener.value && e.key === 'Enter') {
    emit('search', (e.target as HTMLInputElement).value)
  }
}
function handleClear() {
  if (!isControlled.value) uncontrolled.value = ''
  const el = innerRef.value
  if (el) {
    el.value = ''
    el.dispatchEvent(new Event('input', {bubbles: true}))
    el.focus()
  }
  emit('clear')
}
function handleToggle() {
  visible.value = !visible.value
  emit('toggle', visible.value)
}

defineExpose({el: innerRef, focus: () => innerRef.value?.focus()})

const fieldClass = computed(() =>
  cx(
    styles.bsInputField,
    focused.value && styles[INPUT_STATE_CLASS.IS_FOCUSED],
    hasError.value && styles[INPUT_STATE_CLASS.IS_ERROR],
    props.disabled && styles[INPUT_STATE_CLASS.IS_DISABLED],
    props.readonly && styles[INPUT_STATE_CLASS.IS_READONLY]
  )
)
</script>

<template>
  <div :class="cx(styles.bsInput, styles[`bsInputSize${cap(props.size)}`], resolveClassNames(props.classNames))">
    <div :class="fieldClass">
      <span v-if="hasPrefix" :class="styles.bsInputAffix"
        ><slot name="prefix">{{ props.prefix }}</slot></span
      >

      <input
        ref="innerRef"
        v-bind="passAttrs"
        :id="inputId"
        :type="resolvedType"
        :class="styles.bsInput"
        :disabled="props.disabled"
        :readonly="props.readonly"
        :maxlength="props.maxLength"
        :placeholder="props.placeholder"
        :aria-invalid="hasError || undefined"
        :aria-describedby="describedById"
        :value="currentValue"
        @input="onInput"
        @keydown="onKeydown"
        @focus="focused = true"
        @blur="focused = false"
      />

      <span :class="styles.bsInputSuffixArea">
        <button
          v-if="showClear"
          type="button"
          tabindex="-1"
          :class="styles.bsInputIconButton"
          aria-label="입력 내용 지우기"
          @click="handleClear"
        >
          <i :class="cx(styles.bsInputIcon, styles.bsInputIconClear)" aria-hidden="true" />
        </button>

        <button
          v-if="isPassword && props.showToggle"
          type="button"
          tabindex="-1"
          :class="cx(styles.bsInputIconButton, visible && styles.bsInputIconActive)"
          :aria-label="visible ? '비밀번호 숨기기' : '비밀번호 표시'"
          :aria-pressed="visible"
          @click="handleToggle"
        >
          <i
            :class="cx(styles.bsInputIcon, visible ? styles.bsInputIconEyeOff : styles.bsInputIconEye)"
            aria-hidden="true"
          />
        </button>

        <template v-if="isSearch">
          <button
            v-if="searchAsButton"
            type="button"
            :class="styles.bsInputIconButton"
            aria-label="검색"
            @click="emit('search', currentValue)"
          >
            <i :class="cx(styles.bsInputIcon, styles.bsInputIconSearch)" aria-hidden="true" />
          </button>
          <i
            v-else
            :class="cx(styles.bsInputIcon, styles.bsInputIconSearch, styles.bsInputIconStatic)"
            aria-hidden="true"
          />
        </template>

        <span v-if="hasSuffix" :class="styles.bsInputAffix"
          ><slot name="suffix">{{ props.suffix }}</slot></span
        >
      </span>
    </div>

    <div v-if="showMeta" :class="styles.bsInputMeta">
      <span :class="styles.bsInputMessage">
        <span v-if="hasError && errorMessage" :id="`${inputId}-error`" :class="styles.bsInputError">{{
          errorMessage
        }}</span>
        <span v-else-if="hasHelper" :id="`${inputId}-helper`" :class="styles.bsInputHelper">
          <slot name="helperText">{{ props.helperText }}</slot>
        </span>
      </span>
      <span v-if="props.showCount && props.maxLength != null" :class="styles.bsInputCount">
        {{ currentValue.length }} / {{ props.maxLength }}
      </span>
    </div>
  </div>
</template>
