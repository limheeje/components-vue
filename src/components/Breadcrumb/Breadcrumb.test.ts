import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'

import Breadcrumb from '~/components/Breadcrumb/index.vue'

const ITEMS = [{label: '홈', href: '/'}, {label: '게시판', href: '/board'}, {label: '글 상세'}]

describe('Breadcrumb', () => {
  it('nav + 항목들을 렌더한다', () => {
    const wrapper = mount(Breadcrumb, {props: {items: ITEMS}})
    expect(wrapper.find('nav').exists()).toBe(true)
    expect(wrapper.findAll('a').some((a) => a.text() === '홈')).toBe(true)
  })

  it('마지막 항목은 aria-current="page"', () => {
    const wrapper = mount(Breadcrumb, {props: {items: ITEMS}})
    expect(wrapper.find('[aria-current="page"]').text()).toContain('글 상세')
  })

  it('maxItems 초과 시 축약(…)이 나타난다', () => {
    const wrapper = mount(Breadcrumb, {
      props: {
        items: [
          {label: 'A', href: '/a'},
          {label: 'B', href: '/b'},
          {label: 'C', href: '/c'},
          {label: 'D', href: '/d'},
          {label: 'E'}
        ],
        maxItems: 3
      }
    })
    expect(wrapper.text()).toContain('…')
  })
})
