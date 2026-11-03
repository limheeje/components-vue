import type {InjectionKey} from 'vue'

import {FORM_DEFAULT} from '~/components/Form/Form.constant'
import type {FormContextValue} from '~/components/Form/Form.type'

export const FORM_CONTEXT_KEY = Symbol('form') as InjectionKey<FormContextValue>

export const FORM_CONTEXT_DEFAULT: FormContextValue = {
  layout: FORM_DEFAULT.LAYOUT,
  labelWidth: FORM_DEFAULT.LABEL_WIDTH,
  disabled: false
}
