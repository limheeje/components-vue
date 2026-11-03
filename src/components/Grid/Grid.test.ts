import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'
import {h} from 'vue'

import Grid from '~/components/Grid/index.vue'
import GridItem from '~/components/Grid/GridItem.vue'

describe('Grid', () => {
  it('display: grid 와 숫자 columns → repeat 트랙을 적용한다', () => {
    const wrapper = mount(Grid, {props: {columns: 3}, slots: {default: () => h('div', 'a')}})
    const el = wrapper.element as HTMLElement
    expect(el.style.display).toBe('grid')
    expect(el.style.gridTemplateColumns).toBe('repeat(3, minmax(0, 1fr))')
  })

  it('문자열 columns 는 그대로 적용된다', () => {
    const wrapper = mount(Grid, {props: {columns: '200px 1fr'}, slots: {default: () => h('div', 'a')}})
    expect((wrapper.element as HTMLElement).style.gridTemplateColumns).toBe('200px 1fr')
  })

  it('gap 숫자는 px 로 적용된다', () => {
    const wrapper = mount(Grid, {props: {gap: 12}, slots: {default: () => h('div', 'a')}})
    expect((wrapper.element as HTMLElement).style.gap).toBe('12px')
  })

  it('rowGap/columnGap 미지정 시 gap shorthand 만 남기고 빈 longhand 를 내보내지 않는다', () => {
    // Vue patchStyle 는 undefined 값을 '' 로 세팅 → 브라우저에서 gap shorthand 가
    // 빈 row-gap/column-gap longhand 에 의해 리셋되던 버그 회귀 방지.
    const wrapper = mount(Grid, {props: {gap: 16}, slots: {default: () => h('div', 'a')}})
    const css = (wrapper.element as HTMLElement).getAttribute('style') ?? ''
    expect(css).toContain('gap: 16px')
    expect(css).not.toMatch(/row-gap|column-gap/)
  })

  it('Grid.Item 의 colSpan / justifySelf 를 적용한다', () => {
    const wrapper = mount(Grid, {
      slots: {default: () => h(GridItem, {colSpan: 2, justifySelf: 'center'}, () => 'x')}
    })
    const item = wrapper.element.firstElementChild as HTMLElement
    expect(item.style.gridColumn).toBe('span 2')
    expect(item.style.justifySelf).toBe('center')
  })

  it('inline 이면 inline-grid', () => {
    const wrapper = mount(Grid, {props: {inline: true}, slots: {default: () => h('div', 'a')}})
    expect((wrapper.element as HTMLElement).style.display).toBe('inline-grid')
  })
})
