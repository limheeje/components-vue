import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'

import Radio from '~/components/Radio/index.vue'

describe('Radio', () => {
  it('label 로 렌더된다', () => {
    const wrapper = mount(Radio, {attrs: {name: 'g', value: 'a'}, props: {label: '옵션 A'}})
    expect(wrapper.text()).toContain('옵션 A')
    expect(wrapper.find('input[type="radio"]').exists()).toBe(true)
  })

  it('클릭하면 선택된다', async () => {
    const wrapper = mount(Radio, {attrs: {name: 'g', value: 'a'}, props: {label: 'A'}, attachTo: document.body})
    const input = wrapper.find('input')
    await input.trigger('click')
    expect((input.element as HTMLInputElement).checked).toBe(true)
    wrapper.unmount()
  })

  it('클릭 시 update:checked 가 emit 되어 v-model:checked 가 동작한다', async () => {
    const wrapper = mount(Radio, {attrs: {name: 'g', value: 'a'}, props: {label: 'A'}})
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('update:checked')).toEqual([[true]])
  })

  it('v-model — modelValue 가 value 와 일치하면 선택되고, 클릭 시 update:modelValue 로 자기 value 를 emit 한다', async () => {
    const a = mount(Radio, {
      attrs: {name: 'g'},
      props: {value: 'a', modelValue: 'a', label: 'A'},
      attachTo: document.body
    })
    expect((a.find('input').element as HTMLInputElement).checked).toBe(true)
    a.unmount()

    const b = mount(Radio, {
      attrs: {name: 'g'},
      props: {value: 'b', modelValue: 'a', label: 'B'},
      attachTo: document.body
    })
    expect((b.find('input').element as HTMLInputElement).checked).toBe(false)
    await b.find('input').setValue(true)
    expect(b.emitted('update:modelValue')).toEqual([['b']])
    b.unmount()
  })

  it('disabled 면 input 이 비활성이다', () => {
    const wrapper = mount(Radio, {attrs: {name: 'g', value: 'a'}, props: {label: 'A', disabled: true}})
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })
})
