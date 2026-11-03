import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'

import Table from '~/components/Table/index.vue'
import type {TableColumn} from '~/components/Table/Table.type'

interface Row {
  id: number
  name: string
  role: string
}
const DATA: Row[] = [
  {id: 1, name: '홍길동', role: '개발자'},
  {id: 2, name: '김철수', role: '디자이너'},
  {id: 3, name: '이영희', role: '기획자'}
]
const COLUMNS: TableColumn<Row>[] = [
  {key: 'id', label: 'ID', sortable: true},
  {key: 'name', label: '이름', sortable: true},
  {key: 'role', label: '역할', render: (v) => `[${v}]`}
]

describe('Table', () => {
  it('columns / data 를 렌더하고 render 함수를 적용한다', () => {
    const wrapper = mount(Table, {props: {columns: COLUMNS, data: DATA, rowKey: 'id'}})
    expect(wrapper.text()).toContain('홍길동')
    expect(wrapper.text()).toContain('[개발자]')
    expect(wrapper.findAll('tbody tr')).toHaveLength(3)
  })

  it('emptyText 를 표시한다', () => {
    const wrapper = mount(Table, {props: {columns: COLUMNS, data: [], emptyText: '비었음'}})
    expect(wrapper.text()).toContain('비었음')
  })

  it('sortable 헤더 클릭으로 정렬된다 (asc → desc)', async () => {
    const wrapper = mount(Table, {props: {columns: COLUMNS, data: DATA, rowKey: 'id'}})
    const nameTh = wrapper.findAll('th').find((t) => t.text().includes('이름'))!
    await nameTh.trigger('click')
    expect(wrapper.findAll('tbody tr')[0].text()).toContain('김철수')
    await nameTh.trigger('click')
    expect(wrapper.findAll('tbody tr')[0].text()).toContain('홍길동')
  })

  it('selectable — 헤더 체크박스로 전체 선택 시 selectionChange emit', async () => {
    const wrapper = mount(Table, {props: {columns: COLUMNS, data: DATA, rowKey: 'id', selectable: true}})
    const all = wrapper.find('input[aria-label="전체 선택"]')
    await all.setValue(true)
    expect(wrapper.emitted('selectionChange')?.at(-1)?.[0]).toEqual([1, 2, 3])
  })

  it('headGroups 로 다중 헤더를 렌더한다', () => {
    const wrapper = mount(Table, {
      props: {
        headGroups: [
          [
            {label: '기본', colSpan: 2},
            {label: '기타', rowSpan: 2}
          ],
          [{label: 'ID'}, {label: '이름'}]
        ],
        columns: COLUMNS,
        data: DATA,
        rowKey: 'id'
      }
    })
    expect(wrapper.find('thead').text()).toContain('기본')
  })
})
