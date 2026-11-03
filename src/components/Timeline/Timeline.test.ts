import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'

import Timeline from '~/components/Timeline/index.vue'
import type {TimelineItem} from '~/components/Timeline/Timeline.type'

const ITEMS: TimelineItem[] = [
  {title: '주문 완료', description: '접수됨', date: '04.01', status: 'success'},
  {title: '배송 중', status: 'processing'},
  {title: '배송 완료', status: 'gray'}
]

describe('Timeline', () => {
  it('items 를 제목/설명/날짜와 함께 렌더한다', () => {
    const wrapper = mount(Timeline, {props: {items: ITEMS}})
    const t = wrapper.text()
    expect(t).toContain('주문 완료')
    expect(t).toContain('접수됨')
    expect(t).toContain('04.01')
  })

  it('pending 이 true 면 기본 "처리 중..." 노드를 추가한다', () => {
    const wrapper = mount(Timeline, {props: {items: ITEMS, pending: true}})
    expect(wrapper.text()).toContain('처리 중...')
  })

  it('pending 에 텍스트를 주면 그 텍스트를 표시한다', () => {
    const wrapper = mount(Timeline, {props: {items: ITEMS, pending: '조회 중입니다'}})
    expect(wrapper.text()).toContain('조회 중입니다')
  })

  it('direction / color 클래스가 적용된다', () => {
    const wrapper = mount(Timeline, {props: {items: ITEMS, direction: 'horizontal', color: 'success'}})
    const cls = wrapper.element.className
    expect(cls).toMatch(/bsTimelineDirectionHorizontal/)
    expect(cls).toMatch(/bsTimelineColorSuccess/)
  })
})
