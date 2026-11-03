import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'

import Image from '~/components/Image/index.vue'

describe('Image', () => {
  it('img 를 alt 와 함께 렌더한다', () => {
    const wrapper = mount(Image, {props: {src: '/a.jpg', alt: '산 풍경'}})
    expect(wrapper.find('img').attributes('alt')).toBe('산 풍경')
  })

  it('로드 완료 시 load 가 emit 된다', async () => {
    const wrapper = mount(Image, {props: {src: '/a.jpg', alt: 'a'}})
    await wrapper.find('img').trigger('load')
    expect(wrapper.emitted('load')).toBeTruthy()
  })

  it('src 실패 시 fallbackSrc 로 교체된다', async () => {
    const wrapper = mount(Image, {props: {src: '/broken.jpg', alt: 'a', fallbackSrc: '/fallback.jpg'}})
    await wrapper.find('img').trigger('error')
    expect(wrapper.find('img').attributes('src')).toBe('/fallback.jpg')
  })

  it('fallback 없이 실패하면 오류 플레이스홀더 + error emit', async () => {
    const wrapper = mount(Image, {props: {src: '/broken.jpg', alt: 'a'}})
    await wrapper.find('img').trigger('error')
    expect(wrapper.text()).toContain('이미지를 불러올 수 없습니다')
    expect(wrapper.emitted('error')).toBeTruthy()
  })

  it('loading 속성 기본값은 lazy', () => {
    const wrapper = mount(Image, {props: {src: '/a.jpg', alt: 'a'}})
    expect(wrapper.find('img').attributes('loading')).toBe('lazy')
  })
})
