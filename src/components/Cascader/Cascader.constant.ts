/** size 값 → CSS Module 클래스 키(`size-*`) */
export const CASCADER_SIZE = Object.freeze({
  SM: 'sm',
  MD: 'md',
  LG: 'lg'
} as const)

/** 하위 메뉴를 펼치는 방식 */
export const CASCADER_EXPAND_TRIGGER = Object.freeze({
  CLICK: 'click',
  HOVER: 'hover'
} as const)

/** 상태 modifier 클래스명 (CSS Module 키) */
export const CASCADER_STATE_CLASS = Object.freeze({
  IS_OPEN: 'is-open',
  IS_ERROR: 'is-error',
  IS_DISABLED: 'is-disabled',
  IS_PLACEHOLDER: 'is-placeholder'
} as const)

/** `config` 기본값 */
export const CASCADER_CONFIG_DEFAULT = Object.freeze({
  EXPAND_TRIGGER: CASCADER_EXPAND_TRIGGER.CLICK,
  MULTIPLE: false,
  CHECK_STRICTLY: false,
  EMIT_PATH: true,
  LAZY: false,
  VALUE: 'value',
  LABEL: 'label',
  CHILDREN: 'children',
  DISABLED: 'disabled',
  LEAF: 'leaf'
} as const)

export const CASCADER_DEFAULT = Object.freeze({
  SIZE: CASCADER_SIZE.MD,
  PLACEHOLDER: '선택해주세요',
  SEPARATOR: ' / ',
  DEBOUNCE: 300,
  SEARCH_PLACEHOLDER: '검색...',
  EMPTY_TEXT: '데이터 없음',
  NO_MATCH_TEXT: '일치하는 데이터가 없습니다',
  LOADING_TEXT: '로딩 중...'
} as const)
