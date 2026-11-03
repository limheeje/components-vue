import {globalIgnores} from 'eslint/config'
import {defineConfigWithVueTs, vueTsConfigs} from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginVitest from '@vitest/eslint-plugin'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}']
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/*.test.*']
  },
  eslintPluginPrettierRecommended,

  {
    rules: {
      'prettier/prettier': [
        'error',
        {
          semi: false,
          singleQuote: true,
          arrowParens: 'always',
          bracketSpacing: false,
          endOfLine: 'auto',
          'jsxBracketSameLine ': false,
          printWidth: 120,
          proseWrap: 'preserve',
          tabWidth: 2,
          trailingComma: 'none',
          useTabs: false
        }
      ],
      'generator-star-spacing': 'off',
      'import/no-mutable-exports': 'off',
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-unused-vars': 'off',
      'no-control-regex': 'off',
      'vue/no-v-html': 'off',
      'vue/require-prop-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'all',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      'vue/no-v-text-v-html-on-component': 'off', //v-html 허용
      'vue/multi-word-component-names': 'off' //일단 끔 해당프로젝트는 index로만 불러옴
    }
  }
)
