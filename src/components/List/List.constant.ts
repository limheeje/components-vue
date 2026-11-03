import type {InjectionKey, Ref} from 'vue'

/** 상태 modifier 클래스명 (CSS Module 키) */
export const LIST_STATE_CLASS = Object.freeze({
  IS_DIVIDED: 'is-divided'
} as const)

export const LIST_DEFAULT = Object.freeze({
  DIVIDED: true,
  SKELETON_COUNT: 3
} as const)

/** List → 자식 ListItem 로 clickable 전파 (Vue provide/inject) */
export const LIST_CLICKABLE_KEY = Symbol('list-clickable') as InjectionKey<Ref<boolean>>
