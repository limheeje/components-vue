import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'

import ProgressBar from '~/components/ProgressBar/index.vue'

describe('ProgressBar', () => {
  it('progressbar role + aria-valuenow 를 노출한다', () => {
    const wrapper = mount(ProgressBar, {props: {modelValue: 42}})
    expect(wrapper.find('[role="progressbar"]').attributes('aria-valuenow')).toBe('42')
  })

  it('value 를 0~100 으로 클램프한다', () => {
    const wrapper = mount(ProgressBar, {props: {modelValue: 150}})
    expect(wrapper.find('[role="progressbar"]').attributes('aria-valuenow')).toBe('100')
  })

  it('showValue 면 퍼센트 텍스트를 표시한다', () => {
    const wrapper = mount(ProgressBar, {props: {modelValue: 37, showValue: true}})
    expect(wrapper.text()).toContain('37%')
  })

  it('label 을 렌더한다', () => {
    const wrapper = mount(ProgressBar, {props: {modelValue: 10, label: '업로드'}})
    expect(wrapper.text()).toContain('업로드')
  })
})
