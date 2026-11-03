import {defineComponent, h} from 'vue'

import '~/assets/styles/tokens.css'

import Base from '~/components/Input/index.vue'
import {INPUT_TYPE} from '~/components/Input/Input.constant'
import type {InputType} from '~/components/Input/Input.type'

const makeVariant = (fixedType: InputType, name: string) =>
  defineComponent({
    name: `Input${name}`,
    inheritAttrs: false,
    setup(_, {attrs, slots}) {
      return () => h(Base, {...attrs, type: fixedType}, slots)
    }
  })

const Input = Object.assign(Base, {
  Text: makeVariant(INPUT_TYPE.TEXT, 'Text'),
  Password: makeVariant(INPUT_TYPE.PASSWORD, 'Password'),
  Number: makeVariant(INPUT_TYPE.NUMBER, 'Number'),
  Email: makeVariant(INPUT_TYPE.EMAIL, 'Email'),
  Tel: makeVariant(INPUT_TYPE.TEL, 'Tel'),
  Search: makeVariant(INPUT_TYPE.SEARCH, 'Search')
})

export {Input}
export default Input
export {INPUT_TYPE, INPUT_SIZE, INPUT_STATE_CLASS, INPUT_DEFAULT} from '~/components/Input/Input.constant'
export type {InputProps, InputVariantProps, InputType, InputSize} from '~/components/Input/Input.type'
