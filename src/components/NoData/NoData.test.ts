import {mount} from '@vue/test-utils'
import {describe, expect, it, vi} from 'vitest'

import NoData from '~/components/NoData/index.vue'

describe('NoData', () => {
  it('기본 프리셋 제목을 렌더한다', () => {
    const wrapper = mount(NoData)
    expect(wrapper.html()).toMatch(/bsNoDataTitle/)
  })

  it('title / description 을 렌더한다', () => {
    const wrapper = mount(NoData, {props: {title: '결과 없음', description: '다시 검색해보세요'}})
    expect(wrapper.text()).toContain('결과 없음')
    expect(wrapper.text()).toContain('다시 검색해보세요')
  })

  it('onRetry 핸들러가 있으면 버튼이 나타나고 동작한다', async () => {
    const onRetry = vi.fn()
    const wrapper = mount(NoData, {attrs: {onRetry}})
    await wrapper.find('button').trigger('click')
    expect(onRetry).toHaveBeenCalledOnce()
  })
})
