import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'

import Steps from '~/components/Steps/index.vue'

const STEPS = [
  {title: '주문', description: '장바구니 확인'},
  {title: '결제', description: '카드 결제'},
  {title: '완료'}
]

describe('Steps', () => {
  it('모든 단계 제목/설명을 렌더한다', () => {
    const wrapper = mount(Steps, {props: {steps: STEPS, modelValue: 1}})
    const text = wrapper.text()
    expect(text).toContain('주문')
    expect(text).toContain('결제')
    expect(text).toContain('완료')
    expect(text).toContain('카드 결제')
  })

  it('current 단계에 aria-current="step" 이 붙는다', () => {
    const wrapper = mount(Steps, {props: {steps: STEPS, modelValue: 1}})
    const node = wrapper.find('[aria-current="step"]')
    expect(node.exists()).toBe(true)
    expect(node.text()).toContain('결제')
  })
})
