import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'

import Button from '~/components/Button/index.vue'
import ButtonGroup from '~/components/ButtonGroup/index.vue'
import {h} from 'vue'

describe('ButtonGroup', () => {
  it('role="group" 으로 렌더된다', () => {
    const wrapper = mount(ButtonGroup, {slots: {default: () => h(Button, () => 'A')}})
    expect(wrapper.find('[role="group"]').exists()).toBe(true)
  })

  it('disabled 를 하위 버튼 전체에 전파한다', () => {
    const wrapper = mount(ButtonGroup, {
      props: {disabled: true},
      slots: {default: () => [h(Button, () => 'A'), h(Button, () => 'B')]}
    })
    for (const btn of wrapper.findAll('button')) expect(btn.attributes('disabled')).toBeDefined()
  })

  it('개별 버튼의 disabled 는 유지된다', () => {
    const wrapper = mount(ButtonGroup, {
      slots: {default: () => [h(Button, () => 'A'), h(Button, {disabled: true}, () => 'B')]}
    })
    const [a, b] = wrapper.findAll('button')
    expect(a.attributes('disabled')).toBeUndefined()
    expect(b.attributes('disabled')).toBeDefined()
  })

  it('size 를 하위 버튼에 주입한다', () => {
    const wrapper = mount(ButtonGroup, {props: {size: 'lg'}, slots: {default: () => h(Button, () => 'A')}})
    expect(wrapper.find('button').classes().join(' ')).toMatch(/bsButtonSizeLg/)
  })
})
