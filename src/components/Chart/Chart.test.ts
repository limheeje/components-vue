import {mount} from '@vue/test-utils'
import {describe, expect, it, vi} from 'vitest'
import {defineComponent, h} from 'vue'

// @unovis/vue 는 D3 무거운 ESM → 테스트에선 스텁 (실렌더는 스크린샷으로 검증)
vi.mock('@unovis/vue', () => {
  const stub = (name: string) =>
    defineComponent({
      name,
      setup:
        (_p, {slots}) =>
        () =>
          h('div', {class: name}, slots.default?.())
    })
  return {
    VisXYContainer: stub('VisXYContainer'),
    VisSingleContainer: stub('VisSingleContainer'),
    VisLine: stub('VisLine'),
    VisArea: stub('VisArea'),
    VisAxis: stub('VisAxis'),
    VisGroupedBar: stub('VisGroupedBar'),
    VisStackedBar: stub('VisStackedBar'),
    VisScatter: stub('VisScatter'),
    VisDonut: stub('VisDonut'),
    VisCrosshair: stub('VisCrosshair'),
    VisTooltip: stub('VisTooltip'),
    VisBulletLegend: defineComponent({
      name: 'VisBulletLegend',
      props: {items: {type: Array, default: () => []}},
      setup: (p) => () =>
        h(
          'div',
          {class: 'legend'},
          (p.items as {name: string}[]).map((i) => h('span', i.name))
        )
    }),
    VisDonutSelectors: {segment: '.segment'}
  }
})

import Chart from '~/components/Chart/index.vue'

const DATA = [
  {month: '1월', 방문자: 4200, 매출: 1800},
  {month: '2월', 방문자: 3800, 매출: 1540},
  {month: '3월', 방문자: 5100, 매출: 2210}
]

describe('Chart', () => {
  it('line — 루트 컨테이너를 렌더한다', () => {
    const wrapper = mount(Chart, {props: {type: 'line', data: DATA, xKey: 'month', series: ['방문자', '매출']}})
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.find('.VisXYContainer').exists()).toBe(true)
  })

  it('radar — 자체 SVG 폴리곤을 렌더한다', () => {
    const wrapper = mount(Chart, {props: {type: 'radar', data: DATA, xKey: 'month', series: ['방문자', '매출']}})
    expect(wrapper.find('svg polygon').exists()).toBe(true)
  })

  it('showLegend 면 범례 항목명을 표시한다', () => {
    const wrapper = mount(Chart, {props: {type: 'bar', data: DATA, xKey: 'month', series: ['방문자']}})
    expect(wrapper.find('.legend').text()).toContain('방문자')
  })
})
