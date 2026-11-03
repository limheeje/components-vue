import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'

import FileUpload from '~/components/FileUpload/index.vue'
import {formatFileSize} from '~/components/FileUpload/FileUpload.util'

function makeFile(name: string, size: number, type = 'text/plain') {
  const file = new File(['x'], name, {type})
  Object.defineProperty(file, 'size', {value: size})
  return file
}

function setFiles(input: HTMLInputElement, files: File[]) {
  Object.defineProperty(input, 'files', {value: files, configurable: true})
}

describe('formatFileSize', () => {
  it('B / KB / MB 로 변환한다', () => {
    expect(formatFileSize(512)).toBe('512 B')
    expect(formatFileSize(2048)).toBe('2.0 KB')
    expect(formatFileSize(3 * 1024 * 1024)).toBe('3.0 MB')
  })
})

describe('FileUpload', () => {
  it('버튼 모드로 렌더된다', () => {
    const wrapper = mount(FileUpload)
    expect(wrapper.find('button').text()).toMatch(/파일 선택/)
  })

  it('drag 모드는 드롭존을 렌더한다', () => {
    const wrapper = mount(FileUpload, {props: {drag: true}})
    expect(wrapper.text()).toContain('파일을 드래그하거나 클릭하여 선택')
  })

  it('파일 선택 시 목록과 change 가 반영된다', async () => {
    const wrapper = mount(FileUpload, {props: {multiple: true}})
    const input = wrapper.find('input[type="file"]').element as HTMLInputElement
    setFiles(input, [makeFile('a.txt', 100)])
    await wrapper.find('input[type="file"]').trigger('change')
    expect(wrapper.text()).toContain('a.txt')
    const last = wrapper.emitted('change')?.at(-1) as [File[]]
    expect(last[0][0]).toBeInstanceOf(File)
  })

  it('maxSize 초과 파일은 에러 상태로 표시된다', async () => {
    const wrapper = mount(FileUpload, {props: {multiple: true, maxSize: 50}})
    const input = wrapper.find('input[type="file"]').element as HTMLInputElement
    setFiles(input, [makeFile('big.txt', 5000)])
    await wrapper.find('input[type="file"]').trigger('change')
    expect(wrapper.text()).toMatch(/파일 크기 초과/)
  })

  it('삭제 버튼으로 항목이 제거된다', async () => {
    const wrapper = mount(FileUpload, {props: {multiple: true}})
    const input = wrapper.find('input[type="file"]').element as HTMLInputElement
    setFiles(input, [makeFile('a.txt', 100)])
    await wrapper.find('input[type="file"]').trigger('change')
    const del = wrapper.findAll('button').find((b) => b.attributes('aria-label') === 'a.txt 삭제')!
    await del.trigger('click')
    expect(wrapper.text()).not.toContain('a.txt')
  })

  describe('showList=false (파일 선택 UI 만)', () => {
    const pick = async (w: ReturnType<typeof mount>, files: File[]) => {
      const input = w.find('input[type="file"]')
      setFiles(input.element as HTMLInputElement, files)
      await input.trigger('change')
    }

    it('내장 목록을 렌더하지 않고, 이번에 고른 유효 파일만 change 로 전달한다', async () => {
      const w = mount(FileUpload, {props: {multiple: true, showList: false}})
      await pick(w, [makeFile('a.txt', 100), makeFile('b.txt', 100)])
      expect(w.find('ul').exists()).toBe(false)
      expect((w.emitted('change')?.[0] as [File[]])[0].map((f) => f.name)).toEqual(['a.txt', 'b.txt'])
      // 상태를 갖지 않으므로 다시 골라도 누적되지 않는다
      await pick(w, [makeFile('c.txt', 100)])
      expect((w.emitted('change')?.[1] as [File[]])[0].map((f) => f.name)).toEqual(['c.txt'])
    })

    it('크기 초과·개수 초과 파일은 reject 로 전달하고 change 에서 제외한다', async () => {
      const w = mount(FileUpload, {props: {multiple: true, maxCount: 2, maxSize: 50, showList: false}})
      await pick(w, [makeFile('ok.txt', 10), makeFile('big.txt', 5000), makeFile('over.txt', 10)])
      expect((w.emitted('change')?.[0] as [File[]])[0].map((f) => f.name)).toEqual(['ok.txt'])
      const rejected = (w.emitted('reject')?.[0] as [{file: File; message: string}[]])[0]
      expect(rejected.map((r) => r.file.name).sort()).toEqual(['big.txt', 'over.txt'])
      expect(rejected.find((r) => r.file.name === 'big.txt')!.message).toMatch(/파일 크기 초과/)
    })

    it('버튼에 (n/max) 개수를 표시하지 않고, 계속 선택할 수 있다', async () => {
      const w = mount(FileUpload, {props: {multiple: true, maxCount: 1, showList: false}})
      expect(w.find('button').text()).not.toMatch(/\(\d+\/\d+\)/)
      await pick(w, [makeFile('a.txt', 10)])
      expect(w.find('button').attributes('disabled')).toBeUndefined()
    })

    it('기본(showList=true)은 기존처럼 목록을 보여준다', async () => {
      const w = mount(FileUpload, {props: {multiple: true}})
      await pick(w, [makeFile('a.txt', 10)])
      expect(w.find('ul').exists()).toBe(true)
    })
  })
})
