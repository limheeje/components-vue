import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'

import RadioGroup from '~/components/RadioGroup/index.vue'
import type {RadioGroupOption} from '~/components/RadioGroup/RadioGroup.type'

const OPTIONS: RadioGroupOption[] = [
  {label: '서울', value: 'seoul'},
  {label: '부산', value: 'busan'},
  {label: '대구', value: 'daegu', disabled: true}
]

describe('RadioGroup', () => {
  it('options 를 라디오로 렌더하고 name 을 묶는다', () => {
    const wrapper = mount(RadioGroup, {props: {options: OPTIONS, name: 'city'}})
    const radios = wrapper.findAll('input[type="radio"]')
    expect(radios).toHaveLength(3)
    expect(radios.every((r) => r.attributes('name') === 'city')).toBe(true)
  })

  it('선택 시 change 로 value 문자열이 emit 된다', async () => {
    const wrapper = mount(RadioGroup, {props: {options: OPTIONS}, attachTo: document.body})
    await wrapper.findAll('input[type="radio"]')[1].trigger('change')
    expect(wrapper.emitted('change')?.[0]).toEqual(['busan'])
    wrapper.unmount()
  })

  it('v-model — modelValue 매칭 항목이 선택되고 선택 시 update:modelValue 가 emit 된다', async () => {
    const wrapper = mount(RadioGroup, {
      props: {options: OPTIONS, modelValue: 'seoul'},
      attachTo: document.body
    })
    const radios = wrapper.findAll('input[type="radio"]')
    expect((radios[0].element as HTMLInputElement).checked).toBe(true)
    await radios[1].trigger('change')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['busan'])
    wrapper.unmount()
  })

  it('disabled 옵션은 비활성이다', () => {
    const wrapper = mount(RadioGroup, {props: {options: OPTIONS}})
    expect(wrapper.findAll('input[type="radio"]')[2].attributes('disabled')).toBeDefined()
  })

  it('role="radiogroup" 으로 렌더된다', () => {
    const wrapper = mount(RadioGroup, {props: {options: OPTIONS}})
    expect(wrapper.find('[role="radiogroup"]').exists()).toBe(true)
  })
})
