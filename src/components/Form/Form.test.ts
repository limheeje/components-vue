import {mount} from '@vue/test-utils'
import {describe, expect, it, vi} from 'vitest'
import {h} from 'vue'

import Form from '~/components/Form/index.ts'

describe('Form', () => {
  it('form + fieldset 을 렌더하고 submit 이 동작한다', async () => {
    const onSubmit = vi.fn((e: Event) => e.preventDefault())
    const wrapper = mount(Form, {
      attrs: {onSubmit},
      slots: {
        default: () => [
          h(Form.Field, {label: '이름'}, () => h('input')),
          h(Form.Actions, () => h('button', {type: 'submit'}, '저장'))
        ]
      }
    })
    await wrapper.find('form').trigger('submit')
    expect(onSubmit).toHaveBeenCalled()
  })

  it('required 는 * 를 표시한다', () => {
    const wrapper = mount(Form, {
      slots: {default: () => h(Form.Field, {label: '이메일', required: true}, () => h('input'))}
    })
    expect(wrapper.text()).toContain('*')
  })

  it('error 문자열이 있으면 role="alert" 메시지를 표시한다', () => {
    const wrapper = mount(Form, {
      slots: {default: () => h(Form.Field, {label: '이름', error: '이름을 입력해주세요.'}, () => h('input'))}
    })
    expect(wrapper.find('[role="alert"]').text()).toContain('이름을 입력해주세요.')
  })

  it('error 가 없고 help 가 있으면 help 를 표시한다', () => {
    const wrapper = mount(Form, {
      slots: {default: () => h(Form.Field, {label: '비밀번호', help: '8자 이상'}, () => h('input'))}
    })
    expect(wrapper.text()).toContain('8자 이상')
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })

  it('disabled 는 fieldset 을 비활성화한다', () => {
    const wrapper = mount(Form, {
      props: {disabled: true},
      slots: {default: () => h(Form.Field, {label: '이름'}, () => h('input'))}
    })
    expect(wrapper.find('fieldset').attributes('disabled')).toBeDefined()
  })
})
