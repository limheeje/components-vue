import {flushPromises, mount} from '@vue/test-utils'
import {nextTick} from 'vue'
import {describe, expect, it, vi} from 'vitest'

import Cascader from '~/components/Cascader/index.vue'
import CascaderPanel from '~/components/Cascader/CascaderPanel.vue'
import type {CascaderNode, CascaderOption} from '~/components/Cascader/Cascader.type'

const OPTIONS: CascaderOption[] = [
  {
    value: 'seoul',
    label: '서울',
    children: [
      {value: 'gangnam', label: '강남구'},
      {value: 'seocho', label: '서초구', disabled: true}
    ]
  },
  {
    value: 'gyeonggi',
    label: '경기',
    children: [
      {
        value: 'suwon',
        label: '수원시',
        children: [
          {value: 'yeongtong', label: '영통구'},
          {value: 'paldal', label: '팔달구'}
        ]
      },
      {value: 'goyang', label: '고양시'}
    ]
  },
  {value: 'jeju', label: '제주'}
]

const node = (w: ReturnType<typeof mount>, label: string) =>
  w.findAll('[role^="menuitem"]').find((n) => n.find('span').text() === label || n.text().trim() === label)!
const trigger = (w: ReturnType<typeof mount>) => w.find('[role="combobox"]')

async function openIt(w: ReturnType<typeof mount>) {
  await trigger(w).trigger('click')
}

