import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'
import {h} from 'vue'

import Accordion from '~/components/Accordion/index.ts'

const items = () => [
  h(Accordion.Item, {value: 'a', title: '첫 번째'}, () => '내용 A'),
  h(Accordion.Item, {value: 'b', title: '두 번째'}, () => '내용 B')
]

describe('Accordion', () => {
  it('제목을 렌더하고 클릭 시 열린다', async () => {
    const wrapper = mount(Accordion, {slots: {default: items}})
    const btn = wrapper.findAll('button')[0]
    expect(btn.attributes('aria-expanded')).toBe('false')
    await btn.trigger('click')
    expect(btn.attributes('aria-expanded')).toBe('true')
  })

  it('single(기본) — 하나 열면 다른 건 닫힌다 (uncontrolled)', async () => {
    const wrapper = mount(Accordion, {slots: {default: items}})
    await wrapper.findAll('button')[0].trigger('click')
    expect(wrapper.findAll('button')[0].attributes('aria-expanded')).toBe('true')
    await wrapper.findAll('button')[1].trigger('click')
    expect(wrapper.findAll('button')[0].attributes('aria-expanded')).toBe('false')
    expect(wrapper.findAll('button')[1].attributes('aria-expanded')).toBe('true')
  })

  it('v-model — modelValue 와 일치하는 항목이 열린다', async () => {
    const wrapper = mount(Accordion, {props: {modelValue: 'b'}, slots: {default: items}})
    expect(wrapper.findAll('button')[1].attributes('aria-expanded')).toBe('true')
    await wrapper.setProps({modelValue: 'a'})
    expect(wrapper.findAll('button')[0].attributes('aria-expanded')).toBe('true')
    expect(wrapper.findAll('button')[1].attributes('aria-expanded')).toBe('false')
  })

  it('valueChange 와 update:modelValue 가 emit 된다', async () => {
    const wrapper = mount(Accordion, {slots: {default: items}})
    await wrapper.findAll('button')[0].trigger('click')
    expect(wrapper.emitted('valueChange')).toEqual([['a']])
    expect(wrapper.emitted('update:modelValue')).toEqual([['a']])
  })

  it('v-model(multiple) — 클릭 토글이 배열에 반영되도록 update:modelValue 를 emit 한다', async () => {
    const wrapper = mount(Accordion, {
      props: {type: 'multiple', modelValue: ['a']},
      slots: {default: items}
    })
    await wrapper.findAll('button')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['a', 'b']])
  })
})
