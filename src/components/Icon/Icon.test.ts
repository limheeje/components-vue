import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'

import Icon from '~/components/Icon/index.vue'

describe('Icon', () => {
  it('aria-label 없으면 aria-hidden 이다', () => {
    const wrapper = mount(Icon, {props: {name: 'search'}})
    expect(wrapper.find('i').attributes('aria-hidden')).toBe('true')
  })

  it('aria-label 이 있으면 role="img" 이다', () => {
    const wrapper = mount(Icon, {props: {name: 'search', 'aria-label': '검색'}})
    const i = wrapper.find('i')
    expect(i.attributes('role')).toBe('img')
    expect(i.attributes('aria-label')).toBe('검색')
  })

  it('size 숫자를 px 로 변환해 style 에 반영한다', () => {
    const wrapper = mount(Icon, {props: {name: 'search', size: 20}})
    const el = wrapper.find('i').element as HTMLElement
    expect(el.style.width).toBe('20px')
    expect(el.style.height).toBe('20px')
  })

  it('click 이 동작한다', async () => {
    const wrapper = mount(Icon, {props: {name: 'close'}, attrs: {'aria-label': '닫기'}})
    await wrapper.find('i').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
