import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'
import {h} from 'vue'

import Swiper from '~/components/Swiper/index.vue'

const SLIDES = () => [1, 2, 3, 4].map((n) => h('div', {key: n}, `슬라이드 ${n}`))

const byLabel = (w: ReturnType<typeof mount>, label: string) =>
  w.findAll('button').find((b) => b.attributes('aria-label') === label)

describe('Swiper', () => {
  it('items 를 렌더한다', () => {
    const wrapper = mount(Swiper, {props: {items: SLIDES()}})
    expect(wrapper.text()).toContain('슬라이드 1')
    expect(wrapper.text()).toContain('슬라이드 4')
  })

  it('다음 화살표로 이동하고 change 가 emit 된다', async () => {
    const wrapper = mount(Swiper, {props: {items: SLIDES()}})
    await byLabel(wrapper, '다음 슬라이드')!.trigger('click')
    expect(wrapper.emitted('change')).toEqual([[1]])
  })

  it('loop=false 면 첫 슬라이드에서 이전 버튼이 비활성', () => {
    const wrapper = mount(Swiper, {props: {items: SLIDES()}})
    expect(byLabel(wrapper, '이전 슬라이드')!.attributes('disabled')).toBeDefined()
  })

  it('navigation={false} 면 화살표가 없다', () => {
    const wrapper = mount(Swiper, {props: {items: SLIDES(), navigation: false}})
    expect(byLabel(wrapper, '다음 슬라이드')).toBeUndefined()
  })

  it('bullets 개수는 maxIdx+1 (slidesPerView 반영)', () => {
    const wrapper = mount(Swiper, {
      props: {items: SLIDES(), slidesPerView: 2, navigation: false, pagination: 'bullets'}
    })
    expect(
      wrapper.findAll('button').filter((b) => /슬라이드로 이동/.test(b.attributes('aria-label') ?? ''))
    ).toHaveLength(3)
  })
})
