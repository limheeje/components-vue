import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'

import SearchField from '~/components/SearchField/index.vue'

describe('SearchField', () => {
  it('입력 후 Enter 로 search 가 emit 된다', async () => {
    const wrapper = mount(SearchField, {props: {placeholder: '검색어'}})
    const input = wrapper.find('input')
    await input.setValue('커피')
    await input.trigger('keydown', {key: 'Enter'})
    expect(wrapper.emitted('search')).toEqual([['커피']])
  })

  it('돋보기 버튼 클릭 시 현재 값으로 search 가 emit 된다', async () => {
    const wrapper = mount(SearchField, {props: {placeholder: '검색어'}})
    await wrapper.find('input').setValue('차')
    await wrapper.find('button[aria-label="검색"]').trigger('click')
    expect(wrapper.emitted('search')).toEqual([['차']])
  })

  it('clearable — 값이 있으면 지우기 버튼이 나타나고 클릭 시 clear', async () => {
    const wrapper = mount(SearchField, {props: {clearable: true, placeholder: '검색어'}})
    await wrapper.find('input').setValue('abc')
    await wrapper.find('button[aria-label="입력 내용 지우기"]').trigger('click')
    expect(wrapper.emitted('clear')).toBeTruthy()
  })
})
