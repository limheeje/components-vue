import '~/assets/styles/tokens.css'

import Steps from '~/components/Steps/index.vue'

export {Steps}
export default Steps
export {
  STEPS_DIRECTION,
  STEPS_STATUS,
  STEPS_NODE_STATE,
  STEPS_STATE_CLASS,
  STEPS_DEFAULT
} from '~/components/Steps/Steps.constant'
export type {StepsProps, StepItem, StepsDirection, StepsStatus} from '~/components/Steps/Steps.type'
