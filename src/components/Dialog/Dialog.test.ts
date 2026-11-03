import {defineComponent, h, ref} from 'vue'
import {flushPromises, mount} from '@vue/test-utils'
import {afterEach, describe, expect, it, vi} from 'vitest'

import Dialog from '~/components/Dialog/index.vue'
import DialogProvider from '~/components/Dialog/DialogProvider.vue'
import {alertDialog, closeAllDialogs, confirmDialog} from '~/components/Dialog/Dialog.store'

// jsdom 은 Pointer Capture API 를 구현하지 않음 — 스와이프 제스처 테스트를 위한 최소 스텁.
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = () => {}
  Element.prototype.releasePointerCapture = () => {}
}

const btn = (label: string) =>
  [...document.body.querySelectorAll('button')].find((b) => b.textContent?.trim() === label) ?? null

let wrapper: ReturnType<typeof mount> | null = null
afterEach(() => {
  wrapper?.unmount()
  wrapper = null
  closeAllDialogs()
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
})

describe('Dialog (선언형)', () => {
  it('open=false 면 렌더되지 않는다', async () => {
    wrapper = mount(Dialog, {props: {open: false, title: 't'}})
    await flushPromises()
    expect(document.body.querySelector('[role="dialog"]')).toBeNull()
  })

  it('open=true 면 title / children 을 렌더한다', async () => {
    wrapper = mount(Dialog, {props: {open: true, title: '회원 삭제'}, slots: {default: '본문 내용'}})
    await flushPromises()
    expect(document.body.querySelector('[role="dialog"]')).not.toBeNull()
    expect(document.body.textContent).toContain('회원 삭제')
    expect(document.body.textContent).toContain('본문 내용')
  })

  it('X 버튼 / ESC 로 close 가 emit 된다', async () => {
    const onClose = vi.fn()
    wrapper = mount(Dialog, {props: {open: true, title: 't'}, attrs: {onClose}})
    await flushPromises()
    ;(document.body.querySelector('button[aria-label="닫기"]') as HTMLButtonElement).click()
    expect(onClose).toHaveBeenCalledTimes(1)
    window.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}))
    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it('hideClose 면 X 버튼이 없다', async () => {
    wrapper = mount(Dialog, {props: {open: true, title: 't', hideClose: true}, slots: {default: 'x'}})
    await flushPromises()
    expect(document.body.querySelector('button[aria-label="닫기"]')).toBeNull()
  })

  it('열리면 body 스크롤이 잠기고 닫히면 풀린다', async () => {
    wrapper = mount(Dialog, {props: {open: true, title: 't'}})
    await flushPromises()
    expect(document.body.style.overflow).toBe('hidden')
    await wrapper.setProps({open: false})
    await flushPromises()
    expect(document.body.style.overflow).toBe('')
  })

  it('lockScroll=false 면 body 스크롤을 잠그지 않는다', async () => {
    wrapper = mount(Dialog, {props: {open: true, title: 't', lockScroll: false}})
    await flushPromises()
    expect(document.body.style.overflow).toBe('')
  })

  it('variant="drawer" — variant/direction 클래스가 backdrop 에 붙는다', async () => {
    wrapper = mount(Dialog, {
      props: {open: true, title: 't', variant: 'drawer', direction: 'right'},
      slots: {default: 'x'}
    })
    await flushPromises()
    const backdrop = document.body.querySelector('[role="dialog"]')!.parentElement as HTMLElement
    expect(backdrop.className).toMatch(/bsDialogVariantDrawer/)
    expect(backdrop.className).toMatch(/bsDialogDirectionRight/)
  })

  it('drawer — 헤더를 짧은 거리라도 빠르게(flick) 스와이프하면 닫힌다', async () => {
    const onClose = vi.fn()
    wrapper = mount(Dialog, {
      props: {open: true, title: 't', variant: 'drawer', direction: 'bottom'},
      attrs: {onClose},
      slots: {default: 'x'}
    })
    await flushPromises()
    const panel = document.body.querySelector('[role="dialog"]') as HTMLElement
    Object.defineProperty(panel, 'offsetHeight', {value: 800, configurable: true}) // jsdom 은 레이아웃이 없어 기본 0
    const header = document.body.querySelector('[class*="bsDialogHeader_"]') as HTMLElement

    const dispatch = (type: string, clientY: number, timeStamp: number) => {
      const event = new PointerEvent(type, {clientY, clientX: 0, bubbles: true, cancelable: true})
      Object.defineProperty(event, 'timeStamp', {value: timeStamp})
      header.dispatchEvent(event)
    }

    // closeThreshold(기본 0.45, 패널 800px 기준 360px) 에 한참 못 미치는 짧은 거리(30px)지만, 10ms 만에 이동 → 빠른 flick
    dispatch('pointerdown', 0, 0)
    dispatch('pointermove', 30, 10)
    dispatch('pointerup', 30, 10)
    await new Promise((resolve) => setTimeout(resolve, 350)) // drawer 는 퇴장 애니메이션 뒤 onClose
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('drawer — 느리고 짧은 스와이프(threshold 미달 + flick 아님)는 닫히지 않는다', async () => {
    const onClose = vi.fn()
    wrapper = mount(Dialog, {
      props: {open: true, title: 't', variant: 'drawer', direction: 'bottom'},
      attrs: {onClose},
      slots: {default: 'x'}
    })
    await flushPromises()
    const panel = document.body.querySelector('[role="dialog"]') as HTMLElement
    Object.defineProperty(panel, 'offsetHeight', {value: 800, configurable: true})
    const header = document.body.querySelector('[class*="bsDialogHeader_"]') as HTMLElement

    const dispatch = (type: string, clientY: number, timeStamp: number) => {
      const event = new PointerEvent(type, {clientY, clientX: 0, bubbles: true, cancelable: true})
      Object.defineProperty(event, 'timeStamp', {value: timeStamp})
      header.dispatchEvent(event)
    }

    // 짧은 거리(20px, 패널 800px 기준 2.5%) + 느린 속도(400ms) → threshold 미달, flick 도 아님
    dispatch('pointerdown', 0, 0)
    dispatch('pointermove', 20, 400)
    dispatch('pointerup', 20, 400)
    await new Promise((resolve) => setTimeout(resolve, 350))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('포커스가 패널로 이동하고 닫히면 트리거로 복원된다', async () => {
    const Host = defineComponent({
      setup() {
        const open = ref(false)
        return () => [
          h('button', {onClick: () => (open.value = true)}, '열기'),
          h(Dialog, {open: open.value, title: 't', onClose: () => (open.value = false)}, () => 'x')
        ]
      }
    })
    wrapper = mount(Host, {attachTo: document.body})
    await flushPromises()
    const trigger = [...document.body.querySelectorAll('button')].find(
      (b) => b.textContent === '열기'
    ) as HTMLButtonElement
    trigger.focus()
    trigger.click()
    await flushPromises()
    const panel = document.body.querySelector('[role="dialog"]') as HTMLElement
    expect(document.activeElement).toBe(panel)
    ;(document.body.querySelector('button[aria-label="닫기"]') as HTMLButtonElement).click()
    await flushPromises()
    expect(document.activeElement).toBe(trigger)
  })
})

describe('Dialog (명령형)', () => {
  it('confirmDialog — 확인 시 true, 취소 시 false', async () => {
    wrapper = mount(DialogProvider)
    await flushPromises()

    const p1 = confirmDialog({message: '삭제할까요?', confirmText: '삭제'})
    await flushPromises()
    btn('삭제')!.click()
    expect(await p1).toBe(true)

    const p2 = confirmDialog({message: '삭제할까요?'})
    await flushPromises()
    btn('취소')!.click()
    expect(await p2).toBe(false)
  })

  it('alertDialog — 확인 시 resolve', async () => {
    wrapper = mount(DialogProvider)
    await flushPromises()
    const done = vi.fn()
    alertDialog({message: '저장됨'}).then(done)
    await flushPromises()
    btn('확인')!.click()
    await flushPromises()
    expect(done).toHaveBeenCalled()
  })
})
