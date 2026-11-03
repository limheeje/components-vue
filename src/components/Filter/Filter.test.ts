import {flushPromises, mount} from '@vue/test-utils'
import {afterEach, describe, expect, it} from 'vitest'

import {DEFAULT_FILTER_SECTIONS} from '~/components/Filter/Filter.constant'
import Filter from '~/components/Filter/index.vue'

const buttons = () => [...document.body.querySelectorAll('button')]
const findByText = (text: string) => buttons().find((b) => b.textContent?.includes(text)) as HTMLButtonElement
const labels = () => [...document.body.querySelectorAll('label')]
const findLabel = (text: string) => labels().find((l) => l.textContent?.includes(text)) as HTMLLabelElement

let wrapper: ReturnType<typeof mount> | null = null
afterEach(() => {
  wrapper?.unmount()
  wrapper = null
  document.body.style.overflow = ''
})

describe('Filter', () => {
  it('open=true 면 기본 섹션들과 초기화/적용하기 버튼을 렌더한다', async () => {
    wrapper = mount(Filter, {props: {open: true, sections: DEFAULT_FILTER_SECTIONS}})
    await flushPromises()
    expect(document.body.querySelector('[role="dialog"]')).not.toBeNull()
    expect(document.body.textContent).toContain('전체 필터')
    expect(document.body.textContent).toContain('브랜드')
    expect(document.body.textContent).toContain('가격대')
    expect(findByText('초기화')).toBeTruthy()
    expect(findByText('적용하기')).toBeTruthy()
  })

  it('체크박스 섹션을 클릭하면 modelValue 가 갱신된다', async () => {
    wrapper = mount(Filter, {props: {open: true, sections: DEFAULT_FILTER_SECTIONS}})
    await flushPromises()
    const usedOption = findLabel('중고')
    expect(usedOption).toBeTruthy()
    const checkbox = usedOption.querySelector('input[type="checkbox"]') as HTMLInputElement
    checkbox.checked = true
    checkbox.dispatchEvent(new Event('change'))
    await flushPromises()
    findByText('적용하기').click()
    await flushPromises()
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect((emitted![0]![0] as Record<string, unknown>).condition).toEqual(['used'])
  })

  it('브랜드 검색어를 입력하면 해당 브랜드만 노출된다', async () => {
    wrapper = mount(Filter, {props: {open: true, sections: DEFAULT_FILTER_SECTIONS}})
    await flushPromises()
    expect(document.body.textContent).toContain('Canon')
    const searchInput = document.body.querySelector('input[placeholder="브랜드 검색"]') as HTMLInputElement
    searchInput.value = 'canon'
    searchInput.dispatchEvent(new Event('input'))
    await flushPromises()
    expect(document.body.textContent).toContain('Canon')
    expect(document.body.textContent).not.toContain('Advantest')
  })

  it('초기화 버튼을 클릭하면 선택값이 모두 비워진다', async () => {
    wrapper = mount(Filter, {props: {open: true, sections: DEFAULT_FILTER_SECTIONS}})
    await flushPromises()
    const checkbox = findLabel('중고').querySelector('input[type="checkbox"]') as HTMLInputElement
    checkbox.checked = true
    checkbox.dispatchEvent(new Event('change'))
    await flushPromises()
    findByText('초기화').click()
    await flushPromises()
    findByText('적용하기').click()
    await flushPromises()
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted![0]![0]).toEqual({})
  })

  it('가격대 최소/최대 입력이 modelValue.priceRange 에 반영된다', async () => {
    wrapper = mount(Filter, {props: {open: true, sections: DEFAULT_FILTER_SECTIONS}})
    await flushPromises()
    const minInput = document.body.querySelector('input[placeholder="최소 금액"]') as HTMLInputElement
    const maxInput = document.body.querySelector('input[placeholder="최대 금액"]') as HTMLInputElement
    minInput.value = '1000'
    minInput.dispatchEvent(new Event('input'))
    maxInput.value = '5000'
    maxInput.dispatchEvent(new Event('input'))
    await flushPromises()
    findByText('적용하기').click()
    await flushPromises()
    const emitted = wrapper.emitted('confirm')
    expect((emitted![0]![0] as Record<string, unknown>).priceRange).toEqual({min: '1000', max: '5000'})
  })
})
