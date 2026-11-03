import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'

import CheckboxGroup from '~/components/CheckboxGroup/index.vue'
import type {CheckboxGroupOption} from '~/components/CheckboxGroup/CheckboxGroup.type'

const OPTIONS: CheckboxGroupOption[] = [
  {label: 'React', value: 'react'},
  {label: 'Vue', value: 'vue'},
  {label: 'Svelte', value: 'svelte', disabled: true}
]

describe('CheckboxGroup', () => {
  it('options 를 체크박스로 렌더한다', () => {
    const wrapper = mount(CheckboxGroup, {props: {options: OPTIONS, modelValue: []}})
    expect(wrapper.findAll('input[type="checkbox"]')).toHaveLength(3)
  })

  it('클릭 시 change 로 값 배열이 전달된다', async () => {
    const wrapper = mount(CheckboxGroup, {props: {options: OPTIONS, modelValue: []}})
    await wrapper.findAll('input[type="checkbox"]')[0].setValue(true)
    expect(wrapper.emitted('change')?.[0]).toEqual([['react']])
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['react']])
  })

  it('disabled 옵션은 비활성이다', () => {
    const wrapper = mount(CheckboxGroup, {props: {options: OPTIONS, modelValue: []}})
    expect(wrapper.findAll('input[type="checkbox"]')[2].attributes('disabled')).toBeDefined()
  })

  it('max 도달 시 미선택 항목이 비활성화된다', () => {
    const wrapper = mount(CheckboxGroup, {props: {options: OPTIONS, modelValue: ['react'], max: 1}})
    expect(wrapper.findAll('input[type="checkbox"]')[1].attributes('disabled')).toBeDefined()
  })
})
