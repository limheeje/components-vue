import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'

import Divider from '~/components/Divider/index.vue'

describe('Divider', () => {
  it('label 이 있으면 separator role 로 렌더된다', () => {
    const wrapper = mount(Divider, {props: {label: '또는'}})
    expect(wrapper.find('[role="separator"]').exists()).toBe(true)
  })

  it('label 을 렌더한다', () => {
    const wrapper = mount(Divider, {props: {label: '또는'}})
    expect(wrapper.text()).toContain('또는')
  })

  it('label 이 없으면(기본 decorative) separator role 이 없다', () => {
    const wrapper = mount(Divider)
    expect(wrapper.find('[role="separator"]').exists()).toBe(false)
  })

  it('direction 클래스가 적용된다', () => {
    const wrapper = mount(Divider, {props: {direction: 'vertical'}})
    expect(wrapper.element.className).toMatch(/vertical/)
  })
})
