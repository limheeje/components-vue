import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'

import Textarea from '~/components/Textarea/index.vue'

describe('Textarea', () => {
  it('입력 시 update:modelValue 가 emit 되어 v-model 이 동작한다', async () => {
    const wrapper = mount(Textarea, {props: {modelValue: ''}})
    await wrapper.find('textarea').setValue('메모')
    expect(wrapper.emitted('update:modelValue')).toEqual([['메모']])
  })

  it('placeholder 로 렌더된다', () => {
    const wrapper = mount(Textarea, {props: {placeholder: '내용'}})
    expect(wrapper.find('textarea').attributes('placeholder')).toBe('내용')
  })

  it('입력이 반영된다', async () => {
    const wrapper = mount(Textarea, {props: {placeholder: 'p'}})
    const el = wrapper.find('textarea')
    await el.setValue('여러 줄\n입력')
    expect((el.element as HTMLTextAreaElement).value).toBe('여러 줄\n입력')
  })

  it('error 문자열이면 메시지를 렌더한다', () => {
    const wrapper = mount(Textarea, {props: {error: '너무 짧습니다', placeholder: 'p'}})
    expect(wrapper.text()).toContain('너무 짧습니다')
  })

  it('showCount + maxLength 카운터를 표시한다', () => {
    const wrapper = mount(Textarea, {props: {showCount: true, maxLength: 10, defaultValue: 'abc', placeholder: 'p'}})
    expect(wrapper.text()).toContain('3 / 10')
  })
})
