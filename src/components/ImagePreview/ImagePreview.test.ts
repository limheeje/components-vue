import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'

import ImagePreview from '~/components/ImagePreview/index.vue'

const IMGS = ['/a.jpg', '/b.jpg', '/c.jpg']

describe('ImagePreview', () => {
  it('썸네일 이미지를 렌더한다', () => {
    const wrapper = mount(ImagePreview, {props: {src: '/a.jpg', alt: '사진'}})
    expect(wrapper.find('img').attributes('alt')).toBe('사진')
  })

  it('클릭하면 라이트박스가 열린다', async () => {
    const wrapper = mount(ImagePreview, {props: {src: '/a.jpg', alt: '사진'}})
    await wrapper.find('[role="button"]').trigger('click')
    expect(wrapper.find('[role="dialog"][aria-label="이미지 미리보기"]').exists()).toBe(true)
  })

  it('preview={false} 면 클릭해도 열리지 않는다', async () => {
    const wrapper = mount(ImagePreview, {props: {src: '/a.jpg', alt: '사진', preview: false}})
    await wrapper.find('img').trigger('click')
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('group 을 주면 라이트박스가 해당 인덱스에서 열린다', async () => {
    const wrapper = mount(ImagePreview, {props: {src: '/b.jpg', alt: 'b', group: IMGS}})
    await wrapper.find('[role="button"]').trigger('click')
    expect(wrapper.text()).toContain('2 / 3')
  })

  it('로드 실패 시 fallback 으로 교체된다', async () => {
    const wrapper = mount(ImagePreview, {props: {src: '/broken.jpg', alt: 'x', fallback: '/fb.jpg'}})
    await wrapper.find('img').trigger('error')
    expect(wrapper.find('img').attributes('src')).toBe('/fb.jpg')
  })
})
