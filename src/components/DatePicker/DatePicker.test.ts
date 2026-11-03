import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'

import DatePicker from '~/components/DatePicker/index.vue'

describe('DatePicker', () => {
  it('클릭 시 캘린더 팝업이 열린다', async () => {
    const wrapper = mount(DatePicker)
    await wrapper.find('[role="combobox"]').trigger('click')
    expect(wrapper.find('[role="dialog"][aria-label="날짜 선택"]').exists()).toBe(true)
  })

  it('modelValue 를 포맷해 표시한다', () => {
    const wrapper = mount(DatePicker, {props: {modelValue: new Date(2026, 0, 15), format: 'YYYY-MM-DD'}})
    expect(wrapper.find('[role="combobox"]').text()).toContain('2026-01-15')
  })

  it('single 모드 — 날짜 클릭 시 change 호출 후 닫힌다', async () => {
    const wrapper = mount(DatePicker, {props: {modelValue: new Date(2026, 0, 15)}})
    await wrapper.find('[role="combobox"]').trigger('click')
    const cell = wrapper.findAll('button').find((b) => b.text().trim() === '20')!
    await cell.trigger('click')
    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('range 모드 — 시작일/종료일 패널을 렌더한다', async () => {
    const wrapper = mount(DatePicker, {props: {mode: 'range'}})
    await wrapper.find('[role="combobox"]').trigger('click')
    expect(wrapper.text()).toContain('시작일')
    expect(wrapper.text()).toContain('종료일')
  })
})
