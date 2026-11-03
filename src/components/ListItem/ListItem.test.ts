import {mount} from '@vue/test-utils'
import {describe, expect, it, vi} from 'vitest'
import {h} from 'vue'

import ListItem from '~/components/ListItem/index.vue'

describe('ListItem', () => {
  it('title / description / extra 를 렌더한다', () => {
    const wrapper = mount(ListItem, {
      props: {title: '제목', description: '설명'},
      slots: {extra: () => h('span', '부가')}
    })
    const t = wrapper.text()
    expect(t).toContain('제목')
    expect(t).toContain('설명')
    expect(t).toContain('부가')
  })

  it('clickable 이면 role="button" 이고 클릭이 동작한다', async () => {
    const onClick = vi.fn()
    const wrapper = mount(ListItem, {props: {title: '클릭', clickable: true}, attrs: {onClick}})
    const el = wrapper.get('[role="button"]')
    expect(el.attributes('tabindex')).toBe('0')
    await el.trigger('click')
    expect(onClick).toHaveBeenCalled()
  })

  it('clickable 이 아니면 role 이 없다', () => {
    const wrapper = mount(ListItem, {props: {title: '일반'}})
    expect(wrapper.find('[role="button"]').exists()).toBe(false)
  })
})
