import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'

import Switch from '~/components/Switch/index.vue'

describe('Switch', () => {
  it('switch role 로 렌더된다', () => {
    const wrapper = mount(Switch, {props: {label: '알림'}})
    expect(wrapper.find('[role="switch"], input[type="checkbox"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('알림')
  })

  it('토글 시 update:checked 가 emit 된다', async () => {
    const wrapper = mount(Switch, {props: {label: 's'}})
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('update:checked')).toBeTruthy()
  })

  it('v-model — modelValue 를 반영하고 토글 시 update:modelValue 를 emit 한다', async () => {
    const wrapper = mount(Switch, {props: {modelValue: false, label: 's'}})
    expect((wrapper.find('input').element as HTMLInputElement).checked).toBe(false)
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
  })

  it('disabled 면 input 이 비활성이다', () => {
    const wrapper = mount(Switch, {props: {label: 's', disabled: true}})
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })
})