describe('Cascader', () => {
  it('placeholder 를 표시하고 클릭하면 1단계 메뉴가 열린다', async () => {
    const w = mount(Cascader, {props: {options: OPTIONS, placeholder: '지역'}})
    expect(w.text()).toContain('지역')
    await openIt(w)
    expect(w.findAll('[role="menu"]')).toHaveLength(1)
    expect(w.findAll('[role^="menuitem"]')).toHaveLength(3)
    expect(w.emitted('visibleChange')).toEqual([[true]])
  })

  it('항목 클릭으로 하위 메뉴를 펼치고 leaf 선택 시 경로를 emit 하고 닫힌다', async () => {
    const w = mount(Cascader, {props: {options: OPTIONS}})
    await openIt(w)
    await node(w, '경기').trigger('click')
    expect(w.emitted('expandChange')).toEqual([[['gyeonggi']]])
    expect(w.findAll('[role="menu"]')).toHaveLength(2)
    await node(w, '수원시').trigger('click')
    await node(w, '영통구').trigger('click')
    expect(w.emitted('change')).toEqual([[['gyeonggi', 'suwon', 'yeongtong']]])
    expect(w.emitted('update:modelValue')).toEqual([[['gyeonggi', 'suwon', 'yeongtong']]])
    expect(w.find('[role="menu"]').exists()).toBe(false)
    expect(w.text()).toContain('경기 / 수원시 / 영통구')
  })

  it('modelValue 로 선택 경로를 표시한다 (showAllLevels=false 면 마지막만)', () => {
    const all = mount(Cascader, {props: {options: OPTIONS, modelValue: ['seoul', 'gangnam']}})
    expect(all.text()).toContain('서울 / 강남구')
    const last = mount(Cascader, {
      props: {options: OPTIONS, modelValue: ['seoul', 'gangnam'], showAllLevels: false}
    })
    expect(last.text()).toContain('강남구')
    expect(last.text()).not.toContain('서울')
    const sep = mount(Cascader, {props: {options: OPTIONS, modelValue: ['seoul', 'gangnam'], separator: ' > '}})
    expect(sep.text()).toContain('서울 > 강남구')
  })

  it('비활성 옵션은 선택되지 않고, disabled 컴포넌트는 열리지 않는다', async () => {
    const w = mount(Cascader, {props: {options: OPTIONS}})
    await openIt(w)
    await node(w, '서울').trigger('click')
    await node(w, '서초구').trigger('click')
    expect(w.emitted('change')).toBeUndefined()

    const d = mount(Cascader, {props: {options: OPTIONS, disabled: true}})
    await openIt(d)
    expect(d.find('[role="menu"]').exists()).toBe(false)
  })

  it("expandTrigger='hover' 는 mouseenter 로 펼친다", async () => {
    const w = mount(Cascader, {props: {options: OPTIONS, config: {expandTrigger: 'hover'}}})
    await openIt(w)
    await node(w, '경기').trigger('mouseenter')
    expect(w.findAll('[role="menu"]')).toHaveLength(2)
  })

  it('config 키 매핑(value/label/children/disabled)을 지원한다', async () => {
    const w = mount(Cascader, {
      props: {
        options: [
          {
            id: 'a',
            name: 'A',
            items: [
              {id: 'a1', name: 'A-1'},
              {id: 'a2', name: 'A-2', off: true}
            ]
          }
        ],
        config: {value: 'id', label: 'name', children: 'items', disabled: 'off'}
      }
    })
    await openIt(w)
    await node(w, 'A').trigger('click')
    await node(w, 'A-2').trigger('click')
    expect(w.emitted('change')).toBeUndefined()
    await node(w, 'A-1').trigger('click')
    expect(w.emitted('change')).toEqual([[['a', 'a1']]])
  })

  it('emitPath=false 면 마지막 value 만 emit 한다', async () => {
    const w = mount(Cascader, {props: {options: OPTIONS, config: {emitPath: false}}})
    await openIt(w)
    await node(w, '서울').trigger('click')
    await node(w, '강남구').trigger('click')
    expect(w.emitted('change')).toEqual([['gangnam']])
    const shown = mount(Cascader, {props: {options: OPTIONS, config: {emitPath: false}, modelValue: 'goyang'}})
    expect(shown.text()).toContain('경기 / 고양시')
  })

  it('clearable — 지우기 아이콘으로 값을 비운다', async () => {
    const w = mount(Cascader, {props: {options: OPTIONS, clearable: true, modelValue: ['jeju']}})
    await w.find('[aria-label="지우기"]').trigger('click')
    expect(w.emitted('change')).toEqual([[[]]])
    expect(w.find('[role="menu"]').exists()).toBe(false)
  })

  it('비제어(defaultValue) 로 동작한다', async () => {
    const w = mount(Cascader, {props: {options: OPTIONS, defaultValue: ['jeju']}})
    expect(w.text()).toContain('제주')
    await openIt(w)
    await node(w, '서울').trigger('click')
    await node(w, '강남구').trigger('click')
    expect(w.text()).toContain('서울 / 강남구')
  })

  it('slot 으로 노드 내용을 바꿀 수 있다', async () => {
    const w = mount(Cascader, {
      props: {options: OPTIONS},
      slots: {default: `<template #default="{node}">★{{ node.label }}</template>`}
    })
    await openIt(w)
    expect(w.text()).toContain('★서울')
  })

  it('옵션이 없으면 empty 문구/slot 을 보여준다', async () => {
    const w = mount(Cascader, {props: {options: []}})
    await openIt(w)
    expect(w.text()).toContain('데이터 없음')
    const custom = mount(Cascader, {props: {options: []}, slots: {empty: '비어있어요'}})
    await openIt(custom)
    expect(custom.text()).toContain('비어있어요')
  })

  it('error 문자열은 하단 메시지로, helperText 는 error 없을 때만', () => {
    const w = mount(Cascader, {props: {options: OPTIONS, error: '필수', helperText: '도움'}})
    expect(w.text()).toContain('필수')
    expect(w.text()).not.toContain('도움')
    expect(trigger(w).attributes('aria-invalid')).toBe('true')
  })

  it('class/data 속성이 루트로 전달된다', () => {
    const w = mount(Cascader, {props: {options: OPTIONS}, attrs: {'data-x': '1', class: 'custom'}})
    expect(w.attributes('data-x')).toBe('1')
    expect(w.classes()).toContain('custom')
  })

  it('Esc 로 닫고, ↓ 로 열린다', async () => {
    const w = mount(Cascader, {props: {options: OPTIONS}})
    await trigger(w).trigger('keydown', {key: 'ArrowDown'})
    expect(w.find('[role="menu"]').exists()).toBe(true)
    await trigger(w).trigger('keydown', {key: 'Escape'})
    expect(w.find('[role="menu"]').exists()).toBe(false)
  })

  it('키보드로 이동·진입·선택할 수 있다', async () => {
    const w = mount(Cascader, {props: {options: OPTIONS}})
    await trigger(w).trigger('keydown', {key: 'Enter'})
    await trigger(w).trigger('keydown', {key: 'ArrowDown'}) // 서울
    await trigger(w).trigger('keydown', {key: 'ArrowRight'}) // → 강남구
    await trigger(w).trigger('keydown', {key: 'Enter'})
    await flushPromises()
    expect(w.emitted('change')).toEqual([[['seoul', 'gangnam']]])
  })

  describe('multiple', () => {
    const config = {multiple: true}

    it('leaf 를 체크하면 경로 배열의 배열을 emit 하고 닫히지 않는다', async () => {
      const w = mount(Cascader, {props: {options: OPTIONS, config}})
      await openIt(w)
      await node(w, '서울').trigger('click')
      await node(w, '강남구').trigger('click')
      expect(w.emitted('change')).toEqual([[[['seoul', 'gangnam']]]])
      expect(w.find('[role="menu"]').exists()).toBe(true)
    })

    it('부모 체크 시 활성 leaf 전부 선택, 해제 시 모두 해제', async () => {
      const w = mount(Cascader, {props: {options: OPTIONS, config}})
      await openIt(w)
      await node(w, '경기').trigger('click')
      await node(w, '경기').find('input').trigger('change')
      await flushPromises()
      expect(w.emitted('change')?.[0]).toEqual([
        [
          ['gyeonggi', 'suwon', 'yeongtong'],
          ['gyeonggi', 'suwon', 'paldal'],
          ['gyeonggi', 'goyang']
        ]
      ])
      await node(w, '경기').find('input').trigger('change')
      await flushPromises()
      expect(w.emitted('change')?.[1]).toEqual([[]])
    })

    it('일부만 선택되면 부모가 반선택(aria-checked=false + indeterminate 클래스)', async () => {
      const w = mount(Cascader, {
        props: {options: OPTIONS, config, modelValue: [['gyeonggi', 'goyang']]}
      })
      await openIt(w)
      expect(node(w, '경기').find('[class*="is-indeterminate"]').exists()).toBe(true)
    })

    it('태그 표시·제거, collapseTags 는 첫 개 + N', async () => {
      const value = [['seoul', 'gangnam'], ['jeju'].concat(), ['gyeonggi', 'goyang']]
      const w = mount(Cascader, {props: {options: OPTIONS, config, modelValue: value}})
      expect(w.text()).toContain('서울 / 강남구')
      expect(w.text()).toContain('제주')
      await w.find('[aria-label="서울 / 강남구 제거"]').trigger('click')
      expect(w.emitted('removeTag')).toEqual([[['seoul', 'gangnam']]])
      expect(w.emitted('change')?.[0]).toEqual([[['jeju'], ['gyeonggi', 'goyang']]])

      const c = mount(Cascader, {props: {options: OPTIONS, config, modelValue: value, collapseTags: true}})
      expect(c.text()).toContain('+ 2')
      expect(c.text()).not.toContain('제주')
    })

    it('getCheckedNodes(leafOnly)', () => {
      const w = mount(Cascader, {
        props: {
          options: OPTIONS,
          config,
          modelValue: [
            ['gyeonggi', 'suwon', 'yeongtong'],
            ['gyeonggi', 'suwon', 'paldal']
          ]
        }
      })
      const vm = w.vm as unknown as {getCheckedNodes: (leaf?: boolean) => CascaderNode[]}
      expect(vm.getCheckedNodes(true).map((n) => n.label)).toEqual(['영통구', '팔달구'])
      // 수원시(모든 leaf 선택) 도 포함
      expect(vm.getCheckedNodes().map((n) => n.label)).toEqual(['수원시', '영통구', '팔달구'])
    })
  })

  describe('checkStrictly', () => {
    it('단일: 라디오로 부모 레벨도 선택할 수 있다', async () => {
      const w = mount(Cascader, {props: {options: OPTIONS, config: {checkStrictly: true}}})
      await openIt(w)
      await node(w, '경기').find('input').trigger('change')
      expect(w.emitted('change')).toEqual([[['gyeonggi']]])
      expect(w.find('[role="menu"]').exists()).toBe(false)
    })

    it('다중: 부모/자식이 서로 독립', async () => {
      const w = mount(Cascader, {props: {options: OPTIONS, config: {checkStrictly: true, multiple: true}}})
      await openIt(w)
      await node(w, '경기').find('input').trigger('change')
      expect(w.emitted('change')?.[0]).toEqual([[['gyeonggi']]])
    })

    it('부모가 disabled 여도 자식은 개별 활성', async () => {
      const w = mount(Cascader, {
        props: {
          options: [{value: 'p', label: 'P', disabled: true, children: [{value: 'c', label: 'C'}]}],
          config: {checkStrictly: true}
        }
      })
      await openIt(w)
      await node(w, 'P').trigger('click') // disabled → 펼쳐지지 않음
      expect(w.findAll('[role="menu"]')).toHaveLength(1)
    })
  })

  describe('lazy', () => {
    it('루트/하위를 lazyLoad 로 가져오고, 빈 결과는 leaf 처리한다', async () => {
      const lazyLoad = vi.fn((n: CascaderNode, resolve: (d?: CascaderOption[]) => void) => {
        if (n.level === 0) resolve([{value: 'a', label: 'A'}])
        else if (n.level === 1)
          resolve([
            {value: 'a1', label: 'A-1'},
            {value: 'a2', label: 'A-2', leaf: true}
          ])
        else resolve([])
      })
      const w = mount(Cascader, {props: {config: {lazy: true, lazyLoad}}})
      await openIt(w)
      expect(lazyLoad.mock.calls[0]?.[0].level).toBe(0)
      expect(node(w, 'A')).toBeTruthy()
      await node(w, 'A').trigger('click')
      await flushPromises()
      expect(w.findAll('[role="menu"]')).toHaveLength(2)
      await node(w, 'A-1').trigger('click') // 빈 결과 → leaf
      await flushPromises()
      await node(w, 'A-1').trigger('click')
      expect(w.emitted('change')).toEqual([[['a', 'a1']]])
    })

    it('modelValue 경로가 아직 로드 전이어도 순차 로딩해 라벨을 표시한다', async () => {
      const lazyLoad = (n: CascaderNode, resolve: (d?: CascaderOption[]) => void) => {
        if (n.level === 0) resolve([{value: 'a', label: 'A'}])
        else if (n.value === 'a') resolve([{value: 'a1', label: 'A-1', leaf: true}])
        else resolve([])
      }
      const w = mount(Cascader, {props: {config: {lazy: true, lazyLoad}, modelValue: ['a', 'a1']}})
      await flushPromises()
      expect(w.text()).toContain('A / A-1')
    })
  })

  describe('filterable', () => {
    it('입력 후 debounce 뒤 전체 경로 결과가 나오고 선택된다', async () => {
      vi.useFakeTimers()
      const w = mount(Cascader, {props: {options: OPTIONS, filterable: true, debounce: 100}})
      await openIt(w)
      await w.find('input').setValue('영통')
      await vi.advanceTimersByTimeAsync(150)
      const items = w.findAll('[role="option"]')
      expect(items).toHaveLength(1)
      expect(items[0]!.text()).toBe('경기 / 수원시 / 영통구')
      await items[0]!.trigger('click')
      expect(w.emitted('change')).toEqual([[['gyeonggi', 'suwon', 'yeongtong']]])
      vi.useRealTimers()
    })

    it('결과가 없으면 안내 문구, beforeFilter 가 false 면 검색하지 않는다', async () => {
      vi.useFakeTimers()
      const w = mount(Cascader, {props: {options: OPTIONS, filterable: true, debounce: 10}})
      await openIt(w)
      await w.find('input').setValue('zzz')
      await vi.advanceTimersByTimeAsync(50)
      expect(w.text()).toContain('일치하는 데이터가 없습니다')

      const blocked = mount(Cascader, {
        props: {options: OPTIONS, filterable: true, debounce: 10, beforeFilter: () => false}
      })
      await openIt(blocked)
      await blocked.find('input').setValue('영통')
      await vi.advanceTimersByTimeAsync(50)
      expect(blocked.findAll('[role="option"]')).toHaveLength(0)
      expect(blocked.findAll('[role="menu"]').length).toBe(1)
      vi.useRealTimers()
    })

    it('filterMethod 로 매칭을 바꿀 수 있다', async () => {
      vi.useFakeTimers()
      const w = mount(Cascader, {
        props: {
          options: OPTIONS,
          filterable: true,
          debounce: 10,
          filterMethod: (n: CascaderNode, k: string) => String(n.value).includes(k)
        }
      })
      await openIt(w)
      await w.find('input').setValue('goy')
      await vi.advanceTimersByTimeAsync(50)
      expect(w.findAll('[role="option"]').map((o) => o.text())).toEqual(['경기 / 고양시'])
      vi.useRealTimers()
    })
  })

  it('focus / blur 이벤트를 emit 한다', async () => {
    const w = mount(Cascader, {props: {options: OPTIONS}, attachTo: document.body})
    await trigger(w).trigger('focusin')
    expect(w.emitted('focus')).toHaveLength(1)
    await w.trigger('focusout', {relatedTarget: null})
    expect(w.emitted('blur')).toHaveLength(1)
    w.unmount()
  })
})

describe('CascaderPanel', () => {
  it('드롭다운 없이 단독으로 선택/emit 된다', async () => {
    const w = mount(CascaderPanel, {props: {options: OPTIONS}})
    expect(w.findAll('[role="menu"]')).toHaveLength(1)
    await node(w, '서울').trigger('click')
    await node(w, '강남구').trigger('click')
    expect(w.emitted('update:modelValue')).toEqual([[['seoul', 'gangnam']]])
    expect(w.emitted('change')).toEqual([[['seoul', 'gangnam']]])
  })

  it('modelValue 의 경로가 펼쳐진 상태로 시작한다', async () => {
    const w = mount(CascaderPanel, {props: {options: OPTIONS, modelValue: ['gyeonggi', 'suwon', 'paldal']}})
    await nextTick()
    expect(w.findAll('[role="menu"]')).toHaveLength(3)
  })
})
