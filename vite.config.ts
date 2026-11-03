import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

import {bsScopedName} from './vite.shared.ts'

// 라이브러리 진입점: key = 서브패스(m2m-uiux-vue/<key>) = dist 파일명. m2m-uiux-react roster 와 1:1.
const NAMES = [
  'Icon',
  'Grid',
  'Header',
  'Divider',
  'Tabs',
  'Segmented',
  'Breadcrumb',
  'Button',
  'ButtonGroup',
  'Input',
  'Select',
  'Cascader',
  'Checkbox',
  'CheckboxGroup',
  'Radio',
  'RadioGroup',
  'Switch',
  'Textarea',
  'SearchField',
  'DatePicker',
  'TimePicker',
  'FileUpload',
  'UploadedFileList',
  'ImageUploadPreview',
  'Form',
  'Badge',
  'Table',
  'List',
  'ListItem',
  'Accordion',
  'NoData',
  'Timeline',
  'Swiper',
  'Image',
  'ImagePreview',
  'Lightbox',
  'Pagination',
  'Dialog',
  'Toast',
  'Tooltip',
  'Loading',
  'ProgressBar',
  'Steps',
  'Chart',
  'ShareSheet',
  'RegionPicker',
  'Filter'
]

// 번들에 넣지 않고 external 로 두는 일반 dependencies (소비 앱이 자동 설치).
const EXTERNAL_DEPS = ['@unovis/vue', '@unovis/ts', 'd3-', 'd3']

const entries = Object.fromEntries(
  NAMES.map((name) => [name, fileURLToPath(new URL(`./src/components/${name}/index.ts`, import.meta.url))])
)

// CSS Module 클래스명 고정(`bsScopedName`)은 라이브러리 빌드와 데모 빌드가 공유 → vite.shared.ts.

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 데모 코드예시 문자열의 `</script>` 를 스캐너가 SFC script 끝으로 오인해 PARSE_ERROR → 자동 스캔 끄고 직접 지정
  optimizeDeps: {
    noDiscovery: true,
    include: ['vue', '@unovis/vue', '@unovis/ts']
  },
  css: {
    modules: {
      generateScopedName: bsScopedName
    }
  },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    copyPublicDir: false,
    cssCodeSplit: false,
    lib: {
      entry: entries,
      formats: ['es', 'cjs'],
      // 컴포넌트 스타일 + 디자인 토큰(:root) 전부 dist/style.css 하나로 방출.
      cssFileName: 'style',
      fileName: (format, entryName) => (format === 'es' ? `${entryName}.js` : `${entryName}.cjs`)
    },
    rollupOptions: {
      output: {exports: 'named'},
      external: (id) => {
        if (/\.css$/.test(id)) return false
        if (id === 'vue' || id.startsWith('vue/')) return true
        return EXTERNAL_DEPS.some((dep) => id === dep || id.startsWith(`${dep}/`) || id.startsWith(dep))
      }
    }
  }
})
