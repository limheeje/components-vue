<script setup lang="ts">
import {defineComponent, h, ref} from 'vue'

import Pagination, {PAGINATION_SIZE} from '~/components/Pagination'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['기본', 'total', 'siblingCount', 'showTotal', 'size', 'disabled', 'classNames']

const Live = defineComponent({
  name: 'PaginationLive',
  props: {
    totalPages: {type: Number, default: undefined},
    total: {type: Number, default: undefined},
    pageSize: {type: Number, default: undefined},
    siblingCount: {type: Number, default: undefined},
    size: {type: String, default: undefined},
    disabled: {type: Boolean, default: false}
  },
  setup(p) {
    const page = ref(1)
    return () =>
      h(Pagination, {
        totalPages: p.totalPages,
        total: p.total,
        pageSize: p.pageSize,
        siblingCount: p.siblingCount,
        size: p.size,
        disabled: p.disabled,
        modelValue: page.value,
        'onUpdate:modelValue': (v: number) => (page.value = v)
      })
  }
})

const page = ref(5)
</script>

<template>
  <div>
    <PageHeader title="Pagination" component="Pagination" desc="— 페이지 이동. 페이지가 많으면 … 로 축약합니다." />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <ComponentSection
          v-if="tab === '기본'"
          title="v-model — 현재 페이지"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import Pagination from \x27m2m-uiux-vue/Pagination\x27',
            '',
            'const page = ref(1)',
            '</script>',
            '',
            '<template>',
            '  <Pagination v-model=&quot;page&quot; :total-pages=&quot;7&quot; />',
            '</template>'
          ]"
        >
          <div class="demo-col">
            <Pagination v-model="page" :total-pages="7" />
            <span class="demo-hint">현재 페이지: {{ page }}</span>
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'total'"
          title="total / pageSize — 페이지 수 계산"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import Pagination from \x27m2m-uiux-vue/Pagination\x27',
            '',
            'const page = ref(1)',
            '</script>',
            '',
            '<template>',
            '  <Pagination v-model=&quot;page&quot; :total=&quot;128&quot; :page-size=&quot;10&quot; />',
            '</template>'
          ]"
          :notes="['13페이지 → 앞뒤 + 현재 주변만 표시, 나머지는 …']"
        >
          <Live :total-pages="13" />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'siblingCount'"
          title="siblingCount — 현재 좌우 페이지 수"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import Pagination from \x27m2m-uiux-vue/Pagination\x27',
            '',
            'const page = ref(1)',
            '</script>',
            '',
            '<template>',
            '  <Pagination v-model=&quot;page&quot; :total-pages=&quot;20&quot; :sibling-count=&quot;2&quot; />',
            '</template>'
          ]"
        >
          <div class="demo-col">
            <Live :total-pages="20" :sibling-count="0" />
            <Live :total-pages="20" :sibling-count="2" />
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'showTotal'"
          title="showTotal"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import Pagination from \x27m2m-uiux-vue/Pagination\x27',
            '',
            'const page = ref(1)',
            '</script>',
            '',
            '<template>',
            '  <Pagination v-model=&quot;page&quot; :total=&quot;128&quot; :page-size=&quot;10&quot; show-total />',
            '  <Pagination v-model=&quot;page&quot; :total=&quot;128&quot; :page-size=&quot;10&quot; :show-total=&quot;(t) => `${t}건`&quot; />',
            '</template>'
          ]"
        >
          <div class="demo-col">
            <Pagination :model-value="1" :total="128" :page-size="10" show-total />
            <Pagination :model-value="1" :total="128" :page-size="10" :show-total="(t: number) => `${t}건 중 1–10`" />
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'size'"
          title="size"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            `import Pagination, {PAGINATION_SIZE} from \x27m2m-uiux-vue/Pagination\x27`,
            '',
            'const page = ref(1)',
            '</script>',
            '',
            '<template>',
            '  <Pagination v-model=&quot;page&quot; :total-pages=&quot;5&quot; :size=&quot;PAGINATION_SIZE[\x27SM\x27]&quot; />',
            '</template>'
          ]"
        >
          <div class="demo-col">
            <Live :total-pages="5" :size="PAGINATION_SIZE['SM']" />
            <Live :total-pages="5" :size="PAGINATION_SIZE['MD']" />
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'disabled'"
          title="disabled"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Pagination from \x27m2m-uiux-vue/Pagination\x27',
            '</script>',
            '',
            '<template>',
            '  <Pagination :model-value=&quot;2&quot; :total-pages=&quot;5&quot; disabled />',
            '</template>'
          ]"
        >
          <Pagination :model-value="2" :total-pages="5" disabled />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'classNames'"
          title="classNames"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Pagination from \x27m2m-uiux-vue/Pagination\x27',
            '</script>',
            '',
            '<template>',
            '  <Pagination :model-value=&quot;1&quot; :total-pages=&quot;3&quot; class-names=&quot;justify-center&quot; />',
            '</template>'
          ]"
        >
          <Pagination :model-value="1" :total-pages="3" class-names="demo-hint" />
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
