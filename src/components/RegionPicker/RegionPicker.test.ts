import {flushPromises, mount} from '@vue/test-utils'
import {afterEach, describe, expect, it} from 'vitest'

import RegionPicker from '~/components/RegionPicker/index.vue'

// CSS Module 클래스는 테스트 환경에선 `_<name>_<hash>` 로 나오므로 부분일치(`[class*=]`)로 조회.
const columns = () => [...document.body.querySelectorAll('[class*="bsRegionPickerColumn_"]')]

const findBtn = (col: Element, label: string) =>
  [...col.querySelectorAll('button')].find((b) => b.textContent?.trim().startsWith(label)) as HTMLButtonElement

const provinceBtn = (label: string) => findBtn(columns()[0]!, label)
const cityBtn = (label: string) => findBtn(columns()[1]!, label)
const confirmFullBtn = () => document.body.querySelector('[class*="bsRegionPickerConfirmFull_"]') as HTMLButtonElement
const confirmBtn = () => document.body.querySelector('[class*="bsRegionPickerConfirm_"]') as HTMLButtonElement
const resetBtn = () => document.body.querySelector('[class*="bsRegionPickerReset_"]') as HTMLButtonElement
const chips = () => [...document.body.querySelectorAll('[class*="bsRegionPickerChip_"]')]
const backBtn = () => document.body.querySelector('button[aria-label="뒤로가기"]') as HTMLButtonElement
const closeBtn = () => document.body.querySelector('button[aria-label="닫기"]') as HTMLButtonElement

let wrapper: ReturnType<typeof mount> | null = null
afterEach(() => {
  wrapper?.unmount()
  wrapper = null
  document.body.style.overflow = ''
})

describe('RegionPicker (단일 선택, multiple=false)', () => {
  it('open=true 면 시/도 목록과 안내 문구를 렌더한다', async () => {
    wrapper = mount(RegionPicker, {props: {open: true, multiple: false}})
    await flushPromises()
    expect(document.body.querySelector('[role="dialog"]')).not.toBeNull()
    expect(document.body.textContent).toContain('시군구 선택')
    expect(document.body.textContent).toContain('행정구역을 선택하세요.')
    expect(provinceBtn('전남')).toBeTruthy()
  })

  it('시/도 선택 시 시군구 목록이 채워지고, 선택 전엔 확정 버튼이 disabled', async () => {
    wrapper = mount(RegionPicker, {props: {open: true, multiple: false}})
    await flushPromises()
    expect(confirmFullBtn().disabled).toBe(true)
    provinceBtn('전남').click()
    await flushPromises()
    expect(cityBtn('보성군')).toBeTruthy()
    expect(confirmFullBtn().disabled).toBe(true)
  })

  it('시/도 + 시군구 선택 후 확정 클릭 시 update:modelValue / confirm / close 가 emit 된다', async () => {
    wrapper = mount(RegionPicker, {props: {open: true, multiple: false}})
    await flushPromises()
    provinceBtn('전남').click()
    await flushPromises()
    cityBtn('보성군').click()
    await flushPromises()
    expect(document.body.textContent).toContain('전남 > 보성군')
    expect(confirmFullBtn().disabled).toBe(false)
    confirmFullBtn().click()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([{province: '전남', city: '보성군'}])
    expect(wrapper.emitted('confirm')?.[0]).toEqual([{province: '전남', city: '보성군'}])
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('modelValue 로 초기 선택 상태를 복원한다', async () => {
    wrapper = mount(RegionPicker, {
      props: {open: true, multiple: false, modelValue: {province: '전남', city: '보성군'}}
    })
    await flushPromises()
    expect(document.body.textContent).toContain('전남 > 보성군')
    expect(confirmFullBtn().disabled).toBe(false)
  })

  it('뒤로가기 버튼으로 close 가 emit 된다 (즉시)', async () => {
    wrapper = mount(RegionPicker, {props: {open: true, multiple: false}})
    await flushPromises()
    backBtn().click()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('Dialog 자체 X 버튼으로도 close 가 emit 된다 (drawer 는 퇴장 애니메이션 뒤 emit)', async () => {
    wrapper = mount(RegionPicker, {props: {open: true, multiple: false}})
    await flushPromises()
    closeBtn().click()
    await new Promise((resolve) => setTimeout(resolve, 360))
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})

describe('RegionPicker (기본값)', () => {
  it('multiple prop 을 생략하면 기본값 true — 다중 선택 UI(체크박스/칩/적용하기)가 노출된다', async () => {
    wrapper = mount(RegionPicker, {props: {open: true}})
    await flushPromises()
    provinceBtn('전남').click()
    await flushPromises()
    cityBtn('보성군').click()
    await flushPromises()
    expect(chips()).toHaveLength(1)
    expect(confirmBtn().textContent).toContain('적용하기')
  })
})

describe('RegionPicker (multiple)', () => {
  it('여러 시군구를 토글 선택할 수 있고, 선택 칩이 표시된다', async () => {
    wrapper = mount(RegionPicker, {props: {open: true, multiple: true}})
    await flushPromises()
    provinceBtn('전남').click()
    await flushPromises()
    cityBtn('보성군').click()
    cityBtn('여수시').click()
    await flushPromises()
    expect(chips()).toHaveLength(2)
    expect(document.body.textContent).toContain('보성군')
    expect(document.body.textContent).toContain('여수시')
    expect(confirmBtn().textContent).toContain('적용하기')

    // 다시 클릭하면 선택 해제
    cityBtn('여수시').click()
    await flushPromises()
    expect(chips()).toHaveLength(1)
  })

  it('칩의 X 로 개별 선택을 해제할 수 있다', async () => {
    wrapper = mount(RegionPicker, {
      props: {open: true, multiple: true, modelValue: [{province: '전남', city: '보성군'}]}
    })
    await flushPromises()
    expect(chips()).toHaveLength(1)
    ;(chips()[0]!.querySelector('button') as HTMLButtonElement).click()
    await flushPromises()
    expect(chips()).toHaveLength(0)
    expect(confirmBtn().disabled).toBe(true)
  })

  it('초기화 버튼으로 전체 선택을 지운다', async () => {
    wrapper = mount(RegionPicker, {
      props: {
        open: true,
        multiple: true,
        modelValue: [
          {province: '전남', city: '보성군'},
          {province: '전남', city: '여수시'}
        ]
      }
    })
    await flushPromises()
    expect(chips()).toHaveLength(2)
    resetBtn().click()
    await flushPromises()
    expect(chips()).toHaveLength(0)
    expect(confirmBtn().disabled).toBe(true)
  })

  it('다른 시/도로 이동해도 이전 선택이 유지된다 (시/도 목록에 개수 표시)', async () => {
    wrapper = mount(RegionPicker, {props: {open: true, multiple: true}})
    await flushPromises()
    provinceBtn('전남').click()
    await flushPromises()
    cityBtn('보성군').click()
    await flushPromises()
    provinceBtn('경기').click()
    await flushPromises()
    expect(chips()).toHaveLength(1)
    expect(provinceBtn('전남').textContent).toContain('1')
  })

  it('확정 시 RegionValue[] 로 update:modelValue / confirm 이 emit 된다', async () => {
    wrapper = mount(RegionPicker, {props: {open: true, multiple: true}})
    await flushPromises()
    provinceBtn('전남').click()
    await flushPromises()
    cityBtn('보성군').click()
    cityBtn('여수시').click()
    await flushPromises()
    confirmBtn().click()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([
      [
        {province: '전남', city: '보성군'},
        {province: '전남', city: '여수시'}
      ]
    ])
  })
})
