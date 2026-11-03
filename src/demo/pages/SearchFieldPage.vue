<script setup lang="ts">
import {ref} from 'vue'

import SearchField, {SEARCH_FIELD_SIZE} from '~/components/SearchField'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['기본', 'onSearch', 'size', 'clearable', 'loading', 'disabled', 'classNames']
const q = ref('')
const last = ref('')
</script>

<template>
  <div>
    <PageHeader
      title="SearchField"
      component="SearchField"
      desc="— 검색 전용 입력. 좌측 돋보기 버튼 + 우측 지우기(X) 내장."
    />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <ComponentSection
          v-if="tab === '기본'"
          title="v-model (제어)"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import SearchField from \x27m2m-uiux-vue/SearchField\x27',
            '',
            'const q = ref(\x27\x27)',
            '</script>',
            '',
            '<template>',
            '  <SearchField v-model=&quot;q&quot; />',
            '</template>'
          ]"
        >
          <div class="demo-col">
            <SearchField v-model="q" />
            <span class="demo-hint">입력값: {{ q || '(빈 값)' }}</span>
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'onSearch'"
          title="onSearch — Enter / 돋보기 버튼"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import SearchField from \x27m2m-uiux-vue/SearchField\x27',
            '',
            'const q = ref(\x27\x27)',
            'function runSearch(value: string) {',
            '  console.log(\x27검색:\x27, value)',
            '}',
            '</script>',
            '',
            '<template>',
            '  <SearchField v-model=&quot;q&quot; @search=&quot;runSearch&quot; />',
            '</template>'
          ]"
        >
          <div class="demo-col">
            <SearchField placeholder="검색 후 Enter" @search="last = $event" />
            <span class="demo-hint">마지막 검색: {{ last || '(없음)' }}</span>
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'size'"
          title="size"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import SearchField, {SEARCH_FIELD_SIZE} from \x27m2m-uiux-vue/SearchField\x27',
            '</script>',
            '',
            '<template>',
            '  <SearchField :size=&quot;SEARCH_FIELD_SIZE[\x27LG\x27]&quot; />',
            '</template>'
          ]"
        >
          <div class="demo-col">
            <SearchField :size="SEARCH_FIELD_SIZE['SM']" placeholder="sm" />
            <SearchField :size="SEARCH_FIELD_SIZE['MD']" placeholder="md" />
            <SearchField :size="SEARCH_FIELD_SIZE['LG']" placeholder="lg" />
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'clearable'"
          title="clearable"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import SearchField from \x27m2m-uiux-vue/SearchField\x27',
            '',
            'const q = ref(\x27검색어\x27)',
            '</script>',
            '',
            '<template>',
            '  <SearchField v-model=&quot;q&quot; clearable @clear=&quot;q = \x27\x27&quot; />',
            '</template>'
          ]"
        >
          <div class="demo-col">
            <SearchField default-value="지우기 버튼" />
            <SearchField default-value="clearable=false" :clearable="false" />
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'loading'"
          title="loading — 돋보기 자리에 스피너"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import SearchField from \x27m2m-uiux-vue/SearchField\x27',
            '',
            'const isSearching = ref(true)',
            '</script>',
            '',
            '<template>',
            '  <SearchField :loading=&quot;isSearching&quot; />',
            '</template>'
          ]"
        >
          <SearchField loading default-value="검색 중…" />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'disabled'"
          title="disabled"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import SearchField from \x27m2m-uiux-vue/SearchField\x27',
            '</script>',
            '',
            '<template>',
            '  <SearchField disabled />',
            '</template>'
          ]"
        >
          <SearchField disabled default-value="비활성" />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'classNames'"
          title="classNames"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import SearchField from \x27m2m-uiux-vue/SearchField\x27',
            '</script>',
            '',
            '<template>',
            '  <SearchField class-names=&quot;w-full&quot; />',
            '</template>'
          ]"
        >
          <SearchField classNames="demo-hint" placeholder="커스텀" />
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
