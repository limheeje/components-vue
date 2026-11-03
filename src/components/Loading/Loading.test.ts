import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'

import Loading from '~/components/Loading/index.vue'

describe('Loading', () => {
  it('text 를 렌더한다', () => {
    const wrapper = mount(Loading, {props: {text: '불러오는 중'}})
    expect(wrapper.text()).toContain('불러오는 중')
  })

  it('type / size 클래스가 적용된다', () => {
    const wrapper = mount(Loading, {props: {type: 'dots', size: 'lg'}})
    expect(wrapper.html()).toMatch(/bsLoadingDots/)
    expect(wrapper.html()).toMatch(/bsLoadingSizeLg/)
  })

  it('기본은 오버레이가 아니다', () => {
    const wrapper = mount(Loading)
    expect(wrapper.element.className).not.toMatch(/overlay/)
  })
})
