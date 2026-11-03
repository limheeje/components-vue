import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'

import Lightbox from '~/components/Lightbox/index.vue'

const IMGS = ['/a.jpg', '/b.jpg', '/c.jpg']
const byLabel = (w: ReturnType<typeof mount>, l: string) =>
  w.findAll('button').find((b) => b.attributes('aria-label') === l)

describe('Lightbox', () => {
  it('현재 이미지와 카운터를 렌더한다', () => {
    const wrapper = mount(Lightbox, {props: {images: IMGS, index: 1}})
    expect(wrapper.text()).toContain('2 / 3')
  })

  it('닫기 버튼으로 close 가 emit 된다', async () => {
    const wrapper = mount(Lightbox, {props: {images: IMGS, index: 0}})
    await byLabel(wrapper, '닫기')!.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('다음 버튼으로 change(index+1) 가 emit 된다', async () => {
    const wrapper = mount(Lightbox, {props: {images: IMGS, index: 0}})
    await byLabel(wrapper, '다음')!.trigger('click')
    expect(wrapper.emitted('change')).toEqual([[1]])
  })

  it('첫 이미지에서는 이전 버튼이 없다', () => {
    const wrapper = mount(Lightbox, {props: {images: IMGS, index: 0}})
    expect(byLabel(wrapper, '이전')).toBeUndefined()
  })

  it('downloadable={false} 면 다운로드 버튼이 없다', () => {
    const wrapper = mount(Lightbox, {props: {images: IMGS, index: 0, downloadable: false}})
    expect(byLabel(wrapper, '다운로드')).toBeUndefined()
  })
})
