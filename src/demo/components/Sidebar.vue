<script setup lang="ts">
import {computed, ref} from 'vue'

import Icon from '~/components/Icon'
import NavIcon from '~/demo/components/NavIcon.vue'
import type {NavGroup, PageKey} from '~/demo/pages'

const props = defineProps<{
  groups: NavGroup[]
  current: PageKey
}>()

const emit = defineEmits<{select: [key: PageKey, tab?: string]; home: []}>()

const collapsed = ref(false)
const query = ref('')
const expanded = ref<string[]>([])

const q = computed(() => query.value.trim().toLowerCase())

function toggleExpand(label: string) {
  expanded.value = expanded.value.includes(label)
    ? expanded.value.filter((l) => l !== label)
    : [...expanded.value, label]
}

const filtered = computed<NavGroup[]>(() => {
  if (!q.value) return props.groups
  return props.groups
    .map((g) => ({
      ...g,
      items: g.items.filter(
        (it) =>
          it.label.toLowerCase().includes(q.value) || it.children?.some((c) => c.label.toLowerCase().includes(q.value))
      )
    }))
    .filter((g) => g.items.length > 0)
})

function isOpen(label: string, children: {key: PageKey}[]) {
  return expanded.value.includes(label) || Boolean(q.value) || children.some((c) => c.key === props.current)
}
</script>

<template>
  <aside class="demo-sidebar" :data-collapsed="collapsed || undefined">
    <div class="demo-sidebar__brand">
      <button
        type="button"
        class="demo-sidebar__brand-btn"
        :aria-current="current === 'Home'"
        aria-label="홈으로"
        @click="emit('home')"
      >
        <span class="demo-sidebar__logo">M2</span>
        <span v-if="!collapsed">
          <span class="demo-sidebar__title">m2m-uiux-vue</span>
          <br />
          <span class="demo-sidebar__subtitle">Component Docs</span>
        </span>
      </button>
      <button
        v-if="!collapsed"
        type="button"
        class="demo-sidebar__collapse"
        aria-label="사이드바 접기"
        title="사이드바 접기"
        @click="collapsed = true"
      >
        <NavIcon name="panel-left-close" :size="16" />
      </button>
    </div>

    <div v-if="!collapsed" class="demo-sidebar__search">
      <Icon name="search" :size="13" />
      <input v-model="query" type="text" placeholder="컴포넌트 검색..." />
    </div>

    <nav class="demo-sidebar__nav">
      <div v-for="group in filtered" :key="group.label">
        <div v-if="!collapsed" class="demo-sidebar__group-label">
          <span class="demo-sidebar__dot" :style="{background: group.color}" />
          {{ group.label }}
        </div>
        <div v-else class="demo-sidebar__group-rule" />

        <template v-for="item in group.items" :key="item.label">
          <div v-if="item.children && !collapsed">
            <button
              type="button"
              class="demo-sidebar__link demo-sidebar__link--parent"
              :aria-current="item.key === current"
              @click="toggleExpand(item.label)"
            >
              <span class="demo-sidebar__link-icon"><NavIcon :name="item.icon ?? ''" /></span>
              <span class="demo-sidebar__link-label">{{ item.label }}</span>
              <Icon name="chevron-down" :size="12" :rotate="isOpen(item.label, item.children) ? 0 : -90" />
            </button>
            <div v-if="isOpen(item.label, item.children)" class="demo-sidebar__sub">
              <button
                v-for="child in item.children"
                :key="child.label"
                type="button"
                class="demo-sidebar__sublink"
                @click="emit('select', child.key, child.tab)"
              >
                {{ child.label }}
              </button>
            </div>
          </div>

          <button
            v-else-if="item.key ?? item.children?.[0]?.key"
            type="button"
            class="demo-sidebar__link"
            :aria-current="(item.key ?? item.children?.[0]?.key) === current"
            :title="collapsed ? item.label : undefined"
            @click="emit('select', (item.key ?? item.children![0].key)!, item.tab)"
          >
            <span class="demo-sidebar__link-icon"><NavIcon :name="item.icon ?? ''" /></span>
            <span v-if="!collapsed" class="demo-sidebar__link-label">{{ item.label }}</span>
          </button>
        </template>
      </div>
    </nav>

    <div class="demo-sidebar__foot">
      <span v-if="!collapsed" class="demo-sidebar__foot-label">v0.0.1 · Vue port</span>
      <button
        type="button"
        class="demo-sidebar__foot-toggle"
        :aria-label="collapsed ? '사이드바 펼치기' : '사이드바 접기'"
        :title="collapsed ? '사이드바 펼치기' : '사이드바 접기'"
        @click="collapsed = !collapsed"
      >
        <NavIcon :name="collapsed ? 'panel-left-open' : 'panel-left-close'" :size="16" />
      </button>
    </div>
  </aside>
</template>
