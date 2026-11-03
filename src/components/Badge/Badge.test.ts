import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'

import Badge from '~/components/Badge/index.vue'

describe('Badge', () => {
  it('기본 slot 을 렌더한다', () => {
    const wrapper = mount(Badge, {slots: {default: 'NEW'}})
    expect(wrapper.text()).toContain('NEW')
  })

  it('type / size 클래스가 적용된다', () => {
    const wrapper = mount(Badge, {props: {type: 'danger', size: 'lg'}, slots: {default: '3'}})
    const cls = wrapper.element.className
    expect(cls).toMatch(/bsBadgeTypeDanger/)
    expect(cls).toMatch(/bsBadgeSizeLg/)
  })

  it('dot 모드는 점 + 평문을 렌더한다', () => {
    const wrapper = mount(Badge, {props: {dot: true}, slots: {default: '대기'}})
    expect(wrapper.text()).toContain('대기')
    expect(wrapper.find('[aria-hidden="true"]').exists()).toBe(true)
  })
})
