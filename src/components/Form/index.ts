import '~/assets/styles/tokens.css'

import FormRoot from '~/components/Form/index.vue'
import FormField from '~/components/Form/FormField.vue'
import FormActions from '~/components/Form/FormActions.vue'

const Form = Object.assign(FormRoot, {
  Field: FormField,
  Actions: FormActions
})

export {Form, FormField, FormActions}
export default Form
export {FORM_CONTEXT_KEY} from '~/components/Form/Form.context'
export {FORM_LAYOUT, FORM_ACTIONS_ALIGN, FORM_STATE_CLASS, FORM_DEFAULT} from '~/components/Form/Form.constant'
export type {
  FormProps,
  FormFieldProps,
  FormActionsProps,
  FormContextValue,
  FormLayout,
  FormActionsAlign
} from '~/components/Form/Form.type'
