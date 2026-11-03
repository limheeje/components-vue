import {mount} from '@vue/test-utils'
import {describe, expect, it, vi} from 'vitest'

import Header from '~/components/Header/index.vue'

describe('Header', () => {
  it('title 을 렌더한다', () => {
    const wrapper = mount(Header, {props: {title: '회원 목록'}})
    expect(wrapper.text()).toContain('회원 목록')
  })

  it('back 버튼 클릭 시 back 이 emit 된다', async () => {
    const onBack = vi.fn()
    const wrapper = mount(Header, {props: {title: '상세', back: true}, attrs: {onBack}})
    await wrapper.find('button[aria-label="뒤로 가기"]').trigger('click')
    expect(onBack).toHaveBeenCalled()
  })

  it('actions 배열을 버튼으로 렌더하고 badge 를 표시한다', () => {
    const wrapper = mount(Header, {
      props: {
        title: '홈',
        actions: [
          {icon: 'search', label: '검색'},
          {icon: 'info', label: '알림', badge: 3}
        ]
      }
    })
    expect(wrapper.find('button[aria-label="검색"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('3')
  })

  it('type="primary" 클래스가 적용된다', () => {
    const wrapper = mount(Header, {props: {title: '홈', type: 'primary'}})
    expect(wrapper.find('header').classes().join(' ')).toMatch(/bsHeaderTypePrimary/)
  })
})
