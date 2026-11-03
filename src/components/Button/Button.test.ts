import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'

import Button from '~/components/Button/index.vue'
import {BUTTON_VARIANT} from '~/components/Button/Button.constant'

describe('Button', () => {
  it('기본 slot 을 렌더한다', () => {
    const wrapper = mount(Button, {slots: {default: '저장'}})
    expect(wrapper.find('button').text()).toBe('저장')
  })

  it('상태 색상 variant 클래스가 붙는다', () => {
    const wrapper = mount(Button, {props: {variant: BUTTON_VARIANT.DANGER_LIGHT}})
    expect(wrapper.find('button').classes().join(' ')).toMatch(/bsButtonVariantDangerLight/)
    expect(mount(Button).find('button').classes().join(' ')).not.toMatch(/bsButtonVariantDanger/)
  })

  it('click 이 emit 된다', async () => {
    const wrapper = mount(Button, {slots: {default: '클릭'}})
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('loading 이면 click 이 차단되고 aria-busy 가 붙는다', async () => {
    const wrapper = mount(Button, {props: {loading: true}, slots: {default: '로딩'}})
    const btn = wrapper.find('button')
    expect(btn.attributes('aria-busy')).toBe('true')
    await btn.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('variant / size 클래스가 적용된다', () => {
    const wrapper = mount(Button, {props: {variant: BUTTON_VARIANT.SECONDARY, size: 'lg'}, slots: {default: 'x'}})
    const cls = wrapper.find('button').classes().join(' ')
    expect(cls).toMatch(/bsButtonVariantSecondary/)
    expect(cls).toMatch(/bsButtonSizeLg/)
  })

  it('htmlType 을 button type 으로 전달한다', () => {
    const wrapper = mount(Button, {props: {htmlType: 'submit'}, slots: {default: '전송'}})
    expect(wrapper.find('button').attributes('type')).toBe('submit')
  })

  it('disabled 면 click 이 차단된다', async () => {
    const wrapper = mount(Button, {props: {disabled: true}, slots: {default: 'x'}})
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })
})
