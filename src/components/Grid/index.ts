import '~/assets/styles/tokens.css'

import Root from '~/components/Grid/index.vue'
import Item from '~/components/Grid/GridItem.vue'

const Grid = Object.assign(Root, {Item})

export {Grid}
export default Grid
export {GRID_ALIGN, GRID_DEFAULT} from '~/components/Grid/Grid.constant'
export type {GridProps, GridItemProps, GridAlign} from '~/components/Grid/Grid.type'
