<script setup lang="ts">
import {ref} from 'vue'

import Textarea from '~/components/Textarea'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['rows', 'disabled', 'error', 'resize', 'maxLength', 'placeholder', 'onChange', 'classNames']
const wrap = 'max-width:320px'
const value = ref('')
</script>

<template>
  <div>
    <PageHeader title="Textarea" component="Textarea" desc="— 여러 줄 텍스트 입력 컴포넌트." />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <template v-if="tab === 'rows'">
          <ComponentSection
            v-for="r in [3, 5, 10]"
            :key="r"
            :title="`rows={${r}}${r === 3 ? ' (기본)' : ''}`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Textarea from \x27m2m-uiux-vue/Textarea\x27',
              '<\/script>',
              '',
              '<template>',
              `  <Textarea :rows=&quot;${r}&quot; placeholder=&quot;내용을 입력해주세요&quot; />`,
              '</template>'
            ]"
          >
            <div :style="wrap"><Textarea :rows="r" placeholder="내용을 입력해주세요" /></div>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'disabled'">
          <ComponentSection
            title="disabled={true}"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Textarea from \x27m2m-uiux-vue/Textarea\x27',
              '<\/script>',
              '',
              '<template>',
              '  <Textarea disabled placeholder=&quot;비활성 상태&quot; />',
              '</template>'
            ]"
          >
            <div :style="wrap"><Textarea disabled :rows="3" placeholder="비활성 상태" /></div>
          </ComponentSection>
          <ComponentSection
            title="disabled — 값이 있는 경우"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Textarea from \x27m2m-uiux-vue/Textarea\x27',
              '<\/script>',
              '',
              '<template>',
              '  <Textarea disabled value=&quot;읽기 전용 텍스트&quot; />',
              '</template>'
            ]"
          >
            <div :style="wrap">
              <Textarea disabled :rows="3" :default-value="'읽기 전용 텍스트\n수정할 수 없습니다.'" />
            </div>
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'error'"
          title="error / helperText"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Textarea from \x27m2m-uiux-vue/Textarea\x27',
            '<\/script>',
            '',
            '<template>',
            '  <Textarea error=&quot;내용을 입력해주세요.&quot; />',
            '</template>'
          ]"
          :notes="['error 에 문자열을 주면 컨트롤 하단에 메시지 표시', 'error 가 없을 때만 helperText 표시']"
        >
          <div class="demo-col" :style="wrap">
            <Textarea error="내용을 입력해주세요." :rows="3" />
            <Textarea helper-text="최대 200자" :rows="3" placeholder="소개" />
          </div>
        </ComponentSection>

        <template v-else-if="tab === 'resize'">
          <ComponentSection
            title="resize={true} (기본)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Textarea from \x27m2m-uiux-vue/Textarea\x27',
              '<\/script>',
              '',
              '<template>',
              '  <Textarea :resize=&quot;true&quot; />',
              '</template>'
            ]"
            :notes="['사용자가 우하단 핸들을 드래그해 높이 조절 가능']"
          >
            <div :style="wrap"><Textarea resize :rows="3" placeholder="드래그로 높이 조절 가능" /></div>
          </ComponentSection>
          <ComponentSection
            title="resize={false}"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Textarea from \x27m2m-uiux-vue/Textarea\x27',
              '<\/script>',
              '',
              '<template>',
              '  <Textarea :resize=&quot;false&quot; />',
              '</template>'
            ]"
            :notes="['높이 고정, 사용자 리사이즈 불가']"
          >
            <div :style="wrap"><Textarea :resize="false" :rows="3" placeholder="높이 고정" /></div>
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'maxLength'"
          title="maxLength — 글자 수 제한 + 카운터 (타이핑해보세요)"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Textarea from \x27m2m-uiux-vue/Textarea\x27',
            '<\/script>',
            '',
            '<template>',
            '  <Textarea :max-length=&quot;200&quot; show-count :rows=&quot;4&quot; />',
            '</template>'
          ]"
          :notes="['showCount prop 으로 우하단 카운터 표시', 'maxLength 도달 시 카운터가 빨간색으로 변경']"
        >
          <div :style="wrap"><Textarea :rows="4" :max-length="200" show-count /></div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'placeholder'"
          title="placeholder — 입력 안내 텍스트"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Textarea from \x27m2m-uiux-vue/Textarea\x27',
            '<\/script>',
            '',
            '<template>',
            '  <Textarea placeholder=&quot;문의 내용을 상세히 입력해주세요.&quot; />',
            '</template>'
          ]"
        >
          <div :style="wrap"><Textarea :rows="3" placeholder="문의 내용을 상세히 입력해주세요." /></div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'onChange'"
          title="v-model 양방향 바인딩"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import Textarea from \x27m2m-uiux-vue/Textarea\x27',
            '',
            'const value = ref(\x27\x27)',
            '<\/script>',
            '',
            '<template>',
            '  <Textarea v-model=&quot;value&quot; placeholder=&quot;타이핑해보세요&quot; />',
            '</template>'
          ]"
        >
          <div class="demo-col" :style="wrap">
            <Textarea v-model="value" :rows="3" placeholder="타이핑해보세요" />
            <span class="demo-hint">{{ value.length }}자</span>
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'classNames'"
          title="classNames — 추가 스타일"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Textarea from \x27m2m-uiux-vue/Textarea\x27',
            '<\/script>',
            '',
            '<template>',
            '  <Textarea class-names=&quot;w-full min-h-[120px]&quot; />',
            '</template>'
          ]"
        >
          <div :style="wrap"><Textarea classNames="demo-hint" :rows="3" placeholder="custom" /></div>
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
