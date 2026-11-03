import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'

import TimePicker from '~/components/TimePicker/index.vue'

const btnByText = (w: ReturnType<typeof mount>, t: string) => w.findAll('button').find((b) => b.text().trim() === t)!

describe('TimePicker', () => {
  it('placeholder 를 표시하고 클릭 시 팝업이 열린다', async () => {
    const wrapper = mount(TimePicker, {props: {placeholder: '시간 선택'}})
    const trigger = wrapper.find('[role="combobox"]')
    expect(trigger.text()).toContain('시간 선택')
    await trigger.trigger('click')
    expect(wrapper.find('[role="dialog"][aria-label="시간 선택"]').exists()).toBe(true)
  })

  it('modelValue 를 표시값으로 반영한다', () => {
    const wrapper = mount(TimePicker, {props: {modelValue: '09:30'}})
    expect(wrapper.find('[role="combobox"]').text()).toContain('09:30')
  })

  it("'확인' 을 눌러야 change 가 호출된다", async () => {
    const wrapper = mount(TimePicker, {props: {modelValue: '09:30'}})
    await wrapper.find('[role="combobox"]').trigger('click')
    await btnByText(wrapper, '확인').trigger('click')
    expect(wrapper.emitted('change')).toEqual([['09:30']])
    expect(wrapper.emitted('update:modelValue')).toEqual([['09:30']])
  })

  it("'취소' 는 change 없이 닫힌다", async () => {
    const wrapper = mount(TimePicker, {props: {modelValue: '09:30'}})
    await wrapper.find('[role="combobox"]').trigger('click')
    await btnByText(wrapper, '취소').trigger('click')
    expect(wrapper.emitted('change')).toBeUndefined()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })
})
