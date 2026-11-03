import {mount} from '@vue/test-utils'
import {describe, expect, it, vi} from 'vitest'

import Input from '~/components/Input/index.ts'

describe('Input', () => {
  it('placeholder 로 렌더된다', () => {
    const wrapper = mount(Input, {props: {placeholder: '아이디'}})
    expect(wrapper.find('input').attributes('placeholder')).toBe('아이디')
  })

  it('입력 시 change 가 emit 된다', async () => {
    const wrapper = mount(Input, {props: {placeholder: 'p'}})
    await wrapper.find('input').setValue('abc')
    expect(wrapper.emitted('change')).toBeTruthy()
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('abc')
  })

  it('입력 시 update:modelValue 가 emit 되어 v-model 이 동작한다', async () => {
    const wrapper = mount(Input, {props: {modelValue: ''}})
    await wrapper.find('input').setValue('hello')
    expect(wrapper.emitted('update:modelValue')).toEqual([['hello']])
  })

  it('modelValue 를 input 값으로 반영한다', () => {
    const wrapper = mount(Input, {props: {modelValue: '초기값'}})
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('초기값')
  })

  it('error 문자열이면 하단 메시지를 렌더한다', () => {
    const wrapper = mount(Input, {props: {error: '필수 항목', placeholder: 'p'}})
    expect(wrapper.text()).toContain('필수 항목')
  })

  it('compound — Input.Password 는 type=password', () => {
    const wrapper = mount(Input.Password, {props: {placeholder: 'pw'}})
    expect(wrapper.find('input').attributes('type')).toBe('password')
  })

  it('Input.Search 는 Enter 로 search 를 emit 한다', async () => {
    const onSearch = vi.fn()
    const wrapper = mount(Input.Search, {props: {placeholder: '검색'}, attrs: {onSearch}})
    const input = wrapper.find('input')
    await input.setValue('키워드')
    await input.trigger('keydown', {key: 'Enter'})
    expect(onSearch).toHaveBeenCalledWith('키워드')
  })
})
