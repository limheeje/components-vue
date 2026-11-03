import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'

import Tooltip from '~/components/Tooltip/index.vue'

describe('Tooltip', () => {
  it('트리거를 렌더하고 초기엔 tooltip 이 없다', () => {
    const wrapper = mount(Tooltip, {props: {content: '도움말'}, slots: {default: '<button>버튼</button>'}})
    expect(wrapper.find('button').text()).toBe('버튼')
    expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)
  })

  it('hover 시 tooltip 이 나타난다', async () => {
    const wrapper = mount(Tooltip, {
      props: {content: '도움말', delay: 0},
      slots: {default: '<button>버튼</button>'}
    })
    await wrapper.trigger('mouseenter')
    await new Promise((r) => setTimeout(r, 10))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[role="tooltip"]').text()).toContain('도움말')
  })

  it('disabled 면 hover 해도 안 나타난다', async () => {
    const wrapper = mount(Tooltip, {
      props: {content: '도움말', delay: 0, disabled: true},
      slots: {default: '<button>버튼</button>'}
    })
    await wrapper.trigger('mouseenter')
    await new Promise((r) => setTimeout(r, 10))
    expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)
  })
})
