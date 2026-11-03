import {flushPromises, mount} from '@vue/test-utils'
import {afterEach, describe, expect, it, vi} from 'vitest'

import ShareSheet from '~/components/ShareSheet/index.vue'

let wrapper: ReturnType<typeof mount> | null = null
afterEach(() => {
  wrapper?.unmount()
  wrapper = null
  document.body.style.overflow = ''
  vi.restoreAllMocks()
})

describe('ShareSheet', () => {
  it('open=true 면 title / url / 채널 4개를 렌더한다', async () => {
    wrapper = mount(ShareSheet, {props: {open: true, title: '공유하기', url: 'https://example.com/item/1'}})
    await flushPromises()
    expect(document.body.querySelector('[role="dialog"]')).not.toBeNull()
    expect(document.body.textContent).toContain('공유하기')
    expect(document.body.textContent).toContain('https://example.com/item/1')
    expect(document.body.textContent).toContain('카카오톡')
    expect(document.body.textContent).toContain('페이스북')
    expect(document.body.textContent).toContain('트위터')
    expect(document.body.textContent).toContain('whatsApp')
  })

  it('open=false 면 렌더되지 않는다', async () => {
    wrapper = mount(ShareSheet, {props: {open: false, url: 'https://example.com'}})
    await flushPromises()
    expect(document.body.querySelector('[role="dialog"]')).toBeNull()
  })

  it('링크 복사 버튼 클릭 시 clipboard.writeText 호출 + copy emit', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, {clipboard: {writeText}})
    wrapper = mount(ShareSheet, {props: {open: true, url: 'https://example.com/item/1'}})
    await flushPromises()
    ;(document.body.querySelector('button[aria-label="링크 복사"]') as HTMLButtonElement).click()
    await flushPromises()
    expect(writeText).toHaveBeenCalledWith('https://example.com/item/1')
    expect(wrapper.emitted('copy')?.[0]).toEqual(['https://example.com/item/1'])
  })

  it('채널 클릭 시 share 가 emit 된다 (실제 공유 동작은 소비 앱이 처리 — 컴포넌트는 emit 만)', async () => {
    wrapper = mount(ShareSheet, {
      props: {open: true, url: 'https://example.com/item/1', channels: ['facebook']}
    })
    await flushPromises()
    ;(document.body.querySelector('[class*="bsShareSheetChannel_"]') as HTMLButtonElement).click()
    expect(wrapper.emitted('share')?.[0]).toEqual([{channel: 'facebook', url: 'https://example.com/item/1'}])
  })

  it('X 버튼으로 close 가 emit 된다', async () => {
    wrapper = mount(ShareSheet, {props: {open: true, url: 'https://example.com'}})
    await flushPromises()
    ;(document.body.querySelector('button[aria-label="닫기"]') as HTMLButtonElement).click()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
