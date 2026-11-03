import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'

import Tabs from '~/components/Tabs/index.vue'

const ITEMS = [
  {key: 'a', label: '탭 A', content: '내용 A'},
  {key: 'b', label: '탭 B', content: '내용 B'},
  {key: 'c', label: '탭 C', content: '내용 C', disabled: true}
]

describe('Tabs', () => {
  it('tab role 목록과 첫 탭 내용을 렌더한다', () => {
    const wrapper = mount(Tabs, {props: {items: ITEMS}})
    expect(wrapper.findAll('[role="tab"]')).toHaveLength(3)
    expect(wrapper.text()).toContain('내용 A')
  })

  it('다른 탭 클릭 시 전환되고 change 가 emit 된다', async () => {
    const wrapper = mount(Tabs, {props: {items: ITEMS}})
    await wrapper.findAll('[role="tab"]')[1].trigger('click')
    expect(wrapper.text()).toContain('내용 B')
    expect(wrapper.emitted('change')).toEqual([['b']])
    expect(wrapper.emitted('update:modelValue')).toEqual([['b']])
  })

  it('v-model — modelValue 로 활성 탭이 제어된다', async () => {
    const wrapper = mount(Tabs, {props: {items: ITEMS, modelValue: 'b'}})
    expect(wrapper.text()).toContain('내용 B')
    await wrapper.setProps({modelValue: 'a'})
    expect(wrapper.text()).toContain('내용 A')
  })

  it('disabled 탭은 전환되지 않는다', async () => {
    const wrapper = mount(Tabs, {props: {items: ITEMS}})
    await wrapper.findAll('[role="tab"]')[2].trigger('click')
    expect(wrapper.text()).toContain('내용 A')
  })

  it('defaultKey 로 초기 탭을 지정한다', () => {
    const wrapper = mount(Tabs, {props: {items: ITEMS, defaultKey: 'b'}})
    expect(wrapper.text()).toContain('내용 B')
  })
})
