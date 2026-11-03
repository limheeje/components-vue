import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'

import Segmented from '~/components/Segmented/index.vue'
import type {SegmentedOption} from '~/components/Segmented/Segmented.type'

const OPTIONS: SegmentedOption[] = [
  {label: '공통', value: 'common'},
  {label: 'B2C', value: 'b2c'},
  {label: 'B2B', value: 'b2b', disabled: true}
]

describe('Segmented', () => {
  it('options 를 radio 로 렌더한다 (문자열/객체 혼용)', () => {
    const wrapper = mount(Segmented, {props: {options: ['A', 'B', 'C']}})
    expect(wrapper.findAll('[role="radio"]')).toHaveLength(3)
  })

  it('defaultValue 로 초기 선택된다', () => {
    const wrapper = mount(Segmented, {props: {options: OPTIONS, defaultValue: 'b2c'}})
    const b2c = wrapper.findAll('[role="radio"]')[1]
    expect(b2c.attributes('aria-checked')).toBe('true')
  })

  it('클릭 시 change 로 value 와 option 이 emit 된다', async () => {
    const wrapper = mount(Segmented, {props: {options: OPTIONS}})
    await wrapper.findAll('[role="radio"]')[1].trigger('click')
    expect(wrapper.emitted('change')?.[0]).toEqual(['b2c', OPTIONS[1]])
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b2c'])
  })

  it('v-model — modelValue 와 일치하는 항목이 선택된다', () => {
    const wrapper = mount(Segmented, {props: {options: OPTIONS, modelValue: 'b2c'}})
    expect(wrapper.findAll('[role="radio"]')[1].attributes('aria-checked')).toBe('true')
  })

  it('disabled 항목은 선택되지 않는다', async () => {
    const wrapper = mount(Segmented, {props: {options: OPTIONS}})
    await wrapper.findAll('[role="radio"]')[2].trigger('click')
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('role="radiogroup" 으로 렌더된다', () => {
    const wrapper = mount(Segmented, {props: {options: OPTIONS}})
    expect(wrapper.find('[role="radiogroup"]').exists()).toBe(true)
  })
})
