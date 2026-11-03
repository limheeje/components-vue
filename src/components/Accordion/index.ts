import '~/assets/styles/tokens.css'

import Root from '~/components/Accordion/index.vue'
import Item from '~/components/Accordion/AccordionItem.vue'

const Accordion = Object.assign(Root, {Item})

export {Accordion}
export default Accordion
export {ACCORDION_TYPE, ACCORDION_STATE_CLASS, ACCORDION_DEFAULT} from '~/components/Accordion/Accordion.constant'
export type {AccordionProps, AccordionItemProps, AccordionType} from '~/components/Accordion/Accordion.type'
