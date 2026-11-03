import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'

import Pagination from '~/components/Pagination/index.vue'

const findByLabel = (wrapper: ReturnType<typeof mount>, name: string) =>
  wrapper.findAll('button').find((b) => b.text().trim() === name || b.attributes('aria-label') === name)!

describe('Pagination', () => {
  it('nav + 현재 페이지 aria-current 를 렌더한다', () => {
    const wrapper = mount(Pagination, {props: {modelValue: 2, totalPages: 5}})
    expect(wrapper.find('nav[aria-label="pagination"]').exists()).toBe(true)
    expect(findByLabel(wrapper, '2').attributes('aria-current')).toBe('page')
  })

  it('페이지 버튼 클릭 시 change 가 emit 된다', async () => {
    const wrapper = mount(Pagination, {props: {modelValue: 1, totalPages: 5}})
    await findByLabel(wrapper, '3').trigger('click')
    expect(wrapper.emitted('change')).toEqual([[3]])
    expect(wrapper.emitted('update:modelValue')).toEqual([[3]])
  })

  it('이전 버튼은 첫 페이지에서 비활성화된다', () => {
    const wrapper = mount(Pagination, {props: {modelValue: 1, totalPages: 5}})
    expect(findByLabel(wrapper, '이전 페이지').attributes('disabled')).toBeDefined()
  })

  it('다음 버튼은 마지막 페이지에서 비활성화된다', () => {
    const wrapper = mount(Pagination, {props: {modelValue: 5, totalPages: 5}})
    expect(findByLabel(wrapper, '다음 페이지').attributes('disabled')).toBeDefined()
  })

  it('total + pageSize 로 페이지 수를 계산한다', () => {
    const wrapper = mount(Pagination, {props: {modelValue: 1, total: 30, pageSize: 10}})
    expect(findByLabel(wrapper, '3')).toBeTruthy()
    expect(wrapper.findAll('button').find((b) => b.text().trim() === '4')).toBeUndefined()
  })
})
