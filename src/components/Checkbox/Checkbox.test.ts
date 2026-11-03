import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'

import Checkbox from '~/components/Checkbox/index.vue'

describe('Checkbox', () => {
  it('label 로 렌더되고 change 시 update:checked 가 emit 된다', async () => {
    const wrapper = mount(Checkbox, {props: {label: '약관 동의'}})
    expect(wrapper.text()).toContain('약관 동의')
    await wrapper.find('input[type="checkbox"]').setValue(true)
    expect(wrapper.emitted('update:checked')).toEqual([[true]])
    // React 처럼 원본 네이티브 이벤트도 change 로 재발행
    expect(wrapper.emitted('change')?.[0][0]).toBeInstanceOf(Event)
  })

  it('v-model — boolean 바인딩: 체크 상태를 반영하고 update:modelValue 를 emit 한다', async () => {
    const wrapper = mount(Checkbox, {props: {modelValue: false, label: 'x'}})
    expect((wrapper.find('input').element as HTMLInputElement).checked).toBe(false)
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
  })

  it('v-model — 배열 바인딩: value 포함 여부로 체크되고 토글 시 다음 배열을 emit 한다', async () => {
    const wrapper = mount(Checkbox, {props: {modelValue: ['a'], value: 'b', label: 'B'}})
    expect((wrapper.find('input').element as HTMLInputElement).checked).toBe(false)
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')).toEqual([[['a', 'b']]])
  })

  it('indeterminate 를 input 에 반영한다', () => {
    const wrapper = mount(Checkbox, {props: {label: '부분', indeterminate: true}})
    expect((wrapper.find('input').element as HTMLInputElement).indeterminate).toBe(true)
  })

  it('disabled 면 input 이 비활성이다', () => {
    const wrapper = mount(Checkbox, {props: {label: 'x', disabled: true}})
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('expose 로 el 을 노출한다', () => {
    const wrapper = mount(Checkbox)
    expect((wrapper.vm as unknown as {el: HTMLInputElement}).el).toBeInstanceOf(HTMLInputElement)
  })
})
