<script setup lang="ts">
import {ref} from 'vue'

import Checkbox, {CHECKBOX_SIZE} from '~/components/Checkbox'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['checked', 'disabled', 'indeterminate', 'size', 'label', 'onChange', 'classNames']

const single = ref(true)
const picked = ref<string[]>(['a'])

const AGREE = ['이용약관에 동의합니다', '개인정보 처리방침에 동의합니다', '마케팅 수신에 동의합니다 (선택)']
// 하드코딩 문자열 대신 export 상수(CHECKBOX_SIZE) 키로 관리
const SIZES: (keyof typeof CHECKBOX_SIZE)[] = ['SM', 'MD', 'LG']
const sizeLabel = (s: string) => (s === 'sm' ? 'Small' : s === 'md' ? 'Medium' : 'Large')
</script>

<template>
  <div>
    <PageHeader
      title="Checkbox"
      component="Checkbox"
      desc="— 체크박스 컴포넌트. checked · onChange 를 통해 상태를 제어합니다."
    />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <template v-if="tab === 'checked'">
          <ComponentSection
            title="v-model — 단일 체크박스 (boolean)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import Checkbox from \x27m2m-uiux-vue/Checkbox\x27',
              '',
              'const checked = ref(true)',
              '</script>',
              '',
              '<template>',
              '  <Checkbox v-model=&quot;checked&quot; label=&quot;선택됨&quot; />',
              '</template>'
            ]"
            :notes="['v-model 이 boolean 이면 체크 상태를 그대로 바인딩', 'v-model:checked 도 동일하게 동작']"
          >
            <div class="demo-col">
              <Checkbox v-model="single" label="선택됨" />
              <span class="demo-hint">checked: {{ single }}</span>
            </div>
          </ComponentSection>
          <ComponentSection
            title="v-model — 배열 바인딩 (value 포함 여부)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import Checkbox from \x27m2m-uiux-vue/Checkbox\x27',
              '',
              'const picked = ref([\x27a\x27])',
              '</script>',
              '',
              '<template>',
              '  &lt;!-- v-model 배열에 value 가 있으면 체크됨 --&gt;',
              '  <Checkbox v-model=&quot;picked&quot; value=&quot;a&quot; label=&quot;A&quot; />',
              '  <Checkbox v-model=&quot;picked&quot; value=&quot;b&quot; label=&quot;B&quot; />',
              '  <Checkbox v-model=&quot;picked&quot; value=&quot;c&quot; label=&quot;C&quot; />',
              '</template>'
            ]"
          >
            <div class="demo-col">
              <Checkbox v-model="picked" value="a" label="A" />
              <Checkbox v-model="picked" value="b" label="B" />
              <Checkbox v-model="picked" value="c" label="C" />
              <span class="demo-hint">picked: [{{ picked.join(', ') }}]</span>
            </div>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'disabled'">
          <ComponentSection
            title="disabled={true} — 체크된 상태"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Checkbox from \x27m2m-uiux-vue/Checkbox\x27',
              '</script>',
              '',
              '<template>',
              '  <Checkbox checked disabled label=&quot;비활성 체크&quot; />',
              '</template>'
            ]"
          >
            <Checkbox label="비활성 체크" disabled default-checked />
          </ComponentSection>
          <ComponentSection
            title="disabled={true} — 미체크 상태"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Checkbox from \x27m2m-uiux-vue/Checkbox\x27',
              '</script>',
              '',
              '<template>',
              '  <Checkbox disabled label=&quot;비활성 미체크&quot; />',
              '</template>'
            ]"
          >
            <Checkbox label="비활성 미체크" disabled />
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'indeterminate'"
          title="indeterminate={true}"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Checkbox from \x27m2m-uiux-vue/Checkbox\x27',
            '</script>',
            '',
            '<template>',
            '  <Checkbox indeterminate label=&quot;부분 선택&quot; />',
            '</template>'
          ]"
          :notes="[
            '전체 선택/해제 중간 상태에 사용 (트리 · 테이블 전체선택 등)',
            'DOM 프로퍼티로 반영되며 checked 보다 우선하는 시각 표현'
          ]"
        >
          <Checkbox indeterminate label="부분 선택" />
        </ComponentSection>

        <template v-else-if="tab === 'size'">
          <ComponentSection
            v-for="s in SIZES"
            :key="s"
            :title="`size=&quot;${CHECKBOX_SIZE[s]}&quot;${s === 'MD' ? ' (기본)' : ''}`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import Checkbox, {CHECKBOX_SIZE} from \x27m2m-uiux-vue/Checkbox\x27`,
              '</script>',
              '',
              '<template>',
              `  <Checkbox :size=&quot;CHECKBOX_SIZE[\x27${s}\x27]&quot; checked>${sizeLabel(CHECKBOX_SIZE[s])}</Checkbox>`,
              '</template>'
            ]"
          >
            <Checkbox :size="CHECKBOX_SIZE[s]" default-checked :label="sizeLabel(CHECKBOX_SIZE[s])" />
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'label'">
          <ComponentSection
            title="label — 텍스트 레이블"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Checkbox from \x27m2m-uiux-vue/Checkbox\x27',
              '</script>',
              '',
              '<template>',
              '  <Checkbox checked label=&quot;이용약관에 동의합니다&quot; />',
              '  <Checkbox label=&quot;마케팅 수신에 동의합니다&quot; />',
              '</template>'
            ]"
            :notes="['label 은 문자열 또는 slot 으로 전달 가능']"
          >
            <div class="demo-col">
              <Checkbox v-for="(t, i) in AGREE" :key="t" :label="t" :default-checked="i < 2" />
            </div>
          </ComponentSection>
          <ComponentSection
            title="label 없음 — 아이콘 전용"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Checkbox from \x27m2m-uiux-vue/Checkbox\x27',
              '</script>',
              '',
              '<template>',
              '  <Checkbox checked />',
              '</template>'
            ]"
          >
            <Checkbox default-checked />
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'onChange'"
          title="이벤트 — @change / @input (원본 이벤트)"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import Checkbox from \x27m2m-uiux-vue/Checkbox\x27',
            '',
            'const checked = ref(false)',
            'const onChange = (e) => console.log(e.target.checked) // React 와 동일',
            '</script>',
            '',
            '<template>',
            '  <Checkbox v-model=&quot;checked&quot; @change=&quot;onChange&quot; label=&quot;클릭해보세요&quot; />',
            '</template>'
          ]"
          :notes="[
            '@change · @input 은 네이티브 이벤트(e) 를 그대로 전달 — React onChange(e) 와 1:1',
            'boolean 만 필요하면 @update:checked 또는 v-model 사용'
          ]"
        >
          <Checkbox label="클릭해보세요" />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'classNames'"
          title="classNames — 추가 스타일"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Checkbox from \x27m2m-uiux-vue/Checkbox\x27',
            '</script>',
            '',
            '<template>',
            '  <Checkbox checked class-names=&quot;mt-2&quot; label=&quot;커스텀 스타일&quot; />',
            '</template>'
          ]"
        >
          <Checkbox classNames="demo-hint" default-checked label="커스텀 스타일" />
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
