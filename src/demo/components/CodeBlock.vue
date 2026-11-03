<script setup lang="ts">
import {computed, ref} from 'vue'

const props = defineProps<{
  /** 코드 문자열 또는 라인 배열 */
  code: string | string[]
}>()

/** 원본 src/components/CodeBlock.tsx 의 하이라이터 이식 (프레임워크 무관) */
function highlightCode(code: string): string {
  let result = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  const tokens: string[] = []
  const ph = (html: string): string => {
    const idx = tokens.length
    tokens.push(html)
    return `\x00${idx}\x00`
  }

  result = result.replace(/(\/\/[^\n]*)/g, (_, m) => ph(`<span class="c-comment">${m}</span>`))
  result = result.replace(/"([^"]*)"/g, (_, inner) => `"${ph(`<span class="c-val">${inner}</span>`)}"`)
  result = result.replace(/\{(true|false|[0-9]+)\}/g, (_, m) => `{${ph(`<span class="c-bool">${m}</span>`)}}`)
  result = result.replace(/\b(import|export|from|const|let|var|return|function|default)\b/g, (_, m) =>
    ph(`<span class="c-kw">${m}</span>`)
  )
  result = result.replace(
    /(&lt;\/?)(div|span|button|input|label|p|ul|li|form|table|tr|td|th|thead|tbody|nav|ol|i)(\s|&gt;)/g,
    (_, a, b, c) => `${a}${ph(`<span class="c-tag">${b}</span>`)}${c}`
  )
  result = result.replace(/(?<=\s)([a-zA-Z][a-zA-Z0-9-]*)(?==)/g, (_, m) => ph(`<span class="c-attr">${m}</span>`))
  result = result.replace(
    /(&lt;\/?)([A-Z][A-Za-z0-9.]+)/g,
    (_, a, b) => `${a}${ph(`<span class="c-comp">${b}</span>`)}`
  )

  result = result.replace(/\x00(\d+)\x00/g, (_, idx) => tokens[Number(idx)])
  return result
}

const lines = computed(() => (Array.isArray(props.code) ? props.code : props.code.split('\n')))
const copied = ref(false)

function handleCopy() {
  navigator.clipboard.writeText(lines.value.join('\n')).catch(() => {})
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<template>
  <div class="demo-code">
    <div class="demo-code__bar">
      <div class="demo-code__meta">
        <span class="demo-code__lang">JSX</span>
        <span class="demo-code__lines">{{ lines.length }} lines</span>
      </div>
      <button type="button" class="demo-code__copy" :data-copied="copied || undefined" @click="handleCopy">
        <svg v-if="copied" width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 13l4 4L19 7"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <svg v-else width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="9" y="9" width="12" height="12" rx="2" stroke="currentColor" stroke-width="2" />
          <path d="M5 15V5a2 2 0 0 1 2-2h10" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        {{ copied ? '복사됨' : '복사' }}
      </button>
    </div>
    <div class="demo-code__body">
      <div v-for="(line, i) in lines" :key="i" class="demo-code__row">
        <span class="demo-code__num">{{ i + 1 }}</span>
        <span class="demo-code__line" v-html="highlightCode(line)" />
      </div>
    </div>
  </div>
</template>
