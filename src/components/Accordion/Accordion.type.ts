import type {InjectionKey} from 'vue'

import type {ACCORDION_TYPE} from '~/components/Accordion/Accordion.constant'

export type AccordionType = (typeof ACCORDION_TYPE)[keyof typeof ACCORDION_TYPE]

export interface AccordionProps {
  /** 열림 모드. 기본값 single */
  type?: AccordionType
  /** 열림값. `v-model` 로만 제어 (single: string, multiple: string[]) */
  modelValue?: string | string[]
  /** 추가 클래스 (string | string[]) — 루트에 적용 */
  classNames?: string | string[]
}

export interface AccordionItemProps {
  /** 항목 식별자 */
  value: string
  /** 헤더 제목 (slot `title` 도 가능) */
  title?: string
  /** 비활성 */
  disabled?: boolean
  /** 추가 클래스 (string | string[]) — 항목 래퍼에 적용 */
  classNames?: string | string[]
}

export interface AccordionContextValue {
  isOpen: (value: string) => boolean
  toggle: (value: string) => void
}

export const ACCORDION_CTX_KEY = Symbol('accordion') as InjectionKey<AccordionContextValue>
