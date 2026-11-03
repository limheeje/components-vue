import type {InjectionKey} from 'vue'

import type {ButtonGroupSize} from '~/components/ButtonGroup/ButtonGroup.type'

/** ButtonGroup 이 하위 Button 에 주입하는 컨텍스트 (Vue 포트 전용 — React 는 cloneElement 로 주입) */
export interface ButtonGroupContext {
  size?: ButtonGroupSize
  disabled?: boolean
}

export const BUTTON_GROUP_CONTEXT_KEY = Symbol('button-group') as InjectionKey<ButtonGroupContext>
