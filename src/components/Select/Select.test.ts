import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'

import Select from '~/components/Select/index.vue'

const OPTIONS = [
  {label: '서울', value: 'seoul'},
  {label: '부산', value: 'busan'},
  {label: '대구', value: 'daegu', disabled: true}
]

const opt = (w: ReturnType<typeof mount>, label: string) =>
  w.findAll('[role="option"]').find((o) => o.text().includes(label))!

describe('Select', () => {
  it('placeholder 를 표시하고 클릭 시 옵션이 열린다', async () => {
    const wrapper = mount(Select, {props: {options: OPTIONS, placeholder: '도시 선택'}})
    expect(wrapper.text()).toContain('도시 선택')
    await wrapper.find('[role="combobox"]').trigger('click')
    expect(wrapper.findAll('[role="option"]')).toHaveLength(3)
  })

  it('옵션 선택 시 change(value) 가 emit 된다', async () => {
    const wrapper = mount(Select, {props: {options: OPTIONS}})
    await wrapper.find('[role="combobox"]').trigger('click')
    await opt(wrapper, '서울').trigger('click')
    expect(wrapper.emitted('change')).toEqual([['seoul']])
    expect(wrapper.emitted('update:modelValue')).toEqual([['seoul']])
  })

  it('disabled 옵션은 선택되지 않는다', async () => {
    const wrapper = mount(Select, {props: {options: OPTIONS}})
    await wrapper.find('[role="combobox"]').trigger('click')
    await opt(wrapper, '대구').trigger('click')
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('disabled 면 열리지 않는다', async () => {
    const wrapper = mount(Select, {props: {options: OPTIONS, disabled: true}})
    await wrapper.find('[role="combobox"]').trigger('click')
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
  })

  it('multiple — change(value[]) 로 누적/토글되고 드롭다운이 유지된다', async () => {
    const wrapper = mount(Select, {props: {multiple: true, options: OPTIONS}})
    await wrapper.find('[role="combobox"]').trigger('click')
    await opt(wrapper, '서울').trigger('click')
    expect(wrapper.emitted('change')?.at(-1)).toEqual([['seoul']])
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['seoul']])
    await wrapper.setProps({modelValue: ['seoul']})
    await opt(wrapper, '부산').trigger('click')
    expect(wrapper.emitted('change')?.at(-1)).toEqual([['seoul', 'busan']])
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
  })

  it('multiple 태그의 제거 버튼으로 개별 해제된다', async () => {
    const wrapper = mount(Select, {props: {multiple: true, options: OPTIONS, modelValue: ['seoul', 'busan']}})
    const rm = wrapper.findAll('button').find((b) => b.attributes('aria-label') === '서울 제거')!
    await rm.trigger('click')
    expect(wrapper.emitted('change')?.at(-1)).toEqual([['busan']])
  })
})
