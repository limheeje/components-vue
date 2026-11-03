import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'

import UploadedFileList from '~/components/UploadedFileList/index.vue'
import {isImageFile, thumbnailOf} from '~/components/UploadedFileList/UploadedFileList.util'
import type {UploadedFile} from '~/components/UploadedFileList/UploadedFileList.type'

const FILES: UploadedFile[] = [
  {name: 'a.png', url: 'https://cdn/files/a.png', size: 2048},
  {name: 'b.pdf', url: 'https://cdn/files/b.pdf', size: 100}
]

const removeBtn = (w: ReturnType<typeof mount>, name: string) =>
  w.findAll('button').find((b) => b.attributes('aria-label') === `${name} 삭제`)!

describe('UploadedFileList util', () => {
  it('type · 확장자 · data:image · 썸네일 경로로 이미지 여부를 판단한다', () => {
    expect(isImageFile({name: 'x', url: 'https://c/x.webp?v=1'})).toBe(true)
    expect(isImageFile({name: 'x', url: 'https://c/x.pdf'})).toBe(false)
    expect(isImageFile({name: 'x', url: 'https://c/files/123'})).toBe(true) // 확장자 없음 → 시도
    expect(isImageFile({name: 'x', url: 'https://c/x.bin', type: 'image/png'})).toBe(true)
    expect(isImageFile({name: 'x', url: 'https://c/x.png', type: 'application/pdf'})).toBe(false)
    expect(isImageFile({name: 'x', url: 'data:image/svg+xml;utf8,%3Csvg%3E'})).toBe(true)
    expect(isImageFile({name: 'x'})).toBe(false)
  })

  it('thumbnailUrl 이 있으면 그것을 우선한다', () => {
    expect(thumbnailOf({name: 'a', url: 'https://c/a.png', thumbnailUrl: 'https://c/t/a.png'})).toBe(
      'https://c/t/a.png'
    )
    expect(thumbnailOf({name: 'a', url: 'https://c/a.png'})).toBe('https://c/a.png')
    expect(thumbnailOf({name: 'a', url: 'https://c/a.pdf'})).toBeUndefined()
  })
})

describe('UploadedFileList', () => {
  it('목록이 비어 있으면 아무것도 렌더하지 않는다', () => {
    const w = mount(UploadedFileList, {props: {modelValue: []}})
    expect(w.find('ul').exists()).toBe(false)
  })

  it('서버 url 로 썸네일을 표시하고 이미지가 아니면 아이콘을 쓴다', () => {
    const w = mount(UploadedFileList, {props: {modelValue: FILES}})
    const imgs = w.findAll('img')
    expect(imgs).toHaveLength(1)
    expect(imgs[0]!.attributes('src')).toBe('https://cdn/files/a.png')
    expect(w.text()).toContain('a.png')
    expect(w.text()).toContain('2.0 KB')
    expect(w.text()).toContain('b.pdf')
  })

  it('thumbnailUrl 이 있으면 썸네일에 사용한다', () => {
    const w = mount(UploadedFileList, {
      props: {modelValue: [{name: 'a.png', url: 'https://cdn/a.png', thumbnailUrl: 'https://cdn/t/a.png'}]}
    })
    expect(w.find('img').attributes('src')).toBe('https://cdn/t/a.png')
  })

  it('삭제하면 update:modelValue 와 remove 가 emit 된다', async () => {
    const w = mount(UploadedFileList, {props: {modelValue: FILES}})
    await removeBtn(w, 'a.png').trigger('click')
    expect(w.emitted('update:modelValue')).toEqual([[[FILES[1]]]])
    expect(w.emitted('remove')).toEqual([[FILES[0], 0]])
  })

  it('removable=false 면 삭제 버튼이 없다', () => {
    const w = mount(UploadedFileList, {props: {modelValue: FILES, removable: false}})
    expect(w.findAll('button')).toHaveLength(0)
  })

  it('status: uploading / error 를 표시한다', () => {
    const w = mount(UploadedFileList, {
      props: {
        modelValue: [
          {name: 'up.png', status: 'uploading'},
          {name: 'bad.png', status: 'error', errorMessage: '서버 오류 (500)'},
          {name: 'bad2.png', status: 'error'}
        ]
      }
    })
    expect(w.text()).toContain('업로드 중')
    expect(w.text()).toContain('서버 오류 (500)')
    expect(w.text()).toContain('업로드 실패')
    expect(w.findAll('img')).toHaveLength(0) // url 이 없으면 썸네일 없음
  })

  it('url 이 채워지면 썸네일로 바뀐다 (업로드 완료)', async () => {
    const w = mount(UploadedFileList, {props: {modelValue: [{name: 'a.png', id: 1, status: 'uploading'}]}})
    expect(w.find('img').exists()).toBe(false)
    await w.setProps({modelValue: [{name: 'a.png', id: 1, url: 'https://cdn/a.png'}]})
    expect(w.find('img').attributes('src')).toBe('https://cdn/a.png')
    expect(w.text()).not.toContain('업로드 중')
  })

  it('서버 이미지 로딩에 실패하면 파일 아이콘으로 대체된다', async () => {
    const w = mount(UploadedFileList, {props: {modelValue: [{name: 'a.png', url: 'https://cdn/broken.png'}]}})
    await w.find('img').trigger('error')
    expect(w.find('img').exists()).toBe(false)
  })

  it('썸네일을 누르면 큰 미리보기(Lightbox)가 열리고, preview=false 면 열리지 않는다', async () => {
    const w = mount(UploadedFileList, {props: {modelValue: FILES}, attachTo: document.body})
    await w.find('img').trigger('click')
    expect(document.body.querySelector('[role="dialog"]')).not.toBeNull()
    w.unmount()

    const off = mount(UploadedFileList, {props: {modelValue: FILES, preview: false}, attachTo: document.body})
    await off.find('img').trigger('click')
    expect(document.body.querySelector('[role="dialog"]')).toBeNull()
    off.unmount()
  })

  it('class/data 속성이 목록 루트로 전달된다', () => {
    const w = mount(UploadedFileList, {props: {modelValue: FILES}, attrs: {'data-x': '1'}})
    expect(w.find('ul').attributes('data-x')).toBe('1')
  })
})
