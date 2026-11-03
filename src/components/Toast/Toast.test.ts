import {flushPromises, mount} from '@vue/test-utils'
import {afterEach, describe, expect, it} from 'vitest'

import ToastProvider from '~/components/Toast/index.vue'
import {clearToasts, dismissToast, showToast} from '~/components/Toast/Toast.store'

let wrapper: ReturnType<typeof mount> | null = null
afterEach(() => {
  wrapper?.unmount()
  wrapper = null
  clearToasts()
})

describe('Toast', () => {
  it('showToast 로 메시지를 표시한다', async () => {
    wrapper = mount(ToastProvider)
    await flushPromises()
    showToast({message: '저장되었습니다', duration: Infinity})
    await flushPromises()
    expect(document.body.textContent).toContain('저장되었습니다')
  })

  it('dismissible 닫기 버튼으로 제거된다', async () => {
    wrapper = mount(ToastProvider)
    await flushPromises()
    showToast({message: '닫아보기', duration: Infinity, dismissible: true})
    await flushPromises()
    ;(document.body.querySelector('button[aria-label="닫기"]') as HTMLButtonElement).click()
    await flushPromises()
    expect(document.body.textContent).not.toContain('닫아보기')
  })

  it('dismissToast(id) 로 특정 토스트를 닫는다', async () => {
    wrapper = mount(ToastProvider)
    await flushPromises()
    const id = showToast({message: '아이디닫기', duration: Infinity})
    await flushPromises()
    dismissToast(id)
    await flushPromises()
    expect(document.body.textContent).not.toContain('아이디닫기')
  })
})
