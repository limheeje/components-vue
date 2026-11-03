import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'

import ImageUploadPreview from '~/components/ImageUploadPreview/index.vue'

function makeImage(name: string, size: number) {
  const file = new File(['x'], name, {type: 'image/png'})
  Object.defineProperty(file, 'size', {value: size})
  return file
}
function setFiles(input: HTMLInputElement, files: File[]) {
  Object.defineProperty(input, 'files', {value: files, configurable: true})
}

describe('ImageUploadPreview', () => {
  it('그리드 모드에서 추가 카드를 렌더한다', () => {
    const wrapper = mount(ImageUploadPreview, {props: {maxCount: 3}})
    expect(wrapper.text()).toContain('0/3')
  })

  it('drag 모드는 드롭존을 렌더한다', () => {
    const wrapper = mount(ImageUploadPreview, {props: {drag: true}})
    expect(wrapper.text()).toContain('이미지를 드래그하거나 클릭하여 선택')
  })

  it('크기 초과 이미지는 에러 카드로 표시된다', async () => {
    const wrapper = mount(ImageUploadPreview, {props: {maxSize: 50}})
    const input = wrapper.find('input[type="file"]').element as HTMLInputElement
    setFiles(input, [makeImage('big.png', 5000)])
    await wrapper.find('input[type="file"]').trigger('change')
    expect(wrapper.text()).toMatch(/크기 초과/)
  })

  describe('showList=false (이미지 선택 UI 만)', () => {
    const pick = async (w: ReturnType<typeof mount>, files: File[]) => {
      const input = w.find('input[type="file"]')
      setFiles(input.element as HTMLInputElement, files)
      await input.trigger('change')
    }

    it('내장 썸네일을 그리지 않고, 이번에 고른 유효 이미지만 change 로 전달한다 (누적 안 됨)', async () => {
      const w = mount(ImageUploadPreview, {props: {showList: false}})
      await pick(w, [makeImage('a.png', 100), makeImage('b.png', 100)])
      expect(w.findAll('img')).toHaveLength(0)
      expect((w.emitted('change')?.[0] as [File[]])[0].map((f) => f.name)).toEqual(['a.png', 'b.png'])
      await pick(w, [makeImage('c.png', 100)])
      expect((w.emitted('change')?.[1] as [File[]])[0].map((f) => f.name)).toEqual(['c.png'])
    })

    it('크기·개수 초과는 reject 로 전달하고 change 에서 제외한다', async () => {
      const w = mount(ImageUploadPreview, {props: {showList: false, maxCount: 2, maxSize: 50}})
      await pick(w, [makeImage('ok.png', 10), makeImage('big.png', 5000), makeImage('over.png', 10)])
      expect((w.emitted('change')?.[0] as [File[]])[0].map((f) => f.name)).toEqual(['ok.png'])
      const rejected = (w.emitted('reject')?.[0] as [{file: File; message: string}[]])[0]
      expect(rejected.map((r) => r.file.name).sort()).toEqual(['big.png', 'over.png'])
    })

    it('0/max 개수 표시를 숨기고 계속 추가할 수 있다', async () => {
      const w = mount(ImageUploadPreview, {props: {showList: false, maxCount: 1}})
      expect(w.text()).not.toMatch(/\d+\/\d+/)
      await pick(w, [makeImage('a.png', 10)])
      expect(w.find('button').exists()).toBe(true)
    })
  })
})
