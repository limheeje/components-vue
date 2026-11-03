import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'
import {h} from 'vue'

import List from '~/components/List/index.vue'
import ListItem from '~/components/ListItem/index.vue'

describe('List', () => {
  it('items + #item slot 으로 렌더한다', () => {
    const wrapper = mount(List, {
      props: {
        items: [
          {id: 1, name: '사과'},
          {id: 2, name: '바나나'}
        ]
      },
      slots: {item: ({item}: {item: {name: string}}) => h(ListItem, {title: item.name})}
    })
    expect(wrapper.find('[role="list"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('사과')
    expect(wrapper.text()).toContain('바나나')
  })

  it('itemClick 이 항목/인덱스와 함께 emit 된다', async () => {
    const wrapper = mount(List, {
      props: {items: [{id: 1, name: '사과'}]},
      slots: {item: ({item}: {item: {name: string}}) => h(ListItem, {title: item.name})}
    })
    await wrapper.find('[role="list"] > *').trigger('click')
    expect(wrapper.emitted('itemClick')?.[0]).toEqual([{id: 1, name: '사과'}, 0])
  })

  it('loading 이면 aria-busy 스켈레톤을 렌더한다', () => {
    const wrapper = mount(List, {props: {loading: true}})
    expect(wrapper.find('[aria-busy="true"]').exists()).toBe(true)
  })

  it('기본 slot 으로 ListItem 을 직접 넣을 수 있다', () => {
    const wrapper = mount(List, {slots: {default: () => h(ListItem, {title: '직접'})}})
    expect(wrapper.text()).toContain('직접')
  })
})
