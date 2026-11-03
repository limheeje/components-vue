import {fileURLToPath} from 'node:url'
import {mergeConfig, defineConfig, configDefaults} from 'vitest/config'
import viteConfig from './vite.config.ts'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      // 컴포넌트별 <Name>.test.ts 포팅 전까지 빈 상태 허용 (CI 통과용)
      passWithNoTests: true,
      // @vue/test-utils 를 인라인 처리 (SSR/ESM 중복 로드로 "reading 'config'" 나던 것 방지)
      server: {deps: {inline: ['@vue/test-utils']}},
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url))
    }
  })
)
