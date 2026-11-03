<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref} from 'vue'

import Sidebar from '~/demo/components/Sidebar.vue'
import {provideDemoNav, provideDemoTab} from '~/demo/components/navContext'
import {NAV_GROUPS, PAGES, groupOf} from '~/demo/pages'
import type {PageKey} from '~/demo/pages'

/** PageKey ↔ 해시 슬러그 (`ProgressBar` ↔ `progress-bar`) */
const slugOf = (key: PageKey) => key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
const KEY_BY_SLUG = new Map<string, PageKey>(PAGES.map((p) => [slugOf(p.key), p.key] as [string, PageKey]))

const hashOf = (key: PageKey, tab: string | null) =>
  `#/${key === 'Home' ? '' : slugOf(key)}${tab ? `/${tab.toLowerCase()}` : ''}`

function parseHash(): {key: PageKey; tab: string | null} {
  const raw = window.location.hash.replace(/^#\/?/, '')
  if (!raw) return {key: 'Home', tab: null}
  const [slug, tab] = raw.split('/')
  const key = KEY_BY_SLUG.get(slug ?? '')
  if (!key) return {key: 'Home', tab: null}
  return {key, tab: tab ? tab.charAt(0).toUpperCase() + tab.slice(1) : null}
}

const nav = ref<{key: PageKey; tab: string | null; seq: number}>({...parseHash(), seq: 0})
const dark = ref(false)

provideDemoTab(computed(() => ({tab: nav.value.tab, seq: nav.value.seq})))

const meta = computed(() => PAGES.find((p) => p.key === nav.value.key) ?? PAGES[0])
const group = computed(() => groupOf(nav.value.key))
const isHome = computed(() => nav.value.key === 'Home')

function select(key: PageKey, tab?: string) {
  const next = hashOf(key, tab ?? null)
  if (window.location.hash === next || (next === '#/' && !window.location.hash)) {
    nav.value = {key, tab: tab ?? null, seq: nav.value.seq + 1}
  } else {
    window.location.hash = next
  }
}

provideDemoNav(select as (key: string, tab?: string) => void)

function applyHash() {
  nav.value = {...parseHash(), seq: nav.value.seq + 1}
}

onMounted(() => {
  window.addEventListener('hashchange', applyHash)
  if (!window.location.hash) window.history.replaceState(null, '', hashOf(nav.value.key, nav.value.tab))
})
onBeforeUnmount(() => window.removeEventListener('hashchange', applyHash))

function toggleTheme() {
  dark.value = !dark.value
  document.documentElement.dataset.theme = dark.value ? 'dark' : 'light'
}
</script>

<template>
  <div class="demo-shell">
    <Sidebar :groups="NAV_GROUPS" :current="nav.key" @select="select" @home="select('Home')" />

    <div class="demo-main">
      <div class="demo-topbar">
        <div class="demo-topbar__crumbs">
          <span v-if="isHome" class="demo-topbar__current">Home</span>
          <template v-else>
            <span
              class="demo-topbar__group"
              :style="{color: group.color, background: `${group.color}22`, border: `1px solid ${group.color}44`}"
            >
              {{ group.label }}
            </span>
            <span class="demo-topbar__sep">/</span>
            <span class="demo-topbar__current">{{ meta.key }}</span>
          </template>
        </div>

        <div class="demo-topbar__actions">
          <a
            href="https://www.npmjs.com/package/m2m-uiux-vue"
            target="_blank"
            class="demo-topbar__btn2"
            style="text-decoration: none"
          >
            M2M 컴포넌트 패키지 다운로드
          </a>
          <button type="button" class="demo-topbar__btn" @click="toggleTheme">
            {{ dark ? '☀ 라이트' : '☾ 다크' }}
          </button>
          <span class="demo-topbar__badge">m2m-uiux v0.0.1</span>
        </div>
      </div>

      <div class="demo-content">
        <component :is="meta.Page" :key="nav.key" />
      </div>
    </div>
  </div>
</template>
